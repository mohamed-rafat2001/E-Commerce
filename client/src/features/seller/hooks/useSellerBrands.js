import { useState, useEffect } from 'react';
import mainApi from '../../../api/mainApi.js';

const useSellerBrands = () => {
	const [brands, setBrands] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchBrands = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await mainApi.get('/brands');
			setBrands(response.data?.data || []);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch brands');
			console.error('Error fetching brands:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBrands();
	}, []);

	return {
		brands,
		isLoading,
		error,
		refetch: fetchBrands
	};
};

export default useSellerBrands;