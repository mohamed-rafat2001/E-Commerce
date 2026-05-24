import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema } from '../../../../shared/validation/schemas.js';
import { Modal, Button, Input, Select, Skeleton } from '../../../../shared/ui/index.js';
import { FiCheck, FiX, FiMail, FiPhone, FiGlobe, FiBriefcase, FiTag } from 'react-icons/fi';
import useCategories from '../../../admin/hooks/categories/useCategories.js';
import useSubCategories from '../../../admin/hooks/categories/useSubCategories.js';

const BrandFormModal = ({ isOpen, onClose, brand, onSubmit, isLoading }) => {
	const isEdit = !!brand;
	const { categories, isLoading: catsLoading } = useCategories();

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(brandSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			businessEmail: '',
			businessPhone: '',
			website: '',
			primaryCategory: '',
			subCategories: [],
		},
	});

	const selectedPrimaryId = watch('primaryCategory');
	const { subCategories, isLoading: subsLoading } = useSubCategories(selectedPrimaryId);

	useEffect(() => {
		if (isOpen) {
			if (brand) {
				reset({
					name: brand.name || '',
					description: brand.description || '',
					businessEmail: brand.businessEmail || '',
					businessPhone: brand.businessPhone || '',
					website: brand.website || '',
					primaryCategory: brand.primaryCategory?._id || brand.primaryCategory || '',
					subCategories: (brand.subCategories || []).map((s) => s._id || s),
				});
			} else {
				reset({
					name: '',
					description: '',
					businessEmail: '',
					businessPhone: '',
					website: '',
					primaryCategory: '',
					subCategories: [],
				});
			}
		}
	}, [isOpen, brand, reset]);

	const onInternalSubmit = (data) => {
		onSubmit(data);
	};

	const handleCategoryChange = (val) => {
		setValue('primaryCategory', val);
		setValue('subCategories', []);
	};

	const toggleSubCategory = (subId) => {
		const current = watch('subCategories') || [];
		if (current.includes(subId)) {
			setValue('subCategories', current.filter((id) => id !== subId));
		} else {
			setValue('subCategories', [...current, subId]);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEdit ? 'Edit Brand Profile' : 'Register New Brand'}
			size="lg"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6">
				{/* Basic Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="md:col-span-2">
						<Input
							label="Brand Name"
							placeholder="Your brand name"
							icon={<FiBriefcase />}
							{...register('name')}
							error={errors.name?.message}
							disabled={isLoading}
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Brand Description
						</label>
						<textarea
							className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none min-h-[100px] resize-none
								${errors.description ? 'border-red-500 bg-red-50/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500 shadow-sm'}
							`}
							placeholder="Tell us about your brand..."
							{...register('description')}
							disabled={isLoading}
						/>
						{errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
					</div>
				</div>

				<div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

				{/* Contact Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<Input
						label="Business Email"
						type="email"
						placeholder="contact@brand.com"
						icon={<FiMail />}
						{...register('businessEmail')}
						error={errors.businessEmail?.message}
						disabled={isLoading}
					/>
					<Input
						label="Business Phone"
						placeholder="+20 123 456 7890"
						icon={<FiPhone />}
						{...register('businessPhone')}
						error={errors.businessPhone?.message}
						disabled={isLoading}
					/>
					<div className="md:col-span-2">
						<Input
							label="Website (Optional)"
							placeholder="https://www.brand.com"
							icon={<FiGlobe />}
							{...register('website')}
							error={errors.website?.message}
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

				{/* Categories */}
				<div className="space-y-4">
					<div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
						<FiTag className="w-4 h-4" />
						<h4 className="text-sm font-bold uppercase tracking-wider">Brand Categorization</h4>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<Controller
							name="primaryCategory"
							control={control}
							render={({ field }) => (
								<Select
									label="Primary Category"
									options={[{ value: '', label: 'Select Category' }, ...categories.map(c => ({ value: c._id, label: c.name }))]}
									{...field}
									onChange={(e) => {
										field.onChange(e);
										handleCategoryChange(e.target.value);
									}}
									isLoading={catsLoading}
									disabled={isLoading}
								/>
							)}
						/>
					</div>

					{selectedPrimaryId && (
						<div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
							<p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sub-Categories Selection</p>
							{subsLoading ? (
								<div className="flex gap-2 flex-wrap">
									<Skeleton className="w-24 h-8 rounded-full" count={4} />
								</div>
							) : (
								<div className="flex flex-wrap gap-2">
									{subCategories.length > 0 ? (
										subCategories.map(sub => {
											const isSelected = (watch('subCategories') || []).includes(sub._id);
											return (
												<button
													key={sub._id}
													type="button"
													onClick={() => toggleSubCategory(sub._id)}
													disabled={isLoading}
													className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
														${isSelected
															? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
															: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
														}`}
												>
													{sub.name}
												</button>
											);
										})
									) : (
										<p className="text-xs text-gray-500 italic">No sub-categories available for this selection.</p>
									)}
								</div>
							)}
						</div>
					)}
				</div>

				<div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
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
						{isEdit ? 'Update Brand' : 'Register Brand'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default BrandFormModal;
