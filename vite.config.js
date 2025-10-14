import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import fs from 'node:fs'
import path from 'node:path'

function docsDevMultiPlugin () {
  const MAP = {
    open_source: path.resolve(process.env.DEV_DOCS_DIR_GUIDES || '.\\src\\assets\\open_content'),
    dongshanpai:    path.resolve(process.env.DEV_DOCS_DIR_FAQ    || '.\\src\\assets\\content'),
  }

  function walk (root, prefix = '') {
    const out = []
    try {
      for (const name of fs.readdirSync(path.join(root, prefix))) {
        const abs = path.join(root, prefix, name)
        const st = fs.statSync(abs)
        if (st.isDirectory()) out.push(...walk(root, path.join(prefix, name)))
        else if (/\.md$/i.test(name)) out.push(path.join(prefix, name))
      }
    } catch {}
    return out
  }

  return {
    name: 'docs-dev-multi',
    apply: 'serve', // 仅在 dev 生效
    configureServer (server) {
      // 1) /docs/<key>/index.json -> 返回该目录下所有 .md（递归）
      server.middlewares.use('/docs', (req, res, next) => {
        const url = decodeURIComponent(req.url || '/')
        const m = url.match(/^\/([^/]+)\/index\.json$/) // 去掉了 /docs 前缀后的路径
        if (!m) return next()
        const key = m[1]
        const root = MAP[key]
        if (!root) {
          res.statusCode = 404
          return res.end('unknown docs key')
        }
        const list = walk(root).map(p => p.replace(/\\/g, '/'))
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        return res.end(JSON.stringify(list))
      })

      // 2) /docs/<key>/<path>.md -> 直接读文件并返回纯文本
      server.middlewares.use('/docs', (req, res, next) => {
        const url = decodeURIComponent(req.url || '/')
        if (/^\/[^/]+\/index\.json$/.test(url)) return next() // 上面已处理

        const m = url.match(/^\/([^/]+)\/(.*)$/)
        if (!m) return next()
        const [, key, rest] = m
        const root = MAP[key]
        if (!root) return next()

        // 计算绝对路径并做目录越界保护
        const abs = path.resolve(root, rest)
        if (!abs.startsWith(root)) {
          res.statusCode = 403
          return res.end('forbidden')
        }

        // 只处理 .md；其它交给后续中间件
        if (!/\.md$/i.test(abs)) return next()

        try {
          const buf = fs.readFileSync(abs)
          res.setHeader('Cache-Control', 'no-store')
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
          return res.end(buf)
        } catch (e) {
          res.statusCode = 404
          return res.end('not found')
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    docsDevMultiPlugin(), // 确保放最前，优先拦截 /docs
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, '/api')
      }
    }
  }
})
