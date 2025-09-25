<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- 返回 -->
      <nav class="pt-6 pb-4 text-sm">
        <RouterLink to="/events" class="inline-flex items-center text-subtext-light dark:text-subtext-dark hover:text-primary">
          <span class="material-symbols-outlined mr-1 text-base">chevron_left</span> 返回活动列表
        </RouterLink>
      </nav>

      <!-- Hero -->
      <header class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div class="lg:col-span-7 card rounded-xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <span v-if="event.type_text" class="chip text-xs font-medium px-2.5 py-1 rounded-full">{{ event.type_text }}</span>
            <span v-for="t in event.tags || []" :key="t" class="chip text-xs font-medium px-2.5 py-1 rounded-full">{{ t }}</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold" v-text="event.title"></h1>
          <p class="mt-3 text-base text-subtext-light dark:text-subtext-dark" v-text="event.summary"></p>

          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-subtext-light dark:text-subtext-dark">
            <span class="inline-flex items-center">
              <span class="material-symbols-outlined mr-1 text-base">calendar_today</span>
              <span>{{ event.date_text }}</span>
            </span>
            <span class="hidden sm:inline">·</span>
            <span class="inline-flex items-center">
              <span class="material-symbols-outlined mr-1 text-base">location_on</span>
              <span>{{ event.location_text }}</span>
            </span>
            <span class="hidden sm:inline">·</span>
            <span class="inline-flex items-center">
              <span class="material-symbols-outlined mr-1 text-base">visibility</span>
              <span>{{ statusText }}</span>
            </span>
          </div>

          <div class="mt-4 flex items-center gap-3">
            <button ref="shareBtn"
                    class="inline-flex items-center px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark text-sm hover:opacity-80">
              <span class="material-symbols-outlined mr-1 text-base">ios_share</span> 分享
            </button>
            <button class="inline-flex items-center px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark text-sm hover:opacity-80">
              <span class="material-symbols-outlined mr-1 text-base">bookmark_add</span> 收藏
            </button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="card rounded-xl overflow-hidden">
            <img class="w-full h-64 sm:h-80 object-cover"
                 :src="event.cover_url || event.coverUrl || 'https://picsum.photos/seed/event/800/480'" alt="封面图"/>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-8">
        <!-- 主内容 -->
        <main class="lg:col-span-8 space-y-8">
          <!-- 富文本 -->
          <section v-if="blocks.richtext?.html || event.content_md || event.contentMd" class="card rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-3">活动简介</h2>
            <article class="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                     v-html="blocks.richtext?.html || renderMarkdown(event.content_md || event.contentMd)">
            </article>
          </section>

          <!-- 要点卡 -->
          <section v-if="(blocks['info-cards']?.items || []).length" class="card rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">你将收获</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div v-for="(it,idx) in blocks['info-cards'].items" :key="idx" class="rounded-lg bg-background-light dark:bg-background-dark p-4">
                <h3 class="font-medium mb-1">{{ it.title }}</h3>
                <p class="text-sm text-subtext-light dark:text-subtext-dark">{{ it.desc }}</p>
              </div>
            </div>
          </section>

          <!-- 日程 -->
          <section v-if="(blocks.agenda?.items || event.agenda || []).length" class="card rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">日程安排</h2>
            <ol class="relative border-l divider pl-6 space-y-6">
              <li v-for="(it,idx) in (blocks.agenda?.items || event.agenda || [])" :key="idx">
                <div class="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-primary"></div>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div class="text-sm text-subtext-light dark:text-subtext-dark">{{ it.time }}</div>
                  <div class="mt-1 sm:mt-0 font-medium">{{ it.topic }}</div>
                </div>
                <p class="mt-1 text-sm text-subtext-light dark:text-subtext-dark" v-if="it.speaker">讲者：{{ it.speaker }}</p>
              </li>
            </ol>
          </section>

          <!-- 讲者 -->
          <section v-if="(blocks.speakers?.items || event.speakers || []).length" class="card rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">讲者与导师</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div class="flex gap-4" v-for="(sp,idx) in (blocks.speakers?.items || event.speakers || [])" :key="idx">
                <img class="w-16 h-16 rounded-xl object-cover" :src="sp.avatar" :alt="sp.name"/>
                <div>
                  <div class="font-semibold">{{ sp.name }}</div>
                  <div class="text-sm text-subtext-light dark:text-subtext-dark">{{ sp.title }}</div>
                  <p class="mt-1 text-sm text-subtext-light dark:text-subtext-dark line-clamp-3">{{ sp.bio }}</p>
                  <div class="mt-2 flex gap-3 text-sm">
                    <a v-for="(link, i) in (sp.links || [])" :key="i" class="text-primary hover:underline" :href="link.url" target="_blank">{{ link.label }}</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- FAQ -->
          <section v-if="(blocks.faq?.items || []).length" class="card rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">常见问题</h2>
            <div class="space-y-2">
              <details v-for="(qa,idx) in blocks.faq.items" :key="idx" class="rounded-lg bg-background-light dark:bg-background-dark p-4">
                <summary class="cursor-pointer font-medium">{{ qa.q }}</summary>
                <p class="mt-2 text-sm text-subtext-light dark:text-subtext-dark">{{ qa.a }}</p>
              </details>
            </div>
          </section>

          <!-- 图集 -->
          <section v-if="(blocks.gallery?.items || event.gallery || []).length" class="card rounded-xl p-6">
            <h2 class="text-xl font-semibold mb-4">往期掠影</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <img v-for="(g,idx) in (blocks.gallery?.items || event.gallery || [])" :key="idx" class="w-full h-40 object-cover rounded-lg" :src="g" alt="">
            </div>
          </section>
        </main>

        <!-- 侧栏 -->
        <aside class="lg:col-span-4">
          <div class="sticky top-8 space-y-6">
            <div class="card rounded-xl p-6">
              <div class="flex items-start justify-between">
                <h3 class="text-lg font-semibold">报名信息</h3>
                <span class="chip text-xs font-medium px-2.5 py-1 rounded-full">{{ statusText }}</span>
              </div>
              <div class="mt-4 space-y-3 text-sm text-subtext-light dark:text-subtext-dark">
                <div class="flex items-start">
                  <span class="material-symbols-outlined mr-2 text-base">event</span>
                  <div><div>开始时间</div><div class="text-text-light dark:text-text-dark">{{ event.start_time_text }}</div></div>
                </div>
                <div class="flex items-start">
                  <span class="material-symbols-outlined mr-2 text-base">schedule</span>
                  <div><div>结束时间</div><div class="text-text-light dark:text-text-dark">{{ event.end_time_text }}</div></div>
                </div>
                <div class="flex items-start">
                  <span class="material-symbols-outlined mr-2 text-base">map</span>
                  <div><div>地点</div><div class="text-text-light dark:text-text-dark">{{ event.location_full || event.location_text }}</div></div>
                </div>
                <div class="flex items-start" v-if="event.cta_url">
                  <span class="material-symbols-outlined mr-2 text-base">link</span>
                  <div><div>报名链接</div><a class="text-primary break-all" :href="event.cta_url" target="_blank">{{ event.cta_url }}</a></div>
                </div>
              </div>
              <a v-if="event.cta_url" :href="event.cta_url" target="_blank"
                 class="mt-5 w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90">
                <span class="material-symbols-outlined mr-1 text-base">how_to_reg</span> 立即报名
              </a>
            </div>

            <div v-if="event.location_map_image" class="card rounded-xl p-0 overflow-hidden">
              <div class="p-4">
                <h3 class="text-lg font-semibold">交通与位置</h3>
                <p class="mt-1 text-sm text-subtext-light dark:text-subtext-dark">{{ event.location_tips }}</p>
              </div>
              <img :src="event.location_map_image" class="w-full h-48 object-cover" alt="">
            </div>
          </div>
        </aside>
      </div>

      <footer class="py-12">
        <div class="flex items-center justify-center">
          <RouterLink to="/events" class="inline-flex items-center px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark text-sm hover:opacity-90">
            <span class="material-symbols-outlined mr-1 text-base">arrow_back</span> 返回活动列表
          </RouterLink>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchEventDetail } from '@/api/event.js'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const event = ref({})
const template = ref({})
const blocks = ref({}) // 归一化后的区块：{ 'richtext': {...}, 'agenda': {...}, ... }

// markdown-it
const md = new MarkdownIt({
      html: false,       // 若你需要允许 Markdown 中的原生 HTML，改为 true（注意 XSS 风险）
      breaks: true,      // 将单个换行视作 <br/>
      linkify: true,     // 自动把 URL 转为链接
      typographer: true, // 更智能的标点替换
    })

function renderMarkdown(src) {
    if (!src) return ''
      return md.render(String(src))
     }

const statusText = computed(() => {
  const st = new Date(event.value.start_time || 0).getTime()
  const et = new Date(event.value.end_time || 0).getTime()
  const now = Date.now()
  if (!st && !et) return '—'
  if (now < st) return '未开始'
  if (now >= st && now <= et) return '进行中'
  return '已结束'
})

// 类型文案（也可以改成请求 /events/meta 后缓存）
const TYPE_LABELS = {
  online_live: '线上活动',
  offline_meetup: '线下沙龙',
  summit: '技术峰会',
  workshop: '工作坊',
  hackathon: '编程马拉松'
}

// —— 工具：把 "YYYY-MM-DD HH:mm:ss" 变成 ISO 以便 Date 正确解析 —— //
function toISO(s) {
  if (!s) return ''
  const str = String(s)
  // 已经是 ISO 的直接返回
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) return str
  return str.replace(' ', 'T')
}
function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  const hh = String(d.getHours()).padStart(2,'0')
  const mm = String(d.getMinutes()).padStart(2,'0')
  return `${y}-${m}-${dd} ${hh}:${mm}`
}
function fmtRange(st, et) {
  if (!st && !et) return ''
  const s = fmtDate(st)
  const e = fmtDate(et)
  if (s && e) {
    // 同一天只显示起止时刻
    if (s.slice(0,10) === e.slice(0,10)) return `${s} - ${e.slice(11)}`
    return `${s} - ${e}`
  }
  return s || e
}
function splitTags(t) {
  if (!t) return []
  if (Array.isArray(t)) return t
  return String(t).split(',').map(x => x.trim()).filter(Boolean)
}

// —— 把后端 event 映射为详情页需要的字段 —— //
function toEventVM(raw = {}) {
  const startISO = toISO(raw.startTime ?? raw.start_time)
  const endISO   = toISO(raw.endTime ?? raw.end_time)
  return {
    ...raw,
    // 统一字段名（下划线）
    cover_url: raw.cover_url ?? raw.coverUrl ?? '',
    content_md: raw.content_md ?? raw.contentMd ?? '',
    start_time: startISO,
    end_time: endISO,
    date_text: fmtRange(startISO, endISO),
    start_time_text: fmtDate(startISO),
    end_time_text: fmtDate(endISO),
    location_text: raw.location ?? raw.city ?? (raw.online ? '线上' : ''),
    cta_url: raw.cta_url ?? raw.ctaUrl ?? '',
    tags: splitTags(raw.tags),
    type_text: TYPE_LABELS[raw.type] ?? raw.type
  }
}

// —— 归一化 blocks：无论是数组([{type,props}])还是对象({faq:{...}})都转为对象 —— //
function normalizeBlocks(v) {
  if (!v) return {}
  let obj = v
  if (typeof v === 'string') {
    try { obj = JSON.parse(v) } catch { return {} }
  }
  if (Array.isArray(obj)) {
    const map = {}
    obj.forEach(b => {
      if (b && b.type) map[b.type] = b.props || {}
    })
    return map
  }
  if (typeof obj === 'object') return obj
  return {}
}

// —— 合并策略：活动覆盖模板（浅合并已足够，复杂结构你再细化） —— //
function mergeBlocks(tplMap, evtMap) {
  return { ...tplMap, ...evtMap }
}

onMounted(async () => {
  const resp = await fetchEventDetail(route.params.slug)
  // 兼容 AxiosResponse 与已解包
  const outer = resp?.data ?? resp
  const payload = outer?.data ?? outer

  const rawEvent = payload?.event || {}
  const rawTpl   = payload?.template || {}

  event.value = toEventVM(rawEvent)

  // 模板 blocks（数组 JSON）与活动 blocks（对象 JSON）都做归一
  const tplMap = normalizeBlocks(rawTpl.blocks)
  const evtMap = normalizeBlocks(rawEvent.blocks)

  blocks.value = mergeBlocks(tplMap, evtMap)
  template.value = rawTpl
})
</script>


<style>
.card { background-color: #FFFFFF; }
.dark .card { background-color: #1C1C1E; }
.divider { border-color: rgba(0,0,0,0.08); }
.dark .divider { border-color: rgba(255,255,255,0.08); }
.chip { background: rgba(0,122,255,0.10); color: #007AFF; }
</style>
