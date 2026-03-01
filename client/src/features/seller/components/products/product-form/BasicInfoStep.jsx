import { motion } from 'framer-motion';
import { Input } from '../../../../../shared/ui/index.js';
import { FiBox, FiLayers, FiDollarSign, FiHash, FiAlertCircle } from 'react-icons/fi';

const BasicInfoStep = ({ formData, formErrors, onChange }) => {
	return (
		<motion.div
			key="step-basic"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.25 }}
			className="space-y-5"
		>
			{/* Product Name */}
			<div>
				<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
					<FiBox className="w-4 h-4 text-indigo-500" />
					Product Name <span className="text-rose-400">*</span>
				</label>
				<Input
					name="name"
					value={formData.name}
					onChange={onChange}
					placeholder="e.g., Premium Wireless Headphones"
					required
				/>
				{formErrors.name && (
					<p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
						<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.name}
					</p>
				)}
			</div>

			{/* Description */}
			<div>
				<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
					<FiLayers className="w-4 h-4 text-indigo-500" />
					Description <span className="text-rose-400">*</span>
				</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={onChange}
					placeholder="Describe your product features, materials, and what makes it special..."
					rows={4}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none resize-none text-sm bg-gray-50/50 focus:bg-white"
					required
				/>
				<div className="flex items-center justify-between mt-1.5">
					{formErrors.description && (
						<p className="text-xs text-rose-500 flex items-center gap-1">
							<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.description}
						</p>
					)}
					<p className="text-[10px] text-gray-400 ml-auto">
						{formData.description.length}/500 characters
					</p>
				</div>
			</div>

			{/* Price & Stock */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiDollarSign className="w-4 h-4 text-emerald-500" />
						Price (USD) <span className="text-rose-400">*</span>
					</label>
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
						<Input
							type="number"
							name="price"
							value={formData.price}
							onChange={onChange}
							placeholder="0.00"
							min="0"
							step="0.01"
							required
							className="!pl-7"
						/>
					</div>
					{formErrors.price && (
						<p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
							<FiAlertCircle className="w-3.5 h-3.5" /> {formErrors.price}
						</p>
					)}
				</div>
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiHash className="w-4 h-4 text-purple-500" />
						Stock Quantity
					</label>
					<Input
						type="number"
						name="countInStock"
						value={formData.countInStock}
						onChange={onChange}
						placeholder="0"
						min="0"
						required
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default BasicInfoStep;
