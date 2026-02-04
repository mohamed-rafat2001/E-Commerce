import { Card, Button, Badge } from '../../../shared/ui/index.js';
import { ShippingIcon } from '../../../shared/constants/icons.jsx';

const AddressCard = ({ addr }) => {
	return (
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
	);
};

export default AddressCard;
