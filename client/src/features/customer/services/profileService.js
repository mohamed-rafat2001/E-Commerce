import { getFunc } from "../../../shared/services/handlerFactory.js";

// Get customer profile
export const getCustomerProfileFunc = () => getFunc("customers/profile");
