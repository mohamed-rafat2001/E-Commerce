import { useState } from 'react';
import useCustomerProfile from './useCustomerProfile.js';
import useCustomerAddresses from './useCustomerAddresses.js';

const useShippingAddressesPage = () => {
    const { addresses, isLoading: isFetching } = useCustomerProfile();
    const {
        addAddress, updateAddress, deleteAddress, setDefaultAddress,
        isAdding, isUpdating, isDeleting, isSettingDefault
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
            updateAddress({ addressId: editingAddress._id, addressData: data }, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            addAddress(data, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const confirmDelete = () => {
        if (addressToDelete) {
            deleteAddress(addressToDelete, {
                onSuccess: () => setAddressToDelete(null)
            });
        }
    };

    return {
        addresses, isFetching,
        isModalOpen, setIsModalOpen,
        editingAddress, addressToDelete, setAddressToDelete,
        handleAddClick, handleEditClick, handleFormSubmit, confirmDelete,
        setDefaultAddress, isAdding, isUpdating, isDeleting, isSettingDefault,
    };
};

export default useShippingAddressesPage;
