import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBrand } from '../../services/brandService.js';
import { getProductsByBrand } from '../../../product/services/product.js';

const useBrandDetails = () => {
    const { id } = useParams();
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');

    // Fetch Brand Details
    const { 
        data: brandResponse, 
        isLoading: isBrandLoading, 
        error: brandError 
    } = useQuery({
        queryKey: ['brand', id],
        queryFn: () => getBrand(id),
        enabled: !!id
    });

    // Fetch Brand Products
    const { 
        data: productsResponse, 
        isLoading: isProductsLoading, 
        error: productsError 
    } = useQuery({
        queryKey: ['brand-products', id],
        queryFn: () => getProductsByBrand(id),
        enabled: !!id
    });

    const brand = brandResponse?.data?.data || null;
    const allProducts = useMemo(() => productsResponse?.data?.data || [], [productsResponse]);

    // Filter products by subcategory
    const filteredProducts = useMemo(() => {
        if (selectedSubCategory === 'all') return allProducts;
        return allProducts.filter(product => 
            product.subCategory?._id === selectedSubCategory || 
            product.subCategory === selectedSubCategory
        );
    }, [allProducts, selectedSubCategory]);

    // Get unique subcategories from products (or use brand's subcategories)
    // Brand model has subCategories array, so we can use that for the sidebar
    const subCategories = brand?.subCategories || [];

    return {
        brand,
        products: filteredProducts,
        allProductsCount: allProducts.length,
        subCategories,
        selectedSubCategory,
        setSelectedSubCategory,
        isLoading: isBrandLoading || isProductsLoading,
        error: brandError || productsError
    };
};

export default useBrandDetails;