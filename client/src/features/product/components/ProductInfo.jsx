import { useState } from 'react';
import { Badge, Button, Select, Input } from '../../../shared/ui/index.js';
import { FiTag, FiLayers, FiBox, FiStar, FiSave, FiGlobe, FiMail, FiPhone, FiAward, FiShield } from 'react-icons/fi';

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
    <div className="space-y-8">
      {/* Product Header */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{product.name}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {product.brandId?.name && (
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
              {product.brandId.name}
            </Badge>
          )}
          {product.primaryCategory?.name && (
            <Badge variant="info" className="px-4 py-2 text-sm font-semibold">
              {product.primaryCategory.name}
            </Badge>
          )}
          {product.subCategory?.name && (
            <Badge variant="warning" className="px-4 py-2 text-sm font-semibold">
              {product.subCategory.name}
            </Badge>
          )}
          <Badge 
            variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'secondary'}
            className="px-4 py-2 text-sm font-semibold"
          >
            {product.status}
          </Badge>
          <Badge className="px-4 py-2 text-sm font-semibold">
            {product.visibility}
          </Badge>
        </div>

        <div className="flex flex-wrap items-baseline gap-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-indigo-600">
              ${product.price?.amount?.toFixed(2) || '0.00'}
            </span>
            {product.price?.oldAmount && (
              <span className="text-xl text-gray-400 line-through">
                ${product.price.oldAmount.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-lg font-bold px-4 py-2 rounded-full ${
              product.countInStock > 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {product.countInStock > 0
                ? (isPrivileged
                    ? `${product.countInStock} in stock`
                    : (showLimitedCount ? `Only ${product.countInStock} left` : 'Available'))
                : (isPrivileged ? 'Out of stock' : 'Not available')}
            </span>
            
            {product.ratingAverage > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.ratingAverage) ? 'fill-current' : 'fill-gray-300'}`} 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.ratingAverage.toFixed(1)} ({product.ratingCount})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiLayers className="w-5 h-5 text-indigo-500" />
              Available Sizes
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(s => (
                <span key={s} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-semibold rounded-full border border-gray-200 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-indigo-500" />
              Available Colors
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(color => (
                <div key={color} className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  <span className="text-sm font-medium text-gray-700">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brand Section */}
      {product.brandId && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            Brand Information
          </h3>
          <div className="flex flex-col lg:flex-row gap-8">
            {product.brandId.logo?.secure_url && (
              <div className="flex-shrink-0">
                <img 
                  src={product.brandId.logo.secure_url} 
                  alt={product.brandId.name}
                  className="w-24 h-24 rounded-2xl object-contain border border-gray-200 shadow-md"
                  crossOrigin="anonymous"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">{product.brandId.name}</h4>
              {product.brandId.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">{product.brandId.description}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {product.brandId.website && (
                  <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-xl">
                    <FiGlobe className="w-5 h-5 text-indigo-500" />
                    <a 
                      href={product.brandId.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {product.brandId.businessEmail && (
                  <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-xl">
                    <FiMail className="w-5 h-5 text-indigo-500" />
                    <a 
                      href={`mailto:${product.brandId.businessEmail}`}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                    >
                      {product.brandId.businessEmail}
                    </a>
                  </div>
                )}
                {product.brandId.businessPhone && (
                  <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-xl">
                    <FiPhone className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">{product.brandId.businessPhone}</span>
                  </div>
                )}
              </div>
              {product.brandId.ratingAverage > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(product.brandId.ratingAverage) ? 'text-amber-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                      {product.brandId.ratingAverage.toFixed(1)} 
                      <span className="text-gray-500 font-normal"> ({product.brandId.ratingCount} reviews)</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seller Actions */}
      {isSeller && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiShield className="w-6 h-6 text-indigo-600" />
            Seller Controls
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Select
                label="Status"
                value={product.status}
                onChange={(val) => onChangeStatus && onChangeStatus(val)}
                options={statusOptions}
              />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Select
                label="Visibility"
                value={product.visibility}
                onChange={(val) => onChangeVisibility && onChangeVisibility(val)}
                options={visibilityOptions}
              />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Stock Management</label>
              <div className="flex gap-3">
                <Input 
                  type="number" 
                  value={stockVal} 
                  onChange={(e) => setStockVal(e.target.value)} 
                  min="0"
                  className="flex-1"
                />
                <Button 
                  onClick={() => onUpdateStock && onUpdateStock(parseInt(stockVal) || 0)}
                  loading={isUpdating}
                  icon={<FiSave className="w-4 h-4" />}
                  className="px-4"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
