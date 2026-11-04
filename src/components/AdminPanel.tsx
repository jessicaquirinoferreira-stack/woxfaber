import React, { useState, useEffect } from 'react';
import { Product, Lead, SiteConfig, LeadStatus } from '../types';
import { AudioStore } from '../services/store';
import {
  uploadAttachmentToVercelBlob,
  getStoredBlobToken,
  setStoredBlobToken,
} from '../services/blobService';
import {
  LogOut,
  Users,
  Box,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Download,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  Flame,
  Search,
  Upload,
  Film,
  FileText,
  Database,
  Cloud,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  onConfigUpdated: () => void;
  onPreviewLandingPage: (product: Product) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onProductUpdated,
  onConfigUpdated,
  onPreviewLandingPage,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: leads | products | config | lp-generator
  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'config' | 'lp-generator'>('leads');

  // Real-time Leads, Products, and Config from Firebase Firestore
  const [leads, setLeads] = useState<Lead[]>(() => AudioStore.getLeads());
  const [products, setProducts] = useState<Product[]>(() => AudioStore.getProducts());
  const [config, setConfig] = useState<SiteConfig>(() => AudioStore.getConfig());

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Product edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoList, setNewPhotoList] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoList, setNewVideoList] = useState<string[]>([]);

  // Vercel Blob Upload state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingManual, setIsUploadingManual] = useState(false);
  const [blobToken, setBlobToken] = useState<string>(() => getStoredBlobToken());

  // Feedback notification banner
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsAuthenticated(AudioStore.isAuthenticated());

    // Subscribe to real-time Firestore collections
    const unsubLeads = AudioStore.subscribeLeads(updatedLeads => {
      setLeads(updatedLeads);
    });
    const unsubProducts = AudioStore.subscribeProducts(updatedProducts => {
      setProducts(updatedProducts);
    });
    const unsubConfig = AudioStore.subscribeConfig(updatedConfig => {
      setConfig(updatedConfig);
    });

    return () => {
      unsubLeads();
      unsubProducts();
      unsubConfig();
    };
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AudioStore.login(email, password)) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais incorretas. Verifique seu e-mail e chave de acesso.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const ok = await AudioStore.loginWithGoogle();
      if (ok) {
        setIsAuthenticated(true);
        setLoginError('');
      }
    } catch {
      setLoginError('Não foi possível autenticar via Google.');
    }
  };

  const handleLogout = () => {
    AudioStore.logout();
    setIsAuthenticated(false);
  };

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    AudioStore.updateLeadStatus(id, status);
    showNotification('Status do lead sincronizado em tempo real no Firebase Firestore.');
  };

  const handleDeleteLead = (id: string) => {
    AudioStore.deleteLead(id);
    showNotification('Lead removido em tempo real do Firebase Firestore.');
  };

  const handleExportCsv = () => {
    const csvContent = AudioStore.exportLeadsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_wox_faber_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Arquivo CSV gerado e exportado com sucesso.');
  };

  // Product CRUD
  const handleStartCreateProduct = () => {
    setIsCreatingProduct(true);
    setEditingProduct({
      id: 'prod-' + Date.now(),
      slug: 'kairos-' + Date.now(),
      name: '',
      tagline: '',
      category: 'caixas-ativas',
      categoryLabel: 'Caixa Ativa Profissional',
      type: 'Caixa Ativa de Alta Performance',
      power: '2000 W (Pico)',
      maxSpl: '130 dB SPL',
      freqResponse: '50 Hz ~ 18 kHz',
      ampClass: 'Classe D de Alta Eficiência',
      lfTransducer: 'Woofer de 15" / Bobina de 75 mm (3")',
      dspFeatures: 'Display LCD Azul, 4 modos operacionais, EQ de 3 bandas',
      dimensions: '500 × 750 × 440 mm',
      weight: '23,5 kg',
      voltage: 'AC 115V / 230V – 50/60 Hz',
      inputOutput: '2x Entradas Combo (XLR/P10) + Saída XLR Balanceada',
      images: [
        'https://i.postimg.cc/jjmTwm06/Whats-App-Image-2026-11-04-at-11-29-39.jpg',
      ],
      videos: [],
      manualUrl: '/assets/aistudio/Manual_KRS315A_WOX_FABER_337d8a70.pdf',
      manualTitle: 'Manual do Usuário Oficial (PDF)',
      description: 'Sistema acústico de engenharia refinada para alta pressão sonora contínua.',
      highlights: [
        'Amplificação Classe D com proteção térmica avançada',
        'Troca Modular em Bloco para manutenção rápida em campo',
      ],
      applications: [
        { title: 'Sonorização ao Vivo', description: 'Cobertura homogênea sem reflexões laterais.' },
      ],
    });
    setNewPhotoList([
      'https://i.postimg.cc/jjmTwm06/Whats-App-Image-2026-11-04-at-11-29-39.jpg',
    ]);
    setNewVideoList([]);
  };

  const handleStartEditProduct = (p: Product) => {
    setIsCreatingProduct(false);
    setEditingProduct({ ...p });
    setNewPhotoList([...(p.images || [])]);
    setNewVideoList([...(p.videos || [])]);
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setNewPhotoList([...newPhotoList, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
      showNotification('Fotografia adicionada à galeria do produto.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setNewPhotoList(newPhotoList.filter((_, i) => i !== index));
  };

  const handleAddVideoUrl = () => {
    if (newVideoUrl.trim()) {
      setNewVideoList([...newVideoList, newVideoUrl.trim()]);
      setNewVideoUrl('');
      showNotification('Vídeo adicionado à galeria do produto.');
    }
  };

  const handleRemoveVideo = (index: number) => {
    setNewVideoList(newVideoList.filter((_, i) => i !== index));
  };

  // Vercel Blob File Upload Handlers (Photos, Videos, PDF Manuals)
  const handleUploadPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadAttachmentToVercelBlob(files[i]);
        uploadedUrls.push(res.url);
      }
      setNewPhotoList(prev => [...prev, ...uploadedUrls]);
      showNotification(`${uploadedUrls.length} foto(s) enviada(s) via Vercel Blob com sucesso!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro no upload da foto.';
      showNotification(msg);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleUploadVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingVideo(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadAttachmentToVercelBlob(files[i]);
        uploadedUrls.push(res.url);
      }
      setNewVideoList(prev => [...prev, ...uploadedUrls]);
      showNotification(`${uploadedUrls.length} vídeo(s) do produto enviado(s) via Vercel Blob com sucesso!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro no upload do vídeo.';
      showNotification(msg);
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleUploadManualFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setIsUploadingManual(true);
    try {
      const res = await uploadAttachmentToVercelBlob(file);
      setEditingProduct({
        ...editingProduct,
        manualUrl: res.url,
        manualTitle: file.name,
      });
      showNotification(`Manual PDF (${file.name}) enviado via Vercel Blob!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro no upload do manual PDF.';
      showNotification(msg);
    } finally {
      setIsUploadingManual(false);
      e.target.value = '';
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const toSave: Product = {
      ...editingProduct,
      images: newPhotoList.length > 0 ? newPhotoList : editingProduct.images,
      videos: newVideoList,
    };

    AudioStore.saveProduct(toSave);
    setEditingProduct(null);
    setIsCreatingProduct(false);
    onProductUpdated();
    showNotification(`Equipamento ${toSave.name} salvo e sincronizado em tempo real via Firebase!`);
  };

  const handleDeleteProduct = (id: string) => {
    AudioStore.deleteProduct(id);
    onProductUpdated();
    showNotification('Produto removido em tempo real do catálogo Firebase.');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredBlobToken(blobToken);
    AudioStore.saveConfig(config);
    onConfigUpdated();
    showNotification('Configurações e Token Vercel Blob sincronizados em tempo real!');
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.phone ? l.phone.includes(searchTerm) : false) ||
      (l.venueType && l.venueType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-6xl bg-[#0A0A0A] border border-[#3B82F6]/40 rounded-[4px] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E0E0E]">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png"
              alt="WOX FABER"
              className="h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
            />
            <div className="border-l border-white/10 pl-3">
              <h2 id="admin-dialog-title" className="font-heading font-bold text-sm tracking-widest uppercase text-[#F5F5F2]">
                Console SaaS em Tempo Real — Firebase & Vercel Blob
              </h2>
              <span className="text-[10px] font-mono text-[#60A5FA]">WOX FABER AUDIOSUITE V3.0 REALTIME</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] border border-white/10 text-xs font-mono text-[#B8B8B8] hover:text-[#F5F5F2] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Desconectar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div className="bg-[#2563EB]/20 border-b border-[#3B82F6]/40 px-6 py-2.5 flex items-center gap-2 text-xs font-mono text-[#7EC2FB]">
            <CheckCircle className="w-4 h-4 shrink-0 text-[#60A5FA]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center">
            <div className="mb-6 py-2">
              <img
                src="https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png"
                alt="WOX FABER Logotipo Oficial"
                className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_4px_20px_rgba(59,130,246,0.35)]"
              />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase mb-2">
              Autenticação de Acesso Restrito
            </h3>
            <p className="text-xs sm:text-sm text-[#B8B8B8] font-normal max-w-sm mb-8 leading-relaxed font-sans">
              Painel conectado em tempo real ao Firebase Firestore e Vercel Blob Storage da WOX FABER.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@x.com"
                  className="w-full px-3.5 py-3 rounded-[3px] bg-[#121212] border border-white/15 text-[#F5F5F2] text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Senha do Painel
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 rounded-[3px] bg-[#121212] border border-white/15 text-[#F5F5F2] text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-[3px] bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-xs text-center"
              >
                Acessar Console de Engenharia
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn-secondary w-full py-3 text-xs text-center"
              >
                Entrar com Conta Google (Firebase Auth)
              </button>

              <div className="p-3 rounded-[3px] bg-[#121212] border border-white/[0.06] text-[10px] font-mono text-[#7A7A7A] text-center">
                Acesso oficial: <span className="text-[#60A5FA]">admin@x.com</span> / Senha: <span className="text-[#60A5FA]">admin4321</span>
              </div>
            </form>
          </div>
        ) : (
          /* SaaS Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-[#0E0E0E] border-b md:border-b-0 md:border-r border-white/[0.08] p-4 flex flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeTab === 'leads'
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="flex-1">Leads Captados</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 font-bold">
                  {leads.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Box className="w-4 h-4 shrink-0" />
                <span className="flex-1">Vitrine & Vídeos</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 font-bold">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('lp-generator')}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeTab === 'lp-generator'
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Flame className="w-4 h-4 text-[#7EC2FB] shrink-0" />
                <span>Gerar Landing Page</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeTab === 'config'
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Controle & Cloud</span>
              </button>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#080808]">
              {/* TAB 1: LEADS PIPELINE */}
              {activeTab === 'leads' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4 mb-8">
                    <div>
                      <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase">
                        Pipeline de Oportunidades & Leads (Firebase Real-Time)
                      </h3>
                      <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                        {leads.length} solicitações sincronizadas em tempo real
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportCsv}
                        className="btn-technical py-2.5 px-4"
                      >
                        <Download className="w-4 h-4 text-[#60A5FA]" />
                        <span>Exportar CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-[3px] bg-[#101010] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1">Novos Leads</span>
                      <div className="text-2xl font-bold font-heading text-[#F5F5F2]">
                        {leads.filter(l => l.status === 'novo').length}
                      </div>
                    </div>
                    <div className="p-4 rounded-[3px] bg-[#101010] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1">Em Atendimento</span>
                      <div className="text-2xl font-bold font-heading text-[#60A5FA]">
                        {leads.filter(l => l.status === 'em_atendimento').length}
                      </div>
                    </div>
                    <div className="p-4 rounded-[3px] bg-[#101010] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1">Propostas Enviadas</span>
                      <div className="text-2xl font-bold font-heading text-[#7EC2FB]">
                        {leads.filter(l => l.status === 'proposta_enviada').length}
                      </div>
                    </div>
                    <div className="p-4 rounded-[3px] bg-[#101010] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1">Projetos Fechados</span>
                      <div className="text-2xl font-bold font-heading text-emerald-400">
                        {leads.filter(l => l.status === 'fechado').length}
                      </div>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#7A7A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome, e-mail ou tipo de local..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-[3px] bg-[#121212] border border-white/10 text-xs text-[#F5F5F2] placeholder-[#7A7A7A] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 rounded-[3px] bg-[#121212] border border-white/10 text-xs font-mono uppercase text-[#F5F5F2] focus:outline-none focus:border-[#3B82F6]"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="novo">Novo</option>
                      <option value="em_atendimento">Em Atendimento</option>
                      <option value="proposta_enviada">Proposta Enviada</option>
                      <option value="fechado">Fechado</option>
                    </select>
                  </div>

                  {/* Leads Data Table */}
                  <div className="overflow-x-auto rounded-[3px] border border-white/[0.08] bg-[#0E0E0E]">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#141414] border-b border-white/[0.08] text-[#B8B8B8] uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3.5">Data</th>
                          <th className="p-3.5">Cliente & Contato</th>
                          <th className="p-3.5">Local / Aplicação</th>
                          <th className="p-3.5">Interesse / Escopo</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {filteredLeads.map(lead => (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3.5 text-[#B8B8B8] whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="p-3.5">
                              <span className="text-[#F5F5F2] font-semibold block">{lead.name}</span>
                              <a href={`mailto:${lead.email}`} className="text-[#B8B8B8] hover:text-[#60A5FA] text-[11px] block font-mono">
                                {lead.email}
                              </a>
                            </td>
                            <td className="p-3.5 text-[#E0E0DC]">{lead.venueType}</td>
                            <td className="p-3.5">
                              <span className="text-[#60A5FA] font-semibold">{lead.productName || 'Geral'}</span>
                              <p className="text-[11px] text-[#B8B8B8] mt-1 max-w-xs line-clamp-2">{lead.message}</p>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={lead.status}
                                onChange={e => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                                className="px-2.5 py-1.5 rounded-[2px] bg-[#181818] border border-white/10 text-[10px] uppercase font-mono text-[#F5F5F2] focus:outline-none focus:border-[#3B82F6]"
                              >
                                <option value="novo">Novo</option>
                                <option value="em_atendimento">Em Atendimento</option>
                                <option value="proposta_enviada">Proposta Enviada</option>
                                <option value="fechado">Fechado</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 rounded text-[#7A7A7A] hover:text-red-400 transition-colors cursor-pointer"
                                title="Excluir lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS (WITH VERCEL BLOB PHOTO, VIDEO & PDF UPLOADS) */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase">
                        Vitrine de Produtos, Vídeos & Anexos (Vercel Blob)
                      </h3>
                      <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                        Envie fotos, vídeos (.mp4/.webm/.mov) e manuais em PDF diretamente via Vercel Blob com sincronização Firebase em tempo real
                      </p>
                    </div>

                    <button
                      onClick={handleStartCreateProduct}
                      className="btn-primary py-2.5 px-4 text-xs"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      <span>Novo Produto</span>
                    </button>
                  </div>

                  {editingProduct ? (
                    /* Edit/Create Form */
                    <form onSubmit={handleSaveProduct} className="p-7 rounded-[4px] bg-[#101010] border border-[#3B82F6]/30 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                        <h4 className="font-heading font-bold text-lg text-[#F5F5F2] uppercase">
                          {isCreatingProduct ? 'Cadastrar Novo Modelo' : `Editar ${editingProduct.name}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="btn-technical"
                        >
                          Cancelar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Nome do Modelo *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Tagline Oficial *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.tagline}
                            onChange={e => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Potência de Pico</label>
                          <input
                            type="text"
                            value={editingProduct.power}
                            onChange={e => setEditingProduct({ ...editingProduct, power: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">SPL Máximo</label>
                          <input
                            type="text"
                            value={editingProduct.maxSpl}
                            onChange={e => setEditingProduct({ ...editingProduct, maxSpl: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                          />
                        </div>
                      </div>

                      {/* 1. Photo Gallery (Vercel Blob Upload + URLs) */}
                      <div className="pt-4 border-t border-white/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <label className="block text-xs font-mono uppercase text-[#60A5FA] font-semibold">
                            1. Galeria de Fotografias (Vercel Blob Storage)
                          </label>
                          <label className="btn-primary !py-2 !px-4 text-xs cursor-pointer">
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            <span>{isUploadingPhoto ? 'Enviando para Vercel Blob...' : 'Subir Fotos do Computador'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleUploadPhotoFile}
                              disabled={isUploadingPhoto}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex gap-2.5 mb-4">
                          <input
                            type="url"
                            placeholder="Ou cole a URL direta de uma foto..."
                            value={newPhotoUrl}
                            onChange={e => setNewPhotoUrl(e.target.value)}
                            className="flex-1 p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                          />
                          <button
                            type="button"
                            onClick={handleAddPhoto}
                            className="btn-technical py-3 px-4"
                          >
                            Adicionar URL
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {newPhotoList.map((url, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-[3px] bg-[#080808] border border-white/10 p-1 flex items-center justify-center">
                              <img src={url} alt={`Preview ${i}`} className="max-h-full max-w-full object-contain" />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs cursor-pointer"
                                title="Remover foto"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Product Videos (Vercel Blob Upload + URLs) */}
                      <div className="pt-4 border-t border-white/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <label className="flex items-center gap-2 text-xs font-mono uppercase text-[#7EC2FB] font-semibold">
                            <Film className="w-4 h-4 text-[#60A5FA]" />
                            <span>2. Vídeos do Produto — MP4 / WebM / MOV (Vercel Blob Storage)</span>
                          </label>
                          <label className="btn-primary !py-2 !px-4 text-xs cursor-pointer">
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            <span>{isUploadingVideo ? 'Subindo Vídeo para Vercel Blob...' : 'Subir Vídeo do Produto'}</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime,video/*"
                              multiple
                              onChange={handleUploadVideoFile}
                              disabled={isUploadingVideo}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex gap-2.5 mb-4">
                          <input
                            type="url"
                            placeholder="Ou insira a URL de um vídeo (.mp4 / .webm / Vercel Blob)..."
                            value={newVideoUrl}
                            onChange={e => setNewVideoUrl(e.target.value)}
                            className="flex-1 p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                          />
                          <button
                            type="button"
                            onClick={handleAddVideoUrl}
                            className="btn-technical py-3 px-4"
                          >
                            Adicionar Vídeo
                          </button>
                        </div>

                        {newVideoList.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {newVideoList.map((vidUrl, i) => (
                              <div key={i} className="relative rounded-[3px] bg-[#080808] border border-[#3B82F6]/30 p-2">
                                <video
                                  src={vidUrl}
                                  controls
                                  playsInline
                                  className="w-full h-40 object-cover rounded bg-black"
                                />
                                <div className="flex items-center justify-between mt-2 px-1">
                                  <span className="text-[10px] font-mono text-[#7EC2FB] truncate max-w-[200px]">
                                    Vídeo #{i + 1} · {vidUrl}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVideo(i)}
                                    className="text-xs font-mono text-red-400 hover:underline cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] font-mono text-[#7A7A7A]">
                            Nenhum vídeo cadastrado ainda para este produto. Clique em &ldquo;Subir Vídeo do Produto&rdquo; para enviar pelo Vercel Blob.
                          </p>
                        )}
                      </div>

                      {/* 3. Technical Manual PDF (Vercel Blob Upload) */}
                      <div className="pt-4 border-t border-white/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <label className="flex items-center gap-2 text-xs font-mono uppercase text-[#60A5FA] font-semibold">
                            <FileText className="w-4 h-4 text-[#60A5FA]" />
                            <span>3. Manual Técnico em PDF (Vercel Blob Storage)</span>
                          </label>
                          <label className="btn-technical py-2 px-4 text-xs cursor-pointer">
                            <Upload className="w-3.5 h-3.5 mr-1 text-[#60A5FA]" />
                            <span>{isUploadingManual ? 'Enviando PDF...' : 'Subir Novo PDF via Vercel Blob'}</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handleUploadManualFile}
                              disabled={isUploadingManual}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <input
                          type="text"
                          value={editingProduct.manualUrl}
                          onChange={e => setEditingProduct({ ...editingProduct, manualUrl: e.target.value })}
                          placeholder="URL do Manual PDF..."
                          className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Descrição Técnica</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Salvar & Publicar em Tempo Real
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="btn-secondary"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(prod => (
                        <div key={prod.id} className="p-5 rounded-[4px] bg-[#101010] border border-white/[0.08] flex gap-4 items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className="w-16 h-16 rounded-[3px] bg-[#080808] border border-white/10 p-1 flex items-center justify-center shrink-0">
                              <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-[#60A5FA] uppercase">{prod.categoryLabel}</span>
                              <h4 className="font-heading font-bold text-lg text-[#F5F5F2]">{prod.name}</h4>
                              <div className="flex items-center gap-2 text-xs font-mono text-[#B8B8B8]">
                                <span>{prod.power} · {prod.maxSpl}</span>
                                {prod.videos && prod.videos.length > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/20 border border-[#3B82F6]/40 text-[#7EC2FB] text-[10px]">
                                    {prod.videos.length} vídeo(s)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditProduct(prod)}
                              className="btn-technical p-2"
                              title="Editar produto, fotos e vídeos"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="btn-technical p-2 hover:text-red-400"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LANDING PAGE GENERATOR */}
              {activeTab === 'lp-generator' && (
                <div>
                  <div className="pb-6 border-b border-white/[0.08] mb-8">
                    <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase flex items-center gap-2">
                      <Flame className="w-5 h-5 text-[#60A5FA]" />
                      <span>Gerador Automático de Landing Pages Exclusivas</span>
                    </h3>
                    <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                      Gere instantaneamente uma página de vendas cinema-grade para campanhas de tráfego e clientes VIP
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map(prod => {
                      const lpUrl = `https://woxfaber.com.br/?lp=${prod.slug}`;
                      return (
                        <div key={prod.id} className="p-6 rounded-[4px] bg-[#101010] border border-white/[0.08] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider font-semibold">
                                LANDING PAGE ATIVA
                              </span>
                              <span className="text-[10px] font-mono text-[#7A7A7A]">
                                3D + VÍDEOS INCLUSOS
                              </span>
                            </div>
                            <h4 className="font-heading font-bold text-2xl text-[#F5F5F2] mb-1">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-[#60A5FA] font-mono mb-4">{prod.tagline}</p>
                            <div className="p-3 rounded-[3px] bg-[#080808] border border-white/5 font-mono text-[11px] text-[#B8B8B8] break-all mb-5">
                              {lpUrl}
                            </div>
                          </div>

                          <div className="flex gap-2.5">
                            <button
                              onClick={() => onPreviewLandingPage(prod)}
                              className="btn-primary flex-1 text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Visualizar LP</span>
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(lpUrl);
                                showNotification(`Link copiado para o modelo ${prod.name}!`);
                              }}
                              className="btn-technical py-2.5 px-4"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[#60A5FA]" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SITE CONFIG + FIREBASE & VERCEL BLOB STATUS */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-6">
                  <div className="pb-6 border-b border-white/[0.08] mb-6">
                    <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase">
                      Controle Geral, Firebase Real-Time & Vercel Blob
                    </h3>
                    <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                      Todas as alterações são propagadas instantaneamente em tempo real para todos os visitantes via Firebase Firestore
                    </p>
                  </div>

                  {/* Cloud Infrastructure Status Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-[4px] bg-[#101010] border border-[#3B82F6]/30 flex items-start gap-3">
                      <Database className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#7EC2FB] font-bold block">
                          FIREBASE FIRESTORE REAL-TIME
                        </span>
                        <p className="text-xs text-[#F5F5F2] font-semibold mt-0.5">
                          Conectado & Sincronizando em Tempo Real
                        </p>
                        <p className="text-[11px] text-[#B8B8B8] mt-1">
                          Coleções ativas: <code className="text-[#60A5FA]">products</code>, <code className="text-[#60A5FA]">leads</code>, <code className="text-[#60A5FA]">siteConfig</code>.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-[4px] bg-[#101010] border border-[#3B82F6]/30 flex items-start gap-3">
                      <Cloud className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#7EC2FB] font-bold block">
                          VERCEL BLOB STORAGE (@vercel/blob)
                        </span>
                        <p className="text-xs text-[#F5F5F2] font-semibold mt-0.5">
                          Endpoint <code className="text-[#60A5FA]">/api/blob</code> Ativo
                        </p>
                        <p className="text-[11px] text-[#B8B8B8] mt-1">
                          Suporta upload direto de fotos, vídeos de produtos e manuais em PDF.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#60A5FA] mb-1.5">
                      Token Vercel Blob (`BLOB_READ_WRITE_TOKEN` — Opcional se já configurado nas variáveis da Vercel)
                    </label>
                    <input
                      type="password"
                      value={blobToken}
                      onChange={e => setBlobToken(e.target.value)}
                      placeholder="vercel_blob_rw_... (Automático na Vercel via variável de ambiente)"
                      className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Título Principal Hero</label>
                    <input
                      type="text"
                      value={config.heroTitle}
                      onChange={e => setConfig({ ...config, heroTitle: e.target.value })}
                      className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Subtítulo Hero</label>
                    <textarea
                      rows={2}
                      value={config.heroSubtitle}
                      onChange={e => setConfig({ ...config, heroSubtitle: e.target.value })}
                      className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">E-mail Oficial de Atendimento (Destino Leads)</label>
                      <input
                        type="email"
                        value={config.contactEmail}
                        onChange={e => setConfig({ ...config, contactEmail: e.target.value })}
                        className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Plantão Técnico Institucional</label>
                      <input
                        type="text"
                        value={config.emergencyTechSupport}
                        onChange={e => setConfig({ ...config, emergencyTechSupport: e.target.value })}
                        className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#3B82F6]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Salvar Configurações em Tempo Real
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
