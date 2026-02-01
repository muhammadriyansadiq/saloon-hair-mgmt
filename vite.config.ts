import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/shared/components'),
            '@/features': path.resolve(__dirname, './src/features'),
            '@/shared': path.resolve(__dirname, './src/shared'),
            '@/types': path.resolve(__dirname, './src/shared/types'),
            '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
        },
    },
})
