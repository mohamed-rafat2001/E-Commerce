import { motion } from 'framer-motion';
import { Select, Button } from '../../../../../shared/ui/index.js';
import { FiTag, FiGrid, FiLayers, FiAlertCircle, FiX } from 'react-icons/fi';
import TagInput from './TagInput.jsx';

const DetailsStep = ({
	formData,
	formErrors,
	onSelectChange,
	// Brand/Category data
	brands,
	brandOptions,
	brandsLoading,
	categoryOptions,
	subCategoryOptions,
	categoriesLoading,
	onClose,
	// Sizes
	sizeInput,
	onSizeInputChange,
	onAddSize,
	onRemoveSize,
	// Colors
	colorInput,
	onColorInputChange,
	onAddColor,
	onRemoveColor,
}) => {
	return (
		<motion.div
			key="step-details"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.25 }}
			className="space-y-5"
		>
			{/* Brand Selection */}
			<div>
				{brands && brands.length === 0 ? (
					<div className="border-2 border-dashed border-amber-200 rounded-xl p-5 text-center bg-amber-50/50">
						<div className="flex flex-col items-center gap-3">
							<div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
								<FiAlertCircle className="w-5 h-5 text-amber-600" />
							</div>
							<div>
								<h3 className="font-bold text-amber-800 text-sm">No Brands Available</h3>
								<p className="text-xs text-amber-600 mt-1">
									You need to create a brand before adding products.
								</p>
							</div>
							<Button 
								variant="secondary" 
								size="sm"
								onClick={() => {
									onClose();
									window.location.href = '/seller/brands';
								}}
								className="!rounded-xl"
							>
								Create Your First Brand
							</Button>
						</div>
					</div>
				) : (
					<div>
						<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
							<FiTag className="w-4 h-4 text-indigo-500" />
							Brand <span className="text-rose-400">*</span>
						</label>
						<Select
							value={formData.brandId}
							onChange={(val) => onSelectChange('brandId', val)}
							options={[
								{ value: '', label: 'Select brand...' },
								...brandOptions
							]}
							loading={brandsLoading}
						/>
						{formErrors.brandId && (
							<p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
								<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.brandId}
							</p>
						)}
					</div>
				)}
			</div>

			{/* Categories */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiGrid className="w-4 h-4 text-emerald-500" />
						Primary Category <span className="text-rose-400">*</span>
					</label>
					<Select
						value={formData.primaryCategory}
						onChange={(val) => onSelectChange('primaryCategory', val)}
						options={[
							{ value: '', label: 'Select category...' },
							...categoryOptions
						]}
						loading={categoriesLoading}
					/>
					{formErrors.primaryCategory && (
						<p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
							<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.primaryCategory}
						</p>
					)}
				</div>
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiLayers className="w-4 h-4 text-purple-500" />
						Sub Category
					</label>
					<Select
						value={formData.subCategory}
						onChange={(val) => onSelectChange('subCategory', val)}
						options={[
							{ value: '', label: 'Optional...' },
							...subCategoryOptions
						]}
						disabled={!formData.primaryCategory}
						loading={categoriesLoading}
					/>
				</div>
			</div>

			{/* Sizes */}
			<TagInput
				label="Sizes"
				emoji="📏"
				items={formData.sizes}
				inputValue={sizeInput}
				onInputChange={onSizeInputChange}
				onAdd={onAddSize}
				onRemove={onRemoveSize}
				placeholder="e.g., S, M, L, XL, 42"
			/>

			{/* Colors */}
			<TagInput
				label="Colors"
				emoji="🎨"
				items={formData.colors}
				inputValue={colorInput}
				onInputChange={onColorInputChange}
				onAdd={onAddColor}
				onRemove={onRemoveColor}
				placeholder="#FF5733 or red"
				error={formErrors.colors}
				renderTag={(color, onRemove) => (
					<span 
						key={color} 
						className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm"
					>
						<span 
							className="w-4 h-4 rounded-md border border-gray-200 shadow-inner" 
							style={{ backgroundColor: color.startsWith('#') ? color : color }}
						/>
						{color}
						<button
							type="button"
							onClick={() => onRemove(color)}
							className="text-gray-400 hover:text-rose-500 transition-colors"
							aria-label={`Remove ${color}`}
						>
							<FiX className="w-3 h-3" />
						</button>
					</span>
				)}
			/>
		</motion.div>
	);
};

export default DetailsStep;
