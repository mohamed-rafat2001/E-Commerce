import { motion } from 'framer-motion';

const variants = {
	primary:
		'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl',
	secondary:
		'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm',
	success:
		'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl',
	danger:
		'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-lg hover:shadow-xl',
	ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
	outline:
		'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50',
};

const sizes = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg',
	xl: 'px-8 py-4 text-xl',
};

const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	className = '',
	disabled = false,
	loading = false,
	icon = null,
	iconPosition = 'left',
	fullWidth = false,
	...props
}) => {
	const baseClasses =
		'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

	return (
		<motion.button
			whileHover={disabled ? {} : { scale: 1.02 }}
			whileTap={disabled ? {} : { scale: 0.98 }}
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
				fullWidth ? 'w-full' : ''
			} ${className}`}
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			)}
			{icon && iconPosition === 'left' && !loading && (
				<span className="mr-2">{icon}</span>
			)}
			{children}
			{icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
		</motion.button>
	);
};

export default Button;
