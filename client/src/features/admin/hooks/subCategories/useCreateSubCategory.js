import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubCategory } from "../../services/subCategory.js";
import { toast } from "react-hot-toast";

export default function useCreateSubCategory() {
	const [uploadProgress, setUploadProgress] = useState(0);
	const queryClient = useQueryClient();

	const { mutate, isPending: isLoading, error, data } = useMutation({
		mutationFn: (subCategoryData) => {
			setUploadProgress(0);
			return addSubCategory(subCategoryData, (progress) => {
				setUploadProgress(progress);
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subcategories"] });
			toast.success("Subcategory added successfully");
			setUploadProgress(0);
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Something went wrong, please try again");
			setUploadProgress(0);
		},
	});
	
	return { error, data, addSubCategory: mutate, isLoading, uploadProgress };
}