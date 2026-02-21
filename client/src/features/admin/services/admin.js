import { addFunc, deleteFunc, getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// ===== GENERIC ADMIN CRUD SERVICES =====
// These use the generic admin API endpoints

// Get all documents for a model
export const getAdminData = (model) => getFunc(`admin/${model}`);

// Get single document by ID
export const getAdminDataById = (model, id) => getFunc(`admin/${model}/${id}`);

// Create new document
export const createAdminData = (model, data) => addFunc(`admin/${model}`, data);

// Update document by ID
export const updateAdminData = (model, id, data) => updateFunc(`admin/${model}/${id}`, data);

// Delete document by ID
export const deleteAdminDataById = (model, id) => deleteFunc(`admin/${model}/${id}`);

// Delete all documents
export const deleteAllAdminData = (model) => deleteFunc(`admin/${model}`);

// ===== SPECIFIC MODEL SERVICES =====

// Users
export const getAllUsers = () => getAdminData("users");
export const getUserById = (id) => getAdminDataById("users", id);
export const createUser = (data) => createAdminData("users", data);
export const updateUser = (id, data) => updateAdminData("users", id, data);
export const deleteUser = (id) => deleteAdminDataById("users", id);

// Products
export const getAllProducts = () => getAdminData("products");
export const getProductById = (id) => getAdminDataById("products", id);
export const updateProduct = (id, data) => updateAdminData("products", id, data);
export const deleteProduct = (id) => deleteAdminDataById("products", id);

// Orders
export const getAllOrders = () => getAdminData("orders");
export const getOrderById = (id) => getAdminDataById("orders", id);
export const updateOrder = (id, data) => updateAdminData("orders", id, data);

// Sellers
export const getAllSellers = () => getAdminData("sellers");
export const getSellerById = (id) => getAdminDataById("sellers", id);
export const updateSeller = (id, data) => updateAdminData("sellers", id, data);

// Customers
export const getAllCustomers = () => getAdminData("customers");

// Categories
export const getAllCategories = (params) => getFunc("categories", { params });
export const createCategory = (data) => createAdminData("categories", data);
export const updateCategory = (id, data) => updateAdminData("categories", id, data);
export const deleteCategory = (id) => deleteAdminDataById("categories", id);

// Reviews
export const getAllReviews = () => getAdminData("reviews");
export const deleteReview = (id) => deleteAdminDataById("reviews", id);

// ===== DASHBOARD STATS =====
// Note: You may need to create a custom endpoint for aggregated stats
export const getAdminDashboardStats = () => getFunc("admin/stats");
export const getAdminAnalytics = (timeRange) => getFunc(`admin/analytics?timeRange=${timeRange}`);
