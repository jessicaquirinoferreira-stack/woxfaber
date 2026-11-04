import { Product, Lead, SiteConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-krs315a',
    slug: 'krs315a',
    name: 'KRS315A',
    tagline: 'Caixa Ativa 2 Vias 15" — 3000 Watts de Pico',
    category: 'caixas-ativas',
    categoryLabel: 'Caixa Ativa Profissional',
    type: 'Caixa Ativa de 2 vias de 15" (15" 2-way Active Speaker)',
    power: '3000 W (Pico)',
    maxSpl: '132 dB SPL',
    freqResponse: '55 Hz ~ 18 kHz (±3dB) / 45 Hz ~ 20 kHz (-10dB)',
    ampClass: 'Classe D de Alta Eficiência',
    lfTransducer: 'Woofer de 15" / Bobina de 75 mm (3") / 4 Ω',
    hfTransducer: 'Driver de Compressão de 44 mm / Garganta de 1"',
    crossover: '2.4 kHz',
    coverage: '90° × 60°',
    dspFeatures: 'Tela LCD Azul, 4 modos operacionais, EQ de 3 bandas, Low Cut, Delay e Volume',
    dimensions: '510 × 780 × 440 mm',
    weight: '24,5 kg',
    voltage: 'AC 115V / 230V – 50/60 Hz',
    inputOutput: '2x Entradas Combo (COMB IN) + Saída XLR Balanceada (Output)',
    images: [
      'https://i.postimg.cc/jjmTwm06/Whats-App-Image-2026-11-04-at-11-29-39.jpg',
      'https://i.postimg.cc/XvmWGmSD/Whats-App-Image-2026-11-04-at-11-29-40.jpg',
      'https://i.postimg.cc/wBZzyZ84/Whats-App-Image-2026-11-04-at-11-29-40-(1).jpg',
      'https://i.postimg.cc/0NFvMFRB/Whats-App-Image-2026-11-04-at-11-29-40-(2).jpg',
      'https://i.postimg.cc/nLgxjgbY/Whats-App-Image-2026-11-04-at-11-29-41-(2).jpg',
    ],
    manualUrl: '/assets/aistudio/Manual_KRS315A_WOX_FABER_337d8a70.pdf',
    manualTitle: 'Manual do Usuário KRS315A (PDF Oficial)',
    description:
      'A WOX KRS315A representa o ápice da engenharia acústica da linha premium WOX. Projetada com módulo de amplificação Classe D de 3000 Watts de pico acoplado a um transdutor de graves de 15 polegadas com bobina de 75 mm e driver de compressão de 44 mm com corneta 90°×60°. Pressão sonora máxima de 132 dB SPL sem distorção mecânica, corte cirúrgico e DSP integrado com display LCD azul.',
    highlights: [
      '3000 Watts de Pico em circuito de amplificação Classe D ultra-eficiente',
      '132 dB SPL Máximo com controle dinâmico inteligente e limiter ativo',
      'DSP Integrado com tela LCD azul, 4 curvas de resposta e EQ de 3 bandas',
      'Troca Modular em Bloco: manutenção plug-and-play do módulo em minutos',
      'Corneta de dispersão constante 90° × 60° com driver de compressão de 44 mm',
    ],
    applications: [
      {
        title: 'Música ao Vivo e Palcos',
        description:
          'Corta com precisão qualquer mixagem pesada ao vivo. Desempenho imbatível tanto como sistema Main PA de frente quanto como monitor de palco de alto rendimento.',
      },
      {
        title: 'Igrejas, Catedrais e Templos',
        description:
          'Inteligibilidade cirúrgica da palavra falada com crossover alinhado em 2.4 kHz. Clareza cristalina para oradores e peso controlado para bandas de louvor.',
      },
      {
        title: 'Instalações Fixas e Espaços Premium',
        description:
          'Projetada para casas de show, teatros e espaços de eventos que exigem pressão sonora de estúdio e gabinete com acabamento estrutural ultra-resistente.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'prod-krs212sb',
    slug: 'krs212sb',
    name: 'KRS212SB',
    tagline: 'Subwoofer Ativo 1x12" — 1000W com DSP Digital',
    category: 'subwoofers',
    categoryLabel: 'Subwoofer Ativo Profissional',
    type: 'Subwoofer Ativo 1x12" de Alta Performance',
    power: '1000 W',
    maxSpl: '127 dB SPL',
    freqResponse: '40 Hz – 150 Hz',
    ampClass: 'Classe D de Alta Eficiência',
    lfTransducer: 'Woofer de 12" / Bobina de 75 mm (3") / 8 Ω',
    dspFeatures: 'Display LCD Azul, 4 modos de operação, filtro Low-Pass (LPF), delay programável e volume digital',
    dimensions: '495 × 575 × 495 mm',
    weight: '22 kg',
    voltage: 'AC 115V / 230V – 50/60 Hz',
    inputOutput: '2x Entradas Combo (XLR/P10) / Saídas XLR Balanceadas',
    images: [
      'https://i.postimg.cc/fbpstpn8/Whats-App-Image-2026-11-04-at-11-29-40-(3).jpg',
      'https://i.postimg.cc/vmkygkFW/Whats-App-Image-2026-11-04-at-11-29-41.jpg',
      'https://i.postimg.cc/mrJ4zJfy/Whats-App-Image-2026-11-04-at-11-29-41-(1).jpg',
      'https://i.postimg.cc/nLgxjgbY/Whats-App-Image-2026-11-04-at-11-29-41-(2).jpg',
    ],
    manualUrl: '/assets/aistudio/Manual_KRS212SB_WOX_FABER_de319af8.pdf',
    manualTitle: 'Manual do Usuário KRS212SB (PDF Oficial)',
    description:
      'O WOX FABER KRS212SB é um subwoofer ativo concebido para entregar graves de ataque ultrarrápido (punch cirúrgico), definição de contorno e resposta física que desce até 40 Hz. Equipado com transdutor de 12 polegadas com bobina de 75 mm (3") e amplificação Classe D de 1000 Watts com acoplamento acústico de fase perfeito para a caixa KRS315A.',
    highlights: [
      '1000 Watts contínuos Classe D com acoplamento acústico para caixas KAIROS',
      '127 dB SPL com resposta estendida de 40 Hz a 150 Hz sem perda de transientes',
      'DSP com tela LCD azul, filtro LPF ajustável milimétrico e delay de fase integrado',
      'Saídas XLR com roteamento estéreo e direcionamento em linha direta',
      'Gabinete ultra-rígido com pontos de empilhamento seguro e flange para pedestal',
    ],
    applications: [
      {
        title: 'Sinergia com KRS315A em 3 Vias',
        description:
          'Utilizando a função Low-Cut no DSP da KRS315A, forma-se um sistema tri-amplificado de altíssimo rendimento, aliviando o falante de 15" e dobrando o headroom.',
      },
      {
        title: 'Graves Rápidos e Ataque Preciso',
        description:
          'Ideal para bumbo, contrabaixo rápido e música ao vivo onde subgraves lentos geram embolamento acústico. Definição milimétrica de transiente.',
      },
      {
        title: 'Acoplamento de Fronteira e Meio Espaço (Half-Space)',
        description:
          'Otimizado para reforço acústico próximo ao piso do palco, gerando ganho natural de pressão e controle de dispersão.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'prod-snc400',
    slug: 'snc400-dist',
    name: 'SNC-400 DIST',
    tagline: 'Distribuidor Ativo de Antenas de RF 470–960 MHz',
    category: 'processadores-rf',
    categoryLabel: 'Processamento & Distribuição de RF',
    type: 'Distribuidor e Splitter de RF Ativo de Baixo Ruído',
    power: 'Fonte Interna Bivolt Automática (DC Out para até 4 receptores)',
    maxSpl: 'Isolação entre canais > 28 dB / Ganho +12 dB ajustável',
    freqResponse: '470 MHz – 960 MHz (Banda Larga UHF)',
    ampClass: 'Amplificadores RF GaAs FET de Ultra-Baixo Ruído (NF < 2.0 dB)',
    lfTransducer: 'Conectores BNC 50 Ω de padrão militar com blindagem banhada a ouro',
    dspFeatures: 'Display OLED frontal com medidor de potência de RF por canal e chave seletora de ganho',
    dimensions: '483 × 44 × 260 mm (Padrão Rack 19" 1U)',
    weight: '3,8 kg',
    voltage: 'AC 90V – 240V 50/60 Hz',
    inputOutput: '2x Entradas BNC Cascata A/B + 8x Saídas BNC para receptores + 4x Saídas 12V DC',
    images: [
      'https://i.postimg.cc/jjmTwm06/Whats-App-Image-2026-11-04-at-11-29-39.jpg',
      'https://i.postimg.cc/XvmWGmSD/Whats-App-Image-2026-11-04-at-11-29-40.jpg',
    ],
    manualUrl: '/assets/aistudio/Manual_KRS315A_WOX_FABER_337d8a70.pdf',
    manualTitle: 'Guia de Instalação e Especificações SNC-400 (PDF)',
    description:
      'Solução definitiva para eliminação de quedas de sinal e saturação de intermodulação em sistemas de microfonia sem fio multicanal. Permite alimentar até 4 receptores duplos usando apenas 2 antenas externas tipo barbatana de tubarão.',
    highlights: [
      'Distribuição limpa de 470 a 960 MHz para até 8 vias sem perda de sensibilidade',
      'Amplificação integrada com compensação de perdas de cabo coaxial de até 50 metros',
      'Alimentação integrada DC para os receptores de microfone, limpando o fundo do rack',
      'Chassi metálico com blindagem eletromagnética total contra ruído de telões LED',
    ],
    applications: [
      {
        title: 'Grandes Templos com Múltiplos Pregadores e Vocais',
        description: 'Mantém 8 a 16 microfones operando sem nenhuma queda de sinal mesmo com fiéis e estrutura metálica no ambiente.',
      },
      {
        title: 'Turnês e Festivais',
        description: 'Imune à poluição de radiofrequência e harmônicos de painéis de LED de palco.',
      },
    ],
    isFeatured: false,
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Eng. Ricardo Vasconcellos',
    email: 'engenharia@sonorizacaonacional.com.br',
    phone: '',
    venueType: 'Locadora de Grande Porte / Festivais',
    message: 'Precisamos cotar um lote de 8 unidades da KRS315A e 4 subwoofers KRS212SB para turnê regional de teatro e música.',
    productId: 'prod-krs315a',
    productName: 'KRS315A (3000W)',
    status: 'proposta_enviada',
    createdAt: '2026-11-03T14:22:00Z',
  },
  {
    id: 'lead-102',
    name: 'Pastor Marcelo Mendonça',
    email: 'audio@catedralesperanca.org.br',
    phone: '',
    venueType: 'Templo / Igreja (Capacidade 1.800 pessoas)',
    message: 'Nossa nave tem muito eco nos agudos. Gostaria de consultoria técnica sobre o alinhamento de delay e o DSP da KRS315A para voz e banda.',
    productId: 'prod-krs315a',
    productName: 'KRS315A (3000W)',
    status: 'novo',
    createdAt: '2026-11-04T09:15:00Z',
  },
  {
    id: 'lead-103',
    name: 'Fabiano Albuquerque',
    email: 'diretoria@espacoculturaeventos.com',
    phone: '(31) 97320-1188',
    venueType: 'Casa de Shows e Eventos Corporativos',
    message: 'Interesse imediato no par KRS315A + KRS212SB para substituição de sistema importado com custo elevado de manutenção.',
    productId: 'prod-krs212sb',
    productName: 'KRS212SB (1000W)',
    status: 'em_atendimento',
    createdAt: '2026-11-04T11:40:00Z',
  },
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  heroTitle: 'O SOM NÃO É APENAS OUVIDO. ELE É DOMINADO.',
  heroSubtitle:
    'Engenharia acústica precisa, pressão sonora extrema e tecnologia construída para quem vive de palco e grandes instalações.',
  heroOriginText:
    'Nascida na bancada de desenvolvimento e forjada em mais de duas décadas de prática rigorosa de áudio de turnê, a WOX FABER projeta sistemas acústicos de altíssima eficiência mecânica e pureza eletroacústica. Sem concessões. Sem atalhos.',
  contactWhatsapp: '',
  contactPhone: '',
  contactEmail: 'woxfaberbrasil@gmail.com',
  emergencyTechSupport: 'Atendimento Técnico Exclusivo via E-mail (woxfaberbrasil@gmail.com)',
  announcementText: '',
  showAnnouncement: false,
};
