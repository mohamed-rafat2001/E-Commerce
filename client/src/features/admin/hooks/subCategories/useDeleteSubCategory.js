import { deleteSubCategory } from "../../services/subCategory.js";
import useMutationFactory from "../../../../shared/hooks/useMutationFactory.jsx";

export default function useDeleteSubCategory() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteSubCategory,
		"subcategories",
		{ title: "Delete Failed", message: "Something went wrong, please try again" },
		{ title: "Deleted Successfully", message: "Subcategory deleted successfully" }
	);
	
	return { error, data, removeSubCategory: mutate, isLoading };
}