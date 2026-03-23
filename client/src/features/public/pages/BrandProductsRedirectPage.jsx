/* Codebase Pattern Summary:
Modeled after existing route-driven public pages that delegate to feature pages.
This route adapter keeps URL navigation declarative and forwards brand context
into the existing /products filtering pattern.
*/
import { Navigate, useParams } from "react-router-dom";

export default function BrandProductsRedirectPage() {
	const { brandId } = useParams();
	return <Navigate to={`/products?brandId=${brandId}`} replace />;
}
