import axios from "axios";

// Create axios instance with default config
const mainApi = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1/",
	withCredentials: true, // Required for httpOnly cookies
	headers: {
		"Content-Type": "application/json",
	},
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

		// If 401 and not already retried
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// Redirect to login
			window.location.href = "/login";
		}

		return Promise.reject(error);
	}
);

export default mainApi;
