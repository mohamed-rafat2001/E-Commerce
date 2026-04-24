import { motion } from 'framer-motion';
import { Select } from '../../../../../shared/ui/index.js';
import { FiSettings } from 'react-icons/fi';
import SummaryItem from './SummaryItem.jsx';

const statusOptions = [
	{ value: 'draft', label: '📝 Draft' },
	{ value: 'active', label: '🟢 Active' },
	{ value: 'inactive', label: '🔴 Inactive' },
	{ value: 'archived', label: '📦 Archived' },
];

const visibilityOptions = [
	{ value: 'public', label: '🌍 Public' },
	{ value: 'private', label: '🔒 Private' },
];

const SettingsStep = ({
	formData,
	onSelectChange,
	brandOptions,
	categoryOptions,
	coverImagePreview,
	uploadedImagesCount,
}) => {
	return (
		<motion.div
			key="step-settings"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.25 }}
			className="space-y-5"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						<FiSettings className="w-4 h-4 text-indigo-500" />
						Product Status
					</label>
					<Select
						value={formData.status}
						onChange={(val) => onSelectChange('status', val)}
						options={statusOptions}
					/>
				</div>
				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
						👁️ Visibility
					</label>
					<Select
						value={formData.visibility}
						onChange={(val) => onSelectChange('visibility', val)}
						options={visibilityOptions}
					/>
				</div>
			</div>

			{/* Summary Preview */}
			<div className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border border-gray-200">
				<h4 className="text-sm font-bold text-gray-700 mb-4">📋 Product Summary</h4>
				<div className="grid grid-cols-2 gap-4">
					<SummaryItem label="Name" value={formData.name || '—'} />
					<SummaryItem label="Price" value={formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '—'} />
					<SummaryItem label="Stock" value={String(formData.countInStock || 0)} />
					<SummaryItem label="Status" value={statusOptions.find(s => s.value === formData.status)?.label || formData.status} />
					<SummaryItem label="Visibility" value={visibilityOptions.find(v => v.value === formData.visibility)?.label || formData.visibility} />
					<SummaryItem label="Brand" value={brandOptions.find(b => b.value === formData.brandId)?.label || '—'} />
					<SummaryItem label="Category" value={categoryOptions.find(c => c.value === formData.primaryCategory)?.label || '—'} />
					<SummaryItem label="Sizes" value={formData.sizes?.length > 0 ? formData.sizes.join(', ') : '—'} />
					<SummaryItem label="Colors" value={formData.colors?.length > 0 ? `${formData.colors.length} colors` : '—'} />
					<SummaryItem label="Cover" value={coverImagePreview ? '✅ Set' : '❌ None'} />
					<SummaryItem label="Gallery" value={`${uploadedImagesCount || 0} images`} />
				</div>
			</div>
		</motion.div>
	);
};

export default SettingsStep;
