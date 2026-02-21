import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// Pages - Public
import { HomePage } from "../features/home/pages/index.js";
import { LoginPage, RegisterPage } from "../features/auth/pages/index.js";
import { PublicCartPage, PublicWishlistPage } from "../features/public/pages/index.js";

// Pages - Dashboard (Role-specific)
import { 
	AdminDashboardPage,
	UsersPage as AdminUsersPage,
	UserDetailsPage,
	ProductsPage as AdminProductsPage,
	OrdersPage as AdminOrdersPage,
	AnalyticsPage as AdminAnalyticsPage,
	CategoriesAndSubCategoriesPage
} from "../features/admin/pages/index.js";

import { 
	SellerDashboardPage,
	ProductsPage as SellerProductsPage,
	InventoryPage as SellerInventoryPage,
	OrdersPage as SellerOrdersPage,
	AnalyticsPage as SellerAnalyticsPage,
	StoreSettingsPage as SellerStoreSettingsPage,
	BrandsManagementPage
} from "../features/seller/pages/index.js";

import { 
	CustomerDashboardPage, 
	ShippingAddressesPage, 
	PaymentMethodsPage, 
	OrderHistoryPage,
	CartPage,
	WishlistPage 
} from "../features/customer/pages/index.js";

import { EmployeeDashboardPage } from "../features/employee/pages/index.js";

// Pages - Shared
import { PersonalDetailsPage } from "../features/user/pages/index.js";
import { SettingsPage } from "../features/settings/pages/index.js";
import { PlaceholderPage } from "../features/shared/pages/index.js";

// UI Components
import PageNotFound from "../shared/ui/PageNotFound.jsx";

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
					{ path: "orders", element: <AdminOrdersPage /> },
					{ path: "analytics", element: <AdminAnalyticsPage /> },
					{ path: "categories", element: <CategoriesAndSubCategoriesPage /> },
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
					{ path: "inventory", element: <SellerInventoryPage /> },
					{ path: "orders", element: <SellerOrdersPage /> },
					{ path: "analytics", element: <SellerAnalyticsPage /> },
					{ path: "store-settings", element: <SellerStoreSettingsPage /> },
					{ path: "brands", element: <BrandsManagementPage /> },
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

	// Employee Routes
	{
		element: <ProtectedRoute allowedRoles={["Employee"]} />,
		children: [
			{
				path: "/employee",
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <EmployeeDashboardPage />,
					},
					{
						path: "dashboard",
						element: <EmployeeDashboardPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{ path: "settings", element: <SettingsPage /> },
					{ path: "orders", element: <PlaceholderPage title="Process Orders" /> },
					{ path: "inventory", element: <PlaceholderPage title="Inventory Management" /> },
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
