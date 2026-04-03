import { QueryClient } from "@tanstack/react-query";

/**
 * Optimized QueryClient configuration.
 * 
 * Key decisions:
 * - staleTime: 5min — prevents refetching the same data within a session
 * - gcTime: 10min — keeps cache in memory for quick re-mounts  
 * - retry: 1 — single retry to avoid hammering a failing server
 * - refetchOnWindowFocus: false — prevents surprise refetches when switching tabs
 * - refetchOnReconnect: true — auto-refresh stale data when network comes back
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,        // 5 minutes
			gcTime: 1000 * 60 * 30,           // 30 minutes — keep in memory for quick re-mounts
			retry: 1,
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
		},
		mutations: {
			retry: 0,
		},
	},
});

export { queryClient };
export default queryClient;
