import useUpdateOrderGlobal from "../../../features/order/hooks/useUpdateOrder.js";
import { updateCustomerOrderStatus } from "../services/customerService.js";

/**
 * Hook to update order status (e.g. cancel order)
 */
export default function useUpdateOrder() {
	const { updateOrder, isUpdating, error } = useUpdateOrderGlobal({
		updateFn: ({ orderId, status }) => updateCustomerOrderStatus(orderId, status),
		invalidateKeys: ["orderHistory"]
	});

	return {
		updateOrder,
		isUpdating,
		error,
	};
}