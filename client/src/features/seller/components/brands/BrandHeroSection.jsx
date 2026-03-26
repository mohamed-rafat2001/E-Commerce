import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiTag, FiStar, FiGlobe, FiExternalLink, FiMail, FiPhone, FiEdit2, FiArrowLeft, FiEye, FiTrash2, FiUsers } from 'react-icons/fi';

const BrandHeroSection = ({
    brand, getBrandInitialLogo,
    isDropdownOpen, setIsDropdownOpen,
    setIsCoverEditModalOpen, setIsEditModalOpen,
    setIsShowModalOpen, setIsDeleteModalOpen
}) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className={`relative rounded-3xl overflow-hidden shadow-xl ${brand.coverImage?.secure_url ? '' : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900'}`}>
            {brand.coverImage?.secure_url && (
                <img src={brand.coverImage.secure_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className={`absolute inset-0 ${brand.coverImage?.secure_url ? 'bg-black/40' : ''}`}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

            <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setIsCoverEditModalOpen(true)} className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all duration-200 group cursor-pointer" title="Change Cover Image">
                    <FiEdit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="relative px-6 py-8 md:px-10 md:py-10">
                <Link to="/seller/brands" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 py-2 font-medium">
                    <FiArrowLeft className="mr-2" /> Back to Brands
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                    {/* Brand Logo with Actions */}
                    <div className="relative group cursor-pointer shrink-0 z-10" onMouseLeave={() => setIsDropdownOpen(false)} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="relative rounded-2xl p-1.5 bg-white shadow-2xl ring-1 ring-black/5">
                            <img src={brand.logo?.secure_url || getBrandInitialLogo(brand.name)} alt={brand.name} onError={(e) => { e.target.src = getBrandInitialLogo(brand.name); }} className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                            <div className="absolute inset-1.5 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors transform group-hover:scale-110 duration-200">
                                    <FiEdit2 className="w-5 h-5 text-gray-900" />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
                                    <div className="p-1">
                                        <button onClick={() => { setIsShowModalOpen(true); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md"><FiEye className="w-4 h-4" /></div> View Logo
                                        </button>
                                        <button onClick={() => { setIsEditModalOpen(true); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors">
                                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><FiEdit2 className="w-4 h-4" /></div> Change Logo
                                        </button>
                                        {brand.logo?.secure_url && (
                                            <div className="border-t border-gray-100 my-1 pt-1">
                                                <button onClick={() => { setIsDeleteModalOpen(true); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors">
                                                    <div className="p-1.5 bg-red-50 text-red-600 rounded-md"><FiTrash2 className="w-4 h-4" /></div> Delete Logo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 text-white pb-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100">
                                <FiTag className="mr-1.5 w-3 h-3" /> {brand.primaryCategory?.name || "Uncategorized"}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-100">
                                <FiStar className="mr-1.5 w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-bold mr-1 text-white">{brand.ratingAverage || 0}</span>
                                <span className="text-white/60">({brand.ratingCount || 0} reviews)</span>
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white/90">
                                <FiUsers className="mr-1.5 w-3.5 h-3.5" />
                                <span className="font-bold mr-1">{brand.followersCount || 0}</span>
                                <span className="text-white/60">followers</span>
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">{brand.name}</h1>
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-indigo-100/90">
                            {brand.website && (
                                <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors group bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/5 hover:border-white/20">
                                    <FiGlobe className="mr-2 w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" /> Website <FiExternalLink className="ml-1.5 w-3 h-3 opacity-50" />
                                </a>
                            )}
                            {brand.email && (
                                <a href={`mailto:${brand.email}`} className="flex items-center hover:text-white transition-colors group bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/5 hover:border-white/20">
                                    <FiMail className="mr-2 w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" /> Email
                                </a>
                            )}
                            {brand.phone && (
                                <a href={`tel:${brand.phone}`} className="flex items-center hover:text-white transition-colors group bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/5 hover:border-white/20">
                                    <FiPhone className="mr-2 w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" /> Phone
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default BrandHeroSection;
