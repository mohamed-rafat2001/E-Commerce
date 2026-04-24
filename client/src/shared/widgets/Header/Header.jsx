import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useCurrentUser from '../../../features/user/hooks/useCurrentUser.js';
import useLogout from '../../../features/auth/hooks/useLogout.jsx';
import { Modal, Button } from '../../ui/index.js';
import useWishlist from '../../../features/wishList/hooks/useWishlist.js';
import useCart from '../../../features/cart/hooks/useCart.js';
import { getLenis } from '../../../hooks/useLenis.js';
import { LogoutIcon } from '../../constants/icons.jsx';

// Refactored Modules
import NavLinks from './NavLinks.jsx';
import BrandLogo from './header-modules/BrandLogo.jsx';
import QuickActions from './header-modules/QuickActions.jsx';
import UserSection from './header-modules/UserSection.jsx';

// Shared Drawers
import CartDrawer from '../../components/CartDrawer.jsx';
import WishlistDrawer from '../../components/WishlistDrawer.jsx';

/**
 * Header - High-level App Shell Orchestrator
 */
const Header = ({ isPanel = false }) => {
    const { user, isAuthenticated, userRole } = useCurrentUser();
    const { logout } = useLogout();
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Dynamic Data
    const { cartItemCount = 0 } = useCart();
    const { items: wishlistItems = [] } = useWishlist() || {};
    const wishlistCount = (wishlistItems || []).length;

    // Scroll Locking Logic
    useEffect(() => {
        const isAnyDrawerOpen = isCartOpen || isWishlistOpen;
        const lenis = getLenis();

        if (isAnyDrawerOpen) {
            const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = scrollWidth > 0 ? `${scrollWidth}px` : '';
            if (lenis?.stop) lenis.stop();
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            if (lenis?.start) lenis.start();
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            if (lenis?.start) lenis.start();
        };
    }, [isCartOpen, isWishlistOpen]);

    return (
        <motion.header
            className={`${isPanel ? 'fixed top-0 right-0 md:left-72 lg:left-80' : 'fixed top-0 left-0 right-0'} z-50`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className={`
                ${isPanel ? 'bg-white/70 dark:bg-gray-900/70 border-b border-gray-100/70 dark:border-gray-700/70' : 'bg-white/80 dark:bg-gray-900/80 border-b border-gray-100/50 dark:border-gray-800/50'} 
                backdrop-blur-xl shadow-sm transition-colors duration-300
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 xl:px-10">
                    <div className="flex items-center justify-between h-[88px] gap-4">
                        
                        {/* Branding & Main Nav */}
                        {!isPanel && (
                            <div className="flex items-center gap-8 min-w-0">
                                <BrandLogo />
                                <div className="hidden lg:block">
                                    <NavLinks />
                                </div>
                            </div>
                        )}
                        {isPanel && <div className="lg:hidden"><BrandLogo /></div>}

                        {/* Right Section: Actions & Profile */}
                        <div className="flex items-center gap-3 xl:gap-4 ml-auto">
                            <QuickActions 
                                wishlistCount={wishlistCount}
                                cartCount={cartItemCount}
                                onToggleWishlist={() => { setIsWishlistOpen(!isWishlistOpen); setIsCartOpen(false); }}
                                onToggleCart={() => { setIsCartOpen(!isCartOpen); setIsWishlistOpen(false); }}
                                isPanel={isPanel}
                                showWishlistCart={userRole === 'Customer' || !isAuthenticated}
                            />
                            
                            <UserSection 
                                user={user}
                                isAuthenticated={isAuthenticated}
                                userRole={userRole}
                                onLogoutClick={() => setIsLogoutModalOpen(true)}
                            />

                            {/* Mobile Nav Toggle Integration */}
                            {!isPanel && (
                                <div className="lg:hidden pl-2 border-l border-gray-100 dark:border-gray-700">
                                    <NavLinks />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Logout">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LogoutIcon className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">Parting ways?</h3>
                    <p className="text-gray-500 mb-10 font-medium">We hope you'll be back soon to discover more curated finds.</p>
                    <div className="flex flex-col gap-3">
                        <Button fullWidth variant="danger" className="rounded-full py-5 uppercase font-black tracking-widest text-xs" onClick={() => { logout(); setIsLogoutModalOpen(false); }}>
                            Confirm Logout
                        </Button>
                        <Button fullWidth variant="outline" onClick={() => setIsLogoutModalOpen(false)} className="rounded-full py-5 uppercase font-black tracking-widest text-xs">
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </motion.header>
    );
};

export default Header;
