import React from 'react';

const variants = {
	primary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm",
	secondary: "bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200",
	accent: "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 shadow-sm",
	outline: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
	ghost: "bg-transparent border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
	danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
	success: "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100",
	premium: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-lg"
};

const sizes = {
	sm: "px-3 py-1.5 text-sm rounded-xl",
	md: "px-4 py-2 text-sm rounded-xl",
	lg: "px-6 py-3 text-base rounded-2xl",
};

const Button = ({
	variant = "primary",
	size = "md",
	icon,
	iconPosition = "left",
	isLoading = false,
	loading = false, // Alias for isLoading
	disabled = false,
	fullWidth = false,
	className = "",
	children,
	...props
}) => {
	const activeLoading = isLoading || loading;

	return (
		<button
			disabled={disabled || activeLoading}
			className={`inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
			{...props}
		>
			{activeLoading ? (
				<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			) : (
				<>
					{icon && iconPosition === "left" && <span className="mr-2 flex items-center justify-center shrink-0">{icon}</span>}
					{children}
					{icon && iconPosition === "right" && <span className="ml-2 flex items-center justify-center shrink-0">{icon}</span>}
				</>
			)}
		</button>
	);
};

export default Button;
