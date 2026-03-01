import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button, Select, Input, LoadingSpinner } from '../../../shared/ui/index.js';
import { 
  FiLayers, 
  FiStar, 
  FiSave, 
  FiGlobe, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiTag, 
  FiShoppingBag,
  FiChevronDown,
  FiActivity
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
  product, 
  isSeller = false,
  isUpdating = false,
  onChangeStatus,
  onChangeVisibility,
  onUpdateStock
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
    <div className="space-y-10 md:space-y-12">
      {/* Header */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
          <span className="bg-indigo-50 px-3 py-1 rounded-lg">{product.brandId?.name}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200 hidden sm:block" />
          <span className="text-gray-400">{product.primaryCategory?.name}</span>
        </div>
        
        <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4 md:gap-6">
           <div className="flex items-center gap-1 text-amber-500">
             {[...Array(5)].map((_, i) => (
               <FiStar key={i} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < Math.floor(product.ratingAverage || 0) ? 'fill-current' : 'text-gray-200'}`} />
             ))}
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none pt-0.5">
             {product.ratingCount || 0} Verifications
           </span>
        </div>
      </div>

      {/* Price & Badge */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline flex-wrap gap-2 md:gap-4">
          <span className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            ${product.price?.amount?.toFixed(2)}
          </span>
          {product.price?.oldAmount && (
            <span className="text-sm md:text-lg font-bold text-gray-300 line-through decoration-rose-500/20">
              ${product.price.oldAmount.toFixed(2)}
            </span>
          )}
        </div>
        
        {product.countInStock <= 5 && product.countInStock > 0 && (
          <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-[9px] font-black text-rose-600 uppercase tracking-widest animate-pulse">
            Only {product.countInStock} Left
          </div>
        )}
      </div>

      {/* Integrated Tabs */}
      <div className="border-t border-gray-100 pt-8 md:pt-10">
        <div className="flex gap-6 md:gap-8 border-b border-gray-50 mb-8 overflow-x-auto no-scrollbar">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                 activeTab === tab.id ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'
               }`}
             >
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
               )}
             </button>
           ))}
        </div>

        <div className="min-h-[160px] md:min-h-[200px]">
           <AnimatePresence mode="wait">
             {activeTab === 'story' && (
               <motion.div
                 key="story"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-gray-500 leading-relaxed font-medium text-lg italic pr-4"
               >
                 "{product.description}"
               </motion.div>
             )}

             {activeTab === 'specs' && (
               <motion.div
                 key="specs"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="grid grid-cols-1 xs:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-8 md:gap-x-12"
               >
                 <SpecItem label="Asset ID" value={product._id?.slice(-8).toUpperCase()} />
                 <SpecItem label="Category" value={product.primaryCategory?.name} />
                 <SpecItem label="Lineage" value={product.subCategory?.name} />
                 <SpecItem label="Entity" value={product.brandId?.name} />
               </motion.div>
             )}

             {activeTab === 'brand' && (
               <motion.div
                 key="brand"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
               >
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-50 flex items-center justify-center p-4 border border-gray-100 flex-shrink-0">
                    <img 
                      src={product.brandId?.logo?.secure_url} 
                      alt="brand" 
                      className="max-h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500" 
                      crossOrigin="anonymous"
                    />
                 </div>
                 <div>
                   <h4 className="font-black text-gray-900 mb-1">{product.brandId?.name} Boutique</h4>
                   <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                     {product.brandId?.description || "Curated aesthetic excellence."}
                   </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Product Options Selection */}
      <div className="space-y-8 md:space-y-10 py-8 md:py-10 border-t border-gray-100">
         {/* Colors RESTORED */}
         {product.colors?.length > 0 && (
           <div className="space-y-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Palette Selection</span>
             <div className="flex flex-wrap gap-3">
               {product.colors.map(color => (
                 <button
                   key={color}
                   onClick={() => setSelectedColor(color)}
                   className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all p-1 ${
                     selectedColor === color ? 'border-gray-900 scale-110 shadow-lg' : 'border-transparent'
                   }`}
                   title={color}
                 >
                   <div 
                     className="w-full h-full rounded-full shadow-inner border border-black/5" 
                     style={{ backgroundColor: color }}
                   />
                 </button>
               ))}
             </div>
           </div>
         )}

         {/* Sizes */}
         {product.sizes?.length > 0 && (
           <div className="space-y-4">
             <div className="flex items-center justify-between pr-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dimension Matrix</span>
               <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Guide</button>
             </div>
             <div className="flex flex-wrap gap-2 md:gap-3">
               {product.sizes.map(s => (
                 <button
                   key={s}
                   onClick={() => setSelectedSize(s)}
                   className={`min-w-[3.5rem] md:min-w-[4.5rem] px-4 md:px-6 py-3 rounded-xl text-xs font-black transition-all border ${
                     selectedSize === s 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xl -translate-y-0.5' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                   }`}
                 >
                   {s}
                 </button>
               ))}
             </div>
           </div>
         )}
      </div>

      {/* Seller Portal Ops */}
      {isSeller && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 md:p-10 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <FiSave className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Repository Ops</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Live Management</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-transparent text-[9px] px-3 py-1">Synced</Badge>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Lifecycle</p>
                  <Select
                    value={product.status}
                    onChange={(val) => onChangeStatus(val)}
                    options={statusOptions}
                    className="!bg-white/5 !border-white/10 !text-white !rounded-xl !py-4"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Scope</p>
                  <Select
                    value={product.visibility}
                    onChange={(val) => onChangeVisibility(val)}
                    options={visibilityOptions}
                    className="!bg-white/5 !border-white/10 !text-white !rounded-xl !py-4"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Inventory Density</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="number"
                    value={stockVal}
                    onChange={(e) => setStockVal(e.target.value)}
                    className="!bg-white/5 !border-white/10 !text-white !rounded-xl flex-1 text-center font-black text-xl !py-4"
                  />
                  <Button
                    onClick={() => onUpdateStock(parseInt(stockVal))}
                    disabled={isUpdating}
                    className="w-full sm:w-auto bg-white text-gray-900 font-black px-12 rounded-xl hover:bg-indigo-50 h-14 transition-all active:scale-95"
                  >
                    {isUpdating ? <LoadingSpinner size="sm" /> : 'UPDATE REFRESH'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SpecItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-black text-gray-900 tracking-tight">{value || '--'}</p>
  </div>
);


export default ProductInfo;

