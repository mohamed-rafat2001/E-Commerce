import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFunc, deleteFunc } from "../../../shared/services/handlerFactory";
import { Button, Card, Spinner, Badge } from "../../../shared/ui";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import useCurrentUser from "../../user/hooks/useCurrentUser";
import useCart from "../../cart/hooks/useCart";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const CartPage = () => {
	const { user } = useCurrentUser();
	const queryClient = useQueryClient();
	const { cart, isLoading } = useCart();
	const cartId = user?.userId?._id;

	const updateCartMutation = useMutation({
		mutationFn: ({ itemId, quantity }) => updateFunc("/cart", { itemId, quantity }),
		onSuccess: () => {
			queryClient.invalidateQueries(["cart", cartId]);
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "Failed to update cart");
		},
	});

	const removeFromCartMutation = useMutation({
		mutationFn: (itemId) => updateFunc(`/cart/${cartId}`, { itemId }),
		onSuccess: () => {
			queryClient.invalidateQueries(["cart", cartId]);
			toast.success("Item removed from cart");
		},
	});

	const clearCartMutation = useMutation({
		mutationFn: () => deleteFunc(`/cart/${cartId}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["cart", cartId]);
			toast.success("Cart cleared");
		},
	});

	const cartItems = cart?.items || [];
	const subtotal = cartItems.reduce((acc, item) => acc + (item.itemId.price * item.quantity), 0);
	const shipping = subtotal > 1000 ? 0 : 50;
	const total = subtotal + shipping;

	const handleQuantityChange = (itemId, currentQty, delta) => {
		const newQty = currentQty + delta;
		if (newQty < 1) return;
		updateCartMutation.mutate({ itemId, quantity: newQty });
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Spinner size="lg" />
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
				<div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
					<FiShoppingBag className="w-10 h-10 text-indigo-600" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
				<p className="text-gray-500 mb-8 max-w-xs text-center">
					Looks like you haven't added anything to your cart yet.
				</p>
				<Link to="/">
					<Button variant="primary" size="lg">
						Start Shopping
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
				<Button 
					variant="ghost" 
					className="text-red-500 hover:bg-red-50"
					onClick={() => clearCartMutation.mutate()}
					loading={clearCartMutation.isPending}
				>
					Clear Cart
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2 space-y-4">
					<AnimatePresence mode="popLayout">
						{cartItems.map((item) => (
							<motion.div
								key={item.itemId._id}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
							>
								<Card className="p-4 sm:p-6 overflow-hidden">
									<div className="flex flex-col sm:flex-row gap-6">
										{/* Product Image */}
										<div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
											<img
												src={item.itemId.image?.secure_url || "/placeholder-product.png"}
												alt={item.itemId.name}
												className="w-full h-full object-cover"
												crossOrigin="anonymous"
											/>
										</div>

										{/* Product Details */}
										<div className="flex-1 flex flex-col justify-between">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-lg font-bold text-gray-900 mb-1">
														{item.itemId.name}
													</h3>
													<p className="text-sm text-gray-500 mb-2">
														{item.itemId.category?.name || "Uncategorized"}
													</p>
													<div className="flex items-center gap-2">
														<span className="text-xl font-bold text-indigo-600">
															${item.itemId.price}
														</span>
														{item.itemId.oldPrice && (
															<span className="text-sm text-gray-400 line-through">
																${item.itemId.oldPrice}
															</span>
														)}
													</div>
												</div>
												<button
													onClick={() => removeFromCartMutation.mutate(item.itemId._id)}
													className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
												>
													<FiTrash2 className="w-5 h-5" />
												</button>
											</div>

											<div className="flex items-center justify-between mt-4">
												<div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
													<button
														onClick={() => handleQuantityChange(item.itemId._id, item.quantity, -1)}
														className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
														disabled={item.quantity <= 1 || updateCartMutation.isPending}
													>
														<FiMinus className="w-4 h-4" />
													</button>
													<span className="w-12 text-center font-bold text-gray-900">
														{item.quantity}
													</span>
													<button
														onClick={() => handleQuantityChange(item.itemId._id, item.quantity, 1)}
														className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
														disabled={updateCartMutation.isPending}
													>
														<FiPlus className="w-4 h-4" />
													</button>
												</div>
												<div className="text-right">
													<p className="text-sm text-gray-500">Total</p>
													<p className="text-lg font-bold text-gray-900">
														${(item.itemId.price * item.quantity).toFixed(2)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					<Card className="p-6 sticky top-24 border-indigo-100 shadow-indigo-100/50">
						<h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
						
						<div className="space-y-4 mb-6">
							<div className="flex justify-between text-gray-600">
								<span>Subtotal</span>
								<span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-gray-600">
								<span>Shipping</span>
								{shipping === 0 ? (
									<Badge variant="success">Free</Badge>
								) : (
									<span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
								)}
							</div>
							{shipping > 0 && (
								<p className="text-xs text-gray-500">
									Add ${(1000 - subtotal).toFixed(2)} more for FREE shipping
								</p>
							)}
						</div>

						<div className="border-t border-dashed border-gray-200 pt-4 mb-8">
							<div className="flex justify-between items-end">
								<span className="text-gray-600 font-medium">Total Amount</span>
								<span className="text-3xl font-black text-indigo-600">
									${total.toFixed(2)}
								</span>
							</div>
						</div>

						<div className="space-y-4">
							<Button fullWidth size="lg" icon={<FiArrowRight />} iconPosition="right">
								Checkout Now
							</Button>
							<Link to="/" className="block">
								<Button variant="secondary" fullWidth size="lg">
									Continue Shopping
								</Button>
							</Link>
						</div>

						<div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-50">
							<img src="/visa.svg" alt="Visa" className="h-4" />
							<img src="/mastercard.svg" alt="Mastercard" className="h-4" />
							<img src="/paypal.svg" alt="Paypal" className="h-4" />
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
