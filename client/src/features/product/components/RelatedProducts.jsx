import React from 'react';
import { Link } from 'react-router-dom';
import useRelatedProducts from '../hooks/useRelatedProducts';
import { PublicProductCard } from '../../../shared';
import PublicProductCardSkeleton from '../../../shared/components/PublicProductCardSkeleton';

const RelatedProducts = ({ productId, categoryId }) => {
  const { relatedProducts, isLoading, error } = useRelatedProducts(productId, categoryId);

  if (error) return null;

  return (
    <section className="mt-32 pb-24 border-t border-gray-100 pt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-display mb-3">
            You May Also Like
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl">
            Curated pieces that complement your style.
          </p>
        </div>
        <Link 
          to="/products" 
          className="text-indigo-600 font-black hover:underline flex items-center gap-2 group text-sm uppercase tracking-widest"
        >
          View Gallery 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <PublicProductCardSkeleton key={i} />
          ))
        ) : (
          relatedProducts.map((product) => (
            <PublicProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
