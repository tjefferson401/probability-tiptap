import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';


export default defineConfig({
  plugins: [react(), ghPages()],
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
