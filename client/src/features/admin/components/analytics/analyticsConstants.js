// Mock analytics data
export const mockAnalytics = {
	revenue: {
		total: 248521.34,
		change: 18.7,
		chartData: [18200, 21100, 19800, 25200, 24800, 28100, 26800, 32200, 29800, 35100, 32500, 38900],
		byMonth: [
			{ month: 'Jan', revenue: 18200 },
			{ month: 'Feb', revenue: 21100 },
			{ month: 'Mar', revenue: 19800 },
			{ month: 'Apr', revenue: 25200 },
			{ month: 'May', revenue: 24800 },
			{ month: 'Jun', revenue: 28100 },
		],
	},
	orders: {
		total: 34182,
		change: 23.1,
		chartData: [2800, 3200, 2900, 3800, 3500, 4200, 3900, 4800, 4200, 5100, 4700, 5400],
	},
	users: {
		total: 12847,
		newThisMonth: 892,
		change: 12.5,
		byRole: [
			{ role: 'Customers', count: 11234, percentage: 87 },
			{ role: 'Sellers', count: 1589, percentage: 12 },
			{ role: 'Admins', count: 24, percentage: 1 },
		],
	},
	products: {
		total: 4523,
		active: 3892,
		outOfStock: 234,
	},
	topSellers: [
		{ name: 'TechStore Pro', sales: 15234, revenue: 482400, rating: 4.9 },
		{ name: 'FashionHub', sales: 12089, revenue: 356200, rating: 4.8 },
		{ name: 'HomeDecor Plus', sales: 9856, revenue: 289100, rating: 4.7 },
		{ name: 'GadgetWorld', sales: 8234, revenue: 245600, rating: 4.8 },
		{ name: 'SportZone', sales: 7123, revenue: 198400, rating: 4.6 },
	],
	topProducts: [
		{ name: 'Wireless Headphones Pro', sales: 2834, revenue: 424100 },
		{ name: 'Smart Watch Ultra', sales: 2156, revenue: 862400 },
		{ name: 'Laptop Stand Premium', sales: 1893, revenue: 151440 },
		{ name: 'Mechanical Keyboard', sales: 1672, revenue: 267520 },
		{ name: 'USB-C Hub Pro', sales: 1534, revenue: 122720 },
	],
	recentActivity: [], // Will be populated with real icon components in the component
};
