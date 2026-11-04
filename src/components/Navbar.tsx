import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenLeadModal: (productName?: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLeadModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      const sections = ['produtos', 'quem-somos', 'pilares', 'calculadora', 'diferencial'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Linha Kairos', id: 'produtos', href: '#produtos' },
    { name: 'Engenharia', id: 'quem-somos', href: '#quem-somos' },
    { name: 'Pilares Técnicos', id: 'pilares', href: '#pilares' },
    { name: 'Calculadora SPL', id: 'calculadora', href: '#calculadora' },
    { name: 'Troca Modular', id: 'diferencial', href: '#diferencial' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/92 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-[#080808]/95 via-[#080808]/70 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Oficial WOX FABER (Fundo Transparente) */}
          <a
            href="#"
            className="group flex items-center gap-3.5 focus:outline-none"
            aria-label="WOX FABER Página Inicial"
          >
            <div className="relative py-1 flex items-center">
              <img
                src="https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png"
                alt="WOX FABER — Engineered Audio Solutions"
                className="h-9 sm:h-11 w-auto max-w-[200px] object-contain filter drop-shadow-[0_2px_12px_rgba(59,130,246,0.35)] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm">
            {navLinks.map(link => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.12em] font-medium transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#60A5FA] font-semibold'
                      : 'text-[#B8B8B8] hover:text-[#F5F5F2]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2563EB] to-[#7EC2FB] rounded-full shadow-[0_0_8px_#3B82F6]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-4">
            {/* DSP 96kHz Active Indicator */}
            <div className="flex items-center gap-2 text-[11px] text-[#B8B8B8] font-mono px-3.5 py-1.5 rounded-full bg-[#101010] border border-white/[0.08]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]"></span>
              </span>
              <span className="tracking-wider">DSP 96kHz ACTIVE</span>
            </div>

            {/* Redesigned Primary Button (rounded-full) */}
            <button
              onClick={() => onOpenLeadModal()}
              className="btn-primary"
            >
              <span>Falar com Especialista</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full text-[#B8B8B8] hover:text-[#F5F5F2] bg-[#121212] border border-white/10 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A] border-b border-white/[0.08] px-6 py-6 mt-3 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-[#B8B8B8] hover:text-[#60A5FA] py-2.5 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-[#B8B8B8] font-mono py-1">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
                <span>DSP 96kHz ACTIVE · LABORATÓRIO WOX</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLeadModal();
                }}
                className="btn-primary w-full text-center py-3.5"
              >
                <span>Falar com Especialista</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
