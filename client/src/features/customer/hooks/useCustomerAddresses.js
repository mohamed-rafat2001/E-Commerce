import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import { addAddressFunc, updateAddressFunc, deleteAddressFunc, setDefaultAddressFunc } from "../services/customerService.js";

/**
 * Hook for customer address operations
 */
export default function useCustomerAddresses() {
	// Add address
	const {
		mutate: addAddress,
		isLoading: isAdding,
		error: addError,
	} = useMutationFactory(
		addAddressFunc,
		"customerProfile",
		{ title: "Failed to add address", message: "Please try again later." },
		{ title: "Address added", message: "Shipping address has been added successfully." }
	);

	// Update address
	const {
		mutate: updateAddress,
		isLoading: isUpdating,
		error: updateError,
	} = useMutationFactory(
		updateAddressFunc,
		"customerProfile",
		{ title: "Failed to update address", message: "Please try again later." },
		{ title: "Address updated", message: "Shipping address has been updated successfully." }
	);

	// Delete address
	const {
		mutate: deleteAddress,
		isLoading: isDeleting,
		error: deleteError,
	} = useMutationFactory(
		deleteAddressFunc,
		"customerProfile",
		{ title: "Failed to delete address", message: "Please try again later." },
		{ title: "Address deleted", message: "Shipping address has been removed." }
	);

	// Set default address
	const {
		mutate: setDefaultAddress,
		isLoading: isSettingDefault,
		error: defaultError,
	} = useMutationFactory(
		setDefaultAddressFunc,
		"customerProfile",
		{ title: "Failed to set default", message: "Please try again later." },
		{ title: "Default set", message: "Default shipping address has been updated." }
	);

	return {
		addAddress,
		isAdding,
		addError,
		updateAddress,
		isUpdating,
		updateError,
		deleteAddress,
		isDeleting,
		deleteError,
		setDefaultAddress,
		isSettingDefault,
		defaultError,
	};
}
