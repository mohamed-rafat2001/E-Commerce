import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentCard from '../components/PaymentCard.jsx';
import PaymentMethodForm from '../components/PaymentMethodForm.jsx';
import useCustomerProfile from '../hooks/useCustomerProfile.js';
import { Skeleton, Modal, Button, PageHeader, EmptyState, Card } from '../../../shared/ui/index.js';
import useMutationFactory from '../../../shared/hooks/useMutationFactory.jsx';
import { deletePaymentMethodFunc } from '../services/customerService.js';
import { FiPlus, FiCreditCard, FiTrash2 } from 'react-icons/fi';

const PaymentMethodsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPayment, setEditingPayment] = useState(null);
	const [paymentToDelete, setPaymentToDelete] = useState(null);

	const { customer, isLoading } = useCustomerProfile();

	const { mutate: deletePM, isPending: isDeleting } = useMutationFactory(
		deletePaymentMethodFunc,
		'customerProfile',
		'Payment method removed successfully'
	);

	if (isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Skeleton variant="card" count={3} />
				</div>
			</div>
		);
	}

	const paymentMethods = customer?.paymentMethods || [];

	const handleEdit = (card) => {
		setEditingPayment(card);
		setIsModalOpen(true);
	};

	const handleDelete = (id) => {
		setPaymentToDelete(id);
	};

	const confirmDelete = () => {
		if (paymentToDelete) {
			deletePM(paymentToDelete, {
				onSuccess: () => setPaymentToDelete(null)
			});
		}
	};

	return (
		<div className="space-y-8">
			<PageHeader
				title="Payment Methods"
				subtitle="Securely manage your credit cards and digital wallets for quick payments."
				actions={
					<Button
						onClick={() => {
							setEditingPayment(null);
							setIsModalOpen(true);
						}}
						icon={<FiPlus className="w-5 h-5" />}
						className="shadow-xl"
					>
						Add Payment Method
					</Button>
				}
			/>

			{paymentMethods.length === 0 ? (
				<Card padding="lg">
					<EmptyState
						icon={<FiCreditCard className="w-12 h-12" />}
						title="No payment methods found"
						message="Add a credit card or digital wallet to get started with your purchases."
						action={{
							label: "Add Payment Method",
							onClick: () => setIsModalOpen(true)
						}}
					/>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<AnimatePresence mode="popLayout">
						{paymentMethods.map((card, index) => (
							<motion.div
								key={card._id || index}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ delay: index * 0.05 }}
							>
								<PaymentCard
									card={card}
									index={index}
									onEdit={() => handleEdit(card)}
									onDelete={() => handleDelete(card._id)}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}

			<PaymentMethodForm
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={editingPayment}
			/>

			<Modal
				isOpen={!!paymentToDelete}
				onClose={() => setPaymentToDelete(null)}
				title="Remove Payment Method"
				size="sm"
			>
				<div className="space-y-6 flex flex-col items-center text-center">
					<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
						<FiTrash2 className="w-10 h-10" />
					</div>
					<div>
						<h4 className="text-xl font-black text-gray-900 mb-2 font-display">Delete this card?</h4>
						<p className="text-gray-500 text-sm font-body">
							This action cannot be undone. You will need to re-add this card for future purchases.
						</p>
					</div>
					<div className="flex gap-3 w-full pt-2">
						<Button variant="ghost" className="flex-1" onClick={() => setPaymentToDelete(null)}>
							Cancel
						</Button>
						<Button
							variant="primary"
							className="flex-1 bg-red-600 hover:bg-red-700 border-none shadow-lg shadow-red-200"
							onClick={confirmDelete}
							isLoading={isDeleting}
						>
							Delete
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default PaymentMethodsPage;
