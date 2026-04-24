import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import ShippingStep from '../components/ShippingStep.jsx';
import PaymentStep from '../components/PaymentStep.jsx';
import ReviewStep from '../components/ReviewStep.jsx';
import OrderSummaryPanel from '../components/OrderSummaryPanel.jsx';
import useCart from '../../cart/hooks/useCart.js';
import useCheckout from '../hooks/useCheckout.js';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import { selectPromoInfo } from '../../../app/store/slices/cartSlice';
import { calculateOrderTotals } from '../utils/orderCalculations.js';
import { Button, EmptyState } from '../../../shared/ui/index.js';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Multi-step checkout page with 3 steps: Shipping → Payment → Review
 * 2-column layout (desktop): left=steps, right=order summary
 */
const CheckoutPage = () => {
	const navigate = useNavigate();
	const { cartItems, isLoading: cartLoading } = useCart();
	const { checkout, isCheckingOut } = useCheckout();
	const { isAuthenticated } = useCurrentUser();
	const { code: couponCode, amount: couponDiscountAmount } = useSelector(selectPromoInfo);

	const [step, setStep] = useState(1);
	const [shippingAddress, setShippingAddress] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
	const [guestEmail, setGuestEmail] = useState('');

	// Scroll to top on mount
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Scroll to top on step change
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [step]);

	// Calculate order financials
	const calculations = useMemo(() => calculateOrderTotals(cartItems, couponDiscountAmount), [cartItems, couponDiscountAmount]);

	const handlePlaceOrder = () => {
		const payload = { shippingAddress, paymentMethod, couponCode };
		
		if (!isAuthenticated) {
			payload.cartItems = cartItems.map(item => ({
				product_id: item.product_id || item.item?._id || item.item,
				quantity: item.quantity
			}));
			payload.guestEmail = guestEmail;
			payload.guestName = shippingAddress.recipientName || 'Guest';
			payload.guestPhone = shippingAddress.phone || '';
		}

		checkout(payload);
	};

	// Empty cart guard
	if (!cartLoading && cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
				<EmptyState
					icon={<FiShoppingBag className="w-12 h-12" />}
					title="Your cart is empty"
					message="Add some items before proceeding to checkout."
					action={{
						label: 'Browse Products',
						onClick: () => navigate('/products'),
					}}
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 transition-colors duration-300 font-sans">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					className="mb-8"
				>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate('/cart')}
						className="gap-2 text-gray-500 hover:text-gray-900"
					>
						<FiArrowLeft className="w-4 h-4" />
						Back to Cart
					</Button>
				</motion.div>

				{/* Page Header */}
				<motion.header
					className="mb-8 text-center"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Checkout</h1>
					<p className="text-gray-500 font-medium">Secure checkout — your order is almost ready</p>
				</motion.header>

				{/* Step Indicator */}
				<CheckoutSteps currentStep={step} />

				{/* Main Content: 2 columns on desktop */}
				<div className="flex flex-col-reverse lg:flex-row gap-10 mt-12">
					{/* Left Side: Steps */}
					<div className="flex-1 min-w-0">
						<AnimatePresence mode="wait">
							{step === 1 && (
								<ShippingStep
									key="shipping"
									shippingAddress={shippingAddress}
									onSelect={setShippingAddress}
									onNext={() => setStep(2)}
									guestEmail={guestEmail}
									onGuestEmailChange={setGuestEmail}
								/>
							)}
							{step === 2 && (
								<PaymentStep
									key="payment"
									paymentMethod={paymentMethod}
									onSelect={setPaymentMethod}
									onNext={() => setStep(3)}
									onBack={() => setStep(1)}
								/>
							)}
							{step === 3 && (
								<ReviewStep
									key="review"
									shippingAddress={shippingAddress}
									paymentMethod={paymentMethod}
									cartItems={cartItems}
									calculations={calculations}
									onPlaceOrder={handlePlaceOrder}
									onBack={() => setStep(2)}
									isPlacing={isCheckingOut}
								/>
							)}
						</AnimatePresence>
					</div>

					{/* Right Side: Order Summary */}
					<aside className="w-full lg:w-[380px] shrink-0">
						<OrderSummaryPanel
							cartItems={cartItems}
							calculations={calculations}
						/>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
