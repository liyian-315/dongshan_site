<template>
  <div class="min-h-screen grid lg:grid-cols-[280px_1fr] grid-cols-1 bg-white">
    <!-- Sidebar -->
    <aside class="border-r border-gray-200/80 bg-gray-50/60 sticky top-0 h-screen overflow-y-auto">
      <div class="p-4 space-y-3">
        <div class="text-sm font-semibold text-gray-500">文档</div>
        <div class="flex items-center gap-2">
          <input v-model="q" type="search" placeholder="搜索标题..."
                 class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          <button class="shrink-0 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-100"
                  @click="clearSearch">清空</button>
        </div>
      </div>
      <nav class="px-2 pb-4">
        <ul class="space-y-1">
          <li>
            <button class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
                    :class="{ 'bg-indigo-50 text-indigo-700': activeId === null }"
                    @click="select(null)">默认页面</button>
          </li>
          <li v-for="s in filteredSections" :key="s.id">
            <button class="group w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2"
                    :class="{ 'bg-indigo-50 text-indigo-700': s.id === activeId }"
                    @click="select(s.id)">
              <span class="i">📄</span>
              <span class="truncate">{{ s.title }}</span>
            </button>
          </li>
          <li v-if="filteredSections.length === 0" class="px-3 py-2 text-xs text-gray-500">无匹配结果</li>
        </ul>
      </nav>
    </aside>

    <!-- Content -->
    <main class="min-h-screen overflow-x-hidden">
      <header class="flex items-center justify-between px-6 pt-6">
        <h1 class="text-xl font-semibold text-gray-800" v-if="currentTitle">{{ currentTitle }}</h1>
        <div class="text-sm text-gray-500" v-else>默认页面</div>
        <div class="ml-auto flex items-center gap-2">
          <button v-if="activeId" class="px-3 py-2 rounded-lg border border-gray-200 text-xs hover:bg-gray-50"
                  @click="copyPermalink">复制链接</button>
        </div>
      </header>

      <section class="px-6 pb-12">
        <div v-if="!activeId" class="rounded-2xl border border-dashed border-gray-300 p-10 mt-6 bg-gray-50">
          <h2 class="text-2xl font-bold mb-2">欢迎来到开源入门指导 👋</h2>
        </div>

        <article v-else class="mt-6 prose prose-zinc max-w-none markdown-body" v-html="renderedHtml"></article>
        <div v-if="loadError" class="mt-4 text-sm text-red-600">{{ loadError }}</div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'   // 直接引入，避免动态 import 失败导致走降级分支

// === 1) 收集 markdown 源文本 ===
const mdModules = import.meta.glob('../../assets/open_content/**/*.md', { as: 'raw' })

// === 2) 收集图片为可用 URL（中文/空格/全角符号均可）===
const imgModules = import.meta.glob(
    '../../assets/content/**/*.{png,jpg,jpeg,gif,svg,webp,bmp,avif,PNG,JPG,JPEG,GIF,SVG,WEBP,BMP,AVIF}',
    { as: 'url', eager: true }
)

const q = ref('')
const activeId = ref(null)
const renderedHtml = ref('')
const loadError = ref('')

// 生成侧栏列表（标题默认用文件名）
const sections = ref(
    Object.keys(mdModules).sort().map((path) => {
      const name = path.split('/').pop() || path
      const title = decodeURIComponent(name.replace(/\.md$/i, '').replace(/[\-_]/g, ' '))
      const id = slug(title)
      return { id, title, path }
    })
)

const currentTitle = computed(() => {
  const hit = sections.value.find(s => s.id === activeId.value)
  return hit ? hit.title : ''
})

const filteredSections = computed(() => {
  const key = q.value.trim().toLowerCase()
  if (!key) return sections.value
  return sections.value.filter(s => s.title.toLowerCase().includes(key))
})

function slug(s) {
  return s.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
}

function select(id) { activeId.value = id }
function clearSearch() { q.value = '' }

async function loadActive() {
  renderedHtml.value = ''
  loadError.value = ''
  if (!activeId.value) return
  const sec = sections.value.find(s => s.id === activeId.value)
  if (!sec) { loadError.value = '未找到该文档'; return }

  try {
    const loader = mdModules[sec.path]
    if (!loader) { loadError.value = '文档未注册：' + sec.path; return }
    const raw = await loader()

    const md = new MarkdownIt({ html: false, linkify: true, breaks: false })

    // 当前 md 所在目录（例如 '../../assets/content/TDL SDK/'）
    const baseDir = sec.path.replace(/[^/]+$/, '')

    // ---- 关键：重写 <img> 的 src ----
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const rawSrc = token.attrGet('src') || ''
      token.attrSet('src', resolveImg(baseDir, rawSrc))
      return self.renderToken(tokens, idx, options)
    }

    function resolveImg(base, src0) {
      // 外链/绝对路径不处理
      if (/^(https?:)?\/\//.test(src0) || src0.startsWith('/')) return src0

      // 规整路径：去空格、去 './'、消除重复分隔
      let s = src0.trim().replace(/^\.\/+/,'')
      // 生成若干候选 key（与 imgModules 的键一一比对）
      const candidates = unique([
        normalize(base + s),
        normalize(base + './' + s),
        normalize(base.replace(/\/$/, '') + '/' + s),
        // 再尝试解码（处理文档里被 URL 编码的空格等）
        normalize(base + decodeURI(s)),
      ])

      for (const k of candidates) {
        if (k in imgModules) return imgModules[k]
      }

      // 调试输出（在控制台看一下你 md -> src 的实际组合）
      console.warn('[DocViewer] image not found', { src: src0, base, candidates, sampleKey: Object.keys(imgModules)[0] })
      return src0 // 找不到就原样返回（避免整篇渲染失败）
    }

    function normalize(p) {
      const out = []
      p.split('/').forEach(seg => {
        if (!seg || seg === '.') return
        if (seg === '..') out.pop()
        else out.push(seg)
      })
      return out.join('/')
    }
    function unique(arr){ return Array.from(new Set(arr)) }

    const html = md.render(raw)
    renderedHtml.value = DOMPurify.sanitize(html)
  } catch (err) {
    loadError.value = '加载失败：' + (err && err.message ? err.message : String(err))
  }
}
function copyPermalink() {
  if (!activeId.value) return
  const url = new URL(window.location.href)
  url.hash = '#' + activeId.value
  navigator.clipboard && navigator.clipboard.writeText(url.toString())
}

onMounted(() => {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ''))
  if (hash) {
    const sec = sections.value.find(s => s.id === hash)
    if (sec) activeId.value = sec.id
  }
})

watch(activeId, (v) => {
  if (v) history.replaceState(null, '', '#' + v)
  else history.replaceState(null, '', ' ' + location.pathname)
  loadActive()
}, { immediate: true })
</script>

<style scoped>
/* 基础 Markdown 样式；若装了 @tailwindcss/typography 可删 */
.markdown-body h1 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0; }
.markdown-body h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0; }
.markdown-body h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0; }
.markdown-body p, .markdown-body li { line-height: 1.8; }
.markdown-body pre { background: #0f172a; color: #e5e7eb; padding: 1rem; border-radius: 0.75rem; overflow: auto; }
.markdown-body code { background: #f3f4f6; padding: 0.15rem 0.35rem; border-radius: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
</style>
