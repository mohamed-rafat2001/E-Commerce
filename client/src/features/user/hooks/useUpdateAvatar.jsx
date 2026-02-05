import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import mainApi from '../../../api/mainApi';
import { toast } from 'react-hot-toast';
import { ToastSuccess, ToastError } from '../../../shared/ui';

export default function useUpdateAvatar() {
	const [uploadProgress, setUploadProgress] = useState(0);
	const queryClient = useQueryClient();

	const { mutate: updateAvatar, isPending: isUpdating } = useMutation({
		mutationFn: async (file) => {
			const formData = new FormData();
			formData.append('profileImg', file);

			setUploadProgress(0);

			const response = await mainApi.patch('authentications/me', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent) => {
					const progress = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setUploadProgress(progress);
				},
			});

			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);
			toast.success(
				<ToastSuccess
					successObj={{
						title: 'Avatar Updated',
						message: 'Profile image updated successfully',
					}}
				/>,
				{ icon: null }
			);
			setUploadProgress(0);
		},
		onError: (error) => {
			toast.error(
				<ToastError
					errorObj={{
						title: 'Update Failed',
						message: error.response?.data?.message || 'Failed to update profile image',
					}}
				/>,
				{ icon: null }
			);
			setUploadProgress(0);
		},
	});

	const { mutate: deleteAvatar, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const response = await mainApi.patch('authentications/me', { profileImg: null });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['user']);
			toast.success(
				<ToastSuccess
					successObj={{
						title: 'Avatar Removed',
						message: 'Profile image removed successfully',
					}}
				/>,
				{ icon: null }
			);
		},
		onError: (error) => {
			toast.error(
				<ToastError
					errorObj={{
						title: 'Removal Failed',
						message: error.response?.data?.message || 'Failed to remove profile image',
					}}
				/>,
				{ icon: null }
			);
		},
	});

	return {
		updateAvatar,
		deleteAvatar,
		isUpdating,
		isDeleting,
		uploadProgress,
	};
}
