import useUpdateOrderGlobal from "../../../order/hooks/useUpdateOrder.js";
import { updateOrder as updateOrderService } from "../../services/admin.js";

/**
 * Hook to update an order (status, payment, etc.)
 */
export function useUpdateOrder() {
	const { updateOrder, isUpdating, error } = useUpdateOrderGlobal({
		updateFn: ({ id, data }) => updateOrderService(id, data),
		invalidateKeys: ["admin-orders"],
	});

	return {
		updateOrder,
		isUpdating,
		error,
	};
}
