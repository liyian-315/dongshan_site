<template>
  <div class="container">
    <!-- 左侧菜单 -->
    <aside class="sidebar">
      <el-menu
          class="side-menu"
          active-text-color="#000"
          background-color="#fff"
          text-color="#000"
          :unique-opened="true"
          @select="handleMenuSelect"
      >
        <template v-for="level1Index in getLevel1Indexes" :key="level1Index">
          <el-sub-menu :index="level1Index">
            <template #title>
              <span class="menu-title">{{ menuMap[level1Index] }}</span>
            </template>

            <template v-for="level2Index in getChildIndexes(level1Index)" :key="level2Index">
              <el-sub-menu :index="level2Index">
                <template #title>
                  <span class="menu-title">{{ menuMap[level2Index] }}</span>
                </template>

                <el-menu-item
                    v-for="level3Index in getChildIndexes(level2Index)"
                    :key="level3Index"
                    :index="level3Index"
                    class="menu-leaf"
                >
                  {{ menuMap[level3Index] }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </aside>

    <!-- 右侧内容 -->
    <main class="content">
      <div class="panel" v-loading="loading">
        <div class="header">
          <h2 class="title">镜像下载</h2>
          <el-breadcrumb separator="/" v-if="currentPath.length" class="crumb">
            <el-breadcrumb-item
                v-for="(item, index) in currentPath"
                :key="index"
            >
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-table
            :data="mirrors"
            class="doc-table"
            :class="{ 'is-empty': !mirrors || mirrors.length === 0 }"
            table-layout="auto"
        >
          <el-table-column label="资源" :resizable="false">
            <template #default="{ row }">
              <div class="doc-row">
                <!-- 左侧：名称 + 元信息 -->
                <div class="mirror-info">
                  <div class="doc-title" :title="row.name">{{ row.name }}</div>
                  <div class="mirror-meta">
                    <span class="meta-item" v-if="row.size">大小：{{ row.size }}</span>
                    <span class="meta-item" v-if="row.time">时间：{{ row.time }}</span>
                  </div>
                </div>

                <!-- 右侧：操作 -->
                <div class="doc-actions">
                  <el-button class="btn btn-outline btn-lg" @click="copyUrl(row)">
                    <el-icon class="btn-ic"><DocumentCopy /></el-icon>
                    <span class="btn-txt">复制地址</span>
                  </el-button>

                  <el-button class="btn btn-solid btn-lg" @click="openMirrorInter(row)">
                    <el-icon class="btn-ic"><Link /></el-icon>
                    <span class="btn-txt">校内下载</span>
                  </el-button>
                  <el-button class="btn btn-solid btn-lg" @click="openMirrorOut(row)">
                    <el-icon class="btn-ic"><Link /></el-icon>
                    <span class="btn-txt">校外下载</span>
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 自定义空状态 -->
          <template #empty>
            <div class="empty">
              <div class="empty-icon">
                <el-icon :size="56"><Search /></el-icon>
              </div>
              <div class="empty-title">No Data</div>
              <div class="empty-desc">当前没有可用的镜像资源</div>
            </div>
          </template>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  ElTable, ElTableColumn, ElButton, ElMessage,
  ElMenu, ElSubMenu, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem,
  ElLink, ElIcon
} from 'element-plus'
import { Search, Link, DocumentCopy } from '@element-plus/icons-vue'
import { fetchMirrorList, fetchMenuList } from '@/api/mirror.js'

// 菜单映射表
const menuMap = ref({})

const getChildIndexes = (parentIndex) => {
  const allIndexes = Object.keys(menuMap.value)
  return allIndexes.filter(index => {
    const parentLevel = parentIndex.split('-').length
    const currentLevel = index.split('-').length
    return index.startsWith(`${parentIndex}-`) && currentLevel === parentLevel + 1
  })
}

const getLevel1Indexes = computed(() => {
  const allIndexes = Object.keys(menuMap.value)
  return allIndexes.filter(index => index.split('-').length === 1)
})

const mirrors = ref([])
const loading = ref(true)
const currentPath = ref([])

onMounted(async () => {
  try {
    const menuList = await fetchMenuList()
    menuList.forEach(menuItem => {
      if (menuItem.level && menuItem.title) {
        menuMap.value[menuItem.level] = menuItem.title
      }
    })
  } catch (e) {
    ElMessage.error('获取镜像列表失败：' + e.message)
  } finally {
    loading.value = false
  }
})

async function handleMenuSelect(index, indexPath) {
  try {
    loading.value = true
    currentPath.value = indexPath.map(path => menuMap.value[path])
    await fetchMirrors(index)
  } catch (e) {
    ElMessage.error('获取镜像列表失败：' + e.message)
  } finally {
    loading.value = false
  }
}

async function fetchMirrors(menuIndex) {
  const parts = menuIndex.split('-')
  const arch = menuMap.value[parts[0]] || ''
  const manufacturer = menuMap.value[parts.slice(0, 2).join('-')] || ''
  const series = menuMap.value[parts.slice(0, 3).join('-')] || ''
  const params = { arch, manufacturer, series }
  mirrors.value = await fetchMirrorList(params)
}

async function copyUrl(row) {
  try {
    await navigator.clipboard.writeText(row.url)
    ElMessage.success('链接已复制')
  } catch (e) {
    ElMessage.error('复制失败：' + e.message)
  }
}

function openMirrorOut(row) {
  console.info(row)
  window.open(row.urlOut, '_blank')
}
function openMirrorInter(row) {
  window.open(row.urlInter, '_blank')
}
</script>

<style scoped>
/* ===== 布局，与“文档下载”保持一致 ===== */
.container {
  margin-inline: auto;
  display: flex;
  min-height: 100vh;
  background: #fff;
}

.sidebar {
  width: 240px;
  border-right: 1px solid #eef0f3;
  background: #fff;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow: auto;
}

.side-menu {
  border-right: none;
  padding: 8px 4px;
}

.menu-title {
  font-size: 16px;
  color: #1f2329;
}
.menu-leaf {
  font-size: 14px;
  color: #1f2329;
}

.content {
  flex: 1;
  padding: 24px 28px 40px;
  background: linear-gradient(135deg, #ffffff 0%, #fbfcfe 100%);
}

.panel {
  background: transparent;
}

/* ===== 头部 ===== */
.header { margin-bottom: 16px; }
.title {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2329;
}
.crumb {
  margin-top: -4px;
  font-size: 14px;
  color: #6b7280;
}

.doc-table :deep(.el-table__header-wrapper th) {
  color: #1f2329;
  font-weight: 600;
  background: #fff;
}
.doc-table :deep(.el-table__inner-wrapper) {
  border-radius: 8px;
}
.doc-table { background: #fff; }

/* 自定义空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0 64px;
  color: #1f2329;
}
.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #f3f4f6;
  margin-bottom: 12px;
}
.empty-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.empty-desc { font-size: 14px; color: #6b7280; }

/* 单行布局：左信息右操作 */
.doc-row{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
}
.doc-title{
  flex:1; min-width:0;
  font-weight:500; color:#1f2329;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  font-size: var(--btn-font-size);
}

.mirror-info{ flex:1; min-width:0; }
.mirror-meta{
  margin-top:4px; display:flex; flex-wrap:wrap; gap:10px; font-size:13px; color:#6b7280;
}
.meta-item{ display:inline-flex; align-items:center; gap:6px; }
.meta-ic{ font-size:14px; }
.meta-url{
  max-width:600px; display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}

/* 空状态视觉优化（与文档页一致） */
.doc-table.is-empty :deep(.el-table__inner-wrapper::before){ height:0; background:transparent; }
.doc-table.is-empty :deep(.el-table__inner-wrapper::after){ width:0; background:transparent; }
.doc-table :deep(.el-table__empty-block){ padding:24px 0 24px; }

.panel{
  max-width:1200px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  --btn-font-size: 15px;  /* 按钮&标题字号 */
  --btn-height: 38px;     /* 按钮高度 */
  --btn-radius: 12px;     /* 圆角 */
  --btn-pad-x: 16px;      /* 左右内边距 */
}
.doc-actions{ flex:0 0 auto; display:flex; align-items:center; gap:8px; }

/* Element Plus 按钮重置与风格 */
:deep(.el-button.btn){
  display:inline-flex; align-items:center; justify-content:center;
  gap:10px;
  box-shadow:none;
  border-width:1px;
  height: var(--btn-height);
  padding: 0 var(--btn-pad-x);
  font-size: var(--btn-font-size);
  border-radius: var(--btn-radius);
}
:deep(.el-button.btn .btn-ic){
  font-size: 18px;
  display:inline-flex;
}

/* 白底描边按钮 */
:deep(.el-button.btn.btn-outline){
  background:#fff;
  color:#111827;
  border-color:#E5E7EB;
  box-shadow:0 2px 8px rgba(17,24,39,.06);
}
:deep(.el-button.btn.btn-outline:hover){
  border-color:#D1D5DB;
  box-shadow:0 4px 14px rgba(17,24,39,.08);
}

/* 实心紫按钮 */
:deep(.el-button.btn.btn-solid){
  background:#5b5cf6;
  color:#ffffff;
  border-color:transparent;
  box-shadow:0 10px 24px rgba(91,92,246,.24);
}
:deep(.el-button.btn.btn-solid:hover){
  background:#514ff0;
  box-shadow:0 12px 28px rgba(91,92,246,.32);
}

/* 焦点态 */
:deep(.el-button.btn:focus-visible){
  outline:none;
  box-shadow:0 0 0 3px rgba(91,92,246,.25);
}

:deep(.el-breadcrumb) { margin-bottom: 12px; }
</style>
