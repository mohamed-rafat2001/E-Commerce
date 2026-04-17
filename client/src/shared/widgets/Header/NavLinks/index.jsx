import { useState, useMemo } from 'react';
import { MenuIcon } from '../../../constants/icons.jsx';
import DesktopNav from './DesktopNav.jsx';
import MobileDrawer from './MobileDrawer.jsx';

import useCategories from '../../../features/home/hooks/useCategories.js';
import useBrands from '../../../features/home/hooks/useBrands.js';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import useWishlist from '../../../features/wishList/hooks/useWishlist.js';
import useCart from '../../../features/cart/hooks/useCart.js';

/**
 * NavLinks - Modular Navigation Entry Point
 */
const NavLinks = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Hooks & Data
    const { categories = [] } = useCategories();
    const { brands = [] } = useBrands();
    const { user, isAuthenticated, userRole } = useCurrentUser();
    const { items: wishlistItems = [] } = useWishlist(user?._id);
    const { cart = [] } = useCart();

    const wishlistCount = wishlistItems.length;
    const cartItemCount = cart.length;

    // Navigation Config
    const staticLinks = [
        { name: 'Products', path: '/products' },
        { name: 'Help', path: '/help', isHelp: true }
    ];

    const helpLinks = [
        { name: 'FAQs', path: '/faq', description: 'Frequently Asked Questions' },
        { name: 'Support', path: '/support', description: 'Contact our support team' },
        { name: 'Policies', path: '/policy', description: 'Shipping and Return policies' }
    ];

    const drawerLinks = [
        { name: 'Brands', path: '/brands/all' },
        { name: 'Categories', path: '/categories/all' },
        { name: 'Products', path: '/products' }
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <DesktopNav 
                brands={brands}
                categories={categories}
                staticLinks={staticLinks}
                helpLinks={helpLinks}
            />

            {/* Mobile Menu Trigger */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                aria-label="Open Menu"
            >
                <MenuIcon className="w-6 h-6" />
            </button>

            {/* Mobile Navigation Drawer */}
            <MobileDrawer 
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                wishlistCount={wishlistCount}
                cartItemCount={cartItemCount}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                drawerLinks={drawerLinks}
            />
        </>
    );
};

export default NavLinks;
