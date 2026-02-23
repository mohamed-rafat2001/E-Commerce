import { useState, useMemo } from 'react';
import useSellerProducts from './useSellerProducts.js';
import useAddProduct from './useAddProduct.js';
import useUpdateProduct from './useUpdateProduct.js';
import useDeleteProduct from './useDeleteProduct.js';

const statusOptions = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

const useSellerProductsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [deletingId, setDeletingId] = useState(null);

	const { products, isLoading, error, refetch } = useSellerProducts();
	const { addProduct, isAdding } = useAddProduct();
	const { updateProduct, isUpdating } = useUpdateProduct();
	const { deleteProduct, isDeleting } = useDeleteProduct();

	const filteredProducts = useMemo(() => {
		if (!products) return [];
		return products.filter(product => {
			const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [products, searchQuery, statusFilter]);

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
		// State
		isModalOpen,
		setIsModalOpen,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		deletingId,
		editingProduct,
		setEditingProduct,
		
		// Data
		products,
		filteredProducts,
		allProducts: products,
		isLoading,
		error,
		
		// Loading states
		isAdding,
		isCreating: isAdding,
		isUpdating,
		isDeleting,
		
		// Options
		statusOptions,
		
		// Handlers
		handleAddProduct,
		handleCreateProduct: handleAddProduct,
		handleUpdateProduct,
		handleDeleteProduct,
		handleEdit,
		handleCloseModal,
		handleCreate,
		handleSubmit,
	};
};

export default useSellerProductsPage;