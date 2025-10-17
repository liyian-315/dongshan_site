<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold">活动管理（新增 / 更新）</h1>

    <!-- 基本设置 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <label class="flex flex-col">
        <span class="text-sm text-gray-500">API 前缀（与后端一致）</span>
        <input v-model.trim="apiPrefix" placeholder="/api" class="input" />
      </label>
      <label class="flex flex-col">
        <span class="text-sm text-gray-500">Bearer Token（自动补充，可覆盖）</span>
        <input v-model.trim="token" placeholder="Bearer xxx 或 xxx" class="input" />
      </label>
      <div class="flex items-end">
        <button class="btn-subtle" @click="resolveAutoToken">重新检测本地 Token</button>
      </div>
    </div>

    <!-- 模式切换 -->
    <div class="flex flex-wrap items-center gap-4">
      <label class="inline-flex items-center gap-2">
        <input type="radio" value="create" v-model="mode" />
        <span>新增（POST {{ createUrlHint }}）</span>
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="radio" value="update" v-model="mode" />
        <span>更新（PUT {{ updateUrlHint }}）</span>
      </label>

      <!-- 更新模式：选择 slug -->
      <template v-if="mode==='update'">
        <label class="flex items-center gap-2">
          <span class="text-sm text-gray-500">选择活动（按 slug 或标题检索）</span>
          <select v-model="slugToEdit" class="input w-80" @change="handlePickEvent">
            <option disabled value="">请选择要更新的活动</option>
            <option v-for="ev in eventsOptions" :key="ev.slug" :value="ev.slug">
              {{ ev.slug }} —— {{ ev.title || '(无标题)' }}（ID: {{ ev.id }}）
            </option>
          </select>
        </label>
        <span v-if="updateId" class="text-sm text-gray-500">（当前 ID：{{ updateId }}）</span>
      </template>

      <button class="btn" @click="fillDemo">填充示例数据</button>
      <span v-if="metaLoading" class="text-sm text-gray-500">（正在加载类型/标签...）</span>
    </div>

    <!-- 表单：核心字段 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 新增：文本输入；更新：由上面的下拉决定 slug，这里显示为只读 -->
      <label class="flex flex-col">
        <span class="lbl">slug（活动唯一访问ID）</span>
        <input
            v-if="mode==='create'"
            v-model.trim="form.slug"
            class="input"
            placeholder="建议小写-连字符"
        />
        <input
            v-else
            :value="form.slug"
            class="input bg-gray-50"
            readonly
        />
      </label>

      <label class="flex flex-col">
        <span class="lbl">title（活动标题）</span>
        <input v-model.trim="form.title" class="input" />
      </label>

      <label class="flex flex-col md:col-span-2">
        <span class="lbl">summary（活动简介）</span>
        <input v-model.trim="form.summary" class="input" />
      </label>

      <label class="flex flex-col md:col-span-2">
        <span class="lbl">coverUrl（活动封面图）</span>
        <input v-model.trim="form.coverUrl" class="input" />
      </label>

      <!-- type：从后端 meta 下拉 -->
      <label class="flex flex-col">
        <span class="lbl">type（活动类型）</span>
        <select v-model="form.type" class="input">
          <option disabled value="">请选择活动类型</option>
          <option v-for="t in typeOptions" :key="t.code" :value="t.code">
            {{ t.label || t.code }}
          </option>
        </select>
      </label>

      <!-- status：下拉 0/1/2 -->
      <label class="flex flex-col">
        <span class="lbl">status（状态）</span>
        <select v-model.number="form.status" class="input">
          <option :value="0">草稿</option>
          <option :value="1">下线</option>
          <option :value="2">上线</option>
        </select>
      </label>

      <!-- startTime -->
      <label class="flex flex-col">
        <span class="lbl">startTime（活动开始时间）</span>
        <input
            type="datetime-local"
            v-model="startTimeInput"
            class="input"
            step="1"
        />
      </label>

      <!-- endTime -->
      <label class="flex flex-col">
        <span class="lbl">endTime（活动结束时间）</span>
        <input
            type="datetime-local"
            v-model="endTimeInput"
            class="input"
            step="1"
            :min="startTimeInput || undefined"
        />
      </label>

      <label class="flex flex-col">
        <span class="lbl">city</span>
        <input v-model.trim="form.city" class="input" />
      </label>
      <label class="flex flex-col">
        <span class="lbl">location</span>
        <input v-model.trim="form.location" class="input" />
      </label>

      <label class="inline-flex items-center gap-2">
        <input type="checkbox" v-model="form.online" />
        <span>online</span>
      </label>

      <!-- tags：多选下拉（从后端 hotTags），并保证选中活动的标签一定在列表里 -->
      <label class="flex flex-col md:col-span-1">
        <span class="lbl">tags（按 Ctrl/Cmd 多选）</span>
        <select v-model="selectedTags" multiple class="input h-32">
          <option v-for="tag in tagOptions" :key="tag" :value="tag">{{ tag }}</option>
        </select>
        <div class="text-xs text-gray-500 mt-1">已选：{{ selectedTags.join(',') || '（无）' }}</div>
      </label>

      <!-- templateId：默认值 -->
      <label class="flex flex-col md:col-span-1">
        <span class="lbl">templateId</span>
        <input v-model.trim="form.templateId" class="input" placeholder="默认为 tmpl_conference_v1" />
      </label>
    </div>

    <!-- blocks 可视化编辑器 -->
    <section class="space-y-6">
      <h2 class="text-xl font-semibold">Blocks 模块（可视化编辑，自动组装 JSON）</h2>

      <!-- info-cards -->
      <div class="card">
        <div class="card-hd">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="uiBlocks.enable.infoCards" />
            <span class="font-medium">info-cards（你将收获）</span>
          </label>
          <button class="btn-subtle" @click="addInfoCard">+ 添加卡片</button>
        </div>
        <div v-if="uiBlocks.enable.infoCards" class="space-y-3">
          <div v-for="(it,idx) in uiBlocks.infoCards" :key="'ic'+idx" class="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            <input v-model.trim="it.title" class="input" placeholder="标题 title" />
            <div class="flex gap-2">
              <input v-model.trim="it.desc" class="input flex-1" placeholder="描述 desc" />
              <button class="btn-danger" @click="uiBlocks.infoCards.splice(idx,1)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- agenda -->
      <div class="card">
        <div class="card-hd">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="uiBlocks.enable.agenda" />
            <span class="font-medium">agenda（日程）</span>
          </label>
          <button class="btn-subtle" @click="addAgenda">+ 添加日程</button>
        </div>
        <div v-if="uiBlocks.enable.agenda" class="space-y-3">
          <div v-for="(it,idx) in uiBlocks.agenda" :key="'ag'+idx" class="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <input v-model.trim="it.time" class="input" placeholder="时间（如 09:00-09:30 / Day 1）" />
            <input v-model.trim="it.topic" class="input" placeholder="主题 topic" />
            <div class="flex gap-2">
              <input v-model.trim="it.speaker" class="input flex-1" placeholder="讲者 speaker（可空）" />
              <button class="btn-danger" @click="uiBlocks.agenda.splice(idx,1)">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- speakers -->
      <div class="card">
        <div class="card-hd">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="uiBlocks.enable.speakers" />
            <span class="font-medium">speakers（讲者与导师）</span>
          </label>
          <button class="btn-subtle" @click="addSpeaker">+ 添加讲者</button>
        </div>
        <div v-if="uiBlocks.enable.speakers" class="space-y-4">
          <div v-for="(sp,idx) in uiBlocks.speakers" :key="'sp'+idx" class="space-y-2 p-3 rounded-lg border border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model.trim="sp.name" class="input" placeholder="姓名 name" />
              <input v-model.trim="sp.title" class="input" placeholder="头衔 title" />
              <input v-model.trim="sp.avatar" class="input md:col-span-2" placeholder="头像 URL" />
              <input v-model.trim="sp.bio" class="input md:col-span-2" placeholder="简介 bio" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="font-medium">链接 links</div>
                <button class="btn-subtle" @click="sp.links.push({label:'',url:''})">+ 添加链接</button>
              </div>
              <div v-for="(lk,i) in sp.links" :key="'lk'+idx+'-'+i" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input v-model.trim="lk.label" class="input" placeholder="label（如 GitHub）" />
                <div class="flex gap-2">
                  <input v-model.trim="lk.url" class="input flex-1" placeholder="https://..." />
                  <button class="btn-danger" @click="sp.links.splice(i,1)">删</button>
                </div>
              </div>
            </div>
            <div class="text-right">
              <button class="btn-danger" @click="uiBlocks.speakers.splice(idx,1)">删除讲者</button>
            </div>
          </div>
        </div>
      </div>

      <!-- gallery -->
      <div class="card">
        <div class="card-hd">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="uiBlocks.enable.gallery" />
            <span class="font-medium">gallery（图集）</span>
          </label>
          <button class="btn-subtle" @click="addGallery">+ 添加图片</button>
        </div>
        <div v-if="uiBlocks.enable.gallery" class="space-y-3">
          <div v-for="(url,idx) in uiBlocks.gallery" :key="'ga'+idx" class="flex gap-2">
            <input v-model.trim="uiBlocks.gallery[idx]" class="input flex-1" placeholder="图片 URL" />
            <button class="btn-danger" @click="uiBlocks.gallery.splice(idx,1)">删除</button>
          </div>
        </div>
      </div>

      <!-- faq -->
      <div class="card">
        <div class="card-hd">
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="uiBlocks.enable.faq" />
            <span class="font-medium">faq（常见问题）</span>
          </label>
          <button class="btn-subtle" @click="addFaq">+ 添加 Q&A</button>
        </div>
        <div v-if="uiBlocks.enable.faq" class="space-y-3">
          <div v-for="(qa,idx) in uiBlocks.faq" :key="'fq'+idx" class="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            <input v-model.trim="qa.q" class="input" placeholder="问题 Q" />
            <div class="flex gap-2">
              <input v-model.trim="qa.a" class="input flex-1" placeholder="答案 A" />
              <button class="btn-danger" @click="uiBlocks.faq.splice(idx,1)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 其他字段 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="flex flex-col">
        <span class="lbl">contentMd</span>
        <textarea v-model="form.contentMd" class="textarea" rows="4" placeholder="# 活动简介&#10;..."></textarea>
      </label>

      <label class="flex flex-col">
        <span class="lbl">speakers（JSON 字符串，不用设置）</span>
        <textarea v-model="form.speakers" class="textarea" rows="3">[]</textarea>
      </label>

      <label class="flex flex-col">
        <span class="lbl">agenda（JSON 字符串，不用设置）</span>
        <textarea v-model="form.agenda" class="textarea" rows="3">[]</textarea>
      </label>

      <label class="flex flex-col md:col-span-2">
        <span class="lbl">gallery（JSON 字符串，不用设置）</span>
        <textarea v-model="form.gallery" class="textarea" rows="3">[]</textarea>
      </label>

      <label class="flex flex-col">
        <span class="lbl">ctaText</span>
        <input v-model.trim="form.ctaText" class="input" />
      </label>
      <label class="flex flex-col">
        <span class="lbl">ctaUrl</span>
        <input v-model.trim="form.ctaUrl" class="input" />
      </label>

      <label class="flex flex-col md:col-span-2">
        <span class="lbl">seo（JSON 字符串）</span>
        <textarea v-model="form.seo" class="textarea" rows="3">{}</textarea>
      </label>

      <label class="flex flex-col">
        <span class="lbl">viewCount</span>
        <input v-model.number="form.viewCount" type="number" class="input" />
      </label>

      <label class="flex flex-col">
        <span class="lbl">detailUrl（为空则进入内置详情页）</span>
        <input v-model.trim="form.detailUrl" class="input" placeholder="/custom/detail 或 https://..." />
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" v-model="form.detailIsExternal" />
        <span>detailIsExternal（外链新开窗）</span>
      </label>
    </div>

    <!-- 提交 -->
    <div class="flex items-center gap-3">
      <button class="btn" @click="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : (mode==='create' ? '新增（POST）' : '更新（PUT）') }}
      </button>
      <button class="btn-subtle" @click="showCurl = !showCurl">显示 cURL</button>
    </div>

    <div v-if="showCurl" class="mt-4">
      <h3 class="font-semibold mb-2">cURL 预览</h3>
      <pre class="code">{{ curlPreview }}</pre>
    </div>

    <div v-if="respText" class="mt-4">
      <h3 class="font-semibold mb-2">响应</h3>
      <pre class="code">{{ respText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'

/** ---------------- 基本配置 ---------------- */
const apiPrefix  = ref('/api')
const token      = ref('')
const autoToken  = ref('')  // 自动探测到的 Token（优先用于请求）
const mode       = ref('create') // 'create' | 'update'

/** ---------------- 列表与选择（更新模式） ---------------- */
const allEvents     = ref([])   // 原始列表
const eventsOptions = computed(() =>
    allEvents.value.map(ev => ({ id: ev.id, slug: ev.slug, title: ev.title }))
)
const slugToEdit    = ref('')
const updateId      = ref('')

/** ---------------- 后端元数据（types & tags） ---------------- */
const typeOptions = ref([])  // [{code,label}]
const tagOptions  = ref([])  // ['开源','AI',...]
const metaLoading = ref(false)

function ensureBearer(tk) {
  if (!tk) return ''
  return tk.toLowerCase().startsWith('bearer ') ? tk : `Bearer ${tk}`
}
function authHeader() {
  const tk = token.value || autoToken.value
  const hdr = ensureBearer(tk)
  return hdr ? { Authorization: hdr } : {}
}

/** 自动检测本地 Token：LocalStorage / Cookie / URL ?token= */
function resolveAutoToken() {
  const lsKeys = [
    'token','auth','authorization','jwt','access_token','bearer','bearerToken','Authorization'
  ]
  let tk = ''
  for (const k of lsKeys) {
    const v = localStorage.getItem(k)
    if (v && v.trim()) { tk = v.trim(); break }
  }
  if (!tk && document.cookie) {
    const m = document.cookie.match(/(?:^|;\s*)(?:token|jwt|access_token)=([^;]+)/i)
    if (m) tk = decodeURIComponent(m[1])
  }
  if (!tk && location.search) {
    const u = new URL(location.href)
    tk = u.searchParams.get('token') || u.searchParams.get('access_token') || ''
  }
  autoToken.value = tk
  // 如果手动输入框为空，则自动补进去（可覆盖）
  if (!token.value && tk) token.value = ensureBearer(tk)
}

/** 从后端 /api/events/meta 拉取 types/hotTags */
async function loadMeta() {
  metaLoading.value = true
  try {
    const url = `${apiPrefix.value}/events/meta`
    const res = await fetch(url, { headers: { ...authHeader() } })
    const js  = await res.json().catch(() => null)
    const data = js?.data || js || {}

    const types = Array.isArray(data.types) ? data.types : []
    typeOptions.value = types.map(t => ({ code: t.code, label: t.label || t.code }))

    const hot = Array.isArray(data.hotTags) ? data.hotTags : []
    tagOptions.value = hot.slice()
  } finally {
    metaLoading.value = false
  }
}

/** 把给定标签并入 tagOptions（避免活动里已有但 meta 未返回的标签下拉里看不到） */
function ensureTagOptionsInclude(arr) {
  const s = new Set(tagOptions.value)
  ;(arr || []).forEach(x => {
    const v = String(x || '').trim()
    if (v) s.add(v)
  })
  tagOptions.value = Array.from(s)
}

/** ---------------- 表单 ---------------- */
const form = reactive({
  id: undefined,     // 仅更新时使用
  slug: '',
  title: '',
  summary: '',
  coverUrl: '',
  type: '',
  status: 2,

  startTime: '',
  endTime: '',

  city: '',
  location: '',
  online: false,

  // 与 selectedTags 双向
  tags: '',

  templateId: 'tmpl_conference_v1',

  // 由 UI 自动组装，不强制手填
  contentMd: '',

  speakers: '[]',
  agenda:   '[]',
  gallery:  '[]',

  ctaText: '',
  ctaUrl: '',
  seo: '{}',
  viewCount: 0,

  detailUrl: '',
  detailIsExternal: false,

  // blocks: JSON 字符串（提交时写入），加载时解析到 uiBlocks
  blocks: ''
})

/** tags 多选（来自后端） */
const selectedTags = ref([])

/** blocks 可视化编辑器的 UI 状态 */
const uiBlocks = reactive({
  enable: { infoCards: true, agenda: true, speakers: true, gallery: true, faq: true },
  infoCards: [{ title: '', desc: '' }],
  agenda: [{ time: '', topic: '', speaker: '' }],
  speakers: [{ name: '', title: '', avatar: '', bio: '', links: [{ label: '', url: '' }] }],
  gallery: [''],
  faq: [{ q: '', a: '' }]
})
function addInfoCard() { uiBlocks.infoCards.push({ title: '', desc: '' }) }
function addAgenda()   { uiBlocks.agenda.push({ time: '', topic: '', speaker: '' }) }
function addSpeaker()  { uiBlocks.speakers.push({ name: '', title: '', avatar: '', bio: '', links: [{ label:'', url:'' }] }) }
function addGallery()  { uiBlocks.gallery.push('') }
function addFaq()      { uiBlocks.faq.push({ q: '', a: '' }) }

/** 时间字段：input[type=datetime-local] 与 'YYYY-MM-DD HH:mm:ss' 互转 */
function toInputDateTime(v) {
  if (!v) return ''
  const s = String(v).trim().replace(' ', 'T')
  const m = s.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:\d{2})?$/)
  if (m) return `${m[1]}T${m[2]}${m[3] || ':00'}`
  return s
}
function fromInputDateTime(v) {
  if (!v) return ''
  const s = String(v).trim().replace('T', ' ')
  const m = s.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})(:\d{2})?$/)
  if (m) return `${m[1]} ${m[2]}${m[3] || ':00'}`
  return s
}
const startTimeInput = computed({
  get: () => toInputDateTime(form.startTime),
  set: (val) => { form.startTime = fromInputDateTime(val) }
})
const endTimeInput = computed({
  get: () => toInputDateTime(form.endTime),
  set: (val) => { form.endTime = fromInputDateTime(val) }
})

/** 组装 blocks 对象（用于提交） */
function nonEmpty(s) { return (s ?? '').toString().trim().length > 0 }
function buildBlocksObject() {
  const out = {}
  if (uiBlocks.enable.infoCards) {
    const items = uiBlocks.infoCards
        .filter(it => nonEmpty(it.title) || nonEmpty(it.desc))
        .map(it => ({ title: it.title?.trim() || '', desc: it.desc?.trim() || '' }))
    if (items.length) out['info-cards'] = { items }
  }
  if (uiBlocks.enable.agenda) {
    const items = uiBlocks.agenda
        .filter(it => nonEmpty(it.time) || nonEmpty(it.topic) || nonEmpty(it.speaker))
        .map(it => ({ time: it.time?.trim() || '', topic: it.topic?.trim() || '', speaker: it.speaker?.trim() || '' }))
    if (items.length) out['agenda'] = { items }
  }
  if (uiBlocks.enable.speakers) {
    const items = uiBlocks.speakers
        .map(sp => {
          const links = (sp.links || []).filter(lk => nonEmpty(lk.url)).map(lk => ({
            label: nonEmpty(lk.label) ? lk.label.trim() : 'Link',
            url: lk.url.trim()
          }))
          return {
            name: sp.name?.trim() || '',
            title: sp.title?.trim() || '',
            avatar: sp.avatar?.trim() || '',
            bio: sp.bio?.trim() || '',
            links
          }
        })
        .filter(sp => nonEmpty(sp.name) || nonEmpty(sp.title) || nonEmpty(sp.avatar) || nonEmpty(sp.bio) || (sp.links?.length))
    if (items.length) out['speakers'] = { items }
  }
  if (uiBlocks.enable.gallery) {
    const items = uiBlocks.gallery.map(u => (u || '').trim()).filter(u => u.length)
    if (items.length) out['gallery'] = { items }
  }
  if (uiBlocks.enable.faq) {
    const items = uiBlocks.faq
        .filter(qa => nonEmpty(qa.q) || nonEmpty(qa.a))
        .map(qa => ({ q: qa.q?.trim() || '', a: qa.a?.trim() || '' }))
    if (items.length) out['faq'] = { items }
  }
  return out
}

/** 解析后端 blocks（字符串或对象）到 uiBlocks */
function parseBlocksToUI(blocks) {
  let obj = {}
  if (!blocks) obj = {}
  else if (typeof blocks === 'string') {
    try { obj = JSON.parse(blocks) || {} } catch { obj = {} }
  } else if (typeof blocks === 'object') {
    obj = blocks || {}
  }

  const info = obj['info-cards']?.items || []
  const agenda = obj['agenda']?.items || []
  const speakers = obj['speakers']?.items || []
  const gallery = obj['gallery']?.items || []
  const faq = obj['faq']?.items || []

  uiBlocks.enable.infoCards = info.length > 0
  uiBlocks.enable.agenda    = agenda.length > 0
  uiBlocks.enable.speakers  = speakers.length > 0
  uiBlocks.enable.gallery   = gallery.length > 0
  uiBlocks.enable.faq       = faq.length > 0

  uiBlocks.infoCards = info.length ? info.map(x => ({ title: x.title || '', desc: x.desc || '' })) : [{ title:'', desc:'' }]
  uiBlocks.agenda    = agenda.length ? agenda.map(x => ({ time: x.time || '', topic: x.topic || '', speaker: x.speaker || '' })) : [{ time:'', topic:'', speaker:'' }]
  uiBlocks.speakers  = speakers.length ? speakers.map(sp => ({
    name: sp.name || '', title: sp.title || '', avatar: sp.avatar || '', bio: sp.bio || '',
    links: Array.isArray(sp.links) ? sp.links.map(lk => ({ label: lk.label || '', url: lk.url || '' })) : []
  })) : [{ name:'', title:'', avatar:'', bio:'', links:[{label:'',url:''}] }]
  uiBlocks.gallery   = gallery.length ? gallery.map(u => u || '') : ['']
  uiBlocks.faq       = faq.length ? faq.map(qa => ({ q: qa.q || '', a: qa.a || '' })) : [{ q:'', a:'' }]
}

/** JSON 字符串规范化（提交用） */
function normalizeJsonString(val, fallback) {
  const s = (val ?? '').toString().trim()
  if (!s) return fallback
  try { return JSON.stringify(JSON.parse(s)) } catch { return s }
}

/** selectedTags 与 form.tags 双向同步 */
watch(selectedTags, (arr) => {
  form.tags = (arr || []).join(',')
})

/** ---------------- 数据加载（列表/详情） ---------------- */
async function loadAllEvents() {
  // 拉列表（取足够大的 pageSize；也兼容你后端的 data 结构）
  const url = `${apiPrefix.value}/events?page=1&pageSize=2000`
  const res = await fetch(url, { headers: { ...authHeader() } })
  const js  = await res.json().catch(() => null)
  const data = js?.data || js || {}
  const list = data.list || data.rows || data.records || data.tasks || []
  // 只保留必要字段
  allEvents.value = list.map(it => ({
    id: it.id,
    slug: it.slug,
    title: it.title,
    // 备份详情字段（如果列表就已返回完整字段时，点击下拉即可秒回填，无需再请求详情）
    _raw: it
  }))
}

/** 选择某个活动后，优先用 _raw 回填，否则调用详情接口 */
async function handlePickEvent() {
  const slug = slugToEdit.value
  if (!slug) return
  const hit = allEvents.value.find(e => e.slug === slug)
  if (hit && hit._raw && Object.keys(hit._raw).length > 0) {
    setFormFromEvent(hit._raw)
    updateId.value = hit._raw.id
    return
  }
  // 请求详情
  try {
    const url = `${apiPrefix.value}/events/${encodeURIComponent(slug)}`
    const res = await fetch(url, { headers: { ...authHeader() } })
    const js  = await res.json().catch(() => null)
    const data = js?.data || js || {}
    const ev = data.event || data.detail || data
    setFormFromEvent(ev)
    updateId.value = ev?.id
  } catch (e) {
    console.warn('加载详情失败：', e)
  }
}

/** 把后端 Event 实体回填到 form & uiBlocks */
function setFormFromEvent(ev = {}) {
  form.id         = ev.id
  form.slug       = ev.slug || ''
  form.title      = ev.title || ''
  form.summary    = ev.summary || ''
  form.coverUrl   = ev.coverUrl || ''
  form.type       = ev.type || ''
  form.status     = Number(ev.status ?? 2)

  form.startTime  = ev.startTime || ''
  form.endTime    = ev.endTime || ''

  form.city       = ev.city || ''
  form.location   = ev.location || ''
  form.online     = !!ev.online

  // tags 兼容数组或逗号串
  if (Array.isArray(ev.tags)) {
    selectedTags.value = ev.tags
    form.tags = ev.tags.join(',')
  } else if (typeof ev.tags === 'string') {
    selectedTags.value = ev.tags.split(',').map(s => s.trim()).filter(Boolean)
    form.tags = ev.tags
  } else {
    selectedTags.value = []
    form.tags = ''
  }
  // 已选标签显示下拉
  ensureTagOptionsInclude(selectedTags.value)

  form.templateId = ev.templateId || 'tmpl_conference_v1'
  form.contentMd  = ev.contentMd || ''
  form.speakers   = typeof ev.speakers === 'string' ? ev.speakers : JSON.stringify(ev.speakers ?? [])
  form.agenda     = typeof ev.agenda   === 'string' ? ev.agenda   : JSON.stringify(ev.agenda   ?? [])
  form.gallery    = typeof ev.gallery  === 'string' ? ev.gallery  : JSON.stringify(ev.gallery  ?? [])

  form.ctaText    = ev.ctaText || ''
  form.ctaUrl     = ev.ctaUrl || ''
  form.seo        = typeof ev.seo === 'string' ? ev.seo : JSON.stringify(ev.seo ?? {})
  form.viewCount  = Number(ev.viewCount || 0)

  form.detailUrl        = ev.detailUrl || ''
  form.detailIsExternal = !!ev.detailIsExternal

  // blocks
  form.blocks = typeof ev.blocks === 'string' ? ev.blocks : JSON.stringify(ev.blocks ?? {})
  parseBlocksToUI(ev.blocks || form.blocks)
}

/** ---------------- 提交 ---------------- */
const createUrlHint = computed(() => `${apiPrefix.value || ''}/admin/events`)
const updateUrlHint = computed(() => `${apiPrefix.value || ''}/admin/events/{id}`)

const submitting = ref(false)
const respText   = ref('')
const showCurl   = ref(false)

function buildPayload() {
  const blocksObj = buildBlocksObject()
  const tagsFromSelect = selectedTags.value.join(',')
  return {
    slug: form.slug,
    title: form.title,
    summary: form.summary,
    coverUrl: form.coverUrl,
    type: form.type,
    status: Number(form.status),

    startTime: form.startTime,
    endTime: form.endTime,

    city: form.city,
    location: form.location,
    online: !!form.online,

    tags: tagsFromSelect || form.tags,

    templateId: form.templateId || 'tmpl_conference_v1',

    blocks: JSON.stringify(blocksObj),

    contentMd: form.contentMd,

    speakers: normalizeJsonString(form.speakers, '[]'),
    agenda:   normalizeJsonString(form.agenda,   '[]'),
    gallery:  normalizeJsonString(form.gallery,  '[]'),

    ctaText: form.ctaText,
    ctaUrl: form.ctaUrl,
    seo: normalizeJsonString(form.seo, '{}'),
    viewCount: Number(form.viewCount) || 0,

    detailUrl: form.detailUrl || null,
    detailIsExternal: !!form.detailIsExternal
  }
}

const curlPreview = computed(() => {
  const url = mode.value === 'create'
      ? `${apiPrefix.value}/admin/events`
      : `${apiPrefix.value}/admin/events/${updateId.value || '{id}'}`
  const method = mode.value === 'create' ? 'POST' : 'PUT'
  const tk = token.value || autoToken.value
  const headerAuth = tk ? ` \\\n  -H "Authorization: ${ensureBearer(tk)}"` : ''
  return `curl -X ${method} "${url}" \\\n  -H "Content-Type: application/json"${headerAuth} \\\n  -d '${JSON.stringify(buildPayload())}'`
})

async function submit() {
  respText.value = ''
  if (mode.value === 'update' && !updateId.value) {
    respText.value = '请先选择要更新的活动（slug 下拉）'
    return
  }
  const payload = buildPayload()
  const url = mode.value === 'create'
      ? `${apiPrefix.value}/admin/events`
      : `${apiPrefix.value}/admin/events/${encodeURIComponent(updateId.value)}`
  const method = mode.value === 'create' ? 'POST' : 'PUT'

  submitting.value = true
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(payload)
    })
    const text = await res.text()
    respText.value = `HTTP ${res.status}\n` + text
  } catch (e) {
    respText.value = `请求异常：${e}`
  } finally {
    submitting.value = false
  }
}

/** 示例数据（便于快速演示） */
function fillDemo() {
  mode.value = 'create'
  slugToEdit.value = ''
  updateId.value = ''
  Object.assign(form, {
    id: undefined,
    slug: 'conf-2025',
    title: '开源大会 2025（更新版）',
    summary: '一场面向开发者的技术盛会（更新说明）',
    coverUrl: 'https://picsum.photos/seed/conf2025/1200/630',
    type: '',
    status: 2,
    startTime: '2025-12-10 09:00:00',
    endTime:   '2025-12-12 18:00:00',
    city: '上海',
    location: '上海世博中心',
    online: false,
    tags: '',
    templateId: 'tmpl_conference_v1',
    contentMd: "# 活动简介\n大会围绕 **AI、前端、云原生、数据** 等方向展开，欢迎参会交流。",
    speakers: '[]',
    agenda:   '[]',
    gallery:  '[]',
    ctaText: '立即报名',
    ctaUrl:  'https://example.com/register/conf-2025',
    seo: '{"title":"开源大会 2025","desc":"面向开发者的技术盛会","keywords":"开源,大会,AI,前端"}',
    viewCount: 0,
    detailUrl: '',
    detailIsExternal: false,
    blocks: ''
  })
  selectedTags.value = ['开源','前端','AI']
  uiBlocks.enable = { infoCards: true, agenda: true, speakers: true, gallery: true, faq: true }
  uiBlocks.infoCards = [
    { title: '100+ 讲者', desc: '来自头部企业与开源社区' },
    { title: '3000+ 参会者', desc: '跨领域开发者面对面交流' },
    { title: '25+ 专题',  desc: 'AI、前端、云原生、数据等' }
  ]
  uiBlocks.agenda = [
    { time: 'Day 1', topic: '主题演讲',        speaker: '大会主席' },
    { time: 'Day 2', topic: '分论坛与 Workshop', speaker: '各 Track' }
  ]
  uiBlocks.speakers = [
    { name: '张三', title: '某公司 CTO',            avatar: 'https://i.pravatar.cc/160?img=12', bio: '关注 AI 与架构',         links: [{ label:'GitHub', url:'https://github.com/' }] },
    { name: '李四', title: '开源社区 Maintainer',   avatar: 'https://i.pravatar.cc/160?img=34', bio: '构建工具与性能优化',     links: [] }
  ]
  uiBlocks.gallery = [
    'https://picsum.photos/seed/confgal1/600/400',
    'https://picsum.photos/seed/confgal2/600/400',
    'https://picsum.photos/seed/confgal3/600/400'
  ]
  uiBlocks.faq = [
    { q: '需要报名吗？', a: '需要，请先在报名页登记信息' },
    { q: '是否有回放？', a: '大会结束 48 小时内提供回放链接' }
  ]
  // 确保演示标签也在下拉里
  ensureTagOptionsInclude(selectedTags.value)
}

/** 生命周期 */
onMounted(async () => {
  resolveAutoToken()
  await loadMeta()
  await loadAllEvents()
})

/** 模式切换到更新时，如无列表则补拉；切回新增清空选择 */
watch(mode, async (m) => {
  if (m === 'update') {
    if (!allEvents.value.length) await loadAllEvents()
  } else {
    slugToEdit.value = ''
    updateId.value = ''
  }
})

/** 当 apiPrefix 或 token 变化时，轻量刷新 meta（避免频繁） */
watch([apiPrefix, token], async () => {
  await loadMeta()
})
</script>

<style scoped>
.input { @apply w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500; }
.textarea { @apply w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500; }
.lbl { @apply text-sm text-gray-500 mb-1; }
.btn { @apply inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:opacity-90; }
.btn-subtle { @apply inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 hover:bg-gray-200; }
.btn-danger { @apply inline-flex items-center rounded-lg bg-rose-600 text-white px-3 py-1.5 hover:opacity-90; }
.code { @apply whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-3; }
.card { @apply rounded-xl border border-gray-200 p-4; }
.card-hd { @apply mb-3 flex items-center justify-between; }
</style>
