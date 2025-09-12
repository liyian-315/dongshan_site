<template>
  <div class="container">
    <!-- 左侧菜单区域 -->
    <div class="sidebar">
      <el-menu
          active-text-color="#165DFF"
          background-color="#F5F7FA"
          default-active="task-claim"
          text-color="#333"
          @select="handleMenuSelect"
          unique-opened
      >
        <el-menu-item index="task-claim">
          <i class="el-icon-s-order" style="margin-right: 8px;"></i>
          <span>任务领取</span>
        </el-menu-item>
        <el-menu-item index="my-tasks">
          <i class="el-icon-list" style="margin-right: 8px;"></i>
          <span>我的任务</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content">
      <el-card shadow="hover">
        <!-- 面包屑导航 -->
        <div class="header">
          <el-breadcrumb
              separator="/"
              v-if="currentBreadcrumb.length"
              @click-item="handleBreadcrumbClick"
          >
            <el-breadcrumb-item
                v-for="(item, index) in currentBreadcrumb"
                :key="index"
                :is-link="currentMenu === 'task-claim' && index === 1 && isShowTaskList"
            >
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 任务领取内容区 -->
        <div v-if="currentMenu === 'task-claim'">
          <div class="task-category-list" v-loading="categoryLoading" v-if="!isShowTaskList">
            <el-card
                v-for="category in taskCategories"
                :key="category.id"
                class="category-card"
                @click="handleCategoryClick(category.id)"
                :border="activeCategoryId === category.id"
                :shadow="activeCategoryId === category.id ? 'always' : 'hover'"
            >
              <div class="category-card__content">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-desc" v-if="category.description">{{ category.description }}</p>
                <p class="task-count">任务数量：{{ category.taskCount }}个</p>
              </div>
            </el-card>
          </div>

          <!-- 任务列表表格 -->
          <div class="task-list" v-if="isShowTaskList" v-loading="taskLoading">
            <h3 class="task-list__title">{{ getActiveCategoryName }} - 任务列表</h3>
            <el-table
                :data="currentTasks"
                style="width: 100%"
                border
                stripe
                :empty-text="currentTasks.length === 0 && !taskLoading ? '该分类下暂无任务' : '加载中...'"
            >
              <el-table-column prop="taskName" label="任务名称" width="200" align="left"/>
              <el-table-column prop="statusText" label="任务状态" width="120" align="center">
                <template #default="scope">
                  <span class="task-status" :class="`status-${scope.row.status}`">
                    {{ scope.row.statusText }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
              <el-table-column prop="deadlineTime" label="截止时间" width="180" align="center"/>
              <el-table-column label="操作" width="280" align="center">
                <template #default="scope">
                  <div class="table-operations">
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleClaimTask(scope.row.id)"
                        :disabled="receivedTaskCount >= 2 || scope.row.isClaimed"
                        :loading="claimLoading[scope.row.id]"
                    >
                      {{ scope.row.isClaimed ? '已领取' : (receivedTaskCount >= 2 ? '最多领取2个任务' : '领取任务') }}
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        @click="handleViewTaskDetail(scope.row.id)"
                        v-if="scope.row.status !== 'completed'"
                    >
                      查看详情
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 我的任务内容区 -->
        <div v-if="currentMenu === 'my-tasks'">
          <el-table
              :data="formattedMyTasks"
              style="width: 100%"
              v-loading="myTasksLoading"
              border
              stripe
              :empty-text="myTasksLoading ? '加载中...' : '暂无已领取任务'"
          >
            <el-table-column prop="taskName" label="任务名称" width="200" align="left"/>
            <el-table-column prop="categoryName" label="所属分类" width="120" align="center"/>
            <el-table-column prop="statusText" label="任务状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ scope.row.statusText }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="claimTime" label="领取时间" width="180" align="center"/>
            <el-table-column prop="deadlineTime" label="截止时间" width="180" align="center"/>
            <el-table-column label="操作" width="120" align="center">
              <template #default="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="handleViewTaskDetail(scope.row.id)"
                    v-if="scope.row.status !== 'completed'"
                >
                  查看详情
                </el-button>
                <span v-else>已完成</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- 任务详情抽屉 -->
    <el-drawer
        title="任务详情"
        v-model="isDetailDrawerOpen"
        direction="rtl"
        :size="500"
        @close="closeDetailDrawer"
    >
      <div class="task-detail-container">
        <div v-if="!currentTaskDetail" class="error-state">
          <i class="el-icon-error" />
          <p>无法获取任务详情</p>
        </div>

        <div v-else class="task-detail-content">
          <h3 class="task-detail-title">{{ currentTaskDetail.taskName || currentTaskDetail.name }}</h3>

          <div class="task-detail-section">
            <h4>任务描述</h4>
            <p class="task-description">{{ currentTaskDetail.taskDescription || '无任务描述' }}</p>
          </div>

          <div class="task-detail-section">
            <h4>任务信息</h4>
            <div class="task-info-grid">
              <div class="info-item">
                <span class="info-label">任务状态：</span>
                <span class="task-status" :class="`status-${currentTaskDetail.status}`">
                  {{ currentTaskDetail.statusText }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">创建时间：</span>
                <span>{{ currentTaskDetail.createTime }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">截止时间：</span>
                <span>{{ currentTaskDetail.deadlineTime }}</span>
              </div>
              <div class="info-item" v-if="currentTaskDetail.isClaimed">
                <span class="info-label">领取状态：</span>
                <span>已领取</span>
              </div>
              <div class="info-item" v-if="currentTaskDetail.categoryName">
                <span class="info-label">所属分类：</span>
                <span>{{ currentTaskDetail.categoryName }}</span>
              </div>
              <div class="info-item" v-if="currentTaskDetail.claimTime">
                <span class="info-label">领取时间：</span>
                <span>{{ currentTaskDetail.claimTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import {
  ElMenu, ElMenuItem, ElCard, ElTable, ElTableColumn,
  ElButton, ElMessage, ElBreadcrumb, ElBreadcrumbItem,
  ElTag, ElDrawer
} from 'element-plus'
import {
  fetchTaskCategories,
  fetchTasksByCategory,
  fetchMyTasks,
  fetchReceivedTaskCount,
  claimTask
} from '@/api/task.js'

// 状态映射常量
const STATUS_MAP = {
  1: { status: 'pending', text: '待处理' },
  2: { status: 'processing', text: '处理中' },
  3: { status: 'completed', text: '已完成' },
  unknown: { status: 'unknown', text: '未知状态' }
}

// 状态管理
const currentMenu = ref('task-claim')
const currentBreadcrumb = ref(['任务管理', '任务领取'])
const taskCategories = ref([])
const activeCategoryId = ref(null)
const currentTasks = ref([])
const myTasks = ref([])
const receivedTaskCount = ref(0)
const isShowTaskList = ref(false)
const isHistoryPushed = ref(false)
const username = localStorage.getItem('username')
const isDetailDrawerOpen = ref(false)
const currentTaskDetail = ref(null)

// 加载状态
const categoryLoading = ref(false)
const taskLoading = ref(false)
const myTasksLoading = ref(false)
const claimLoading = ref({})

// 计算属性
const getActiveCategoryName = computed(() => {
  return taskCategories.value.find(cat => cat.id === activeCategoryId.value)?.name || ''
})

const formattedMyTasks = computed(() => {
  return myTasks.value.map(task => {
    const statusInfo = STATUS_MAP[task.taskStatus] || STATUS_MAP.unknown
    return {
      id: task.id,
      taskName: task.taskName,
      categoryName: task.taskClassName,
      status: statusInfo.status,
      statusText: statusInfo.text,
      claimTime: task.collectionTime,
      deadlineTime: task.deadlineTime || '无截止时间',
      collectionUser: task.collectionUser,
      taskDescription: task.taskDescription,
      createTime: task.createTime,
      updateTime: task.updateTime,
      isClaimed: !!task.collectionUser
    }
  })
})

// 辅助方法
const getStatusInfo = (taskStatus) => {
  return STATUS_MAP[taskStatus] || STATUS_MAP.unknown
}

const getStatusTagType = (status) => {
  const typeMap = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    unknown: 'danger'
  }
  return typeMap[status] || 'danger'
}

const resetToCategoryList = () => {
  isShowTaskList.value = false
  activeCategoryId.value = null
  currentTasks.value = []
  currentBreadcrumb.value = ['任务管理', '任务领取']
  isHistoryPushed.value = false
}

const handlePopState = () => {
  if (currentMenu.value === 'task-claim' && isShowTaskList.value) {
    resetToCategoryList()
    isHistoryPushed.value = false
  }
}

// 生命周期
onMounted(async () => {
  window.addEventListener('popstate', handlePopState)
  try {
    await Promise.all([
      getTaskCategories(),
      getReceivedTaskCount()
    ])
    if (currentMenu.value === 'my-tasks') {
      await getMyTasks()
    }
  } catch (err) {
    ElMessage.error(`初始化失败：${err.message}`)
  }
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

// 事件处理
const handleMenuSelect = async (menuIndex) => {
  currentMenu.value = menuIndex
  if (menuIndex === 'task-claim') {
    currentBreadcrumb.value = ['任务管理', '任务领取']
    await getTaskCategories()
    resetToCategoryList()
  } else if (menuIndex === 'my-tasks') {
    currentBreadcrumb.value = ['任务管理', '我的任务']
    await getMyTasks()
    isShowTaskList.value = false
    activeCategoryId.value = null
    currentTasks.value = []
    isHistoryPushed.value = false
  }
}

const handleCategoryClick = async (categoryId) => {
  activeCategoryId.value = categoryId
  const categoryName = getActiveCategoryName.value
  currentBreadcrumb.value = ['任务管理', '任务领取', categoryName]
  isShowTaskList.value = true

  if (!isHistoryPushed.value) {
    window.history.pushState({ from: 'task-list' }, '', window.location.href)
    isHistoryPushed.value = true
  }

  await getTasksByCategory(categoryId)
}

const handleBreadcrumbClick = (index) => {
  if (currentMenu.value === 'task-claim' && index === 1 && isShowTaskList.value) {
    resetToCategoryList()
    isHistoryPushed.value = false
  }
}

const handleClaimTask = async (taskId) => {
  if (claimLoading.value[taskId]) return
  try {
    claimLoading.value[taskId] = true
    const res = await claimTask({ taskId, username })
    if(res != null){
      ElMessage.success('任务领取成功！')
    }
    await getReceivedTaskCount()
    if (activeCategoryId.value) {
      await getTasksByCategory(activeCategoryId.value)
    }
    if (currentMenu.value === 'my-tasks') {
      await getMyTasks()
    }
  } catch (err) {
    ElMessage.error(`领取失败：${err.message}`)
  } finally {
    claimLoading.value[taskId] = false
  }
}

const handleViewTaskDetail = (taskId) => {
  let task = currentTasks.value.find(t => t.id === taskId)

  if (!task) {
    task = myTasks.value.find(t => t.id === taskId)
  }

  if (task) {
    const statusInfo = getStatusInfo(task.taskStatus)
    currentTaskDetail.value = {
      ...task,
      status: statusInfo.status,
      statusText: statusInfo.text,
      claimTime: task.collectionTime,
      isClaimed: !!task.collectionUser
    }
    isDetailDrawerOpen.value = true
  } else {
    currentTaskDetail.value = null
    isDetailDrawerOpen.value = true
    ElMessage.warning('未找到该任务详情')
  }
}

const closeDetailDrawer = () => {
  isDetailDrawerOpen.value = false
  currentTaskDetail.value = null
}

// 数据获取
const getTaskCategories = async () => {
  categoryLoading.value = true
  try {
    const res = await fetchTaskCategories()
    taskCategories.value = res || []
  } catch (err) {
    taskCategories.value = []
    throw new Error(`获取任务分类失败：${err.message}`)
  } finally {
    categoryLoading.value = false
  }
}

const getTasksByCategory = async (categoryId) => {
  taskLoading.value = true
  try {
    const res = await fetchTasksByCategory({ params: categoryId })
    const tasks = res?.data || res || []
    currentTasks.value = tasks.map(task => {
      const statusInfo = getStatusInfo(task.taskStatus)
      return {
        ...task,
        status: statusInfo.status,
        statusText: statusInfo.text,
        isClaimed: !!task.collectionUser,
        claimTime: task.collectionTime
      }
    })
  } catch (err) {
    currentTasks.value = []
    throw new Error(`获取任务列表失败：${err.message}`)
  } finally {
    taskLoading.value = false
  }
}

const getMyTasks = async () => {
  myTasksLoading.value = true
  try {
    const res = await fetchMyTasks({ params: username})
    myTasks.value = Array.isArray(res) ? res : (res.data || [])
  } catch (err) {
    myTasks.value = []
    ElMessage.error(`获取我的任务失败：${err.message || '未知错误'}`)
  } finally {
    myTasksLoading.value = false
  }
}

const getReceivedTaskCount = async () => {
  try {
    const params = { params: username }
    const res = await fetchReceivedTaskCount(params)
    receivedTaskCount.value = res.data?.count || 0
  } catch (err) {
    receivedTaskCount.value = 0
    throw new Error(`获取已领取任务数量失败：${err.message}`)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  background-color: #F5F7FA;
}

.sidebar {
  width: 220px;
  background-color: #FFFFFF;
  border-right: 1px solid #E4E7ED;
  height: 100vh;
  position: sticky;
  top: 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.header {
  margin-bottom: 20px;
}

:deep(.el-breadcrumb) {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

:deep(.el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner) {
  color: #666 !important;
}

:deep(.el-breadcrumb__inner.is-link) {
  color: #165DFF !important;
  cursor: pointer;
  text-decoration: none;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  text-decoration: underline !important;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #333 !important;
  font-weight: 500;
  cursor: default;
}

.task-category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.category-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  height: 100%;
  display: flex;
  align-items: stretch;
}

.category-card__content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: #1F2329;
  margin-bottom: 8px;
}

.category-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  flex: 1;
}

.task-count {
  font-size: 12px;
  color: #999;
}

.task-list__title {
  font-size: 16px;
  font-weight: 500;
  color: #1F2329;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E4E7ED;
}

.task-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.status-pending {
  background-color: #FFF1F0;
  color: #F56C6C;
}

.status-processing {
  background-color: #E6F7FF;
  color: #409EFF;
}

.status-completed {
  background-color: #F0F9EB;
  color: #67C23A;
}

:deep(.el-table) {
  margin-top: 8px;
  width: 100%;
}

.table-operations {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

:deep(.el-drawer__body) {
  padding: 20px;
  overflow: hidden;
}

.task-detail-container {
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #F56C6C;
}

.error-state .el-icon-error {
  font-size: 40px;
  margin-bottom: 16px;
}

.task-detail-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E4E7ED;
}

.task-detail-section {
  margin-bottom: 24px;
}

.task-detail-section h4 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

.task-description {
  line-height: 1.6;
  color: #666;
  padding: 12px;
  background-color: #F5F7FA;
  border-radius: 4px;
  min-height: 80px;
  white-space: pre-wrap;
}

.task-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #E4E7ED;
}

.info-label {
  color: #999;
  min-width: 80px;
}

:deep(.el-icon-error) {
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
}
</style>