import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../shared/widgets/Sidebar/index.js';
import useCurrentUser from '../features/user/hooks/useCurrentUser.js';
import { roleThemes } from '../shared/constants/theme.js';

const DashboardLayout = () => {
	const { userRole } = useCurrentUser();
	const roleTheme = roleThemes[userRole] || roleThemes.Customer;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
			{/* Decorative background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* Gradient orbs */}
				<div
					className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
					style={{ background: roleTheme.gradient }}
				/>
				<div
					className="absolute top-1/2 -left-20 w-60 h-60 rounded-full opacity-10 blur-3xl"
					style={{ background: roleTheme.gradient }}
				/>
				<div
					className="absolute bottom-20 right-1/4 w-40 h-40 rounded-full opacity-15 blur-2xl"
					style={{ background: roleTheme.gradient }}
				/>

				{/* Subtle grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `
							linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
							linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
						`,
						backgroundSize: '50px 50px',
					}}
				/>
			</div>

			{/* Main layout */}
			<div className="flex relative">
				{/* Sidebar */}
				<Sidebar />

				{/* Main content area */}
				<main className="flex-1 min-h-screen md:ml-0">
					<div className="p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							className="max-w-7xl mx-auto"
						>
							<Outlet />
						</motion.div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
