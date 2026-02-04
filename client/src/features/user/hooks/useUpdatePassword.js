import { updatePassword } from "../../auth/services/auth.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";

/**
 * Update password mutation hook
 */
export default function useUpdatePassword() {
	const { error, isLoading, mutate, data } = useMutationFactory(
		updatePassword,
		"user",
		{ title: "Updated Failed.", message: "Please try again later." },
		{ title: "Updated successful.", message: "password successfuly updated." }
	);

	return { error, isLoading, updatePass: mutate, data };
}
