import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../../../shared/ui/index.js';
import { FiEdit2, FiTrash2, FiImage, FiSave, FiX, FiMoreVertical, FiEye, FiPackage, FiTrendingDown, FiMinus, FiPlus } from 'react-icons/fi';
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
  const [showActions, setShowActions] = useState(false);
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

  const statusConfig = {
    active: { variant: 'success', label: 'Active', dot: '🟢' },
    draft: { variant: 'warning', label: 'Draft', dot: '🟡' },
    inactive: { variant: 'danger', label: 'Inactive', dot: '🔴' },
    archived: { variant: 'secondary', label: 'Archived', dot: '⚪' },
  };

  const detailUrl = `${basePath}/${product._id}`;
  const hasActions = isPrivileged && Boolean(onEdit || onDelete);
  const canEditStock = Boolean(onUpdateStock);
  const config = statusConfig[product.status] || statusConfig.draft;

  const stockStatus = product.countInStock === 0
    ? { label: 'Out of stock', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: FiX }
    : product.countInStock <= 5
      ? { label: `${product.countInStock} left`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: FiTrendingDown }
      : { label: `${product.countInStock} in stock`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: FiPackage };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group relative"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image Section */}
      <Link to={detailUrl} className="block relative">
        <div className="relative h-52 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-hidden">
          {product.coverImage?.secure_url ? (
            <img 
              src={product.coverImage.secure_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FiImage className="w-8 h-8 text-gray-300" />
              </div>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">No image</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Status Badge - Top Left */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={config.variant} className="shadow-md backdrop-blur-sm border border-white/20" size="sm">
              <span className="mr-1">{config.dot}</span> {config.label}
            </Badge>
          </div>

          {/* Quick View button on hover */}
          <motion.div 
            initial={false}
            animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3 z-10"
          >
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
              <FiEye className="w-3.5 h-3.5 text-gray-700" />
              <span className="text-xs font-bold text-gray-700">Quick View</span>
            </div>
          </motion.div>

          {/* Image count badge */}
          {(product.images?.length > 0) && (
            <div className="absolute top-3 right-3 z-10 bg-black/60 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border border-white/10">
              <span className="flex items-center gap-1">
                <FiImage className="w-3 h-3" />
                +{product.images.length}
              </span>
            </div>
          )}
          
          {/* Rating badge */}
          {product.ratingAverage > 0 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] font-bold shadow-md border border-white/50">
              <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-800">{product.ratingAverage.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-base text-gray-900 truncate leading-tight mb-1.5">
            <Link to={detailUrl} className="hover:text-indigo-600 transition-colors duration-200">
              {product.name}
            </Link>
          </h3>
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        
        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {product.brandId && (
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-indigo-100/50">
              {product.brandId.name || 'Brand'}
            </span>
          )}
          {product.primaryCategory && (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-100/50">
              {product.primaryCategory.name || 'Category'}
            </span>
          )}
          {product.subCategory && (
            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-purple-100/50">
              {product.subCategory.name || 'Sub'}
            </span>
          )}
        </div>

        {/* Variants Row (Sizes & Colors) */}
        {(Array.isArray(product.sizes) && product.sizes.length > 0) || (Array.isArray(product.colors) && product.colors.length > 0) ? (
          <div className="flex items-center gap-3 py-2 px-3 bg-gray-50/80 rounded-xl">
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Sizes:</span>
                <div className="flex gap-1">
                  {product.sizes.slice(0, 4).map(size => (
                    <span key={size} className="px-1.5 py-0.5 bg-white text-gray-600 rounded text-[10px] font-semibold border border-gray-200 shadow-sm">
                      {size}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="px-1.5 py-0.5 bg-white text-gray-400 rounded text-[10px] font-semibold border border-gray-200">
                      +{product.sizes.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Colors:</span>
                <div className="flex -space-x-1">
                  {product.colors.slice(0, 5).map(color => (
                    <span 
                      key={color} 
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200/50"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-gray-500 ring-1 ring-gray-200/50">
                      +{product.colors.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Price & Stock Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-gray-900 tabular-nums">
              ${product.price?.amount?.toFixed(2) || '0.00'}
            </span>
            {product.price?.oldAmount && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ${product.price.oldAmount.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Stock Section */}
          <div className="flex items-center">
            {canEditStock && isEditingStock ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200"
              >
                <button
                  onClick={() => setStockValue(prev => Math.max(0, Number(prev) - 1))}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                >
                  <FiMinus className="w-3 h-3" />
                </button>
                <input
                  type="number"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className="w-12 px-1 py-1 rounded-lg text-xs font-bold text-center outline-none bg-white border border-gray-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  min="0"
                />
                <button
                  onClick={() => setStockValue(prev => Number(prev) + 1)}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
                <button
                  onClick={handleSaveStock}
                  disabled={isUpdating}
                  className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50"
                >
                  <FiSave className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancelStock}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border} border`}>
                  <stockStatus.icon className="w-3 h-3" />
                  {isPrivileged 
                    ? stockStatus.label
                    : (product.countInStock > 0 
                      ? (showLimitedCount ? `Only ${product.countInStock} left` : 'Available')
                      : 'Not available'
                    )
                  }
                </span>
                {canEditStock && (
                  <button
                    onClick={() => setIsEditingStock(true)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {hasActions && (
          <div className="flex gap-2 pt-1">
            {onEdit && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit(product)}
                icon={<FiEdit2 className="w-3.5 h-3.5" />}
                className="flex-1 !text-xs !font-bold !rounded-xl !py-2 hover:!bg-indigo-50 hover:!text-indigo-600 hover:!border-indigo-200 transition-all"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => onDelete(product._id)}
                icon={<FiTrash2 className="w-3.5 h-3.5" />}
                loading={isDeleting}
                className="flex-1 !text-xs !font-bold !rounded-xl !py-2"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Hover shadow effect */}
      <style>{`
        .group:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          transform: translateY(-2px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
