import { useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../services/product.js';
import { Badge, Button, LoadingSpinner, Card } from '../../../shared/ui/index.js';
import { FiArrowLeft, FiTag, FiLayers, FiBox, FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const DEFAULT_IMG = 'https://placehold.co/600x600?text=No+Image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' 
                 : location.pathname.startsWith('/seller') ? '/seller'
                 : location.pathname.startsWith('/customer') ? '/customer'
                 : '/';

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });

  const product = data?.data?.data;

  const gallery = useMemo(() => {
    const list = [];
    if (product?.coverImage?.secure_url) list.push(product.coverImage.secure_url);
    if (Array.isArray(product?.images)) {
      product.images.forEach(img => {
        if (img?.secure_url) list.push(img.secure_url);
      });
    }
    return list.length ? list : [DEFAULT_IMG];
  }, [product]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
        {/* Gallery */}
        <div>
          <Card className="overflow-hidden">
            <div className="bg-white">
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="rounded-2xl"
              >
                {gallery.map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={src}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                        onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {gallery.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Thumbs]}
                  spaceBetween={8}
                  slidesPerView={5}
                  watchSlidesProgress
                  className="mt-3"
                >
                  {gallery.map((src, idx) => (
                    <SwiperSlide key={`thumb-${idx}`}>
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={src}
                          alt={`Thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </Card>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {product.brandId?.name && (
              <Badge variant="secondary">{product.brandId.name}</Badge>
            )}
            {product.primaryCategory?.name && (
              <Badge variant="info">{product.primaryCategory.name}</Badge>
            )}
            {product.subCategory?.name && (
              <Badge variant="warning">{product.subCategory.name}</Badge>
            )}
            <Badge variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'secondary'}>
              {product.status}
            </Badge>
            <Badge>{product.visibility}</Badge>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-indigo-600">
              ${product.price?.amount?.toFixed(2) || '0.00'}
            </span>
            <span className={`text-sm font-semibold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
            </span>
          </div>

          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <span key={s} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiTag className="w-4 h-4" />
              <span>Slug:</span>
              <span className="font-medium">{product.slug}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiLayers className="w-4 h-4" />
              <span>Category:</span>
              <span className="font-medium">{product.primaryCategory?.name || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiBox className="w-4 h-4" />
              <span>Visibility:</span>
              <span className="font-medium">{product.visibility}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiStar className="w-4 h-4 text-amber-400" />
              <span>Rating:</span>
              <span className="font-medium">{(product.ratingAverage || 0).toFixed(1)} ({product.ratingCount || 0})</span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="secondary" asChild>
              <a href={`${basePath}/products`}>Back to list</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

