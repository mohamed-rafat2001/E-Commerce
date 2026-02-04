import { addCategory } from "../services/category.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useAddCategory() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		addCategory,
		"categories",
		{ title: "Addd Failed", message: "Something wrong,please try again" },
		{ title: "Added Successful", message: "Category added to your categories" }
	);
	return { error, data, addCategory: mutate, isLoading };
}
