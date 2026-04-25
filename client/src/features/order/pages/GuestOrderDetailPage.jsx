import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiShoppingBag, FiAlertCircle, FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getGuestOrderDetail } from '../services/order.js';
import { Button, Badge, Skeleton } from '../../../shared/ui/index.js';
import { toast } from 'react-hot-toast';

const STATUS_ICONS = {
    'pending': <FiClock className="w-6 h-6 text-amber-500" />,
    'processing': <FiPackage className="w-6 h-6 text-blue-500" />,
    'shipped': <FiTruck className="w-6 h-6 text-indigo-500" />,
    'delivered': <FiCheckCircle className="w-6 h-6 text-emerald-500" />,
    'cancelled': <FiAlertCircle className="w-6 h-6 text-rose-500" />,
};

const STATUS_BADGE = {
    'pending': 'warning',
    'processing': 'warning',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'danger',
};

const GuestOrderDetailPage = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!orderId || !email) {
                toast.error('Missing order information');
                return navigate('/guest-orders');
            }
            try {
                const res = await getGuestOrderDetail(orderId, email);
                setOrder(res.data.data || res.data);
            } catch (err) {
                toast.error('Could not load order details');
                navigate('/guest-orders');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [orderId, email, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton height={200} className="rounded-3xl" />
                    <Skeleton height={400} className="rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!order) return null;

    const status = (order.status || 'pending').toLowerCase();
    const shortId = order.orderNumber || (order._id ? `ORD-${order._id.substring(order._id.length - 8).toUpperCase()}` : '');
    
    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/guest-orders', { state: { email } })} 
                    className="mb-8 text-gray-500 hover:text-gray-900"
                >
                    <FiArrowLeft className="mr-2" /> Back to My Orders
                </Button>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Header Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{shortId}</h1>
                                <p className="text-gray-400 font-medium mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    {STATUS_ICONS[status] || <FiPackage className="w-6 h-6" />}
                                </div>
                                <Badge variant={STATUS_BADGE[status] || 'warning'} size="lg">
                                    {status.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </motion.div>

                    {/* Order Items */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm"
                    >
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                                <FiShoppingBag className="text-indigo-600" /> PURCHASED ITEMS
                            </h2>
                        </div>
                        <div className="p-8 space-y-4">
                            {order.items?.map((subOrder) => 
                                subOrder.items?.map((item, idx) => {
                                    const prod = item.item || {};
                                    const img = prod.coverImage?.secure_url || prod.coverImage || '';
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-3xl border border-gray-100 transition-hover hover:bg-gray-50">
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-20 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm flex-shrink-0">
                                                    {img ? (
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    ) : <FiPackage className="w-full h-full p-6 text-gray-200" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 md:text-lg">{prod.name || prod.title || 'Product'}</p>
                                                    <p className="text-sm font-medium text-gray-400">Quantity: {item.quantity}</p>
                                                    <p className="text-sm font-bold text-indigo-600 md:hidden mt-1">${item.price?.amount || item.price}</p>
                                                </div>
                                            </div>
                                            <p className="hidden md:block font-black text-2xl text-gray-900">${item.price?.amount || item.price}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>

                    {/* Shipping & Payment Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm"
                        >
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <FiMapPin className="text-indigo-600" /> SHIPPING TO
                            </h3>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-gray-900">{order.shippingAddress?.recipientName}</p>
                                <p className="text-gray-500">{order.shippingAddress?.line1}</p>
                                <p className="text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                <p className="text-gray-500">{order.shippingAddress?.country}</p>
                                <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-400">
                                    {order.shippingAddress?.phone}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm"
                        >
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <FiCreditCard className="text-indigo-600" /> PAYMENT & SUMMARY
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-400 uppercase">Method</span>
                                    <span className="font-black text-gray-900 uppercase text-xs tracking-wider">{order.paymentMethod?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="space-y-2 px-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="font-bold text-gray-900">${order.itemsPrice?.amount || order.itemsPrice || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="font-bold text-gray-900">${order.shippingPrice?.amount || order.shippingPrice || 0}</span>
                                    </div>
                                    {order.discountAmount?.amount > 0 && (
                                        <div className="flex justify-between text-sm text-emerald-600">
                                            <span>Discount</span>
                                            <span className="font-bold">-${order.discountAmount.amount}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-gray-50 my-2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-3xl font-black text-indigo-600">${order.totalPrice?.amount || order.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestOrderDetailPage;
