<template>
  <div class="task-management-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="任务名称">
          <el-input
              v-model="searchForm.taskName"
              placeholder="请输入任务名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="领取人">
          <el-input
              v-model="searchForm.collectionUser"
              placeholder="请输入领取人姓名"
              clearable
          />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select
              v-model="searchForm.taskStatus"
              placeholder="全部状态"
              clearable
              size="default"
              style="width: 160px"
          >
            <el-option
                v-for="option in taskStatusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTasks">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="createNewTask">新建任务</el-button>

        </el-form-item>
      </el-form>
    </div>

    <!-- 任务列表区域 -->
    <div class="task-list-area">
      <el-table
          :data="tasks"
          border
          class="task-table"
          v-loading="loading"
          element-loading-text="加载中..."
      >
        <el-table-column prop="taskName" label="题目" width="220" />
        <el-table-column prop="taskClassName" label="类别" width="150" />
        <el-table-column prop="collectionUser" label="领取人" width="120" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="email2" label="备用邮箱" width="200" />
        <el-table-column prop="createTime" label="任务开始时间" width="180" />
        <el-table-column prop="deadlineTime" label="截止时间" width="180" />
        <el-table-column prop="collectionTime" label="领取时间" width="180" />

        <!-- 状态列 -->
        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <el-select
                v-model="row.taskStatus"
                size="small"
                @change="handleTaskStatusChange(row)"
                :disabled="!canEditTaskStatus(row.taskStatus)"
                style="width: 90px"
            >
              <el-option
                  v-for="option in taskStatusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <!-- 成果查看列 -->
        <el-table-column label="成果查看" width="140">
          <template #default="{ row }">
            <el-link
                v-if="row.resultLink"
                :href="row.resultLink"
                target="_blank"
                type="primary"
                size="small"
                @click="handleViewPdf(row.resultLink)"
            >
              查看PDF
            </el-link>
            <span v-else class="text-gray-400">未上传</span>
          </template>
        </el-table-column>

        <!-- 成果认定列 -->
        <el-table-column label="成果认定" width="140">
          <template #default="{ row }">
            <el-select
                v-model="row.recogStatus"
                size="small"
                @change="handleRecogStatusChange(row)"
                :disabled="!canEditRecogStatus(row.taskStatus)"
                style="width: 90px"
            >
              <el-option
                  v-for="option in recogStatusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container" v-if="total > 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      />
    </div>

    <!-- 新建任务弹窗 -->
    <CreateTaskDialog
      v-model:visible="showCreateDialog"
      @success="handleCreateSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { selectTask, updateTaskStatus } from '@/api/task'
import CreateTaskDialog from '@/components/CreateTaskDialog.vue'

// 搜索表单数据
const searchForm = reactive({
  taskName: '',
  collectionUser: '',
  taskStatus: undefined
})

// 任务列表数据
const tasks = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 控制新建任务弹窗显示
const showCreateDialog = ref(false)

// 任务状态映射配置
const taskStatusOptions = ref([
  { value: 1, label: '审核中' },
  { value: 2, label: '进行中' },
  { value: 3, label: '结束' },
  { value: 4, label: '关闭' }
])

// 成果认定状态映射配置
const recogStatusOptions = ref([
  { value: 1, label: '未开始' },
  { value: 2, label: '进行中' },
  { value: 3, label: '完成' }
])

// 根据状态值获取任务状态显示文本
const getTaskStatusLabel = computed(() => {
  return (statusValue) => {
    const option = taskStatusOptions.value.find(item => item.value === statusValue)
    return option ? option.label : '未知状态'
  }
})

// 根据状态值获取成果认定状态显示文本
const getRecogStatusLabel = computed(() => {
  return (statusValue) => {
    const option = recogStatusOptions.value.find(item => item.value === statusValue)
    return option ? option.label : '未开始'
  }
})

// 控制任务状态是否可编辑
const canEditTaskStatus = (status) => {
  return [1, 2].includes(status)
}

// 控制成果认定状态是否可编辑（只有任务状态为结束时可编辑）
const canEditRecogStatus = (taskStatus) => {
  return taskStatus === 3
}

// 搜索任务 - 增加数据预处理
const searchTasks = async () => {
  try {
    loading.value = true
    const params = {
      taskName: searchForm.taskName || undefined,
      collectionUser: searchForm.collectionUser || undefined,
      taskStatus: searchForm.taskStatus,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await selectTask(params)
    // 预处理数据：确保recogStatus始终为有效值（1/2/3）
    const processedList = (response.list || []).map(row => ({
      ...row,
      recogStatus: [1, 2, 3].includes(row.recogStatus) ? row.recogStatus : 1
    }))
    tasks.value = processedList
    total.value = response.total || 0
  } catch (error) {
    ElMessage.error('查询任务失败：' + (error.message || '网络异常'))
  } finally {
    loading.value = false
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.taskName = ''
  searchForm.collectionUser = ''
  searchForm.taskStatus = undefined
  currentPage.value = 1
  searchTasks()
}

// 处理分页大小变化
const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  searchTasks()
}

// 处理页码变化
const handleCurrentPageChange = (page) => {
  currentPage.value = page
  searchTasks()
}

// 处理任务状态变更
const handleTaskStatusChange = async (row) => {
  try {
    row.loading = true
    await updateTaskStatus({
      taskUserId: row.taskUserId,
      taskStatus: row.taskStatus
    })
    ElMessage.success(`任务状态已更新为${getTaskStatusLabel.value(row.taskStatus)}`)
  } catch (error) {
    ElMessage.error('任务状态更新失败：' + (error.message || '操作失败'))
    await searchTasks() // 失败时重新加载数据保持一致性
  } finally {
    row.loading = false
  }
}

// 处理成果认定状态变更
const handleRecogStatusChange = async (row) => {
  try {
    row.loading = true
    // 直接传递recogStatus，不做额外判断
    await updateTaskStatus({
      taskUserId: row.taskUserId,
      recogStatus: row.recogStatus
    })
    ElMessage.success(`成果认定状态已更新为${getRecogStatusLabel.value(row.recogStatus)}`)
  } catch (error) {
    ElMessage.error('成果认定状态更新失败：' + (error.message || '操作失败'))
    await searchTasks() // 失败时重新加载数据保持一致性
  } finally {
    row.loading = false
  }
}

// 查看PDF处理
const handleViewPdf = (url) => {
  console.log('查看PDF:', url)
}

// 打开新建任务弹窗
const createNewTask = () => {
  showCreateDialog.value = true
}

// 创建任务成功回调
const handleCreateSuccess = () => {
  // 刷新任务列表
  searchTasks()
}

// 页面加载时查询任务列表
onMounted(() => {
  searchTasks()
})
</script>

<style scoped>
.task-management-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 40px);
}

.search-area {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.task-list-area {
  width: 100%;
  margin-bottom: 20px;
}

.task-table {
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-gray-400 {
  color: #909399;
  font-size: 12px;
}

.el-form-item {
  margin-bottom: 16px;
}

:deep(.el-select) {
  margin-right: 5px;
}

:deep(.el-select .el-loading-mask) {
  z-index: 1;
}
</style>