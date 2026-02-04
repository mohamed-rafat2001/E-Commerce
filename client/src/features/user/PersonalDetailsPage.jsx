import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input, Avatar, Badge } from '../../shared/ui/index.js';
import useCurrentUser from './hooks/useCurrentUser.js';
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
							>
								{isEditing ? 'Cancel' : 'Edit Profile'}
							</Button>
						</div>
					</div>
				</Card>
			</motion.div>

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
								<p className="text-gray-900 font-medium mt-1">January 2024</p>
							</div>
							<div className="p-4 rounded-xl bg-gray-50">
								<p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
									Account Status
								</p>
								<div className="flex items-center gap-2 mt-1">
									<div className="w-2 h-2 rounded-full bg-green-500" />
									<p className="text-gray-900 font-medium">Verified</p>
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
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<Input
									label="First Name"
									defaultValue={userInfo.firstName}
									disabled={!isEditing}
									icon={<UserIcon />}
								/>
								<Input
									label="Last Name"
									defaultValue={userInfo.lastName}
									disabled={!isEditing}
								/>
								<Input
									label="Email Address"
									type="email"
									defaultValue={userInfo.email}
									disabled={!isEditing}
								/>
								<Input
									label="Phone Number"
									defaultValue={userInfo.phone}
									disabled={!isEditing}
								/>
								<div className="sm:col-span-2">
									<Input
										label="Street Address"
										defaultValue={userInfo.address}
										disabled={!isEditing}
									/>
								</div>
								<Input
									label="Date of Birth"
									type="date"
									defaultValue={userInfo.dateOfBirth}
									disabled={!isEditing}
								/>
							</div>

							{isEditing && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100"
								>
									<Button variant="ghost" onClick={() => setIsEditing(false)}>
										Reset Changes
									</Button>
									<Button variant="primary">Save Changes</Button>
								</motion.div>
							)}
						</Card.Content>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default PersonalDetailsPage;
