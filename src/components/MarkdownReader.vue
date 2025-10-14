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
        <div class="text-sm text-gray-500" v-else>{{ emptyTitle || '默认页面' }}</div>
        <div class="ml-auto flex items-center gap-2">
          <button v-if="activeId" class="px-3 py-2 rounded-lg border border-gray-200 text-xs hover:bg-gray-50"
                  @click="copyPermalink">复制链接</button>
        </div>
      </header>

      <section class="px-6 pb-12">
        <!-- 可插槽自定义默认页内容 -->
        <div v-if="!activeId" class="rounded-2xl border border-dashed border-gray-300 p-10 mt-6 bg-gray-50">
          <slot name="empty">
            <h2 class="text-2xl font-bold mb-2">{{ emptyTitle || '欢迎' }}</h2>
            <p v-if="emptyDescription" class="text-gray-600">{{ emptyDescription }}</p>
          </slot>
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
import DOMPurify from 'dompurify'

const props = defineProps({
  /** 该页面对应的文档前缀，例如：/docs/guides 或 /docs/faq */
  base: { type: String, required: true },
  /** 默认页标题（未选择任何文档时显示） */
  emptyTitle: { type: String, default: '' },
  /** 默认页描述（未选择任何文档时显示） */
  emptyDescription: { type: String, default: '' },
})

const q = ref('')
const activeId = ref(null)
const renderedHtml = ref('')
const loadError = ref('')
const items = ref([])   // /<base>/index.json

const sections = computed(() => {
  const arr = items.value.map(it => {
    const path = typeof it === 'string' ? it : it.path
    const title = (typeof it === 'object' && it.title)
        ? it.title
        : decodeURIComponent(path.split('/').pop().replace(/\.md$/i,'').replace(/[_-]/g,' '))
    const id = slug(path) // 用 path 作为稳定 id
    return { id, title, path }
  })
  return arr.sort((a,b)=>a.title.localeCompare(b.title,'zh-Hans-CN'))
})

const currentTitle = computed(() => sections.value.find(s => s.id === activeId.value)?.title || '')
const filteredSections = computed(() => {
  const key = q.value.trim().toLowerCase()
  return key ? sections.value.filter(s => s.title.toLowerCase().includes(key)) : sections.value
})

function slug(s){
  return s.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\/\s-]/g,'')
      .replace(/[\/\s]+/g,'-')
      .replace(/-+/g,'-')
}
function select(id){ activeId.value = id }
function clearSearch(){ q.value = '' }
const joinUrl = (...p) => p.join('/').replace(/(?<!:)\/\/+/g,'/')

async function fetchList(){
  loadError.value = ''
  try{
    const res = await fetch(joinUrl(props.base, 'index.json'), { cache: 'no-store' })
    if (!res.ok) throw new Error(`index.json ${res.status}`)
    const data = await res.json()
    items.value = Array.isArray(data) ? data : (data.items || data.files || [])
    const hash = decodeURIComponent(location.hash.replace(/^#/,''))
    const hit = hash && sections.value.find(s=>s.id===hash)
    activeId.value = hit?.id || sections.value[0]?.id || null
  }catch(e){
    loadError.value = '无法读取文档清单：' + (e?.message || e)
  }
}

async function loadActive(){
  renderedHtml.value = ''; loadError.value = ''
  if (!activeId.value) return
  const sec = sections.value.find(s => s.id === activeId.value)
  if (!sec) { loadError.value = '未找到该文档'; return }

  try{
    const url = joinUrl(props.base, sec.path)
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`加载失败(${res.status})：${url}`)
    const raw = await res.text()
    const md = new MarkdownIt({ html: false, linkify: true, breaks: false })
    renderedHtml.value = DOMPurify.sanitize(md.render(raw))
  }catch(e){
    loadError.value = '加载失败：' + (e?.message || e)
  }
}

function copyPermalink(){
  if (!activeId.value) return
  const url = new URL(location.href); url.hash = '#' + activeId.value
  navigator.clipboard?.writeText(url.toString())
}

onMounted(fetchList)
watch(activeId, v => {
  if (v) history.replaceState(null, '', '#' + v)
  else history.replaceState(null, '', ' ' + location.pathname)
  loadActive()
})
</script>

<style scoped>
.markdown-body h1 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0; }
.markdown-body h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0; }
.markdown-body h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0; }
.markdown-body p, .markdown-body li { line-height: 1.8; }
.markdown-body pre { background: #0f172a; color: #e5e7eb; padding: 1rem; border-radius: 0.75rem; overflow: auto; }
.markdown-body code { background: #f3f4f6; padding: 0.15rem 0.35rem; border-radius: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
</style>
