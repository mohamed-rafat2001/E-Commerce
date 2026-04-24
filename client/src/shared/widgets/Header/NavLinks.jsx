import { useState } from 'react';
import { MenuIcon } from '../../constants/icons.jsx';

// Data Hooks
import useCategories from '../../../features/home/hooks/useCategories.js';
import useBrands from '../../../features/home/hooks/useBrands.js';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import useWishlist from '../../../features/wishList/hooks/useWishlist.js';
import useCart from '../../../features/cart/hooks/useCart.js';

// Modular Sub-components
import DesktopNav from './nav-modules/DesktopNav.jsx';
import MobileDrawer from './nav-modules/MobileDrawer.jsx';

/**
 * NavLinks - Refactored Navigation Entry Point
 */
const NavLinks = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Core Data Fetching
    const { categories = [] } = useCategories();
    const { originalBrands: brands = [] } = useBrands();
    const { user, isAuthenticated, userRole } = useCurrentUser();
    const { items: wishlistItems = [] } = useWishlist(user?._id) || {};
    const { cartItems = [], cartItemCount = 0 } = useCart();

    // Mapping static configurations
    const navConfig = {
        static: [
            { name: 'Products', path: '/products' },
            { name: 'Help', path: '/help', isHelp: true }
        ],
        help: [
            { name: 'FAQs', path: '/faq', description: 'Frequently Asked Questions' },
            { name: 'Support', path: '/support', description: 'Contact our support team' },
            { name: 'Policies', path: '/policy', description: 'Shipping and Return policies' }
        ],
        mobile: [
            { name: 'Brands', path: '/brands/all' },
            { name: 'Categories', path: '/categories/all' },
            { name: 'Products', path: '/products' }
        ]
    };

    return (
        <nav className="flex items-center">
            {/* Optimized Desktop Navigation */}
            <DesktopNav 
                brands={brands}
                categories={categories}
                staticLinks={navConfig.static}
                helpLinks={navConfig.help}
            />

            {/* Premium Mobile Menu Toggle */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                aria-label="Toggle mobile menu"
            >
                <MenuIcon className="w-5 h-5" />
            </button>

            {/* Full-Height Mobile Navigation Drawer */}
            <MobileDrawer 
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                wishlistCount={(wishlistItems || []).length}
                cartItemCount={cartItemCount}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                drawerLinks={navConfig.mobile}
            />
        </nav>
    );
};

export default NavLinks;
