import React, { useState } from 'react';
import { Product } from '../types';
import { Product3DViewer } from './Product3DViewer';
import { X, FileText, Download, CheckCircle, Box, Volume2, Shield, Eye, ArrowUpRight } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onOpenLeadModal: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOpenLeadModal,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-[#0C0C0C] border border-white/15 rounded-none shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#C7A66A] uppercase font-semibold">
              {product.categoryLabel}
            </span>
            <span className="text-white/20 font-mono">/</span>
            <h2 id="modal-product-title" className="font-heading font-bold text-xl text-[#F5F5F2] tracking-tight">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShow3D(!show3D)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all ${
                show3D
                  ? 'bg-[#C7A66A] text-black font-semibold border-[#C7A66A]'
                  : 'bg-[#181818] border-white/15 text-[#B8B8B8] hover:text-[#F5F5F2] hover:border-[#C7A66A]/40'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{show3D ? 'Ver Galeria' : 'Estúdio 3D'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/10 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {show3D ? (
            <div className="mb-8 border border-white/10 bg-[#080808]">
              <Product3DViewer product={product} onClose={() => setShow3D(false)} />
            </div>
          ) : (
            /* Product Gallery + Overview */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              {/* Image Previews */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative aspect-[4/3] bg-[#060606] border border-white/10 overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#B8B8B8] bg-black/80 px-2.5 py-1 border border-white/10">
                    FOTO {selectedImage + 1} DE {product.images.length} · BANCADA WOX
                  </div>
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-20 h-20 shrink-0 bg-[#080808] border transition-all p-1.5 flex items-center justify-center ${
                          selectedImage === idx
                            ? 'border-[#C7A66A] ring-1 ring-[#C7A66A]'
                            : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                        }`}
                      >
                        <img src={img} alt={`Miniatura ${idx}`} className="max-h-full max-w-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Summary & Action Card */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-1 bg-[#C7A66A]/10 border border-[#C7A66A]/30 text-[#C7A66A] text-xs font-mono uppercase tracking-wider mb-3">
                    {product.power} · {product.maxSpl}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#F5F5F2] tracking-tight mb-3">
                    {product.tagline}
                  </h3>
                  <p className="text-sm text-[#B8B8B8] font-light leading-relaxed mb-6 font-sans">
                    {product.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2.5 mb-6">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#B8B8B8]">
                        <CheckCircle className="w-4 h-4 text-[#C7A66A] shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                  {/* Direct PDF Download Button */}
                  <a
                    href={product.manualUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    <Download className="w-4 h-4 text-[#C7A66A]" />
                    <span>Baixar Manual Técnico em PDF</span>
                  </a>

                  {/* Lead Proposal Button */}
                  <button
                    onClick={() => onOpenLeadModal(product.name)}
                    className="btn-primary w-full"
                  >
                    <span>Solicitar Cotação / Teste In-Loco</span>
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Official Technical Specifications Table */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-4 h-4 text-[#C7A66A]" />
              <h4 className="font-heading font-bold text-base text-[#F5F5F2] uppercase tracking-wider">
                Especificações Técnicas Oficiais de Laboratório
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Modelo</span>
                <span className="text-[#F5F5F2] font-medium font-sans">{product.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Tipo de Sistema</span>
                <span className="text-[#F5F5F2] font-medium font-sans">{product.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Potência de Saída</span>
                <span className="text-[#C7A66A] font-bold font-mono">{product.power}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">SPL Máximo Contínuo / Pico</span>
                <span className="text-[#C7A66A] font-bold font-mono">{product.maxSpl}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Resposta de Frequência (-3dB)</span>
                <span className="text-[#F5F5F2] font-medium font-mono">{product.freqResponse}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Topologia de Amplificação</span>
                <span className="text-[#F5F5F2] font-medium font-sans">{product.ampClass}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Transdutor de Graves (LF)</span>
                <span className="text-[#F5F5F2] font-medium font-sans">{product.lfTransducer}</span>
              </div>
              {product.hfTransducer && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#7A7A7A] font-mono">Transdutor de Agudos (HF)</span>
                  <span className="text-[#F5F5F2] font-medium font-sans">{product.hfTransducer}</span>
                </div>
              )}
              {product.crossover && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#7A7A7A] font-mono">Frequência de Crossover</span>
                  <span className="text-[#F5F5F2] font-medium font-mono">{product.crossover}</span>
                </div>
              )}
              {product.coverage && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#7A7A7A] font-mono">Dispersão Polar (H × V)</span>
                  <span className="text-[#F5F5F2] font-medium font-mono">{product.coverage}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-white/5 md:col-span-2">
                <span className="text-[#7A7A7A] font-mono">Processamento Digital (DSP)</span>
                <span className="text-[#E2C99A] font-medium text-right font-mono">{product.dspFeatures}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Dimensões (L × A × P)</span>
                <span className="text-[#F5F5F2] font-medium font-mono">{product.dimensions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Peso Estrutural</span>
                <span className="text-[#F5F5F2] font-medium font-mono">{product.weight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Conectores de Áudio</span>
                <span className="text-[#F5F5F2] font-medium font-mono">{product.inputOutput}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#7A7A7A] font-mono">Alimentação AC</span>
                <span className="text-[#F5F5F2] font-medium font-mono">{product.voltage}</span>
              </div>
            </div>
          </div>

          {/* Application Scenarios */}
          {product.applications && product.applications.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="font-heading font-bold text-base text-[#F5F5F2] uppercase tracking-wider mb-4">
                Cenários de Aplicação Homologados
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.applications.map((app, idx) => (
                  <div key={idx} className="p-4 bg-[#121212] border border-white/5 hover:border-[#C7A66A]/20 transition-colors">
                    <h5 className="font-bold text-sm text-[#C7A66A] mb-1 font-heading">{app.title}</h5>
                    <p className="text-xs text-[#B8B8B8] font-light leading-relaxed font-sans">{app.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
