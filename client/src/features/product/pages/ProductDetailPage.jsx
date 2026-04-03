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
import SEO, { schemas } from '../../../shared/components/SEO.jsx';
import Breadcrumbs from '../../../shared/components/Breadcrumbs.jsx';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <LoadingSpinner size="xl" color="primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-center px-4">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all"
            aria-label="Back to all products"
          >
            <FiArrowLeft aria-hidden="true" /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  const brandName = product.brandId?.name || product.brand?.name || 'ShopyNow';
  const price = typeof product.price === 'object' ? product.price.amount : (product.price || 0);

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    ...(product.primaryCategory?.name
      ? [{ name: product.primaryCategory.name, url: `/products?category=${categoryId}` }]
      : []),
    { name: product.name },
  ];

  // JSON-LD structured data
  const productSchema = schemas.product(product);

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" itemScope itemType="https://schema.org/Product">
      <SEO
        title={`${product.name} — ${brandName}`}
        description={`Buy ${product.name} by ${brandName} for $${price.toFixed(2)}. ${product.description?.slice(0, 120) || 'Premium quality, fast delivery.'}`}
        canonical={`/products/${id}`}
        ogImage={product.coverImage?.secure_url}
        ogType="product"
        jsonLd={productSchema}
      />

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Breadcrumb with JSON-LD */}
        <Breadcrumbs items={breadcrumbItems} />

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
          <section className="mt-20" aria-label="Related products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">You Might Also Like</h2>
              <Link
                to={`/products?category=${categoryId}`}
                className="text-primary text-sm font-semibold hover:underline"
                aria-label={`View all products in ${product.primaryCategory?.name || 'this category'}`}
              >
                View All in {product.primaryCategory?.name || 'Category'}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 8).map(rp => (
                <PublicProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
