import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '../../../../shared/validation/schemas.js';
import { Modal, Button, Input } from '../../../../shared/ui/index.js';
import { FiFolder, FiCheck, FiX, FiInfo } from 'react-icons/fi';

const CategoryFormModal = ({ isOpen, onClose, category, onSubmit, isLoading }) => {
	const isEdit = !!category;

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue,
	} = useForm({
		resolver: zodResolver(categorySchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			isActive: true,
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (category) {
				reset({
					name: category.name || '',
					description: category.description || '',
					isActive: category.isActive ?? true,
				});
			} else {
				reset({
					name: '',
					description: '',
					isActive: true,
				});
			}
		}
	}, [isOpen, category, reset]);

	const onInternalSubmit = (data) => {
		onSubmit(data);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEdit ? 'Edit Category' : 'Create New Category'}
			size="md"
		>
			<form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6">
				{/* Category Name */}
				<div>
					<div className="flex items-center gap-2 mb-2">
						<FiFolder className="text-gray-400" />
						<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
							Category Name
						</label>
					</div>
					<Input
						placeholder="e.g. Electronics, Fashion..."
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
						placeholder="Describe what this category includes..."
						{...register('description')}
						disabled={isLoading}
					/>
					{errors.description && (
						<p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>
					)}
				</div>

				{/* Status Toggle */}
				<div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
					<div>
						<p className="font-semibold text-gray-900 dark:text-gray-100">Visible for customers</p>
						<p className="text-xs text-gray-500">If disabled, this category and its products will be hidden.</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={watch('isActive')}
							onChange={(e) => setValue('isActive', e.target.checked)}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
					</label>
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
						{isEdit ? 'Save Changes' : 'Create Category'}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default CategoryFormModal;
