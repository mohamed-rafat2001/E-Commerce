import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiMail, FiPhone, FiGlobe, FiCalendar, FiBox, FiTag, FiArrowLeft, FiEdit2, FiTrash2, FiEye, FiMoreVertical, FiStar, FiExternalLink, FiSearch, FiShare2, FiChevronDown, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useBrandDetails from '../hooks/brands/useBrandDetails';
import { updateBrandLogo, deleteBrandLogo } from '../services/seller.js';
import LogoEditModal from '../components/brands/LogoEditModal.jsx';
import { Modal, Button } from '../../../shared/ui/index.js';
import useToast from '../../../shared/hooks/useToast.js';

const DEFAULT_BRAND_LOGO = "https://placehold.co/400x400?text=No+Logo";
const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/400x400?text=No+Image";

const BrandDetailsPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Category Accordion State
    const [expandedCategories, setExpandedCategories] = useState({});

    const { 
        brand, 
        products, 
        allProducts,
        allProductsCount, 
        selectedSubCategory, 
        setSelectedSubCategory, 
        isLoading, 
        error 
    } = useBrandDetails();

    const getBrandInitialLogo = (name) => {
        const initial = name ? name.charAt(0).toUpperCase() : 'B';
        return `https://placehold.co/400x400?text=${initial}`;
    };

    const displayedProducts = useMemo(() => {
        let result = [...(products || [])];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.description && p.description.toLowerCase().includes(query))
            );
        }

        // Sort
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

    // Derived Categories Tree
    const categoriesTree = useMemo(() => {
        const tree = {};
        const productsData = allProducts || [];
        
        // 1. Build tree from Products
        productsData.forEach(product => {
            const cat = product.primaryCategory;
            const sub = product.subCategory;
            
            // Skip if category is not populated or invalid
            if (!cat || typeof cat !== 'object' || !cat._id) return;

            if (!tree[cat._id]) {
                tree[cat._id] = {
                    ...cat,
                    subCategories: {}
                };
            }

            // Only add subcategory if populated and valid
            if (sub && typeof sub === 'object' && sub._id) {
                if (!tree[cat._id].subCategories[sub._id]) {
                    tree[cat._id].subCategories[sub._id] = sub;
                }
            }
        });

        // 2. Augment tree from Brand's defined SubCategories (if available)
        if (brand) {
            // Add Primary Category first
            if (brand.primaryCategory && brand.primaryCategory._id) {
                const pCat = brand.primaryCategory;
                if (!tree[pCat._id]) {
                    tree[pCat._id] = {
                        _id: pCat._id,
                        name: pCat.name,
                        subCategories: {}
                    };
                }
            }

            // Add SubCategories
            if (brand.subCategories && Array.isArray(brand.subCategories)) {
                brand.subCategories.forEach(sub => {
                    if (!sub || typeof sub !== 'object') return;

                    let parentId, parentName;

                    if (sub.categoryId && typeof sub.categoryId === 'object' && sub.categoryId._id) {
                        // Fully populated
                        parentId = sub.categoryId._id;
                        parentName = sub.categoryId.name;
                    } else if (brand.primaryCategory && brand.primaryCategory._id) {
                        // Fallback to primary category if subcategory has no parent but brand has primary
                        parentId = brand.primaryCategory._id;
                        parentName = brand.primaryCategory.name;
                    } else {
                        // Skip if we can't determine a parent category
                        return;
                    }

                    if (!tree[parentId]) {
                        tree[parentId] = {
                            _id: parentId,
                            name: parentName,
                            subCategories: {}
                        };
                    }

                    // Add subcategory if not already present
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

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubCategory, searchQuery, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return displayedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [displayedProducts, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Toggle Category Accordion
    const toggleCategory = (catId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Mutations
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

    const handleUploadLogo = (file, brandId) => {
        const formData = new FormData();
        formData.append('logo', file);
        uploadLogoMutation.mutate({ id: brandId, formData });
    };

    const handleDeleteLogo = () => {
        deleteLogoMutation.mutate(id);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error loading brand details: {error.message}
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Brand not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className={`relative rounded-3xl overflow-hidden shadow-xl ${brand.coverImage?.secure_url ? '' : 'bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900'}`}>
                    {brand.coverImage?.secure_url && (
                        <img 
                            src={brand.coverImage.secure_url} 
                            alt="Cover" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    {/* Background Effects */}
                    <div className={`absolute inset-0 ${brand.coverImage?.secure_url ? 'bg-black/40' : ''}`}></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10"></div>
                    
                    <div className="relative px-6 py-8 md:px-10 md:py-10">
                        {/* Back Button */}
                        <Link to="/seller/brands" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 py-2 font-medium">
                            <FiArrowLeft className="mr-2" /> Back to Brands
                        </Link>

                        <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                            
                            {/* Brand Logo with Actions */}
                            <div 
                                className="relative group cursor-pointer shrink-0 z-10"
                                onMouseLeave={() => setIsDropdownOpen(false)}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="relative rounded-2xl p-1.5 bg-white shadow-2xl ring-1 ring-black/5">
                                    <img 
                                        src={brand.logo?.secure_url || getBrandInitialLogo(brand.name)} 
                                        alt={brand.name} 
                                        onError={(e) => { e.target.src = getBrandInitialLogo(brand.name); }}
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover bg-gray-50 border border-gray-100"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-1.5 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors transform group-hover:scale-110 duration-200">
                                            <FiEdit2 className="w-5 h-5 text-gray-900" />
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-1">
                                                <button 
                                                    onClick={() => {
                                                        setIsShowModalOpen(true);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                                                >
                                                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md"><FiEye className="w-4 h-4" /></div>
                                                    View Logo
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setIsEditModalOpen(true);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                                                >
                                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><FiEdit2 className="w-4 h-4" /></div>
                                                    Change Logo
                                                </button>
                                                {brand.logo?.secure_url && (
                                                    <div className="border-t border-gray-100 my-1 pt-1">
                                                        <button 
                                                            onClick={() => {
                                                                setIsDeleteModalOpen(true);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors"
                                                        >
                                                            <div className="p-1.5 bg-red-50 text-red-600 rounded-md"><FiTrash2 className="w-4 h-4" /></div>
                                                            Delete Logo
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex-1 text-white pb-2 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100">
                                        <FiTag className="mr-1.5 w-3 h-3" /> 
                                        {brand.primaryCategory?.name || "Uncategorized"}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-100">
                                        <FiStar className="mr-1.5 w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
                                        <span className="font-bold mr-1 text-white">{brand.ratingAverage || 0}</span>
                                        <span className="text-white/60">({brand.ratingCount || 0} reviews)</span>
                                    </span>
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">{brand.name}</h1>
                                
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-indigo-100/90">
                                    {brand.website && (
                                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors group bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/5 hover:border-white/20">
                                            <FiGlobe className="mr-2 w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" /> Website
                                            <FiExternalLink className="ml-1.5 w-3 h-3 opacity-50" />
                                        </a>
                                    )}
                                    {brand.email && (
                                        <a href={`mailto:${brand.email}`} className="flex items-center hover:text-white transition-colors group bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/5 hover:border-white/20">
                                            <FiMail className="mr-2 w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" /> Email
                                        </a>
                                    )}
                                    {brand.phone && (
                                        <a href={`tel:${brand.phone}`} className="flex items-center hover:text-white transition-colors group bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/5 hover:border-white/20">
                                            <FiPhone className="mr-2 w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" /> Phone
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Main Content - Product Grid */}
                    <div className="lg:col-span-3">
                        {/* Header & Controls */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                                        {selectedSubCategory === 'all' 
                                            ? 'All Products' 
                                            : products.find(p => p.subCategory?._id === selectedSubCategory)?.subCategory?.name || 'Products'}
                                    </h2>
                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {displayedProducts.length}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    {/* Search */}
                                    <div className="relative grow sm:grow-0 sm:w-64">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm"
                                        />
                                    </div>
                                    
                                    {/* Sort */}
                                    <div className="relative sm:w-48">
                                        <button
                                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm group"
                                        >
                                            <span className="text-gray-600 truncate mr-2">
                                                Sort: <span className="text-gray-900 font-medium">{
                                                    sortBy === 'newest' ? 'Newest' :
                                                    sortBy === 'price-asc' ? 'Price: Low to High' :
                                                    sortBy === 'price-desc' ? 'Price: High to Low' :
                                                    'Name'
                                                }</span>
                                            </span>
                                            <FiChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 shrink-0 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {isSortDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-2 w-full min-w-[180px] bg-white border border-gray-100 rounded-lg shadow-lg shadow-gray-200/50 z-20 overflow-hidden py-1"
                                                >
                                                    {[
                                                        { label: 'Newest', value: 'newest' },
                                                        { label: 'Price: Low to High', value: 'price-asc' },
                                                        { label: 'Price: High to Low', value: 'price-desc' },
                                                        { label: 'Name', value: 'name-asc' }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setSortBy(option.value);
                                                                setIsSortDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                                                                sortBy === option.value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            {option.label}
                                                            {sortBy === option.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 ml-2"></div>}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {paginatedProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedProducts.map((product) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full"
                                        >
                                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 relative h-56">
                                                <img
                                                    src={product.coverImage?.secure_url || DEFAULT_PRODUCT_IMAGE}
                                                    alt={product.name}
                                                    onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                                                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                    <Link 
                                                        to={`/seller/products/${product._id}`}
                                                        className="w-full py-2 bg-white text-gray-900 font-bold rounded-lg text-center hover:bg-indigo-50 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
                                                        {product.subCategory?.name}
                                                    </p>
                                                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                                        <Link to={`/seller/products/${product._id}`}>
                                                            {product.name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                                    <p className="text-xl font-extrabold text-gray-900">
                                                        ${product.price?.amount || 0}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-500 font-medium">
                                                        <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                                                        4.5
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-12 gap-2">
                                        <button
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FiChevronLeft className="w-5 h-5 text-gray-600" />
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <FiChevronRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                                <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <FiBox className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    We couldn't find any products in this category. Try selecting a different category or check back later.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Brand Info & Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Contact & Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Information</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                        <FiMail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Business Email</p>
                                        <a href={`mailto:${brand.businessEmail || brand.email}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors break-all">
                                            {brand.businessEmail || brand.email || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                        <FiPhone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</p>
                                        <a href={`tel:${brand.businessPhone || brand.phone}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                            {brand.businessPhone || brand.phone || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                        <FiCalendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Joined Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(brand.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            showSuccess('Link copied to clipboard!');
                                        }}
                                        className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <FiShare2 className="w-4 h-4" /> Share Brand
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Categories Filter - Accordion Style */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                                    <FiFilter className="mr-2" /> Categories
                                </h3>
                            </div>
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => setSelectedSubCategory('all')}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                                        selectedSubCategory === 'all' 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span>All Products</span>
                                    <span className={`text-xs py-0.5 px-2 rounded-full ${
                                        selectedSubCategory === 'all'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                    }`}>
                                        {allProductsCount}
                                    </span>
                                </button>
                                
                                {categoriesTree.length > 0 ? (
                                    categoriesTree.map((cat) => (
                                        <div key={cat._id} className="rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleCategory(cat._id)}
                                                className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors"
                                            >
                                                <span className="flex items-center">
                                                    {cat.name}
                                                </span>
                                                <FiChevronDown 
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                        expandedCategories[cat._id] ? 'rotate-180' : ''
                                                    }`} 
                                                />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {expandedCategories[cat._id] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-gray-50/50"
                                                    >
                                                        {cat.subCategories.map((sub) => (
                                                            <button
                                                                key={sub._id}
                                                                onClick={() => {
                                                                    setSelectedSubCategory(sub._id);
                                                                    setCurrentPage(1); // Reset pagination
                                                                }}
                                                                className={`w-full text-left pl-8 pr-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                                                                    selectedSubCategory === sub._id 
                                                                        ? 'text-indigo-600 font-semibold bg-indigo-50' 
                                                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                                    selectedSubCategory === sub._id ? 'bg-indigo-600' : 'bg-gray-300'
                                                                }`} />
                                                                {sub.name}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-center text-gray-400 text-xs">
                                        No categories found
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">About Brand</h3>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {brand.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <LogoEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpload={handleUploadLogo}
                brand={brand}
                isUploading={uploadLogoMutation.isPending}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Brand Logo"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete the brand logo? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleteLogoMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteLogo}
                            loading={deleteLogoMutation.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isShowModalOpen}
                onClose={() => setIsShowModalOpen(false)}
                title="Brand Logo"
                size="md"
            >
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    {brand.logo?.secure_url ? (
                        <img
                            src={brand.logo.secure_url}
                            alt={brand.name}
                            className="max-w-full max-h-[60vh] rounded-lg shadow-sm object-contain"
                        />
                    ) : (
                        <div className="text-gray-400 py-12">No logo available</div>
                    )}
                </div>
                <div className="flex justify-end mt-6">
                    <Button variant="secondary" onClick={() => setIsShowModalOpen(false)}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default BrandDetailsPage;