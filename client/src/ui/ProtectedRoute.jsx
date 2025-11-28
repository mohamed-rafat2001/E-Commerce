import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetCurrentUser } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 *
 * @param {ReactNode} children - Components to render if authenticated
 * @param {string[]} allowedRoles - Optional array of allowed roles
 */
function ProtectedRoute({ allowedRoles = [] }) {
	const { isAuthenticated, userRole, isLoading } = useGetCurrentUser();
	const location = useLocation();
	console.log(userRole);
	// Keep track if the user has just become unauthenticated
	const wasAuthenticated = useRef(isAuthenticated);
	const [shouldRedirect, setShouldRedirect] = useState(false);

	// Watch for changes to isAuthenticated after mount
	useEffect(() => {
		if (wasAuthenticated.current && !isAuthenticated) {
			setShouldRedirect(true);
		}
		wasAuthenticated.current = isAuthenticated;
	}, [isAuthenticated]);

	// Show a loading indicator while user info is being fetched
	if (isLoading) {
		return <LoadingSpinner />;
	}

	// If user is not authenticated (either initially or due to state change), redirect to login
	if (!isAuthenticated || shouldRedirect) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Check role-based access
	if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
		// Redirect based on role or show unauthorized
		return <Navigate to="/unauthorized" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
