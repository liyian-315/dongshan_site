<template>
  <!-- 页面灰底 + 深色兜底 -->
  <div class="bg-background-light dark:bg-background-dark bg-gray-50 dark:bg-black min-h-screen">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header class="pt-12 pb-8">
<!--        <h1 class="text-4xl font-bold text-text-light dark:text-text-dark">活动</h1>-->
        <div class="mt-6 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark">search</span>
          <input
              v-model.trim="q"
              @keyup.enter="go(1)"
              class="w-full pl-10 pr-4 py-3
                   bg-card-light dark:bg-card-dark bg-white dark:bg-zinc-900
                   border-none rounded-xl text-text-light dark:text-text-dark
                   placeholder-subtext-light dark:placeholder-subtext-dark
                   focus:ring-2 focus:ring-primary
                   shadow-sm ring-1 ring-black/5 dark:ring-white/10"
              placeholder="搜索活动..." type="text" />
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 筛选 -->
        <aside class="lg:col-span-3">
          <div class="sticky top-8 space-y-8">
            <!-- 卡片 1：筛选 -->
            <div class="bg-card-light dark:bg-card-dark bg-white dark:bg-zinc-900 rounded-xl p-4
                        shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <h2 class="text-lg font-semibold text-text-light dark:text-text-dark mb-4">筛选</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-subtext-light dark:text-subtext-dark" for="keywords">关键词</label>
                  <input id="keywords" v-model.trim="q" @keyup.enter="go(1)"
                         class="mt-1 block w-full
                                bg-background-light dark:bg-background-dark bg-gray-50 dark:bg-zinc-950
                                border-none rounded-lg text-sm
                                ring-1 ring-black/5 dark:ring-white/10"
                         placeholder="如：编程马拉松" type="text" />
                </div>

                <div>
                  <h3 class="text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">活动类型</h3>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox"
                             class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary
                                    bg-background-light dark:bg-background-dark"
                             :checked="checkedTypes.length===0" @change="toggleAll" />
                      <span class="ml-2 text-sm text-text-light dark:text-text-dark">全部</span>
                    </label>
                    <label v-for="t in allTypes" :key="t.value" class="flex items-center">
                      <input type="checkbox" :value="t.value" v-model="checkedTypes"
                             class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary
                                    bg-background-light dark:bg-background-dark" />
                      <span class="ml-2 text-sm text-text-light dark:text-text-dark">{{ t.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 卡片 2：热门标签 -->
            <div class="bg-card-light dark:bg-card-dark bg-white dark:bg-zinc-900 rounded-xl p-4
                        shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <h2 class="text-lg font-semibold text-text-light dark:text-text-dark mb-4">热门标签</h2>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in hotTags" :key="tag"
                        @click="toggleTag(tag)"
                        class="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full
                               transition"
                        :class="{'!bg-primary !text-white': tags.includes(tag)}">
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- 列表 -->
        <main class="lg:col-span-9">
          <!-- 列表容器（白卡） -->
          <div class="bg-card-light dark:bg-card-dark bg-white dark:bg-zinc-900 rounded-xl
                      shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <div v-if="loading" class="p-10 text-center text-subtext-light dark:text-subtext-dark">加载中...</div>

            <div v-else-if="list.length===0" class="p-10 text-center text-subtext-light dark:text-subtext-dark">暂无活动</div>

            <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
              <template v-for="item in list" :key="item.slug">
                <!-- 外链（或 detail_is_external=1） -->
                <a v-if="linkIsExternal(item)"
                   :href="detailHref(item)"
                   target="_blank" rel="noopener noreferrer"
                   class="block p-4 activity-item">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                      <!-- 封面：驼峰/下划线兼容 + 占位图 -->
                      <img :alt="item.title"
                           class="w-24 h-24 rounded-lg object-cover"
                           :src="item.cover_url || item.coverUrl || 'https://picsum.photos/seed/evt/200/200'" />
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold" :class="{'text-primary': item.highlight}">{{ item.title }}</h3>
                        <p class="text-sm text-subtext-light dark:text-subtext-dark mt-1 line-clamp-2">{{ item.summary }}</p>
                        <div class="flex items-center text-xs text-subtext-light dark:text-subtext-dark mt-2">
                          <span class="material-symbols-outlined text-sm mr-1 !text-subtext-light !dark:text-subtext-dark">calendar_today</span>
                          <span>{{ item.date_text }}</span>
                          <span class="mx-2">·</span>
                          <span class="material-symbols-outlined text-sm mr-1 !text-subtext-light !dark:text-subtext-dark">location_on</span>
                          <span>{{ item.location_text }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-gray-400 dark:text-gray-500 self-center">chevron_right</span>
                  </div>
                </a>

                <!-- 站内路径或默认详情 -->
                <RouterLink v-else
                            :to="detailTo(item)"
                            class="block p-4 activity-item">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                      <img :alt="item.title"
                           class="w-24 h-24 rounded-lg object-cover"
                           :src="item.cover_url || item.coverUrl || 'https://picsum.photos/seed/evt/200/200'" />
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold" :class="{'text-primary': item.highlight}">{{ item.title }}</h3>
                        <p class="text-sm text-subtext-light dark:text-subtext-dark mt-1 line-clamp-2">{{ item.summary }}</p>
                        <div class="flex items-center text-xs text-subtext-light dark:text-subtext-dark mt-2">
                          <span class="material-symbols-outlined text-sm mr-1 !text-subtext-light !dark:text-subtext-dark">calendar_today</span>
                          <span>{{ item.date_text }}</span>
                          <span class="mx-2">·</span>
                          <span class="material-symbols-outlined text-sm mr-1 !text-subtext-light !dark:text-subtext-dark">location_on</span>
                          <span>{{ item.location_text }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-gray-400 dark:text-gray-500 self-center">chevron_right</span>
                  </div>
                </RouterLink>
              </template>
            </div>
          </div>

          <!-- 分页（独立小卡，和列表区分开） -->
          <footer class="py-8" v-if="total>pageSize">
            <nav aria-label="Pagination" class="flex justify-center items-center space-x-2
                                bg-card-light dark:bg-card-dark bg-white dark:bg-zinc-900
                                rounded-xl px-3 py-2 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <button class="relative inline-flex items-center px-2 py-2 rounded-md text-subtext-light dark:text-subtext-dark
                             hover:bg-gray-100 dark:hover:bg-gray-800"
                      @click="go(page-1)" :disabled="page===1">
                <span class="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <span class="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-medium">{{ page }}</span>
              <button class="relative inline-flex items-center px-2 py-2 rounded-md text-subtext-light dark:text-subtext-dark
                             hover:bg-gray-100 dark:hover:bg-gray-800"
                      @click="go(page+1)" :disabled="page>=maxPage">
                <span class="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { fetchEvents, fetchEventMeta } from '@/api/event.js'

const q = ref('')
const checkedTypes = ref([]) // 为空表示“全部”
const tags = ref([])
const page = ref(1)
const pageSize = 10
const total = ref(0)
const list = ref([])
const loading = ref(false)

const allTypes = ref([]) // [{ value: code, label }]
const hotTags = ref([])  // ['开源','AI'...]
const metaLoading = ref(false)

const maxPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

function toggleAll() { checkedTypes.value = [] }
function toggleTag(t) {
  const idx = tags.value.indexOf(t)
  if (idx === -1) tags.value.push(t)
  else tags.value.splice(idx,1)
  go(1)
}

// —— 自定义跳转：工具函数 ——
function rawDetailUrl(item) {
  return item.detail_url ?? item.detailUrl ?? '' // 兼容驼峰/下划线
}
function linkIsExternal(item) {
  const u = rawDetailUrl(item)
  if (!u) return false
  // 后端可强制外链
  const forceExternal = (item.detail_is_external ?? item.detailIsExternal) === 1 || (item.detail_is_external ?? item.detailIsExternal) === true
  if (forceExternal) return true
  // http/https 绝对链接视为外链
  return /^https?:\/\//i.test(u)
}
function detailHref(item) {
  return rawDetailUrl(item)
}
function detailTo(item) {
  const u = rawDetailUrl(item)
  // 站内自定义路径（/ 开头）
  if (u && u.startsWith('/')) return u
  // 默认走活动详情
  return `/events/${item.slug}`
}

// 把后端驼峰字段映射成列表所需字段
function toCard(e) {
  const cover_url = e.cover_url ?? e.coverUrl ?? ''
  const start = e.start_time ?? e.startTime ?? ''
  const end = e.end_time ?? e.endTime ?? ''
  const date_text = formatDateRange(start, end)
  const location_text = e.location ?? e.city ?? (e.online ? '线上' : '')
  return {
    ...e,
    cover_url,
    start_time: start,
    end_time: end,
    date_text,
    location_text
  }
}

function formatDateRange(st, et) {
  if (!st && !et) return ''
  const s = fmt(st)
  const e = fmt(et)
  if (s && e) {
    if (s.slice(0, 10) === e.slice(0, 10)) return s
    return `${s} - ${e}`
  }
  return s || e
}
function fmt(isoOrDt) {
  if (!isoOrDt) return ''
  const d = new Date(String(isoOrDt).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return isoOrDt
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function loadMeta() {
  metaLoading.value = true
  try {
    const resp = await fetchEventMeta()
    const outer = resp?.data ?? resp
    const payload = outer?.data ?? outer

    // types: [{code,label}] -> [{value,label}]
    const types = Array.isArray(payload?.types) ? payload.types : []
    allTypes.value = types.map(t => ({ value: t.code ?? t.value, label: t.label ?? t.name ?? t.code }))

    // hotTags: string[]
    hotTags.value = Array.isArray(payload?.hotTags) ? payload.hotTags : []
  } finally {
    metaLoading.value = false
  }
}

async function load() {
  loading.value = true
  try {
    const resp = await fetchEvents({
      page: page.value, pageSize,
      q: q.value || undefined,
      type: checkedTypes.value.length ? checkedTypes.value.join(',') : undefined,
      tag: tags.value.length ? tags.value.join(',') : undefined
    })

    const outer = resp?.data ?? resp
    const payload = outer?.data ?? outer

    const rawList = Array.isArray(payload?.list) ? payload.list : []
    list.value = rawList.map(toCard)
    total.value = Number(payload?.total ?? 0)
  } finally {
    loading.value = false
  }
}

function go(p) {
  page.value = Math.max(1, p || 1)
  load()
}

watch([q, checkedTypes], () => go(1))

onMounted(() => {
  loadMeta()  // 元数据（筛选项/标签）
  load()      // 列表
})
</script>

<style>
.activity-item { transition: background-color 0.2s ease-in-out; }
.activity-item:active { background-color: #E5E5EA; }
.dark .activity-item:active { background-color: #2C2C2E; }
</style>
