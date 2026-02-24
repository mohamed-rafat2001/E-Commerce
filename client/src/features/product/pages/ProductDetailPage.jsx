import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner, Card } from '../../../shared/ui/index.js';
import { FiArrowLeft } from 'react-icons/fi';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import useProductDetailPage from '../hooks/useProductDetailPage.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const {
    product,
    isLoading,
    error,
    basePath,
    isSeller,
    gallery,
    isUpdating,
    onChangeStatus,
    onChangeVisibility,
    onUpdateStock
  } = useProductDetailPage(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" message="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Link to={`${basePath}/products`} className="inline-flex items-center text-indigo-600 mb-4">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
        <div className="p-8 bg-white border border-gray-100 rounded-2xl text-center">
          <p className="text-rose-600 font-semibold">Could not load product details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <Link to={`${basePath}/products`} className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky top-6 self-start">
          <Card className="overflow-hidden">
            <div className="bg-white">
              <ProductGallery gallery={gallery} enableZoom={true} />
            </div>
          </Card>
        </div>

        <div className="lg:sticky top-6">
          <ProductInfo 
            product={product} 
            basePath={basePath} 
            isSeller={isSeller}
            isUpdating={isUpdating}
            onChangeStatus={onChangeStatus}
            onChangeVisibility={onChangeVisibility}
            onUpdateStock={onUpdateStock}
          />
        </div>
      </div>
    </div>
  );
}
