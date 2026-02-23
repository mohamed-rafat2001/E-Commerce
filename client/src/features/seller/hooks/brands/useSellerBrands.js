import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getSellerBrands, 
    addBrand, 
    updateBrand as updateBrandService, 
    deleteBrand as deleteBrandService, 
    updateBrandLogo 
} from '../../services/seller.js';
import useToast from '../../../../shared/hooks/useToast.js';

const useSellerBrands = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();

    // Fetch brands
    const { 
        data: response, 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['seller-brands'],
        queryFn: getSellerBrands,
        // The service already includes ?sort=-createdAt&limit=1000
    });

    const brands = response?.data?.data || [];

    // Create Brand Mutation
    const createBrandMutation = useMutation({
        mutationFn: addBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-brands'] });
            showSuccess('Brand created successfully!');
        },
        onError: (err) => {
            console.error('Error creating brand:', err);
            showError(err.response?.data?.message || 'Failed to create brand');
        }
    });

    // Update Brand Mutation
    const updateBrandMutation = useMutation({
        mutationFn: ({ id, data }) => updateBrandService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-brands'] });
            showSuccess('Brand updated successfully!');
        },
        onError: (err) => {
            console.error('Error updating brand:', err);
            showError(err.response?.data?.message || 'Failed to update brand');
        }
    });

    // Delete Brand Mutation
    const deleteBrandMutation = useMutation({
        mutationFn: deleteBrandService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-brands'] });
            showSuccess('Brand deleted successfully!');
        },
        onError: (err) => {
            console.error('Error deleting brand:', err);
            showError(err.response?.data?.message || 'Failed to delete brand');
        }
    });

    // Upload Logo Mutation
    const uploadLogoMutation = useMutation({
        mutationFn: ({ id, formData }) => updateBrandLogo(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-brands'] });
            showSuccess('Logo updated successfully!');
        },
        onError: (err) => {
            console.error('Error updating logo:', err);
            showError(err.response?.data?.message || 'Failed to update logo');
        }
    });

    // Wrapper functions to maintain existing API and return true/false
    const createBrand = async (formData) => {
        try {
            await createBrandMutation.mutateAsync(formData);
            return true;
        } catch {
            return false;
        }
    };

    const updateBrand = async (brandId, formData) => {
        try {
            await updateBrandMutation.mutateAsync({ id: brandId, data: formData });
            return true;
        } catch {
            return false;
        }
    };

    const deleteBrand = async (brandId) => {
        try {
            await deleteBrandMutation.mutateAsync(brandId);
            return true;
        } catch {
            return false;
        }
    };

    const uploadLogo = async (brandId, file) => {
        const formData = new FormData();
        formData.append('logo', file);
        
        try {
            await uploadLogoMutation.mutateAsync({ id: brandId, formData });
            return true;
        } catch {
            return false;
        }
    };

    return {
        brands,
        isLoading,
        isSubmitting: createBrandMutation.isPending || updateBrandMutation.isPending || deleteBrandMutation.isPending,
        isUploading: uploadLogoMutation.isPending,
        error,
        refetch,
        createBrand,
        updateBrand,
        deleteBrand,
        uploadLogo
    };
};

export default useSellerBrands;
