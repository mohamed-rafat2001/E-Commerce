import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiPackage, 
  FiInfo, 
  
  FiShield, 
  FiRefreshCw, 
  
  FiBox,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50 -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] opacity-50 -ml-48 -mb-48" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center relative z-10"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          </div>
          <p className="mt-10 font-black text-indigo-900/40 uppercase tracking-[0.4em] text-[10px]">Assembling Experience</p>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden min-h-screen">
        <button 
          onClick={() => navigate(isSeller ? '/seller/inventory' : basePath)}
          className="inline-flex items-center gap-3 text-gray-400 mb-12 hover:text-indigo-600 transition-all font-black uppercase tracking-[0.2em] text-[10px] group"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
            <FiArrowLeft className="w-4 h-4" />
          </div>
          Return to directory
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-20 bg-white border border-gray-100 rounded-[4rem] text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600" />
          <div className="w-40 h-40 bg-rose-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 rotate-12 group hover:rotate-0 transition-transform duration-700">
            <FiPackage className="w-20 h-20 text-rose-400" />
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Record Invalid</h2>
          <p className="text-gray-400 font-medium max-w-lg mx-auto leading-relaxed text-xl mb-12">
            The requested product identifier does not match any current catalog entries. It may have been decommissioned or relocated.
          </p>
          <Link 
            to="/" 
            className="px-12 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all duration-500 shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 active:scale-95"
          >
            CATALOG HOME
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 relative">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-50/50 rounded-full blur-[150px] -mr-[500px] -mt-[500px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 w-[800px] h-[800px] bg-purple-50/50 rounded-full blur-[150px] -ml-[400px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
      >
        {/* Navigation & Utilities */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] overflow-x-auto pb-2 scrollbar-hide">
            <Link to="/" className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0">Terminal</Link>
            <FiChevronRight className="text-gray-300 shrink-0" />
            <Link to={isSeller ? '/seller/inventory' : basePath} className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0">
              {isSeller ? 'Seller Hub' : 'Storefront'}
            </Link>
            <FiChevronRight className="text-gray-300 shrink-0" />
            <span className="text-indigo-600 truncate bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/50">{product.name}</span>
          </nav>
          
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">+12 viewing now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32">
          {/* LEFT COLUMN: Immersive Visuals */}
          <div className="space-y-12 lg:sticky lg:top-12 self-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative p-3 bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden group">
                <div className="rounded-[3.5rem] overflow-hidden">
                  <ProductGallery gallery={gallery} enableZoom={true} />
                </div>
              </div>
            </motion.div>
            
            {/* Trust Architecture */}
            <div className="grid grid-cols-3 gap-6">
              <TrustBadge icon={FiShield} label="Veritas" sub="Verified Genuine" color="indigo" />
              <TrustBadge icon={FiRefreshCw} label="Nexus" sub="30-Day Cycle" color="emerald" />
              <TrustBadge icon={FiZap} label="Aeron" sub="Rapid Logistics" color="purple" />
            </div>
            
            {/* Consumer Actions */}
            {!isSeller && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-3 bg-white/40 backdrop-blur-3xl border border-white rounded-[3rem] shadow-2xl flex gap-4"
              >
                <button className="flex-[4] bg-gray-900 hover:bg-indigo-600 text-white font-black py-6 px-10 rounded-[2rem] transition-all duration-700 flex items-center justify-center gap-4 shadow-xl hover:shadow-indigo-300 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <FiShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  INITIALIZE ACQUISITION
                </button>
                <ActionButton icon={FiHeart} hoverColor="rose" />
                <ActionButton icon={FiShare2} hoverColor="indigo" />
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN: Technical & Narrative Data */}
          <div className="space-y-20 pb-20">
            <ProductInfo 
              product={product} 
              basePath={basePath} 
              isSeller={isSeller}
              isUpdating={isUpdating}
              onChangeStatus={onChangeStatus}
              onChangeVisibility={onChangeVisibility}
              onUpdateStock={onUpdateStock}
            />

            <div className="space-y-12">
              {/* Narrative Section */}
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
                    <FiInfo className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Design Philosophy</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Explanatory Narrative</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/20 border border-gray-100 text-gray-500 text-xl leading-[1.8] font-medium italic relative overflow-hidden group">
                  <div className="absolute -top-10 -left-10 text-[10rem] font-black text-gray-50 opacity-[0.03] group-hover:opacity-10 transition-opacity select-none">STORY</div>
                  <p className="relative z-10 first-letter:text-6xl first-letter:font-black first-letter:text-gray-900 first-letter:mr-4 first-letter:float-left first-letter:not-italic">
                    {product.description}
                  </p>
                </div>
              </motion.section>
              
              {/* Technical Core */}
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                    <FiBox className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">System Specifications</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Technical Matrix</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <MetricBox label="Global Identifier" value={product._id?.toUpperCase()} mono />
                   <MetricBox label="Categorical Root" value={product.primaryCategory?.name} />
                   <MetricBox label="Subordinate Node" value={product.subCategory?.name} />
                   <MetricBox label="Production Entity" value={product.brandId?.name} />
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const TrustBadge = ({ icon: _Icon, label, sub, color }) => {
  const Icon = _Icon;
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white',
  };
  
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 text-center space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-all duration-700 shadow-inner ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{label}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-500">{sub}</p>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: _Icon, hoverColor }) => {
  const Icon = _Icon;
  const colors = {
    rose: 'hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100',
    indigo: 'hover:bg-indigo-50 hover:text-indigo-500 hover:border-indigo-100',
  };
  
  return (
    <button className={`flex-1 bg-gray-50 text-gray-400 p-6 rounded-[2rem] border border-transparent transition-all duration-500 active:scale-90 ${colors[hoverColor]}`}>
      <Icon className="w-7 h-7 mx-auto" />
    </button>
  );
};

const MetricBox = ({ label, value, mono }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:border-indigo-200 transition-all duration-500">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{label}</p>
    <p className={`text-xl font-black text-gray-900 tracking-tight line-clamp-1 ${mono ? 'font-mono text-lg' : ''}`}>
      {value || 'DATA MISSING'}
    </p>
  </div>
);

