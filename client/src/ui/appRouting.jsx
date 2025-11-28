import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminLayout from "./appLayoutes/AdminLayout.jsx";
import CustomerLayout from "./appLayoutes/CustomerLayout.jsx";
import SellerLayout from "./appLayoutes/SellerLayout.jsx";
import EmployeeLayout from "./appLayoutes/EmployeeLayout.jsx";
import PageNotFound from "./PageNotFound.jsx";
import CustomerDashboard from "../pages/customerPannel/CustomerDashboard.jsx";
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
				element: <AdminLayout />,
				children: [],
			},
		],
	},

	// Seller Routes
	{
		element: <ProtectedRoute allowedRoles={["Seller"]} />,
		children: [
			{
				path: "/seller",
				element: <SellerLayout />,
				children: [],
			},
		],
	},

	// Customer Routes
	{
		element: <ProtectedRoute allowedRoles={["Customer"]} />,
		children: [
			{
				path: "/customer",
				element: <CustomerLayout />,
				children: [
					{
						path: "dashboard",
						element: <CustomerDashboard />,
					},
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
				element: <EmployeeLayout />,
				children: [],
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
