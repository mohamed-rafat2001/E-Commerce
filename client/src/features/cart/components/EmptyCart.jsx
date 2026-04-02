import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Button } from '../../../shared/ui/index.js';

/**
 * EmptyCart Component for displaying when the cart is empty
 * Matches the required CTA behavior
 */
const EmptyCart = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm text-center min-h-[400px] animate-fadeIn">
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">0</span>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty.</h3>
            <p className="text-gray-400 max-w-xs mb-10 font-medium leading-relaxed tracking-tight">
                Looks like you haven't added anything to your cart yet. Browse our collections to find something you love.
            </p>

            <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/products')}
                className="py-5 px-12 text-base shadow-2xl transition-all hover:scale-105 active:scale-95 group"
                iconPosition="right"
                icon={<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            >
                Start Exploring
            </Button>
        </div>
    );
};

export default EmptyCart;
