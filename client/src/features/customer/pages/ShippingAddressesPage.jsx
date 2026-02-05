import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShippingAddressesHeader from '../components/ShippingAddressesHeader.jsx';
import AddressCard from '../components/AddressCard.jsx';
import AddressForm from '../components/AddressForm.jsx';
import useCustomerProfile from '../hooks/useCustomerProfile.js';
import useCustomerAddresses from '../hooks/useCustomerAddresses.js';
import { Modal, LoadingSpinner, Button } from '../../../shared/ui/index.js';

const ShippingAddressesPage = () => {
	const { addresses, isLoading: isFetching } = useCustomerProfile();
	const { 
		addAddress, 
		updateAddress,
		deleteAddress, 
		setDefaultAddress, 
		isAdding, 
		isUpdating,
		isDeleting, 
		isSettingDefault 
	} = useCustomerAddresses();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState(null);
	const [addressToDelete, setAddressToDelete] = useState(null);

	const handleAddClick = () => {
		setEditingAddress(null);
		setIsModalOpen(true);
	};

	const handleEditClick = (addr) => {
		setEditingAddress(addr);
		setIsModalOpen(true);
	};

	const handleFormSubmit = (data) => {
		if (editingAddress) {
			updateAddress({ 
				addressId: editingAddress._id, 
				addressData: data 
			}, {
				onSuccess: () => {
					setIsModalOpen(false);
				}
			});
		} else {
			addAddress(data, {
				onSuccess: () => {
					setIsModalOpen(false);
				}
			});
		}
	};


	const handleDelete = (id) => {
		setAddressToDelete(id);
	};

	const confirmDelete = () => {
		if (addressToDelete) {
			deleteAddress(addressToDelete, {
				onSuccess: () => setAddressToDelete(null)
			});
		}
	};

	if (isFetching) {
		return (
			<div className="h-[60vh] flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<ShippingAddressesHeader onAdd={handleAddClick} />

			{/* Address Grid */}
			{addresses.length === 0 ? (
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
				>
					<div className="text-gray-400 mb-4 text-5xl">📍</div>
					<h3 className="text-lg font-medium text-gray-900">No addresses found</h3>
					<p className="text-gray-500">Add your first shipping address to get started</p>
				</motion.div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{addresses.map((addr, index) => (
						<motion.div
							key={addr._id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<AddressCard 
								addr={addr} 
								onSetDefault={setDefaultAddress}
								onDelete={handleDelete}
								onEdit={handleEditClick}
								isDeleting={isDeleting}
								isSettingDefault={isSettingDefault}
							/>
						</motion.div>
					))}
				</div>
			)}

			{/* Add/Edit Modal */}
			<Modal 
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)}
				title={editingAddress ? 'Edit Address' : 'Add New Address'}
			>
				<AddressForm 
					initialData={editingAddress}
					onSubmit={handleFormSubmit}
					isLoading={isAdding || isUpdating}
					onCancel={() => setIsModalOpen(false)}
				/>
			</Modal>

			<Modal
				isOpen={!!addressToDelete}
				onClose={() => setAddressToDelete(null)}
				title="Confirm Deletion"
				size="sm"
			>
				<div className="space-y-6">
					<div className="flex flex-col items-center text-center space-y-3">
						<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-3xl">
							🗑️
						</div>
						<h4 className="text-xl font-bold text-gray-900">Are you sure?</h4>
						<p className="text-gray-500">
							This action cannot be undone. This address will be permanently removed from your profile.
						</p>
					</div>
					<div className="flex gap-3">
						<Button 
							variant="ghost" 
							className="flex-1" 
							onClick={() => setAddressToDelete(null)}
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

export default ShippingAddressesPage;
