import { getFunc, updateFunc } from "../../../shared/services/handlerFactory.js";

// ===== SELLER PROFILE SERVICES =====
// Get seller profile
export const getSellerProfile = () => getFunc("sellers/profile");

// Update seller profile
export const updateSellerProfile = (data) => updateFunc("sellers", data);

// Add address to seller
export const addSellerAddress = (address) => updateFunc("sellers/addresses", { addresses: address });

// Add payout method
export const addPayoutMethod = (payoutMethod) => 
	updateFunc("sellers/payoutMethods", { payoutMethods: payoutMethod });
