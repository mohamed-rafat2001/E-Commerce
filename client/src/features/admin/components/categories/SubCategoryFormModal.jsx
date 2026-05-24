import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subCategorySchema } from '../../../../shared/validation/schemas.js';
import { Modal, Button, Input, Select } from '../../../../shared/ui/index.js';
import { FiFolder, FiCheck, FiX, FiInfo, FiTag } from 'react-icons/fi';

const SubCategoryFormModal = ({ isOpen, onClose, subCategory, categories, onSubmit, isLoading }) => {
	const isEdit = !!subCategory;

	// Prepare options for the category selector
	const categoryOptions = categories.map((cat) => ({
		value: cat._id,
		label: cat.name,
	}));

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(subCategorySchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			categoryId: '',
			description: '',
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (subCategory) {
				reset({
					name: subCategory.name || '',
					categoryId: subCategory.categoryId?._id || subCategory.categoryId || '',
					description: subCategory.description || '',
				});
			} else {
				reset({
					name: '',
					categoryId: '',
					description: '',
				});
			}
		}
	}, [isOpen, subCategory, reset]);

	const onInternalSubmit = (data) => {
		onSubmit(data);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEdit ? 'Edit Sub-Category' : 'Create Sub-Category'}
			size="md"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6">
				{/* Parent Category Select */}
				<div>
					<div className="flex items-center gap-2 mb-2">
						<FiFolder className="text-gray-400" />
						<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							Parent Category
						</label>
					</div>
					<Controller
						name="categoryId"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								options={[
									{ value: '', label: 'Select a category' },
									...categoryOptions,
								]}
								error={errors.categoryId?.message}
								disabled={isLoading}
							/>
						)}
					/>
				</div>

				{/* Sub-Category Name */}
				<div>
					<div className="flex items-center gap-2 mb-2">
						<FiTag className="text-gray-400" />
						<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							Sub-Category Name
						</label>
					</div>
					<Input
						placeholder="e.g. Smartphones, T-Shirts..."
						{...register('name')}
						error={errors.name?.message}
						disabled={isLoading}
					/>
				</div>

				{/* Description */}
				<div>
					<div className="flex items-center gap-2 mb-2">
						<FiInfo className="text-gray-400" />
						<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							Description
						</label>
					</div>
					<textarea
						className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none min-h-[100px] resize-none
							${errors.description ? 'border-red-500 bg-red-50/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500'}
						`}
						placeholder="Briefly describe this sub-category..."
						{...register('description')}
						disabled={isLoading}
					/>
					{errors.description && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-3 pt-4">
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
						{isEdit ? 'Save Changes' : 'Create Sub-Category'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default SubCategoryFormModal;