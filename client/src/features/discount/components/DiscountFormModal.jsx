import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { discountSchema } from '../../../shared/validation/schemas.js';
import { Modal, Button, Input, Select, Checkbox } from '../../../shared/ui/index.js';
import { FiTag, FiPercent, FiCalendar, FiTarget, FiHash, FiClock, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import useCategories from '../../admin/hooks/categories/useCategories.js';
import useProducts from '../../product/hooks/useProducts.js';

const typeOptions = [
	{ value: 'percentage', label: 'Percentage (%)' },
	{ value: 'fixed_amount', label: 'Fixed Amount ($)' },
	{ value: 'free_shipping', label: 'Free Shipping' },
	{ value: 'shipping_discount', label: 'Shipping Discount' },
];

const scopeOptions = [
	{ value: 'all_products', label: 'All Products' },
	{ value: 'category', label: 'Specific Category' },
	{ value: 'seller_all', label: 'All My Products' },
	{ value: 'single_product', label: 'Single Product' },
];

const DiscountFormModal = ({ isOpen, onClose, discount, onSubmit, isLoading }) => {
	const isEdit = !!discount;
	const { categories } = useCategories();
	const { products } = useProducts({ enabled: isOpen });

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(discountSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			type: 'percentage',
			value: '',
			maxDiscountAmount: '',
			minOrderValue: '',
			scope: 'all_products',
			targetIds: '',
			priority: 1,
			startDate: '',
			endDate: '',
			isActive: true,
			usageLimit: '',
			isCoupon: false,
			code: '',
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (discount) {
				reset({
					name: discount.name || '',
					description: discount.description || '',
					type: discount.type || 'percentage',
					value: discount.value || '',
					maxDiscountAmount: discount.maxDiscountAmount || '',
					minOrderValue: discount.minOrderValue || '',
					scope: discount.scope || 'all_products',
					targetIds: Array.isArray(discount.targetIds) ? discount.targetIds.join(',') : (discount.targetIds || ''),
					priority: discount.priority || 1,
					startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
					endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
					isActive: discount.isActive ?? true,
					usageLimit: discount.usageLimit || '',
					isCoupon: discount.isCoupon || false,
					code: discount.code || '',
				});
			} else {
				reset({
					name: '',
					description: '',
					type: 'percentage',
					value: '',
					maxDiscountAmount: '',
					minOrderValue: '',
					scope: 'all_products',
					targetIds: '',
					priority: 1,
					startDate: '',
					endDate: '',
					isActive: true,
					usageLimit: '',
					isCoupon: false,
					code: '',
				});
			}
		}
	}, [isOpen, discount, reset]);

	const selectedType = watch('type');
	const selectedScope = watch('scope');
	const isCoupon = watch('isCoupon');

	const onInternalSubmit = (data) => {
		// Convert targetIds back to array if needed for some scopes
		const processedData = {
			...data,
			targetIds: data.targetIds ? data.targetIds.split(',').map(id => id.trim()) : []
		};
		onSubmit(processedData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEdit ? 'Edit Discount Strategy' : 'Create New Discount'}
			size="xl"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-8">
				{/* Basic Info Section */}
				<section className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
					<div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
						<FiTag className="w-5 h-5" />
						<h3 className="font-bold uppercase tracking-wider text-sm">Basic Information</h3>
					</div>
					<div className="space-y-5">
						<Input
							label="Discount Name"
							placeholder="e.g. Summer Super Sale"
							{...register('name')}
							error={errors.name?.message}
							disabled={isLoading}
						/>
						<div>
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
							<textarea
								className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none min-h-[80px] resize-none
									${errors.description ? 'border-red-500 bg-red-50/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500'}
								`}
								placeholder="What is this discount about?"
								{...register('description')}
								disabled={isLoading}
							/>
							{errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
						</div>
					</div>
				</section>

				{/* Configuration SECTION */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Type & Value */}
					<section className="space-y-4">
						<div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
							<FiPercent className="w-5 h-5" />
							<h3 className="font-bold uppercase tracking-wider text-sm">Rules & Value</h3>
						</div>
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Select label="Discount Type" options={typeOptions} {...field} disabled={isLoading} />
							)}
						/>
						{selectedType !== 'free_shipping' && (
							<Input
								label={selectedType === 'percentage' ? 'Percentage Value (%)' : 'Fixed Amount ($)'}
								type="number"
								placeholder="0.00"
								{...register('value')}
								error={errors.value?.message}
								disabled={isLoading}
							/>
						)}
						{selectedType === 'percentage' && (
							<Input
								label="Max Discount Amount (Optional)"
								type="number"
								placeholder="Limit the discount"
								{...register('maxDiscountAmount')}
								error={errors.maxDiscountAmount?.message}
								disabled={isLoading}
							/>
						)}
						<Input
							label="Min Order Value ($)"
							type="number"
							placeholder="0.00"
							{...register('minOrderValue')}
							error={errors.minOrderValue?.message}
							disabled={isLoading}
						/>
					</section>

					{/* Target & Scope */}
					<section className="space-y-4">
						<div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
							<FiTarget className="w-5 h-5" />
							<h3 className="font-bold uppercase tracking-wider text-sm">Target Scope</h3>
						</div>
						<Controller
							name="scope"
							control={control}
							render={({ field }) => (
								<Select label="Applies To" options={scopeOptions} {...field} disabled={isLoading} />
							)}
						/>
						
						{selectedScope === 'category' && (
							<Controller
								name="targetIds"
								control={control}
								render={({ field }) => (
									<Select
										label="Select Category"
										options={categories.map(c => ({ value: c._id, label: c.name }))}
										{...field}
										disabled={isLoading}
									/>
								)}
							/>
						)}

						{selectedScope === 'single_product' && (
							<Controller
								name="targetIds"
								control={control}
								render={({ field }) => (
									<Select
										label="Select Product"
										options={products.map(p => ({ value: p._id, label: p.name }))}
										{...field}
										disabled={isLoading}
									/>
								)}
							/>
						)}

						<Input
							label="Priority (0-1000)"
							type="number"
							placeholder="e.g. 10"
							{...register('priority')}
							error={errors.priority?.message}
							disabled={isLoading}
						/>
					</section>
				</div>

				{/* Coupon Section */}
				<section className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
							<FiHash className="w-5 h-5" />
							<h3 className="font-bold uppercase tracking-wider text-sm">Coupon Configuration</h3>
						</div>
						<Controller
							name="isCoupon"
							control={control}
							render={({ field }) => (
								<Checkbox
									label="Is Coupon?"
									checked={field.value}
									onChange={field.onChange}
									disabled={isLoading}
								/>
							)}
						/>
					</div>
					
					{isCoupon && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
							<Input
								label="Promo Code"
								placeholder="e.g. SAVE20"
								{...register('code')}
								error={errors.code?.message}
								disabled={isLoading}
							/>
							<Input
								label="Usage Limit (Optional)"
								type="number"
								placeholder="e.g. 500 redemptions"
								{...register('usageLimit')}
								error={errors.usageLimit?.message}
								disabled={isLoading}
							/>
						</div>
					)}
				</section>

				{/* Validity Section */}
				<section className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
					<div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
						<FiCalendar className="w-5 h-5" />
						<h3 className="font-bold uppercase tracking-wider text-sm">Execution Period</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<Input
							label="Start Date"
							type="date"
							{...register('startDate')}
							error={errors.startDate?.message}
							disabled={isLoading}
						/>
						<Input
							label="End Date"
							type="date"
							{...register('endDate')}
							error={errors.endDate?.message}
							disabled={isLoading}
						/>
					</div>
				</section>

				{/* Final Controls */}
				<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<FiClock className="text-gray-400 w-5 h-5" />
						<div>
							<p className="font-bold text-gray-900 dark:text-gray-100">Instantly Activate</p>
							<p className="text-xs text-gray-500">Enable this discount now.</p>
						</div>
					</div>
					<Controller
						name="isActive"
						control={control}
						render={({ field }) => (
							<Checkbox
								checked={field.value}
								onChange={field.onChange}
								disabled={isLoading}
							/>
						)}
					/>
				</div>

				<div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t border-gray-100 dark:border-gray-700 z-10">
					<Button
						type="button"
						variant="ghost"
						fullWidth
						onClick={onClose}
						disabled={isLoading}
					>
						<FiX className="mr-2" /> Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						fullWidth
						isLoading={isLoading}
					>
						<FiCheck className="mr-2" />
						{isEdit ? 'Update Strategy' : 'Create Discount'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default DiscountFormModal;
