import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import useGetProduct from '../hooks/useGetProduct';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductStory from '../components/ProductStory';
import RelatedProducts from '../components/RelatedProducts';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error, refetch } = useGetProduct(id);

  const galleryImages = useMemo(() => {
    const images = [];
    if (product?.coverImage?.secure_url) images.push(product.coverImage.secure_url);
    if (Array.isArray(product?.images)) {
      product.images.forEach(img => {
        if (img?.secure_url) images.push(img.secure_url);
      });
    }
    return images;
  }, [product]);

  if (isLoading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8">
            <FiArrowLeft className="w-10 h-10 rotate-45" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
            We couldn't find the piece you're looking for. It might have been moved or is no longer available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gray-900 text-white font-black uppercase tracking-widest rounded-full hover:bg-black transition-all"
            >
              Back to Gallery
            </button>
            <button
              onClick={() => refetch()}
              className="px-8 py-4 border-2 border-gray-100 text-gray-900 font-black uppercase tracking-widest rounded-full hover:bg-gray-50 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-10 group"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Curated Gallery</span>
        </button>

        {/* Section 1: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-32">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <ProductGallery 
              images={galleryImages} 
              productName={product.name} 
              productId={product._id} 
            />
          </div>
          <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Section 2: Product Story */}
        <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <ProductStory product={product} />
        </div>

        {/* Section 3: Related Products */}
        <div className="animate-in fade-in duration-1000 delay-500">
          <RelatedProducts 
            productId={product._id} 
            categoryId={product.primaryCategory?._id || product.primaryCategory} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
