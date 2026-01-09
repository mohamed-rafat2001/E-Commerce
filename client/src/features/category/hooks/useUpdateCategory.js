import { updateCategory } from "../../../services/category.js";
import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
export default function useUpdateCategory() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		updateCategory,
		"categories",
		{ title: "Updated Failed", message: "Something wrong,please try again" },
		{
			title: "Updated Successful",
			message: "Category updated ",
		}
	);
	return { error, data, updateCategory: mutate, isLoading };
}
