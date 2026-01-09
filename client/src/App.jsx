import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import router from "./routing/router.jsx";
import queryClient from "./utils/queryClient.js";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<div className=" bg-gray-100 ">
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<RouterProvider router={router} />
				<Toaster
					position="bottom-right"
					toastOptions={{
						duration: 3000,
						style: {
							padding: "10px 20px",
						},
					}}
					containerStyle={{ bottom: 50, right: 30 }}
					reverseOrder={true}
				/>
			</QueryClientProvider>
		</div>
	);
}

export default App;
