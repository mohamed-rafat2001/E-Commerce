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
	const tagline = brand.tagline || brand.primaryCategory?.name || "Curated brand";
	const rating = Number(brand.ratingAverage || 0);
	const ratingCount = Number(brand.ratingCount || 0);

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
				<div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 mb-6">
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
					<div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

					<div className="absolute top-6 left-6 z-10">
						<span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
							{productCount} {productCount === 1 ? "Product" : "Products"}
						</span>
					</div>

					<div className="absolute bottom-5 left-5 z-10">
						<div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white bg-white flex items-center justify-center">
							{logoUrl ? (
								<img
									src={logoUrl}
									alt={brand.name || "Brand logo"}
									className="w-full h-full object-cover"
									crossOrigin="anonymous"
								/>
							) : (
								<div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
									<FiTag className="w-5 h-5" />
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="px-1 flex flex-col flex-1">
					<span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{tagline}</span>
					<div className="flex justify-between items-start gap-4 mb-3">
						<h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
							{brand.name || "Unnamed Brand"}
						</h3>
					</div>

					<div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
						<div className="flex items-center text-yellow-500">
							<FiStar className="w-3.5 h-3.5 fill-current" />
							<span className="ml-1 text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
							<span className="ml-1 text-xs text-gray-500">({ratingCount})</span>
						</div>
						<span className="rounded-full px-4 py-2 bg-gray-900 text-white text-[10px] uppercase font-black tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">
							View Brand
						</span>
					</div>
				</div>
			</motion.article>
		</Link>
	);
}
