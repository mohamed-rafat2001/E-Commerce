import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPercent, FiDollarSign, FiTruck, FiCalendar, FiTarget, FiTag } from 'react-icons/fi';
import { Button } from '../../../shared/ui/index.js';

const DISCOUNT_TYPES = [
	{ value: 'percentage', label: 'Percentage Off', icon: <FiPercent />, color: 'text-emerald-500' },
	{ value: 'fixed_amount', label: 'Fixed Amount Off', icon: <FiDollarSign />, color: 'text-blue-500' },
	{ value: 'free_shipping', label: 'Free Shipping', icon: <FiTruck />, color: 'text-purple-500' },
	{ value: 'shipping_discount', label: 'Shipping Discount', icon: <FiDollarSign />, color: 'text-orange-500' },
];

const SCOPE_OPTIONS_SELLER = [
	{ value: 'seller_all', label: 'All My Products' },
	{ value: 'single_product', label: 'Specific Products' },
];

const SCOPE_OPTIONS_ADMIN = [
	{ value: 'all_products', label: 'All Products (Platform-wide)' },
	{ value: 'category', label: 'Specific Categories' },
	{ value: 'seller_all', label: 'Specific Seller' },
	{ value: 'single_product', label: 'Specific Products' },
];

const defaultForm = {
	name: '',
	description: '',
	type: 'percentage',
	value: '',
	maxDiscountAmount: '',
	minOrderValue: '',
	scope: 'seller_all',
	targetIds: '',
	priority: '',
	startDate: '',
	endDate: '',
	isActive: true,
	usageLimit: '',
	isCoupon: false,
	code: '',
};

/**
 * Reusable modal for creating/editing discounts.
 * @param {string} role - 'Seller' or 'Admin' — controls which scopes are available.
 */
const DiscountFormModal = ({ isOpen, onClose, onSubmit, discount, role = 'Seller', isSubmitting }) => {
	const [form, setForm] = useState(defaultForm);
	const scopeOptions = role === 'Admin' ? SCOPE_OPTIONS_ADMIN : SCOPE_OPTIONS_SELLER;

	useEffect(() => {
		if (discount) {
			setForm({
				name: discount.name || '',
				description: discount.description || '',
				type: discount.type || 'percentage',
				value: discount.value ?? '',
				maxDiscountAmount: discount.maxDiscountAmount ?? '',
				minOrderValue: discount.minOrderValue ?? '',
				scope: discount.scope || (role === 'Admin' ? 'all_products' : 'seller_all'),
				targetIds: (discount.targetIds || []).join(', '),
				priority: discount.priority ?? '',
				startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
				endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : '',
				isActive: discount.isActive ?? true,
				usageLimit: discount.usageLimit ?? '',
				isCoupon: discount.isCoupon ?? false,
				code: discount.code || '',
			});
		} else {
			setForm({
				...defaultForm,
				scope: role === 'Admin' ? 'all_products' : 'seller_all',
			});
		}
	}, [discount, role]);

	const handleChange = (e) => {
		const { name, value, type: inputType, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: inputType === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			name: form.name,
			description: form.description || undefined,
			type: form.type,
			value: form.value ? Number(form.value) : 0,
			maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
			minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
			scope: form.scope,
			targetIds: form.targetIds
				? form.targetIds.split(',').map((id) => id.trim()).filter(Boolean)
				: [],
			priority: form.priority ? Number(form.priority) : undefined,
			startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
			endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
			isActive: form.isActive,
			usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
			isCoupon: form.isCoupon,
		};

		// Clean undefined values
		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		onSubmit(data, discount?._id);
	};

	const isValueRequired = form.type !== 'free_shipping';
	const needsTargetIds = ['category', 'single_product'].includes(form.scope);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			>
				<motion.div
					className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
					onClick={(e) => e.stopPropagation()}
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
				>
					{/* Header */}
					<div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between rounded-t-2xl">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
								<FiTag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
							</div>
							<h2 className="text-lg font-bold text-gray-900 dark:text-white">
								{discount ? 'Edit Discount' : 'Create Discount'}
							</h2>
						</div>
						<button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
							<FiX className="w-5 h-5 text-gray-500" />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="p-6 space-y-6">
						{/* Name */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
								Discount Name *
							</label>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								required
								placeholder="e.g., Summer Sale, Flash Friday"
								className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
								Description
							</label>
							<textarea
								name="description"
								value={form.description}
								onChange={handleChange}
								rows={2}
								placeholder="Customer-facing description..."
								className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
							/>
						</div>

						{/* Discount Method: Automatic vs Coupon */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
								Discount Method
							</label>
							<div className="flex gap-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="isCoupon"
										checked={!form.isCoupon}
										onChange={() => setForm(prev => ({ ...prev, isCoupon: false }))}
										className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Automatic</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="isCoupon"
										checked={form.isCoupon}
										onChange={() => setForm(prev => ({ ...prev, isCoupon: true }))}
										className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Coupon Code</span>
								</label>
							</div>
						</div>

						{/* Coupon Code Indicator */}
						{form.isCoupon && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20"
							>
								<div className="flex items-center gap-3">
									<FiTag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
									<div>
										<p className="text-sm font-bold text-gray-900 dark:text-white">Auto-generate Coupon Code</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">The system will generate a unique code based on the discount name after saving.</p>
									</div>
								</div>
							</motion.div>
						)}

						{/* Type Selection */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
								Discount Type *
							</label>
							<div className="grid grid-cols-2 gap-3">
								{DISCOUNT_TYPES.map((t) => (
									<label
										key={t.value}
										className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
											form.type === t.value
												? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
												: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
										}`}
									>
										<input
											type="radio"
											name="type"
											value={t.value}
											checked={form.type === t.value}
											onChange={handleChange}
											className="sr-only"
										/>
										<span className={`text-lg ${t.color}`}>{t.icon}</span>
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.label}</span>
									</label>
								))}
							</div>
						</div>

						{/* Value + Max Cap Row */}
						{isValueRequired && (
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
										Value * {form.type === 'percentage' ? '(%)' : '($)'}
									</label>
									<input
										name="value"
										type="number"
										min="0"
										max={form.type === 'percentage' ? '100' : undefined}
										step="any"
										value={form.value}
										onChange={handleChange}
										required
										placeholder={form.type === 'percentage' ? '15' : '25.00'}
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
									/>
								</div>
								{form.type === 'percentage' && (
									<div>
										<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
											Max Discount Cap ($)
										</label>
										<input
											name="maxDiscountAmount"
											type="number"
											min="0"
											step="any"
											value={form.maxDiscountAmount}
											onChange={handleChange}
											placeholder="50 (optional)"
											className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
										/>
									</div>
								)}
							</div>
						)}

						{/* Min Order Value */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
								Minimum Order Value ($)
							</label>
							<input
								name="minOrderValue"
								type="number"
								min="0"
								step="any"
								value={form.minOrderValue}
								onChange={handleChange}
								placeholder="0 (no minimum)"
								className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
							/>
						</div>

						{/* Scope */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
								<FiTarget className="inline mr-1" /> Apply To *
							</label>
							<select
								name="scope"
								value={form.scope}
								onChange={handleChange}
								className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
							>
								{scopeOptions.map((s) => (
									<option key={s.value} value={s.value}>
										{s.label}
									</option>
								))}
							</select>
						</div>

						{/* Target IDs (only for category or single_product) */}
						{needsTargetIds && (
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
									Target IDs (comma-separated)
								</label>
								<input
									name="targetIds"
									value={form.targetIds}
									onChange={handleChange}
									placeholder="product_id_1, product_id_2"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
								/>
								<p className="text-xs text-gray-400 mt-1">
									{form.scope === 'category' ? 'Enter Category IDs' : 'Enter Product IDs'}
								</p>
							</div>
						)}

						{/* Date Range */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
									<FiCalendar className="inline mr-1" /> Start Date *
								</label>
								<input
									name="startDate"
									type="datetime-local"
									value={form.startDate}
									onChange={handleChange}
									required
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
									<FiCalendar className="inline mr-1" /> End Date *
								</label>
								<input
									name="endDate"
									type="datetime-local"
									value={form.endDate}
									onChange={handleChange}
									required
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
								/>
							</div>
						</div>

						{/* Priority + Usage Limit */}
						<div className="grid grid-cols-2 gap-4">
							{role === 'Admin' && (
								<div>
									<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
										Priority
									</label>
									<input
										name="priority"
										type="number"
										min="0"
										max="1000"
										value={form.priority}
										onChange={handleChange}
										placeholder="100 (default for Admin)"
										className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
									/>
								</div>
							)}
							<div>
								<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
									Usage Limit
								</label>
								<input
									name="usageLimit"
									type="number"
									min="0"
									value={form.usageLimit}
									onChange={handleChange}
									placeholder="Unlimited"
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
								/>
							</div>
						</div>

						{/* Active Toggle */}
						<label className="flex items-center gap-3 cursor-pointer">
							<input
								name="isActive"
								type="checkbox"
								checked={form.isActive}
								onChange={handleChange}
								className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Active immediately
							</span>
						</label>

						{/* Footer */}
						<div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
							<Button variant="ghost" onClick={onClose} type="button">
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting
									? 'Saving...'
									: discount
									? 'Update Discount'
									: 'Create Discount'}
							</Button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default DiscountFormModal;
