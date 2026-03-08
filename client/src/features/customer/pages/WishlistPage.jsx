import { FiHeart, FiTrash2, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, Card, Badge, PageHeader, Skeleton, EmptyState } from "../../../shared/ui";
import useWishlist from "../../wishList/hooks/useWishlist";
import useDeleteFromWishlist from "../../wishList/hooks/useDeleteFromWishlist";
import { useState } from "react";
import ProductCardGallery from "../../product/components/ProductCardGallery.jsx";

const WishlistProductCard = ({ item, onDelete }) => {
	const [isHovered, setIsHovered] = useState(false);
	
	// Build images array for gallery
	const allImages = [
		item.itemId.image,
		...(Array.isArray(item.itemId.images) ? item.itemId.images : [])
	].filter(Boolean);

	return (
		<Card padding="sm" className="group h-full flex flex-col overflow-hidden">
			<div 
				className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<ProductCardGallery
					images={allImages}
					productName={item.itemId.name}
					isHovered={isHovered}
					autoSlide={true}
				/>
				<button
					onClick={() => onDelete(item.itemId._id)}
					className="absolute top-3 right-3 p-2.5 bg-white shadow-sm hover:shadow-md text-gray-400 hover:text-red-500 rounded-xl transition-all duration-200 z-10"
				>
					<FiTrash2 className="w-5 h-5" />
				</button>
			</div>

			<div className="p-2 pt-4 flex-1 flex flex-col">
				<div className="mb-4">
					<p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
						{item.itemId.category?.name || "Product"}
					</p>
					<h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
						{item.itemId.name}
					</h3>
				</div>

				<div className="mt-auto space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-2xl font-black text-gray-900">${item.itemId?.price?.amount || 0}</span>
						<Badge variant={item.itemId.stock > 0 ? "success" : "error"}>
							{item.itemId.stock > 0 ? "In Stock" : "Out of Stock"}
						</Badge>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<Link to={`/product/${item.itemId._id}`} className="w-full col-span-2">
							<Button
								variant="primary"
								fullWidth
								className="flex items-center justify-center gap-2"
							>
								Add to Cart
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</Card>
	);
};

const WishlistPage = () => {
	const { wishlist, isLoading } = useWishlist();
	const { deleteFromWishlist } = useDeleteFromWishlist();

	const wishlistItems = wishlist?.items || [];

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					<Skeleton variant="card" count={3} />
				</div>
			</div>
		);
	}

	if (wishlistItems.length === 0) {
		return (
			<Card padding="lg">
				<EmptyState
					icon={<FiHeart className="w-12 h-12" />}
					title="Your wishlist is empty"
					message="Save items you love to your wishlist and they'll show up here."
					action={{
						label: "Explore Products",
						onClick: () => window.location.href = '/'
					}}
				/>
			</Card>
		);
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="My Wishlist"
				subtitle="Track and manage the products you're interested in."
				actions={
					<Badge variant="primary">
						{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
					</Badge>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				<AnimatePresence mode="popLayout">
					{wishlistItems.map((item) => (
						<motion.div
							key={item.itemId._id}
							layout
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							<WishlistProductCard item={item} onDelete={deleteFromWishlist} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default WishlistPage;
