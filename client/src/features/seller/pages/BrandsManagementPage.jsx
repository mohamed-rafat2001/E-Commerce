import { useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Button, Pagination, Skeleton, Modal, EmptyState } from '../../../shared/ui/index.js';
import { FiPlus, FiTag } from 'react-icons/fi';
import { useBrandsManagementPage } from '../hooks/index.js';
import BrandDetailsSidebar from '../components/brands/BrandDetailsSidebar.jsx';
import BrandFormModal from '../components/brands/BrandFormModal.jsx';
import LogoEditModal from '../components/brands/LogoEditModal.jsx';
import BrandsList from '../components/brands/BrandsList.jsx';

const BrandsManagementPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const isFiltering = searchParams.get("search");

	const {
		brands,
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
		handleSubmitBrand,
		handleLogoEdit,
		handleUploadLogo
	} = useBrandsManagementPage();

	if (loading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<Skeleton variant="card" count={6} />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Brand Portfolio"
				subtitle="Customize your profile by managing the brands you represent and sell."
				actions={
					<Button
						onClick={handleCreateBrand}
						icon={<FiPlus className="w-5 h-5" />}
						className="shadow-xl"
					>
						Register New Brand
					</Button>
				}
			/>

			{brands.length > 0 ? (
				<div className="relative">
					<BrandsList
						brands={brands}
						onEdit={handleEditBrand}
						onDelete={handleDeleteBrand}
						onLogoEdit={handleLogoEdit}
						onSelect={handleSelectBrand}
						selectedBrandId={currentlySelectedBrand?._id}
					/>
					<div className="mt-8">
						<Pagination totalPages={totalPages} />
					</div>
				</div>
			) : (
				<Card padding="lg">
					<EmptyState
						icon={<FiTag className="w-12 h-12" />}
						title={isFiltering ? "No matches found" : "No brands registered"}
						message={isFiltering ? "Try a different search term or clear filters." : "Start by registering your first brand to showcase your products."}
						action={!isFiltering ? {
							label: "Add Brand",
							onClick: handleCreateBrand
						} : {
							label: "Clear Search",
							onClick: () => setSearchParams({})
						}}
					/>
				</Card>
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
				title="Confirm Deletion"
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
							Delete Permanently
						</Button>
					</div>
				}
			>
				<div className="text-center py-4">
					<p className="text-gray-600 font-medium">
						Are you sure you want to delete <span className="text-gray-900 font-bold">"{selectedBrand?.name}"</span>?
						This action will remove all associated brand data and cannot be undone.
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
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
					onClick={handleCloseSidebar}
				/>
			)}
		</div>
	);
};

export default BrandsManagementPage;
