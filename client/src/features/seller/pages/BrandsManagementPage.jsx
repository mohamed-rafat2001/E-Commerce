import { useState } from 'react';
import { LoadingSpinner } from '../../../shared/ui/index.js';
import useCategories from '../../category/hooks/useCategories.js';
import useSellerBrands from '../hooks/useSellerBrands.js';
import BrandDetailsSidebar from '../components/brands/BrandDetailsSidebar.jsx';
import BrandFormModal from '../components/brands/BrandFormModal.jsx';
import LogoEditModal from '../components/brands/LogoEditModal.jsx';
import BrandPageHeader from '../components/brands/BrandPageHeader.jsx';
import BrandEmptyState from '../components/brands/BrandEmptyState.jsx';
import BrandsList from '../components/brands/BrandsList.jsx';

const BrandsManagementPage = () => {
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
	
	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<LoadingSpinner />
			</div>
		);
	}
	
	return (
		<div className="space-y-6 pb-10">
			<BrandPageHeader onCreate={handleCreateBrand} />
			
			{brands.length > 0 ? (
				<BrandsList 
					brands={brands}
					onEdit={handleEditBrand}
					onDelete={handleDeleteBrand}
					onLogoEdit={handleLogoEdit}
					onSelect={handleSelectBrand}
					selectedBrandId={currentlySelectedBrand?._id}
				/>
			) : (
				<BrandEmptyState onCreate={handleCreateBrand} />
			)}
			
			{/* Modals */}
			<BrandFormModal
				isOpen={isFormModalOpen}
				onClose={() => setIsFormModalOpen(false)}
				onSubmit={handleSubmitBrand}
				brand={selectedBrand}
				categories={categories}
				isSubmitting={isSubmitting}
			/>
			
			<LogoEditModal
				isOpen={isLogoModalOpen}
				onClose={() => setIsLogoModalOpen(false)}
				onUpload={handleUploadLogo}
				brand={selectedBrand}
				isUploading={isUploading}
			/>
			
			{/* Brand Details Sidebar */}
			<BrandDetailsSidebar
				brand={currentlySelectedBrand}
				isOpen={isSidebarOpen}
				onClose={handleCloseSidebar}
				categories={categories}
			/>
			
			{/* Overlay for sidebar */}
			{isSidebarOpen && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={handleCloseSidebar}
				/>
			)}
		</div>
	);
};

export default BrandsManagementPage;
