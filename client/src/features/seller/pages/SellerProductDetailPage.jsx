import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, Badge, Button } from '../../../shared/ui/index.js';
import {
    FiArrowLeft,
    FiActivity,
    FiBox,
    FiEye,
    FiSettings,
    FiEdit3,
    FiTrendingUp,
    FiChevronRight,
    FiExternalLink,
    FiCheckCircle,
    FiClock,
    FiPackage,
    FiMoreHorizontal
} from 'react-icons/fi';
import ProductGallery from '../../product/components/ProductGallery.jsx';
import useProductDetailPage from '../../product/hooks/useProductDetailPage.js';
import SellerProductManagement from '../components/products/SellerProductManagement.jsx';

export default function SellerProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        product,
        isLoading,
        error,
        gallery,
        isUpdating,
        onChangeStatus,
        onChangeVisibility,
        onUpdateStock
    } = useProductDetailPage(id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <LoadingSpinner size="xl" color="indigo" />
                        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
                    </div>
                    <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Loading Product Intel</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-4">
                <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FiPackage className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Product Not Found</h2>
                    <p className="text-gray-500 mb-10 leading-relaxed font-medium">The product you are trying to manage doesn't exist or has been removed from your inventory.</p>
                    <Button onClick={() => navigate('/seller/inventory')} variant="primary" fullWidth size="lg" icon={<FiArrowLeft />}>
                        Back to Inventory
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfd] selection:bg-indigo-100 selection:text-indigo-900">
            {/* Dynamic Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/seller/inventory')}
                            className="group p-2.5 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"
                            title="Return to Inventory"
                        >
                            <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Inventory</span>
                                <FiChevronRight className="w-3 h-3 text-gray-300" />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Management Center</span>
                            </div>
                            <h1 className="font-black text-gray-900 text-lg tracking-tight leading-none truncate max-w-[200px] md:max-w-md">
                                {product.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1.5 px-4 h-10 rounded-2xl bg-gray-50 border border-gray-100">
                            <FiClock className="text-gray-400 w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Modified {new Date(product.updatedAt).toLocaleDateString()}</span>
                        </div>

                        <button
                            onClick={() => navigate('/seller/inventory', { state: { editProduct: product } })}
                            className="flex items-center gap-2.5 px-6 h-10 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                        >
                            <FiEdit3 className="w-4 h-4" />
                            Edit Asset
                        </button>

                        <button className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all border border-gray-100">
                            <FiMoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 pt-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

                    {/* Detailed Presentation Layer */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Visual Hero Card */}
                        <section className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-700 group">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="aspect-square bg-white relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                                    <ProductGallery gallery={gallery} />
                                </div>

                                <div className="p-10 md:p-14 lg:p-16 flex flex-col justify-center">
                                    <div className="mb-auto space-y-6">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-full">
                                                {product.brandId?.name || "Premium Brand"}
                                            </Badge>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-full">
                                                {product.status}
                                            </Badge>
                                        </div>

                                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                                            {product.name}
                                        </h2>

                                        <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100/50 italic text-gray-500 leading-relaxed font-medium text-lg relative group/desc">
                                            <span className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest border border-gray-100 rounded-full">Vision</span>
                                            "{product.description}"
                                        </div>
                                    </div>

                                    <div className="mt-14 pt-10 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">Market Value</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-5xl font-black text-gray-900 tracking-tighter italic">
                                                        ${product.price?.amount?.toFixed(2)}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">USD</span>
                                                </div>
                                            </div>

                                            <div className="text-right space-y-2">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-2xl">
                                                    <FiPackage className="w-4 h-4 text-indigo-400" />
                                                    <span className="text-2xl font-black tracking-tighter leading-none">{product.countInStock}</span>
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">Units In Warehouse</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Performance Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PerformanceStat
                                title="Public Reach"
                                value="2.4k"
                                subtitle="Views this week"
                                icon={FiEye}
                                color="indigo"
                                trend="+12%"
                            />
                            <PerformanceStat
                                title="Conversion"
                                value="4.8%"
                                subtitle="Cart add rate"
                                icon={FiTrendingUp}
                                color="purple"
                                trend="+8%"
                            />
                            <PerformanceStat
                                title="Rating"
                                value={product.ratingAverage || "4.9"}
                                subtitle={`${product.ratingCount || 0} Reviews`}
                                icon={FiCheckCircle}
                                color="emerald"
                            />
                        </section>

                        {/* Deep Metadata Grid */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100">
                                        <FiSettings className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Technical Blueprint</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Comprehensive product data architecture</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-1 pb-1 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-50">
                                    <DataPoint label="Product UUID" value={product._id} />
                                    <DataPoint label="Global Slug" value={product.slug} copyable />
                                    <DataPoint label="Brand Partner" value={product.brandId?.name} link={`/seller/brands/${product.brandId?._id}`} />
                                    <DataPoint label="Base Category" value={product.primaryCategory?.name} />
                                    <DataPoint label="Sub Hierarchy" value={product.subCategory?.name || 'Unassigned'} />
                                    <DataPoint label="Visibility" value={product.visibility} uppercase />
                                    <DataPoint label="Color Range" value={`${product.colors?.length || 0} variations`} />
                                    <DataPoint label="Size Options" value={`${product.sizes?.length || 0} variations`} />
                                    <DataPoint label="Price Currency" value="USD / Universal" />
                                </div>
                            </div>
                        </section>

                        {/* Description & Story */}
                        <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                                Long-form Description
                            </h3>
                            <div className="prose prose-indigo max-w-none">
                                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Management Sidebar */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
                        <SellerProductManagement
                            product={product}
                            isUpdating={isUpdating}
                            onChangeStatus={onChangeStatus}
                            onChangeVisibility={onChangeVisibility}
                            onUpdateStock={onUpdateStock}
                        />

                        {/* Quick Actions Panel */}
                        <div className="bg-white p-10 rounded-[2.75rem] border border-gray-100 shadow-sm space-y-6">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Quick Actions</h4>
                            <div className="space-y-3">
                                <ActionBtn icon={FiEye} label="View as Customer" onClick={() => window.open(`/products/${product._id}`, '_blank')} />
                                <ActionBtn icon={FiExternalLink} label="Share Asset Publicly" />
                                <ActionBtn icon={FiActivity} label="Analyze Sales Data" />
                            </div>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}

const PerformanceStat = ({ title, value, subtitle, icon: Icon, color, trend }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600 shadow-indigo-100/50',
        purple: 'bg-purple-50 text-purple-600 shadow-purple-100/50',
        emerald: 'bg-emerald-50 text-emerald-600 shadow-emerald-100/50',
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-gray-200 transition-all group relative overflow-hidden">
            <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{value}</p>
                    {trend && <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
                </div>
                <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-xs font-bold text-gray-400">{subtitle}</p>
            </div>
        </div>
    );
};

const DataPoint = ({ label, value, copyable, uppercase, link }) => {
    const navigate = useNavigate();
    return (
        <div className="p-8 hover:bg-gray-50/50 transition-colors">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
            <div className="flex items-center gap-2">
                <p className={`text-sm font-black text-gray-900 leading-tight ${uppercase ? 'uppercase' : ''} ${link ? 'text-indigo-600 hover:underline cursor-pointer' : ''}`} onClick={() => link && navigate(link)}>
                    {value || 'N/A'}
                </p>
                {copyable && <button className="text-gray-300 hover:text-indigo-600 transition-colors"><FiMoreHorizontal /></button>}
            </div>
        </div>
    );
};

const ActionBtn = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-indigo-600 hover:text-white group transition-all"
    >
        <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
);
