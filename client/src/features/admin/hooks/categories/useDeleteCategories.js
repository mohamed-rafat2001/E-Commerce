import { deleteCategories } from "../../services/category.js";
import useMutationFactory from "../../../../shared/hooks/useMutationFactory.jsx";
export default function useDeleteCategories() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteCategories,
		"categories",
		{ title: "Delete Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "All categories deleted ",
		}
	);
	return { error, data, deleteCategories: mutate, isLoading };
}
