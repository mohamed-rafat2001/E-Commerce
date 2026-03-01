import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2, FiPackage, FiInfo, FiTruck } from 'react-icons/fi';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import useProductDetailPage from '../hooks/useProductDetailPage.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const {
    product,
    isLoading,
    error,
    basePath,
    isSeller,
    gallery,
    isUpdating,
    onChangeStatus,
    onChangeVisibility,
    onUpdateStock
  } = useProductDetailPage(id);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 max-w-7xl mx-auto my-8"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="relative">
          <LoadingSpinner size="lg" color="indigo" />
          <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-30 animate-pulse" />
        </div>
        <p className="mt-6 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">Loading Product...</p>
      </motion.div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={basePath} className="inline-flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors font-semibold grow-0">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-16 bg-white border border-gray-100 rounded-3xl text-center shadow-lg"
        >
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 font-medium">Sorry, we couldn't load the product details. It may have been removed or the URL is incorrect.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link 
          to={basePath} 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors group tracking-wide uppercase"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-indigo-200 group-hover:bg-indigo-50 shadow-sm transition-all duration-300">
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
          </div>
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Gallery Section */}
        <div className="lg:sticky top-8 self-start space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden border border-gray-100 p-2">
            <div className="rounded-[1.5rem] overflow-hidden bg-gray-50/50">
              <ProductGallery gallery={gallery} enableZoom={true} />
            </div>
          </div>
          
          {/* Action Buttons (Hidden for sellers on their own dashboard) */}
          {!isSeller && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5">
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-4 border border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50 rounded-2xl transition-all duration-300 text-gray-400 hover:text-rose-500 shadow-sm hover:shadow-md">
                <FiHeart className="w-6 h-6" />
              </button>
              <button className="p-4 border border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50 rounded-2xl transition-all duration-300 text-gray-400 hover:text-indigo-500 shadow-sm hover:shadow-md">
                <FiShare2 className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Product Information Section */}
        <div>
          <ProductInfo 
            product={product} 
            basePath={basePath} 
            isSeller={isSeller}
            isUpdating={isUpdating}
            onChangeStatus={onChangeStatus}
            onChangeVisibility={onChangeVisibility}
            onUpdateStock={onUpdateStock}
          />
        </div>
      </div>

      {/* Additional Details Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <FiInfo className="w-5 h-5 text-white" />
              </div>
              Product Description
            </h2>
            <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:text-gray-900 prose-a:text-indigo-600">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight">Specifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">SKU</span>
                <span className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{product._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Category</span>
                <span className="text-sm font-semibold text-gray-900">{product.primaryCategory?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Subcategory</span>
                <span className="text-sm font-semibold text-gray-900">{product.subCategory?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Brand</span>
                <span className="text-sm font-semibold text-gray-900">{product.brandId?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Condition</span>
                <span className="text-sm font-semibold text-gray-900">Brand New</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center gap-6 rounded-3xl p-8 border border-indigo-100/50">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
              <FiTruck className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight">Fast Shipping</h3>
              <p className="text-sm text-gray-600 font-medium">Free delivery on orders over $50. Arrives in 3-5 days.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
