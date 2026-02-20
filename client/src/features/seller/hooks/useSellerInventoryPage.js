import { useState, useMemo } from 'react';
import useSellerProducts from './useSellerProducts.js';
import useUpdateProduct from './useUpdateProduct.js';

const useSellerInventoryPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [stockFilter, setStockFilter] = useState('all');
	const [updatingId, setUpdatingId] = useState(null);

	const { products: allProducts, isLoading, refetch } = useSellerProducts();
	const { updateProduct, isUpdating } = useUpdateProduct();
	const products = allProducts || [];

	const filteredProducts = useMemo(() => {
		return products.filter(p => {
			const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
			let matchesStock = true;
			if (stockFilter === 'out_of_stock') matchesStock = p.countInStock === 0;
			else if (stockFilter === 'low_stock') matchesStock = p.countInStock > 0 && p.countInStock <= 10;
			else if (stockFilter === 'in_stock') matchesStock = p.countInStock > 10;
			return matchesSearch && matchesStock;
		});
	}, [products, searchQuery, stockFilter]);

	const handleUpdateStock = (id, stock) => {
		updateProduct({ id, product: { countInStock: stock } }, { 
			onSuccess: refetch 
		});
	};

	return {
		// State
		searchQuery,
		setSearchQuery,
		stockFilter,
		setStockFilter,
		updatingId,

		// Data
		filteredProducts,
		products,
		allProducts: products,
		isLoading,

		// Handlers
		handleUpdateStock,
		refetch
	};
};

export default useSellerInventoryPage;