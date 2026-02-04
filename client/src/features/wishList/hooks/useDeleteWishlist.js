import { deleteWishlist } from "../services/wishList.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useDeleteWishlist() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteWishlist,
		"wishlist",
		{ title: "Deleted Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "Products deleted from your wish list",
		}
	);
	return { error, data, deleteWishlist: mutate, isLoading };
}
