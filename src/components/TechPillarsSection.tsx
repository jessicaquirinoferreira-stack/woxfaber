import React from 'react';
import { Disc, Radio, Flame, Check, Activity, BarChart3, ThermometerSnowflake } from 'lucide-react';

export const TechPillarsSection: React.FC = () => {
  const pillars = [
    {
      num: '01',
      badge: 'Transdução e Acoplamento',
      title: 'Série KAIROS (KRS & QRX)',
      subtitle: 'Alinhamento Temporal & Dispersão Controlada',
      description:
        'A Série KAIROS é a resposta definitiva para sonorização de alto rendimento. Combinando cornetas de dispersão 90° × 60° com geometria elíptica otimizada e drivers de titânio de 44 mm, ela elimina zonas mortas e reflexões indesejadas em paredes laterais. Quando acoplada aos subwoofers da linha, o corte passa-baixas e passa-altas de 24dB/oitava cria uma transição acústica invisível de 3 vias.',
      specs: [
        'Corneta de diretividade constante 90° × 60° sem lóbulos secundários',
        'Crossover acústico alinhado milimetricamente em 2.4 kHz',
        'Acoplamento de fase sem cancelamento destrutivo entre topo e sub',
      ],
      icon: Disc,
      visualTag: 'POLAR DIRECTIVITY 90°×60°',
      visualType: 'dispersion',
    },
    {
      num: '02',
      badge: 'Transmissão RF e Antenas',
      title: 'Gerenciamento de RF & Antenas (Série SNC)',
      subtitle: 'Zero Dropouts e Supressão de Intermodulação',
      description:
        'A poluição de radiofrequência em templos e palcos com telões LED e milhares de smartphones é o maior pesadelo de um técnico de áudio. A série SNC introduz distribuidores de RF ativos com filtragem seletiva de 470 a 960 MHz, amplificadores de baixíssimo ruído e fontes blindadas que mantêm o sinal de múltiplos microfones estável a mais de 100 metros.',
      specs: [
        'Distribuição UHF ativa com compensação de perdas de cabo coaxial',
        'Cascatas de antena para até 16 canais simultâneos em 1U de rack',
        'Blindagem eletromagnética total contra ruído de placas controladoras de LED',
      ],
      icon: Radio,
      visualTag: 'UHF SPECTRUM 470-960 MHz',
      visualType: 'rf',
    },
    {
      num: '03',
      badge: 'Construção Mecânica e Térmica',
      title: 'Construção Mecânica e Térmica',
      subtitle: 'Bobinas de 75 mm (3") e Dissipação Passiva Silenciosa',
      description:
        'Equipamentos de áudio que superaquecem perdem rendimento acústico por compressão térmica. A WOX utiliza transdutores de baixa frequência com bobinas massivas de 75 mm enroladas em fita de alumínio sobre suporte de fibra de vidro de alta resistência térmica, acopladas a dissipadores em alumínio extrudado maciço. Sem ventoinhas ruidosas que sugam poeira de palco para dentro da placa.',
      specs: [
        'Bobinas móveis de 75 mm (3 polegadas) com ventilação forçada magnética',
        'Dissipação por convecção natural sem ruído acústico de ventoinha em culto/teatro',
        'Limitadores térmicos preditivos de Classe D com monitoramento contínuo',
      ],
      icon: Flame,
      visualTag: 'THERMAL EFFICIENCY < 62°C',
      visualType: 'thermal',
    },
  ];

  return (
    <section id="pilares" className="py-32 bg-[#0A0A0A] relative border-b border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2.5 mb-3.5">
            <span className="w-8 h-[1px] bg-[#C7A66A]" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C7A66A] font-semibold">
              Arquitetura de Sistemas Eletroacústicos
            </span>
            <span className="w-8 h-[1px] bg-[#C7A66A]" />
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F2] tracking-tight uppercase leading-[1.08]">
            Os Pilares da Tecnologia WOX
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#B8B8B8] font-normal max-w-2xl mx-auto">
            Engenharia de precisão onde cada decibel de pressão sonora é gerado com integridade física e estabilidade contínua.
          </p>
        </div>

        {/* 3 Large Architectural Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="card-premium p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[3px] bg-[#141414] border border-white/10 flex items-center justify-center text-[#C7A66A] group-hover:border-[#C7A66A]/50 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-[#C7A66A] uppercase font-semibold">
                        Pilar {pillar.num}
                      </span>
                    </div>

                    <span className="text-3xl font-heading font-extrabold text-[#282828] group-hover:text-[#C7A66A]/40 transition-colors">
                      {pillar.num}
                    </span>
                  </div>

                  {/* Title and Subtitle */}
                  <span className="text-[11px] font-mono tracking-wider text-[#B8B8B8] uppercase block mb-1">
                    {pillar.badge}
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-[#F5F5F2] mb-2 leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-mono text-[#C7A66A] mb-5 uppercase tracking-wide">
                    {pillar.subtitle}
                  </p>
                  <p className="text-sm text-[#B8B8B8] leading-relaxed mb-8 font-normal">
                    {pillar.description}
                  </p>

                  {/* Visual Technical Element corresponding to Pillar */}
                  <div className="p-4 rounded-[3px] bg-[#141414] border border-white/[0.08] mb-8">
                    <div className="flex justify-between text-[10px] font-mono text-[#B8B8B8] mb-2 uppercase">
                      <span>Diagrama de Laboratório</span>
                      <span className="text-[#C7A66A]">{pillar.visualTag}</span>
                    </div>

                    {pillar.visualType === 'dispersion' && (
                      <div className="relative h-14 w-full bg-[#101010] rounded-[2px] flex items-center justify-center overflow-hidden">
                        {/* Horn Coverage Vector Cone */}
                        <div className="w-24 h-10 border-t-2 border-r-2 border-[#C7A66A] rotate-45 opacity-70" />
                        <span className="absolute text-[10px] font-mono text-[#F5F5F2]">Dispersão 90° Horizontal × 60° Vertical</span>
                      </div>
                    )}

                    {pillar.visualType === 'rf' && (
                      <div className="relative h-14 w-full bg-[#101010] rounded-[2px] flex items-end gap-1 p-2">
                        {[15, 20, 18, 90, 85, 22, 19, 95, 88, 25, 20, 18, 92, 86, 21, 19].map((val, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-t-sm ${val > 50 ? 'bg-[#C7A66A]' : 'bg-[#252525]'}`}
                            style={{ height: `${val}%` }}
                          />
                        ))}
                      </div>
                    )}

                    {pillar.visualType === 'thermal' && (
                      <div className="relative h-14 w-full bg-[#101010] rounded-[2px] flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                          <ThermometerSnowflake className="w-5 h-5 text-[#C7A66A]" />
                          <span className="text-xs font-mono text-[#F5F5F2]">Bobina 75mm (3")</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#C7A66A] font-bold">Convecção Passiva</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specs List with Clear Bullets */}
                <div className="pt-6 border-t border-white/[0.08]">
                  <ul className="space-y-3">
                    {pillar.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2.5 text-xs text-[#E0E0DC]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C7A66A] mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
