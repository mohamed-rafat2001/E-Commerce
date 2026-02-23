import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubCategory } from "../../services/subCategory.js";
import { toast } from "react-hot-toast";

export default function useUpdateSubCategory() {
	const [uploadProgress, setUploadProgress] = useState(0);
	const queryClient = useQueryClient();

	const { mutate, isPending: isLoading, error, data } = useMutation({
		mutationFn: ({ id, data }) => {
			setUploadProgress(0);
			return updateSubCategory({ id, data }, (progress) => {
				setUploadProgress(progress);
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subcategories"] });
			toast.success("Subcategory updated successfully");
			setUploadProgress(0);
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Something went wrong, please try again");
			setUploadProgress(0);
		},
	});
	
	return { error, data, updateSubCategory: mutate, isLoading, uploadProgress };
}