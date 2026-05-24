import { motion } from 'framer-motion';
import { Input } from '../../../../../shared/ui/index.js';
import { FiBox, FiLayers, FiDollarSign, FiHash, FiAlertCircle } from 'react-icons/fi';

const BasicInfoStep = ({ register, errors, watch }) => {
	const description = watch('description') || '';

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
					placeholder="e.g., Premium Wireless Headphones"
					{...register('name')}
					error={errors.name?.message}
				/>
			</div>

			{/* Description */}
			<div>
				<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
					<FiLayers className="w-4 h-4 text-indigo-500" />
					Description <span className="text-rose-400">*</span>
				</label>
				<textarea
					{...register('description')}
					placeholder="Describe your product features, materials, and what makes it special..."
					rows={4}
					className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none text-sm bg-gray-50/50 focus:bg-white
						${errors.description ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-400'}
					`}
				/>
				<div className="flex items-center justify-between mt-1.5">
					{errors.description && (
						<p className="text-xs text-rose-500 flex items-center gap-1">
							<FiAlertCircle className="w-3.5 h-3.5" /> {errors.description.message}
						</p>
					)}
					<p className="text-[10px] text-gray-400 ml-auto">
						{description.length}/500 characters
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
							placeholder="0.00"
							step="0.01"
							className="!pl-7"
							{...register('price')}
							error={errors.price?.message}
						/>
					</div>
				</div>
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiHash className="w-4 h-4 text-purple-500" />
						Stock Quantity
					</label>
					<Input
						type="number"
						placeholder="0"
						{...register('countInStock')}
						error={errors.countInStock?.message}
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default BasicInfoStep;
