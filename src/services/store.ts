import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { Product, Lead, SiteConfig, LeadStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_LEADS, INITIAL_SITE_CONFIG } from '../data/initialData';

const PRODUCTS_KEY = 'wox_faber_products_v2';
const LEADS_KEY = 'wox_faber_leads_v3';
const CONFIG_KEY = 'wox_faber_config_v5';
const AUTH_KEY = 'wox_faber_auth_v2';

let memoryProducts: Product[] | null = null;
let memoryLeads: Lead[] | null = null;
let memoryConfig: SiteConfig | null = null;
let hasSeededProducts = false;
let hasSeededLeads = false;
let hasSeededConfig = false;

export class AudioStore {
  // ==========================================
  // REAL-TIME FIREBASE FIRESTORE SUBSCRIPTIONS
  // ==========================================

  static subscribeProducts(callback: (products: Product[]) => void): Unsubscribe {
    const colRef = collection(db, 'products');
    return onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty && !hasSeededProducts) {
          hasSeededProducts = true;
          const initial = this.getProducts();
          initial.forEach(prod => {
            setDoc(doc(db, 'products', prod.id), prod).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `products/${prod.id}`)
            );
          });
          memoryProducts = initial;
          callback(initial);
          return;
        }

        const list: Product[] = [];
        snapshot.forEach(docSnap => {
          list.push(docSnap.data() as Product);
        });

        // Sort so KRS315A, KRS212SB, SNC-400 stay in canonical order first
        const orderMap: Record<string, number> = {
          krs315a: 1,
          krs212sb: 2,
          'snc-400': 3,
        };
        list.sort((a, b) => (orderMap[a.id] || 99) - (orderMap[b.id] || 99));

        if (list.length > 0) {
          memoryProducts = list;
          try {
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
          } catch {
            // ignore
          }
          callback(list);
        } else {
          callback(this.getProducts());
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );
  }

  static subscribeConfig(callback: (config: SiteConfig) => void): Unsubscribe {
    const docRef = doc(db, 'siteConfig', 'main');
    return onSnapshot(
      docRef,
      docSnap => {
        if (!docSnap.exists() && !hasSeededConfig) {
          hasSeededConfig = true;
          const initial = this.getConfig();
          setDoc(docRef, initial).catch(err =>
            handleFirestoreError(err, OperationType.WRITE, 'siteConfig/main')
          );
          memoryConfig = initial;
          callback(initial);
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data() as SiteConfig;
          memoryConfig = data;
          try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(data));
          } catch {
            // ignore
          }
          callback(data);
        } else {
          callback(this.getConfig());
        }
      },
      error => {
        handleFirestoreError(error, OperationType.GET, 'siteConfig/main');
      }
    );
  }

  static subscribeLeads(callback: (leads: Lead[]) => void): Unsubscribe {
    const colRef = collection(db, 'leads');
    return onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty && !hasSeededLeads) {
          hasSeededLeads = true;
          const initial = this.getLeads();
          initial.forEach(lead => {
            setDoc(doc(db, 'leads', lead.id), lead).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `leads/${lead.id}`)
            );
          });
          memoryLeads = initial;
          callback(initial);
          return;
        }

        const list: Lead[] = [];
        snapshot.forEach(docSnap => {
          list.push(docSnap.data() as Lead);
        });

        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        memoryLeads = list;
        try {
          localStorage.setItem(LEADS_KEY, JSON.stringify(list));
        } catch {
          // ignore
        }
        callback(list);
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'leads');
      }
    );
  }

  // ==========================================
  // PRODUCTS (SYNC CACHE + REAL-TIME FIRESTORE)
  // ==========================================

  static getProducts(): Product[] {
    if (memoryProducts && memoryProducts.length > 0) {
      return memoryProducts;
    }
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  }

  static getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find(p => p.slug === slug || p.id === slug);
  }

  static saveProduct(product: Product): Product {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...products];
      updated[index] = product;
    } else {
      updated = [product, ...products];
    }
    memoryProducts = updated;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Persist in real-time Firestore
    setDoc(doc(db, 'products', product.id), product).catch(err =>
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`)
    );

    return product;
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    memoryProducts = products;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }

    deleteDoc(doc(db, 'products', id)).catch(err =>
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`)
    );
  }

  static resetProducts(): void {
    memoryProducts = null;
    try {
      localStorage.removeItem(PRODUCTS_KEY);
    } catch {
      // ignore
    }
  }

  // ==========================================
  // LEADS (SYNC CACHE + REAL-TIME FIRESTORE)
  // ==========================================

  static getLeads(): Lead[] {
    if (memoryLeads) {
      return memoryLeads;
    }
    try {
      const stored = localStorage.getItem(LEADS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_LEADS;
  }

  static addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || '',
      venueType: leadData.venueType,
      message: leadData.message,
      productName: leadData.productName || 'Consultoria Geral',
      id: 'lead-' + Date.now(),
      status: 'novo',
      createdAt: new Date().toISOString(),
    };
    const updated = [newLead, ...leads];
    memoryLeads = updated;
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setDoc(doc(db, 'leads', newLead.id), newLead).catch(err =>
      handleFirestoreError(err, OperationType.CREATE, `leads/${newLead.id}`)
    );

    return newLead;
  }

  static updateLeadStatus(id: string, status: LeadStatus): void {
    const leads = this.getLeads().map(l => (l.id === id ? { ...l, status } : l));
    memoryLeads = leads;
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore
    }

    updateDoc(doc(db, 'leads', id), { status }).catch(err =>
      handleFirestoreError(err, OperationType.UPDATE, `leads/${id}`)
    );
  }

  static deleteLead(id: string): void {
    const leads = this.getLeads().filter(l => l.id !== id);
    memoryLeads = leads;
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore
    }

    deleteDoc(doc(db, 'leads', id)).catch(err =>
      handleFirestoreError(err, OperationType.DELETE, `leads/${id}`)
    );
  }

  // ==========================================
  // SITE CONFIG (SYNC CACHE + REAL-TIME FIRESTORE)
  // ==========================================

  static getConfig(): SiteConfig {
    if (memoryConfig) {
      return memoryConfig;
    }
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_SITE_CONFIG;
  }

  static saveConfig(config: SiteConfig): void {
    memoryConfig = config;
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }

    setDoc(doc(db, 'siteConfig', 'main'), config).catch(err =>
      handleFirestoreError(err, OperationType.WRITE, 'siteConfig/main')
    );
  }

  // ==========================================
  // ADMIN AUTH (CREDENTIALS + FIREBASE GOOGLE AUTH)
  // ==========================================

  static isAuthenticated(): boolean {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true' || Boolean(auth.currentUser);
    } catch {
      return false;
    }
  }

  static login(email: string, pass: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@x.com' && pass === 'admin4321') {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  static async loginWithGoogle(): Promise<boolean> {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  static logout(): void {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
    signOut(auth).catch(() => {
      // ignore
    });
  }

  // CSV Export for Leads
  static exportLeadsCsv(): string {
    const leads = this.getLeads();
    const headers = [
      'ID',
      'Data/Hora',
      'Nome',
      'Email',
      'Telefone',
      'Tipo de Local',
      'Produto de Interesse',
      'Status',
      'Mensagem',
    ];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString('pt-BR')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.venueType.replace(/"/g, '""')}"`,
      `"${(l.productName || 'Geral').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);
    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  }
}
