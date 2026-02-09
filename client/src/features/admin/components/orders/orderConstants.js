import { FiClock, FiPackage, FiTruck, FiCheck, FiXCircle } from 'react-icons/fi';

export const statusConfig = {
	Pending: { color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', icon: FiClock, label: 'Pending' },
	Processing: { color: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500', icon: FiPackage, label: 'Processing' },
	Shipped: { color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500', icon: FiTruck, label: 'Shipped' },
	Delivered: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500', icon: FiCheck, label: 'Delivered' },
	Cancelled: { color: 'bg-rose-50 text-rose-600 border-rose-100', dot: 'bg-rose-500', icon: FiXCircle, label: 'Cancelled' },
};

export const statusOptions = [
	{ value: 'Pending', label: 'Pending' },
	{ value: 'Processing', label: 'Processing' },
	{ value: 'Shipped', label: 'Shipped' },
	{ value: 'Delivered', label: 'Delivered' },
	{ value: 'Cancelled', label: 'Cancelled' },
];

export const allowedTransitions = {
	Pending: ['Processing', 'Cancelled'],
	Processing: ['Shipped', 'Cancelled'],
	Shipped: ['Delivered'],
	Delivered: [],
	Cancelled: [],
};

export const paymentMethodLabels = {
	card: 'Credit Card',
	paypal: 'PayPal',
	bank_transfer: 'Bank Transfer',
	cash_on_delivery: 'Cash on Delivery',
	wallet: 'Wallet',
};

export const ITEMS_PER_PAGE = 10;
