import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { Box, ArrowUpRight, Download, Sliders, CheckCircle2 } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpen3D: (product: Product) => void;
  onOpenLeadModal: (productName: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onOpen3D,
  onOpenLeadModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'Todos os Equipamentos' },
    { id: 'caixas-ativas', label: 'Caixas Ativas 2-Vias' },
    { id: 'subwoofers', label: 'Subwoofers' },
    { id: 'processadores-rf', label: 'Processamento & Antenas RF' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="produtos" className="py-32 bg-[#080808] relative border-b border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 mb-3.5">
              <span className="w-8 h-[1px] bg-[#3B82F6]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
                Catálogo de Engenharia Eletroacústica
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F2] tracking-tight uppercase leading-[1.08]">
              Linha Profissional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">KAIROS</span>
            </h2>
            <p className="mt-5 text-base text-[#B8B8B8] font-normal leading-relaxed">
              Equipamentos calibrados em laboratório para pressão sonora extrema sem distorção mecânica. Inspecione os detalhes estruturais em 3D e consulte as fichas técnicas de homologação.
            </p>
          </div>

          {/* Segmented Filter Controls */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-[#121212] border border-white/[0.08] self-start lg:self-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-[#B8B8B8] hover:text-[#F5F5F2] hover:bg-white/[0.03]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with Editorial Asymmetric Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="card-premium flex flex-col justify-between group overflow-hidden"
            >
              {/* Product Top Image Box with High Definition Preview */}
              <div className="relative aspect-[4/3] bg-[#0C0C0C] p-8 flex items-center justify-center overflow-hidden border-b border-white/[0.08]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Floating Metric Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-[2px] bg-[#080808]/90 text-[#60A5FA] border border-[#3B82F6]/40 backdrop-blur-md font-semibold">
                    {product.power}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-[2px] bg-[#080808]/90 text-[#F5F5F2] border border-white/10 backdrop-blur-md">
                    {product.maxSpl}
                  </span>
                </div>

                {/* 3D Viewer Inspection Trigger */}
                <button
                  onClick={() => onOpen3D(product)}
                  className="btn-technical absolute bottom-4 right-4 bg-[#080808]/90 backdrop-blur-md hover:border-[#3B82F6]"
                  title="Abrir estúdio 3D interativo"
                >
                  <Box className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>Inspecionar 3D</span>
                </button>
              </div>

              {/* Product Info Body */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#B8B8B8] uppercase tracking-[0.2em] block mb-1">
                    {product.categoryLabel}
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F5F5F2] group-hover:text-[#7EC2FB] transition-colors mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60A5FA] font-mono mb-4 leading-snug">
                    {product.tagline}
                  </p>
                  <p className="text-xs text-[#B8B8B8] font-normal line-clamp-3 mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Quick Technical Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono p-3.5 rounded-[3px] bg-[#141414] border border-white/[0.08] mb-6">
                    <div>
                      <span className="text-[#7A7A7A] block text-[9px] uppercase tracking-wider">Resposta:</span>
                      <span className="text-[#F5F5F2] truncate block mt-0.5">{product.freqResponse.split('/')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[#7A7A7A] block text-[9px] uppercase tracking-wider">Amplificador:</span>
                      <span className="text-[#F5F5F2] truncate block mt-0.5">{product.ampClass}</span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-6">
                    {product.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#B8B8B8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 shrink-0" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Primary Proposal Button + Download PDF */}
                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="btn-primary flex-1 py-3 text-xs"
                  >
                    <span>Especificações</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </button>

                  <a
                    href={product.manualUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-technical py-3 px-3.5 hover:text-[#60A5FA]"
                    title="Baixar Manual Oficial em PDF"
                    aria-label={`Baixar Manual Oficial ${product.name} em PDF`}
                  >
                    <Download className="w-4 h-4 text-[#60A5FA]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
