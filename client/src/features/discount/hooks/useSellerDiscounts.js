import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
	getSellerDiscounts,
	createSellerDiscount,
	updateSellerDiscount as updateSellerDiscountService,
	deleteSellerDiscount as deleteSellerDiscountService,
	toggleSellerDiscount as toggleSellerDiscountService,
} from '../services/discountService.js';
import useToast from '../../../shared/hooks/useToast.js';
import usePaginationLimit from '../../../shared/hooks/usePaginationLimit.js';

/**
 * Hook for Seller discount management — full CRUD + toggle.
 */
const useSellerDiscounts = () => {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();
	const [searchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page")) || 1;
	const limit = usePaginationLimit('SELLER_DISCOUNTS');
	const search = searchParams.get("search") || "";
	const sort = searchParams.get("sort") || "-createdAt";
	const status = searchParams.get("status") || "";

	// Fetch seller's discounts
	const {
		data: response,
		isLoading,
		isFetching,
		error,
		refetch,
	} = useQuery({
		queryKey: ['seller-discounts', page, limit, search, sort, status],
		queryFn: () => getSellerDiscounts({ page, limit, search, sort, ...(status && { isActive: status === 'active' }) }),
		placeholderData: keepPreviousData,
	});

	const discounts = response?.data?.data || [];
	const total = response?.data?.total || 0;
	const totalPages = Math.ceil(total / limit);

	// Create
	const createMutation = useMutation({
		mutationFn: createSellerDiscount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-discounts'] });
			showSuccess('Discount created successfully!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to create discount');
		},
	});

	// Update
	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => updateSellerDiscountService(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-discounts'] });
			showSuccess('Discount updated successfully!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to update discount');
		},
	});

	// Delete
	const deleteMutation = useMutation({
		mutationFn: deleteSellerDiscountService,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-discounts'] });
			showSuccess('Discount deleted successfully!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to delete discount');
		},
	});

	// Toggle active/inactive
	const toggleMutation = useMutation({
		mutationFn: toggleSellerDiscountService,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-discounts'] });
			showSuccess('Discount status toggled!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to toggle discount');
		},
	});

	// Convenience wrappers
	const createDiscount = async (data) => {
		try {
			await createMutation.mutateAsync(data);
			return true;
		} catch {
			return false;
		}
	};

	const updateDiscount = async (id, data) => {
		try {
			await updateMutation.mutateAsync({ id, data });
			return true;
		} catch {
			return false;
		}
	};

	const deleteDiscount = async (id) => {
		try {
			await deleteMutation.mutateAsync(id);
			return true;
		} catch {
			return false;
		}
	};

	const toggleDiscount = async (id) => {
		try {
			await toggleMutation.mutateAsync(id);
			return true;
		} catch {
			return false;
		}
	};

	return {
		discounts,
		total,
		totalPages,
		isLoading,
		isFetching,
		isSubmitting:
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending ||
			toggleMutation.isPending,
		error,
		refetch,
		createDiscount,
		updateDiscount,
		deleteDiscount,
		toggleDiscount,
	};
};

export default useSellerDiscounts;
