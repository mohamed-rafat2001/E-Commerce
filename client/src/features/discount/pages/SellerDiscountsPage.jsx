import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTag } from 'react-icons/fi';
import { PageHeader, Button, Pagination, Skeleton, Card, EmptyState, Modal } from '../../../shared/ui/index.js';
import useSellerDiscounts from '../hooks/useSellerDiscounts.js';
import DiscountTable from '../components/DiscountTable.jsx';
import DiscountFormModal from '../components/DiscountFormModal.jsx';

const SellerDiscountsPage = () => {
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
	} = useSellerDiscounts();

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
				title="My Discounts"
				subtitle="Create promotions for your products to drive sales and attract customers."
				actions={
					<Button onClick={handleCreate} icon={<FiPlus className="w-5 h-5" />} className="shadow-xl">
						Create Discount
					</Button>
				}
			/>

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
						title="No discounts yet"
						message="Create your first discount to boost your sales. You can offer percentage off, fixed amount, or free shipping."
						action={{ label: 'Create Discount', onClick: handleCreate }}
					/>
				</Card>
			)}

			{/* Form Modal */}
			<DiscountFormModal
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSubmit={handleSubmit}
				discount={editingDiscount}
				role="Seller"
				isSubmitting={isSubmitting}
			/>

			{/* Delete Confirmation */}
			<Modal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				title="Delete Discount"
				size="sm"
				footer={
					<div className="flex justify-end gap-3 w-full">
						<Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
						<Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
					</div>
				}
			>
				<p className="text-gray-600 dark:text-gray-400 py-4 text-center">
					Are you sure you want to delete this discount? This action cannot be undone and will immediately remove any active promotion.
				</p>
			</Modal>
		</div>
	);
};

export default SellerDiscountsPage;
