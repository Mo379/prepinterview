import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from 'vite-plugin-eslint';
export default defineConfig({
    plugins: [
        react(),
        eslint({
            // Show errors in terminal and overlay in browser
            emitWarning: true,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
