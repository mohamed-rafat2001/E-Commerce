import { FiUser, FiShoppingBag, FiShield, FiLock } from 'react-icons/fi';

export const roleConfig = {
	Customer: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: FiUser, label: 'Customer' },
	Seller: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: FiShoppingBag, label: 'Seller' },
	Admin: { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: FiShield, label: 'Admin' },
	SuperAdmin: { color: 'bg-purple-50 text-purple-600 border-purple-100', icon: FiLock, label: 'Super Admin' },
};

export const roleOptions = [
	{ value: 'Customer', label: 'Customer' },
	{ value: 'Seller', label: 'Seller' },
	{ value: 'Admin', label: 'Admin' },
];

export const statusOptions = [
	{ value: 'active', label: 'Active' },
	{ value: 'suspended', label: 'Suspended' },
];

export const ITEMS_PER_PAGE = 10;
