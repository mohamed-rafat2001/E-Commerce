import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { Select, Checkbox } from '../../../../../shared/ui/index.js';
import { FiSettings, FiEye, FiCheckCircle, FiInfo } from 'react-icons/fi';

const statusOptions = [
	{ value: 'draft', label: 'Draft' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
];

const visibilityOptions = [
	{ value: 'public', label: 'Public - Visible to all' },
	{ value: 'private', label: 'Private - Only via link' },
];

const SettingsStep = ({ control, watch, coverImagePreview, uploadedImagesCount }) => {
	return (
		<motion.div
			key="step-settings"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.25 }}
			className="space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Status Selection */}
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiSettings className="w-4 h-4 text-indigo-500" />
						Publication Status
					</label>
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<Select
								options={statusOptions}
								{...field}
							/>
						)}
					/>
				</div>

				{/* Visibility Selection */}
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiEye className="w-4 h-4 text-indigo-500" />
						Visibility
					</label>
					<Controller
						name="visibility"
						control={control}
						render={({ field }) => (
							<Select
								options={visibilityOptions}
								{...field}
							/>
						)}
					/>
				</div>
			</div>

			<div className="h-px bg-gray-100 my-1" />

			{/* Review Summary */}
			<div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
				<h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
					<FiCheckCircle className="text-emerald-500" />
					Final Review
				</h4>
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-500 font-medium">Product Name:</span>
						<span className="text-gray-900 font-bold">{watch('name') || 'Untitled Product'}</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-500 font-medium">Price:</span>
						<span className="text-indigo-600 font-bold">${watch('price') || '0.00'}</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-500 font-medium">Initial Stock:</span>
						<span className="text-gray-900 font-bold">{watch('countInStock') || '0'} units</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-500 font-medium">Media Assets:</span>
						<span className="text-gray-900 font-bold">
							{coverImagePreview ? '1 Cover' : '0 Cover'} & {uploadedImagesCount} Gallery
						</span>
					</div>
				</div>
			</div>

			<div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex gap-3">
				<FiInfo className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
				<p className="text-xs text-indigo-700 leading-relaxed">
					Review your product details carefully. Once published, your product will be visible to potential buyers according to your selected status and visibility.
				</p>
			</div>
		</motion.div>
	);
};

export default SettingsStep;
