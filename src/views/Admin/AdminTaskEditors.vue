<template>
  <div class="flex min-h-screen">
    <!-- 左侧侧边栏 -->
    <div class="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h2 class="text-lg font-bold mb-4">管理菜单</h2>
      <nav class="space-y-2">
        <button
            @click="currentView = 'intern-tasks'"
            :class="[
            'w-full text-left px-4 py-2 rounded-lg transition-colors',
            currentView === 'intern-tasks'
              ? 'bg-indigo-600 text-white'
              : 'bg-white hover:bg-gray-100'
          ]"
        >
          实习生任务管理
        </button>
        <button
            @click="currentView = 'task-edit'"
            :class="[
            'w-full text-left px-4 py-2 rounded-lg transition-colors',
            currentView === 'task-edit'
              ? 'bg-indigo-600 text-white'
              : 'bg-white hover:bg-gray-100'
          ]"
        >
          任务编辑
        </button>
      </nav>
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex-1 overflow-auto">
      <!-- 实习生任务管理视图 -->
      <div v-if="currentView === 'intern-tasks'" class="task-management-container">
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
      </div>

      <!-- 任务编辑视图 -->
      <div v-if="currentView === 'task-edit'" class="task-edit-container">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">任务编辑</h1>
            <el-button type="primary" @click="createNewTask">新建任务</el-button>
          </div>

          <div class="overflow-x-auto">
            <el-table
                :data="allTasksList"
                border
                v-loading="allTasksLoading"
                element-loading-text="加载中..."
                class="w-full"
            >
              <el-table-column prop="projectName" label="项目名" width="200" />
              <el-table-column prop="projectType" label="项目类" width="150" />
              <el-table-column prop="protocol" label="协议" width="150" />
              <el-table-column label="Gitee" width="120">
                <template #default="{ row }">
                  <el-link
                      v-if="row.gitee"
                      :href="row.gitee"
                      target="_blank"
                      type="primary"
                  >
                    链接
                  </el-link>
                  <span v-else class="text-gray-400">-</span>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
              <el-table-column prop="deadline" label="截止时间" width="180" />
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button
                      type="primary"
                      size="small"
                      @click="handleEdit(row)"
                  >
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页器 -->
          <div class="pagination-container mt-4" v-if="allTasksTotal > 0">
            <el-pagination
                @size-change="handleAllTasksPageSizeChange"
                @current-change="handleAllTasksCurrentPageChange"
                :current-page="allTasksCurrentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="allTasksPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="allTasksTotal"
            />
          </div>
        </div>

        <!-- 编辑任务对话框 -->
        <el-dialog
            v-model="editDialogVisible"
            title="编辑任务"
            width="600px"
            @close="handleEditDialogClose"
        >
          <el-form ref="editFormRef" :model="editForm" label-width="100px">
            <el-form-item label="项目名" prop="projectName">
              <el-input v-model="editForm.projectName" />
            </el-form-item>

            <el-form-item label="任务分类" prop="taskClass">
              <el-select
                  v-model="editForm.taskClass"
                  placeholder="请选择任务分类"
                  clearable
                  style="width: 100%"
                  :loading="classLoading"
              >
                <el-option
                    v-for="item in taskClassOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="String(item.id)"
                />
                <template #footer>
                  <el-button
                      v-if="!isAddingClass"
                      text
                      bg
                      size="small"
                      @click="onAddClassOption"
                      :loading="classLoading"
                  >
                    添加分类
                  </el-button>
                  <template v-else>
                    <el-space direction="vertical" size="8px">
                      <el-input
                          v-model="classOptionName"
                          class="option-input"
                          placeholder="输入分类名称"
                          size="small"
                      />
                      <el-input
                          v-model="classOptionDescribe"
                          class="option-input"
                          placeholder="输入分类描述"
                          size="small"
                      />
                      <el-space direction="horizontal" size="8px">
                        <el-button
                            type="primary"
                            size="small"
                            @click="onConfirmClass"
                            :loading="classLoading"
                        >
                          确认
                        </el-button>
                        <el-button
                            size="small"
                            @click="clearClassInput"
                            :disabled="classLoading"
                        >
                          取消
                        </el-button>
                      </el-space>
                    </el-space>
                  </template>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item label="协议" prop="taskProtocolId">
              <el-select
                  v-model="editForm.taskProtocolId"
                  placeholder="请选择或输入协议"
                  clearable
                  style="width: 100%"
                  :loading="protocolLoading"
              >
                <el-option
                    v-for="item in protocolOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="String(item.id)"
                />
                <template #footer>
                  <el-button
                      v-if="!isAddingProtocol"
                      text
                      bg
                      size="small"
                      @click="onAddProtocolOption"
                      :loading="protocolLoading"
                  >
                    添加协议
                  </el-button>
                  <template v-else>
                    <el-space direction="vertical" size="8px">
                      <el-input
                          v-model="protocolOptionName"
                          class="option-input"
                          placeholder="输入协议名称"
                          size="small"
                      />
                      <el-input
                          v-model="protocolOptionLink"
                          class="option-input"
                          placeholder="输入协议链接"
                          size="small"
                      />
                      <el-space direction="horizontal" size="8px">
                        <el-button
                            type="primary"
                            size="small"
                            @click="onConfirmProtocol"
                            :loading="protocolLoading"
                        >
                          确认
                        </el-button>
                        <el-button
                            size="small"
                            @click="clearProtocolInput"
                            :disabled="protocolLoading"
                        >
                          取消
                        </el-button>
                      </el-space>
                    </el-space>
                  </template>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item label="Gitee链接">
              <el-input v-model="editForm.gitee" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                  v-model="editForm.description"
                  type="textarea"
                  :rows="4"
              />
            </el-form-item>
            <el-form-item label="截止时间">
              <el-date-picker
                  v-model="editForm.deadline"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSaveEdit" :loading="editSubmitLoading">保存</el-button>
          </template>
        </el-dialog>
      </div>

      <!-- 新建任务弹窗（移到外层，两个视图都能访问） -->
      <CreateTaskDialog
        v-model:visible="showCreateDialog"
        @success="handleCreateSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { selectTask, updateTaskStatus, getTasksForEdit, updateTaskInfo, fetchTaskCategories, getProtocols, createTaskClass, createProtocol } from '@/api/task'
import CreateTaskDialog from '@/components/CreateTaskDialog.vue'

// 视图切换
const currentView = ref('intern-tasks')
// 任务编辑视图的数据
const allTasksList = ref([])
const allTasksTotal = ref(0)
const allTasksCurrentPage = ref(1)
const allTasksPageSize = ref(10)
const allTasksLoading = ref(false)

// 编辑对话框相关
const editDialogVisible = ref(false)
const editSubmitLoading = ref(false)
const editFormRef = ref(null)
const classLoading = ref(false)
const protocolLoading = ref(false)

// 任务分类和协议选项
const taskClassOptions = ref([])
const protocolOptions = ref([])
const isAddingClass = ref(false)
const classOptionName = ref('')
const classOptionDescribe = ref('')
const isAddingProtocol = ref(false)
const protocolOptionName = ref('')
const protocolOptionLink = ref('')

const editForm = reactive({
  taskId: null,
  projectName: '',
  taskClass: null,  // 存储分类ID（字符串）
  taskProtocolId: null, // 存储协议ID（字符串）
  gitee: '',
  description: '',
  deadline: ''
})

// 加载所有任务（用于任务编辑视图）
const loadAllTasks = async () => {
  try {
    allTasksLoading.value = true
    const params = {
      pageNum: allTasksCurrentPage.value,
      pageSize: allTasksPageSize.value
    }
    const response = await getTasksForEdit(params)
    if (response && response.list) {
      allTasksList.value = response.list
      allTasksTotal.value = response.total || 0
    } else {
      allTasksList.value = []
      allTasksTotal.value = 0
    }
  } catch (error) {
    ElMessage.error('加载任务列表失败：' + (error.message || '网络异常'))
    allTasksList.value = []
    allTasksTotal.value = 0
  } finally {
    allTasksLoading.value = false
  }
}

// 加载任务分类
const loadTaskClasses = async () => {
  try {
    classLoading.value = true
    const response = await fetchTaskCategories()
    taskClassOptions.value = response || []
  } catch (error) {
    console.error('加载任务分类失败:', error)
    ElMessage.error('加载任务分类失败')
  } finally {
    classLoading.value = false
  }
}

// 加载协议列表
const loadProtocols = async () => {
  try {
    protocolLoading.value = true
    const response = await getProtocols()
    protocolOptions.value = response || []
  } catch (error) {
    console.error('加载协议列表失败:', error)
    ElMessage.error('加载协议列表失败')
  } finally {
    protocolLoading.value = false
  }
}

// 添加分类选项
const onAddClassOption = () => {
  isAddingClass.value = true
}

// 确认添加分类
const onConfirmClass = async () => {
  if (!classOptionName.value.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }

  try {
    classLoading.value = true
    const newClass = await createTaskClass({
      name: classOptionName.value.trim(),
      description: classOptionDescribe.value.trim(),
    })
    taskClassOptions.value.push(newClass)
    editForm.taskClass = String(newClass.id)
    ElMessage.success('任务分类创建成功')
    clearClassInput()
  } catch (error) {
    console.error('创建任务分类失败:', error)
    ElMessage.error('创建任务分类失败：' + (error.message || '操作失败'))
  } finally {
    classLoading.value = false
  }
}

// 清空分类输入
const clearClassInput = () => {
  classOptionName.value = ''
  classOptionDescribe.value = ''
  isAddingClass.value = false
}

// 添加协议选项
const onAddProtocolOption = () => {
  isAddingProtocol.value = true
}

// 确认添加协议
const onConfirmProtocol = async () => {
  if (!protocolOptionName.value.trim()) {
    ElMessage.warning('请输入协议名称')
    return
  }
  if (!protocolOptionLink.value.trim()) {
    ElMessage.warning('请输入协议链接')
    return
  }

  try {
    protocolLoading.value = true
    const newProtocol = await createProtocol({ title: protocolOptionName.value.trim(), link: protocolOptionLink.value.trim() })
    protocolOptions.value.push(newProtocol)
    editForm.taskProtocolId = String(newProtocol.id)
    ElMessage.success('协议创建成功')
    clearProtocolInput()
  } catch (error) {
    console.error('创建协议失败:', error)
    ElMessage.error('创建协议失败：' + (error.message || '操作失败'))
  } finally {
    protocolLoading.value = false
  }
}

// 清空协议输入
const clearProtocolInput = () => {
  protocolOptionName.value = ''
  protocolOptionLink.value = '' // 修复：清空协议链接输入
  isAddingProtocol.value = false
}

// 处理编辑按钮点击 【核心修改】
const handleEdit = async (row) => {
  try {
    // 1. 先加载分类和协议的完整列表（包含ID和名称）
    await loadTaskClasses()
    await loadProtocols()

    // 2. 赋值基础数据
    editForm.taskId = row.taskId
    editForm.projectName = row.projectName || ''
    editForm.gitee = row.gitee || ''
    editForm.description = row.description || ''
    editForm.deadline = row.deadline || ''

    // 3. 关键：将projectType（分类名称）/protocol（协议名称）映射为对应的ID
    // 3.1 处理任务分类：根据row.projectName匹配分类ID
    if (row.projectType) {
      const targetClass = taskClassOptions.value.find(item => item.name === row.projectType)
      editForm.taskClass = targetClass ? String(targetClass.id) : null
    } else {
      // 兼容旧数据：如果没有projectType，用taskClassId兜底
      editForm.taskClass = row.taskClassId ? String(row.taskClassId) : null
    }

    // 3.2 处理协议：根据row.protocol匹配协议ID
    if (row.protocol) {
      const targetProtocol = protocolOptions.value.find(item => item.title === row.protocol)
      editForm.taskProtocolId = targetProtocol ? String(targetProtocol.id) : null
    } else {
      // 兼容旧数据：如果没有protocol，用protocolId兜底
      editForm.taskProtocolId = row.protocolId ? String(row.protocolId) : null
    }

    // 4. 打开编辑弹窗
    editDialogVisible.value = true
  } catch (error) {
    ElMessage.error('加载编辑数据失败：' + error.message)
  }
}

// 处理保存编辑
const handleSaveEdit = async () => {
  try {
    editSubmitLoading.value = true
    const data = {
      taskName: editForm.projectName,
      taskClass: editForm.taskClass,
      taskProtocolId: editForm.taskProtocolId,
      giteeLink: editForm.gitee,
      taskDescription: editForm.description,
      deadlineTime: editForm.deadline
    }
    await updateTaskInfo(editForm.taskId, data)
    ElMessage.success('保存成功')
    editDialogVisible.value = false
    // 重新加载数据
    await loadAllTasks()
  } catch (error) {
    ElMessage.error('保存失败：' + (error.message || '网络异常'))
  } finally {
    editSubmitLoading.value = false
  }
}

// 关闭编辑对话框
const handleEditDialogClose = () => {
  editForm.taskId = null
  editForm.projectName = ''
  editForm.taskClass = null
  editForm.taskProtocolId = null
  editForm.gitee = ''
  editForm.description = ''
  editForm.deadline = ''
  clearClassInput()
  clearProtocolInput()
  editFormRef.value?.resetFields()
}

// 处理任务编辑视图的分页大小变化
const handleAllTasksPageSizeChange = (size) => {
  allTasksPageSize.value = size
  allTasksCurrentPage.value = 1
  loadAllTasks()
}

// 处理任务编辑视图的页码变化
const handleAllTasksCurrentPageChange = (page) => {
  allTasksCurrentPage.value = page
  loadAllTasks()
}

// 监听视图切换，切换到任务编辑时加载数据
watch(currentView, async (view) => {
  if (view === 'task-edit' && allTasksList.value.length === 0) {
    await loadAllTasks()
  }
})

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
  // 根据当前视图刷新对应的任务列表
  if (currentView.value === 'intern-tasks') {
    searchTasks()
  } else if (currentView.value === 'task-edit') {
    loadAllTasks()
  }
}

// 页面加载时查询任务列表
onMounted(() => {
  searchTasks()
})
</script>

<style scoped>
/* 侧边栏样式 */
.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.min-h-screen {
  min-height: 100vh;
}

.w-64 {
  width: 16rem;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.border-r {
  border-right-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.p-4 {
  padding: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-bold {
  font-weight: 700;
}

.mb-4 {
  margin-bottom: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.w-full {
  width: 100%;
}

.text-left {
  text-align: left;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.text-white {
  color: #ffffff;
}

.bg-white {
  background-color: #ffffff;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.flex-1 {
  flex: 1 1 0%;
}

.overflow-auto {
  overflow: auto;
}

.p-6 {
  padding: 1.5rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.overflow-x-auto {
  overflow-x: auto;
}

.mt-4 {
  margin-top: 1rem;
}

/* 原有样式 */
.task-management-container {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 40px);
}

.task-edit-container {
  background-color: #fff;
  min-height: 100vh;
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

/* 修复添加选项的输入框样式 */
:deep(.option-input) {
  width: 100%;
}
</style>