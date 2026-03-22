import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { FiArrowLeft } from 'react-icons/fi';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductTabs from '../components/ProductTabs.jsx';
import useProductDetailPage from '../hooks/useProductDetailPage.js';
import useRelatedProducts from '../hooks/useRelatedProducts.js';
import { PublicProductCard } from '../../../shared/index.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    product,
    isLoading,
    error,
    gallery
  } = useProductDetailPage(id);

  const categoryId = product?.primaryCategory?._id || product?.primaryCategory;
  const { relatedProducts, isLoading: isRelatedLoading } = useRelatedProducts(id, categoryId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="xl" color="primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all"
          >
            <FiArrowLeft /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-400 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">{'>'}</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="mx-2 text-gray-300">{'>'}</span>
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* Image Gallery (Left, 55%) */}
          <div className="lg:w-[55%]">
            <ProductGallery gallery={gallery} />
          </div>

          {/* Product Info (Right, 45%) */}
          <div className="lg:w-[45%]">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} />

        {/* Related Products Section */}
        {!isRelatedLoading && relatedProducts?.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">You Might Also Like</h3>
              <Link
                to={`/products?category=${categoryId}`}
                className="text-primary text-sm font-semibold hover:underline"
              >
                View All in {product.primaryCategory?.name || 'Category'}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 8).map(rp => (
                <PublicProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
