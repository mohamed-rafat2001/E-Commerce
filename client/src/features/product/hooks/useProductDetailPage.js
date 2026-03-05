import { useMemo, useState } from 'react';
import useBasePath from '../../../shared/hooks/useBasePath.js';
import useGetProduct from './useGetProduct.js';
import useUpdateProduct from './useUpdateProduct.js';

const DEFAULT_IMG = 'https://placehold.co/600x600?text=No+Image';

export default function useProductDetailPage(id, options = {}) {
  const basePath = useBasePath();

  const { product, isLoading, error } = useGetProduct(id);

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

  const isSeller = options.isSeller || basePath === '/seller';
  const [thumbs, setThumbs] = useState(null);
  const { updateProduct, isUpdating } = useUpdateProduct({
    invalidateKeys: isSeller ? ['seller-products', 'product'] : ['products', 'product']
  });

  const onChangeStatus = (status) => {
    if (!product?._id) return;
    updateProduct({ id: product._id, product: { status } });
  };

  const onChangeVisibility = (visibility) => {
    if (!product?._id) return;
    updateProduct({ id: product._id, product: { visibility } });
  };

  const onUpdateStock = (countInStock) => {
    if (!product?._id) return;
    updateProduct({ id: product._id, product: { countInStock } });
  };

  return {
    product,
    isLoading,
    error,
    basePath,
    gallery,
    thumbs,
    setThumbs,
    isUpdating,
    onChangeStatus,
    onChangeVisibility,
    onUpdateStock
  };
}
