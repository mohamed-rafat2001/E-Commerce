import { useState, useMemo } from 'react';
import { useAdminCategories } from './index.js';

const useCategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { categories, isLoading } = useAdminCategories();

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && cat.isActive) || 
        (statusFilter === 'inactive' && !cat.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
  }), [categories]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    selectedCategory,
    isModalOpen,
    categoryToDelete,
    currentPage,
    ITEMS_PER_PAGE,
    statusFilter,
    setStatusFilter,
    
    // Data
    categories: paginatedCategories,
    allCategories: categories,
    isLoading,
    filteredCategories,
    totalPages,
    stats,
    
    // Handlers
    handleEdit,
    handleDelete,
    handleCreate,
    closeModal,
    closeDeleteModal,
    setCurrentPage
  };
};

export default useCategoriesPage;