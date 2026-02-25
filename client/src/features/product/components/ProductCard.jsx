import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Badge } from '../../../shared/ui/index.js';
import { FiEdit2, FiTrash2, FiImage, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({
  product,
  basePath = '/seller',
  onEdit,
  onDelete,
  onUpdateStock,
  isUpdating,
  isDeleting
}) => {
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stockValue, setStockValue] = useState(product.countInStock);
  const isPrivileged = basePath.startsWith('/seller') || basePath.startsWith('/admin');
  const showLimitedCount = (basePath === '/customer' || basePath === '/') && (product.countInStock > 0 && product.countInStock < 6);

  const handleSaveStock = () => {
    if (stockValue < 0) {
      toast.error('Stock cannot be negative');
      return;
    }
    if (onUpdateStock) {
      onUpdateStock(product._id, Number(stockValue));
    }
    setIsEditingStock(false);
  };

  const handleCancelStock = () => {
    setStockValue(product.countInStock);
    setIsEditingStock(false);
  };

  const statusColors = {
    active: 'success',
    draft: 'warning',
    inactive: 'danger',
    archived: 'secondary',
  };

  const detailUrl = `${basePath}/${product._id}`;
  const showActions = isPrivileged && Boolean(onEdit || onDelete);
  const canEditStock = Boolean(onUpdateStock);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
    >
      <Link to={detailUrl} className="block">
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          {product.coverImage?.secure_url ? (
            <img 
              src={product.coverImage.secure_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <FiImage className="w-16 h-16" />
              <span className="text-base font-medium">No image</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge variant={statusColors[product.status] || 'secondary'} className="shadow-md">
              {product.status}
            </Badge>
          </div>
          
          {(product.images?.length > 0) && (
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <FiImage className="w-3 h-3" />
                +{product.images.length}
              </span>
            </div>
          )}
          
          {product.ratingAverage > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(product.ratingAverage) ? 'fill-current' : 'fill-gray-300'}`} 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-700">{product.ratingAverage.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
            <Link to={detailUrl} className="hover:text-indigo-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {product.brandId && (
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
              {product.brandId.name || 'Brand N/A'}
            </span>
          )}
          {product.primaryCategory && (
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
              {product.primaryCategory.name || 'Category N/A'}
            </span>
          )}
          {product.subCategory && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">
              {product.subCategory.name || 'Sub N/A'}
            </span>
          )}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && product.sizes.map(size => (
            <span key={size} className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-[11px] font-semibold border border-gray-200">
              {size}
            </span>
          ))}
          {Array.isArray(product.colors) && product.colors.length > 0 && product.colors.map(color => (
            <span 
              key={color} 
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600">
              ${product.price?.amount?.toFixed(2) || '0.00'}
            </span>
            {product.price?.oldAmount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.oldAmount.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canEditStock && isEditingStock ? (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <input
                  type="number"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className="w-16 px-2 py-1 rounded text-sm font-bold outline-none border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  min="0"
                />
                <button
                  onClick={handleSaveStock}
                  disabled={isUpdating}
                  className="p-1.5 rounded text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelStock}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                  product.countInStock > 0 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  {product.countInStock > 0
                    ? (isPrivileged
                        ? `${product.countInStock} in stock`
                        : (showLimitedCount ? `Only ${product.countInStock} left` : 'Available'))
                    : (isPrivileged ? 'Out of stock' : 'Not available')}
                </span>
                {canEditStock && (
                  <button
                    onClick={() => setIsEditingStock(true)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit(product)}
                icon={<FiEdit2 className="w-4 h-4" />}
                className="flex-1 font-semibold hover:shadow-md transition-shadow"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => onDelete(product._id)}
                icon={<FiTrash2 className="w-4 h-4" />}
                loading={isDeleting}
                className="flex-1 font-semibold hover:shadow-md transition-shadow"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;

