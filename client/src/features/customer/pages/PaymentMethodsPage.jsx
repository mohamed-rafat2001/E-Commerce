import PaymentMethodsHeader from '../components/PaymentMethodsHeader.jsx';
import PaymentCard from '../components/PaymentCard.jsx';

const paymentMethods = [
	{
		id: 1,
		type: 'Visa',
		last4: '4242',
		expiry: '12/28',
		holder: 'John Doe',
		isDefault: true,
		gradient: 'from-blue-600 to-indigo-700',
		icon: '💳'
	},
	{
		id: 2,
		type: 'Mastercard',
		last4: '8899',
		expiry: '09/27',
		holder: 'John Doe',
		isDefault: false,
		gradient: 'from-gray-700 to-gray-900',
		icon: '💳'
	}
];

const PaymentMethodsPage = () => {
	return (
		<div className="space-y-6">
			<PaymentMethodsHeader />

			{/* Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{paymentMethods.map((card, index) => (
					<PaymentCard key={card.id} card={card} index={index} />
				))}
			</div>
		</div>
	);
};

export default PaymentMethodsPage;
