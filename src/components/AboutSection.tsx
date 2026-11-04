import React from 'react';
import { Target, Sliders, Award, Activity, Layers, ShieldCheck, Gauge, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="quem-somos" className="relative py-32 bg-[#080808] border-b border-white/[0.06] overflow-hidden">
      {/* Background Engineering Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2.5 mb-3.5">
            <span className="w-8 h-[1px] bg-[#3B82F6]" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              Engenharia Acústica & Filosofia de Construção
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F2] tracking-tight uppercase leading-[1.08]">
            Engenharia com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F2] via-[#7EC2FB] to-[#2563EB]">Alma Técnica</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
            Não projetamos caixas acústicas para impressionar em catálogos ilustrados. Projetamos sistemas de pressão sonora extrema para suportar o rigor da estrada, a dinâmica implacável de bandas ao vivo e a inteligibilidade absoluta exigida em catedrais e grandes arenas.
          </p>
        </div>

        {/* 3 Core Philosophical Pillars with Visual Diagrams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: O Significado de WOX */}
          <div className="card-premium p-8 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/50 transition-colors">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#7A7A7A] uppercase tracking-wider">
                  01 / ETIMOLOGIA
                </span>
              </div>

              <span className="text-[11px] font-mono tracking-widest text-[#60A5FA] uppercase block mb-1.5 font-medium">
                Etimologia e Propósito
              </span>
              <h3 className="text-2xl font-bold font-heading text-[#F5F5F2] mb-3">
                O Significado de WOX
              </h3>
              <p className="text-sm text-[#B8B8B8] leading-relaxed mb-6 font-normal">
                WOX nasce da intersecção de <strong className="text-[#F5F5F2] font-semibold">Waveform Optimization</strong> (otimização de forma de onda eletroacústica) com o rigor de fabricação artesanal industrial (<strong className="text-[#F5F5F2] font-semibold">FABER</strong>). Cada transdutor, corneta e guia de onda é moldado geometricamente para que a frente de onda chegue sem cancelamento de fase na plateia.
              </p>

              {/* Technical Diagram 1: Coaxial Wavefront Phase Diagram */}
              <div className="p-4 rounded-[3px] bg-[#141414] border border-white/[0.08] mb-4">
                <div className="flex justify-between text-[10px] font-mono text-[#B8B8B8] mb-2 uppercase">
                  <span>Alinhamento de Fase</span>
                  <span className="text-[#60A5FA] font-bold">Δt &lt; 0.02ms</span>
                </div>
                <div className="h-10 flex items-center gap-1">
                  {[40, 65, 85, 100, 95, 80, 50, 30, 20, 35, 60, 90, 100, 85, 60, 35, 15, 25].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#181818] via-[#2563EB] to-[#7EC2FB] rounded-t-sm"
                      style={{ height: `${h}%`, opacity: 0.35 + (h / 100) * 0.65 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#7A7A7A] mt-2">
                  <span>45 Hz</span>
                  <span>1 kHz</span>
                  <span>20 kHz</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-[#B8B8B8] flex items-center justify-between">
              <span>Cancelamento de fase:</span>
              <span className="text-[#60A5FA] font-semibold">&lt; 0.05% em eixo</span>
            </div>
          </div>

          {/* Card 2: Precisão Sem Cortes */}
          <div className="card-premium p-8 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/50 transition-colors">
                  <Sliders className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#7A7A7A] uppercase tracking-wider">
                  02 / DINÂMICA
                </span>
              </div>

              <span className="text-[11px] font-mono tracking-widest text-[#60A5FA] uppercase block mb-1.5 font-medium">
                Cadeia de Sinal Analógica & Digital
              </span>
              <h3 className="text-2xl font-bold font-heading text-[#F5F5F2] mb-3">
                Precisão Sem Cortes
              </h3>
              <p className="text-sm text-[#B8B8B8] leading-relaxed mb-6 font-normal">
                Rejeitamos o uso de limiters que esmagam a dinâmica musical apenas para inflar números teóricos em folhetos. Os amplificadores Classe D de 3000W e 1000W da WOX trabalham com headroom genuíno, mantendo transientes rápidos de bumbo e caixa intactos, sem saturação térmica ou distorção harmônica.
              </p>

              {/* Technical Diagram 2: Headroom and THD Curve */}
              <div className="p-4 rounded-[3px] bg-[#141414] border border-white/[0.08] mb-4">
                <div className="flex justify-between text-[10px] font-mono text-[#B8B8B8] mb-2 uppercase">
                  <span>Headroom Dinâmico</span>
                  <span className="text-[#60A5FA] font-bold">+6.2 dB Peak</span>
                </div>
                <div className="relative h-10 w-full bg-[#101010] rounded-[2px] overflow-hidden flex items-center px-2">
                  <div className="h-2 w-3/4 bg-[#2563EB] rounded-sm" />
                  <div className="h-2 w-1/4 bg-[#7EC2FB]/40 rounded-r-sm" />
                  <span className="absolute right-3 text-[10px] font-mono text-[#F5F5F2]">RMS / PEAK</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#7A7A7A] mt-2">
                  <span>Piso de Ruído -98dB</span>
                  <span>Linear até 132 dB</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-[#B8B8B8] flex items-center justify-between">
              <span>Distorção Harmônica THD:</span>
              <span className="text-[#60A5FA] font-semibold">&lt; 0.03% em 1kHz</span>
            </div>
          </div>

          {/* Card 3: Acabamento de Nível Mundial */}
          <div className="card-premium p-8 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/50 transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#7A7A7A] uppercase tracking-wider">
                  03 / GABINETE
                </span>
              </div>

              <span className="text-[11px] font-mono tracking-widest text-[#60A5FA] uppercase block mb-1.5 font-medium">
                Gabinete & Revestimento Estrutural
              </span>
              <h3 className="text-2xl font-bold font-heading text-[#F5F5F2] mb-3">
                Padrão Industrial de Turnê
              </h3>
              <p className="text-sm text-[#B8B8B8] leading-relaxed mb-6 font-normal">
                Construídos em compensado naval multilaminado de alta densidade com revestimento externo de poliureia pura de grau militar. Imunes à umidade, impactos severos de carga de caminhão e vibração parasita interna que compromete a resposta de subgrave.
              </p>

              {/* Technical Diagram 3: Polyurea Layer Architecture */}
              <div className="p-4 rounded-[3px] bg-[#141414] border border-white/[0.08] mb-4">
                <div className="flex justify-between text-[10px] font-mono text-[#B8B8B8] mb-2 uppercase">
                  <span>Estrutura Multicamada</span>
                  <span className="text-[#60A5FA] font-bold">15mm Bétula</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-[#2a2a2a] rounded-sm flex items-center px-2">
                    <span className="text-[8px] font-mono text-[#B8B8B8]">Revestimento Poliureia 2.5mm</span>
                  </div>
                  <div className="h-4 w-full bg-[#1c1c1c] rounded-sm flex items-center px-2 border-l-2 border-[#3B82F6]">
                    <span className="text-[8px] font-mono text-[#7EC2FB]">Compensado Naval 11 Camadas</span>
                  </div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#7A7A7A] mt-2">
                  <span>Amortecimento acústico interno</span>
                  <span>Anti-Ressonância</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-[#B8B8B8] flex items-center justify-between">
              <span>Grade de Proteção:</span>
              <span className="text-[#60A5FA] font-semibold">Aço 1.5mm com pó epóxi</span>
            </div>
          </div>
        </div>

        {/* Bench & Road History Quote Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-[4px] bg-gradient-to-r from-[#101010] via-[#141414] to-[#101010] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl">
            <p className="text-lg sm:text-xl text-[#F5F5F2] font-medium leading-relaxed italic">
              "Um sistema de som profissional de verdade não mente para o técnico de mixagem. Ele entrega o que entra com autoridade física, estabilidade térmica e zero complicação."
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono tracking-wider text-[#60A5FA] uppercase font-semibold">
                Laboratório de Desenvolvimento Eletroacústico WOX FABER
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-mono text-[#B8B8B8]">Bancada & Estrada</span>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10 shrink-0">
            <div className="text-center">
              <span className="block text-3xl font-bold font-heading text-[#60A5FA]">100%</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8B8B8] mt-1 block">
                Testado em Carga Contínua
              </span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold font-heading text-[#F5F5F2]">5 min</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8B8B8] mt-1 block">
                Troca Modular em Campo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
