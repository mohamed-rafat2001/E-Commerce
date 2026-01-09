import { deleteCart } from "../../../services/cart.js";
import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
export default function useDeleteCart() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteCart,
		"cart",
		{ title: "delete Failed", message: "Something wrong,please try again" },
		{ title: "deleted Successful", message: "Products deleted from your cart" }
	);
	return { error, data, deleteCart: mutate, isLoading };
}
