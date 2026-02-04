import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastSuccess, ToastError } from "../ui/index.js";
import toast from "react-hot-toast";
export default function useMutationFactory(serviceFunc, keyName, err, success) {
	const queryClient = useQueryClient();

	const { error, isLoading, mutate, data } = useMutation({
		mutationFn: serviceFunc,
		onSuccess: () => {
			// Update React Query cache
			queryClient.invalidateQueries({ queryKey: [keyName] });
			toast.success(<ToastSuccess successObj={success} />);
		},
		onError: () => {
			toast.error(<ToastError errorObj={err} />);
		},
	});

	return { error, isLoading, mutate, data: data?.data?.data };
}
