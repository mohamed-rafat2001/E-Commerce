import React, { useEffect } from 'react';
import { Header } from '../../../shared/widgets/Header/index.js';
import { FooterSection } from '../../home/components/index.js';
import { CartPage } from '../../customer/pages/index.js';

const PublicCartPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-4">
                <CartPage />
            </main>
            <FooterSection />
        </div>
    );
};

export default PublicCartPage;
