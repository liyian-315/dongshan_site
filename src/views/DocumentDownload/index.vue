<template>
  <div class="container">
    <!-- 左侧菜单区域 -->
    <div class="sidebar">
      <el-menu
          active-text-color="#000"
          background-color="#fff"
          default-active="1"
          text-color="#000"
          @select="handleMenuSelect"
      >
        <template v-for="level1Index in getLevel1Indexes" :key="level1Index">
          <el-sub-menu :index="level1Index">
            <template #title>
              <span>{{ menuMap[level1Index] }}</span>
            </template>

            <template v-for="level2Index in getChildIndexes(level1Index)" :key="level2Index">
              <el-sub-menu :index="level2Index">
                <template #title>
                  <span>{{ menuMap[level2Index] }}</span>
                </template>
                <el-menu-item
                    v-for="level3Index in getChildIndexes(level2Index)"
                    :key="level3Index"
                    :index="level3Index"
                >
                  {{ menuMap[level3Index] }}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
<!--    中间表单区-->
    <div class="content">
      <el-card>
        <div class="header">
          <h2>文档下载</h2>
          <el-breadcrumb separator="/" v-if="currentPath.length">
            <el-breadcrumb-item v-for="(item, index) in currentPath" :key="index">
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-table :data="docs" style="width: 100%" v-loading="loading">
          <el-table-column prop="title" label="文档标题" width="180"/>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button type="primary" size="small" @click="download(scope.row)">
                下载
              </el-button>
              <el-button type="success" size="small" @click="preview(scope.row)">
                在线查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

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
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import {
  ElTable, ElTableColumn, ElButton, ElDialog, ElCard, ElMessage,
  ElMenu, ElSubMenu, ElMenuItem, ElBreadcrumb, ElBreadcrumbItem
} from 'element-plus'
import { fetchDocList, fetchMenuList } from '@/api/doc.js'

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
    ElMessage.error('获取文档列表失败：' + e.message)
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
  const [arch, manufacturer, series] = menuIndex.split('-').map((_, i) => {
    const path = menuIndex.split('-').slice(0, i + 1).join('-')
    return menuMap.value[path] || ''
  })
  const params = { arch: arch || '', manufacturer: manufacturer || '', series: series || '' }
  docs.value = await fetchDocList(params)
}

function download(row) {
  window.open(row.url, '_blank')
}

async function preview(row) {
  try {
    const res = await axios.get(row.url, { responseType: 'blob' })
    blobUrl.value = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    dialogVisible.value = true
  } catch (e) {
    ElMessage.error('加载PDF失败：' + e.message)
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
.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  height: 100vh;
  position: sticky;
  top: 0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

.header {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
  color: #1f2329;
}

:deep(.el-breadcrumb) {
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
