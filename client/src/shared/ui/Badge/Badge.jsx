import { motion } from 'framer-motion';

const variants = {
	primary: 'bg-indigo-100 text-indigo-700',
	secondary: 'bg-gray-100 text-gray-700',
	success: 'bg-emerald-100 text-emerald-700',
	warning: 'bg-amber-100 text-amber-700',
	danger: 'bg-red-100 text-red-700',
	info: 'bg-sky-100 text-sky-700',
	gradient:
		'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
};

const sizes = {
	sm: 'px-2 py-0.5 text-xs',
	md: 'px-2.5 py-1 text-sm',
	lg: 'px-3 py-1.5 text-base',
};

const Badge = ({
	children,
	variant = 'primary',
	size = 'md',
	className = '',
	dot = false,
	icon = null,
	animate = true,
}) => {
	const baseClasses =
		'inline-flex items-center font-medium rounded-full whitespace-nowrap cursor-default';

	const Component = animate ? motion.span : 'span';
	const animationProps = animate
		? {
				initial: { scale: 0.8, opacity: 0 },
				animate: { scale: 1, opacity: 1 },
				transition: { type: 'spring', stiffness: 500, damping: 25 },
		  }
		: {};

	return (
		<Component
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
			{...animationProps}
		>
			{dot && (
				<span
					className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
						variant === 'gradient' ? 'bg-white' : 'bg-current'
					}`}
				></span>
			)}
			{icon && <span className="mr-1">{icon}</span>}
			{children}
		</Component>
	);
};

export default Badge;
