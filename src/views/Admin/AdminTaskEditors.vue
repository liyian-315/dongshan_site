<template>
  <div class="task-management-container">
    <!-- 搜索区域（新增状态搜索下拉框） -->
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
        <!-- 新增：状态搜索下拉框 -->
        <el-form-item label="任务状态">
          <el-select
              v-model="searchForm.taskStatus"
              placeholder="全部状态"
              clearable
              size="default"
              style="width: 160px"
          >
            <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTasks">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 任务列表区域（保持不变） -->
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
        <!-- 状态列 - 带映射和切换功能 -->
        <el-table-column label="状态" width="160">
          <template #default="{ row }">
            <el-select
                v-model="row.taskStatus"
                size="small"
                @change="handleStatusChange(row)"
                :disabled="!canEditStatus(row.taskStatus)"
                style="width: 120px"
            >
              <el-option
                  v-for="option in statusOptions"
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
      </el-table>
    </div>

    <!-- 分页器（保持不变） -->
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElSelect, ElOption, ElLink } from 'element-plus'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElPagination } from 'element-plus'
import { selectTask, updateTaskStatus } from '@/api/task'

// 搜索表单数据（新增taskStatus字段）
const searchForm = reactive({
  taskName: '',
  collectionUser: '',
  taskStatus: undefined  // 新增：状态搜索参数，初始为undefined表示不筛选
})

// 任务列表数据（保持不变）
const tasks = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 状态映射配置（与下拉框共用，保持一致）
const statusOptions = ref([
  { value: 1, label: '审核中' },
  { value: 2, label: '进行中' },
  { value: 3, label: '结束' },
  { value: 4, label: '关闭' }
])

// 根据状态值获取显示文本（保持不变）
const getStatusLabel = computed(() => {
  return (statusValue) => {
    const option = statusOptions.value.find(item => item.value === statusValue)
    return option ? option.label : '未知状态'
  }
})

// 控制状态是否可编辑（保持不变）
const canEditStatus = (status) => {
  return [1, 2].includes(status)
}

// 搜索任务（修改：添加状态参数）
const searchTasks = async () => {
  try {
    loading.value = true
    const params = {
      taskName: searchForm.taskName || undefined,
      collectionUser: searchForm.collectionUser || undefined,
      taskStatus: searchForm.taskStatus,  // 新增：传递状态搜索参数
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await selectTask(params)
    tasks.value = response.list || []
    total.value = response.total || 0
  } catch (error) {
    ElMessage.error('查询任务失败：' + (error.message || '网络异常'))
  } finally {
    loading.value = false
  }
}

// 重置搜索条件（修改：重置状态参数）
const resetSearch = () => {
  searchForm.taskName = ''
  searchForm.collectionUser = ''
  searchForm.taskStatus = undefined  // 重置状态筛选
  currentPage.value = 1
  searchTasks()
}

// 处理分页大小变化（保持不变）
const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  searchTasks()
}

// 处理页码变化（保持不变）
const handleCurrentPageChange = (page) => {
  currentPage.value = page
  searchTasks()
}

// 处理状态变更（保持不变）
const handleStatusChange = async (row) => {
  try {
    row.loading = true

    await updateTaskStatus({
      taskUserId: row.taskUserId,
      taskStatus: row.taskStatus
    })

    ElMessage.success(`状态已更新为${getStatusLabel.value(row.taskStatus)}`)
  } catch (error) {
    ElMessage.error('状态更新失败：' + (error.message || '操作失败'))
    await searchTasks()
  } finally {
    row.loading = false
  }
}

// 查看PDF处理（保持不变）
const handleViewPdf = (url) => {
  console.log('查看PDF:', url)
}

// 页面加载时查询任务列表（保持不变）
onMounted(() => {
  searchTasks()
})
</script>

<style scoped>
/* 原有样式保持不变，补充状态下拉框的布局优化 */
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
  flex-wrap: wrap;  /* 新增：防止搜索项过多时溢出 */
}

/* 其他样式保持不变... */
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