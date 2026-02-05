import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './index.js';
import { HomeIcon } from '../constants/icons.jsx';

const PageNotFound = () => {
	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-indigo-50 to-purple-50 
			flex items-center justify-center p-4">
			{/* Decorative background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 rounded-full 
					bg-linear-to-br from-indigo-400 to-purple-500 opacity-20 blur-3xl" />
				<div className="absolute bottom-20 -left-20 w-60 h-60 rounded-full 
					bg-linear-to-br from-cyan-400 to-blue-500 opacity-15 blur-3xl" />
			</div>

			<motion.div
				className="relative z-10 text-center max-w-lg mx-auto"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* 404 Number */}
				<motion.div
					className="relative mb-8"
					initial={{ scale: 0.5 }}
					animate={{ scale: 1 }}
					transition={{ type: 'spring', delay: 0.2 }}
				>
					<h1 className="text-[150px] sm:text-[200px] font-black leading-none
						bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 
						bg-clip-text text-transparent">
						404
					</h1>
					{/* Floating emoji */}
					<motion.span
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
							text-6xl sm:text-8xl"
						animate={{
							y: [0, -15, 0],
							rotate: [0, -5, 5, 0],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					>
						🔍
					</motion.span>
				</motion.div>

				{/* Message */}
				<motion.h2
					className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					Oops! Page Not Found
				</motion.h2>

				<motion.p
					className="text-gray-500 mb-8 px-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
				>
					The page you're looking for seems to have wandered off into the digital wilderness.
					Don't worry, let's get you back on track!
				</motion.p>

				{/* Buttons */}
				<motion.div
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<Link to="/">
						<Button
							variant="primary"
							size="lg"
							icon={<HomeIcon className="w-5 h-5" />}
						>
							Go Home
						</Button>
					</Link>
					<Button
						variant="secondary"
						size="lg"
						onClick={() => window.history.back()}
					>
						Go Back
					</Button>
				</motion.div>

				{/* Helpful links */}
				<motion.div
					className="mt-12 pt-8 border-t border-gray-200"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
				>
					<p className="text-sm text-gray-400 mb-4">Or try these helpful links:</p>
					<div className="flex flex-wrap justify-center gap-4 text-sm">
						{[
							{ label: 'Products', path: '/' },
							{ label: 'Categories', path: '/' },
							{ label: 'Contact', path: '/' },
							{ label: 'Help', path: '/' },
						].map((link) => (
							<Link
								key={link.label}
								to={link.path}
								className="text-indigo-600 hover:text-indigo-700 
									font-medium hover:underline transition-colors"
							>
								{link.label}
							</Link>
						))}
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default PageNotFound;
