import { useState } from 'react';
import useCategories from '../../../category/hooks/useCategories.js';
import useSellerBrands from './useSellerBrands.js';

const useBrandsManagementPage = () => {
    const { 
        brands, 
        isLoading: loading, 
        isSubmitting, 
        isUploading, 
        createBrand, 
        updateBrand, 
        deleteBrand, 
        uploadLogo 
    } = useSellerBrands();
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentlySelectedBrand, setCurrentlySelectedBrand] = useState(null);
    const { categories } = useCategories();
    
    const handleSelectBrand = (brand) => {
        if (currentlySelectedBrand?._id === brand._id) {
            setCurrentlySelectedBrand(null);
            setIsSidebarOpen(false);
        } else {
            setCurrentlySelectedBrand(brand);
            setIsSidebarOpen(true);
        }
    };
    
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setCurrentlySelectedBrand(null);
    };
    
    const handleCreateBrand = () => {
        setSelectedBrand(null);
        setIsFormModalOpen(true);
    };
    
    const handleEditBrand = (brand) => {
        setSelectedBrand(brand);
        setIsFormModalOpen(true);
    };
    
    const handleDeleteBrand = async (brandId) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) return;
        await deleteBrand(brandId);
    };
    
    const handleSubmitBrand = async (formData, brandId) => {
        let success;
        if (brandId) {
            success = await updateBrand(brandId, formData);
        } else {
            success = await createBrand(formData);
        }
        
        if (success) {
            setIsFormModalOpen(false);
        }
    };
    
    const handleLogoEdit = (brand) => {
        setSelectedBrand(brand);
        setIsLogoModalOpen(true);
    };
    
    const handleUploadLogo = async (file, brandId) => {
        const success = await uploadLogo(brandId, file);
        if (success) {
            setIsLogoModalOpen(false);
        }
    };

    return {
        brands,
        loading,
        isSubmitting,
        isUploading,
        categories,
        isFormModalOpen,
        setIsFormModalOpen,
        isLogoModalOpen,
        setIsLogoModalOpen,
        selectedBrand,
        isSidebarOpen,
        currentlySelectedBrand,
        handleSelectBrand,
        handleCloseSidebar,
        handleCreateBrand,
        handleEditBrand,
        handleDeleteBrand,
        handleSubmitBrand,
        handleLogoEdit,
        handleUploadLogo
    };
};

export default useBrandsManagementPage;
