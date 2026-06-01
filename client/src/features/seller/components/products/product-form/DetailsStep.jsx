import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { Select, Skeleton } from '../../../../../shared/ui/index.js';
import { FiFolder, FiTag, FiShoppingBag, FiInfo } from 'react-icons/fi';
import TagInput from './TagInput.jsx';

const DetailsStep = ({
	errors,
	control,
	brandOptions,
	brandsLoading,
	categoryOptions,
	subCategoryOptions,
	categoriesLoading,
	sizes,
	colors,
	onAddSize,
	onRemoveSize,
	onAddColor,
	onRemoveColor
}) => {
	return (
		<motion.div
			key="step-details"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.25 }}
			className="space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Brand Selection */}
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiShoppingBag className="w-4 h-4 text-indigo-500" />
						Brand <span className="text-rose-400">*</span>
					</label>
					<Controller
						name="brandId"
						control={control}
						render={({ field }) => (
							<Select
								options={[{ value: '', label: 'Select Brand' }, ...brandOptions]}
								{...field}
								isLoading={brandsLoading}
								error={errors.brandId?.message}
							/>
						)}
					/>
				</div>

				{/* Primary Category */}
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiFolder className="w-4 h-4 text-indigo-500" />
						Primary Category <span className="text-rose-400">*</span>
					</label>
					<Controller
						name="primaryCategory"
						control={control}
						render={({ field }) => (
							<Select
								options={[{ value: '', label: 'Select Category' }, ...categoryOptions]}
								{...field}
								isLoading={categoriesLoading}
								error={errors.primaryCategory?.message}
							/>
						)}
					/>
				</div>
			</div>

			{/* Sub Category */}
			<div>
				<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
					<FiTag className="w-4 h-4 text-indigo-500" />
					Sub Category (Optional)
				</label>
				<Controller
					name="subCategory"
					control={control}
					render={({ field }) => (
						<Select
							options={[{ value: '', label: 'Select Sub Category' }, ...subCategoryOptions]}
							{...field}
							disabled={!control._formValues.primaryCategory}
							isLoading={categoriesLoading}
							error={errors.subCategory?.message}
						/>
					)}
				/>
			</div>

			<div className="h-px bg-gray-100 my-1" />

			{/* Product Variants (Tags) */}
			<div className="space-y-5">
				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="flex items-center gap-2 text-sm font-bold text-gray-700">
							Available Sizes
						</label>
						<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Press Enter to Add</span>
					</div>
					<TagInput
						tags={sizes || []}
						onAdd={onAddSize}
						onRemove={onRemoveSize}
						placeholder="e.g., S, M, L, XL, 42, 44..."
						type="text"
					/>
				</div>

				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="flex items-center gap-2 text-sm font-bold text-gray-700">
							Available Colors
						</label>
						<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hex or Name</span>
					</div>
					<TagInput
						tags={colors || []}
						onAdd={onAddColor}
						onRemove={onRemoveColor}
						placeholder="e.g., Black, #FF0000, Silver..."
						type="color"
					/>
				</div>
			</div>

			<div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
				<FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
				<p className="text-xs text-amber-700 leading-relaxed">
					Adding variants like <strong>sizes</strong> and <strong>colors</strong> helps customers find exactly what they're looking for and increases conversion rates.
				</p>
			</div>
		</motion.div>
	);
};

export default DetailsStep;
