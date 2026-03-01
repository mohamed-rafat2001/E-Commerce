import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiShield, 
  FiRefreshCw, 
  FiChevronRight,
  FiZap
} from 'react-icons/fi';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import useProductDetailPage from '../hooks/useProductDetailPage.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" color="indigo" />
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Perspective</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6">Identifier Unknown</h2>
        <p className="text-gray-500 mb-12">The requested asset is not available in our current repository.</p>
        <Link to="/" className="inline-block px-8 py-4 bg-gray-900 text-white font-black rounded-2xl">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/30 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/20 rounded-full blur-[100px] -ml-72 -mb-72 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 relative z-10">
        {/* Responsive Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-16">
          <button 
            onClick={() => navigate(isSeller ? '/seller/inventory' : basePath)}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
            <span className="text-indigo-600">Product Detail</span>
            <div className="w-6 lg:w-8 h-px bg-gray-100" />
            <span>Specifications</span>
            <div className="w-6 lg:w-8 h-px bg-gray-100" />
            <span>Review Matrix</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24">
          {/* Visual Column */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100/50 shadow-sm"
            >
              <ProductGallery gallery={gallery} enableZoom={true} />
            </motion.div>
            
            {/* Minimal Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-6 md:py-8 border-y border-gray-50">
               <TrustNode icon={FiShield} label="Secured" />
               <TrustNode icon={FiRefreshCw} label="Exchangeable" />
               <TrustNode icon={FiZap} label="Express" />
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-12 space-y-12">
              <ProductInfo 
                product={product} 
                isSeller={isSeller}
                isUpdating={isUpdating}
                onChangeStatus={onChangeStatus}
                onChangeVisibility={onChangeVisibility}
                onUpdateStock={onUpdateStock}
              />
              
              {!isSeller && (
                <div className="flex flex-col xs:flex-row gap-3 md:gap-4 pt-8 md:pt-12 border-t border-gray-100">
                  <button className="flex-[3] bg-gray-900 text-white font-black py-4 md:py-6 rounded-xl md:rounded-2xl hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-xl shadow-gray-200 uppercase tracking-widest text-[11px] md:text-sm">
                    INITIALIZE PURCHASE
                  </button>
                  <div className="flex gap-3 md:gap-4">
                    <button className="flex-1 xs:w-16 md:w-20 h-14 md:h-20 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                      <FiHeart className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button className="flex-1 xs:w-16 md:w-20 h-14 md:h-20 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all xs:hidden sm:flex">
                      <FiShare2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TrustNode = ({ icon: _Icon, label }) => {
  const Icon = _Icon;
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">{label}</span>
    </div>
  );
};

