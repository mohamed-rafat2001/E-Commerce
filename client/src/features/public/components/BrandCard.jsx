/* Codebase Pattern Summary:
Modeled after shared/components/PublicProductCard.jsx and home/components/Brands/BrandCard.jsx.
This card keeps the same rounded card language, hover transitions, and link-first interaction style
used by existing public cards while adapting content for brand listings.
*/
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiTag } from "react-icons/fi";

export default function BrandCard({ brand }) {
	const brandId = brand._id || brand.id || brand.slug;
	const coverUrl = brand.coverImage?.secure_url || brand.coverImage?.url || brand.coverImage;
	const logoUrl = brand.logo?.secure_url || brand.logo?.url || brand.logo;
	const productCount = brand.productsCount || brand.productCount || 0;
	const rating = Number(brand.ratingAverage || 0);

	return (
		<Link
			to={`/brands/${brandId}`}
			aria-label={`${brand.name || "Brand"} — ${productCount} products`}
			className="group block h-full"
		>
			<motion.article
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="flex flex-col h-full font-sans"
			>
				<div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 mb-4">
					{coverUrl ? (
						<img
							src={coverUrl}
							alt={brand.name || "Brand cover"}
							className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
							crossOrigin="anonymous"
						/>
					) : (
						<div className="w-full h-full bg-gray-50" />
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

					<div className="absolute bottom-3 left-3 z-10">
						<div className="w-10 h-10 rounded-full overflow-hidden border border-white bg-white flex items-center justify-center">
							{logoUrl ? (
								<img
									src={logoUrl}
									alt={brand.name || "Brand logo"}
									className="w-full h-full object-cover"
									crossOrigin="anonymous"
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
									<FiTag className="w-4 h-4" />
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="px-1 flex flex-col flex-1">
					<div className="flex justify-between items-start gap-2 mb-1">
						<h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">
							{brand.name || "Unnamed Brand"}
						</h3>
					</div>

					<div className="flex items-center justify-between mt-auto">
						<div className="flex items-center gap-2">
							<div className="flex items-center text-yellow-500">
								<FiStar className="w-3 h-3 fill-current" />
								<span className="ml-1 text-[10px] font-bold text-gray-900">{rating.toFixed(1)}</span>
							</div>
							<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
								{productCount} {productCount === 1 ? "Item" : "Items"}
							</span>
						</div>
					</div>
				</div>
			</motion.article>
		</Link>
	);
}
