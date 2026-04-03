import { useEffect, useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Card, PageHeader, EmptyState, Pagination } from "../../../shared/ui";
import useWishlist from "../../wishList/hooks/useWishlist";
import { PublicProductCard, PublicProductCardSkeleton } from "../../../shared";

const WishlistPage = () => {
	const { wishlist, isLoading } = useWishlist();
	const wishlistItems = useMemo(() => wishlist?.items || [], [wishlist]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;
	const totalPages = Math.max(1, Math.ceil(wishlistItems.length / itemsPerPage));
	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);
	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return wishlistItems.slice(start, start + itemsPerPage);
	}, [currentPage, wishlistItems]);

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="h-10 w-1/4 bg-gray-200 animate-pulse rounded" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{[...Array(8)].map((_, i) => (
						<PublicProductCardSkeleton key={`skeleton-${i}`} />
					))}
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

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
				<AnimatePresence mode="popLayout">
					{paginatedItems.map((item) => {
						const product = item.itemId || item.productId || item;
						const keyId = product._id || product.id || item.product_id;
						return (
							<motion.div
								key={keyId}
								layout
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.2 }}
								className="flex flex-col"
							>
								<PublicProductCard product={product} />
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>

			{totalPages > 1 && (
				<nav className="mt-10 border-t border-gray-100 pt-6" aria-label="Wishlist pagination">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</nav>
			)}
		</div>
	);
};

export default WishlistPage;
