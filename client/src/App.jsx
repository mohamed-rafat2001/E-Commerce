import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import router from "./routing/router.jsx";
import queryClient from "./shared/utils/queryClient.js";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<RouterProvider router={router} />
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						className: "react-hot-toast",
						style: {
							background: 'rgba(255, 255, 255, 0.95)',
							backdropFilter: 'blur(12px)',
							color: '#1e293b',
							padding: '12px 16px',
							borderRadius: '20px',
							boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
							border: '1px solid rgba(255, 255, 255, 0.5)',
							maxWidth: '400px',
						},
						success: {
							duration: 3000,
							icon: null,
						},
						error: {
							duration: 5000,
							icon: null,
						},
					}}
					containerStyle={{ 
						top: 40, 
						right: 24,
					}}
					gutter={12}
					reverseOrder={false}
				/>
			</QueryClientProvider>
		</div>
	);
}

export default App;
