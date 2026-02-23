import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiMail, FiPhone, FiGlobe, FiCalendar, FiBox, FiTag, FiArrowLeft } from 'react-icons/fi';
import useBrandDetails from '../hooks/brands/useBrandDetails';

const BrandDetailsPage = () => {
    const { 
        brand, 
        products, 
        allProductsCount, 
        subCategories, 
        selectedSubCategory, 
        setSelectedSubCategory, 
        isLoading, 
        error 
    } = useBrandDetails();

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
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Link to="/seller/brands" className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                    <FiArrowLeft className="mr-2" /> Back to Brands
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative bg-white shadow-sm">
                <div className="h-48 bg-linear-to-r from-indigo-500 to-purple-600 w-full object-cover"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                        <div className="relative">
                            <img 
                                src={brand.logo?.secure_url || "https://via.placeholder.com/150"} 
                                alt={brand.name} 
                                className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
                            />
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
                            <p className="text-gray-500 text-sm flex items-center mt-1">
                                <FiTag className="mr-1" /> {brand.primaryCategory?.name || "Category"}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            {brand.website && (
                                <a href={brand.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                                    <FiGlobe />
                                </a>
                            )}
                            {brand.email && (
                                <a href={`mailto:${brand.email}`} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                                    <FiMail />
                                </a>
                            )}
                            {brand.phone && (
                                <a href={`tel:${brand.phone}`} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                                    <FiPhone />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Brand Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-gray-100 pt-6">
                        <div className="col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">About {brand.name}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {brand.description || "No description available for this brand."}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Brand Details</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center text-sm text-gray-700">
                                    <FiBox className="mr-2 text-indigo-500" />
                                    <span className="font-medium mr-2">Products:</span> {allProductsCount}
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <FiCalendar className="mr-2 text-indigo-500" />
                                    <span className="font-medium mr-2">Joined:</span> {new Date(brand.createdAt).toLocaleDateString()}
                                </li>
                                {/* Add more details if available */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content - Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {selectedSubCategory === 'all' 
                                    ? 'All Products' 
                                    : subCategories.find(s => s._id === selectedSubCategory)?.name || 'Products'}
                            </h2>
                            <span className="text-sm text-gray-500">
                                Showing {products.length} results
                            </span>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                                    >
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative group h-48">
                                            <img
                                                src={product.coverImage?.secure_url || "https://via.placeholder.com/300"}
                                                alt={product.name}
                                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                <Link to={`/seller/products/${product._id}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 truncate">{product.subCategory?.name}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-lg font-bold text-indigo-600">
                                                    ${product.price?.amount || 0}
                                                </p>
                                                <div className="flex items-center">
                                                    {/* Rating or other info */}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-400">
                                    <FiBox className="h-12 w-12" />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    This category currently has no products.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Subcategories */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiFilter className="mr-2" /> Categories
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedSubCategory('all')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        selectedSubCategory === 'all' 
                                            ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    All Products
                                    <span className="float-right text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full">
                                        {allProductsCount}
                                    </span>
                                </button>
                                {subCategories?.map((sub) => (
                                    <button
                                        key={sub._id}
                                        onClick={() => setSelectedSubCategory(sub._id)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            selectedSubCategory === sub._id 
                                                ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandDetailsPage;