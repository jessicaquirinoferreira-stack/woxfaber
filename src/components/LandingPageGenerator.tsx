import React, { useState } from 'react';
import { Product } from '../types';
import { Product3DViewer } from './Product3DViewer';
import { LeadCaptureModal } from './LeadCaptureModal';
import {
  Download,
  Share2,
  Check,
  ArrowLeft,
  Box,
  FileText,
  Mail,
  ArrowUpRight,
  Film,
} from 'lucide-react';

interface LandingPageProps {
  product: Product;
  onBackToMain: () => void;
}

export const LandingPageGenerator: React.FC<LandingPageProps> = ({
  product,
  onBackToMain,
}) => {
  const [copied, setCopied] = useState(false);
  const [show3D, setShow3D] = useState(true);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const shareUrl = `https://woxfaber.com.br/?lp=${product.slug}`;
  const videos = product.videos || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F2] selection:bg-[#2563EB]/25 selection:text-[#7EC2FB]">
      {/* Top Floating VIP Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToMain}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B8B8B8] hover:text-[#F5F5F2] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#60A5FA]" />
              <span className="hidden sm:inline">Voltar ao Portal</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <img
              src="https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png"
              alt="WOX FABER"
              className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#141414] border border-white/10 text-xs font-mono text-[#B8B8B8] hover:text-[#F5F5F2] hover:border-[#3B82F6]/40 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#60A5FA]" /> : <Share2 className="w-3.5 h-3.5 text-[#60A5FA]" />}
              <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="btn-primary !px-5 !py-2 text-xs"
            >
              Solicitar Cotação
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section of Landing Page */}
      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Pitch */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/15 border border-[#3B82F6]/30 text-[#60A5FA] text-xs font-mono uppercase tracking-widest mb-6">
              <span>{product.categoryLabel}</span>
              <span>·</span>
              <span>Engenharia de Alta Fidelidade</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-[#F5F5F2] tracking-tight uppercase leading-[1.08] mb-4">
              {product.name}
            </h1>
            <p className="text-xl sm:text-2xl text-[#60A5FA] font-heading font-medium mb-6">
              {product.tagline}
            </p>
            <p className="text-sm sm:text-base text-[#B8B8B8] font-light leading-relaxed mb-8 font-sans">
              {product.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[#101010] border border-white/10">
                <span className="text-[10px] font-mono text-[#7A7A7A] uppercase block mb-1">Potência</span>
                <span className="text-lg font-bold font-mono text-[#F5F5F2]">{product.power}</span>
              </div>
              <div className="p-4 bg-[#101010] border border-white/10">
                <span className="text-[10px] font-mono text-[#7A7A7A] uppercase block mb-1">Pressão Máx.</span>
                <span className="text-lg font-bold font-mono text-[#60A5FA]">{product.maxSpl}</span>
              </div>
              <div className="p-4 bg-[#101010] border border-white/10">
                <span className="text-[10px] font-mono text-[#7A7A7A] uppercase block mb-1">Amplificador</span>
                <span className="text-xs font-bold font-mono text-[#F5F5F2] block mt-1 truncate">{product.ampClass}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="btn-primary"
              >
                <span>Solicitar Demonstração / Cotação</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>

              <a
                href={product.manualUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Download className="w-4 h-4 text-[#60A5FA]" />
                <span>Manual em PDF</span>
              </a>
            </div>
          </div>

          {/* Right Hero Image or 3D view */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#101010] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#141414]">
                <span className="text-[10px] font-mono text-[#7A7A7A] uppercase tracking-wider">
                  Inspeção Tridimensional de Bancada
                </span>
                <button
                  onClick={() => setShow3D(!show3D)}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#60A5FA] hover:underline"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>{show3D ? 'Ver Fotos Reais' : 'Ativar Estúdio 3D'}</span>
                </button>
              </div>

              {show3D ? (
                <Product3DViewer product={product} />
              ) : (
                <div className="p-8 aspect-[4/3] flex items-center justify-center bg-[#060606]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Product Videos Section (if videos uploaded) */}
      {videos.length > 0 && (
        <section className="py-16 bg-[#0C0C0C] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Film className="w-5 h-5 text-[#60A5FA]" />
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F5F5F2] uppercase tracking-tight">
                Demonstração em Vídeo — {product.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((videoUrl, idx) => (
                <div key={idx} className="bg-[#060606] border border-white/10 p-3 rounded-[4px]">
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full aspect-video rounded bg-black"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights Section */}
      <section className="py-20 bg-[#101010] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#60A5FA] uppercase block mb-2">
              Diferenciais Construtivos
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#F5F5F2] uppercase tracking-tight">
              Diferenciais de Engenharia do {product.name}
            </h2>
            <p className="mt-2 text-[#B8B8B8] font-light text-sm font-sans">
              Cada componente foi selecionado para suportar níveis extremos de pressão contínua sem queima ou compressão dinâmica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.highlights.map((highlight, idx) => (
              <div key={idx} className="p-6 bg-[#141414] border border-white/5 hover:border-[#3B82F6]/30 transition-colors">
                <span className="text-xs font-mono text-[#60A5FA] block mb-2 font-bold">0{idx + 1}</span>
                <p className="text-sm text-[#F5F5F2] font-light leading-relaxed font-sans">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Lab Specifications */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <FileText className="w-5 h-5 text-[#60A5FA]" />
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F5F5F2] uppercase tracking-tight">
            Ficha Técnica Oficial Completa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-xs bg-[#101010] p-8 border border-white/10">
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Modelo Comercial</span>
            <span className="text-[#F5F5F2] font-medium font-sans">{product.name}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Configuração do Sistema</span>
            <span className="text-[#F5F5F2] font-medium font-sans">{product.type}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Potência Contínua / Pico</span>
            <span className="text-[#60A5FA] font-bold font-mono text-sm">{product.power}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">SPL Máximo Calculado</span>
            <span className="text-[#60A5FA] font-bold font-mono text-sm">{product.maxSpl}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Resposta de Frequência</span>
            <span className="text-[#F5F5F2] font-medium font-mono">{product.freqResponse}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Topologia do Amplificador</span>
            <span className="text-[#F5F5F2] font-medium font-sans">{product.ampClass}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Transdutor de Graves (LF)</span>
            <span className="text-[#F5F5F2] font-medium font-sans">{product.lfTransducer}</span>
          </div>
          {product.hfTransducer && (
            <div className="flex justify-between py-2.5 border-b border-white/5">
              <span className="text-[#7A7A7A] font-mono">Transdutor de Agudos (HF)</span>
              <span className="text-[#F5F5F2] font-medium font-sans">{product.hfTransducer}</span>
            </div>
          )}
          {product.coverage && (
            <div className="flex justify-between py-2.5 border-b border-white/5">
              <span className="text-[#7A7A7A] font-mono">Dispersão (H × V)</span>
              <span className="text-[#F5F5F2] font-medium font-mono">{product.coverage}</span>
            </div>
          )}
          <div className="flex justify-between py-2.5 border-b border-white/5 md:col-span-2">
            <span className="text-[#7A7A7A] font-mono">Processador Digital (DSP)</span>
            <span className="text-[#7EC2FB] font-medium text-right font-mono">{product.dspFeatures}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Dimensões Físicas</span>
            <span className="text-[#F5F5F2] font-medium font-mono">{product.dimensions}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-white/5">
            <span className="text-[#7A7A7A] font-mono">Peso Estrutural</span>
            <span className="text-[#F5F5F2] font-medium font-mono">{product.weight}</span>
          </div>
        </div>
      </section>

      {/* Footer CTA of Landing Page */}
      <section className="py-24 bg-[#050505] border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#60A5FA] uppercase block mb-3">
            Atendimento Técnico Direto
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#F5F5F2] uppercase mb-4 tracking-tight">
            Pronto para Dominar o Som com o {product.name}?
          </h2>
          <p className="text-base text-[#B8B8B8] font-light mb-8 font-sans">
            Fale com nossa equipe técnica, tire dúvidas de alinhamento e receba condições de fornecimento direto de fábrica.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="btn-primary w-full sm:w-auto"
            >
              <span>Falar com Engenheiro de Vendas</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>

            <a
              href={`mailto:woxfaberbrasil@gmail.com?subject=Interesse%20no%20modelo%20${encodeURIComponent(product.name)}&body=Ol%C3%A1%20Equipe%20WOX%20FABER%2C%0A%0AGostaria%20de%20receber%20informa%C3%A7%C3%B5es%20t%C3%A9cnicas%20e%20proposta%20comercial%20para%20o%20modelo%20${encodeURIComponent(product.name)}.`}
              className="btn-secondary w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 text-[#60A5FA]" />
              <span>Enviar E-mail para Fábrica</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lead modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultProductName={product.name}
      />
    </div>
  );
};
