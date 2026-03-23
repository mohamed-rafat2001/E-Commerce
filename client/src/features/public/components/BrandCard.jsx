/* Codebase Pattern Summary:
Modeled after shared/components/PublicProductCard.jsx and home/components/Brands/BrandCard.jsx.
This card keeps the same rounded card language, hover transitions, and link-first interaction style
used by existing public cards while adapting content for brand listings.
*/
import { Link } from "react-router-dom";
import { Card } from "../../../shared/ui/index.js";
import { FiTag } from "react-icons/fi";

export default function BrandCard({ brand }) {
	const brandId = brand._id || brand.id || brand.slug;
	const logoUrl = brand.logo?.secure_url || brand.logo?.url || brand.logo;
	const productCount = brand.productsCount || brand.productCount || 0;
	const tagline = brand.tagline || brand.category?.name || "Curated brand";

	return (
		<Link
			to={`/brands/${brandId}`}
			aria-label={`${brand.name || "Brand"} — ${productCount} products`}
			className="group block"
		>
			<Card hoverable className="h-full !rounded-[2rem]">
				<div className="p-8 flex flex-col h-full gap-6">
					<div className="aspect-[16/9] rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
						{logoUrl ? (
							<img
								src={logoUrl}
								alt={brand.name || "Brand logo"}
								className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
								crossOrigin="anonymous"
							/>
						) : (
							<div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
								<FiTag className="w-6 h-6" />
							</div>
						)}
					</div>

					<div className="space-y-2 mt-auto">
						<h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">
							{brand.name || "Unnamed Brand"}
						</h3>
						<p className="text-sm text-gray-500 font-medium line-clamp-1">{tagline}</p>
						<p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
							{productCount} {productCount === 1 ? "Product" : "Products"}
						</p>
					</div>
				</div>
			</Card>
		</Link>
	);
}
