/* Codebase Pattern Summary:
Modeled after home/components/Categories/CategoryCard.jsx and shared/components/PublicProductCard.jsx.
The component preserves the existing card aesthetics and hover motion language while adding
expandable subcategory chips to match public category browsing behavior.
*/
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../shared/ui/index.js";
import { FiChevronDown, FiGrid } from "react-icons/fi";

const palette = [
	"bg-blue-50 text-blue-600 border-blue-100",
	"bg-emerald-50 text-emerald-600 border-emerald-100",
	"bg-amber-50 text-amber-600 border-amber-100",
	"bg-purple-50 text-purple-600 border-purple-100",
	"bg-rose-50 text-rose-600 border-rose-100",
	"bg-indigo-50 text-indigo-600 border-indigo-100",
];

export default function CategoryCard({ category, index }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const categoryId = category._id || category.id || category.slug;
	const subCategories = Array.isArray(category.subCategories) ? category.subCategories : [];
	const hasSubCategories = subCategories.length > 0;
	const imageUrl = category.image?.secure_url || category.image?.url || category.image;
	const count = category.productsCount || category.productCount || 0;
	const softColor = useMemo(() => palette[index % palette.length], [index]);

	return (
		<Card className="h-full !rounded-[2rem] group">
			<div className="p-7 flex flex-col h-full gap-5">
				<div className="flex items-start justify-between gap-3">
					<Link
						to={`/categories/${categoryId}`}
						aria-label={`${category.name || "Category"} — ${count} products`}
						className="flex-1"
					>
						<div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${softColor}`}>
							{imageUrl ? (
								<img
									src={imageUrl}
									alt={category.name || "Category"}
									className="w-full h-full object-cover rounded-2xl"
									crossOrigin="anonymous"
								/>
							) : (
								<FiGrid className="w-6 h-6" />
							)}
						</div>
					</Link>

					{hasSubCategories && (
						<button
							type="button"
							onClick={() => setIsExpanded((prev) => !prev)}
							className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center"
							aria-label={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
						>
							<FiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
						</button>
					)}
				</div>

				<Link to={`/categories/${categoryId}`} className="space-y-2">
					<h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">
						{category.name || "Unnamed Category"}
					</h3>
					{category.description && (
						<p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
					)}
					<p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
						{count} {count === 1 ? "Product" : "Products"}
					</p>
				</Link>

				{hasSubCategories && isExpanded && (
					<div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
						{subCategories.map((sub) => {
							const subId = sub._id || sub.id;
							return (
								<Link
									key={subId}
									to={`/categories/${categoryId}?sub=${subId}`}
									className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-wider"
								>
									{sub.name}
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</Card>
	);
}
