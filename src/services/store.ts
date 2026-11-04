import { Product, Lead, SiteConfig, LeadStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_LEADS, INITIAL_SITE_CONFIG } from '../data/initialData';

const PRODUCTS_KEY = 'wox_faber_products_v2';
const LEADS_KEY = 'wox_faber_leads_v3';
const CONFIG_KEY = 'wox_faber_config_v5';
const AUTH_KEY = 'wox_faber_auth_v2';

export class AudioStore {
  // Products
  static getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (stored) {
        return JSON.parse(stored);
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
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return product;
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  static resetProducts(): void {
    localStorage.removeItem(PRODUCTS_KEY);
  }

  // Leads
  static getLeads(): Lead[] {
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
      ...leadData,
      id: 'lead-' + Date.now(),
      status: 'novo',
      createdAt: new Date().toISOString(),
    };
    const updated = [newLead, ...leads];
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    return newLead;
  }

  static updateLeadStatus(id: string, status: LeadStatus): void {
    const leads = this.getLeads().map(l => (l.id === id ? { ...l, status } : l));
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  static deleteLead(id: string): void {
    const leads = this.getLeads().filter(l => l.id !== id);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  // Site Config
  static getConfig(): SiteConfig {
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
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  // Admin Auth
  static isAuthenticated(): boolean {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  }

  static login(email: string, pass: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@x.com' && pass === 'admin4321') {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  static logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }

  // CSV Export for Leads
  static exportLeadsCsv(): string {
    const leads = this.getLeads();
    const headers = ['ID', 'Data/Hora', 'Nome', 'Email', 'Telefone', 'Tipo de Local', 'Produto de Interesse', 'Status', 'Mensagem'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString('pt-BR')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.venueType.replace(/"/g, '""')}"`,
      `"${(l.productName || 'Geral').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);
    return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  }
}
