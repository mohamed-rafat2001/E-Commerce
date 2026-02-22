import { useQuery } from "@tanstack/react-query";
import { getAdminData } from "../services/admin";

const useUserOrders = (userId, page = 1, limit = 5) => {
  const populateQuery = JSON.stringify({
    path: 'items',
    populate: { path: 'items.item' }
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "orders", userId, page, limit],
    queryFn: () => getAdminData(`orders?userId=${userId}&page=${page}&limit=${limit}&populate=${encodeURIComponent(populateQuery)}`),
    enabled: !!userId,
    keepPreviousData: true,
  });

  const orders = (data?.data?.data || []).map(order => {
    // Calculate total items count across all OrderItems (sellers)
    const itemsCount = order.items?.reduce((acc, orderItem) => {
      return acc + (orderItem.items?.length || 0);
    }, 0) || 0;

    return {
      id: order._id,
      date: order.createdAt,
      total: order.totalPrice?.amount || 0,
      status: order.status,
      itemsCount: itemsCount,
      orderItems: order.items || [] 
    };
  }) || [];

  // Aggregate purchased products from all orders
  const purchasedProducts = [];
  orders.forEach(order => {
    if (order.orderItems && Array.isArray(order.orderItems)) {
      order.orderItems.forEach(orderItemDoc => {
        if (orderItemDoc.items && Array.isArray(orderItemDoc.items)) {
          orderItemDoc.items.forEach(itemObj => {
            if (itemObj.item) {
              purchasedProducts.push({
                id: itemObj.item._id || itemObj._id, // fallback
                name: itemObj.item.name || 'Unknown Product',
                price: itemObj.price?.amount || 0,
                quantity: itemObj.quantity,
                order: order.id, // Renamed to 'order' to match usage in PurchaseHistory
                image: itemObj.item.coverImage
              });
            }
          });
        }
      });
    }
  });

  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    orders,
    purchasedProducts,
    isLoading,
    isError,
    error,
    total,
    totalPages,
    page
  };
};

export default useUserOrders;