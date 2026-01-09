import { updateFunc } from "./handlerFactory";

// add addresses to customer
export const addAdressesToCustomer = (addresses) =>
	updateFunc("customers/addresses", addresses);
