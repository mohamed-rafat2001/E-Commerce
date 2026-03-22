import React, { useEffect } from 'react';
import { Header } from '../../../shared/widgets/Header/index.js';
import { FooterSection } from '../../home/components/index.js';
import { WishlistPage } from '../../customer/pages/index.js';

const PublicWishlistPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 w-full">
                <WishlistPage />
            </main>
        </div>
    );
};

export default PublicWishlistPage;
