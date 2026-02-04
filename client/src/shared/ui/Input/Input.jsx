import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(
	(
		{
			label,
			error,
			icon = null,
			iconPosition = 'left',
			className = '',
			containerClassName = '',
			type = 'text',
			disabled = false,
			...props
		},
		ref
	) => {
		const baseInputClasses =
			'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed';

		const errorClasses = error
			? 'border-red-500 focus:ring-red-500'
			: '';

		const iconClasses = icon
			? iconPosition === 'left'
				? 'pl-11'
				: 'pr-11'
			: '';

		return (
			<motion.div
				className={`relative ${containerClassName}`}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
			>
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{label}
					</label>
				)}
				<div className="relative">
					{icon && iconPosition === 'left' && (
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
							{icon}
						</span>
					)}
					<input
						ref={ref}
						type={type}
						className={`${baseInputClasses} ${errorClasses} ${iconClasses} ${className}`}
						disabled={disabled}
						{...props}
					/>
					{icon && iconPosition === 'right' && (
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
							{icon}
						</span>
					)}
				</div>
				{error && (
					<motion.p
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-2 text-sm text-red-500"
					>
						{error}
					</motion.p>
				)}
			</motion.div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
