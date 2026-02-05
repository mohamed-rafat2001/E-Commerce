import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, Button, Input, Avatar, Badge, Modal, Dropdown } from '../../../shared/ui/index.js';
import useCurrentUser from '../hooks/useCurrentUser.js';
import useUpdateUser from '../hooks/useUpdateUser.js';
import useUpdateAvatar from '../hooks/useUpdateAvatar.jsx';
import { roleThemes } from '../../../shared/constants/theme.js';
import { UserIcon } from '../../../shared/constants/icons.jsx';

const PersonalDetailsPage = () => {
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
	const fileInputRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			firstName: user?.userId?.firstName || '',
			lastName: user?.userId?.lastName || '',
			email: user?.userId?.email || '',
			phoneNumber: user?.userId?.phoneNumber || '',
		},
	});

	// Update form values when user data changes
	useEffect(() => {
		if (user?.userId) {
			reset({
				firstName: user.userId.firstName || '',
				lastName: user.userId.lastName || '',
				email: user.userId.email || '',
				phoneNumber: user.userId.phoneNumber || '',
			});
		}
	}, [user, reset]);

	const fullName = user?.userId
		? `${user.userId.firstName} ${user.userId.lastName}`
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
												src={user?.userId?.profileImg?.secure_url}
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
										disabled={!user?.userId?.profileImg?.secure_url}
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
									<div className={`w-2 h-2 rounded-full ${user?.userId?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
									<p className="text-gray-900 font-medium capitalize">{user?.userId?.status || 'active'}</p>
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
			</div>
		</div>
	);
};

export default PersonalDetailsPage;
