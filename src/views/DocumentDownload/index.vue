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
          <h2 class="title">文档下载</h2>
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
            :data="docs"
            class="doc-table"
            :class="{ 'is-empty': !docs || docs.length === 0 }"
            table-layout="auto"
        >
          <el-table-column label="文档标题" :resizable="false">
            <template #default="{ row }">
              <div class="doc-row">
                <span class="doc-title" :title="row.title">{{ row.title }}</span>

                <div class="doc-actions">
                  <!-- 白底描边按钮 -->
                  <el-button class="btn btn-outline btn-lg" @click="download(row)">
                    <el-icon class="btn-ic"><Download /></el-icon>
                    <span class="btn-txt">下载</span>
                  </el-button>

                  <!-- 实心紫色按钮 -->
                  <el-button class="btn btn-solid btn-lg" @click="preview(row)">
                    <el-icon class="btn-ic"><View /></el-icon>
                    <span class="btn-txt">在线查看</span>
                  </el-button>
                </div>

              </div>
            </template>
          </el-table-column>

          <!-- 自定义空状态：No Data + 放大镜图标 + 副标题 -->
          <template #empty>
            <div class="empty">
              <div class="empty-icon">
                <el-icon :size="56"><Search /></el-icon>
              </div>
              <div class="empty-title">No Data</div>
              <div class="empty-desc">当前没有可供下载的文档</div>
            </div>
          </template>
        </el-table>
      </div>

      <!-- 预览弹窗 -->
      <el-dialog
          v-model="dialogVisible"
          title="文档在线预览"
          width="70%"
          top="5vh"
          destroy-on-close
          @closed="closePreview"
      >
        <iframe
            v-if="blobUrl"
            :src="blobUrl"
            style="width: 100%; height: 500px"
            frameborder="0"
        ></iframe>
      </el-dialog>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import {
  ElTable, ElTableColumn, ElButton, ElDialog, ElCard, ElMessage,
  ElMenu, ElSubMenu, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem,
  ElEmpty, ElIcon
} from 'element-plus'
import { fetchDocList, fetchMenuList } from '@/api/doc.js'
import { Search, Download, View } from '@element-plus/icons-vue'


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

const docs = ref([])
const loading = ref(true)
const currentPath = ref([])
const dialogVisible = ref(false)
const blobUrl = ref('')

onMounted(async () => {
  try {
    const menuList = await fetchMenuList()
    menuList.forEach(menuItem => {
      if (menuItem.level && menuItem.title) {
        menuMap.value[menuItem.level] = menuItem.title
      }
    })
  } catch (e) {
    console.error('获取文档列表失败：' + e.message)
    // ElMessage.error('获取文档列表失败：' + e.message)
  } finally {
    loading.value = false
  }
})

async function handleMenuSelect(index, indexPath) {
  try {
    loading.value = true
    currentPath.value = indexPath.map(path => menuMap.value[path])
    await fetchDocuments(index)
  } catch (e) {
    ElMessage.error('获取文档失败：' + e.message)
  } finally {
    loading.value = false
  }
}

async function fetchDocuments(menuIndex) {
  const parts = menuIndex.split('-')
  const arch = menuMap.value[parts[0]] || ''
  const manufacturer = menuMap.value[parts.slice(0, 2).join('-')] || ''
  const series = menuMap.value[parts.slice(0, 3).join('-')] || ''
  const params = { arch, manufacturer, series }
  docs.value = await fetchDocList(params)
}

async function download(row) {
  try {
    const response = await axios.get(row.url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${row.title}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('下载失败：', e);
  }
}

async function preview(row) {
  try {
    window.open(row.url, '_blank');
  } catch (e) {
    console.error('加载PDF失败：' + e.message);
  }
}

function closePreview() {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ''
  }
}
</script>

<style scoped>
/* 布局 */
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

/* 菜单文案弱化、箭头靠右 */
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
  /* 非强烈的浅色渐变，贴近截图 */
  background: linear-gradient(135deg, #ffffff 0%, #fbfcfe 100%);
}

.panel {
  background: transparent;
}

/* 头部 */
.header {
  margin-bottom: 16px;
}
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

/* 表格 */
.doc-table :deep(.el-table__header-wrapper th) {
  color: #1f2329;
  font-weight: 600;
  background: #fff;
}
.doc-table :deep(.el-table__inner-wrapper) {
  border-radius: 8px;
}
.doc-table {
  background: #fff;
}

/* 自定义空状态（居中、放大镜、主副标题） */
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
.empty-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}
.empty-desc {
  font-size: 14px;
  color: #6b7280;
}

/* 单行：左标题右操作 */
.doc-row{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
}
.doc-title{
  flex:1; min-width:0;
  font-weight:500; color:#1f2329;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  font-size: var(--btn-font-size);
}

.doc-table.is-empty :deep(.el-table__inner-wrapper::before){ height:0; background:transparent; }

.doc-table.is-empty :deep(.el-table__inner-wrapper::after){ width:0; background:transparent; }


.doc-table :deep(.el-table__empty-block){ padding:24px 0 24px; }


.panel{
  width: 100%;
  max-width:1200px;
  margin-left: auto;
  margin-right: auto;
  --btn-font-size: 15px;  /* 按钮&文档名字号 */
  --btn-height: 38px;     /* 按钮高度（原 44px） */
  --btn-radius: 12px;     /* 圆角（原 14px） */
  --btn-pad-x: 16px;      /* 左右内边距（原 20px） */
}

.doc-actions{
  flex:0 0 auto; display:flex; align-items:center; gap:8px;  /* 原来是 8px */
}

/* 按钮基础样式（作用到 Element Plus 的 el-button） */
:deep(.el-button.btn){
  display:inline-flex; align-items:center; justify-content:center;
  gap:10px;
  box-shadow:none;                    /* 先清理库默认阴影 */
  border-width:1px;
  height: var(--btn-height);
  padding: 0 var(--btn-pad-x);
  font-size: var(--btn-font-size);
  border-radius: var(--btn-radius);
}

/* 左：白底描边 */
:deep(.el-button.btn.btn-outline){
  background:#fff;
  color:#111827;                      /* 近黑 */
  border-color:#E5E7EB;               /* 浅灰描边 */
  box-shadow:0 2px 8px rgba(17,24,39,.06);
}
:deep(.el-button.btn.btn-outline:hover){
  border-color:#D1D5DB;
  box-shadow:0 4px 14px rgba(17,24,39,.08);
}

/* 右：实心紫 */
:deep(.el-button.btn.btn-solid){
  background:#5b5cf6;                /* 品牌紫，可按需微调 */
  color:#ffffff;
  border-color:transparent;
  box-shadow:0 10px 24px rgba(91,92,246,.24);
}
:deep(.el-button.btn.btn-solid:hover){
  background:#514ff0;
  box-shadow:0 12px 28px rgba(91,92,246,.32);
}

/* 焦点态（键盘可达） */
:deep(.el-button.btn:focus-visible){
  outline:none;
  box-shadow:0 0 0 3px rgba(91,92,246,.25);
}

/* 图标与文字对齐 */
:deep(.el-button.btn .btn-ic){
  font-size: 18px;
  display:inline-flex;
}


:deep(.el-breadcrumb) {
  margin-bottom: 12px;
}
</style>
