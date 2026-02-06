import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// Pages - Public
import { HomePage } from "../features/home/pages/index.js";
import { LoginPage, RegisterPage } from "../features/auth/pages/index.js";
import { PublicCartPage, PublicWishlistPage } from "../features/public/pages/index.js";

// Pages - Dashboard (Role-specific)
import { AdminDashboardPage } from "../features/admin/pages/index.js";
import { SellerDashboardPage } from "../features/seller/pages/index.js";
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
					{ path: "users", element: <PlaceholderPage title="User Management" /> },
					{ path: "products", element: <PlaceholderPage title="Product Management" /> },
					{ path: "orders", element: <PlaceholderPage title="Order Management" /> },
					{ path: "analytics", element: <PlaceholderPage title="Analytics & Reports" /> },
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
					{ path: "products", element: <PlaceholderPage title="My Products" /> },
					{ path: "inventory", element: <PlaceholderPage title="Inventory" /> },
					{ path: "orders", element: <PlaceholderPage title="Orders" /> },
					{ path: "analytics", element: <PlaceholderPage title="Sales Analytics" /> },
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
