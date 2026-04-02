import React from 'react';

const variants = {
	primary: "bg-[#0f172a] text-white border border-[#0f172a] hover:bg-white hover:text-[#0f172a] shadow-2xl transition-all duration-300 uppercase font-black tracking-widest",
	secondary: "bg-white text-[#0f172a] border border-[#0f172a] hover:bg-[#0f172a] hover:text-white transition-all duration-300 uppercase font-black tracking-widest",
	accent: "bg-[#72F1DE] text-[#0f172a] border border-[#72F1DE] hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] shadow-lg transition-all duration-300 uppercase font-black tracking-widest",
	outline: "bg-transparent border-2 border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white transition-all duration-300 uppercase font-black tracking-widest",
	ghost: "bg-transparent text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a] transition-all duration-200 font-bold",
	danger: "bg-rose-500 text-white border border-rose-500 hover:bg-rose-600 shadow-sm uppercase font-black tracking-widest",
	success: "bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-600 shadow-sm uppercase font-black tracking-widest",
	premium: "bg-[#0f172a] text-white border border-[#0f172a] hover:bg-white hover:text-[#0f172a] shadow-[0_20px_40px_-15px_rgba(15,23,42,0.4)] transition-all duration-300 font-black uppercase tracking-[0.2em]"
};

const sizes = {
	sm: "px-4 py-2 text-xs rounded-full",
	md: "px-6 py-2.5 text-sm rounded-full",
	lg: "px-8 py-3.5 text-base rounded-full",
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
