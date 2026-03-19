import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import {
  FiArrowLeft,
  FiShield,
  FiRefreshCw,
  FiZap,
  FiAward,
  FiCheckCircle
} from 'react-icons/fi';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductTabs from '../components/ProductTabs.jsx';
import useProductDetailPage from '../hooks/useProductDetailPage.js';
import useRelatedProducts from '../hooks/useRelatedProducts.js';
import { Slider } from '../../../shared/ui/index.js';
import { PublicProductCard } from '../../../shared/index.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    product,
    isLoading,
    error,
    basePath,
    gallery
  } = useProductDetailPage(id);

  const categoryId = product?.primaryCategory?._id || product?.primaryCategory;
  const { relatedProducts, isLoading: isRelatedLoading } = useRelatedProducts(id, categoryId);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0.3]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center relative">
          <LoadingSpinner size="xl" color="white" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.4em] text-white/70 animate-pulse">Loading Experience</p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px]" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-center px-4">
        <div className="max-w-2xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[80px]" />
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 relative z-10 tracking-tighter">Not Found</h2>
          <p className="text-gray-400 mb-12 text-lg relative z-10">The piece you are looking for has been archived or does not exist.</p>
          <button onClick={() => navigate(-1)} className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform">
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative selection:bg-indigo-500/30 selection:text-indigo-900">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-6 pb-24 relative z-10">
        {/* Top Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 md:mb-12 sticky top-4 z-40 bg-white/50 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-3xl shadow-sm"
        >
          <div className="flex items-center text-sm text-gray-400 whitespace-nowrap overflow-x-auto no-scrollbar w-full">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">{'>'}</span>
            <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            <span className="mx-2 text-gray-300">{'>'}</span>
            <span className="text-gray-800 font-medium truncate max-w-[150px] sm:max-w-xs md:max-w-md">{product.name}</span>
          </div>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20 relative">

          {/* Visual Column */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <motion.div
              style={{ y: y1, opacity: opacity1 }}
              className="sticky top-28 hidden lg:block text-5xl xl:text-[7rem] font-black text-gray-900/5 leading-none tracking-tighter absolute -left-10 z-0 whitespace-nowrap overflow-hidden"
            >
              {product.brandId?.name || "PREMIUM"}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white shadow-2xl relative z-10 shadow-gray-200/50"
            >
              <ProductGallery gallery={gallery} enableZoom={true} />
            </motion.div>

            {/* Features Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
            >
              <FeatureCard icon={FiShield} title="Authentic" subtitle="Verified Item" />
              <FeatureCard icon={FiRefreshCw} title="Returns" subtitle="30-Day Policy" />
              <FeatureCard icon={FiZap} title="Fast Delivery" subtitle="Express Shipping" />
              <FeatureCard icon={FiAward} title="Warranty" subtitle="2-Year Cover" />
            </motion.div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 xl:col-span-4 relative z-20">
            <div className="lg:sticky lg:top-28">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Product Full Details Tabs */}
        <div className="mt-16 sm:mt-24 w-full">
          <ProductTabs product={product} />
        </div>

        {/* Related Products Section */}
        {!isRelatedLoading && relatedProducts?.length > 0 && (
          <div className="mt-24 mb-10 pt-10 border-t border-gray-100">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-8 text-center md:text-left">
              You Might Also Like
            </h3>
            <Slider
              children={relatedProducts.map(rp => (
                <div key={rp._id} className="pb-8 h-full">
                  <PublicProductCard product={rp} />
                </div>
              ))}
              slidesPerView={1}
              spaceBetween={24}
              loop={false}
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              className="!overflow-visible"
              nextEl=".custom-related-next"
              prevEl=".custom-related-prev"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: Icon, title, subtitle }) => (
  <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all group cursor-default">
    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs font-black text-gray-900">{title}</p>
      <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const FiChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
