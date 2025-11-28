import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AppLayout from "./AppLayout.jsx";
import PageNotFound from "./PageNotFound.jsx";
import PersonalDetailsPage from "../pages/PersonalDetailsPage.jsx";
import ShippingAdressesPage from "../pages/customerPannel/ShippingAdressesPage.jsx";
import PaymentMethodsPage from "../pages/customerPannel/PaymentMethodsPage.jsx";
import OrderHistoryPage from "../pages/customerPannel/OrderHistoryPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
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
