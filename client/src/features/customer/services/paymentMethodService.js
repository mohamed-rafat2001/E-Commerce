import { updateFunc, deleteFunc } from "../../../shared/services/handlerFactory.js";

// Add payment method
export const addPaymentMethodFunc = (paymentMethodData) => updateFunc("customers/payment-methods", { paymentMethod: paymentMethodData });

// Delete payment method
export const deletePaymentMethodFunc = (paymentMethodId) => deleteFunc(`customers/payment-methods/${paymentMethodId}`);

// Set default payment method
export const setDefaultPaymentMethodFunc = (paymentMethodId) => updateFunc(`customers/payment-methods/${paymentMethodId}/default`);

// Update payment method
export const updatePaymentMethodFunc = ({ paymentMethodId, paymentMethodData }) => 
    updateFunc(`customers/payment-methods/${paymentMethodId}`, paymentMethodData);
