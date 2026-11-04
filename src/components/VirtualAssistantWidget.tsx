import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mail, Sparkles, UserCheck } from 'lucide-react';

interface ChatMessage {
  sender: 'assistant' | 'user';
  text: string;
  time: string;
}

export const VirtualAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Olá! Sou a Mariana, engenheira de aplicação e assistente virtual da WOX FABER. Como posso lhe ajudar com nossos sistemas eletroacústicos ou cotações hoje?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      const replyText = data.reply || 'Para atendimento técnico e propostas comerciais, por favor envie um e-mail para woxfaberbrasil@gmail.com.';

      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Nossa engenharia atende diretamente pelo e-mail woxfaberbrasil@gmail.com. Envie sua mensagem para receber uma proposta!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Floating Button on the Left Side */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3.5 p-2 pr-5 rounded-full bg-[#101010] border border-[#3B82F6]/50 shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:border-[#60A5FA] transition-all duration-300 cursor-pointer"
          title="Falar com Mariana — Assistente Virtual WOX FABER"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#3B82F6] shrink-0 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
              alt="Mariana - Assistente Virtual WOX FABER"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#101010] rounded-full animate-pulse" />
          </div>

          <div className="text-left">
            <span className="text-[10px] font-mono text-[#60A5FA] uppercase tracking-wider block font-semibold">
              Especialista Online
            </span>
            <span className="text-xs font-heading font-bold text-[#F5F5F2] block">
              Falar com Mariana
            </span>
          </div>

          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2563EB] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
            1
          </span>
        </button>
      )}

      {/* Chat Window Modal on the Left Side */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[520px] bg-[#0C0C0C] border border-[#3B82F6]/50 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#121212] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#3B82F6] shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  alt="Mariana"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#F5F5F2] uppercase tracking-wider">
                  Mariana — Engenharia WOX
                </h3>
                <span className="text-[10px] font-mono text-[#60A5FA] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
                  Atendimento Técnico & E-mail
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/10 transition-colors"
              aria-label="Minimizar assistente"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080808] text-xs font-sans">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-[4px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#2563EB] text-white rounded-br-none'
                      : 'bg-[#141414] border border-white/10 text-[#F5F5F2] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] font-mono text-[#7A7A7A] mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-[4px] bg-[#141414] border border-white/10 w-fit text-[#60A5FA]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] font-mono">Mariana está digitando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#101010] border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px] font-mono">
            <button
              onClick={() => handleSendMessage('Qual a potência da caixa KRS315A?')}
              className="px-2 py-1 rounded bg-[#181818] border border-white/10 text-[#B8B8B8] hover:text-[#F5F5F2] hover:border-[#3B82F6] shrink-0"
            >
              Sobre a KRS315A
            </button>
            <button
              onClick={() => handleSendMessage('Como funciona a garantia de troca modular?')}
              className="px-2 py-1 rounded bg-[#181818] border border-white/10 text-[#B8B8B8] hover:text-[#F5F5F2] hover:border-[#3B82F6] shrink-0"
            >
              Troca Modular
            </button>
            <button
              onClick={() => handleSendMessage('Como solicitar orçamento por e-mail?')}
              className="px-2 py-1 rounded bg-[#181818] border border-white/10 text-[#B8B8B8] hover:text-[#F5F5F2] hover:border-[#3B82F6] shrink-0"
            >
              Contato por E-mail
            </button>
          </div>

          {/* Email Direct Action Banner */}
          <div className="px-3 py-2 bg-[#0A0A0A] border-t border-white/5 flex items-center justify-between text-[11px]">
            <a
              href="mailto:woxfaberbrasil@gmail.com?subject=Contato%20via%20Assistente%20Virtual%20Mariana"
              className="flex items-center gap-1.5 text-[#60A5FA] hover:underline font-mono font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>woxfaberbrasil@gmail.com</span>
            </a>
            <span className="text-[9px] font-mono text-[#7A7A7A]">DIRETO DE FÁBRICA</span>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#121212] border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Digite sua dúvida para a Mariana..."
              className="flex-1 px-3 py-2 rounded-[3px] bg-[#1a1a1a] border border-white/10 text-[#F5F5F2] text-xs focus:outline-none focus:border-[#3B82F6]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-3.5 py-2 rounded-[3px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
