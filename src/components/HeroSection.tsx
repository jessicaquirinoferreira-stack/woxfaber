import React from 'react';
import { AcousticFieldCanvas } from './AcousticFieldCanvas';
import { ArrowDown, Volume2, ShieldCheck, Cpu, Zap, Activity, Radio, ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  heroTitle: string;
  heroSubtitle: string;
  heroOriginText: string;
  onOpenLeadModal: () => void;
  onExploreProducts: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroSubtitle,
  heroOriginText,
  onOpenLeadModal,
  onExploreProducts,
}) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden bg-[#080808] border-b border-white/[0.06]">
      {/* Interactive Sound Field & Acoustic Wavefront Canvas */}
      <AcousticFieldCanvas className="opacity-80" />

      {/* Engineering Frequency Grid Lines Motif */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Controlled Electric Blue Diffuse Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-[#2563EB]/[0.12] blur-[160px] pointer-events-none rounded-full" />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,8,8,0.75)_65%,#080808_100%)]" />

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Floating Majestic Official Logo with Ambient Depth */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-6 bg-[#2563EB]/20 blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <img
            src="https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png"
            alt="WOX FABER — Engineered Audio Solutions"
            className="relative z-10 w-[240px] sm:w-[320px] md:w-[380px] h-auto object-contain filter drop-shadow-[0_8px_30px_rgba(59,130,246,0.45)] transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent opacity-80 shadow-[0_0_8px_#3B82F6]" />
        </div>

        {/* Laboratory Kicker */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#101010]/90 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.2em] text-[#60A5FA] uppercase font-semibold">
            Engenharia Eletroacústica de Alta Precisão
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[11px] font-mono tracking-wider text-[#B8B8B8]">
            Série KAIROS
          </span>
        </div>

        {/* Master Typographic Composition requested:
            O SOM NÃO É
            APENAS OUVIDO.
            ELE É DOMINADO.
        */}
        <div className="max-w-4xl mx-auto mb-6">
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[#F5F5F2] uppercase leading-[1.04] tracking-tight">
            <span>O SOM NÃO É</span> <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F2] via-[#7EC2FB] to-[#2563EB]">
              APENAS OUVIDO.
            </span> <br />
            <span>ELE É </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] relative inline-block">
              DOMINADO.
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent rounded-full opacity-90 shadow-[0_0_12px_#3B82F6]" />
            </span>
          </h1>
        </div>

        {/* Subtitle with improved line height and contrast */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#E0E0DC] font-normal max-w-3xl mx-auto leading-relaxed mt-4">
          {heroSubtitle}
        </p>

        {/* Supporting text from bench & lab */}
        <p className="mt-4 text-xs sm:text-sm text-[#B8B8B8] max-w-2xl mx-auto font-normal leading-relaxed border-t border-white/[0.08] pt-4">
          {heroOriginText}
        </p>

        {/* Unified Button System */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreProducts}
            className="btn-primary w-full sm:w-auto"
          >
            <span>CONHEÇA A LINHA PROFISSIONAL</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onOpenLeadModal}
            className="btn-secondary w-full sm:w-auto"
          >
            <span>FALE COM UM ESPECIALISTA</span>
          </button>
        </div>

        {/* High-End Technical Indicator Cards */}
        <div className="mt-16 w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl text-left">
          {/* Card 1: Pressão Máxima */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#60A5FA] mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8B8B8]">
                Pressão Máxima
              </span>
              <Zap className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F5F5F2]">
                132 dB <span className="text-xs font-mono text-[#60A5FA] font-medium">SPL</span>
              </div>
              <p className="text-xs text-[#B8B8B8] mt-1.5 leading-snug">
                Impacto físico massivo sem distorção ou compressão dinâmica.
              </p>
            </div>
          </div>

          {/* Card 2: Potência de Pico */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#60A5FA] mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8B8B8]">
                Potência de Pico
              </span>
              <Volume2 className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F5F5F2]">
                3000 W <span className="text-xs font-mono text-[#60A5FA] font-medium">Class D</span>
              </div>
              <p className="text-xs text-[#B8B8B8] mt-1.5 leading-snug">
                Módulo de alta eficiência com resposta ultrarrápida a transientes.
              </p>
            </div>
          </div>

          {/* Card 3: Processamento */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#60A5FA] mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8B8B8]">
                Processamento
              </span>
              <Cpu className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F5F5F2]">
                DSP Azul <span className="text-xs font-mono text-[#7EC2FB] font-medium">LCD</span>
              </div>
              <p className="text-xs text-[#B8B8B8] mt-1.5 leading-snug">
                4 presets acústicos, equalizador de 3 bandas, Low Cut e delay temporal.
              </p>
            </div>
          </div>

          {/* Card 4: Disponibilidade */}
          <div className="card-premium p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#60A5FA] mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B8B8B8]">
                Disponibilidade
              </span>
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#F5F5F2]">
                Troca Modular
              </div>
              <p className="text-xs text-[#B8B8B8] mt-1.5 leading-snug">
                Substituição do bloco amplificador em 5 minutos sem paradas de show.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={onExploreProducts}
          className="mt-14 inline-flex flex-col items-center gap-2 text-[#7A7A7A] hover:text-[#60A5FA] transition-colors focus:outline-none cursor-pointer"
          aria-label="Deslize para explorar a linha de produtos"
        >
          <span className="text-[10px] uppercase font-mono tracking-[0.22em]">
            Deslize para Explorar
          </span>
          <ArrowDown className="w-4 h-4 text-[#60A5FA] animate-bounce" />
        </button>
      </div>
    </section>
  );
};
