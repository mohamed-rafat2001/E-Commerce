import useUpdateOrder from "../../../order/hooks/useUpdateOrder.js";
import { updateSellerOrderStatus } from "../../../order/services/order.js";

/**
 * Hook to update order status from seller panel
 */
export default function useUpdateOrderStatus() {
	const { updateOrder, isUpdating, error } = useUpdateOrder({
		updateFn: ({ orderId, status }) => updateSellerOrderStatus(orderId, status),
		invalidateKeys: ["seller-orders", "sellerDashboardStats"]
	});

	return {
		updateOrderStatus: updateOrder,
		isUpdating,
		error,
	};
}
