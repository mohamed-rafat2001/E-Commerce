// Theme configuration constants
export const colors = {
	primary: {
		50: '#eef2ff',
		100: '#e0e7ff',
		200: '#c7d2fe',
		300: '#a5b4fc',
		400: '#818cf8',
		500: '#6366f1',
		600: '#4f46e5',
		700: '#4338ca',
		800: '#3730a3',
		900: '#312e81',
	},
	secondary: {
		50: '#f0fdf4',
		100: '#dcfce7',
		200: '#bbf7d0',
		300: '#86efac',
		400: '#4ade80',
		500: '#22c55e',
		600: '#16a34a',
		700: '#15803d',
		800: '#166534',
		900: '#14532d',
	},
	accent: {
		50: '#fff7ed',
		100: '#ffedd5',
		200: '#fed7aa',
		300: '#fdba74',
		400: '#fb923c',
		500: '#f97316',
		600: '#ea580c',
		700: '#c2410c',
		800: '#9a3412',
		900: '#7c2d12',
	},
	neutral: {
		50: '#f8fafc',
		100: '#f1f5f9',
		200: '#e2e8f0',
		300: '#cbd5e1',
		400: '#94a3b8',
		500: '#64748b',
		600: '#475569',
		700: '#334155',
		800: '#1e293b',
		900: '#0f172a',
		950: '#020617',
	},
};

export const gradients = {
	primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	secondary: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
	accent: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
	dark: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
	glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
	admin: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	seller: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
	customer: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
};

export const shadows = {
	sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
	md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
	lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
	xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
	glow: '0 0 20px rgba(99, 102, 241, 0.3)',
	glowGreen: '0 0 20px rgba(34, 197, 94, 0.3)',
	glowOrange: '0 0 20px rgba(249, 115, 22, 0.3)',
};

export const animations = {
	springIn: {
		type: 'spring',
		stiffness: 260,
		damping: 20,
	},
	fadeIn: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		transition: { duration: 0.3 },
	},
	slideInLeft: {
		initial: { x: -20, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		transition: { duration: 0.3 },
	},
	slideInRight: {
		initial: { x: 20, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		transition: { duration: 0.3 },
	},
	slideInUp: {
		initial: { y: 20, opacity: 0 },
		animate: { y: 0, opacity: 1 },
		transition: { duration: 0.3 },
	},
	scaleIn: {
		initial: { scale: 0.9, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		transition: { duration: 0.2 },
	},
};

export const roleThemes = {
	Admin: {
		gradient: gradients.admin,
		primaryColor: colors.primary[600],
		accentColor: colors.primary[400],
		bgColor: colors.primary[50],
		icon: '👑',
		title: 'Administrator',
	},
	Seller: {
		gradient: gradients.seller,
		primaryColor: '#11998e',
		accentColor: '#38ef7d',
		bgColor: colors.secondary[50],
		icon: '🏪',
		title: 'Seller Dashboard',
	},
	Customer: {
		gradient: gradients.customer,
		primaryColor: '#4facfe',
		accentColor: '#00f2fe',
		bgColor: '#f0f9ff',
		icon: '🛒',
		title: 'My Account',
	},
};

export default {
	colors,
	gradients,
	shadows,
	animations,
	roleThemes,
};
