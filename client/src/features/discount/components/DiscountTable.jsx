import { motion } from 'framer-motion';
import { FiPercent, FiDollarSign, FiTruck, FiToggleLeft, FiToggleRight, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

const TYPE_CONFIG = {
	percentage: { icon: <FiPercent />, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400', label: 'Percentage' },
	fixed_amount: { icon: <FiDollarSign />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', label: 'Fixed' },
	free_shipping: { icon: <FiTruck />, color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400', label: 'Free Ship' },
	shipping_discount: { icon: <FiDollarSign />, color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400', label: 'Ship Disc.' },
};

const SCOPE_LABELS = {
	all_products: 'Platform-wide',
	category: 'Category',
	seller_all: 'All My Products',
	single_product: 'Specific Products',
};

const formatDate = (d) => {
	if (!d) return '—';
	return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isExpired = (endDate) => new Date(endDate) < new Date();
const isUpcoming = (startDate) => new Date(startDate) > new Date();

/**
 * Reusable table of discounts for both Seller and Admin dashboards.
 */
const DiscountTable = ({ discounts, onEdit, onDelete, onToggle }) => {
	if (!discounts?.length) return null;

	return (
		<div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
			<table className="w-full text-sm">
				<thead>
					<tr className="bg-gray-50 dark:bg-gray-800/50">
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Discount</th>
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Type</th>
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Value</th>
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Scope</th>
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Schedule</th>
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Usage</th>
						<th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
						<th className="text-right px-5 py-3.5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
					{discounts.map((d, i) => {
						const typeConf = TYPE_CONFIG[d.type] || TYPE_CONFIG.percentage;
						const expired = isExpired(d.endDate);
						const upcoming = isUpcoming(d.startDate);

						let statusBadge;
						if (expired) {
							statusBadge = <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">Expired</span>;
						} else if (!d.isActive) {
							statusBadge = <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">Inactive</span>;
						} else if (upcoming) {
							statusBadge = <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">Scheduled</span>;
						} else {
							statusBadge = <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Active</span>;
						}

						return (
							<motion.tr
								key={d._id}
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.03 }}
								className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
							>
								{/* Name */}
								<td className="px-5 py-4">
									<div>
										<p className="font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">{d.name}</p>
										{d.description && (
											<p className="text-xs text-gray-400 truncate max-w-[160px] mt-0.5">{d.description}</p>
										)}
									</div>
								</td>

								{/* Type Badge */}
								<td className="px-5 py-4">
									<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${typeConf.color}`}>
										{typeConf.icon}
										{typeConf.label}
									</span>
								</td>

								{/* Value */}
								<td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
									{d.type === 'percentage' ? `${d.value}%` : d.type === 'free_shipping' ? '—' : `$${d.value}`}
									{d.maxDiscountAmount ? (
										<span className="block text-[10px] text-gray-400 font-normal">max ${d.maxDiscountAmount}</span>
									) : null}
								</td>

								{/* Scope */}
								<td className="px-5 py-4">
									<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
										{SCOPE_LABELS[d.scope] || d.scope}
									</span>
									{d.targetIds?.length > 0 && (
										<span className="block text-[10px] text-gray-400">{d.targetIds.length} target{d.targetIds.length > 1 ? 's' : ''}</span>
									)}
								</td>

								{/* Schedule */}
								<td className="px-5 py-4">
									<div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
										<FiClock className="w-3 h-3" />
										<span>{formatDate(d.startDate)} — {formatDate(d.endDate)}</span>
									</div>
								</td>

								{/* Usage */}
								<td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400">
									{d.usageCount || 0} / {d.usageLimit ?? '∞'}
								</td>

								{/* Status */}
								<td className="px-5 py-4">{statusBadge}</td>

								{/* Actions */}
								<td className="px-5 py-4">
									<div className="flex items-center justify-end gap-1">
										<button
											onClick={() => onToggle(d._id)}
											className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
											title={d.isActive ? 'Deactivate' : 'Activate'}
										>
											{d.isActive ? (
												<FiToggleRight className="w-4 h-4 text-emerald-500" />
											) : (
												<FiToggleLeft className="w-4 h-4 text-gray-400" />
											)}
										</button>
										<button
											onClick={() => onEdit(d)}
											className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
											title="Edit"
										>
											<FiEdit2 className="w-4 h-4 text-indigo-500" />
										</button>
										<button
											onClick={() => onDelete(d._id)}
											className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
											title="Delete"
										>
											<FiTrash2 className="w-4 h-4 text-red-500" />
										</button>
									</div>
								</td>
							</motion.tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default DiscountTable;
