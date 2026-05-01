/* Audit Findings:
 - Global app shell already mounts router and toast system.
 - Cart merge must run after authentication transitions and react-query availability.
 - Auth modal must render at app root to support prompts from any feature component.
 - Added HelmetProvider for per-route SEO meta tag injection.
*/
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import router from "./app/routes/router.jsx";
import queryClient from "./shared/utils/queryClient.js";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import useCartMerge from "./hooks/useCartMerge.js";
import useWishlistMerge from "./hooks/useWishlistMerge.js";

const toasterOptions = {
	duration: 4000,
	className: "react-hot-toast",
	style: {
		background: "#ffffff",
		color: "#1e293b",
		padding: "12px 14px",
		borderRadius: "14px",
		boxShadow: "0 10px 30px -16px rgba(2, 6, 23, 0.45)",
		border: "1px solid #e2e8f0",
		maxWidth: "360px",
	},
	success: {
		duration: 3000,
		icon: null,
	},
	error: {
		duration: 5000,
		icon: null,
	},
};

const ReactQueryDevtools = import.meta.env.DEV
	? lazy(() =>
		import("@tanstack/react-query-devtools").then((module) => ({
			default: module.ReactQueryDevtools,
		}))
	)
	: null;

function AppBoot() {
	useCartMerge();
	useWishlistMerge();
	return <RouterProvider router={router} />;
}

function App() {
	return (
		<HelmetProvider>
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
				<ErrorBoundary>
					<QueryClientProvider client={queryClient}>
						{ReactQueryDevtools && (
							<Suspense fallback={null}>
								<ReactQueryDevtools initialIsOpen={false} />
							</Suspense>
						)}
						<AppBoot />
						<Toaster
							position="top-right"
							toastOptions={toasterOptions}
							containerStyle={{
								top: 40,
								right: 24,
							}}
							gutter={12}
							reverseOrder={false}
						/>
					</QueryClientProvider>
				</ErrorBoundary>
			</div>
		</HelmetProvider>
	);
}

export default App;
