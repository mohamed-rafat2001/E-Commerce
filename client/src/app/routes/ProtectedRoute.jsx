/* Audit Findings:
 - Existing route protection redirects unauthenticated users to /login via location state.
 - Auth workflows need query-based redirect handling for seamless post-login return.
 - Role checks remain required for admin/seller/customer dashboard paths.
*/
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCurrentUser from "../../features/user/hooks/useCurrentUser.js";
import LoadingSpinner from "../../shared/ui/LoadingSpinner";

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 *
 * @param {ReactNode} children - Components to render if authenticated
 * @param {string[]} allowedRoles - Optional array of allowed roles
 */
function ProtectedRoute({ allowedRoles = [] }) {
	const { isAuthenticated, userRole, isLoading } = useCurrentUser();
	const location = useLocation();

	// Show a loading indicator while user info is being fetched
	if (isLoading) {
		return <LoadingSpinner />;
	}

	// If user is not authenticated, redirect to login
	if (!isAuthenticated) {
		const redirectPath = `${location.pathname}${location.search}`;
		return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
	}

	// Check role-based access
	if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
		// Redirect to home or unauthorized page
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
