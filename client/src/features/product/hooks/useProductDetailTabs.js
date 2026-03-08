import { useState } from 'react';

/**
 * Hook to manage product detail tabs
 */
export const useProductDetailTabs = (initialTab = 'details') => {
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        { id: 'details', label: 'Details' },
        { id: 'description', label: 'Description' },
        { id: 'variants', label: 'Variants' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return {
        activeTab,
        setActiveTab,
        tabs
    };
};

export default useProductDetailTabs;
