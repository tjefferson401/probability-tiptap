import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  base: "/probability-tiptap/",
  esbuild: {
    loader: 'jsx', // Ensure esbuild handles JSX syntax
    include: [
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx'
    ],
    exclude: [],
  },
});
