import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import framer from 'vite-plugin-framer';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), framer()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
        },
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        minify: true,
        sourcemap: false,
    },
});
