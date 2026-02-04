import { updateFunc } from "../../../shared/services/handlerFactory.js";

// add addresses to customer
export const addAdressesToCustomer = (addresses) =>
	updateFunc("customers/addresses", addresses);
