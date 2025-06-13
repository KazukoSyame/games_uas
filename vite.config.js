import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure the port is 5173 (already the default for Vite)
    open: '/login', // Automatically open the browser at /login
  },
})
