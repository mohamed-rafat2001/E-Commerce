import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Input, Select, LoadingSpinner, Button } from '../../../../shared/ui/index.js';
import {
    FiSave,
    FiGlobe,
    FiActivity,
    FiBox,
    FiCheck,
    FiAlertCircle,
    FiLayers,
    FiEye,
    FiTrendingUp,
    FiArrowRight
} from 'react-icons/fi';

const statusOptions = [
    { value: 'draft', label: 'Draft Mode' },
    { value: 'active', label: 'Live Storefront' },
    { value: 'inactive', label: 'Hidden from Store' },
    { value: 'archived', label: 'Retired Product' },
];

const visibilityOptions = [
    { value: 'public', label: 'Public Access' },
    { value: 'private', label: 'Private/Internal' },
];

export default function SellerProductManagement({
    product,
    isUpdating = false,
    onChangeStatus,
    onChangeVisibility,
    onUpdateStock
}) {
    const [stockVal, setStockVal] = useState(product.countInStock || 0);

    useEffect(() => {
        setStockVal(product.countInStock);
    }, [product.countInStock]);

    return (
        <div className="space-y-8">
            {/* Management Hub Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0b0c10] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
            >
                {/* Dynamic Glow Background */}
                <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/10 opacity-40 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-tr from-indigo-600 to-indigo-400 p-px">
                            <div className="w-full h-full bg-[#0b0c10] rounded-[1.4rem] flex items-center justify-center">
                                <FiLayers className="w-6 h-6 text-indigo-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-2xl tracking-tight leading-none">Operations</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 opacity-60 italic">Cloud Synchronized</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0 opacity-40" />
                        <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
                    </div>
                </div>

                <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 gap-8">
                        <ControlGroup label="Asset Status">
                            <Select
                                value={product.status}
                                onChange={onChangeStatus}
                                options={statusOptions}
                                className="!bg-white/5 !border-white/10 !h-16 !text-sm font-black rounded-2xl focus:!border-indigo-500/50 transition-all !px-6"
                            />
                        </ControlGroup>

                        <ControlGroup label="Consumer Reach">
                            <Select
                                value={product.visibility}
                                onChange={onChangeVisibility}
                                options={visibilityOptions}
                                className="!bg-white/5 !border-white/10 !h-16 !text-sm font-black rounded-2xl focus:!border-indigo-500/50 transition-all !px-6"
                            />
                        </ControlGroup>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-1">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Live Stock</label>
                                    <p className="text-sm font-black text-indigo-400 tracking-tight leading-none">Inventory Vault</p>
                                </div>
                                {stockVal < 10 && (
                                    <motion.span
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20"
                                    >
                                        <FiAlertCircle className="w-3.5 h-3.5" /> Depleted
                                    </motion.span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 shadow-inner">
                                <Input
                                    type="number"
                                    value={stockVal}
                                    onChange={(e) => setStockVal(e.target.value)}
                                    className="!bg-transparent !border-none !text-white text-center font-black !text-4xl !h-16 !rounded-xl flex-1 focus:!ring-0"
                                />
                                <div className="w-px h-12 bg-white/10" />
                                <button
                                    onClick={() => onUpdateStock(parseInt(stockVal))}
                                    disabled={isUpdating}
                                    className="bg-indigo-600 text-white font-black px-8 h-12 rounded-xl text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/20"
                                >
                                    {isUpdating ? <LoadingSpinner size="sm" color="white" /> : 'Sync'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Overview Analytics Card */}
            <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-10 group/stats">
                <div>
                    <h4 className="font-black text-gray-900 mb-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/stats:text-indigo-600 transition-colors">
                                <FiTrendingUp className="w-5 h-5" />
                            </div>
                            Overview
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:tracking-widest transition-all">Details</button>
                    </h4>
                    <div className="space-y-8">
                        <StatRow label="Active Variations" value={`${product.colors?.length + product.sizes?.length} Options`} icon={FiLayers} color="text-purple-600" />
                        <StatRow label="Store Performance" value={`${product.ratingAverage || '5.0'} Grade`} icon={FiGlobe} color="text-indigo-600" />
                        <StatRow label="Fulfillment Velocity" value="Real-time" icon={FiActivity} color="text-emerald-600" />
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 italic font-medium text-gray-400 text-sm leading-relaxed text-center px-4">
                    "This product is currently performing within optimal parameters for its category."
                </div>

                <button className="w-full py-5 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all group/btn">
                    Detailed Analytics Report
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

const ControlGroup = ({ label, children }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 opacity-70">{label}</label>
        {children}
    </div>
);

const StatRow = ({ label, value, icon: Icon, color }) => (
    <div className="flex justify-between items-center group/row">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center ${color} opacity-40 group-hover/row:opacity-100 transition-opacity`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-base font-black text-gray-900 tracking-tight">{value}</span>
    </div>
);
