import { deleteFromWishlist } from "../../../services/wishList.js";
import useMutationFactory from "../../../hooks/useMutationFactory.jsx";
export default function useDeleteFromWishlist() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteFromWishlist,
		"wishlist",
		{ title: "Deleted Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "Product deleted from your wish list",
		}
	);
	return { error, data, deleteFromWishlist: mutate, isLoading };
}
