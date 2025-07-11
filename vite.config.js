import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    server: {
        host: true,        // allow access via LAN IP
        port: 5173         // optional, default is 5173
    },
    plugins: [
        tailwindcss(),
    ],
})
