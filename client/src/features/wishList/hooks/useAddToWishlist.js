import { addToWishlist } from "../services/wishList.js";
import useMutationFactory from "../../../shared/hooks/useMutationFactory.jsx";
export default function useAddToWishlist() {
	const { error, data, mutate, isLoading } = useMutationFactory(
		addToWishlist,
		"wishlist",
		{ title: "Addd Failed", message: "Something wrong,please try again" },
		{ title: "Added Successful", message: "Product added to your wish list" }
	);
	return { error, data, addToWishlist: mutate, isLoading };
}
