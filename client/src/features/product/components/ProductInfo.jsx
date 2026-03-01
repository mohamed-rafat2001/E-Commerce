import { useState } from 'react';
import { Badge, Button, Select, Input } from '../../../shared/ui/index.js';
import { FiLayers, FiStar, FiSave, FiGlobe, FiMail, FiPhone, FiShield, FiTag, FiShoppingBag } from 'react-icons/fi';

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

  const isPrivileged = basePath.startsWith('/admin') || basePath.startsWith('/seller');
  const showLimitedCount = (basePath === '/customer' || basePath === '/') && (product.countInStock > 0 && product.countInStock < 6);

  return (
    <div className="space-y-8 lg:max-w-xl">
      {/* Product Headline */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {product.brandId?.name && (
            <Badge variant="secondary" className="px-3 py-1 font-bold tracking-wide uppercase text-[10px]">
              {product.brandId.name}
            </Badge>
          )}
          {product.primaryCategory?.name && (
            <Badge variant="info" className="px-3 py-1 font-bold tracking-wide uppercase text-[10px]">
              {product.primaryCategory.name}
            </Badge>
          )}
          {isSeller && (
            <>
              <Badge 
                variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'secondary'}
                className="px-3 py-1 font-bold tracking-wide uppercase text-[10px]"
              >
                {product.status}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 font-bold tracking-wide uppercase text-[10px]">
                {product.visibility}
              </Badge>
            </>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
          {product.name}
        </h1>

        {product.ratingAverage > 0 && (
          <div className="flex items-center gap-3 mb-6 bg-amber-50/50 w-fit px-4 py-2 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.ratingAverage) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="font-bold text-gray-900 text-sm">
              {product.ratingAverage.toFixed(1)}
              <span className="text-gray-500 font-medium ml-1">({product.ratingCount} reviews)</span>
            </span>
          </div>
        )}

        {/* Price & Stock Container */}
        <div className="flex items-end justify-between border-t border-gray-100 pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ${product.price?.amount?.toFixed(2) || '0.00'}
            </span>
            {product.price?.oldAmount && (
              <span className="text-lg font-bold text-gray-400 line-through decoration-gray-300">
                ${product.price.oldAmount.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border shadow-sm ${
            product.countInStock > 0 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100/50' 
              : 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100/50'
          }`}>
            <FiShoppingBag className="w-4 h-4" />
            <span className="text-sm font-bold">
              {product.countInStock > 0
                ? (isPrivileged
                    ? `${product.countInStock} in stock`
                    : (showLimitedCount ? `Only ${product.countInStock} left` : 'In Stock'))
                : (isPrivileged ? 'Out of stock' : 'Not available')}
            </span>
          </div>
        </div>
      </div>

      {/* Product Variants (Sizes/Colors) */}
      {((Array.isArray(product.sizes) && product.sizes.length > 0) || (Array.isArray(product.colors) && product.colors.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiLayers className="w-4 h-4 text-indigo-400" />
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiTag className="w-4 h-4 text-rose-400" />
                Select Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    className="w-10 h-10 rounded-full border-[3px] border-white shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seller Controls */}
      {isSeller && (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-1 overflow-hidden shadow-2xl">
          <div className="bg-white rounded-[1.4rem] p-6 lg:p-8">
            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 flex items-center gap-3 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <FiShield className="w-4 h-4 text-indigo-600" />
              </div>
              Seller Management
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Listing Status"
                  value={product.status}
                  onChange={(val) => onChangeStatus && onChangeStatus(val)}
                  options={statusOptions}
                />
                <Select
                  label="Visibility"
                  value={product.visibility}
                  onChange={(val) => onChangeVisibility && onChangeVisibility(val)}
                  options={visibilityOptions}
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Inventory Adjust</label>
                <div className="flex gap-3">
                  <Input 
                    type="number" 
                    value={stockVal} 
                    onChange={(e) => setStockVal(e.target.value)} 
                    min="0"
                    className="flex-1 !bg-white"
                  />
                  <Button 
                    onClick={() => onUpdateStock && onUpdateStock(parseInt(stockVal) || 0)}
                    loading={isUpdating}
                    icon={<FiSave className="w-4 h-4" />}
                    className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Section */}
      {product.brandId && (
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200/60">
          <div className="flex gap-5">
            {product.brandId.logo?.secure_url ? (
              <img 
                src={product.brandId.logo.secure_url} 
                alt={product.brandId.name}
                className="w-20 h-20 rounded-2xl object-cover bg-white border border-gray-200 shadow-sm shrink-0"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-gray-300 select-none">B</span>
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-lg font-black text-gray-900 mb-1 tracking-tight">{product.brandId.name}</h4>
              <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed mb-3">
                {product.brandId.description || "Official brand store."}
              </p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                {product.brandId.website && (
                  <a href={product.brandId.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    <FiGlobe className="w-3.5 h-3.5" /> Website
                  </a>
                )}
                {product.brandId.businessEmail && (
                  <a href={`mailto:${product.brandId.businessEmail}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 transition-colors">
                    <FiMail className="w-3.5 h-3.5" /> Email Contact
                  </a>
                )}
                {product.brandId.businessPhone && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600">
                    <FiPhone className="w-3.5 h-3.5" /> {product.brandId.businessPhone}
                  </span>
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
