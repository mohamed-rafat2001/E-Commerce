import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFunc, deleteFunc } from "../../../shared/services/handlerFactory";
import { Button, Card, Badge, PageHeader, Skeleton, EmptyState } from "../../../shared/ui";
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
		onSuccess: () => queryClient.invalidateQueries(["cart", cartId]),
		onError: (error) => toast.error(error?.response?.data?.message || "Failed to update cart"),
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
	const subtotal = cartItems.reduce((acc, item) => acc + ((item.itemId?.price?.amount || 0) * item.quantity), 0);
	const shipping = subtotal > 1000 ? 0 : 50;
	const total = subtotal + shipping;

	const handleQuantityChange = (itemId, currentQty, delta) => {
		const newQty = currentQty + delta;
		if (newQty < 1) return;
		updateCartMutation.mutate({ itemId, quantity: newQty });
	};

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-4">
						<Skeleton variant="image" className="h-40 rounded-3xl" count={3} />
					</div>
					<Skeleton variant="card" className="h-96" />
				</div>
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<Card padding="lg">
				<EmptyState
					icon={<FiShoppingBag className="w-12 h-12" />}
					title="Your cart is empty"
					message="Looks like you haven't added anything to your cart yet. Browse our collections to find something you love."
					action={{
						label: "Start Shopping",
						onClick: () => window.location.href = '/'
					}}
				/>
			</Card>
		);
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="Shopping Cart"
				subtitle={`You have ${cartItems.length} items in your cart.`}
				actions={
					<Button
						variant="ghost"
						className="text-red-500 hover:bg-red-50"
						onClick={() => clearCartMutation.mutate()}
						loading={clearCartMutation.isPending}
					>
						Clear Everything
					</Button>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
								<Card padding="sm" className="group overflow-hidden">
									<div className="flex flex-col sm:flex-row gap-6">
										<div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
											<img
												src={item.itemId.image?.secure_url || "/placeholder-product.png"}
												alt={item.itemId.name}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
												crossOrigin="anonymous"
											/>
										</div>

										<div className="flex-1 flex flex-col justify-between py-1">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
														{item.itemId.name}
													</h3>
													<Badge variant="outline" size="sm">{item.itemId.category?.name || "Uncategorized"}</Badge>
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
														className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all disabled:opacity-30"
														disabled={item.quantity <= 1 || updateCartMutation.isPending}
													>
														<FiMinus className="w-4 h-4" />
													</button>
													<span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
													<button
														onClick={() => handleQuantityChange(item.itemId._id, item.quantity, 1)}
														className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all"
														disabled={updateCartMutation.isPending}
													>
														<FiPlus className="w-4 h-4" />
													</button>
												</div>
												<div className="text-right">
													<p className="text-2xl font-black text-indigo-600">
														${((item.itemId?.price?.amount || 0) * item.quantity).toFixed(2)}
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

				<div className="lg:col-span-1">
					<Card padding="lg" className="sticky top-24 border-indigo-100 shadow-indigo-100/30">
						<h3 className="text-2xl font-black text-gray-900 mb-8 font-display">Order Summary</h3>

						<div className="space-y-4 mb-8">
							<div className="flex justify-between text-gray-500 font-medium">
								<span>Subtotal</span>
								<span className="text-gray-900">${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-gray-500 font-medium">
								<span>Shipping</span>
								{shipping === 0 ? <Badge variant="success">Free</Badge> : <span className="text-gray-900">${shipping.toFixed(2)}</span>}
							</div>
						</div>

						<div className="border-t border-dashed border-gray-200 pt-6 mb-10">
							<div className="flex justify-between items-end">
								<span className="text-gray-900 font-bold">Estimated Total</span>
								<span className="text-4xl font-black text-indigo-600 font-display">${total.toFixed(2)}</span>
							</div>
						</div>

						<div className="space-y-4">
							<Button fullWidth size="lg" className="py-6 font-black text-lg shadow-indigo-200 shadow-2xl">
								Proceed to Checkout
							</Button>
							<Link to="/" className="block">
								<Button variant="secondary" fullWidth size="lg" className="py-6">
									Keep Shopping
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
