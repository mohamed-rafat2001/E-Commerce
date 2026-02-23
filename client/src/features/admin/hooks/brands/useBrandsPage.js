import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAdminBrands from './useAdminBrands.js';

const useBrandsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Initialize state from URL params to keep sync
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const { brands, total, loading, refetch } = useAdminBrands();
  
  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm, page: 1, limit });
    refetch();
  };
  
  const handlePageChange = (newPage) => {
    setSearchParams({ search: searchTerm, page: newPage, limit });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchParams({ search: '', page: 1, limit });
  };

  return {
    searchTerm,
    setSearchTerm,
    brands,
    total,
    loading,
    page,
    limit,
    totalPages,
    handleSearch,
    handlePageChange,
    handleClearSearch
  };
};

export default useBrandsPage;
