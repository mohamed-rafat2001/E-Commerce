/* Codebase Pattern Summary:
Modeled after existing router-level page adapters and product filter URL conventions.
It forwards category and optional subcategory route state into /products query parameters
so filtering stays aligned with useProductFilters.
*/
import { Navigate, useParams, useSearchParams } from "react-router-dom";

export default function CategoryProductsRedirectPage() {
	const { categoryId } = useParams();
	const [searchParams] = useSearchParams();
	const subCategory = searchParams.get("sub");
	const target = subCategory
		? `/products?category=${categoryId}&subCategory=${subCategory}`
		: `/products?category=${categoryId}`;

	return <Navigate to={target} replace />;
}
