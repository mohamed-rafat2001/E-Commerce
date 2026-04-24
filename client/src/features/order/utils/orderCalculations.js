export const calculateOrderTotals = (cartItems) => {
	let subtotal = 0;
	let totalSavings = 0;
	let hasFreeShipping = false;
	let shippingDiscountAmount = 0;

	cartItems.forEach((item) => {
		const product = item.item || item.itemId || item.productId || item;
		const quantity = item.quantity || 1;
		
		// Base price
		const basePrice = typeof product.price === 'object' ? product.price.amount : (product.price || item.price || 0);
		subtotal += basePrice * quantity;

		// Check active discounts for price reduction
		if (product.activeDiscount) {
			totalSavings += product.activeDiscount.savings * quantity;
		}

		// Check shipping discounts
		if (product.shippingDiscount) {
			if (product.shippingDiscount.type === 'free_shipping') {
				hasFreeShipping = true;
			} else if (product.shippingDiscount.type === 'shipping_discount') {
				// Pick the best shipping discount across all items
				shippingDiscountAmount = Math.max(shippingDiscountAmount, product.shippingDiscount.value);
			}
		}
	});

	const discountAmount = totalSavings;
	const taxableAmount = Math.max(0, subtotal - discountAmount);
	const tax = taxableAmount * 0.08;
	
	// Shipping calculation
	let shipping = subtotal === 0 ? 0 : (subtotal > 500 ? 0 : 25);
	if (hasFreeShipping) {
		shipping = 0;
	} else if (shipping > 0) {
		shipping = Math.max(0, shipping - shippingDiscountAmount);
	}

	const total = taxableAmount + tax + shipping;

	return { subtotal, discountAmount, tax, shipping, total };
};
