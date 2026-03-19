import { motion, AnimatePresence } from 'framer-motion';
import AddressCard from '../components/AddressCard.jsx';
import AddressForm from '../components/AddressForm.jsx';
import { Modal, Skeleton, Button, PageHeader, EmptyState, Card } from '../../../shared/ui/index.js';
import { FiPlus, FiMapPin, FiTrash2 } from 'react-icons/fi';
import useShippingAddressesPage from '../hooks/useShippingAddressesPage.js';

const ShippingAddressesPage = () => {
	const page = useShippingAddressesPage();

	if (page.isFetching) {
		return (
			<div className="space-y-8">
				<Skeleton variant="text" className="w-1/4 h-10" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Skeleton variant="card" count={3} />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<PageHeader
				title="Shipping Addresses"
				subtitle="Manage your delivery locations for a faster checkout experience."
				actions={<Button onClick={page.handleAddClick} icon={<FiPlus className="w-5 h-5" />} className="shadow-xl">Add New Address</Button>}
			/>

			{page.addresses.length === 0 ? (
				<Card padding="lg">
					<EmptyState icon={<FiMapPin className="w-12 h-12" />} title="No addresses found" message="Please add your first shipping address to get started with your orders." action={{ label: "Add Address", onClick: page.handleAddClick }} />
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<AnimatePresence mode="popLayout">
						{page.addresses.map((addr, index) => (
							<motion.div key={addr._id || index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}>
								<AddressCard addr={addr} onSetDefault={page.setDefaultAddress} onDelete={(id) => page.setAddressToDelete(id)} onEdit={page.handleEditClick} isDeleting={page.isDeleting} isSettingDefault={page.isSettingDefault} />
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}

			<Modal isOpen={page.isModalOpen} onClose={() => page.setIsModalOpen(false)} title={page.editingAddress ? 'Edit Address' : 'Add New Address'}>
				<AddressForm initialData={page.editingAddress} onSubmit={page.handleFormSubmit} isLoading={page.isAdding || page.isUpdating} onCancel={() => page.setIsModalOpen(false)} />
			</Modal>

			<Modal isOpen={!!page.addressToDelete} onClose={() => page.setAddressToDelete(null)} title="Delete Address" size="sm">
				<div className="space-y-6 flex flex-col items-center text-center">
					<div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2"><FiTrash2 className="w-10 h-10" /></div>
					<div>
						<h4 className="text-xl font-black text-gray-900 mb-2 font-display">Are you sure?</h4>
						<p className="text-gray-500 text-sm">This address will be permanently removed. You can't undo this action.</p>
					</div>
					<div className="flex gap-3 w-full">
						<Button variant="ghost" className="flex-1" onClick={() => page.setAddressToDelete(null)}>Cancel</Button>
						<Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-700 border-none" onClick={page.confirmDelete} isLoading={page.isDeleting}>Delete</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ShippingAddressesPage;
