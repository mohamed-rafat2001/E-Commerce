import { updatePersonalDetails } from "../../../services/auth.js";

import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
/**
 * Update user hook
 */
export default function useUpdateUser() {
	// use mutaion factory
	const { error, isLoading, mutate, data } = useMutationFactory(
		updatePersonalDetails,
		"user",
		{ title: "Updated Failed.", message: "Please try again later." },
		{ title: "Updated successful.", message: "Updates successfuly updated." }
	);

	return { error, isLoading, updateDetails: mutate, data };
}
