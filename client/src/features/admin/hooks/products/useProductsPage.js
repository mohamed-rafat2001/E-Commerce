import { useState, useMemo } from 'react';
import useAdminProducts from './useAdminProducts.js';
import { useUpdateProduct, useDeleteProduct } from './useProductMutations.js';
import useAdminCategories from '../categories/useAdminCategories.js';
import { ITEMS_PER_PAGE } from '../../components/products/productConstants.js';

const useProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewingProduct, setViewingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { products: fetchedProducts, isLoading } = useAdminProducts();
  const { categories: fetchedCategories } = useAdminCategories();
  const { updateProduct, isUpdating } = useUpdateProduct();
  const { deleteProduct, isDeleting } = useDeleteProduct();

  const products = fetchedProducts || [];
  const categories = fetchedCategories || [];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = (p.name || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || brand.includes(query);
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || p.category?.name === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useMemo(() => { setCurrentPage(1); }, [searchQuery, statusFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    lowStock: products.filter(p => p.countInStock <= 10 && p.countInStock > 0).length,
    outOfStock: products.filter(p => p.countInStock === 0).length,
  }), [products]);

  const categoryOptions = useMemo(() => {
    const names = [...new Set(categories.map(c => c.name).filter(Boolean))];
    return names.map(name => ({ value: name, label: name }));
  }, [categories]);

  const handleUpdateField = (id, data) => {
    updateProduct({ id, data });
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete._id, {
        onSuccess: () => { setProductToDelete(null); }
      });
    }
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    viewingProduct,
    setViewingProduct,
    productToDelete,
    setProductToDelete,
    currentPage,
    setCurrentPage,

    // Data
    products,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    stats,
    categoryOptions,

    // Loading states
    isLoading,
    isUpdating,
    isDeleting,

    // Functions
    handleUpdateField,
    handleConfirmDelete
  };
};

export default useProductsPage;