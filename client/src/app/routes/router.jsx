import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { LoadingSpinner } from "../../shared/ui/index.js";

// Layouts — loaded eagerly (needed for every page)
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import PublicLayout from "../../shared/layout/PublicLayout.jsx";

// ─── Lazy-loaded Pages ────────────────────────────────────────────
// Code-splitting: each page component is loaded on demand as a separate chunk.
// This reduces the initial bundle size dramatically.

// Public pages
const HomePage = lazy(() => import("../../features/home/pages/HomePage.jsx"));
const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../../features/auth/pages/RegisterPage.jsx"));
const ProductsPage = lazy(() => import("../../features/product/pages/ProductsPage.jsx"));
const ProductDetailPage = lazy(() => import("../../features/product/pages/ProductDetailPage.jsx"));
const CartPage = lazy(() => import("../../features/cart/pages/CartPage.jsx"));
const PublicWishlistPage = lazy(() => import("../../features/public/pages/PublicWishlistPage.jsx"));
const PublicBrandsPage = lazy(() => import("../../features/public/pages/BrandsPage.jsx"));
const PublicCategoriesPage = lazy(() => import("../../features/public/pages/CategoriesPage.jsx"));
const BrandDetailPage = lazy(() => import("../../features/public/pages/BrandDetailPage.jsx"));
const CategoryProductsRedirectPage = lazy(() => import("../../features/public/pages/CategoryProductsRedirectPage.jsx"));

// Admin pages
const AdminDashboardPage = lazy(() => import("../../features/admin/pages/DashboardPage.jsx"));
const AdminUsersPage = lazy(() => import("../../features/admin/pages/UsersPage.jsx"));
const UserDetailsPage = lazy(() => import("../../features/admin/pages/UserDetailsPage.jsx"));
const AdminProductsPage = lazy(() => import("../../features/admin/pages/ProductsPage.jsx"));
const AdminOrdersPage = lazy(() => import("../../features/admin/pages/OrdersPage.jsx"));
const AdminAnalyticsPage = lazy(() => import("../../features/admin/pages/AnalyticsPage.jsx"));
const CategoriesAndSubCategoriesPage = lazy(() => import("../../features/admin/pages/CategoriesAndSubCategoriesPage.jsx"));
const AdminBrandsPage = lazy(() => import("../../features/admin/pages/BrandsPage.jsx"));

// Seller pages
const SellerDashboardPage = lazy(() => import("../../features/seller/pages/DashboardPage.jsx"));
const SellerProductsPage = lazy(() => import("../../features/seller/pages/ProductsPage.jsx"));
const SellerOrdersPage = lazy(() => import("../../features/seller/pages/OrdersPage.jsx"));
const SellerAnalyticsPage = lazy(() => import("../../features/seller/pages/AnalyticsPage.jsx"));
const BrandsManagementPage = lazy(() => import("../../features/seller/pages/BrandsManagementPage.jsx"));
const SellerBrandDetailsPage = lazy(() => import("../../features/seller/pages/BrandDetailsPage.jsx"));
const SellerProductDetailPage = lazy(() => import("../../features/product/pages/ManagementProductDetailPage.jsx"));

// Customer pages
const CustomerDashboardPage = lazy(() => import("../../features/customer/pages/DashboardPage.jsx"));
const ShippingAddressesPage = lazy(() => import("../../features/customer/pages/ShippingAddressesPage.jsx"));
const PaymentMethodsPage = lazy(() => import("../../features/customer/pages/PaymentMethodsPage.jsx"));
const OrderHistoryPage = lazy(() => import("../../features/customer/pages/OrderHistoryPage.jsx"));
const CustomerWishlistPage = lazy(() => import("../../features/customer/pages/WishlistPage.jsx"));

// Shared pages
const PersonalDetailsPage = lazy(() => import("../../features/user/pages/PersonalDetailsPage.jsx"));
const SettingsPage = lazy(() => import("../../features/settings/pages/SettingsPage.jsx"));
const PlaceholderPage = lazy(() => import("../../shared/pages/PlaceholderPage.jsx"));
const ManagementProductDetailPage = lazy(() => import("../../features/product/pages/ManagementProductDetailPage.jsx"));

// UI Components (lightweight, can be eagerly loaded)
import PageNotFound from "../../shared/ui/PageNotFound.jsx";

// Suspense wrapper with a centered spinner
function SuspenseWrapper({ children }) {
	return (
		<Suspense
			fallback={
				<div className="min-h-[60vh] flex items-center justify-center">
					<LoadingSpinner size="xl" color="primary" />
				</div>
			}
		>
			{children}
		</Suspense>
	);
}

// Helper to wrap lazy components
const S = (Component, props = {}) => (
	<SuspenseWrapper>
		<Component {...props} />
	</SuspenseWrapper>
);

// Create app routing
const router = createBrowserRouter([
	// Public Routes
	{
		element: <PublicLayout />,
		children: [
			{ path: "/", element: S(HomePage) },
			{ path: "/login", element: S(LoginPage) },
			{ path: "/register", element: S(RegisterPage) },
			{ path: "/cart", element: S(CartPage) },
			{ path: "/public-cart", element: S(CartPage) },
			{ path: "/public-wishlist", element: S(PublicWishlistPage) },
			{ path: "/products", element: S(ProductsPage) },
			{ path: "/products/:id", element: S(ProductDetailPage) },
			{ path: "/brands", element: S(PublicBrandsPage) },
			{ path: "/brands/all", element: S(PublicBrandsPage) },
			{ path: "/brands/:brandId", element: S(BrandDetailPage) },
			{ path: "/categories", element: S(PublicCategoriesPage) },
			{ path: "/categories/all", element: S(PublicCategoriesPage) },
			{ path: "/categories/:categoryId", element: S(CategoryProductsRedirectPage) },
			{
				element: <ProtectedRoute />,
				children: [
					{ path: "/checkout", element: S(PlaceholderPage, { title: "Checkout" }) },
					{ path: "/orders", element: S(PlaceholderPage, { title: "Orders" }) },
					{ path: "/orders/:orderId", element: S(PlaceholderPage, { title: "Order Details" }) },
					{ path: "/profile", element: S(PlaceholderPage, { title: "Profile" }) },
					{ path: "/profile/edit", element: S(PlaceholderPage, { title: "Edit Profile" }) },
				],
			},
		]
	},
	// Admin Routes
	{
		element: <ProtectedRoute allowedRoles={["Admin"]} />,
		children: [
			{
				path: "/admin",
				element: <DashboardLayout />,
				children: [
					{ index: true, element: S(AdminDashboardPage) },
					{ path: "dashboard", element: S(AdminDashboardPage) },
					{ path: "personalDetails", element: S(PersonalDetailsPage) },
					{ path: "settings", element: S(SettingsPage) },
					{ path: "users", element: S(AdminUsersPage) },
					{ path: "users/:userId", element: S(UserDetailsPage) },
					{ path: "products", element: S(AdminProductsPage) },
					{ path: "products/:id", element: S(ManagementProductDetailPage, { viewerRole: "admin" }) },
					{ path: "orders", element: S(AdminOrdersPage) },
					{ path: "analytics", element: S(AdminAnalyticsPage) },
					{ path: "categories", element: S(CategoriesAndSubCategoriesPage) },
					{ path: "brands", element: S(AdminBrandsPage) },
				],
			},
		],
	},

	// Seller Routes
	{
		element: <ProtectedRoute allowedRoles={["Seller"]} />,
		children: [
			{
				path: "/seller",
				element: <DashboardLayout />,
				children: [
					{ index: true, element: S(SellerDashboardPage) },
					{ path: "dashboard", element: S(SellerDashboardPage) },
					{ path: "personalDetails", element: S(PersonalDetailsPage) },
					{ path: "settings", element: S(SettingsPage) },
					{ path: "inventory", element: S(SellerProductsPage) },
					{ path: "inventory/:id", element: S(ManagementProductDetailPage, { viewerRole: "seller" }) },
					{ path: "orders", element: S(SellerOrdersPage) },
					{ path: "brands", element: S(BrandsManagementPage) },
					{ path: "brands/:id", element: S(SellerBrandDetailsPage) },
					{ path: "analytics", element: S(SellerAnalyticsPage) },
				],
			},
		],
	},

	// Customer Routes
	{
		element: <ProtectedRoute allowedRoles={["Customer"]} />,
		children: [
			{
				path: "/customer",
				element: <DashboardLayout />,
				children: [
					{ index: true, element: S(CustomerDashboardPage) },
					{ path: "dashboard", element: S(CustomerDashboardPage) },
					{ path: "personalDetails", element: S(PersonalDetailsPage) },
					{ path: "shippingAddresses", element: S(ShippingAddressesPage) },
					{ path: "paymentMethods", element: S(PaymentMethodsPage) },
					{ path: "orderHistory", element: S(OrderHistoryPage) },
					{ path: "products/:id", element: S(ProductDetailPage) },
					{ path: "cart", element: S(CartPage) },
					{ path: "wishlist", element: S(CustomerWishlistPage) },
					{ path: "settings", element: S(SettingsPage) },
				],
			},
		],
	},

	// Page Not Found Route (Catch-all)
	{
		path: "*",
		element: <PageNotFound />,
	},
]);

export default router;
