import { updateSubCategory } from "../services/subCategory.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";

export default function useUpdateSubCategory() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		updateSubCategory,
		"subcategories",
		{ title: "Update Failed", message: "Something went wrong, please try again" },
		{ title: "Updated Successfully", message: "Subcategory updated successfully" }
	);
	
	return { error, data, updateSubCategory: mutate, isLoading };
}