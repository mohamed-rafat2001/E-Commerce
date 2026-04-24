import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
	getAdminDiscounts,
	createAdminDiscount,
	updateAdminDiscount as updateAdminDiscountService,
	deleteAdminDiscount as deleteAdminDiscountService,
	toggleAdminDiscount as toggleAdminDiscountService,
} from '../services/discountService.js';
import useToast from '../../../shared/hooks/useToast.js';
import usePaginationLimit from '../../../shared/hooks/usePaginationLimit.js';

/**
 * Hook for Admin discount management — full CRUD + toggle.
 * Admins can see and manage ALL discounts (not just their own).
 */
const useAdminDiscounts = () => {
	const queryClient = useQueryClient();
	const { showSuccess, showError } = useToast();
	const [searchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page")) || 1;
	const limit = usePaginationLimit('ADMIN_DISCOUNTS');
	const search = searchParams.get("search") || "";
	const sort = searchParams.get("sort") || "-createdAt";
	const status = searchParams.get("status") || "";
	const scope = searchParams.get("scope") || "";
	const type = searchParams.get("type") || "";

	// Fetch all discounts
	const {
		data: response,
		isLoading,
		isFetching,
		error,
		refetch,
	} = useQuery({
		queryKey: ['admin-discounts', page, limit, search, sort, status, scope, type],
		queryFn: () =>
			getAdminDiscounts({
				page,
				limit,
				search,
				sort,
				...(status && { isActive: status === 'active' }),
				...(scope && { scope }),
				...(type && { type }),
			}),
		placeholderData: keepPreviousData,
	});

	const discounts = response?.data?.data || [];
	const total = response?.data?.total || 0;
	const totalPages = Math.ceil(total / limit);

	// Create
	const createMutation = useMutation({
		mutationFn: createAdminDiscount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
			showSuccess('Discount created successfully!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to create discount');
		},
	});

	// Update
	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => updateAdminDiscountService(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
			showSuccess('Discount updated successfully!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to update discount');
		},
	});

	// Delete
	const deleteMutation = useMutation({
		mutationFn: deleteAdminDiscountService,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
			showSuccess('Discount deleted successfully!');
		},
		onError: (err) => {
			showError(err.response?.data?.message || 'Failed to delete discount');
		},
	});

	// Toggle
	const toggleMutation = useMutation({
		mutationFn: toggleAdminDiscountService,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
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

export default useAdminDiscounts;
