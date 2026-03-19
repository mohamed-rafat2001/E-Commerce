import { Card, Badge } from '../../../shared/ui';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const CartItemCard = ({ item, onQuantityChange, onRemove }) => {
    const product = item.item || item.itemId || item.productId || item;
    const productId = product?._id || product?.id || item.product_id;
    const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
    const name = product?.name || item.name;
    const image = product?.coverImage?.secure_url || product?.image?.secure_url || product?.image || item.image || "/placeholder-product.png";

    if (!productId) return null;

    return (
        <Card padding="sm" className="group overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                    <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" crossOrigin="anonymous" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{name}</h3>
                            <Badge variant="outline" size="sm">{product?.primaryCategory?.name || product?.category?.name || "Product"}</Badge>
                        </div>
                        <button onClick={() => onRemove(productId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <FiTrash2 className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                            <button onClick={() => onQuantityChange(productId, item.quantity, -1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all disabled:opacity-30" disabled={item.quantity <= 1}>
                                <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                            <button onClick={() => onQuantityChange(productId, item.quantity, 1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all">
                                <FiPlus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-indigo-600">${(price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CartItemCard;
