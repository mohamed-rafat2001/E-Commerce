import { LoadingSpinner } from '../../../shared/ui/index.js';
import { useBrandsManagementPage } from '../hooks/index.js';
import BrandDetailsSidebar from '../components/brands/BrandDetailsSidebar.jsx';
import BrandFormModal from '../components/brands/BrandFormModal.jsx';
import LogoEditModal from '../components/brands/LogoEditModal.jsx';
import BrandPageHeader from '../components/brands/BrandPageHeader.jsx';
import BrandEmptyState from '../components/brands/BrandEmptyState.jsx';
import BrandsList from '../components/brands/BrandsList.jsx';

const BrandsManagementPage = () => {
	const { 
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
	} = useBrandsManagementPage();
	
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
