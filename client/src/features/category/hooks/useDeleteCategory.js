import { deleteCategory } from "../../../services/category.js";
import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
export default function useDeleteCategory() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteCategory,
		"categories",
		{ title: "Delete Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "category deleted from your categories",
		}
	);
	return { error, data, deleteCategory: mutate, isLoading };
}
