export const theme = {
	// ─── COLORS ───────────────────────────────────────────────
	colors: {
		primary: "bg-primary text-white",
		primaryHover: "hover:bg-primary-dark",
		primaryText: "text-primary",
		primaryBg: "bg-primary-light",
		primaryBorder: "border-primary",
		accent: "text-accent",
		accentBg: "bg-accent",

		textMain: "text-gray-900",
		textMuted: "text-gray-500",
		textLight: "text-gray-400",
		textInverse: "text-white",

		bgPage: "bg-gray-50",
		bgCard: "bg-white",
		bgSoft: "bg-gray-100",
		bgDark: "bg-gray-900",
		bgSidebar: "bg-white",
		border: "border-gray-200",
		borderDark: "border-gray-300",

		success: "text-green-600", successBg: "bg-green-50",
		warning: "text-yellow-600", warningBg: "bg-yellow-50",
		error: "text-red-600", errorBg: "bg-red-50",
		info: "text-blue-600", infoBg: "bg-blue-50",
	},

	// ─── TYPOGRAPHY ───────────────────────────────────────────
	typography: {
		displayFont: "font-display",
		bodyFont: "font-body",
		heroTitle: "text-5xl md:text-7xl font-extrabold tracking-tight font-display",
		pageTitle: "text-2xl md:text-3xl font-bold tracking-tight font-display",
		sectionTitle: "text-xl md:text-2xl font-semibold font-display",
		cardTitle: "text-base md:text-lg font-semibold",
		label: "text-sm font-medium text-gray-700",
		body: "text-base leading-relaxed",
		small: "text-sm leading-relaxed",
		tiny: "text-xs",
		tableHeader: "text-xs font-semibold uppercase tracking-wider text-gray-500",
	},

	// ─── SPACING ──────────────────────────────────────────────
	spacing: {
		sectionY: "py-20 md:py-28",
		sectionX: "px-4 md:px-8",
		container: "max-w-7xl mx-auto",
		pageY: "py-6 md:py-8",
		pageX: "px-4 md:px-6",
		panelContainer: "max-w-screen-xl mx-auto",
		cardPadding: "p-4 md:p-6",
		gridGap: "gap-4 md:gap-6",
		gridGapLarge: "gap-6 md:gap-10",
	},

	// ─── BORDER RADIUS ────────────────────────────────────────
	radius: {
		card: "rounded-2xl",
		panel: "rounded-xl",
		button: "rounded-lg",
		badge: "rounded-full",
		input: "rounded-lg",
		image: "rounded-xl",
		avatar: "rounded-full",
		table: "rounded-xl",
		modal: "rounded-2xl",
	},

	// ─── SHADOWS ──────────────────────────────────────────────
	shadow: {
		card: "shadow-sm border border-gray-200",
		cardHover: "shadow-md",
		panel: "shadow-sm",
		dropdown: "shadow-lg",
		modal: "shadow-2xl",
		sidebar: "shadow-sm border-r border-gray-200",
		table: "shadow-sm border border-gray-200",
	},

	// ─── TRANSITIONS ──────────────────────────────────────────
	transition: {
		default: "transition-all duration-300 ease-in-out",
		fast: "transition-all duration-150 ease-in-out",
		slow: "transition-all duration-500 ease-in-out",
	},
};
export const roleThemes = {
	Admin: {
		primary: "indigo",
		gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
		colorClass: "text-indigo-600",
		bgClass: "bg-indigo-50",
	},
	Seller: {
		primary: "emerald",
		gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
		colorClass: "text-emerald-600",
		bgClass: "bg-emerald-50",
	},
	Customer: {
		primary: "blue",
		gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		colorClass: "text-blue-600",
		bgClass: "bg-blue-50",
	}
};
