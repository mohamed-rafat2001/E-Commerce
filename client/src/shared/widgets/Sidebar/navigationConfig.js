import {
    UserIcon,
    ShippingIcon,
    PaymentIcon,
    OrderIcon,
    DashboardIcon,
    ProductIcon,
    UsersIcon,
    AnalyticsIcon,
    StoreIcon,
    HeartIcon,
    CategoryIcon,
    TagIcon
} from '../../constants/icons.jsx';

/**
 * Navigation configurations for each user role
 */
export const roleNavigationConfig = {
    Admin: [
        { label: 'Dashboard', path: 'dashboard', icon: DashboardIcon, description: 'Overview & analytics' },
        { label: 'Personal Details', path: 'personalDetails', icon: UserIcon, description: 'Manage your profile' },
        { label: 'User Management', path: 'users', icon: UsersIcon, description: 'Manage all users' },
        { label: 'Products', path: 'products', icon: ProductIcon, description: 'Product management' },
        { label: 'Categories', path: 'categories', icon: CategoryIcon, description: 'Manage product categories' },
        { label: 'Brands', path: 'brands', icon: TagIcon, description: 'Manage brands' },
        { label: 'Orders', path: 'orders', icon: OrderIcon, description: 'All order history' },
        { label: 'Analytics', path: 'analytics', icon: AnalyticsIcon, description: 'Sales & metrics' },
        { label: 'Discounts', path: 'discounts', icon: TagIcon, description: 'Promotions & offers' },
    ],
    Seller: [
        { label: 'Dashboard', path: 'dashboard', icon: DashboardIcon, description: 'Store overview' },
        { label: 'Personal Details', path: 'personalDetails', icon: UserIcon, description: 'Your seller profile' },
        { label: 'Brands', path: 'brands', icon: StoreIcon, description: 'Manage your brands' },
        { label: 'Inventory', path: 'inventory', icon: ProductIcon, description: 'Manage listings' },
        { label: 'Orders', path: 'orders', icon: OrderIcon, description: 'Customer orders' },
        { label: 'Analytics', path: 'analytics', icon: AnalyticsIcon, description: 'Sales performance' },
        { label: 'Discounts', path: 'discounts', icon: TagIcon, description: 'Promotions & sales' },
    ],
    Customer: [
        { label: 'Dashboard', path: 'dashboard', icon: DashboardIcon, description: 'Overview & statistics' },
        { label: 'Personal Details', path: 'personalDetails', icon: UserIcon, description: 'Your profile info' },
        { label: 'Shipping Addresses', path: 'shippingAddresses', icon: ShippingIcon, description: 'Delivery locations' },
        { label: 'Payment Methods', path: 'paymentMethods', icon: PaymentIcon, description: 'Cards & payments' },
        { label: 'Order History', path: 'orderHistory', icon: OrderIcon, description: 'Past purchases' },
        { label: 'My Cart', path: 'cart', icon: StoreIcon, description: 'Items in your cart' },
        { label: 'Wishlist', path: 'wishlist', icon: HeartIcon, description: 'Your saved items' },
    ],
};
