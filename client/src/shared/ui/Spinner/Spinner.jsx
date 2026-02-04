import { motion } from 'framer-motion';

const Spinner = ({
	size = 'md',
	color = 'indigo',
	className = '',
}) => {
	const sizes = {
		xs: 'w-4 h-4',
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
		xl: 'w-16 h-16',
	};

	const colors = {
		indigo: 'border-indigo-500',
		white: 'border-white',
		gray: 'border-gray-500',
		green: 'border-emerald-500',
		red: 'border-red-500',
	};

	return (
		<motion.div
			className={`${sizes[size]} border-4 border-t-transparent rounded-full ${colors[color]} ${className}`}
			animate={{ rotate: 360 }}
			transition={{
				duration: 1,
				repeat: Infinity,
				ease: 'linear',
			}}
		/>
	);
};

const LoadingOverlay = ({ message = 'Loading...', fullScreen = true }) => {
	const containerClasses = fullScreen
		? 'fixed inset-0 z-50'
		: 'absolute inset-0 z-10';

	return (
		<motion.div
			className={`${containerClasses} flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Spinner size="lg" />
			{message && (
				<motion.p
					className="mt-4 text-gray-600 font-medium"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					{message}
				</motion.p>
			)}
		</motion.div>
	);
};

const SkeletonLoader = ({
	height = 'h-4',
	width = 'w-full',
	rounded = 'rounded',
	className = '',
}) => {
	return (
		<div
			className={`${height} ${width} ${rounded} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse ${className}`}
		/>
	);
};

const CardSkeleton = ({ className = '' }) => {
	return (
		<div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
			<div className="flex items-center space-x-4 mb-4">
				<SkeletonLoader height="h-12" width="w-12" rounded="rounded-full" />
				<div className="flex-1">
					<SkeletonLoader height="h-4" width="w-3/4" className="mb-2" />
					<SkeletonLoader height="h-3" width="w-1/2" />
				</div>
			</div>
			<SkeletonLoader height="h-4" className="mb-2" />
			<SkeletonLoader height="h-4" width="w-5/6" className="mb-2" />
			<SkeletonLoader height="h-4" width="w-2/3" />
		</div>
	);
};

export { Spinner, LoadingOverlay, SkeletonLoader, CardSkeleton };
export default Spinner;
