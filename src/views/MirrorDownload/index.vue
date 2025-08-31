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
                <template v-for="level3Index in getChildIndexes(level2Index)" :key="level3Index">
                  <el-sub-menu :index="level3Index">
                    <template #title>
                      <span>{{ menuMap[level3Index] }}</span>
                    </template>
                    <el-menu-item
                        v-for="level4Index in getChildIndexes(level3Index)"
                        :key="level4Index"
                        :index="level4Index"
                    >
                      {{ menuMap[level4Index] }}
                    </el-menu-item>
                  </el-sub-menu>
                </template>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    <div class="content">
      <el-card>
        <h2>镜像下载</h2>
        <el-table :data="mirrors" style="width: 100%">
          <el-table-column prop="name" label="资源名称" width="150"/>
          <el-table-column prop="url" label="镜像地址" width="200">
            <template #default="scope">
              <el-link :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="150"/>
          <el-table-column prop="time" label="时间" width="150"/>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {ElCard, ElLink, ElMenu, ElMenuItem, ElMessage, ElSubMenu, ElTable, ElTableColumn} from 'element-plus'
import {fetchMirrorList} from '@/api/mirror.js'

const mirrors = ref([])
const error = ref('')
const loading = ref(true)
const currentPath = ref([])

// 菜单映射表
const menuMap = {
  '1': 'RISC-V',
  '1-1': '厂商111',
  '1-1-1': '系列111',
  '1-1-1-1': '所有镜像',
  '1-2': '厂商122',
  '1-2-1': '系列111',
  '1-2-1-1': '所有镜像',
  '2': 'Arm',
  '2-1': '厂商211',
  '2-1-1': '系列211',
  '2-1-1-1': '所有镜像',
  '3': 'Intel',
  '3-1': '厂商311',
  '3-1-1': '系列311',
  '3-1-1-1': '所有镜像',
}

const getChildIndexes = (parentIndex) => {
  const allIndexes = Object.keys(menuMap)
  return allIndexes.filter(index => {
    const parentLevel = parentIndex.split('-').length
    const currentLevel = index.split('-').length
    return index.startsWith(`${parentIndex}-`) && currentLevel === parentLevel + 1
  })
}

const getLevel1Indexes = computed(() => {
  const allIndexes = Object.keys(menuMap)
  return allIndexes.filter(index => index.split('-').length === 1)
})

onMounted(async () => {
  try {
    await fetchMirrors('1')
  } catch (e) {
    error.value = '获取镜像列表失败，请检查网络或联系管理员'
  } finally {
    loading.value = false
  }
})
async function handleMenuSelect(index, indexPath) {
  try {
    loading.value = true
    currentPath.value = indexPath.map(path => menuMap[path])
    await fetchMirrors(index)
  } catch (e) {
    ElMessage.error('获取镜像列表失败：' + e.message)
  } finally {
    loading.value = false
  }
}

async function fetchMirrors(menuIndex) {
  const [arch, manufacturer, series] = menuIndex.split('-').map((_, i) => {
    const path = menuIndex.split('-').slice(0, i + 1).join('-')
    return menuMap[path] || ''
  })
  const params = { arch: arch || '', manufacturer: manufacturer || '', series: series || '' }
  mirrors.value = await fetchMirrorList(params)
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