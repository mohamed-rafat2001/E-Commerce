import { useState } from 'react';
import { Badge, Button, Select, Input } from '../../../shared/ui/index.js';
import { FiTag, FiLayers, FiBox, FiStar, FiSave } from 'react-icons/fi';

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

  const isPrivileged = basePath === '/admin' || basePath === '/seller';
  const showLimitedCount = (basePath === '/customer' || basePath === '/') && (product.countInStock > 0 && product.countInStock < 6);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {product.brandId?.name && (
          <Badge variant="secondary">{product.brandId.name}</Badge>
        )}
        {product.primaryCategory?.name && (
          <Badge variant="info">{product.primaryCategory.name}</Badge>
        )}
        {product.subCategory?.name && (
          <Badge variant="warning">{product.subCategory.name}</Badge>
        )}
        <Badge variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'secondary'}>
          {product.status}
        </Badge>
        <Badge>{product.visibility}</Badge>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-indigo-600">
          ${product.price?.amount?.toFixed(2) || '0.00'}
        </span>
        <span className={`text-sm font-semibold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {product.countInStock > 0
            ? (isPrivileged
                ? `${product.countInStock} in stock`
                : (showLimitedCount ? `Only ${product.countInStock} left` : 'Available'))
            : (isPrivileged ? 'Out of stock' : 'Not available')}
        </span>
      </div>

      {Array.isArray(product.sizes) && product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Available Sizes</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiTag className="w-4 h-4" />
          <span>Slug:</span>
          <span className="font-medium">{product.slug}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiLayers className="w-4 h-4" />
          <span>Category:</span>
          <span className="font-medium">{product.primaryCategory?.name || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiBox className="w-4 h-4" />
          <span>Visibility:</span>
          <span className="font-medium">{product.visibility}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiStar className="w-4 h-4 text-amber-400" />
          <span>Rating:</span>
          <span className="font-medium">{(product.ratingAverage || 0).toFixed(1)} ({product.ratingCount || 0})</span>
        </div>
      </div>

      <div className="pt-2">
        <Button variant="secondary" asChild>
          <a href={`${basePath}/products`}>Back to list</a>
        </Button>
      </div>

      {isSeller && (
        <div className="mt-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
          <p className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={stockVal} 
                  onChange={(e) => setStockVal(e.target.value)} 
                  min="0"
                />
                <Button 
                  onClick={() => onUpdateStock && onUpdateStock(parseInt(stockVal) || 0)}
                  loading={isUpdating}
                  icon={<FiSave className="w-4 h-4" />}
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
