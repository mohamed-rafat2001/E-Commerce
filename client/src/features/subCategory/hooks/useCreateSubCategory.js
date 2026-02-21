import { addSubCategory } from "../services/subCategory.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";

export default function useCreateSubCategory() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		addSubCategory,
		"subcategories",
		{ title: "Create Failed", message: "Something went wrong, please try again" },
		{ title: "Created Successfully", message: "Subcategory added successfully" }
	);
	
	return { error, data, addSubCategory: mutate, isLoading };
}