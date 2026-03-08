import React from 'react';
import CategoryCard from './CategoryCard';
import { useCategories } from '../../hooks';
import { SectionTitle } from '../../../../shared/ui';

const CategoriesSection = () => {
    const { categories, isLoading } = useCategories();

    if (isLoading || !categories.length) return null;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle
                    title="Curated Collections"
                    subtitle="Explore our vast selection of categories, handpicked for your lifestyle."
                    align="left"
                    actionLabel="View All Categories"
                    actionLink="/categories"
                    className="mb-12"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories.slice(0, 8).map((category, idx) => (
                        <CategoryCard key={category._id} category={category} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
