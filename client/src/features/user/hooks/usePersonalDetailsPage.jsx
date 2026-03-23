import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ToastSuccess, ToastError } from '../../../shared/ui/index.js';
import useCurrentUser from './useCurrentUser.js';
import useUpdateUser from './useUpdateUser.js';
import useUpdateAvatar from './useUpdateAvatar.jsx';
import { roleThemes } from '../../../shared/constants/theme.js';
import { updatePassword as updatePasswordService, deleteMe as deleteMeService } from '../../auth/services/auth.js';

const usePersonalDetailsPage = () => {
    const navigate = useNavigate();
    const { user, userRole } = useCurrentUser();
    const { updateDetails, isLoading: isUpdating } = useUpdateUser();
    const { updateAvatar, deleteAvatar, isUpdating: isUploadingAvatar, uploadProgress } = useUpdateAvatar();

    // Modal states
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAccountDeleteModalOpen, setIsAccountDeleteModalOpen] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // File upload state
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Derived data
    const roleTheme = roleThemes[userRole] || roleThemes.Customer;
    const isStaff = userRole === 'Admin' || userRole === 'SuperAdmin';
    const userData = isStaff ? user : user?.userId;
    const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'User';
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'January 2024';

    // Profile form
    const profileForm = useForm({
        defaultValues: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: userData?.email || '',
            phoneNumber: userData?.phoneNumber || '',
        },
    });
    const { reset: resetProfileForm } = profileForm;

    // Password form
    const passwordForm = useForm({
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    // Sync form when user data changes
    useEffect(() => {
        if (userData) {
            resetProfileForm({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || '',
            });
        }
    }, [userData, resetProfileForm]);

    // Handlers
    const onSubmit = (data) => {
        updateDetails(data, {
            onSuccess: () => { setIsEditing(false); },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setPreviewUrl(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAvatar = () => {
        if (selectedFile) {
            updateAvatar(selectedFile, {
                onSuccess: () => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                }
            });
        }
    };

    const handleDeleteAvatar = () => {
        deleteAvatar(null, {
            onSuccess: () => { setIsDeleteModalOpen(false); }
        });
    };

    const onPasswordSubmit = async (data) => {
        try {
            setIsUpdatingPassword(true);
            const response = await updatePasswordService(data);
            if (response.status === 200 || response.status === 201) {
                toast.success(<ToastSuccess successObj={{ title: 'Password Updated', message: 'Your password has been changed successfully.' }} />, { icon: null });
                setIsChangingPassword(false);
                passwordForm.reset();
            }
        } catch (error) {
            toast.error(<ToastError errorObj={{ title: 'Password Update Failed', message: error.response?.data?.message || 'Something went wrong. Please check your current password.' }} />, { icon: null });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleAccountDeletion = async () => {
        try {
            setIsDeletingAccount(true);
            await deleteMeService();
            toast.success(<ToastSuccess successObj={{ title: 'Account Deleted', message: 'Your account has been deactivated successfully.' }} />, { icon: null });
            navigate('/login');
        } catch (error) {
            toast.error(<ToastError errorObj={{ title: 'Deletion Failed', message: error.response?.data?.message || 'Something went wrong.' }} />, { icon: null });
        } finally {
            setIsDeletingAccount(false);
            setIsAccountDeleteModalOpen(false);
        }
    };

    const clearFileSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return {
        // Data
        user, userData, userRole, roleTheme, fullName, memberSince,
        // Profile form
        profileForm, onSubmit, isEditing, setIsEditing, isUpdating,
        // Avatar
        fileInputRef, selectedFile, previewUrl, isUploadingAvatar, uploadProgress,
        handleFileChange, handleUploadAvatar, handleDeleteAvatar, clearFileSelection,
        // Password
        passwordForm, onPasswordSubmit, isChangingPassword, setIsChangingPassword, isUpdatingPassword,
        // Modals
        isUploadModalOpen, setIsUploadModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        isAccountDeleteModalOpen, setIsAccountDeleteModalOpen,
        isDeletingAccount,
        // Account
        handleAccountDeletion,
    };
};

export default usePersonalDetailsPage;
