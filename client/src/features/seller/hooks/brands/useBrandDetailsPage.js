import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useBrandDetails from './useBrandDetails.js';
import { useUpdateProduct, useDeleteProduct } from '../index.js';
import { updateBrandLogo, deleteBrandLogo, updateBrand } from '../../services/seller.js';
import useToast from '../../../../shared/hooks/useToast.js';

const useBrandDetailsPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCoverEditModalOpen, setIsCoverEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Filter & Sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Category Accordion
    const [expandedCategories, setExpandedCategories] = useState({});

    // Core data
    const {
        brand, products, allProducts, allProductsCount,
        selectedSubCategory, setSelectedSubCategory,
        isLoading, error
    } = useBrandDetails();

    // Product Actions
    const { updateProduct, isUpdating } = useUpdateProduct({
        invalidateKeys: ['brand', id, 'products']
    });
    const { deleteProduct, isDeleting } = useDeleteProduct({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand', id] });
            showSuccess('Product deleted successfully');
        }
    });

    const handleUpdateStock = (productId, stock) => {
        updateProduct({ id: productId, product: { countInStock: stock } });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsEditProductModalOpen(true);
    };

    const handleUpdateProduct = (data) => {
        updateProduct({ id: editingProduct._id, product: data }, {
            onSuccess: () => {
                showSuccess('Product updated successfully!');
                setIsEditProductModalOpen(false);
                setEditingProduct(null);
                queryClient.invalidateQueries({ queryKey: ['brand', id] });
            },
            onError: (err) => {
                showError(err.response?.data?.message || 'Failed to update product');
            }
        });
    };

    // Filtered & sorted products
    const displayedProducts = useMemo(() => {
        let result = [...(products || [])];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        }
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
                break;
            case 'price-desc':
                result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
        }
        return result;
    }, [products, searchQuery, sortBy]);

    // Categories tree
    const categoriesTree = useMemo(() => {
        const tree = {};
        const productsData = allProducts || [];
        productsData.forEach(product => {
            const cat = product.primaryCategory;
            const sub = product.subCategory;
            if (!cat || typeof cat !== 'object' || !cat._id) return;
            if (!tree[cat._id]) {
                tree[cat._id] = { ...cat, subCategories: {} };
            }
            if (sub && typeof sub === 'object' && sub._id) {
                if (!tree[cat._id].subCategories[sub._id]) {
                    tree[cat._id].subCategories[sub._id] = sub;
                }
            }
        });
        if (brand) {
            if (brand.primaryCategory && brand.primaryCategory._id) {
                const pCat = brand.primaryCategory;
                if (!tree[pCat._id]) {
                    tree[pCat._id] = { _id: pCat._id, name: pCat.name, subCategories: {} };
                }
            }
            if (brand.subCategories && Array.isArray(brand.subCategories)) {
                brand.subCategories.forEach(sub => {
                    if (!sub || typeof sub !== 'object') return;
                    let parentId, parentName;
                    if (sub.categoryId && typeof sub.categoryId === 'object' && sub.categoryId._id) {
                        parentId = sub.categoryId._id;
                        parentName = sub.categoryId.name;
                    } else if (brand.primaryCategory && brand.primaryCategory._id) {
                        parentId = brand.primaryCategory._id;
                        parentName = brand.primaryCategory.name;
                    } else {
                        return;
                    }
                    if (!tree[parentId]) {
                        tree[parentId] = { _id: parentId, name: parentName, subCategories: {} };
                    }
                    if (!tree[parentId].subCategories[sub._id]) {
                        tree[parentId].subCategories[sub._id] = sub;
                    }
                });
            }
        }
        return Object.values(tree).map(cat => ({
            ...cat,
            subCategories: Object.values(cat.subCategories)
        }));
    }, [allProducts, brand]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubCategory, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return displayedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [displayedProducts, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleCategory = (catId) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    // Image mutations
    const uploadCoverMutation = useMutation({
        mutationFn: ({ id, formData }) => updateBrand(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand', id] });
            showSuccess('Cover image updated successfully!');
            setIsCoverEditModalOpen(false);
        },
        onError: (err) => {
            showError(err.response?.data?.message || 'Failed to update cover image');
        }
    });

    const uploadLogoMutation = useMutation({
        mutationFn: ({ id, formData }) => updateBrandLogo(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand', id] });
            showSuccess('Logo updated successfully!');
            setIsEditModalOpen(false);
        },
        onError: (err) => {
            showError(err.response?.data?.message || 'Failed to update logo');
        }
    });

    const deleteLogoMutation = useMutation({
        mutationFn: (id) => deleteBrandLogo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand', id] });
            showSuccess('Logo deleted successfully!');
            setIsDeleteModalOpen(false);
        },
        onError: (err) => {
            showError(err.response?.data?.message || 'Failed to delete logo');
        }
    });

    const handleLogoUpload = (file, brandId) => {
        const formData = new FormData();
        formData.append('logo', file);
        uploadLogoMutation.mutate({ id: brandId, formData });
    };

    const handleCoverUpload = (file, brandId) => {
        const formData = new FormData();
        formData.append('coverImage', file);
        uploadCoverMutation.mutate({ id: brandId, formData });
    };

    const handleDeleteLogo = () => {
        deleteLogoMutation.mutate(id);
    };

    const getBrandInitialLogo = (name) => {
        const initial = name ? name.charAt(0).toUpperCase() : 'B';
        return `https://placehold.co/400x400?text=${initial}`;
    };

    return {
        // Data
        brand, isLoading, error,
        paginatedProducts, displayedProducts,
        categoriesTree, allProductsCount,
        totalPages, currentPage,
        // Filter/Sort
        searchQuery, setSearchQuery,
        sortBy, setSortBy,
        isSortDropdownOpen, setIsSortDropdownOpen,
        selectedSubCategory, setSelectedSubCategory,
        // Category accordion
        expandedCategories, toggleCategory,
        // Pagination
        handlePageChange,
        // Product actions
        handleUpdateStock, handleEditProduct, handleUpdateProduct,
        deleteProduct, isUpdating, isDeleting,
        editingProduct,
        // Modal states
        isEditModalOpen, setIsEditModalOpen,
        isCoverEditModalOpen, setIsCoverEditModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        isShowModalOpen, setIsShowModalOpen,
        isDropdownOpen, setIsDropdownOpen,
        isEditProductModalOpen, setIsEditProductModalOpen,
        setEditingProduct,
        // Image actions
        handleLogoUpload, handleCoverUpload, handleDeleteLogo,
        uploadLogoMutation, uploadCoverMutation, deleteLogoMutation,
        // Helpers
        getBrandInitialLogo,
    };
};

export default useBrandDetailsPage;
