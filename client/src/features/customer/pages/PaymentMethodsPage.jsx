import PaymentMethodsHeader from '../components/PaymentMethodsHeader.jsx';
import PaymentCard from '../components/PaymentCard.jsx';
import useCustomerProfile from '../hooks/useCustomerProfile.js';
import { LoadingSpinner } from '../../../shared/ui/index.js';

const PaymentMethodsPage = () => {
	const { customer, isLoading } = useCustomerProfile();

	if (isLoading) return <LoadingSpinner />;

	const paymentMethods = customer?.paymentMethods || [];

	return (
		<div className="space-y-6">
			<PaymentMethodsHeader />

			{/* Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{paymentMethods.length > 0 ? (
					paymentMethods.map((card, index) => (
						<PaymentCard key={card._id || index} card={card} index={index} />
					))
				) : (
					<div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
						<div className="text-4xl mb-4">💳</div>
						<h3 className="text-lg font-medium text-gray-900">No payment methods found</h3>
						<p className="text-gray-500">Add a credit card or digital wallet to get started.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentMethodsPage;
