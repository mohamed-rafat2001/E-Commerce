import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={basePath} className="inline-flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
        <div className="p-12 bg-white border border-gray-100 rounded-3xl text-center shadow-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">Sorry, we couldn't load the product details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link to={basePath} className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors group">
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery Section */}
        <div className="lg:sticky top-8 self-start">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <ProductGallery gallery={gallery} enableZoom={true} />
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              <FiShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="p-3 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl transition-colors text-gray-600 hover:text-indigo-600">
              <FiHeart className="w-5 h-5" />
            </button>
            <button className="p-3 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl transition-colors text-gray-600 hover:text-indigo-600">
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="space-y-8">
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

      {/* Additional Product Details Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">SKU</span>
                <span className="font-medium text-gray-900">{product._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900">{product.primaryCategory?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subcategory</span>
                <span className="font-medium text-gray-900">{product.subCategory?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brand</span>
                <span className="font-medium text-gray-900">{product.brandId?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                  product.status === 'draft' ? 'bg-amber-100 text-amber-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping & Returns</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Free shipping on orders over $50</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>30-day return policy</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>2-year warranty</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
