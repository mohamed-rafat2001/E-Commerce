import { motion } from 'framer-motion';
import { Card, Button, Badge } from '../../shared/ui/index.js';
import { SettingsIcon } from '../../shared/constants/icons.jsx';
import useCurrentUser from '../../features/user/hooks/useCurrentUser.js';
import { roleThemes } from '../../shared/constants/theme.js';

const settingsSections = [
	{
		title: 'Appearance',
		description: 'Customize how the app looks',
		settings: [
			{
				name: 'Dark Mode',
				description: 'Switch to dark theme for reduced eye strain',
				type: 'toggle',
				enabled: false,
			},
			{
				name: 'Compact View',
				description: 'Show more content with smaller spacing',
				type: 'toggle',
				enabled: false,
			},
		],
	},
	{
		title: 'Notifications',
		description: 'Manage how you receive updates',
		settings: [
			{
				name: 'Email Notifications',
				description: 'Receive updates via email',
				type: 'toggle',
				enabled: true,
			},
			{
				name: 'Push Notifications',
				description: 'Get instant notifications in your browser',
				type: 'toggle',
				enabled: true,
			},
			{
				name: 'SMS Alerts',
				description: 'Receive important alerts via SMS',
				type: 'toggle',
				enabled: false,
			},
		],
	},
	{
		title: 'Privacy & Security',
		description: 'Protect your account',
		settings: [
			{
				name: 'Two-Factor Authentication',
				description: 'Require a second form of verification',
				type: 'button',
				buttonText: 'Setup',
			},
			{
				name: 'Active Sessions',
				description: 'Manage devices where you are logged in',
				type: 'button',
				buttonText: 'View',
			},
			{
				name: 'Download My Data',
				description: 'Get a copy of all your data',
				type: 'button',
				buttonText: 'Request',
			},
		],
	},
];

const Toggle = ({ enabled, onChange }) => (
	<motion.button
		className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-200 ${
			enabled ? 'bg-indigo-500' : 'bg-gray-300'
		}`}
		onClick={onChange}
		whileTap={{ scale: 0.95 }}
	>
		<motion.div
			className="w-5 h-5 bg-white rounded-full shadow-sm"
			animate={{ x: enabled ? 28 : 0 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
		/>
	</motion.button>
);

const SettingsPage = () => {
	const { userRole } = useCurrentUser();
	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			{/* Page Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center gap-4"
			>
				<div
					className="p-3 rounded-2xl shadow-lg"
					style={{ background: roleTheme.gradient }}
				>
					<SettingsIcon className="w-8 h-8 text-white" />
				</div>
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
					<p className="text-gray-500">Manage your preferences and account settings</p>
				</div>
			</motion.div>

			{/* Settings Sections */}
			{settingsSections.map((section, sectionIndex) => (
				<motion.div
					key={section.title}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: sectionIndex * 0.1 }}
				>
					<Card variant="elevated">
						<Card.Header>
							<Card.Title>{section.title}</Card.Title>
							<Card.Description>{section.description}</Card.Description>
						</Card.Header>
						<Card.Content className="space-y-4">
							{section.settings.map((setting, index) => (
								<motion.div
									key={setting.name}
									className="flex items-center justify-between p-4 rounded-xl 
										bg-gray-50/50 hover:bg-gray-100/50 transition-all"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 + index * 0.05 }}
								>
									<div className="flex-1 pr-4">
										<h4 className="font-semibold text-gray-900">{setting.name}</h4>
										<p className="text-sm text-gray-500">{setting.description}</p>
									</div>
									{setting.type === 'toggle' ? (
										<Toggle enabled={setting.enabled} onChange={() => {}} />
									) : (
										<Button variant="outline" size="sm">
											{setting.buttonText}
										</Button>
									)}
								</motion.div>
							))}
						</Card.Content>
					</Card>
				</motion.div>
			))}

			{/* Danger Zone */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<Card variant="elevated" className="border-2 border-red-100">
					<Card.Header>
						<div className="flex items-center gap-2">
							<Card.Title className="text-red-600">Danger Zone</Card.Title>
							<Badge variant="danger" size="sm">Caution</Badge>
						</div>
						<Card.Description>
							Irreversible and destructive actions
						</Card.Description>
					</Card.Header>
					<Card.Content className="space-y-4">
						<div className="flex flex-col sm:flex-row items-start sm:items-center 
							justify-between gap-4 p-4 rounded-xl bg-red-50/50">
							<div>
								<h4 className="font-semibold text-gray-900">Delete Account</h4>
								<p className="text-sm text-gray-500">
									Permanently delete your account and all associated data
								</p>
							</div>
							<Button variant="danger" size="sm">
								Delete Account
							</Button>
						</div>
					</Card.Content>
				</Card>
			</motion.div>
		</div>
	);
};

export default SettingsPage;
