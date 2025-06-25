import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: path.resolve(__dirname, '../media'),
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: `main.js`, // ✅ always output as main.js
                assetFileNames: `style.css`, // ✅ always output as style.css
            },
            input: path.resolve(__dirname, 'index.html'),
        },
    },
});
//# sourceMappingURL=vite.config.js.map