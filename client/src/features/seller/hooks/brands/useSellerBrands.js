import { useState, useEffect, useCallback } from 'react';
import mainApi from '../../../../api/mainApi.js';
import useToast from '../../../../shared/hooks/useToast.js';

const useSellerBrands = () => {
	const [brands, setBrands] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState(null);
	const { showSuccess, showError } = useToast();

	const fetchBrands = useCallback(async () => {
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
	}, []);

	useEffect(() => {
		fetchBrands();
	}, [fetchBrands]);

	const createBrand = async (formData) => {
		setIsSubmitting(true);
		try {
			await mainApi.post('/brands', formData);
			await fetchBrands();
			showSuccess('Brand created successfully!');
			return true;
		} catch (err) {
			console.error('Error creating brand:', err);
			showError(err.response?.data?.message || 'Failed to create brand');
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateBrand = async (brandId, formData) => {
		setIsSubmitting(true);
		try {
			await mainApi.patch(`/brands/${brandId}`, formData);
			await fetchBrands();
			showSuccess('Brand updated successfully!');
			return true;
		} catch (err) {
			console.error('Error updating brand:', err);
			showError(err.response?.data?.message || 'Failed to update brand');
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	const deleteBrand = async (brandId) => {
		try {
			await mainApi.delete(`/brands/${brandId}`);
			await fetchBrands();
			showSuccess('Brand deleted successfully!');
			return true;
		} catch (err) {
			console.error('Error deleting brand:', err);
			showError(err.response?.data?.message || 'Failed to delete brand');
			return false;
		}
	};

	const uploadLogo = async (brandId, file) => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append('logo', file);
		
		try {
			await mainApi.patch(`/brands/${brandId}/logo`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetchBrands();
			showSuccess('Logo updated successfully!');
			return true;
		} catch (err) {
			console.error('Error updating logo:', err);
			showError(err.response?.data?.message || 'Failed to update logo');
			return false;
		} finally {
			setIsUploading(false);
		}
	};

	return {
		brands,
		isLoading,
		isSubmitting,
		isUploading,
		error,
		refetch: fetchBrands,
		createBrand,
		updateBrand,
		deleteBrand,
		uploadLogo
	};
};

export default useSellerBrands;