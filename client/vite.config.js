import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss()],
	build: {
		// Use terser for better minification + drop console.log in production
		minify: 'terser',
		modulePreload: { polyfill: false },
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				passes: 2,
				unsafe_arrows: true,
			},
			format: {
				comments: false,
			},
		},
		// Enable CSS code splitting — each async chunk gets its own CSS
		cssCodeSplit: true,
		// Target modern browsers for smaller output
		target: 'es2020',
		rollupOptions: {
			output: {
				manualChunks: {
					// Core React runtime
					'vendor-react': ['react', 'react-dom'],
					// Routing
					'vendor-router': ['react-router-dom'],
					// Animations (heavy, defer loading)
					'vendor-animations': ['framer-motion', 'gsap', '@gsap/react', 'lenis'],
					// Sliders
					'vendor-slider': ['swiper'],
					// Icons
					'vendor-icons': ['react-icons'],
					// UI libs
					'vendor-ui': ['react-hot-toast', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
					// State management + data fetching
					'vendor-state': ['@reduxjs/toolkit', 'react-redux'],
					'vendor-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
					// Utility libs
					'vendor-utils': ['axios', 'validator', 'react-hook-form'],
				},
			},
		},
	},
	// Remove console.log in production via define (backup for non-terser builds)
	define: mode === 'production' ? {
		'globalThis.__DEV__': false,
	} : {},
}));
