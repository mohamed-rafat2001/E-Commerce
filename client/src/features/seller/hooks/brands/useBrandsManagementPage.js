import { useState } from 'react';
import useCategories from '../../../admin/hooks/categories/useCategories.js';
import useSellerBrands from './useSellerBrands.js';

const useBrandsManagementPage = () => {
    const { 
        brands, 
        total,
        totalPages,
        isLoading: loading, 
        isFetching,
        isSubmitting, 
        isUploading, 
        createBrand, 
        updateBrand, 
        deleteBrand, 
        uploadLogo 
    } = useSellerBrands();
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);
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
    
    const handleDeleteBrand = (brandId) => {
        setBrandToDelete(brandId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteBrand = async () => {
        if (!brandToDelete) return;
        await deleteBrand(brandToDelete);
        setIsDeleteModalOpen(false);
        setBrandToDelete(null);
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
        total,
        totalPages,
        loading,
        isFetching,
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
        confirmDeleteBrand,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        brandToDelete,
        handleSubmitBrand,
        handleLogoEdit,
        handleUploadLogo
    };
};

export default useBrandsManagementPage;
