import React from 'react';

const variants = {
	default: "bg-gray-100 text-gray-600",
	primary: "bg-indigo-50 text-indigo-600",
	success: "bg-green-50 text-green-700",
	warning: "bg-yellow-50 text-yellow-700",
	error: "bg-red-50 text-red-600",
	info: "bg-blue-50 text-blue-700",
	new: "bg-emerald-500 text-white",
	sale: "bg-red-500 text-white",
	featured: "bg-yellow-400 text-yellow-900"
};

const Badge = ({
	label,
	variant = "default",
	className = "",
	children
}) => {
	return (
		<span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center ${variants[variant]} ${className}`}>
			{label || children}
		</span>
	);
};

export default Badge;
