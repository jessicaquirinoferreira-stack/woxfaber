export type ProductCategory =
  | 'all'
  | 'caixas-ativas'
  | 'subwoofers'
  | 'amplificadores-rf'
  | 'processadores-rf'
  | 'microfones';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  categoryLabel: string;
  type: string;
  power: string; // e.g. "3000 W (Pico)"
  maxSpl: string; // e.g. "132 dB SPL"
  freqResponse: string; // e.g. "55 Hz ~ 18 kHz (±3dB) / 45 Hz ~ 20 kHz (-10dB)"
  ampClass: string; // e.g. "Classe D de Alta Eficiência"
  lfTransducer: string; // e.g. "Woofer de 15\" / Bobina de 75 mm (3\") / 4 Ω"
  hfTransducer?: string; // e.g. "Driver de Compressão de 44 mm / Garganta de 1\""
  crossover?: string; // e.g. "2.4 kHz"
  coverage?: string; // e.g. "90° × 60°"
  dspFeatures: string; // e.g. "Tela LCD Azul, 4 modos operacionais, EQ de 3 bandas, Low Cut, Delay e Volume"
  dimensions: string; // e.g. "510 × 780 × 440 mm"
  weight: string; // e.g. "24,5 kg"
  voltage: string; // e.g. "AC 115V / 230V – 50/60 Hz"
  inputOutput: string; // e.g. "2x Entradas Combo + Saída XLR Balanceada"
  images: string[];
  videos?: string[];
  manualUrl: string;
  manualTitle: string;
  description: string;
  highlights: string[];
  applications: {
    title: string;
    description: string;
  }[];
  isFeatured?: boolean;
  updatedAt?: unknown;
}

export type LeadStatus = 'novo' | 'em_atendimento' | 'proposta_enviada' | 'fechado';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  venueType: string;
  message: string;
  productId?: string;
  productName?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroOriginText: string;
  contactWhatsapp: string;
  contactPhone: string;
  contactEmail: string;
  emergencyTechSupport: string;
  announcementText?: string;
  showAnnouncement: boolean;
}
