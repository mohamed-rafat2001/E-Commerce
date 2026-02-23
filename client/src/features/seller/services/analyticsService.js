import { getFunc } from "../../../shared/services/handlerFactory.js";

// ===== ANALYTICS SERVICES =====
// Get seller analytics/stats
export const getSellerAnalytics = (timeRange) => getFunc(`sellers/analytics?range=${timeRange}`);

// Get seller dashboard stats
export const getSellerDashboardStats = () => getFunc("sellers/dashboard-stats");
