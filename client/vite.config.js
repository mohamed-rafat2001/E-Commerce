import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					animations: ['framer-motion'],
					icons: ['react-icons', '@fortawesome/fontawesome-free'],
					ui: ['react-hot-toast', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
					state: ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query', '@tanstack/react-query-devtools'],
					utils: ['axios', 'validator', 'react-hook-form'],
				},
			},
		},
	},
});
