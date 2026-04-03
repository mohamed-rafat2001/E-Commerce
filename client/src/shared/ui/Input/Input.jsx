import React from 'react';

const Input = ({
	label,
	placeholder,
	type = "text",
	value,
	onChange,
	error,
	hint,
	icon,
	disabled = false,
	className = "",
	...props
}) => {
	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
			<div className="relative">
				{icon && (
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
						{icon}
					</div>
				)}
				<input
					type={type}
					value={value}
					onChange={onChange}
					disabled={disabled}
					placeholder={placeholder}
					className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-150 ${icon ? 'pl-10' : ''} ${error ? 'border-red-300 dark:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-400/20 focus:border-red-500 dark:focus:border-red-400' : ''}`}
					{...props}
				/>
			</div>
			{error && <span className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</span>}
			{hint && !error && <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{hint}</span>}
		</div>
	);
};

export default Input;
