import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, Avatar, Badge } from '../../shared/ui/index.js';
import useCurrentUser from '../../hooks/useCurrentUser.js';
import { roleThemes } from '../../shared/constants/theme.js';
import { UserIcon } from '../../shared/constants/icons.jsx';

const PersonalDetailsPage = () => {
	const { user, userRole } = useCurrentUser();
	const [isEditing, setIsEditing] = useState(false);
	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	const fullName = user?.userId
		? `${user.userId.firstName} ${user.userId.lastName}`
		: 'User';

	const userInfo = {
		firstName: user?.userId?.firstName || '',
		lastName: user?.userId?.lastName || '',
		email: user?.userId?.email || '',
		phone: user?.userId?.phone || '+1 (555) 123-4567',
		address: user?.userId?.address || '123 Main Street, New York, NY 10001',
		dateOfBirth: user?.userId?.dateOfBirth || '1990-01-15',
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
					className="relative overflow-hidden"
				>
					{/* Background gradient */}
					<div
						className="h-32 sm:h-40"
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
							{/* Avatar */}
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: 'spring', delay: 0.2 }}
								className="relative"
							>
								<Avatar
									name={fullName}
									size="2xl"
									ring
									ringColor="ring-white"
									className="border-4 border-white shadow-xl"
								/>
								<motion.button
									className="absolute bottom-2 right-2 w-8 h-8 rounded-full 
										bg-white shadow-lg flex items-center justify-center
										hover:bg-gray-50 transition-colors"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								</motion.button>
							</motion.div>

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
								className="mt-4 sm:mt-0"
							>
								{isEditing ? 'Cancel' : 'Edit Profile'}
							</Button>
						</div>
					</div>
				</Card>
			</motion.div>

			{/* Personal Information Form */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<Card variant="elevated">
					<Card.Header>
						<div className="flex items-center gap-3">
							<div
								className="p-2 rounded-lg"
								style={{ background: roleTheme.gradient }}
							>
								<UserIcon className="w-5 h-5 text-white" />
							</div>
							<div>
								<Card.Title>Personal Information</Card.Title>
								<Card.Description>
									Manage your account details and preferences
								</Card.Description>
							</div>
						</div>
					</Card.Header>

					<Card.Content>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								label="First Name"
								value={userInfo.firstName}
								disabled={!isEditing}
								placeholder="Enter your first name"
							/>
							<Input
								label="Last Name"
								value={userInfo.lastName}
								disabled={!isEditing}
								placeholder="Enter your last name"
							/>
							<Input
								label="Email Address"
								type="email"
								value={userInfo.email}
								disabled={!isEditing}
								placeholder="your.email@example.com"
							/>
							<Input
								label="Phone Number"
								type="tel"
								value={userInfo.phone}
								disabled={!isEditing}
								placeholder="+1 (555) 123-4567"
							/>
							<Input
								label="Date of Birth"
								type="date"
								value={userInfo.dateOfBirth}
								disabled={!isEditing}
								containerClassName="md:col-span-2 md:w-1/2"
							/>
							<Input
								label="Address"
								value={userInfo.address}
								disabled={!isEditing}
								placeholder="Enter your full address"
								containerClassName="md:col-span-2"
							/>
						</div>

						{isEditing && (
							<motion.div
								className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<Button
									variant="secondary"
									onClick={() => setIsEditing(false)}
								>
									Cancel
								</Button>
								<Button
									variant="primary"
									onClick={() => {
										// Handle save logic
										setIsEditing(false);
									}}
								>
									Save Changes
								</Button>
							</motion.div>
						)}
					</Card.Content>
				</Card>
			</motion.div>

			{/* Additional Settings */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<Card variant="elevated">
					<Card.Header>
						<Card.Title>Account Settings</Card.Title>
						<Card.Description>
							Manage your security and preferences
						</Card.Description>
					</Card.Header>

					<Card.Content className="space-y-4">
						{[
							{
								title: 'Change Password',
								description: 'Update your password regularly for security',
								action: 'Change',
							},
							{
								title: 'Two-Factor Authentication',
								description: 'Add an extra layer of security to your account',
								action: 'Enable',
							},
							{
								title: 'Email Notifications',
								description: 'Get notified about orders, promotions, and more',
								action: 'Manage',
							},
						].map((item, index) => (
							<motion.div
								key={item.title}
								className="flex flex-col sm:flex-row sm:items-center justify-between 
									gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 + index * 0.05 }}
							>
								<div>
									<h4 className="font-semibold text-gray-900">{item.title}</h4>
									<p className="text-sm text-gray-500">{item.description}</p>
								</div>
								<Button variant="outline" size="sm">
									{item.action}
								</Button>
							</motion.div>
						))}
					</Card.Content>
				</Card>
			</motion.div>
		</div>
	);
};

export default PersonalDetailsPage;
