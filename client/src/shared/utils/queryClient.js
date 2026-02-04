import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
			cacheTime: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
		},
	},
});
export default queryClient;
