// Analytics
export { default as useAnalyticsPage } from './analytics/useAnalyticsPage.js';
export { useAdminAnalytics } from './analytics/useAdminAnalytics.js';

// Brands
export { default as useBrandsPage } from './brands/useBrandsPage.js';
export { default as useAdminBrands } from './brands/useAdminBrands.js';
export { default as useSellerBrands } from './brands/useSellerBrands.js';

// Categories
export { default as useCategoriesPage } from './categories/useCategoriesPage.js';
export { default as useCategories } from './categories/useCategories.js';
export { default as useAddCategory } from './categories/useAddCategory.js';
export { default as useUpdateCategory } from './categories/useUpdateCategory.js';
export { default as useDeleteCategory } from './categories/useDeleteCategory.js';
export { default as useDeleteCategories } from './categories/useDeleteCategories.js';

// SubCategories
export * from './subCategories/index.js';

// Dashboard
export { default as useDashboardPage } from './dashboard/useDashboardPage.js';
export { useDashboardStats } from './dashboard/useDashboardStats.js';

// Orders
export { default as useAdminOrders } from './orders/useAdminOrders.js';
export { default as useOrdersPage } from './orders/useOrdersPage.js';
export { 
	useUpdateOrder 
} from './orders/useOrderMutations.js';

// Products
export { default as useAdminProducts } from './products/useAdminProducts.js';
export { default as useProductsPage } from './products/useProductsPage.js';
export { 
	useUpdateProduct, 
	useDeleteProduct 
} from './products/useProductMutations.js';

// Users
export { default as useAdminUsers } from './users/useAdminUsers.js';
export { default as useUsersPage } from './users/useUsersPage.js';
export { useCreateUser, useUpdateUser, useDeleteUser } from './users/useUserMutations.js';

// Users Details
export { default as useUserDetails } from './users/details/useUserDetails.js';
export { default as useAccordionSections } from './users/details/useAccordionSections.js';
export { default as useUserData } from './users/details/useUserData.js';
export { default as useUserDetailsPage } from './users/details/useUserDetailsPage.js';
