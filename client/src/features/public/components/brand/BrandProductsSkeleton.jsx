/* Pattern Summary:
Modeled after shared/components/PublicProductCardSkeleton.jsx and list page loading grids.
It preserves the same card skeleton language and responsive product-grid shape.
*/
import PublicProductCardSkeleton from "../../../../shared/components/PublicProductCardSkeleton.jsx";

export default function BrandProductsSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
			{[...Array(4)].map((_, idx) => (
				<PublicProductCardSkeleton key={idx} />
			))}
		</div>
	);
}
