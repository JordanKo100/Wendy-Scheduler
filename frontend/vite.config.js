import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        proxy: {
            // In dev, frontend calls /api/... and Vite forwards to the backend.
            // In prod, set VITE_API_URL to the backend origin (or keep /api behind same-origin reverse proxy).
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});