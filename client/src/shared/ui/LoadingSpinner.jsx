import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
	const sizes = {
		sm: 'w-6 h-6 border-2',
		md: 'w-10 h-10 border-3',
		lg: 'w-16 h-16 border-4',
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
			<motion.div
				className={`${sizes[size]} rounded-full border-indigo-500 border-t-transparent`}
				animate={{ rotate: 360 }}
				transition={{
					duration: 1,
					repeat: Infinity,
					ease: 'linear',
				}}
			/>
			{message && (
				<motion.p
					className="text-gray-500 font-medium"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					{message}
				</motion.p>
			)}
		</div>
	);
};

export default LoadingSpinner;
