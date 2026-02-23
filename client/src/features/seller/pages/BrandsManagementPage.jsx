import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner, Pagination, Modal, Button, DataHeader } from '../../../shared/ui/index.js';
import { FiPlus } from 'react-icons/fi';
import { useBrandsManagementPage } from '../hooks/index.js';
import BrandDetailsSidebar from '../components/brands/BrandDetailsSidebar.jsx';
import BrandFormModal from '../components/brands/BrandFormModal.jsx';
import LogoEditModal from '../components/brands/LogoEditModal.jsx';
import BrandEmptyState from '../components/brands/BrandEmptyState.jsx';
import BrandsList from '../components/brands/BrandsList.jsx';

const BrandsManagementPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const isFiltering = searchParams.get("search");

	const { 
		brands, 
		totalPages,
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
		confirmDeleteBrand,
		isDeleteModalOpen,
		setIsDeleteModalOpen,
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
			<DataHeader 
				title="Brand Management 🏷️"
				description="Manage your brand portfolio and settings."
				searchPlaceholder="Search brands..."
				sortOptions={[
					{ label: 'Newest First', value: '-createdAt' },
					{ label: 'Oldest First', value: 'createdAt' },
					{ label: 'Name (A-Z)', value: 'name' },
					{ label: 'Name (Z-A)', value: '-name' }
				]}
				actions={
					<Button 
						onClick={handleCreateBrand}
						icon={<FiPlus className="w-4 h-4" />}
					>
						Add New Brand
					</Button>
				}
			/>
			
			{brands.length > 0 ? (
				<>
					<BrandsList 
						brands={brands}
						onEdit={handleEditBrand}
						onDelete={handleDeleteBrand}
						onLogoEdit={handleLogoEdit}
						onSelect={handleSelectBrand}
						selectedBrandId={currentlySelectedBrand?._id}
					/>
					<Pagination totalPages={totalPages} />
				</>
			) : isFiltering ? (
				<div className="text-center py-20 bg-white rounded-lg border border-gray-200">
					<p className="text-gray-500 mb-4">No brands found matching your criteria.</p>
					<Button variant="ghost" onClick={() => setSearchParams({})}>Clear Filters</Button>
				</div>
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
			
			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete Brand"
				size="sm"
				footer={
					<div className="flex justify-end gap-3 w-full">
						<Button 
							variant="ghost" 
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Cancel
						</Button>
						<Button 
							variant="danger" 
							onClick={confirmDeleteBrand}
						>
							Delete
						</Button>
					</div>
				}
			>
				<div className="text-center">
					<div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
						<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<p className="text-gray-600">
						Are you sure you want to delete this brand? This action cannot be undone.
					</p>
				</div>
			</Modal>

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
