/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			xs: "375px",
			sm: "480px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				display: ['"Plus Jakarta Sans"', 'serif'],
				body: ['Inter', 'sans-serif'],
			},
			colors: {
				primary: {
					50: '#f0f4ff',
					100: '#e0e9fe',
					200: '#c1d4fe',
					300: '#91b4fd',
					400: '#5a89fa',
					500: '#325df5',
					600: '#1d3ee9',
					700: '#162fd1',
					800: '#1827a9',
					900: '#192686',
					950: '#003BB3',
					DEFAULT: '#003BB3',
					dark: '#002D8A',
					light: '#E6EFFF'
				},
				accent: {
					DEFAULT: '#72F1DE',
					dark: '#5EEAD4',
					light: '#E0FFF9'
				}
			},
			boxShadow: {
				'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
				'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
				'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
				'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'gradient': 'gradient 15s ease infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.3)' },
					'50%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' },
				},
				gradient: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem',
			},
		},
	},
	plugins: [],
};
