import { getFunc, updateFunc, deleteFunc } from "../../../shared/services/handlerFactory.js";

// Get customer profile
export const getCustomerProfileFunc = () => getFunc("customers/profile");

// Add address
export const addAddressFunc = (addressData) => updateFunc("customers/addresses", { addresses: addressData });

// Update address
export const updateAddressFunc = ({ addressId, addressData }) => updateFunc(`customers/addresses/${addressId}`, addressData);

// Delete address
export const deleteAddressFunc = (addressId) => deleteFunc(`customers/addresses/${addressId}`);

// Set default address
export const setDefaultAddressFunc = (addressId) => updateFunc(`customers/addresses/${addressId}/default`);
