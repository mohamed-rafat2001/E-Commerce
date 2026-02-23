import axios from "axios";

// Create axios instance with default config
const mainApi = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1/",
	withCredentials: true, // Required for httpOnly cookies
});

// No request interceptor needed - cookies are sent automatically
// with withCredentials: true

// Response interceptor - Handle token expiration
mainApi.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// If the error is 401 and not already retried
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Attempt to refresh the token
				await axios.post(
					`${import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1/"}authentications/refresh-token`,
					{},
					{ withCredentials: true }
				);

				// Retry the original request
				return mainApi(originalRequest);
			} catch (refreshError) {
				// If refresh also fails, clear state and redirect to login
				// This part depends on your auth state management, 
				// but at minimum we should reject the promise
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default mainApi;
