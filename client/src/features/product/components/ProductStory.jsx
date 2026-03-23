import React from 'react';
import { FiCheck } from 'react-icons/fi';

const ProductStory = ({ product }) => {
  if (!product) return null;

  return (
    <section className="py-24 bg-slate-50 rounded-[3rem] my-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Content */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight">
              {product.storyTitle || `Crafted for the Modern Collector`}
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed max-w-xl">
              <p>
                {product.description || `The ${product.name} isn't just a product; it's a testament to architectural precision. Developed in collaboration with Studio Flux, this pair features a breathable mesh upper fused with recycled carbon fiber supports.`}
              </p>
              <p>
                {`Every element is designed to minimize weight while maximizing durability, creating a footwear experience that feels like walking on air—if air were incredibly stylish and provided superior arch support.`}
              </p>
            </div>
          </div>

          {/* Feature Checklist */}
          {product.features?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <FiCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-gray-700 font-bold text-sm">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Visual */}
        <div className="relative group">
          <div className="aspect-square bg-amber-100 rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
            <img
              src={product.lifestyleImage || product.coverImage?.secure_url || product.image?.secure_url}
              alt={`${product.name} Lifestyle`}
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Editorial Quote Card */}
          <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl max-w-[280px] border border-gray-100 transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105 z-10">
            <p className="text-gray-900 font-bold italic text-lg mb-2">
              "Exceptional comfort."
            </p>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
              — GQ Editorial Team
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductStory;
