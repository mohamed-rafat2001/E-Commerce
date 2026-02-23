import { useState } from 'react';
import useSellerProducts from './useSellerProducts.js';
import useAddProduct from '../../../product/hooks/useAddProduct.js';
import useUpdateProduct from '../../../product/hooks/useUpdateProduct.js';
import useDeleteProduct from '../../../product/hooks/useDeleteProduct.js';

const useSellerProductsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [deletingId, setDeletingId] = useState(null);

	const { products, total, totalPages, isLoading, refetch } = useSellerProducts();

	// Configure hooks to invalidate seller-products
	const { addProduct, isAdding } = useAddProduct({
		invalidateKeys: ['seller-products']
	});
	const { updateProduct, isUpdating } = useUpdateProduct({
		invalidateKeys: ['seller-products']
	});
	const { deleteProduct, isDeleting } = useDeleteProduct({
		invalidateKeys: ['seller-products']
	});

	const handleAddProduct = (data) => {
		addProduct(data, {
			onSuccess: () => {
				setIsModalOpen(false);
				refetch();
			}
		});
	};

	const handleUpdateProduct = (data) => {
		updateProduct({ id: editingProduct._id, product: data }, {
			onSuccess: () => {
				setEditingProduct(null);
				setIsModalOpen(false);
				refetch();
			}
		});
	};

	const handleDeleteProduct = (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			setDeletingId(id);
			deleteProduct(id, {
				onSuccess: () => {
					setDeletingId(null);
					refetch();
				},
				onError: () => {
					setDeletingId(null);
				}
			});
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingProduct(null);
	};

	const handleCreate = () => {
		setEditingProduct(null);
		setIsModalOpen(true);
	};

	const handleSubmit = (data) => {
		if (editingProduct) {
			handleUpdateProduct(data);
		} else {
			handleAddProduct(data);
		}
	};

	return {
		isModalOpen,
		editingProduct,
		products,
        total,
        totalPages,
		isLoading,
		handleDeleteProduct,
		handleCreate,
		handleEdit,
		handleCloseModal,
		handleSubmit,
		isCreating: isAdding,
		isUpdating,
        isDeleting
	};
};

export default useSellerProductsPage;