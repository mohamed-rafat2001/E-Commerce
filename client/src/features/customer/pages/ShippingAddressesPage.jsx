import { motion } from 'framer-motion';
import ShippingAddressesHeader from '../components/ShippingAddressesHeader.jsx';
import AddressCard from '../components/AddressCard.jsx';

const addresses = [
	{
		id: 1,
		type: 'Home',
		name: 'John Doe',
		address: '123 Main Street, Apt 4B',
		city: 'New York',
		state: 'NY',
		zip: '10001',
		country: 'USA',
		phone: '+1 (555) 123-4567',
		isDefault: true,
	},
	{
		id: 2,
		type: 'Work',
		name: 'John Doe',
		address: '456 Business Blvd, Suite 200',
		city: 'San Francisco',
		state: 'CA',
		zip: '94107',
		country: 'USA',
		phone: '+1 (555) 987-6543',
		isDefault: false,
	},
];

const ShippingAddressesPage = () => {
	return (
		<div className="space-y-6">
			<ShippingAddressesHeader />

			{/* Address Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{addresses.map((addr, index) => (
					<motion.div
						key={addr.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<AddressCard addr={addr} />
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default ShippingAddressesPage;
