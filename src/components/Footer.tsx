import React from 'react';
import { Lock, ArrowUp, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  config: SiteConfig;
  onOpenLeadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, config, onOpenLeadModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-[#B8B8B8] border-t border-white/[0.08] relative overflow-hidden">
      {/* Pre-footer Grand Finale Call-to-Action Bar */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-[#0A0A0A] to-[#050505] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C7A66A] font-semibold block mb-4">
            Compromisso Eletroacústico Inegociável
          </span>
          <h3 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#F5F5F2] tracking-tight uppercase mb-6 leading-tight">
            Engenharia de áudio para quem <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F2] via-[#E2C99A] to-[#C7A66A]">
              exige excelência.
            </span>
          </h3>
          <p className="text-sm sm:text-base text-[#B8B8B8] font-normal max-w-xl mx-auto mb-8 leading-relaxed">
            Consulte nossos engenheiros para projetos de sonorização de igrejas, templos, casas de espetáculo e turnês.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenLeadModal}
              className="btn-primary"
            >
              <span>FALE COM NOSSA ENGENHARIA</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
            <a
              href="mailto:woxfaberbrasil@gmail.com?subject=Consulta%20Engenharia%20WOX%20FABER&body=Ol%C3%A1%20Engenharia%20WOX%20FABER%2C%0A%0AGostaria%20de%20solicitar%20uma%20consulta%20t%C3%A9cnica."
              className="btn-secondary"
            >
              <Mail className="w-4 h-4 mr-1 text-[#C7A66A]" />
              <span>ENVIAR E-MAIL PARA ENGENHARIA</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Main Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info with Official Transparent Logo */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src="https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png"
                alt="WOX FABER — Engineered Audio Solutions"
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(199,166,106,0.25)]"
              />
              <span className="text-[10px] uppercase tracking-[0.26em] text-[#C7A66A] font-mono block mt-2 font-semibold">
                ENGINEERED AUDIO SOLUTIONS
              </span>
            </div>

            <p className="text-xs text-[#B8B8B8] font-normal leading-relaxed max-w-sm mb-6">
              Sistemas eletroacústicos de alta pressão sonora projetados com amplificação Classe D de 3000W,
              transdutores de 15" e 12" com bobinas de 75 mm e processamento DSP integrado para palcos e catedrais.
            </p>

            <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#C7A66A]">
              <span className="w-2 h-2 rounded-full bg-[#C7A66A] animate-pulse" />
              <span className="tracking-wider">LABORATÓRIO ELETROACÚSTICO HOMOLOGADO</span>
            </div>
          </div>

          {/* Quick Equipment Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#F5F5F2] font-semibold mb-5">
              Equipamentos
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="#produtos" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Caixa Ativa KRS315A (3000W)
                </a>
              </li>
              <li>
                <a href="#produtos" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Subwoofer KRS212SB (1000W)
                </a>
              </li>
              <li>
                <a href="#produtos" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Distribuidor de Antenas SNC-400
                </a>
              </li>
              <li>
                <a href="#calculadora" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Simulador de SPL & Delay
                </a>
              </li>
            </ul>
          </div>

          {/* Engineering & Pillars */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#F5F5F2] font-semibold mb-5">
              Engenharia
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="#quem-somos" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Filosofia WOX & Alma Técnica
                </a>
              </li>
              <li>
                <a href="#pilares" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Pilares de Transdução & RF
                </a>
              </li>
              <li>
                <a href="#diferencial" className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors">
                  Garantia de Troca Modular
                </a>
              </li>
              <li>
                <a
                  href="/assets/aistudio/Manual_KRS315A_WOX_FABER_337d8a70.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8B8B8] hover:text-[#C7A66A] transition-colors"
                >
                  Download Manuais Oficiais (PDF)
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Support Contacts */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#F5F5F2] font-semibold mb-5">
              Atendimento Técnico
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:woxfaberbrasil@gmail.com"
                className="flex items-center gap-2.5 text-[#F5F5F2] hover:text-[#C7A66A] transition-colors group"
              >
                <Mail className="w-4 h-4 text-[#C7A66A] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate font-mono font-medium">woxfaberbrasil@gmail.com</span>
              </a>
              <p className="text-[11px] text-[#C7A66A] font-mono leading-relaxed">
                Atendimento técnico e comercial exclusivo via e-mail oficial (woxfaberbrasil@gmail.com).
              </p>
            </div>
          </div>
        </div>

        {/* Central Restricted Access Section (Requested by user) */}
        <div className="py-8 border-t border-b border-white/[0.06] flex flex-col items-center justify-center gap-3 text-center">
          <button
            onClick={onOpenAdmin}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#101010] border border-white/10 hover:border-[#C7A66A]/60 text-[#B8B8B8] hover:text-[#F5F5F2] text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
            title="Acesso restrito para administradores e equipe de engenharia"
          >
            <Lock className="w-3.5 h-3.5 text-[#C7A66A] group-hover:scale-110 transition-transform" />
            <span>[ ACESSO RESTRITO / ENGENHARIA ]</span>
          </button>
          <span className="text-[10px] font-mono text-[#7A7A7A] tracking-wider">
            SISTEMA SAAS DE GESTÃO DE LEADS · PRODUTOS · LANDING PAGES
          </span>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#7A7A7A]">
          <div>
            &copy; {new Date().getFullYear()} WOX FABER — Engineered Audio Solutions. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-6">
            <span>Conformidade Eletroacústica AES / IEC</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#B8B8B8] hover:text-[#C7A66A] transition-colors cursor-pointer"
            >
              <span>Topo</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
