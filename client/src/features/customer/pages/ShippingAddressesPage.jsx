import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShippingAddressesHeader from '../components/ShippingAddressesHeader.jsx';
import AddressCard from '../components/AddressCard.jsx';
import AddressForm from '../components/AddressForm.jsx';
import useCustomerProfile from '../hooks/useCustomerProfile.js';
import useCustomerAddresses from '../hooks/useCustomerAddresses.js';
import { Modal, LoadingSpinner } from '../../../shared/ui/index.js';

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
		if (window.confirm('Are you sure you want to delete this address?')) {
			deleteAddress(id);
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
				size="md"
			>
				<AddressForm 
					initialData={editingAddress}
					onSubmit={handleFormSubmit}
					isLoading={isAdding || isUpdating}
					onCancel={() => setIsModalOpen(false)}
				/>
			</Modal>
		</div>
	);
};

export default ShippingAddressesPage;
