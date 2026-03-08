import { deleteFromWishlist } from "../services/wishList.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
import useWishlist from "./useWishlist.js";

export default function useDeleteFromWishlist() {
	const { refreshWishlist } = useWishlist();
	
	const { error, data, mutate, isLoading } = useMutationFactory(
		deleteFromWishlist,
		"wishlist",
		{ title: "Deleted Failed", message: "Something wrong,please try again" },
		{
			title: "Deleted Successful",
			message: "Product deleted from your wish list",
		},
		{
			onSuccess: () => {
				// Refresh wishlist after successful delete
				refreshWishlist();
			}
		}
	);
	return { error, data, deleteFromWishlist: mutate, isLoading };
}
