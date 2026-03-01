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



  const tabs = [
    { id: 'story', label: 'Story', icon: FiActivity },
    { id: 'specs', label: 'Specs', icon: FiLayers },
    { id: 'brand', label: 'Brand', icon: FiGlobe },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
          <span>{product.brandId?.name}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
          <span className="text-gray-400">{product.primaryCategory?.name}</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-1 text-amber-500">
             {[...Array(5)].map((_, i) => (
               <FiStar key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.ratingAverage || 0) ? 'fill-current' : 'text-gray-200'}`} />
             ))}
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.ratingCount || 0} Verifications</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-black text-gray-900 tracking-tight">
          ${product.price?.amount?.toFixed(2)}
        </span>
        {product.price?.oldAmount && (
          <span className="text-lg font-bold text-gray-300 line-through decoration-rose-500/20">
            ${product.price.oldAmount.toFixed(2)}
          </span>
        )}
      </div>

      {/* Integrated Tabs */}
      <div className="border-t border-gray-100 pt-10">
        <div className="flex gap-8 border-b border-gray-50 mb-8">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
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

        <div className="min-h-[200px]">
           <AnimatePresence mode="wait">
             {activeTab === 'story' && (
               <motion.div
                 key="story"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="text-gray-500 leading-relaxed font-medium text-lg italic"
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
                 className="grid grid-cols-2 gap-y-6 gap-x-12"
               >
                 <SpecItem label="ID" value={product._id?.slice(-8).toUpperCase()} />
                 <SpecItem label="Category" value={product.primaryCategory?.name} />
                 <SpecItem label="Collection" value={product.subCategory?.name} />
                 <SpecItem label="Origin" value={product.brandId?.name} />
               </motion.div>
             )}

             {activeTab === 'brand' && (
               <motion.div
                 key="brand"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex items-center gap-6"
               >
                 <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center p-4 border border-gray-100">
                    <img src={product.brandId?.logo?.secure_url} alt="brand" className="max-h-full opacity-60 grayscale hover:grayscale-0 transition-all" />
                 </div>
                 <div>
                   <h4 className="font-black text-gray-900 mb-1">{product.brandId?.name}</h4>
                   <p className="text-sm text-gray-500 line-clamp-2">{product.brandId?.description}</p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-8 py-10 border-t border-gray-100">
         {product.sizes?.length > 0 && (
           <div className="space-y-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dimensions</span>
             <div className="flex flex-wrap gap-2">
               {product.sizes.map(s => (
                 <button
                   key={s}
                   onClick={() => setSelectedSize(s)}
                   className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${
                     selectedSize === s ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                   }`}
                 >
                   {s}
                 </button>
               ))}
             </div>
           </div>
         )}
      </div>

      {/* Seller Portal */}
      {isSeller && (
        <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black tracking-tight">Inventory Ops</h3>
            <Badge className="bg-white/10 text-white border-transparent">Live Repository</Badge>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={product.status}
                onChange={onChangeStatus}
                options={statusOptions}
                className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
              />
              <Select
                value={product.visibility}
                onChange={onChangeVisibility}
                options={visibilityOptions}
                className="!bg-white/5 !border-white/10 !text-white !rounded-xl"
              />
            </div>
            
            <div className="flex gap-4">
              <Input
                type="number"
                value={stockVal}
                onChange={(e) => setStockVal(e.target.value)}
                className="!bg-white/5 !border-white/10 !text-white !rounded-xl flex-1 text-center font-black"
              />
              <Button
                onClick={() => onUpdateStock(parseInt(stockVal))}
                disabled={isUpdating}
                className="bg-white text-gray-900 font-black px-8 rounded-xl hover:bg-indigo-50"
              >
                {isUpdating ? <LoadingSpinner size="sm" /> : 'SYNC'}
              </Button>
            </div>
          </div>
        </div>
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

