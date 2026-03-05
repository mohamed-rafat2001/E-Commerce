import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Input, Select, LoadingSpinner } from '../../../shared/ui/index.js';
import {
  FiLayers,
  FiStar,
  FiSave,
  FiGlobe,
  FiHeart,
  FiShare2,
  FiShoppingBag,
  FiActivity,
  FiCheck
} from 'react-icons/fi';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const ProductInfo = ({
  product
}) => {
  const [activeTab, setActiveTab] = useState('story');
  const [stockVal, setStockVal] = useState(product.countInStock || 0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const tabs = [
    { id: 'story', label: 'Story', icon: FiActivity },
    { id: 'specs', label: 'Specs', icon: FiLayers },
    { id: 'brand', label: 'Brand', icon: FiGlobe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-white shadow-2xl shadow-gray-200/50 flex flex-col h-full"
    >
      {/* Category & Rating */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-50 text-indigo-700 border-none font-black px-4 py-2 uppercase tracking-widest text-[9px] rounded-full">
            {product.brandId?.name}
          </Badge>
          <span className="text-gray-300">•</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {product.primaryCategory?.name}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
          <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black text-amber-700">{product.ratingAverage || "5.0"}</span>
          <span className="text-[10px] font-bold text-amber-500/70">({product.ratingCount || 0})</span>
        </div>
      </div>

      {/* Title & Price */}
      <div className="mb-10 space-y-6">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
          {product.name}
        </h1>

        <div className="flex items-end gap-4">
          <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            ${product.price?.amount?.toFixed(2)}
          </span>
          {product.price?.oldAmount && (
            <span className="text-xl font-bold text-gray-400 line-through decoration-rose-500/30 pb-1">
              ${product.price.oldAmount.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Selection Options (Colors & Sizes) */}
      <div className="space-y-8 mb-10">
        {product.colors?.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color Palette</span>
              {selectedColor && <span className="text-[10px] font-bold text-gray-900 uppercase">{selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'scale-110 shadow-xl' : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <div className={`absolute inset-0 rounded-full border-2 ${selectedColor === color ? 'border-indigo-600 scale-[1.15]' : 'border-transparent'}`} />
                  {selectedColor === color && <FiCheck className="w-5 h-5 text-white mix-blend-difference drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes?.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Size</span>
              <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[4rem] h-12 px-4 rounded-xl text-sm font-black transition-all border-2 ${selectedSize === s
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-900/20'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Information Tabs */}
      <div className="mb-10">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[120px] bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <AnimatePresence mode="wait">
            {activeTab === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-600 leading-relaxed font-medium text-sm"
              >
                {product.description}
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-6"
              >
                <Spec label="Asset ID" value={product._id?.slice(-8).toUpperCase()} />
                <Spec label="Stock" value={`${product.countInStock} Units`} />
                <Spec label="Category" value={product.primaryCategory?.name} />
                <Spec label="Sub-Category" value={product.subCategory?.name} />
              </motion.div>
            )}

            {activeTab === 'brand' && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-sm border border-gray-100 shrink-0">
                  <img src={product.brandId?.logo?.secure_url} alt="brand" className="max-h-full max-w-full object-contain" crossOrigin="anonymous" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg">{product.brandId?.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.brandId?.description || "Curated aesthetic excellence."}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-stretch gap-4">
          <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1 group">
            <FiShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="uppercase tracking-widest text-sm">Add to Bag</span>
          </button>
          <button className="w-16 h-[60px] bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
            <FiHeart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Spec = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-black text-gray-900">{value}</p>
  </div>
);

export default ProductInfo;
