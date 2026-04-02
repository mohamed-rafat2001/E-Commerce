import PromoCodeInput from './PromoCodeInput.jsx';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Button } from '../../../shared/ui/index.js';

/**
 * OrderSummary Sidebar Card redesigned for the public cart page
 * @param {function} onCheckout - Action to perform on checkout click
 * @param {object} calculations - Financial calculations passed from parent
 */
const OrderSummary = ({ onCheckout, calculations }) => {
    const isEmpty = calculations.subtotal === 0;

    return (
        <div className="sticky top-24 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8 h-fit">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order Summary</h2>

            {/* Promo Code Section */}
            <PromoCodeInput />

            {/* Price Breakdown */}
            <div className="space-y-4 pt-4">
                <div className="flex justify-between text-sm text-gray-500 font-medium tracking-tight">
                    <span>Subtotal</span>
                    <span className="text-gray-900">${calculations.subtotal.toFixed(2)}</span>
                </div>
                {calculations.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium tracking-tight">
                        <span>Discount</span>
                        <span>-${calculations.discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm text-gray-500 font-medium tracking-tight">
                    <span>Estimated Shipping</span>
                    {calculations.shipping === 0 ? (
                        <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
                    ) : (
                        <span className="text-gray-900">${calculations.shipping.toFixed(2)}</span>
                    )}
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium tracking-tight">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-gray-900">${calculations.tax.toFixed(2)}</span>
                </div>

                <div className="h-px bg-gray-100/80 my-2"></div>

                <div className="flex justify-between items-center text-lg md:text-xl">
                    <span className="font-bold text-gray-900 tracking-tight">Total</span>
                    <span className="font-black text-blue-600 tracking-tight">
                        ${calculations.total.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Button
                fullWidth
                variant="premium"
                size="lg"
                onClick={onCheckout}
                disabled={isEmpty}
                className="py-5 text-base shadow-2xl group"
                icon={<FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                iconPosition="right"
            >
                Proceed to Checkout
            </Button>

            {/* Secure Caption */}
            <p className="text-[10px] text-center font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-lg">🔒</span> SECURE CHECKOUT GUARANTEED
            </p>

            {/* Curator Protection Badge Card */}
            <div className="bg-[#DFFCF9] p-5 rounded-2xl flex gap-4 border border-[#72F1DE]/20 group hover:shadow-lg hover:shadow-[#DFFCF9]/30 transition-all duration-500 mt-4 overflow-hidden relative">
                <div className="shrink-0 w-10 h-10 bg-[#72F1DE] rounded-full flex items-center justify-center shadow-lg shadow-[#72F1DE]/50">
                    <FiCheckCircle className="w-6 h-6 text-emerald-800" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-sm font-bold text-teal-900 mb-0.5 tracking-tight capitalize">Curator Protection</h4>
                    <p className="text-[11px] text-teal-800/80 font-medium leading-tight tracking-tight">
                        Every purchase is backed by our authentic guarantee.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
