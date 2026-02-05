import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastSuccess, ToastError } from "../ui/index.js";
import toast from "react-hot-toast";
export default function useMutationFactory(serviceFunc, keyName, err, success) {
	const queryClient = useQueryClient();

	const { error, isPending, mutate, data } = useMutation({
		mutationFn: serviceFunc,
		onSuccess: () => {
			// Update React Query cache
			queryClient.invalidateQueries({ queryKey: [keyName] });
			toast.success(<ToastSuccess successObj={success} />, { icon: null });
		},
		onError: () => {
			toast.error(<ToastError errorObj={err} />, { icon: null });
		},
	});

	return { error, isPending, isLoading: isPending, mutate, data: data?.data?.data };
}
