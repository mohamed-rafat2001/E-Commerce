import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import ProtectedRoute from "../routing/ProtectedRoute.jsx";

import HomePage from "../features/home/HomePage.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import PersonalDetailsPage from "../features/user/PersonalDetailsPage.jsx";
import ShippingAdressesPage from "../features/customerPanel/shippingAddress/ShippingAdressesPage.jsx";
import PaymentMethodsPage from "../features/customerPanel/paymentMethod/PaymentMethodsPage.jsx";
import OrderHistoryPage from "../features/customerPanel/orderHistory/OrderHistoryPage.jsx";
import SettingsPage from "../features/settings/SettingsPage.jsx";
import PageNotFound from "../ui/PageNotFound.jsx";
// create app routing
const router = createBrowserRouter([
	// Public Routes

	{ path: "/", element: <HomePage /> },
	{ path: "/login", element: <LoginPage /> },
	{ path: "/register", element: <RegisterPage /> },

	// Admin Routes
	{
		element: <ProtectedRoute allowedRoles={["Admin"]} />,
		children: [
			{
				path: "/admin",
				element: <AppLayout />,
				children: [
					{
						index: true,
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{ path: "settings", element: <SettingsPage /> },
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
				element: <AppLayout />,
				children: [
					{
						index: true,
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{ path: "settings", element: <SettingsPage /> },
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
				element: <AppLayout />,
				children: [
					{
						index: true,
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{
						path: "shippingAddresses",
						element: <ShippingAdressesPage />,
					},
					{
						path: "paymentMethods",
						element: <PaymentMethodsPage />,
					},
					{
						path: "orderHistory",
						element: <OrderHistoryPage />,
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
				element: <AppLayout />,
				children: [
					{
						index: true,
						path: "personalDetails",
						element: <PersonalDetailsPage />,
					},
					{
						path: "personalDetails",
						element: <PersonalDetailsPage />,
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
