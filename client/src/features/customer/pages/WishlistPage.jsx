import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, Card, Spinner, Badge } from "../../../shared/ui";
import useWishlist from "../../wishList/hooks/useWishlist";
import useDeleteFromWishlist from "../../wishList/hooks/useDeleteFromWishlist";
import useAddToCart from "../../cart/hooks/useAddToCart";
import toast from "react-hot-toast";

const WishlistPage = () => {
	const { wishlist, isLoading } = useWishlist();
	const { deleteFromWishlist, isLoading: isDeleting } = useDeleteFromWishlist();
	const { addToCart, isLoading: isAddingToCart } = useAddToCart();

	const wishlistItems = wishlist?.items || [];

	const handleMoveToCart = async (product) => {
		try {
			await addToCart({ itemId: product._id, quantity: 1 });
			await deleteFromWishlist(product._id);
			toast.success(`${product.name} moved to cart!`);
		} catch (error) {
			toast.error("Failed to move item to cart");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Spinner size="lg" />
			</div>
		);
	}

	if (wishlistItems.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
				<div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
					<FiHeart className="w-10 h-10 text-rose-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
				<p className="text-gray-500 mb-8 max-w-xs text-center">
					Save items you love to your wishlist and they'll show up here.
				</p>
				<Link to="/">
					<Button variant="primary" size="lg">
						Explore Products
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
				<Badge variant="gradient" size="lg">
					{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
				</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				<AnimatePresence mode="popLayout">
					{wishlistItems.map((item) => (
						<motion.div
							key={item.itemId._id}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.2 }}
						>
							<Card className="group h-full flex flex-col overflow-hidden border-transparent hover:border-rose-100 transition-all duration-300">
								{/* Product Image */}
								<div className="relative aspect-square overflow-hidden bg-gray-50">
									<img
										src={item.itemId.image?.secure_url || "/placeholder-product.png"}
										alt={item.itemId.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>
									<button
										onClick={() => deleteFromWishlist(item.itemId._id)}
										className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-rose-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
										title="Remove from wishlist"
									>
										<FiTrash2 className="w-5 h-5" />
									</button>
									{item.itemId.discount && (
										<div className="absolute top-3 left-3 px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg">
											-{item.itemId.discount}%
										</div>
									)}
								</div>

								{/* Product Content */}
								<div className="p-5 flex-1 flex flex-col">
									<div className="mb-4">
										<p className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">
											{item.itemId.category?.name || "Product"}
										</p>
										<h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
											{item.itemId.name}
										</h3>
									</div>

									<div className="mt-auto space-y-4">
										<div className="flex items-center justify-between">
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-black text-gray-900">
													${item.itemId.price}
												</span>
												{item.itemId.oldPrice && (
													<span className="text-sm text-gray-400 line-through">
														${item.itemId.oldPrice}
													</span>
												)}
											</div>
											<Badge variant={item.itemId.stock > 0 ? "success" : "danger"} size="sm">
												{item.itemId.stock > 0 ? "In Stock" : "Out of Stock"}
											</Badge>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<Button
												variant="primary"
												size="md"
												fullWidth
												icon={<FiShoppingBag />}
												onClick={() => handleMoveToCart(item.itemId)}
												disabled={item.itemId.stock <= 0 || isAddingToCart}
											>
												Add to Cart
											</Button>
											<Link to={`/product/${item.itemId._id}`} className="w-full">
												<Button
													variant="secondary"
													size="md"
													fullWidth
													icon={<FiArrowRight />}
													iconPosition="right"
												>
													View
												</Button>
											</Link>
										</div>
									</div>
								</div>
							</Card>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default WishlistPage;
