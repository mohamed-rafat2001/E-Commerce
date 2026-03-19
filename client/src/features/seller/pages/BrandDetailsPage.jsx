import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiEye, FiArrowLeft } from 'react-icons/fi';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import useBrandDetailsPage from '../hooks/brands/useBrandDetailsPage.js';
import BrandHeroSection from '../components/brands/BrandHeroSection.jsx';
import BrandProductsGrid from '../components/brands/BrandProductsGrid.jsx';
import BrandInfoSidebar from '../components/brands/BrandInfoSidebar.jsx';
import BrandCategoryFilter from '../components/brands/BrandCategoryFilter.jsx';
import BrandModals from '../components/brands/BrandModals.jsx';
import useToast from '../../../shared/hooks/useToast.js';

const BrandDetailsPage = () => {
    const { showSuccess } = useToast();
    const page = useBrandDetailsPage();

    if (page.isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <LoadingSpinner size="lg" color="indigo" />
                    <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-30 animate-pulse" />
                </div>
                <p className="mt-6 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">Loading Brand Details...</p>
            </motion.div>
        );
    }

    if (page.error || !page.brand) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                    <FiEye className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Brand Not Found</h3>
                <p className="text-gray-500 font-medium max-w-sm mb-6">
                    {page.error?.message || "The brand you are looking for doesn't exist or you don't have access to it."}
                </p>
                <Link to="/seller/brands" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-bold rounded-xl transition-all shadow-sm">
                    <FiArrowLeft className="w-4 h-4" /> Back to Brands
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <BrandHeroSection
                brand={page.brand}
                getBrandInitialLogo={page.getBrandInitialLogo}
                isDropdownOpen={page.isDropdownOpen}
                setIsDropdownOpen={page.setIsDropdownOpen}
                setIsCoverEditModalOpen={page.setIsCoverEditModalOpen}
                setIsEditModalOpen={page.setIsEditModalOpen}
                setIsShowModalOpen={page.setIsShowModalOpen}
                setIsDeleteModalOpen={page.setIsDeleteModalOpen}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <BrandProductsGrid
                        paginatedProducts={page.paginatedProducts}
                        displayedProducts={page.displayedProducts}
                        selectedSubCategory={page.selectedSubCategory}
                        products={page.displayedProducts}
                        searchQuery={page.searchQuery}
                        setSearchQuery={page.setSearchQuery}
                        sortBy={page.sortBy}
                        setSortBy={page.setSortBy}
                        isSortDropdownOpen={page.isSortDropdownOpen}
                        setIsSortDropdownOpen={page.setIsSortDropdownOpen}
                        totalPages={page.totalPages}
                        currentPage={page.currentPage}
                        handlePageChange={page.handlePageChange}
                        handleUpdateStock={page.handleUpdateStock}
                        handleEditProduct={page.handleEditProduct}
                        deleteProduct={page.deleteProduct}
                        isUpdating={page.isUpdating}
                        isDeleting={page.isDeleting}
                    />

                    <div className="lg:col-span-1 space-y-6">
                        <BrandInfoSidebar
                            brand={page.brand}
                            onShareLink={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showSuccess('Link copied to clipboard!');
                            }}
                        />
                        <BrandCategoryFilter
                            categoriesTree={page.categoriesTree}
                            allProductsCount={page.allProductsCount}
                            selectedSubCategory={page.selectedSubCategory}
                            setSelectedSubCategory={page.setSelectedSubCategory}
                            expandedCategories={page.expandedCategories}
                            toggleCategory={page.toggleCategory}
                            onSubCategorySelect={(subId) => {
                                page.setSelectedSubCategory(subId);
                            }}
                        />
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">About Brand</h3>
                            </div>
                            <div className="p-5">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {page.brand.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BrandModals
                brand={page.brand}
                isEditProductModalOpen={page.isEditProductModalOpen}
                setIsEditProductModalOpen={page.setIsEditProductModalOpen}
                editingProduct={page.editingProduct}
                setEditingProduct={page.setEditingProduct}
                handleUpdateProduct={page.handleUpdateProduct}
                isUpdating={page.isUpdating}
                isEditModalOpen={page.isEditModalOpen}
                setIsEditModalOpen={page.setIsEditModalOpen}
                handleLogoUpload={page.handleLogoUpload}
                uploadLogoMutation={page.uploadLogoMutation}
                isCoverEditModalOpen={page.isCoverEditModalOpen}
                setIsCoverEditModalOpen={page.setIsCoverEditModalOpen}
                handleCoverUpload={page.handleCoverUpload}
                uploadCoverMutation={page.uploadCoverMutation}
                isDeleteModalOpen={page.isDeleteModalOpen}
                setIsDeleteModalOpen={page.setIsDeleteModalOpen}
                handleDeleteLogo={page.handleDeleteLogo}
                deleteLogoMutation={page.deleteLogoMutation}
                isShowModalOpen={page.isShowModalOpen}
                setIsShowModalOpen={page.setIsShowModalOpen}
            />
        </div>
    );
};

export default BrandDetailsPage;
