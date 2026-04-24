export const calculateOrderTotals = (cartItems) => {
	const subtotal = cartItems.reduce((acc, item) => {
		const product = item.item || item.itemId || item.productId || item;
		const price = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
		return acc + (price * (item.quantity || 1));
	}, 0);

	const discountAmount = 0;
	const taxableAmount = subtotal - discountAmount;
	const tax = taxableAmount * 0.08;
	const shipping = subtotal === 0 ? 0 : (subtotal > 500 ? 0 : 25);
	const total = taxableAmount + tax + shipping;

	return { subtotal, discountAmount, tax, shipping, total };
};
