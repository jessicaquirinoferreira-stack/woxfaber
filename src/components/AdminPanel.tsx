import React, { useState, useEffect } from 'react';
import { Product, Lead, SiteConfig, LeadStatus } from '../types';
import { AudioStore } from '../services/store';
import {
  Lock,
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
  Filter,
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

  // Leads and Products
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<SiteConfig>(AudioStore.getConfig());

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Product edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoList, setNewPhotoList] = useState<string[]>([]);

  // Feedback notification banner
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(AudioStore.isAuthenticated());
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setLeads(AudioStore.getLeads());
    setProducts(AudioStore.getProducts());
    setConfig(AudioStore.getConfig());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AudioStore.login(email, password)) {
      setIsAuthenticated(true);
      setLoginError('');
      loadData();
    } else {
      setLoginError('Credenciais incorretas. Verifique seu e-mail e chave de acesso.');
    }
  };

  const handleLogout = () => {
    AudioStore.logout();
    setIsAuthenticated(false);
  };

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    AudioStore.updateLeadStatus(id, status);
    loadData();
    showNotification('Status do lead atualizado no banco de dados.');
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Confirma a remoção permanente deste lead do pipeline?')) {
      AudioStore.deleteLead(id);
      loadData();
      showNotification('Lead excluído com sucesso.');
    }
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
  };

  const handleStartEditProduct = (p: Product) => {
    setIsCreatingProduct(false);
    setEditingProduct({ ...p });
    setNewPhotoList([...p.images]);
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const toSave: Product = {
      ...editingProduct,
      images: newPhotoList.length > 0 ? newPhotoList : editingProduct.images,
    };

    AudioStore.saveProduct(toSave);
    setEditingProduct(null);
    setIsCreatingProduct(false);
    loadData();
    onProductUpdated();
    showNotification(`Equipamento ${toSave.name} salvo com sucesso!`);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Confirma a remoção permanente deste modelo da vitrine?')) {
      AudioStore.deleteProduct(id);
      loadData();
      onProductUpdated();
      showNotification('Produto removido do catálogo.');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    AudioStore.saveConfig(config);
    onConfigUpdated();
    showNotification('Configurações institucionais atualizadas com sucesso.');
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
        className="relative w-full max-w-6xl bg-[#0A0A0A] border border-[#C7A66A]/40 rounded-[4px] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
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
              className="h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(199,166,106,0.3)]"
            />
            <div className="border-l border-white/10 pl-3">
              <h2 id="admin-dialog-title" className="font-heading font-bold text-sm tracking-widest uppercase text-[#F5F5F2]">
                Console SaaS de Engenharia & Gestão Comercial
              </h2>
              <span className="text-[10px] font-mono text-[#C7A66A]">WOX FABER AUDIOSUITE V2.4</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#141414] border border-white/10 text-xs font-mono text-[#B8B8B8] hover:text-[#F5F5F2] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Desconectar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-[3px] text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div className="bg-[#C7A66A]/15 border-b border-[#C7A66A]/30 px-6 py-2.5 flex items-center gap-2 text-xs font-mono text-[#C7A66A]">
            <CheckCircle className="w-4 h-4 shrink-0" />
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
                className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_4px_20px_rgba(199,166,106,0.35)]"
              />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase mb-2">
              Autenticação de Acesso Restrito
            </h3>
            <p className="text-xs sm:text-sm text-[#B8B8B8] font-normal max-w-sm mb-8 leading-relaxed font-sans">
              Painel restrito à diretoria de engenharia e operações comerciais da WOX FABER.
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
                  className="w-full px-3.5 py-3 rounded-[3px] bg-[#121212] border border-white/15 text-[#F5F5F2] text-sm focus:outline-none focus:border-[#C7A66A]"
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
                  className="w-full px-3.5 py-3 rounded-[3px] bg-[#121212] border border-white/15 text-[#F5F5F2] text-sm focus:outline-none focus:border-[#C7A66A]"
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

              <div className="p-3 rounded-[3px] bg-[#121212] border border-white/[0.06] text-[10px] font-mono text-[#7A7A7A] text-center">
                Acesso oficial: <span className="text-[#C7A66A]">admin@x.com</span> / Senha: <span className="text-[#C7A66A]">admin4321</span>
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
                    ? 'bg-[#C7A66A] text-[#080808] font-bold shadow-md'
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
                    ? 'bg-[#C7A66A] text-[#080808] font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Box className="w-4 h-4 shrink-0" />
                <span className="flex-1">Vitrine Produtos</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/25 font-bold">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('lp-generator')}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeTab === 'lp-generator'
                    ? 'bg-[#C7A66A] text-[#080808] font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Gerar Landing Page</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                  activeTab === 'config'
                    ? 'bg-[#C7A66A] text-[#080808] font-bold shadow-md'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.04]'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Controle Geral</span>
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
                        Pipeline de Oportunidades & Leads
                      </h3>
                      <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                        {leads.length} solicitações registradas e monitoradas
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportCsv}
                        className="btn-technical py-2.5 px-4"
                      >
                        <Download className="w-4 h-4 text-[#C7A66A]" />
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
                      <div className="text-2xl font-bold font-heading text-[#64B5F6]">
                        {leads.filter(l => l.status === 'em_atendimento').length}
                      </div>
                    </div>
                    <div className="p-4 rounded-[3px] bg-[#101010] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1">Propostas Enviadas</span>
                      <div className="text-2xl font-bold font-heading text-[#C7A66A]">
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
                        placeholder="Buscar por nome, e-mail, telefone ou tipo de local..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-[3px] bg-[#121212] border border-white/10 text-xs text-[#F5F5F2] placeholder-[#7A7A7A] focus:outline-none focus:border-[#C7A66A]"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 rounded-[3px] bg-[#121212] border border-white/10 text-xs font-mono uppercase text-[#F5F5F2] focus:outline-none focus:border-[#C7A66A]"
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
                              <a href={`mailto:${lead.email}`} className="text-[#B8B8B8] hover:text-[#C7A66A] text-[11px] block font-mono">
                                {lead.email}
                              </a>
                              {lead.phone && <span className="text-[#7A7A7A] text-[11px] block">{lead.phone}</span>}
                            </td>
                            <td className="p-3.5 text-[#E0E0DC]">{lead.venueType}</td>
                            <td className="p-3.5">
                              <span className="text-[#C7A66A] font-semibold">{lead.productName || 'Geral'}</span>
                              <p className="text-[11px] text-[#B8B8B8] mt-1 max-w-xs line-clamp-2">{lead.message}</p>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={lead.status}
                                onChange={e => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                                className="px-2.5 py-1.5 rounded-[2px] bg-[#181818] border border-white/10 text-[10px] uppercase font-mono text-[#F5F5F2] focus:outline-none focus:border-[#C7A66A]"
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

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
                    <div>
                      <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase">
                        Gestão da Vitrine de Produtos
                      </h3>
                      <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                        Cadastre novos modelos, gerencie fotografias e manuais de laboratório
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
                    <form onSubmit={handleSaveProduct} className="p-7 rounded-[4px] bg-[#101010] border border-[#C7A66A]/30 space-y-5">
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
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Tagline Oficial *</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.tagline}
                            onChange={e => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Potência de Pico</label>
                          <input
                            type="text"
                            value={editingProduct.power}
                            onChange={e => setEditingProduct({ ...editingProduct, power: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">SPL Máximo</label>
                          <input
                            type="text"
                            value={editingProduct.maxSpl}
                            onChange={e => setEditingProduct({ ...editingProduct, maxSpl: e.target.value })}
                            className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                          />
                        </div>
                      </div>

                      {/* Photo Gallery (Vercel Blob / URLs) */}
                      <div className="pt-4 border-t border-white/[0.08]">
                        <label className="block text-xs font-mono uppercase text-[#C7A66A] font-semibold mb-2">
                          Galeria de Fotografias (Vercel Blob / CDN URLs)
                        </label>
                        <div className="flex gap-2.5 mb-4">
                          <input
                            type="url"
                            placeholder="Insira a URL de uma foto de alta resolução..."
                            value={newPhotoUrl}
                            onChange={e => setNewPhotoUrl(e.target.value)}
                            className="flex-1 p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                          />
                          <button
                            type="button"
                            onClick={handleAddPhoto}
                            className="btn-technical py-3 px-4"
                          >
                            Adicionar Foto
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

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Descrição Técnica</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full p-3 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          Salvar Alterações
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
                              <span className="text-[10px] font-mono text-[#C7A66A] uppercase">{prod.categoryLabel}</span>
                              <h4 className="font-heading font-bold text-lg text-[#F5F5F2]">{prod.name}</h4>
                              <span className="text-xs font-mono text-[#B8B8B8]">{prod.power} · {prod.maxSpl}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditProduct(prod)}
                              className="btn-technical p-2"
                              title="Editar produto"
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
                      <Flame className="w-5 h-5 text-[#C7A66A]" />
                      <span>Gerador Automático de Landing Pages Exclusivas</span>
                    </h3>
                    <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                      Gere instantaneamente uma página de vendas cinema-grade para campanhas de tráfego e clientes VIP
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map(prod => {
                      const lpUrl = `${window.location.origin}${window.location.pathname}?lp=${prod.slug}`;
                      return (
                        <div key={prod.id} className="p-6 rounded-[4px] bg-[#101010] border border-white/[0.08] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-mono text-[#C7A66A] uppercase tracking-wider font-semibold">
                                LANDING PAGE ATIVA
                              </span>
                              <span className="text-[10px] font-mono text-[#7A7A7A]">
                                3D INTERATIVO INCLUSO
                              </span>
                            </div>
                            <h4 className="font-heading font-bold text-2xl text-[#F5F5F2] mb-1">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-[#C7A66A] font-mono mb-4">{prod.tagline}</p>
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
                              <Share2 className="w-3.5 h-3.5 text-[#C7A66A]" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SITE CONFIG */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-5">
                  <div className="pb-6 border-b border-white/[0.08] mb-6">
                    <h3 className="font-heading font-extrabold text-2xl text-[#F5F5F2] uppercase">
                      Controle Geral do Portal & Contatos Oficiais
                    </h3>
                    <p className="text-xs font-mono text-[#B8B8B8] mt-1">
                      Gerencie textos institucionais e o e-mail oficial de recebimento de cotações (woxfaberbrasil@gmail.com)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Título Principal Hero</label>
                    <input
                      type="text"
                      value={config.heroTitle}
                      onChange={e => setConfig({ ...config, heroTitle: e.target.value })}
                      className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Subtítulo Hero</label>
                    <textarea
                      rows={2}
                      value={config.heroSubtitle}
                      onChange={e => setConfig({ ...config, heroSubtitle: e.target.value })}
                      className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">E-mail Oficial de Atendimento (Destino Leads)</label>
                      <input
                        type="email"
                        value={config.contactEmail}
                        onChange={e => setConfig({ ...config, contactEmail: e.target.value })}
                        className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B8B8B8] mb-1.5">Plantão Técnico Institucional</label>
                      <input
                        type="text"
                        value={config.emergencyTechSupport}
                        onChange={e => setConfig({ ...config, emergencyTechSupport: e.target.value })}
                        className="w-full p-3 rounded-[3px] bg-[#121212] border border-white/10 text-[#F5F5F2] text-xs font-mono focus:border-[#C7A66A]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Salvar Configurações
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
