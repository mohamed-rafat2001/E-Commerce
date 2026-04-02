import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getFunc } from '../../../shared/services/handlerFactory';

/**
 * Hook to fetch brands with infinite scroll duplication
 */
const useBrands = () => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['home-brands'],
        queryFn: () => getFunc('brands/public'), // Use public endpoint
        staleTime: 60 * 60 * 1000,
    });

    const mockBrands = useMemo(() => {
        const makeId = (seed) => seed.toString(16).padStart(24, '0').slice(0, 24);
        return Array.from({ length: 24 }, (_, index) => {
            const id = makeId(8000 + index);
            return {
                _id: id,
                id,
                name: [
                    'Aether Studio', 'Noir Atelier', 'Nova Labs', 'Vertex Wear', 'Moonline',
                    'Crafted Co', 'Urban Foundry', 'Lumen House', 'Arc Mode', 'Pulse Originals',
                    'Halo Supply', 'Canvas Works', 'Prime Edit', 'Vanta', 'Eclipse',
                    'Marble & Oak', 'Flux Society', 'North Thread', 'Oakline', 'Sage Avenue',
                    'Alpha Craft', 'Mirage', 'Orchid', 'Loom & Code'
                ][index] || `Brand ${index + 1}`,
                slug: `brand-${index + 1}`,
            };
        });
    }, []);

    const apiBrands = useMemo(() => {
        return response?.data?.data || [];
    }, [response]);

    const rawBrands = useMemo(() => {
        if (!Array.isArray(apiBrands) || apiBrands.length === 0) {
            return mockBrands;
        }
        if (apiBrands.length >= 16) {
            return apiBrands;
        }
        return [...apiBrands, ...mockBrands.slice(0, 16 - apiBrands.length)];
    }, [apiBrands, mockBrands]);

    const duplicatedBrands = useMemo(() => {
        if (!rawBrands.length) return [];
        // Duplicate array to ensure smooth infinite ticker
        return [...rawBrands, ...rawBrands, ...rawBrands];
    }, [rawBrands]);

    return {
        brands: duplicatedBrands,
        originalBrands: rawBrands,
        isLoading,
        error
    };
};

export default useBrands;
