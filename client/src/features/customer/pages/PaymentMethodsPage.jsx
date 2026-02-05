import { useState } from 'react';
import PaymentMethodsHeader from '../components/PaymentMethodsHeader.jsx';
import PaymentCard from '../components/PaymentCard.jsx';
import PaymentMethodForm from '../components/PaymentMethodForm.jsx';
import useCustomerProfile from '../hooks/useCustomerProfile.js';
import { LoadingSpinner, Modal, Button } from '../../../shared/ui/index.js';
import useMutationFactory from '../../../shared/hooks/useMutationFactory.jsx';
import { deletePaymentMethodFunc } from '../services/customerService.js';

const PaymentMethodsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPayment, setEditingPayment] = useState(null);
	const [paymentToDelete, setPaymentToDelete] = useState(null);

	const { customer, isLoading } = useCustomerProfile();

	const { mutate: deletePM, isPending: isDeleting } = useMutationFactory(
		deletePaymentMethodFunc,
		['customerProfile'],
		'Payment method removed successfully'
	);

	if (isLoading) return <LoadingSpinner />;

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
		<div className="space-y-6">
			<PaymentMethodsHeader onAddClick={() => {
				setEditingPayment(null);
				setIsModalOpen(true);
			}} />

			{/* Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{paymentMethods.length > 0 ? (
					paymentMethods.map((card, index) => (
						<PaymentCard 
							key={card._id || index} 
							card={card} 
							index={index} 
							onEdit={() => handleEdit(card)}
							onDelete={() => handleDelete(card._id)}
						/>
					))
				) : (
					<div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
						<div className="text-4xl mb-4">💳</div>
						<h3 className="text-lg font-medium text-gray-900">No payment methods found</h3>
						<p className="text-gray-500">Add a credit card or digital wallet to get started.</p>
					</div>
				)}
			</div>

			<PaymentMethodForm 
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)} 
				initialData={editingPayment}
			/>

			<Modal
				isOpen={!!paymentToDelete}
				onClose={() => setPaymentToDelete(null)}
				title="Confirm Deletion"
				size="sm"
			>
				<div className="space-y-6">
					<div className="flex flex-col items-center text-center space-y-3">
						<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-3xl">
							🗑️
						</div>
						<h4 className="text-xl font-bold text-gray-900">Remove Payment?</h4>
						<p className="text-gray-500">
							Are you sure you want to remove this payment method? This action cannot be undone.
						</p>
					</div>
					<div className="flex gap-3">
						<Button 
							variant="ghost" 
							className="flex-1" 
							onClick={() => setPaymentToDelete(null)}
						>
							Cancel
						</Button>
						<Button 
							variant="primary" 
							className="flex-1 bg-red-600 hover:bg-red-700 border-red-600"
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
