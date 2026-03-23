import { motion } from 'framer-motion';
import { FiShoppingBag, FiStar } from 'react-icons/fi';
import { Button, Card } from '../../../../shared/ui';
import SaleProgressBar from './SaleProgressBar';
import { Link } from 'react-router-dom';

const FlashSaleCard = ({ product, index, onAddToCart }) => {
    const currentPrice = Number(product.price?.amount ?? product.price ?? 0);
    const originalPrice = Number(product.oldPrice?.amount ?? product.oldPrice ?? currentPrice);
    const discountPercent = Number(product.discount ?? (originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0));
    const soldCount = Number(product.sold ?? product.soldCount ?? 0);
    const totalCount = Number(product.totalStock ?? product.stock ?? product.countInStock ?? 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="p-1"
        >
            <Card hoverable className="p-0 border border-white/5 group bg-gray-900/40 backdrop-blur-2xl shadow-2xl overflow-hidden h-full rounded-[2.5rem] transition-all duration-500 hover:border-red-500/20">
                <div className="relative aspect-[4/5] overflow-hidden cursor-pointer">
                    <Link to={`/products/${product._id || product.id}`}>
                        <img
                            src={product.coverImage?.secure_url || product.image?.secure_url || 'https://placehold.co/500x500?text=Sale+Product'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            crossOrigin="anonymous"
                        />
                    </Link>

                    {/* Urgent Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                        <div className="bg-red-600 text-white font-black px-4 py-2 rounded-full shadow-2xl text-xs tracking-widest uppercase">
                            -{discountPercent}% OFF
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            {product.brand?.name || 'Exclusive'}
                        </span>
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
                            <FiStar className="fill-current w-3 h-3" /> {product.ratingAverage || 4.8}
                        </div>
                    </div>

                    <Link to={`/products/${product._id || product.id}`}>
                        <h3 className="text-xl font-bold text-white line-clamp-1 mb-2 hover:text-red-500 transition-colors tracking-tight">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-black text-red-500 tracking-tighter">
                            ${currentPrice}
                        </span>
                        <span className="text-gray-500 line-through text-sm font-medium">
                            ${originalPrice}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <SaleProgressBar
                            sold={soldCount}
                            total={totalCount}
                            className="text-white"
                        />

                        <Button
                            fullWidth
                            variant="primary"
                            onClick={() => onAddToCart(product)}
                            className="!bg-white !text-gray-900 !border-none hover:!bg-red-500 hover:!text-white font-black py-4 !rounded-full flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 transform active:scale-95 text-xs uppercase tracking-widest"
                        >
                            <FiShoppingBag className="w-5 h-5" /> Add to Cart
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default FlashSaleCard;
