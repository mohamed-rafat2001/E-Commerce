import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, Button, Input, Avatar, Badge, Modal, Dropdown } from '../../../shared/ui/index.js';
import useCurrentUser from '../hooks/useCurrentUser.js';
import useUpdateUser from '../hooks/useUpdateUser.js';
import useUpdateAvatar from '../hooks/useUpdateAvatar.jsx';
import { roleThemes } from '../../../shared/constants/theme.js';
import { UserIcon, LockIcon, TrashIcon, ShieldIcon } from '../../../shared/constants/icons.jsx';
import { updatePassword as updatePasswordService, deleteMe as deleteMeService } from '../../auth/services/auth.js';
import toast from 'react-hot-toast';
import { ToastSuccess, ToastError } from '../../../shared/ui/index.js';
import { useNavigate } from 'react-router-dom';

const PersonalDetailsPage = () => {
	const navigate = useNavigate();
	const { user, userRole } = useCurrentUser();
	const { updateDetails, isLoading: isUpdating } = useUpdateUser();
	const { 
		updateAvatar, 
		deleteAvatar, 
		isUpdating: isUploadingAvatar, 
		uploadProgress 
	} = useUpdateAvatar();
	
	const [isEditing, setIsEditing] = useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isAccountDeleteModalOpen, setIsAccountDeleteModalOpen] = useState(false);
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);
	const fileInputRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

	const roleTheme = roleThemes[userRole] || roleThemes.Customer;
	const isStaff = userRole === 'Admin' || userRole === 'SuperAdmin';
	const userData = isStaff ? user : user?.userId;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			firstName: userData?.firstName || '',
			lastName: userData?.lastName || '',
			email: userData?.email || '',
			phoneNumber: userData?.phoneNumber || '',
		},
	});
	
	const {
		register: passwordRegister,
		handleSubmit: handlePasswordSubmit,
		reset: resetPasswordForm,
		formState: { errors: passwordErrors },
		watch: watchPassword,
	} = useForm({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	// Update form values when user data changes
	useEffect(() => {
		if (userData) {
			reset({
				firstName: userData.firstName || '',
				lastName: userData.lastName || '',
				email: userData.email || '',
				phoneNumber: userData.phoneNumber || '',
			});
		}
	}, [userData, reset]);

	const fullName = userData
		? `${userData.firstName} ${userData.lastName}`
		: 'User';

	const onSubmit = (data) => {
		updateDetails(data, {
			onSuccess: () => {
				setIsEditing(false);
			},
		});
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result);
			};
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
			onSuccess: () => {
				setIsDeleteModalOpen(false);
			}
		});
	};

	const memberSince = user?.createdAt 
		? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
		: 'January 2024';
		
	const onPasswordSubmit = async (data) => {
		try {
			setIsUpdatingPassword(true);
			const response = await updatePasswordService(data);
			
			if (response.status === 200 || response.status === 201) {
				toast.success(
					<ToastSuccess 
						successObj={{ 
							title: 'Password Updated', 
							message: 'Your password has been changed successfully.' 
						}} 
					/>,
					{ icon: null }
				);
				setIsChangingPassword(false);
				resetPasswordForm();
			}
		} catch (error) {
			toast.error(
				<ToastError 
					errorObj={{ 
						title: 'Password Update Failed', 
						message: error.response?.data?.message || 'Something went wrong. Please check your current password.' 
					}} 
				/>,
				{ icon: null }
			);
		} finally {
			setIsUpdatingPassword(false);
		}
	};

	const handleAccountDeletion = async () => {
		try {
			setIsDeletingAccount(true);
			await deleteMeService();
			toast.success(
				<ToastSuccess 
					successObj={{ 
						title: 'Account Deleted', 
						message: 'Your account has been deactivated successfully.' 
					}} 
				/>,
				{ icon: null }
			);
			navigate('/login');
		} catch (error) {
			toast.error(
				<ToastError 
					errorObj={{ 
						title: 'Deletion Failed', 
						message: error.response?.data?.message || 'Something went wrong.' 
					}} 
				/>,
				{ icon: null }
			);
		} finally {
			setIsDeletingAccount(false);
			setIsAccountDeleteModalOpen(false);
		}
	};

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			{/* Profile Header Card */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Card
					variant="elevated"
					padding="p-0"
					className="relative"
				>
					{/* Background gradient */}
					<div
						className="h-32 sm:h-40 rounded-t-2xl overflow-hidden"
						style={{ background: roleTheme.gradient }}
					>
						{/* Decorative patterns */}
						<div className="absolute inset-0 opacity-20">
							<div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/20" />
							<div className="absolute bottom-5 right-20 w-32 h-32 rounded-full bg-white/10" />
						</div>
					</div>

					{/* Profile content */}
					<div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 relative z-10">
						<div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
							{/* Avatar with Dropdown */}
							<div className="relative group">
								<Dropdown
									trigger={
										<div className="relative cursor-pointer">
											<Avatar
												src={userData?.profileImg?.secure_url}
												name={fullName}
												size="2xl"
												ring
												ringColor="ring-white"
												className="border-4 border-white shadow-xl transition-transform group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>
											</div>
										</div>
									}
									align="center"
									width="w-56"
								>
									<Dropdown.Item 
										icon={
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
											</svg>
										}
										onClick={() => setIsUploadModalOpen(true)}
									>
										Upload Profile Image
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item 
										variant="danger"
										icon={
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										}
										onClick={() => setIsDeleteModalOpen(true)}
										disabled={!userData?.profileImg?.secure_url}
									>
										Delete Image
									</Dropdown.Item>
								</Dropdown>
							</div>

							{/* Name and role */}
							<div className="text-center sm:text-left flex-1">
								<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
									{fullName}
								</h1>
								<div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
									<Badge
										variant="gradient"
										size="md"
										icon={<span>{roleTheme.icon}</span>}
									>
										{roleTheme.title}
									</Badge>
								</div>
							</div>

							{/* Edit button */}
							<Button
								variant={isEditing ? 'danger' : 'secondary'}
								onClick={() => setIsEditing(!isEditing)}
							>
								{isEditing ? 'Cancel' : 'Edit Profile'}
							</Button>
						</div>
					</div>
				</Card>
			</motion.div>

			{/* Upload Image Modal */}
			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => {
					if (!isUploadingAvatar) {
						setIsUploadModalOpen(false);
						setSelectedFile(null);
						setPreviewUrl(null);
					}
				}}
				title="Upload Profile Image"
				size="sm"
			>
				<div className="space-y-6">
					<div 
						className={`relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed 
							${previewUrl ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'} 
							flex flex-col items-center justify-center transition-all duration-300`}
					>
						{previewUrl ? (
							<>
								<img 
									src={previewUrl} 
									alt="Preview" 
									className="w-full h-full object-cover"
								/>
								{!isUploadingAvatar && (
									<button 
										onClick={() => {
											setSelectedFile(null);
											setPreviewUrl(null);
										}}
										className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-xl text-red-500 shadow-lg hover:bg-white transition-all"
									>
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								)}
							</>
						) : (
							<div 
								className="text-center p-8 cursor-pointer"
								onClick={() => fileInputRef.current?.click()}
							>
								<div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-500">
									<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
									</svg>
								</div>
								<p className="text-gray-900 font-semibold">Click to select image</p>
								<p className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</p>
							</div>
						)}
						
						<input 
							type="file" 
							ref={fileInputRef}
							className="hidden"
							accept="image/*"
							onChange={handleFileChange}
							disabled={isUploadingAvatar}
						/>
					</div>

					{isUploadingAvatar && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm font-medium">
								<span className="text-gray-600">Uploading...</span>
								<span className="text-indigo-600">{uploadProgress}%</span>
							</div>
							<div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
								<motion.div 
									className="h-full bg-indigo-500"
									initial={{ width: 0 }}
									animate={{ width: `${uploadProgress}%` }}
									transition={{ duration: 0.1 }}
								/>
							</div>
						</div>
					)}

					<div className="flex gap-3">
						<Button 
							variant="ghost" 
							className="flex-1"
							onClick={() => setIsUploadModalOpen(false)}
							disabled={isUploadingAvatar}
						>
							Cancel
						</Button>
						<Button 
							variant="primary" 
							className="flex-1"
							onClick={handleUploadAvatar}
							loading={isUploadingAvatar}
							disabled={!selectedFile}
						>
							Upload Image
						</Button>
					</div>
				</div>
			</Modal>

			{/* Delete Image Confirmation Modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete Profile Image"
				size="sm"
			>
				<div className="space-y-6">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-500">
							<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
						<p className="text-gray-500 mt-2">
							Do you really want to delete your profile image? This action cannot be undone.
						</p>
					</div>

					<div className="flex gap-3">
						<Button 
							variant="ghost" 
							className="flex-1"
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Cancel
						</Button>
						<Button 
							variant="danger" 
							className="flex-1"
							onClick={handleDeleteAvatar}
						>
							Delete
						</Button>
					</div>
				</div>
			</Modal>

			{/* Delete Account Confirmation Modal */}
			<Modal
				isOpen={isAccountDeleteModalOpen}
				onClose={() => setIsAccountDeleteModalOpen(false)}
				title="Deactivate Account"
				size="sm"
			>
				<div className="space-y-6">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 text-red-600">
							<TrashIcon className="w-8 h-8" />
						</div>
						<h3 className="text-xl font-bold text-gray-900">Are you absolutely sure?</h3>
						<p className="text-gray-500 mt-2 text-sm leading-relaxed px-4">
							This will deactivate your account and hide your profile. You can reactivate it later by logging back in.
						</p>
					</div>

					<div className="flex gap-3">
						<Button 
							variant="ghost" 
							className="flex-1"
							onClick={() => setIsAccountDeleteModalOpen(false)}
							disabled={isDeletingAccount}
						>
							Cancel
						</Button>
						<Button 
							variant="danger" 
							className="flex-1"
							onClick={handleAccountDeletion}
							loading={isDeletingAccount}
						>
							Deactivate
						</Button>
					</div>
				</div>
			</Modal>

			{/* Info Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Account Overview */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className="md:col-span-1"
				>
					<Card variant="elevated" className="h-full">
						<Card.Header>
							<Card.Title>Account Overview</Card.Title>
						</Card.Header>
						<Card.Content className="space-y-4">
							<div className="p-4 rounded-xl bg-gray-50">
								<p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
									Member Since
								</p>
								<p className="text-gray-900 font-medium mt-1">{memberSince}</p>
							</div>
							<div className="p-4 rounded-xl bg-gray-50">
								<p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
									Account Status
								</p>
								<div className="flex items-center gap-2 mt-1">
									<div className={`w-2 h-2 rounded-full ${userData?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
									<p className="text-gray-900 font-medium capitalize">{userData?.status || 'active'}</p>
								</div>
							</div>
						</Card.Content>
					</Card>
				</motion.div>

				{/* Personal Details Form */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
					className="md:col-span-2"
				>
					<Card variant="elevated">
						<Card.Header>
							<Card.Title>Personal Information</Card.Title>
						</Card.Header>
						<Card.Content>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<Input
										label="First Name"
										disabled={!isEditing || isUpdating}
										icon={<UserIcon />}
										error={errors.firstName?.message}
										{...register('firstName', {
											required: 'First name is required',
											minLength: { value: 3, message: 'Minimum 3 characters' }
										})}
									/>
									<Input
										label="Last Name"
										disabled={!isEditing || isUpdating}
										error={errors.lastName?.message}
										{...register('lastName', {
											required: 'Last name is required',
											minLength: { value: 3, message: 'Minimum 3 characters' }
										})}
									/>
									<Input
										label="Email Address"
										type="email"
										disabled={!isEditing || isUpdating}
										error={errors.email?.message}
										{...register('email', {
											required: 'Email is required',
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: 'Invalid email address'
											}
										})}
									/>
									<Input
										label="Phone Number"
										disabled={!isEditing || isUpdating}
										error={errors.phoneNumber?.message}
										{...register('phoneNumber', {
											required: 'Phone number is required'
										})}
									/>
								</div>

								{isEditing && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100"
									>
										<Button 
											variant="ghost" 
											type="button"
											onClick={() => {
												setIsEditing(false);
												reset();
											}}
											disabled={isUpdating}
										>
											Cancel
										</Button>
										<Button 
											variant="primary" 
											type="submit"
											loading={isUpdating}
										>
											Save Changes
										</Button>
									</motion.div>
								)}
							</form>
						</Card.Content>
					</Card>
				</motion.div>
				{/* Security & Password Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="md:col-span-3"
				>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Password & Security Card */}
						<Card variant="elevated" className="lg:col-span-2">
							<Card.Header className="flex flex-row items-center justify-between border-b border-gray-100">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
										<ShieldIcon className="w-5 h-5" />
									</div>
									<Card.Title>Security Settings</Card.Title>
								</div>
								{!isChangingPassword && (
									<Button
										variant="secondary"
										size="sm"
										onClick={() => setIsChangingPassword(true)}
									>
										Change Password
									</Button>
								)}
							</Card.Header>
							<Card.Content className="pt-6">
								{!isChangingPassword ? (
									<div className="space-y-4">
										<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
													<LockIcon className="w-6 h-6" />
												</div>
												<div>
													<p className="font-semibold text-gray-900">Password Control</p>
													<p className="text-sm text-gray-500">Regularly update your password to stay secure.</p>
												</div>
											</div>
											<div className="text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold shrink-0">
												<div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
												SECURE
											</div>
										</div>
										
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
											<div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
												<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Change</p>
												<p className="text-sm font-medium text-gray-700">6 months ago</p>
											</div>
											<div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
												<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Security Score</p>
												<div className="flex items-center gap-2">
													<div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
														<div className="h-full bg-emerald-500 w-[85%]" />
													</div>
													<span className="text-xs font-bold text-emerald-600">85%</span>
												</div>
											</div>
										</div>
									</div>
								) : (
									<form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
											<div className="sm:col-span-2">
												<Input
													type="password"
													label="Current Password"
													placeholder="Enter your current password"
													error={passwordErrors.currentPassword?.message}
													{...passwordRegister('currentPassword', {
														required: 'Current password is required',
													})}
												/>
											</div>
											<Input
												type="password"
												label="New Password"
												placeholder="Minimum 8 characters"
												error={passwordErrors.newPassword?.message}
												{...passwordRegister('newPassword', {
													required: 'New password is required',
													minLength: { value: 8, message: 'Minimum 8 characters' },
													validate: (value) => {
														const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
														return strongRegex.test(value) || 'Must contain uppercase, lowercase, number and special character';
													}
												})}
											/>
											<Input
												type="password"
												label="Confirm New Password"
												placeholder="Repeat your new password"
												error={passwordErrors.confirmPassword?.message}
												{...passwordRegister('confirmPassword', {
													required: 'Please confirm your new password',
													validate: (value) => 
														value === watchPassword('newPassword') || 'Passwords do not match'
												})}
											/>
										</div>
										
										<div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
											<Button 
												variant="ghost" 
												type="button"
												onClick={() => {
													setIsChangingPassword(false);
													resetPasswordForm();
												}}
												disabled={isUpdatingPassword}
											>
												Cancel
											</Button>
											<Button 
												variant="primary" 
												type="submit"
												loading={isUpdatingPassword}
											>
												Update Password
											</Button>
										</div>
									</form>
								)}
							</Card.Content>
						</Card>

						{/* Account Actions Card */}
						<Card variant="elevated">
							<Card.Header>
								<Card.Title>Account Control</Card.Title>
							</Card.Header>
							<Card.Content className="space-y-6">
								<div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
									<p className="text-sm font-semibold text-orange-800 mb-1">Session Management</p>
									<p className="text-xs text-orange-600 mb-4">You are currently logged into this device.</p>
									<Button variant="outline" size="sm" className="w-full bg-white border-orange-200 text-orange-700 hover:bg-orange-100">
										Log out everywhere
									</Button>
								</div>

								<div className="pt-6 border-t border-gray-100">
									<p className="text-sm font-semibold text-red-600 mb-2">Danger Zone</p>
									<p className="text-xs text-gray-500 mb-4">
										Deleting your account will deactivate your profile. All your data will be archived.
									</p>
									<Button 
										variant="danger" 
										size="sm" 
										className="w-full"
										onClick={() => setIsAccountDeleteModalOpen(true)}
									>
										Deactivate Account
									</Button>
								</div>
							</Card.Content>
						</Card>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default PersonalDetailsPage;
