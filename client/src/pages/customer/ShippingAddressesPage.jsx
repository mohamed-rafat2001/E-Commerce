import { motion } from 'framer-motion';
import { Card, Button, Badge } from '../../shared/ui/index.js';
import { ShippingIcon, HeartIcon } from '../../shared/constants/icons.jsx';

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
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Shipping Addresses</h1>
					<p className="text-gray-500">Manage your delivery locations</p>
				</div>
				<Button variant="primary" icon={<span className="text-lg">+</span>}>
					Add New Address
				</Button>
			</motion.div>

			{/* Address Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{addresses.map((addr, index) => (
					<motion.div
						key={addr.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Card variant="elevated" className={`relative h-full ${addr.isDefault ? 'border-2 border-indigo-500' : ''}`}>
							<Card.Header className="!pb-2 !border-b-0">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
											<ShippingIcon className="w-5 h-5" />
										</div>
										<h3 className="font-bold text-gray-900">{addr.type}</h3>
									</div>
									{addr.isDefault && (
										<Badge variant="primary" size="sm">Default</Badge>
									)}
								</div>
							</Card.Header>
							<Card.Content className="space-y-3">
								<div className="text-gray-600 space-y-1">
									<p className="font-medium text-gray-900">{addr.name}</p>
									<p>{addr.address}</p>
									<p>{addr.city}, {addr.state} {addr.zip}</p>
									<p>{addr.country}</p>
									<p className="text-sm mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
										<span className="text-gray-400">Phone:</span>
										{addr.phone}
									</p>
								</div>
							</Card.Content>
							<Card.Footer className="flex gap-3 justify-end">
								<Button variant="ghost" size="sm">Edit</Button>
								<Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">Delete</Button>
							</Card.Footer>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default ShippingAddressesPage;
