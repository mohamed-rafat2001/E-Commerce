import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeleteProductMutation from './useDeleteProduct';

/**
 * Hook to manage the delete product flow with confirmation and redirection
 */
export const useDeleteProductFlow = (productId, redirectPath = '/seller/inventory') => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { deleteProduct, isDeleting } = useDeleteProductMutation();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleDelete = async () => {
        deleteProduct(productId, {
            onSuccess: () => {
                setIsModalOpen(false);
                navigate(redirectPath);
            }
        });
    };

    return {
        isModalOpen,
        openModal,
        closeModal,
        handleDelete,
        isDeleting
    };
};

export default useDeleteProductFlow;
