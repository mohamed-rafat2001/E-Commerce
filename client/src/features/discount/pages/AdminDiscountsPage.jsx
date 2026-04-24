import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiTag } from 'react-icons/fi';
import { PageHeader, Button, Pagination, Skeleton, Card, EmptyState, Modal } from '../../../shared/ui/index.js';
import useAdminDiscounts from '../hooks/useAdminDiscounts.js';
import DiscountTable from '../components/DiscountTable.jsx';
import DiscountFormModal from '../components/DiscountFormModal.jsx';

const AdminDiscountsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingDiscount, setEditingDiscount] = useState(null);
	const [deleteId, setDeleteId] = useState(null);

	const {
		discounts,
		totalPages,
		isLoading,
		isSubmitting,
		createDiscount,
		updateDiscount,
		deleteDiscount,
		toggleDiscount,
	} = useAdminDiscounts();

	const handleCreate = () => {
		setEditingDiscount(null);
		setIsFormOpen(true);
	};

	const handleEdit = (discount) => {
		setEditingDiscount(discount);
		setIsFormOpen(true);
	};

	const handleSubmit = async (data, id) => {
		const ok = id ? await updateDiscount(id, data) : await createDiscount(data);
		if (ok) setIsFormOpen(false);
	};

	const handleConfirmDelete = async () => {
		if (deleteId) {
			await deleteDiscount(deleteId);
			setDeleteId(null);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<Skeleton variant="card" count={4} />
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<PageHeader
				title="Promotions & Discounts"
				subtitle="Manage platform-wide and category-specific promotions. Higher priority discounts override lower ones."
				actions={
					<Button onClick={handleCreate} icon={<FiPlus className="w-5 h-5" />} className="shadow-xl">
						Create Promotion
					</Button>
				}
			/>

			{/* Filters Row */}
			<div className="flex flex-wrap gap-3">
				{['', 'active', 'inactive'].map((val) => {
					const label = val || 'All';
					const current = searchParams.get('status') || '';
					return (
						<button
							key={val}
							onClick={() => {
								const params = new URLSearchParams(searchParams);
								if (val) params.set('status', val);
								else params.delete('status');
								params.delete('page');
								setSearchParams(params);
							}}
							className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
								current === val
									? 'bg-indigo-600 text-white shadow-lg'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
							}`}
						>
							{label.charAt(0).toUpperCase() + label.slice(1)}
						</button>
					);
				})}
			</div>

			{discounts.length > 0 ? (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
					<DiscountTable
						discounts={discounts}
						onEdit={handleEdit}
						onDelete={(id) => setDeleteId(id)}
						onToggle={toggleDiscount}
					/>
					<div className="mt-8">
						<Pagination totalPages={totalPages} />
					</div>
				</motion.div>
			) : (
				<Card padding="lg">
					<EmptyState
						icon={<FiTag className="w-12 h-12" />}
						title="No promotions found"
						message="Create platform-wide promotions, category discounts, or free shipping events to drive sales."
						action={{ label: 'Create Promotion', onClick: handleCreate }}
					/>
				</Card>
			)}

			{/* Form Modal */}
			<DiscountFormModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSubmit={handleSubmit}
				discount={editingDiscount}
				role="Admin"
				isSubmitting={isSubmitting}
			/>

			{/* Delete Confirmation */}
			<Modal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				title="Delete Promotion"
				size="sm"
				footer={
					<div className="flex justify-end gap-3 w-full">
						<Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
						<Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
					</div>
				}
			>
				<p className="text-gray-600 dark:text-gray-400 py-4 text-center">
					Are you sure? This will immediately remove the promotion and its effects across the platform.
				</p>
			</Modal>
		</div>
	);
};

export default AdminDiscountsPage;
