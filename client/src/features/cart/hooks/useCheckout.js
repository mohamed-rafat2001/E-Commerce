import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutOrder } from "../../order/services/order.js";
import toast from "react-hot-toast";
import { ToastSuccess, ToastError } from "../../../shared/ui/index.js";

/**
 * Hook for placing an order from cart (checkout).
 */
export default function useCheckout() {
    const queryClient = useQueryClient();

    const {
        mutate: checkout,
        isPending: isCheckingOut,
        error,
        data,
    } = useMutation({
        mutationFn: checkoutOrder,
        onSuccess: (data) => {
            // Invalidate cart and orders queries
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            const orderCount = data?.data?.results || 1;

            toast.success(
                <ToastSuccess
                    successObj={{
                        title: "Order Placed!",
                        message: `${orderCount} order${orderCount > 1 ? "s" : ""} created successfully.`,
                    }}
                />,
                { icon: null }
            );
        },
        onError: (err) => {
            toast.error(
                <ToastError
                    errorObj={{
                        title: "Checkout Failed",
                        message:
                            err.response?.data?.message ||
                            "Something went wrong during checkout. Please try again.",
                    }}
                />,
                { icon: null }
            );
        },
    });

    return {
        checkout,
        isCheckingOut,
        error,
        orders: data?.data?.data,
    };
}
