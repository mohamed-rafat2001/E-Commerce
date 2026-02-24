import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Layouts
import DashboardLayout from "../../layouts/DashboardLayout.jsx";

// Pages - Public
import { HomePage } from "../../features/home/pages/index.js";
import { LoginPage, RegisterPage } from "../../features/auth/pages/index.js";
import { PublicCartPage, PublicWishlistPage } from "../../features/public/pages/index.js";

// Pages - Dashboard (Role-specific)
import { 
	AdminDashboardPage,
	UsersPage as AdminUsersPage,
	UserDetailsPage,
	ProductsPage as AdminProductsPage,
	OrdersPage as AdminOrdersPage,
	AnalyticsPage as AdminAnalyticsPage,
	CategoriesAndSubCategoriesPage,
	BrandsPage
} from "../../features/admin/pages/index.js";

import { 
	SellerDashboardPage,
	ProductsPage as SellerProductsPage,
	OrdersPage as SellerOrdersPage,
	AnalyticsPage as SellerAnalyticsPage,
	BrandsManagementPage,
	BrandDetailsPage,
} from "../../features/seller/pages/index.js";

import { 
	CustomerDashboardPage, 
	ShippingAddressesPage, 
	PaymentMethodsPage, 
	OrderHistoryPage,
	CartPage,
	WishlistPage 
} from "../../features/customer/pages/index.js";

// Pages - Shared
import { PersonalDetailsPage } from "../../features/user/pages/index.js";
import { SettingsPage } from "../../features/settings/pages/index.js";
import { PlaceholderPage } from "../../shared/pages/index.js";
import { ProductDetailPage } from "../../features/product/pages/index.js";

// UI Components
import PageNotFound from "../../shared/ui/PageNotFound.jsx";

// Create app routing
const router = createBrowserRouter([
	// Public Routes
	{ path: "/", element: <HomePage /> },
	{ path: "/login", element: <LoginPage /> },
	{ path: "/register", element: <RegisterPage /> },
	{ path: "/public-cart", element: <PublicCartPage /> },
	{ path: "/public-wishlist", element: <PublicWishlistPage /> },

	// Admin Routes
	{
		element: <ProtectedRoute allowedRoles={["Admin"]} />,
		children: [
			{
				path: "/admin",
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <AdminDashboardPage />,
					},
					{
						path: "dashboard",
						element: <AdminDashboardPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{ path: "settings", element: <SettingsPage /> },
					{ path: "users", element: <AdminUsersPage /> },
					{ path: "users/:userId", element: <UserDetailsPage /> },
					{ path: "products", element: <AdminProductsPage /> },
					{ path: "products/:id", element: <ProductDetailPage /> },
					{ path: "orders", element: <AdminOrdersPage /> },
					{ path: "analytics", element: <AdminAnalyticsPage /> },
					{ path: "categories", element: <CategoriesAndSubCategoriesPage /> },
					{ path: "brands", element: <BrandsPage /> },
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
					{
						index: true,
						element: <SellerDashboardPage />,
					},
					{
						path: "dashboard",
						element: <SellerDashboardPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{ path: "settings", element: <SettingsPage /> },
					{ path: "products", element: <SellerProductsPage /> },
					{ path: "products/:id", element: <ProductDetailPage /> },
					{ path: "orders", element: <SellerOrdersPage /> },
					{ path: "brands", element: <BrandsManagementPage /> },
					{ path: "brands/:id", element: <BrandDetailsPage /> },
					{ path: "analytics", element: <SellerAnalyticsPage /> },
					
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
					{
						index: true,
						element: <CustomerDashboardPage />,
					},
					{
						path: "dashboard",
						element: <CustomerDashboardPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{
						path: "shippingAddresses",
						element: <ShippingAddressesPage />,
					},
					{
						path: "paymentMethods",
						element: <PaymentMethodsPage />,
					},
					{
						path: "orderHistory",
						element: <OrderHistoryPage />,
					},
					{ path: "products/:id", element: <ProductDetailPage /> },
					{ 
						path: "cart", 
						element: <CartPage /> 
					},
					{ 
						path: "wishlist", 
						element: <WishlistPage /> 
					},
					{ path: "settings", element: <SettingsPage /> },
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
