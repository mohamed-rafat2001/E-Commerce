import { motion } from 'framer-motion';

const variants = {
	default: 'bg-white border border-gray-200',
	elevated: 'bg-white shadow-lg hover:shadow-xl',
	glass:
		'bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl',
	gradient:
		'bg-gradient-to-br from-white to-gray-50 border border-gray-100',
	dark: 'bg-slate-800 text-white border border-slate-700',
};

const Card = ({
	children,
	variant = 'default',
	className = '',
	padding = 'p-6',
	animate = true,
	onClick = null,
	...props
}) => {
	const baseClasses = 'rounded-2xl transition-all duration-300';
	const interactiveClasses = onClick
		? 'cursor-pointer hover:scale-[1.02]'
		: '';

	const Component = animate ? motion.div : 'div';
	const animationProps = animate
		? {
				initial: { opacity: 0, y: 20 },
				animate: { opacity: 1, y: 0 },
				transition: { duration: 0.3 },
		  }
		: {};

	return (
		<Component
			className={`${baseClasses} ${variants[variant]} ${padding} ${interactiveClasses} ${className}`}
			onClick={onClick}
			{...animationProps}
			{...props}
		>
			{children}
		</Component>
	);
};

const CardHeader = ({ children, className = '' }) => (
	<div className={`mb-4 pb-4 border-b border-gray-100 ${className}`}>
		{children}
	</div>
);

const CardTitle = ({ children, className = '' }) => (
	<h3 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = '' }) => (
	<p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }) => (
	<div className={className}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
	<div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
		{children}
	</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
