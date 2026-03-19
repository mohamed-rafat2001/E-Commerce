import { motion } from 'framer-motion';
import { Button } from '../../../shared/ui/index.js';
import { SettingsIcon } from '../../../shared/constants/icons.jsx';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';
import { roleThemes } from '../../../shared/constants/theme.js';
import SettingsSectionCard from '../components/SettingsSectionCard.jsx';

const SETTINGS_SECTIONS = [
	{
		title: 'Appearance',
		description: 'Customize how the app looks',
		settings: [
			{ name: 'Dark Mode', description: 'Switch to dark theme for reduced eye strain', type: 'toggle', enabled: false },
			{ name: 'Compact View', description: 'Show more content with smaller spacing', type: 'toggle', enabled: false },
		],
	},
	{
		title: 'Notifications',
		description: 'Manage how you receive updates',
		settings: [
			{ name: 'Email Notifications', description: 'Receive updates via email', type: 'toggle', enabled: true },
			{ name: 'Push Notifications', description: 'Get instant notifications in your browser', type: 'toggle', enabled: true },
			{ name: 'SMS Alerts', description: 'Receive important alerts via SMS', type: 'toggle', enabled: false },
		],
	},
	{
		title: 'Privacy & Security',
		description: 'Protect your account',
		settings: [
			{ name: 'Two-Factor Authentication', description: 'Require a second form of verification', type: 'button', buttonText: 'Setup' },
			{ name: 'Active Sessions', description: 'Manage devices where you are logged in', type: 'button', buttonText: 'View' },
			{ name: 'Download My Data', description: 'Get a copy of all your data', type: 'button', buttonText: 'Request' },
		],
	},
];

const SettingsPage = () => {
	const { userRole } = useCurrentUser();
	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
					<p className="text-gray-500 mt-1">Manage your account preferences and application settings.</p>
				</div>
				<div className={`p-3 rounded-2xl bg-linear-to-br ${roleTheme.color} text-white shadow-lg`}>
					<SettingsIcon className="w-6 h-6" />
				</div>
			</motion.div>

			<div className="space-y-6">
				{SETTINGS_SECTIONS.map((section, i) => (
					<SettingsSectionCard key={section.title} section={section} sectionIndex={i} />
				))}
			</div>

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
				<div className="flex items-center gap-3 text-sm text-gray-500">
					<div className="w-2 h-2 rounded-full bg-green-500" /> Last saved today at 2:45 PM
				</div>
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<Button variant="ghost" className="flex-1 sm:flex-none">Discard Changes</Button>
					<Button variant="primary" className="flex-1 sm:flex-none">Save All Settings</Button>
				</div>
			</motion.div>
		</div>
	);
};

export default SettingsPage;
