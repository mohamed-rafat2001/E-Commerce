import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../../../shared/ui';

// Hooks
import {
    useProductDetail,
    useProductDetailTabs,
    useDeleteProductFlow
} from '../hooks';

// Components
import ProductPageHeader from '../components/detail/ProductPageHeader';
import ProductImageSlider from '../components/detail/ProductImageSlider';
import ProductInfoCard from '../components/detail/ProductInfoCard';
import ProductDetailTabs from '../components/detail/ProductDetailTabs';
import ProductDetailsTab from '../components/detail/ProductDetailsTab';
import ProductDescriptionTab from '../components/detail/ProductDescriptionTab';
import ProductVariantsTab from '../components/detail/ProductVariantsTab';
import ProductReviewsTab from '../components/detail/ProductReviewsTab';
import DeleteProductModal from '../components/detail/DeleteProductModal';

const ManagementProductDetailPage = ({ viewerRole = 'seller' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, isLoading, error } = useProductDetail(id);
    const { activeTab, setActiveTab, tabs } = useProductDetailTabs('details');

    const basePath = viewerRole === 'admin' ? '/admin/products' : '/seller/inventory';
    const {
        isModalOpen,
        openModal,
        closeModal,
        handleDelete,
        isDeleting
    } = useDeleteProductFlow(id, basePath);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <LoadingSpinner size="xl" color="indigo" />
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">
                    Synchronizing Product Data
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6 font-black text-3xl">!</div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Record Not Found</h2>
                <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">The product ID requested does not match any active records in our database.</p>
                <button
                    onClick={() => navigate(basePath)}
                    className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                    Back to Collection
                </button>
            </div>
        );
    }

    const handleEdit = () => {
        navigate(basePath, { state: { editProduct: product } });
    };

    const handleViewPublic = () => {
        window.open(`/products/${product._id}`, '_blank');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return <ProductDetailsTab product={product} viewerRole={viewerRole} />;
            case 'description':
                return <ProductDescriptionTab description={product.description} />;
            case 'variants':
                return <ProductVariantsTab colors={product.colors} sizes={product.sizes} />;
            case 'reviews':
                return (
                    <ProductReviewsTab
                        productId={product._id}
                        ratingsAverage={product.ratingsAverage}
                        ratingsQuantity={product.ratingsQuantity}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-24"
        >
            <ProductPageHeader
                product={product}
                basePath={basePath}
                onEdit={handleEdit}
                viewerRole={viewerRole}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-20 items-stretch">
                {/* Left: Product Visual Canvas */}
                <div className="lg:col-span-12 xl:col-span-7">
                    <ProductImageSlider images={[product.coverImage, ...(product.images || [])]} />
                </div>

                {/* Right: Commercial Data Synthesis */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <ProductInfoCard
                        product={product}
                        onEdit={handleEdit}
                        onViewPublic={handleViewPublic}
                        onDelete={openModal}
                        viewerRole={viewerRole}
                    />
                </div>
            </div>

            {/* In-depth Contextual Panels */}
            <div className="space-y-10">
                <ProductDetailTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={tabs}
                />
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {renderTabContent()}
                </motion.div>
            </div>

            <DeleteProductModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                productName={product.name}
            />
        </motion.div>
    );
};

export default ManagementProductDetailPage;
