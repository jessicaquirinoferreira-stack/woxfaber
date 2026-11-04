import React, { useState } from 'react';
import { calculateSplAtDistance, calculateDelayMs } from '../utils/audioCalculator';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';

interface AcousticCalculatorProps {
  onOpenLeadWithSpecs: (note: string) => void;
}

export const AcousticCalculator: React.FC<AcousticCalculatorProps> = ({ onOpenLeadWithSpecs }) => {
  const [distance, setDistance] = useState<number>(15);
  const [selectedProductSpl, setSelectedProductSpl] = useState<number>(132); // KRS315A default
  const [temp, setTemp] = useState<number>(24);
  const [venueType, setVenueType] = useState<string>('templo');

  const splResult = calculateSplAtDistance(selectedProductSpl, distance);
  const delayMs = calculateDelayMs(distance, temp);

  const handleConsultantRequest = () => {
    const note = `Cálculo de Cobertura Eletroacústica: ${distance}m de alcance | SPL Calculado na plateia: ${splResult.perceivedSpl} dB SPL | Delay recomendado: ${delayMs}ms | Temperatura: ${temp}°C | Aplicação: ${venueType.toUpperCase()}`;
    onOpenLeadWithSpecs(note);
  };

  return (
    <section id="calculadora" className="py-32 bg-[#080808] border-b border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2.5 mb-3.5">
            <span className="w-8 h-[1px] bg-gradient-to-r from-[#2563EB] to-[#7EC2FB]" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              Software de Eletroacústica Aplicada
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-r from-[#7EC2FB] to-[#2563EB]" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F2] tracking-tight uppercase leading-[1.08]">
            Simulador de Pressão Sonora & Delay
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
            Calcule o SPL exato que atingirá o ouvinte mais distante da sua nave ou arena e determine o alinhamento temporal milimétrico de delay.
          </p>
        </div>

        {/* Professional Software Console Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Input Deck */}
          <div className="lg:col-span-6 p-8 rounded-[4px] bg-[#101010] border border-white/[0.08] flex flex-col justify-between">
            <div className="space-y-7">
              {/* Product Transducer Select */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#B8B8B8] mb-2.5">
                  Sistema de Transdução Ativo:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProductSpl(132)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProductSpl === 132
                        ? 'bg-[#181818] border-[#3B82F6] text-[#F5F5F2] shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                        : 'bg-[#121212] border-white/[0.06] text-[#B8B8B8] hover:border-white/20'
                    }`}
                  >
                    <span className="font-heading font-bold text-base block text-[#F5F5F2]">KRS315A (3000W)</span>
                    <span className="text-xs font-mono text-[#60A5FA] mt-1 block">132 dB SPL @ 1m</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProductSpl(127)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProductSpl === 127
                        ? 'bg-[#181818] border-[#3B82F6] text-[#F5F5F2] shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                        : 'bg-[#121212] border-white/[0.06] text-[#B8B8B8] hover:border-white/20'
                    }`}
                  >
                    <span className="font-heading font-bold text-base block text-[#F5F5F2]">KRS212SB (1000W)</span>
                    <span className="text-xs font-mono text-[#60A5FA] mt-1 block">127 dB SPL @ 1m</span>
                  </button>
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-3">
                  <span className="text-[#B8B8B8] uppercase tracking-wider">Distância até a Última Fileira:</span>
                  <span className="text-[#60A5FA] font-bold text-sm bg-[#181818] px-2.5 py-1 rounded-[2px] border border-white/[0.08]">
                    {distance} metros
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="1"
                  value={distance}
                  onChange={e => setDistance(Number(e.target.value))}
                  className="w-full accent-[#3B82F6] bg-[#222222] h-2 rounded cursor-pointer"
                  aria-label="Distância em metros"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#7A7A7A] mt-2">
                  <span>2m (Monitor de Palco)</span>
                  <span>15m (Igreja Média)</span>
                  <span>60m (Arena / Festival)</span>
                </div>
              </div>

              {/* Ambient Temperature Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-3">
                  <span className="text-[#B8B8B8] uppercase tracking-wider">Temperatura do Ar (Velocidade do Som):</span>
                  <span className="text-[#F5F5F2] font-bold text-sm bg-[#181818] px-2.5 py-1 rounded-[2px] border border-white/[0.08]">
                    {temp} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="w-full accent-[#3B82F6] bg-[#222222] h-2 rounded cursor-pointer"
                  aria-label="Temperatura do ar em Celsius"
                />
              </div>

              {/* Venue Application Type */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#B8B8B8] mb-2.5">
                  Ambiente Acústico / Aplicação:
                </label>
                <select
                  value={venueType}
                  onChange={e => setVenueType(e.target.value)}
                  className="w-full p-3.5 rounded-[3px] bg-[#141414] border border-white/10 text-[#F5F5F2] text-xs font-mono uppercase focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="templo">Igreja / Templo Religioso (Prioridade em Voz, Inteligibilidade e Louvor)</option>
                  <option value="palco">Show ao Vivo / Palco / Festival (Pressão Extrema e Dinâmica de Banda)</option>
                  <option value="teatro">Teatro / Auditório Corporativo (Alta Fidelidade e Cobertura Uniforme)</option>
                  <option value="residencial">Espaço Gourmet / Residencial de Alto Padrão</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/[0.08] text-[11px] font-mono text-[#7A7A7A]">
              Modelo matemático: Lei do inverso do quadrado no ar livre (Free-field 20 log10(d))
            </div>
          </div>

          {/* Telemetry Output Cockpit */}
          <div className="lg:col-span-6 p-8 rounded-[4px] bg-gradient-to-br from-[#121212] via-[#161616] to-[#0E0E0E] border border-[#3B82F6]/40 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-widest text-[#60A5FA] font-semibold">
                  Telemetria Eletroacústica Calculada
                </span>
                <span className="text-[10px] font-mono text-[#B8B8B8] px-2 py-0.5 rounded-[2px] bg-white/[0.04]">
                  STATUS: EM FASE
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[3px] bg-[#0A0A0A] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1.5">
                    SPL Percebido a {distance}m
                  </span>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[#F5F5F2]">
                    {splResult.perceivedSpl} <span className="text-sm font-mono text-[#60A5FA] font-medium">dB SPL</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#7A7A7A] mt-2 block">
                    Atenuação: -{splResult.attenuationDb} dB
                  </span>
                </div>

                <div className="p-5 rounded-[3px] bg-[#0A0A0A] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-[#B8B8B8] uppercase block mb-1.5">
                    Delay Temporal de Torre
                  </span>
                  <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[#7EC2FB]">
                    {delayMs} <span className="text-sm font-mono text-[#F5F5F2] font-medium">ms</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#7A7A7A] mt-2 block">
                    Velocidade do ar: {(331.3 + 0.606 * temp).toFixed(1)} m/s
                  </span>
                </div>
              </div>

              {/* Technical Assessment Message */}
              <div className="mt-6 p-5 rounded-[3px] bg-[#0E0E0E] border border-white/[0.08]">
                <div className="flex items-center gap-2 text-[#F5F5F2] font-heading font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#60A5FA]" />
                  <span>Diagnóstico Técnico WOX:</span>
                </div>
                <p className="text-xs text-[#B8B8B8] font-normal leading-relaxed">
                  {splResult.safetyDescription}
                </p>
                <div className="mt-4 text-[11px] font-mono text-[#60A5FA] border-t border-white/[0.06] pt-3">
                  Recomendação de sistema: {distance > 25 ? 'Recomendado cluster de 2x KRS315A por lado com subwoofers alinhados temporalmente.' : '1 par de KRS315A entrega ampla cobertura estéreo com mais de 10dB de headroom dinâmico.'}
                </div>
              </div>
            </div>

            {/* Direct Validation Trigger */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <button
                onClick={handleConsultantRequest}
                className="btn-primary w-full py-4 text-xs"
              >
                <span>Validar Projeto com Engenheiro de Campo</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
