import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // Use '/' when served from a custom domain root; use '/bmad-practice-project/'
  // if falling back to the default github.io subpath.
  base: command === 'build' ? '/' : '/',
}))

