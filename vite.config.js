import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const docsTarget = env.DOCS_PROXY_TARGET || 'https://www.riscv-cn.org'

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api/, '/api'),
        },
        '/documents': {
          target: docsTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
