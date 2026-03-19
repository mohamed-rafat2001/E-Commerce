import { Button, Card, PageHeader, Skeleton, EmptyState } from "../../../shared/ui";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import useCartPage from "../../cart/hooks/useCartPage";
import CartItemCard from "../../cart/components/CartItemCard";
import CartSummary from "../../cart/components/CartSummary";

const CartPage = () => {
	const {
		cartItems, isLoading, subtotal, shipping, total,
		handleQuantityChange, removeFromCart, clearCartAction, handleCheckout,
	} = useCartPage();

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
					action={{ label: "Start Shopping", onClick: () => window.location.href = '/' }}
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
					<Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => clearCartAction()}>
						Clear Everything
					</Button>
				}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4">
					<AnimatePresence mode="popLayout">
						{cartItems.map((item) => {
							const product = item.item || item.itemId || item.productId || item;
							const productId = product?._id || product?.id || item.product_id;
							if (!productId) return null;
							return (
								<motion.div key={productId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
									<CartItemCard item={item} onQuantityChange={handleQuantityChange} onRemove={removeFromCart} />
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
				<CartSummary subtotal={subtotal} shipping={shipping} total={total} onCheckout={handleCheckout} />
			</div>
		</div>
	);
};

export default CartPage;
