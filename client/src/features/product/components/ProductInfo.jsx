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
  basePath,
  isSeller = false,
  isUpdating = false,
  onChangeStatus,
  onChangeVisibility,
  onUpdateStock
}) => {
  const [stockVal, setStockVal] = useState(product.countInStock || 0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const isPrivileged = basePath.startsWith('/admin') || basePath.startsWith('/seller');
  const showLimitedCount = (basePath === '/customer' || basePath === '/') && (product.countInStock > 0 && product.countInStock < 6);

  return (
    <div className="space-y-12">
      {/* Product Headline & Primary Status */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence mode="wait">
            {product.brandId?.name && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key="brand-badge"
              >
                <Badge variant="secondary" className="px-5 py-2 font-black tracking-[0.15em] uppercase text-[10px] bg-gray-900 text-white border-none shadow-lg shadow-gray-200">
                  {product.brandId.name}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          
          {product.primaryCategory?.name && (
            <Badge variant="info" className="px-5 py-2 font-black tracking-[0.15em] uppercase text-[10px] bg-indigo-50 text-indigo-700 border-indigo-100/50">
              {product.primaryCategory.name}
            </Badge>
          )}

          {isSeller && (
            <div className="flex items-center gap-2 ml-auto">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                product.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live Status</span>
            </div>
          )}
        </div>

        <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-6">
          {product.ratingAverage > 0 && (
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm group hover:border-amber-200 transition-colors">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.ratingAverage) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-200'} group-hover:scale-110 transition-transform`} 
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
              <span className="font-black text-gray-900 text-sm">
                {product.ratingAverage.toFixed(1)}
                <span className="text-gray-400 font-bold ml-2">/ 5.0</span>
              </span>
            </div>
          )}
          
          <div className="text-gray-400 font-bold text-sm flex items-center gap-2">
            <FiActivity className="w-4 h-4" />
            <span>{product.ratingCount || 0} customer verifications</span>
          </div>
        </div>
      </div>

      {/* Pricing & Availability Card */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/30 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-24 bg-indigo-50 rounded-full blur-[80px] -mr-12 -mt-12 group-hover:bg-indigo-100 transition-colors duration-700" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Retail Value</p>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-gray-900 tracking-tighter">
                ${product.price?.amount?.toFixed(2) || '0.00'}<span className="text-2xl text-gray-300">.00</span>
              </span>
              {product.price?.oldAmount && (
                <span className="text-xl font-bold text-gray-300 line-through decoration-rose-500/30 decoration-4">
                  ${product.price.oldAmount.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className={`px-6 py-4 rounded-2xl flex items-center gap-4 border-2 transition-all duration-500 ${
              product.countInStock > 0 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-lg shadow-emerald-100/50' 
                : 'bg-rose-50 border-rose-100 text-rose-700 shadow-lg shadow-rose-100/50'
            }`}>
              <div className={`w-3 h-3 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-xs font-black tracking-widest uppercase">
                {product.countInStock > 0
                  ? (isPrivileged
                      ? `${product.countInStock} UNITS IN REPOSITORY`
                      : (showLimitedCount ? `URGENT: ONLY ${product.countInStock} REMAINING` : 'LIMITED STOCK AVAILABLE'))
                  : (isPrivileged ? 'INVENTORY DEPLETED' : 'JOIN WAITING LIST')}
              </span>
            </div>
            {product.price?.oldAmount && (
               <div className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-xl text-center tracking-[0.2em] shadow-lg shadow-indigo-200">
                 SEASONAL OFFER: {(100 - (product.price.amount / product.price.oldAmount * 100)).toFixed(0)}% OFF
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection Matrices (Sizes/Colors) */}
      {((Array.isArray(product.sizes) && product.sizes.length > 0) || (Array.isArray(product.colors) && product.colors.length > 0)) && (
        <div className="space-y-8">
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                  <FiLayers className="text-indigo-600" />
                  Select Dimension
                </h3>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[4.5rem] h-14 border-2 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center ${
                      selectedSize === s 
                        ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200 -translate-y-1' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="space-y-5">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                <FiTag className="text-rose-600" />
                Select Appearance
              </h3>
              <div className="flex flex-wrap gap-4">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`w-14 h-14 rounded-2xl border-4 transition-all duration-500 relative group/color flex items-center justify-center ${
                      selectedColor === color 
                        ? 'border-gray-900 shadow-2xl scale-110' 
                        : 'border-white shadow-md hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <motion.div 
                        layoutId="colorCheck"
                        className="w-2 h-2 rounded-full bg-white shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seller Management Panel */}
      {isSeller && (
        <div className="pt-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-1 shadow-2xl shadow-indigo-500/20 overflow-hidden group">
            <div className="bg-white rounded-[2.3rem] p-8 lg:p-10 transition-all duration-700">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 tracking-tight">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                    <FiShield className="w-6 h-6 text-white" />
                  </div>
                  Inventory Management
                </h3>
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Seller Portal
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Listing Priority</label>
                    <Select
                      value={product.status}
                      onChange={(val) => onChangeStatus && onChangeStatus(val)}
                      options={statusOptions}
                      className="!bg-gray-50 border-none !py-4 rounded-2xl font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Audience Scope</label>
                    <Select
                      value={product.visibility}
                      onChange={(val) => onChangeVisibility && onChangeVisibility(val)}
                      options={visibilityOptions}
                      className="!bg-gray-50 border-none !py-4 rounded-2xl font-bold"
                    />
                  </div>
                </div>
                
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-inner">
                  <div className="flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Available Count</label>
                        <span className="text-xs font-black text-indigo-600">{product.countInStock} total in system</span>
                      </div>
                      <Input 
                        type="number" 
                        value={stockVal} 
                        onChange={(e) => setStockVal(e.target.value)} 
                        min="0"
                        className="!bg-white border-2 border-gray-100 focus:border-indigo-600 !py-4 text-xl font-black rounded-2xl"
                      />
                    </div>
                    <Button 
                      onClick={() => onUpdateStock && onUpdateStock(parseInt(stockVal) || 0)}
                      disabled={isUpdating}
                      className="h-14 px-10 bg-gray-900 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isUpdating ? <LoadingSpinner size="sm" color="white" /> : (
                        <span className="flex items-center gap-2">
                          <FiSave className="w-5 h-5" />
                          SYNC INVENTORY
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Profile Section */}
      {product.brandId && (
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/30 group hover:shadow-2xl transition-all duration-700">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="relative shrink-0">
               <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition-opacity" />
               <div className="relative w-32 h-32 rounded-[2.5rem] bg-gray-50 border border-gray-100 p-6 flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors duration-500">
                  {product.brandId.logo?.secure_url ? (
                    <img 
                      src={product.brandId.logo.secure_url} 
                      alt={product.brandId.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <span className="text-4xl font-black text-gray-200">{product.brandId.name.charAt(0)}</span>
                  )}
               </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                  Verified Partner
                </div>
                <h4 className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {product.brandId.name} Boutique
                </h4>
              </div>
              
              <p className="text-gray-500 font-medium leading-[1.8] max-w-2xl text-lg">
                {product.brandId.description || `Exclusively curated collection from ${product.brandId.name}, focusing on quality and innovation.`}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {product.brandId.website && (
                  <a href={product.brandId.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all duration-300 group/link">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover/link:bg-indigo-600 group-hover/link:text-white transition-colors">
                      <FiGlobe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect</p>
                      <p className="text-sm font-black text-gray-900">Official Website</p>
                    </div>
                  </a>
                )}
                {product.brandId.businessEmail && (
                  <a href={`mailto:${product.brandId.businessEmail}`} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all duration-300 group/link">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm group-hover/link:bg-indigo-600 group-hover/link:text-white transition-colors">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry</p>
                      <p className="text-sm font-black text-gray-900">Direct Support</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

