import React, { useState, useEffect } from 'react';
import { Product, SiteConfig } from './types';
import { AudioStore } from './services/store';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { TechPillarsSection } from './components/TechPillarsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { Product3DViewer } from './components/Product3DViewer';
import { AcousticCalculator } from './components/AcousticCalculator';
import { SupportSection } from './components/SupportSection';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { AdminPanel } from './components/AdminPanel';
import { LandingPageGenerator } from './components/LandingPageGenerator';
import { Footer } from './components/Footer';
import { CinematicIntro } from './components/CinematicIntro';
import { ArrowUpRight, Volume2, ShieldCheck, X, Mail } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<SiteConfig>(AudioStore.getConfig());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [active3DProduct, setActive3DProduct] = useState<Product | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadProductName, setLeadProductName] = useState<string | undefined>();
  const [leadDefaultNote, setLeadDefaultNote] = useState<string | undefined>();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Dedicated Landing Page view (if ?lp=krs315a query param exists)
  const [dedicatedLpProduct, setDedicatedLpProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Initial data load
    refreshProducts();
    refreshConfig();

    // Check URL parameters for direct Landing Page navigation
    const params = new URLSearchParams(window.location.search);
    const lpParam = params.get('lp');
    if (lpParam) {
      const match = AudioStore.getProductBySlug(lpParam);
      if (match) {
        setDedicatedLpProduct(match);
      }
    }
  }, []);

  const refreshProducts = () => {
    setProducts(AudioStore.getProducts());
  };

  const refreshConfig = () => {
    setConfig(AudioStore.getConfig());
  };

  const handleOpenLeadModal = (productName?: string, note?: string) => {
    setLeadProductName(productName);
    setLeadDefaultNote(note);
    setIsLeadModalOpen(true);
  };

  const handleExploreProducts = () => {
    const el = document.getElementById('produtos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing a Dedicated Product Landing Page
  if (dedicatedLpProduct) {
    return (
      <LandingPageGenerator
        product={dedicatedLpProduct}
        onBackToMain={() => {
          setDedicatedLpProduct(null);
          // Clean URL without page reload
          window.history.pushState({}, '', window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F2] selection:bg-[#C7A66A]/20 selection:text-[#C7A66A]">
      {/* Luxury Navigation Header with Official Logo */}
      <Navbar
        onOpenLeadModal={handleOpenLeadModal}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section with Free Floating Grand Logo */}
        <HeroSection
          heroTitle={config.heroTitle}
          heroSubtitle={config.heroSubtitle}
          heroOriginText={config.heroOriginText}
          onOpenLeadModal={() => handleOpenLeadModal()}
          onExploreProducts={handleExploreProducts}
        />

        {/* 2. Quem Somos Section */}
        <AboutSection />

        {/* 3. Os Pilares da Tecnologia */}
        <TechPillarsSection />

        {/* 4. Vitrine Dinâmica de Produtos */}
        <ProductCatalog
          products={products}
          onSelectProduct={prod => setSelectedProduct(prod)}
          onOpen3D={prod => setActive3DProduct(prod)}
          onOpenLeadModal={name => handleOpenLeadModal(name)}
        />

        {/* 5. Simulador Acústico e Calculadora de SPL & Delay */}
        <AcousticCalculator
          onOpenLeadWithSpecs={note => handleOpenLeadModal(undefined, note)}
        />

        {/* 6. Diferencial WOX – Suporte e Pós-Venda (Troca Modular) */}
        <SupportSection
          onOpenLeadModal={subj => handleOpenLeadModal(subj)}
        />

        {/* 7. Chamada para Ação Final */}
        <section className="relative py-28 bg-[#101010] border-t border-white/10 overflow-hidden text-center">
          <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#C7A66A] uppercase block mb-3 font-semibold">
              Construa a Nova Referência de Áudio
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-[#F5F5F2] tracking-tight uppercase mb-6 leading-tight">
              PRONTO PARA ELEVAR O <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2C99A] to-[#C7A66A]">
                PADRÃO DO SEU SOM?
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#B8B8B8] font-light max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Fale diretamente com nossa engenharia de aplicação. Agende uma audição em nosso estúdio acústico ou solicite uma simulação personalizada para sua igreja, casa de show ou empresa de sonorização.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleOpenLeadModal('Contato Comercial Direto')}
                className="btn-primary w-full sm:w-auto"
              >
                <span>FALAR COM UM ESPECIALISTA AGORA</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>

              <a
                href="mailto:woxfaberbrasil@gmail.com?subject=Consulta%20T%C3%A9cnica%20Direta%20-%20WOX%20FABER&body=Ol%C3%A1%20Engenharia%20WOX%20FABER%2C%0A%0AGostaria%20de%20solicitar%20uma%20consulta%20t%C3%A9cnica%20para%20meu%20projeto%20ac%C3%BAstico."
                className="btn-secondary w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 mr-1 text-[#C7A66A]" />
                <span>ENVIAR E-MAIL PARA ENGENHARIA</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        config={config}
        onOpenLeadModal={() => handleOpenLeadModal()}
      />

      {/* Product Details Drawer / Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenLeadModal={name => handleOpenLeadModal(name)}
        />
      )}

      {/* Direct 3D Studio Inspection Modal */}
      {active3DProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0C0C0C] border border-white/15 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
            <Product3DViewer
              product={active3DProduct}
              onClose={() => setActive3DProduct(null)}
            />
          </div>
        </div>
      )}

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultProductName={leadProductName}
        defaultNote={leadDefaultNote}
        onLeadSubmitted={() => {
          // Refresh leads in background
        }}
      />

      {/* Restricted Admin & Engineering Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductUpdated={() => refreshProducts()}
        onConfigUpdated={() => refreshConfig()}
        onPreviewLandingPage={prod => {
          setIsAdminOpen(false);
          setDedicatedLpProduct(prod);
        }}
      />

      {/* Cinematic Entrance with Grand Free Logo & Acoustic Shockwaves */}
      {showIntro && (
        <CinematicIntro
          onComplete={() => setShowIntro(false)}
        />
      )}
    </div>
  );
}
