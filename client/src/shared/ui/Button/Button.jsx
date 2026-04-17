const variants = {
	primary: "bg-gray-900 hover:bg-gray-800 hover:text-white dark:bg-primary-500 dark:hover:bg-primary-400 dark:hover:text-white shadow-xl transition-all duration-300 uppercase font-black tracking-widest",
	secondary: "bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-300 uppercase font-black tracking-widest",
	accent: "bg-accent border border-accent hover:bg-gray-900 hover:text-white dark:bg-accent-dark dark:hover:bg-white dark:hover:text-gray-900 shadow-lg transition-all duration-300 uppercase font-black tracking-widest",
	outline: "bg-transparent border-2 border-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300 uppercase font-black tracking-widest",
	ghost: "bg-transparent hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200 font-bold",
	danger: "bg-red-600 hover:bg-red-700 hover:text-white dark:bg-red-500 dark:hover:bg-red-600 dark:hover:text-white shadow-sm uppercase font-black tracking-widest",
	success: "bg-emerald-600 hover:bg-emerald-700 hover:text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:hover:text-white shadow-sm uppercase font-black tracking-widest",
	premium: "bg-gray-900 hover:bg-gray-800 hover:text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white shadow-xl transition-all duration-300 font-black uppercase tracking-[0.2em]"
};

const variantTextColors = {
	primary: "text-white dark:text-white",
	secondary: "text-gray-900 dark:text-white",
	accent: "text-gray-900 dark:text-white",
	outline: "text-gray-900 dark:text-white",
	ghost: "text-gray-600 dark:text-gray-300",
	danger: "text-white dark:text-white",
	success: "text-white dark:text-white",
	premium: "text-white dark:text-white"
};

const sizes = {
	sm: "px-3 py-1.5 text-xs rounded-full min-h-[32px]",
	md: "px-5 py-2 text-sm rounded-full min-h-[36px]",
	lg: "px-6 py-2 text-base rounded-full min-h-[40px]",
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
	const isBaseTextColorToken = (token) =>
		/^!?text-(?:white|black|transparent|current|primary|accent|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})$/.test(token);
	const hasCustomBaseTextColor = className
		.split(/\s+/)
		.some((token) => {
			if (!token) return false;
			if (token.includes(':')) return false; // ignore hover:, dark:, md:, etc.
			return isBaseTextColorToken(token);
		});
	const resolvedTextColor = hasCustomBaseTextColor ? '' : (variantTextColors[variant] || variantTextColors.primary);

	return (
		<button
			disabled={disabled || activeLoading}
			className={`inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${resolvedTextColor} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
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
