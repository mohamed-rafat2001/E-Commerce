import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiArrowLeft, FiMapPin, FiCreditCard, FiChevronDown, FiChevronUp, FiShoppingBag } from 'react-icons/fi';
import { Button, Input, Badge, Skeleton } from '../../../shared/ui/index.js';
import { getGuestOrders } from '../services/order.js';
import { getLatestGuestEmail, getSavedGuestOrders, saveGuestEmail } from '../services/guestOrders.js';
import { toast } from 'react-hot-toast';

const STATUS_ICONS = {
    'Pending': <FiClock className="w-5 h-5 text-amber-500" />,
    'Processing': <FiPackage className="w-5 h-5 text-blue-500" />,
    'Shipped': <FiTruck className="w-5 h-5 text-indigo-500" />,
    'Delivered': <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
    'Cancelled': <FiAlertCircle className="w-5 h-5 text-rose-500" />,
};

const OrderDetailRow = ({ order, guestEmail }) => {
    const navigate = useNavigate();
    // Simplified row that navigates instead of expanding
    return (
        <div 
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            onClick={() => navigate(`/guest-orders/${order._id}?email=${guestEmail}`)}
        >
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        {STATUS_ICONS[order.status] || <FiPackage />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                        <p className="font-bold text-gray-900">{order.orderNumber || `ORD-${order._id.substring(order._id.length - 8).toUpperCase()}`}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</p>
                        <p className="text-lg font-black text-gray-900">${order.totalPrice?.amount || order.totalPrice}</p>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'error' : 'warning'}>
                        {order.status}
                    </Badge>
                    <div className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <FiArrowLeft className="rotate-180" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const GuestOrdersPage = () => {
    const [email, setEmail] = useState(getLatestGuestEmail() || '');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const location = useLocation();
    
    // Previous guest orders from localStorage
    const [localHistory, setLocalHistory] = useState([]);

    useEffect(() => {
        setLocalHistory(getSavedGuestOrders());
    }, []);

    // Auto-fetch if email is passed from success page
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
            fetchOrders(location.state.email);
        }
    }, [location.state]);

    const fetchOrders = async (targetEmail) => {
        if (!targetEmail) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await getGuestOrders(targetEmail);
            const orderList = res.data?.data || (Array.isArray(res.data) ? res.data : []); 
            setOrders(orderList);
            if (orderList.length > 0) {
                saveGuestEmail(targetEmail);
            }
            toast.success(`Found ${orderList.length} orders`);
        } catch (err) {
            setOrders([]);
            toast.error(err.response?.data?.message || 'No orders found for this email');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders(email);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-xl shadow-gray-200/50 border border-gray-100"
                    >
                        <FiPackage className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tighter uppercase italic">
                        Your Guest Orders
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Enter your billing email to view all your past purchases.
                    </p>
                </div>

                {/* Email Search */}
                <motion.div
                    className="max-w-md mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <form onSubmit={handleSearch} className="flex gap-2 p-2 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter your purchase email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 text-sm font-medium"
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            isLoading={loading}
                            className="bg-gray-900 hover:bg-black rounded-xl px-6 font-bold"
                        >
                            Find Orders
                        </Button>
                    </form>
                </motion.div>

                {/* Recent Searches / Saved Emails */}
                {!searched && localHistory.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-md mx-auto mb-16 text-center"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Jump back in</p>
                        <div className="flex flex-wrap justify-center gap-2">
                             {[...new Set(localHistory.map(h => h.email))].map((histEmail) => (
                                 <button
                                    key={histEmail}
                                    onClick={() => { setEmail(histEmail); fetchOrders(histEmail); }}
                                    className="px-4 py-2 bg-white rounded-full border border-gray-100 text-xs font-bold text-gray-600 hover:border-indigo-200 hover:text-indigo-600 shadow-sm transition-all shadow-gray-100/50"
                                 >
                                     {histEmail}
                                 </button>
                             ))}
                        </div>
                    </motion.div>
                )}

                {/* Results Area */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <Skeleton height={80} className="rounded-3xl" count={3} />
                        </div>
                    ) : orders.length > 0 ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-3xl mx-auto space-y-4"
                        >
                            {orders.map((order) => (
                                <OrderDetailRow key={order._id} order={order} guestEmail={email} />
                            ))}
                            
                            <div className="pt-8 text-center">
                                <Button variant="ghost" onClick={() => {setOrders([]); setSearched(false); setEmail('');}} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    <FiArrowLeft className="mr-2" /> Search Different Email
                                </Button>
                            </div>
                        </motion.div>
                    ) : searched && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-2xl mx-auto"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <FiShoppingBag className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No Orders Found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">We couldn't find any orders matching <b>{email}</b>. Please check for typos.</p>
                            <Button variant="outline" onClick={() => setSearched(false)} className="rounded-2xl px-10 border-gray-200">
                                Try Another Email
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GuestOrdersPage;
