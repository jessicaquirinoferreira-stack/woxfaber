import React from 'react';
import { Wrench, Mail, RefreshCw, ShieldCheck, ArrowUpRight, Clock, Check } from 'lucide-react';

interface SupportSectionProps {
  onOpenLeadModal: (subject?: string) => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  onOpenLeadModal,
}) => {
  return (
    <section id="diferencial" className="py-32 bg-[#0A0A0A] border-b border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Manifesto & Highlights */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2.5 mb-3.5">
              <span className="w-8 h-[1px] bg-[#C7A66A]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C7A66A] font-semibold">
                Engenharia de Pós-Venda Sem Paralelo
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F2] tracking-tight uppercase leading-[1.08]">
              O Show Não Espera. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F2] via-[#E2C99A] to-[#C7A66A]">
                Nosso Suporte Também Não.
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
              Sabemos o custo de um palco parado em um sábado à noite ou de um culto sem áudio principal.
              Por isso, a WOX FABER aboliu o modelo ultrapassado de assistência técnica que retém o equipamento por semanas em bancada.
            </p>

            <div className="mt-10 space-y-7">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#C7A66A] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-[#F5F5F2]">
                    Atendimento Direto por E-mail de Engenharia
                  </h3>
                  <p className="text-sm text-[#B8B8B8] font-normal mt-1 leading-relaxed">
                    Você fala diretamente com especialistas em alinhamento de delay, acústica de recinto e ganho pelo e-mail oficial <span className="text-[#C7A66A] font-mono">woxfaberbrasil@gmail.com</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#C7A66A] shrink-0 mt-0.5">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-[#F5F5F2]">
                    Estoque Real de Peças e Transdutores no Brasil
                  </h3>
                  <p className="text-sm text-[#B8B8B8] font-normal mt-1 leading-relaxed">
                    Reparos imediatos com transdutores de 15", diafragmas de titânio de 44mm, cornetas e chicotes elétricos originais a pronta entrega nacional.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#C7A66A] shrink-0 mt-0.5">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-[#F5F5F2]">
                    Troca Modular em Bloco (Plug-and-Play)
                  </h3>
                  <p className="text-sm text-[#B8B8B8] font-normal mt-1 leading-relaxed">
                    O módulo amplificador Classe D traseiro e DSP são montados em monobloco. Se houver anomalia, você recebe um módulo novo calibrado, solta os parafusos de aço, desconecta o plugue rápido e substitui em 5 minutos.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => onOpenLeadModal('Suporte e Garantia Modular')}
                className="btn-primary"
              >
                <span>Acionar Plantão de Engenharia</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href="mailto:woxfaberbrasil@gmail.com?subject=Suporte%20T%C3%A9cnico%20e%20Garantia%20Modular%20-%20WOX%20FABER&body=Ol%C3%A1%20Engenharia%20WOX%20FABER%2C%0A%0APreciso%20de%20suporte%20t%C3%A9cnico%20ou%20orienta%C3%A7%C3%A3o%20de%20instala%C3%A7%C3%A3o."
                className="btn-secondary"
              >
                <Mail className="w-4 h-4 mr-1 text-[#C7A66A]" />
                <span>E-mail de Suporte Técnico</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Protocol Diagram */}
          <div className="lg:col-span-6">
            <div className="card-premium p-8 sm:p-10 border border-[#C7A66A]/30 shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#C7A66A]" />
                  <span className="font-heading font-bold text-[#F5F5F2] text-sm tracking-wider uppercase">
                    Protocolo de Garantia Ininterrupta
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#C7A66A] bg-[#C7A66A]/10 px-2.5 py-1 rounded-[2px] border border-[#C7A66A]/30">
                  PLUG & PLAY SYSTEM
                </span>
              </div>

              {/* Step Timeline */}
              <div className="mt-7 space-y-4">
                <div className="p-4 rounded-[3px] bg-[#141414] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C7A66A] uppercase font-bold block mb-0.5">Passo 01</span>
                    <h4 className="text-sm font-heading font-bold text-[#F5F5F2]">Diagnóstico Técnico Remoto</h4>
                    <p className="text-xs text-[#B8B8B8] mt-0.5">Validação direta com engenheiro de aplicação via e-mail oficial (woxfaberbrasil@gmail.com).</p>
                  </div>
                  <span className="text-xs font-mono text-[#7A7A7A] ml-4 shrink-0">~ 15 min</span>
                </div>

                <div className="p-4 rounded-[3px] bg-[#141414] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C7A66A] uppercase font-bold block mb-0.5">Passo 02</span>
                    <h4 className="text-sm font-heading font-bold text-[#F5F5F2]">Envio de Bloco Amplificador Novo</h4>
                    <p className="text-xs text-[#B8B8B8] mt-0.5">Módulo calibrado de fábrica despachado em regime de emergência.</p>
                  </div>
                  <span className="text-xs font-mono text-[#C7A66A] font-bold ml-4 shrink-0">Same-Day</span>
                </div>

                <div className="p-4 rounded-[3px] bg-gradient-to-r from-[#141414] to-[#1C1710] border border-[#C7A66A]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C7A66A] uppercase font-bold block mb-0.5">Passo 03</span>
                    <h4 className="text-sm font-heading font-bold text-[#F5F5F2]">Substituição em 5 Minutos na Própria Caixa</h4>
                    <p className="text-xs text-[#B8B8B8] mt-0.5">Sem soldas. Conectores multipolares traváveis e parafusos de aço.</p>
                  </div>
                  <span className="text-xs font-mono text-[#E2C99A] font-bold ml-4 shrink-0">Zero Oficina</span>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-[3px] bg-[#121212] border border-white/[0.06] text-center">
                <p className="text-xs text-[#B8B8B8] leading-relaxed">
                  Compromisso formal WOX FABER: seu evento, culto ou festival nunca fica sem a sua pressão sonora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
