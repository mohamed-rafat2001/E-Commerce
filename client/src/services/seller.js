import { updateFunc } from "./handlerFactory";

// add addresses to seller
export const addAdressesToSeller = (addresses) =>
	updateFunc("sellers/addresses", addresses);

// add payment method to seller
export const addPaymentMethodToSeller = (payoutMethods) =>
	updateFunc("sellers/payoutMethods", payoutMethods);

// complete seller info
export const completeSellerInfo = (data) => updateFunc("sellers", data);
