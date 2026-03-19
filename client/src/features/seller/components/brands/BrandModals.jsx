import { Modal, Button } from '../../../../shared/ui/index.js';
import LogoEditModal from './LogoEditModal.jsx';
import CoverImageEditModal from './CoverImageEditModal.jsx';
import ProductFormModal from '../products/ProductFormModal.jsx';

const BrandModals = ({
    brand,
    // Product edit modal
    isEditProductModalOpen, setIsEditProductModalOpen,
    editingProduct, setEditingProduct,
    handleUpdateProduct, isUpdating,
    // Logo edit modal
    isEditModalOpen, setIsEditModalOpen,
    handleLogoUpload, uploadLogoMutation,
    // Cover edit modal
    isCoverEditModalOpen, setIsCoverEditModalOpen,
    handleCoverUpload, uploadCoverMutation,
    // Delete logo modal
    isDeleteModalOpen, setIsDeleteModalOpen,
    handleDeleteLogo, deleteLogoMutation,
    // Show logo modal
    isShowModalOpen, setIsShowModalOpen,
}) => (
    <>
        <ProductFormModal
            isOpen={isEditProductModalOpen}
            onClose={() => { setIsEditProductModalOpen(false); setEditingProduct(null); }}
            onSubmit={handleUpdateProduct}
            product={editingProduct}
            isLoading={isUpdating}
        />
        <LogoEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpload={handleLogoUpload}
            brand={brand}
            isUploading={uploadLogoMutation.isPending}
        />
        <CoverImageEditModal
            isOpen={isCoverEditModalOpen}
            onClose={() => setIsCoverEditModalOpen(false)}
            onUpload={handleCoverUpload}
            brand={brand}
            isUploading={uploadCoverMutation.isPending}
        />
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Brand Logo" size="sm">
            <div className="space-y-4">
                <p className="text-gray-600">Are you sure you want to delete the brand logo? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteLogoMutation.isPending}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteLogo} loading={deleteLogoMutation.isPending}>Delete</Button>
                </div>
            </div>
        </Modal>
        <Modal isOpen={isShowModalOpen} onClose={() => setIsShowModalOpen(false)} title="Brand Logo" size="md">
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                {brand.logo?.secure_url ? (
                    <img src={brand.logo.secure_url} alt={brand.name} className="max-w-full max-h-[60vh] rounded-lg shadow-sm object-contain" />
                ) : (
                    <div className="text-gray-400 py-12">No logo available</div>
                )}
            </div>
            <div className="flex justify-end mt-6">
                <Button variant="secondary" onClick={() => setIsShowModalOpen(false)}>Close</Button>
            </div>
        </Modal>
    </>
);

export default BrandModals;
