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
					position="bottom-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: '#1e293b',
							color: '#fff',
							padding: '16px 24px',
							borderRadius: '16px',
							boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
							fontSize: '14px',
							fontWeight: '500',
						},
						success: {
							iconTheme: {
								primary: '#22c55e',
								secondary: '#fff',
							},
							style: {
								border: '1px solid rgba(34, 197, 94, 0.3)',
							},
						},
						error: {
							iconTheme: {
								primary: '#ef4444',
								secondary: '#fff',
							},
							style: {
								border: '1px solid rgba(239, 68, 68, 0.3)',
							},
						},
					}}
					containerStyle={{ bottom: 40, right: 24 }}
					reverseOrder={true}
				/>
			</QueryClientProvider>
		</div>
	);
}

export default App;
