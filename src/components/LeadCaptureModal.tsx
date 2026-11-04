import React, { useState } from 'react';
import { validateLeadForm } from '../utils/audioCalculator';
import { AudioStore } from '../services/store';
import { X, CheckCircle, Send, ShieldCheck, ArrowRight, Mail, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProductName?: string;
  defaultNote?: string;
  onLeadSubmitted?: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  defaultProductName,
  defaultNote,
  onLeadSubmitted,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [venueType, setVenueType] = useState('Templo / Igreja');
  const [message, setMessage] = useState(defaultNote || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  if (!isOpen) return null;

  const buildMailtoUrl = (clientName: string, clientEmail: string, venue: string, clientMsg: string) => {
    const targetEmail = 'woxfaberbrasil@gmail.com';
    const subject = `[WOX FABER] Consultoria Eletroacústica - ${clientName || 'Cliente'}`;
    const body = `Olá Equipe de Engenharia WOX FABER,

Gostaria de solicitar uma consultoria técnica / proposta comercial direta:

- Responsável: ${clientName}
- E-mail de Contato: ${clientEmail}
- Tipo de Aplicação: ${venue}
- Equipamento de Foco: ${defaultProductName || 'Linha Kairos / Consultoria Geral'}

Detalhes da Solicitação / Dimensões do Espaço:
${clientMsg || 'Solicito contato técnico e proposta comercial.'}

---------------------------------------------------
Enviado através do Portal Oficial WOX FABER — Engineered Audio Solutions`;

    return `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadForm({ name, email });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const mailtoUrl = buildMailtoUrl(name, email, venueType, message);
    setLastMailtoUrl(mailtoUrl);

    setTimeout(() => {
      AudioStore.addLead({
        name,
        email,
        phone: '',
        venueType,
        message: message || (defaultProductName ? `Interesse em ${defaultProductName}` : 'Solicitação de consultoria acústica geral via e-mail.'),
        productName: defaultProductName,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onLeadSubmitted) onLeadSubmitted();

      // Trigger user's mail client directly to woxfaberbrasil@gmail.com
      try {
        window.location.href = mailtoUrl;
      } catch {
        // fallback to button in success view
      }

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#C7A66A', '#E2C99A', '#F5F5F2'],
        });
      } catch {
        // ignore
      }
    }, 400);
  };

  const handleCopyTargetEmail = () => {
    navigator.clipboard.writeText('woxfaberbrasil@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-[#0C0C0C] border border-[#C7A66A]/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C7A66A] animate-pulse" />
            <h2 id="lead-modal-title" className="font-heading font-bold text-xs sm:text-sm tracking-[0.15em] uppercase text-[#F5F5F2]">
              Consultoria Eletroacústica & Cotação Direta
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#C7A66A]/15 border border-[#C7A66A] rounded-full flex items-center justify-center text-[#C7A66A] mb-5">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F5F2] uppercase tracking-tight mb-2">
                Solicitação Direcionada à Engenharia
              </h3>
              <p className="text-xs sm:text-sm text-[#B8B8B8] font-normal max-w-md mb-6 leading-relaxed font-sans">
                Seu aplicativo de e-mail foi acionado com a mensagem formatada para <strong className="text-[#C7A66A] font-mono">woxfaberbrasil@gmail.com</strong>.
                Caso sua caixa de mensagens não tenha aberto automaticamente, clique no botão abaixo para enviar ou copie nosso endereço direto.
              </p>

              <div className="w-full max-w-md space-y-3 mb-6">
                <a
                  href={lastMailtoUrl}
                  className="btn-primary w-full justify-center"
                >
                  <Mail className="w-4 h-4 text-black mr-1" />
                  <span>Abrir E-mail e Enviar (woxfaberbrasil@gmail.com)</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyTargetEmail}
                  className="btn-secondary w-full justify-center text-xs"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C7A66A] mr-1.5" />
                      <span className="text-[#C7A66A]">Copiado: woxfaberbrasil@gmail.com</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C7A66A] mr-1.5" />
                      <span>Copiar Endereço: woxfaberbrasil@gmail.com</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleResetAndClose}
                className="text-xs font-mono text-[#7A7A7A] hover:text-[#F5F5F2] transition-colors underline uppercase tracking-wider"
              >
                Concluir e Voltar ao Site
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-2">
                <p className="text-xs text-[#B8B8B8] font-normal font-sans leading-relaxed">
                  Preencha seus dados para receber consultoria técnica direta por e-mail da nossa engenharia de aplicação (<span className="text-[#C7A66A] font-mono">woxfaberbrasil@gmail.com</span>).
                </p>
                {defaultProductName && (
                  <div className="mt-3 inline-block px-3 py-1 bg-[#C7A66A]/10 border border-[#C7A66A]/30 text-[#C7A66A] text-xs font-mono uppercase tracking-wider">
                    Equipamento em foco: <strong className="text-[#F5F5F2]">{defaultProductName}</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Nome Completo / Responsável Técnico *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#242424] text-[#F5F5F2] text-sm focus:outline-none focus:border-[#C7A66A] transition-colors font-sans"
                />
                {errors.name && <span className="text-red-400 text-xs mt-1 block font-mono">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Seu E-mail para Retorno Direto *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu.nome@empresa.com.br"
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#242424] text-[#F5F5F2] text-sm focus:outline-none focus:border-[#C7A66A] transition-colors font-sans"
                />
                {errors.email && <span className="text-red-400 text-xs mt-1 block font-mono">{errors.email}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Tipo de Instalação / Aplicação
                </label>
                <select
                  value={venueType}
                  onChange={e => setVenueType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#242424] text-[#F5F5F2] text-xs font-mono uppercase focus:outline-none focus:border-[#C7A66A]"
                >
                  <option value="Templo / Igreja">Templo / Igreja (Palavra falada & Louvor)</option>
                  <option value="Locadora / Sonorização de Shows">Locadora / Sonorização de Shows & Turnê</option>
                  <option value="Casa de Espetáculos / Teatro">Casa de Espetáculos / Teatro / Auditório</option>
                  <option value="Instalação Comercial de Alto Padrão">Instalação Comercial / Bar Premium</option>
                  <option value="Uso Residencial / Particular de Luxo">Uso Residencial / Chácara de Alto Padrão</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Dimensões do Espaço ou Observações Técnicas (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Ex: Nave de 25m de comprimento por 14m de largura, pé-direito de 6m..."
                  className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#242424] text-[#F5F5F2] text-sm focus:outline-none focus:border-[#C7A66A] transition-colors resize-none font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-black mr-1" />
                  <span>{isSubmitting ? 'Preparando e-mail...' : 'Enviar E-mail para Engenharia (woxfaberbrasil@gmail.com)'}</span>
                  <Send className="w-4 h-4 text-black ml-1" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#7A7A7A] pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C7A66A]" />
                <span>Destino: woxfaberbrasil@gmail.com. Atendimento técnico direto de fábrica.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
