import { 
    getOrdersForCustomer as getOrdersForCustomerService,
    getOrderForCustomer as getOrderForCustomerService,
    updateCustomerOrderStatus as updateCustomerOrderStatusService
} from "../../order/services/order.js";

export const getOrdersForCustomer = () => getOrdersForCustomerService();
export const getOrderForCustomer = (id) => getOrderForCustomerService(id);
export const updateCustomerOrderStatus = (id, status) => updateCustomerOrderStatusService(id, status);
