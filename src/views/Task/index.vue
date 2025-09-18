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
              <el-table-column
                  prop="taskProtocolTitle"
                  label="遵循协议"
                  width="200"
                  align="center"
              >
                <template #default="scope">
                  <a
                      v-if="scope.row.taskProtocolTitle && scope.row.taskProtocolLink"
                      :href="scope.row.taskProtocolLink"
                      target="_blank"
                      class="protocol-link"
                      rel="noopener noreferrer"
                  >
                    {{ scope.row.taskProtocolTitle }}
                  </a>
                  <span v-else class="no-protocol">无协议</span>
                </template>
              </el-table-column>
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
          <div class="pagination-container" v-if="isShowTaskList && totalTasks > 0">
            <el-pagination
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalTasks"
            >
            </el-pagination>
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
            <el-table-column
                prop="taskProtocolTitle"
                label="遵循协议"
                width="200"
                align="center"
            >
              <template #default="scope">
                <a
                    v-if="scope.row.taskProtocolTitle && scope.row.taskProtocolLink"
                    :href="scope.row.taskProtocolLink"
                    target="_blank"
                    class="protocol-link"
                    rel="noopener noreferrer"
                >
                  {{ scope.row.taskProtocolTitle }}
                </a>
                <span v-else class="no-protocol">无协议</span>
              </template>
            </el-table-column>
            <el-table-column prop="statusText" label="任务状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ scope.row.statusText }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="claimTime" label="领取时间" width="180" align="center"/>
            <el-table-column prop="deadlineTime" label="截止时间" width="180" align="center"/>
            <el-table-column label="操作" width="300" align="center">
              <template #default="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="handleViewTaskDetail(scope.row.id)"
                >
                  查看详情
                </el-button>
                <el-button
                    type="default"
                    size="small"
                    @click="handleSubmitResult(scope.row)"
                    :disabled="scope.row.status !== 'completed'"
                >
                  提交成果
                </el-button>
                <el-button
                    type="default"
                    size="small"
                    @click="handlePublishRequest(scope.row)"
                    :disabled="scope.row.status !== 'completed'"
                >
                  成果发布请求
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 我的任务分页器-->
        <div class="pagination-container" v-if="myTasksTotal > 0">
          <el-pagination
              @size-change="handleMyTaskPageSizeChange"
              @current-change="handleMyTaskCurrentPageChange"
              :current-page="myTaskCurrentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="myTaskPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="myTasksTotal"
          >
          </el-pagination>
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
          <i class="el-icon-error"/>
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

    <!-- 提交成果对话框 -->
    <el-dialog
        title="提交任务成果"
        v-model="isSubmitDialogOpen"
        width="600px"
        :before-close="handleCloseSubmitDialog"
    >
      <div class="submit-dialog-content">
        <p class="dialog-tip">请上传任务相关的成果文件（支持所有类型文件，可上传多个）</p>

        <!-- 已上传文件列表 -->
        <div class="uploaded-files" v-if="uploadedFiles.length > 0">
          <h4 class="files-title">已上传文件（{{ uploadedFiles.length }}个）</h4>
          <el-scrollbar class="files-scroll">
            <div class="file-item" v-for="(file, index) in uploadedFiles" :key="index">
              <i class="el-icon-document" :class="getFileIconClass(file.name)"></i>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">({{ formatFileSize(file.size) }})</span>
              <el-button
                  type="text"
                  size="small"
                  class="delete-file-btn"
                  @click="handleDeleteFile(index)"
              >
                <i class="el-icon-delete"></i> 删除
              </el-button>
            </div>
          </el-scrollbar>
        </div>

        <!-- 文件上传组件 -->
        <el-upload
            class="file-uploader"
            :action="uploadUrl"
            :auto-upload="false"
            :file-list="uploadFileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            multiple
            accept="*"
            ref="uploadRef"
            :http-request="handleCustomUpload"
        >
          <el-button type="primary" size="small">
            <i class="el-icon-upload"></i> 选择文件
          </el-button>
          <p class="upload-hint">单个文件不超过50MB</p>
        </el-upload>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isSubmitDialogOpen = false">取消</el-button>
          <el-button
              type="primary"
              @click="handleUploadAllFiles"
              :loading="isUploading"
              :disabled="uploadedFiles.length === 0"
          >
            上传所有文件
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 成果发布请求对话框 -->
    <el-dialog
        title="成果发布请求"
        v-model="isPublishDialogOpen"
        width="500px"
        :close-on-click-modal="false"
    >
      <div class="publish-dialog-content">
        <div class="publish-step">
          <h4 class="step-title">第一步：下载模板</h4>
          <p class="step-desc">请下载成果发布申请模板，按要求填写完整信息</p>
          <el-button
              type="primary"
              size="small"
              @click="handleDownloadTemplate"
              class="download-btn"
              :loading="isDownloadingTemplate"
          >
            <i class="el-icon-download"></i> 下载Word模板
          </el-button>
        </div>

        <div class="publish-step">
          <h4 class="step-title">第二步：发送邮件</h4>
          <p class="step-desc">将填写好的模板发送至以下邮箱进行审核：</p>
          <div class="email-info">
            <i class="el-icon-envelope"></i>
            <span class="email-address">xxxx@163.com</span>
            <el-button
                type="text"
                size="small"
                @click="copyEmailAddress"
                class="copy-btn"
                :loading="isCopying"
            >
              复制邮箱
            </el-button>
          </div>
        </div>

        <div class="publish-step">
          <h4 class="step-title">第三步：等待审核</h4>
          <p class="step-desc">审核周期：约3-5个工作日</p>
          <p class="step-desc">审核结果将通过邮件通知，请留意邮箱信息</p>
        </div>

        <div class="publish-note">
          <i class="el-icon-info"></i>
          <p>注意：请在邮件主题中注明“【成果发布申请】-任务ID：{{
              currentPublishTask?.id
            }}-任务名称：{{ currentPublishTask?.taskName }}”，以便快速处理</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="isPublishDialogOpen = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, onUnmounted} from 'vue'
import {
  ElMenu, ElMenuItem, ElCard, ElTable, ElTableColumn,
  ElButton, ElMessage, ElBreadcrumb, ElBreadcrumbItem,
  ElTag, ElDrawer, ElDialog, ElUpload, ElScrollbar, ElPagination
} from 'element-plus'
import {
  fetchTaskCategories,
  fetchTasksByCategory,
  fetchMyTasks,
  fetchReceivedTaskCount,
  claimTask,
  uploadTaskFiles,
  getPublishTemplateUrl
} from '@/api/task.js'

// 状态映射常量
const STATUS_MAP = {
  1: {status: 'pending', text: '待处理'},
  2: {status: 'processing', text: '处理中'},
  3: {status: 'completed', text: '已完成'},
  unknown: {status: 'unknown', text: '未知状态'}
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
const currentPage = ref(1)
const pageSize = ref(10)
const totalTasks = ref(0)
const myTaskCurrentPage = ref(1);
const myTaskPageSize = ref(10);
const myTasksTotal = ref(0);

// 提交成果相关状态
const isSubmitDialogOpen = ref(false)
const currentSubmitTask = ref(null)
const uploadedFiles = ref([])
const uploadFileList = ref([])
const isUploading = ref(false)
const uploadUrl = ref('/api/upload') // 文件上传接口地址
const uploadRef = ref(null)

// 成果发布请求相关状态
const isPublishDialogOpen = ref(false)
const currentPublishTask = ref(null)
const templateUrl = ref('')
const isCopying = ref(false)
const isDownloadingTemplate = ref(false)

// 加载状态
const categoryLoading = ref(false)
const taskLoading = ref(false)
const myTasksLoading = ref(false)
const claimLoading = ref({})

// 计算属性
const getActiveCategoryName = computed(() => {
  return taskCategories.value.find(cat => cat.id === activeCategoryId.value)?.name || ''
})

// 在计算属性中添加协议相关字段
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
      isClaimed: !!task.collectionUser,
      taskProtocolTitle: task.taskProtocolTitle,
      taskProtocolLink: task.taskProtocolLink
    }
  })
})

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

// 文件处理相关方法
const getFileIconClass = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  const extMap = {
    doc: 'doc-icon',
    docx: 'docx-icon',
    pdf: 'pdf-icon',
    xls: 'xls-icon',
    xlsx: 'xlsx-icon',
    ppt: 'ppt-icon',
    pptx: 'pptx-icon',
    zip: 'zip-icon',
    rar: 'rar-icon',
    jpg: 'img-icon',
    jpeg: 'img-icon',
    png: 'img-icon',
    gif: 'img-icon'
  }
  return extMap[ext] || 'file-icon'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
    console.error(err.message)
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
  currentPage.value = 1

  if (!isHistoryPushed.value) {
    window.history.pushState({from: 'task-list'}, '', window.location.href)
    isHistoryPushed.value = true
  }

  await getTasksByCategory(categoryId)
}

// 分页事件处理
const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  if (activeCategoryId.value) {
    getTasksByCategory(activeCategoryId.value)
  }
}

const handleCurrentPageChange = (page) => {
  currentPage.value = page
  if (activeCategoryId.value) {
    getTasksByCategory(activeCategoryId.value)
  }
}

// 我的任务分页处理
const handleMyTaskPageSizeChange = (size) => {
  myTaskPageSize.value = size
  myTaskCurrentPage.value = 1
  getMyTasks()
}

const handleMyTaskCurrentPageChange = (page) => {
  myTaskCurrentPage.value = page
  getMyTasks()
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
    const res = await claimTask({taskId, username})
    if (res != null) {
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

// 提交成果相关方法
const handleSubmitResult = (task) => {
  currentSubmitTask.value = task
  isSubmitDialogOpen.value = true
  uploadedFiles.value = []
  uploadFileList.value = []
}

const handleCloseSubmitDialog = () => {
  isSubmitDialogOpen.value = false
  uploadedFiles.value = []
  uploadFileList.value = []
}

const handleFileChange = (file, fileList) => {
  uploadFileList.value = fileList
  // 过滤出准备上传的文件
  const newFiles = fileList.filter(f =>
      !uploadedFiles.value.some(uf => uf.name === f.name && uf.size === f.size)
  ).map(f => f.raw)

  uploadedFiles.value = [...uploadedFiles.value, ...newFiles]
}

const handleFileRemove = (file, fileList) => {
  uploadFileList.value = fileList
  // 从已上传文件列表中移除
  uploadedFiles.value = uploadedFiles.value.filter(
      uf => !(uf.name === file.name && uf.size === file.size)
  )
}

const handleDeleteFile = (index) => {
  uploadedFiles.value.splice(index, 1)
  // 同步更新上传组件的文件列表
  uploadFileList.value = uploadFileList.value.filter(
      f => !(uploadedFiles.value.some(uf => uf.name === f.name && uf.size === f.size))
  )
}

const handleCustomUpload = async (options) => {
  const {file, onSuccess, onError} = options;
  try {
    // 创建FormData对象，用于文件上传
    const formData = new FormData();
    // 添加任务ID和文件
    formData.append('taskId', currentSubmitTask.value.id);
    formData.append('file', file);
    formData.append('username', localStorage.getItem('username'))

    const response = await uploadTaskFiles(formData);
    onSuccess({
      status: 'success',
      data: response
    });
  } catch (error) {
    console.error('文件上传失败', error);
    onError(new Error(error.message || '文件上传失败，请重试'));
  }
};

const handleUploadAllFiles = async () => {
  if (uploadedFiles.value.length === 0) return

  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('taskId', currentSubmitTask.value.id)
    uploadedFiles.value.forEach(file => {
      formData.append('files', file)
    })

    // 调用上传接口
    const response = await uploadTaskFiles(formData)

    if (response.success) {
      ElMessage.success('文件上传成功！')
      isSubmitDialogOpen.value = false
      // 刷新任务列表
      await getMyTasks()
      // 重置上传状态
      uploadedFiles.value = []
      uploadFileList.value = []
    } else {
      ElMessage.error(`上传失败：${response.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('文件上传失败', error)
    ElMessage.error(`上传失败：${error.message || '网络错误'}`)
  } finally {
    isUploading.value = false
  }
}

// 成果发布请求相关方法
const handlePublishRequest = (task) => {
  currentPublishTask.value = task
  isPublishDialogOpen.value = true
}

const handleDownloadTemplate = async () => {
  try {
    isDownloadingTemplate.value = true
    // 获取模板下载地址
    const response = await getPublishTemplateUrl()
    templateUrl.value = response.url

    // 创建下载链接并触发下载
    const link = document.createElement('a')
    link.href = templateUrl.value
    link.download = '成果发布申请表模板.docx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    ElMessage.success('模板下载成功，请查收')
  } catch (error) {
    console.error('模板下载失败', error)
    ElMessage.error(`模板下载失败：${error.message || '网络错误'}`)
  } finally {
    isDownloadingTemplate.value = false
  }
}

const copyEmailAddress = async () => {
  try {
    isCopying.value = true
    const email = 'xxxx@163.com'
    await navigator.clipboard.writeText(email)
    ElMessage.success('邮箱地址已复制')
  } catch (error) {
    console.error('复制失败', error)
    ElMessage.error('复制失败，请手动复制')
  } finally {
    isCopying.value = false
  }
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
    const res = await fetchTasksByCategory({
      categoryId,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    const {taskList, total, pageNum, pageSize: size} = res || {}
    currentTasks.value = (taskList || []).map(task => {
      const statusInfo = getStatusInfo(task.taskStatus)
      return {
        ...task,
        status: statusInfo.status,
        statusText: statusInfo.text,
        isClaimed: !!task.collectionUser,
        claimTime: task.collectionTime
      }
    })
    totalTasks.value = total || 0
    currentPage.value = pageNum || 1
    pageSize.value = size || 10
  } catch (err) {
    currentTasks.value = []
    totalTasks.value = 0
    throw new Error(`获取任务列表失败：${err.message}`)
  } finally {
    taskLoading.value = false
  }
}

const getMyTasks = async () => {
  myTasksLoading.value = true
  try {
    const res = await fetchMyTasks({
      params: username,
      pageNum: myTaskCurrentPage.value,
      pageSize: myTaskPageSize.value
    })
    console.info(res)
    const {taskList, total, pageNum, pageSize: size} = res || {}
    myTasks.value = (taskList || []).map(task => {
      const statusInfo = getStatusInfo(task.taskStatus)
      return {
        ...task,
        status: statusInfo.status,
        statusText: statusInfo.text,
        isClaimed: !!task.collectionUser,
        claimTime: task.collectionTime
      }
    })
    myTasksTotal.value = total || 0  // 修正：将总数赋值给myTasksTotal
    myTaskCurrentPage.value = pageNum || 1
    myTaskPageSize.value = size || 10
  } catch (err) {
    myTasks.value = []
    ElMessage.error(`获取我的任务失败：${err.message || '未知错误'}`)
  } finally {
    myTasksLoading.value = false
  }
}

const getReceivedTaskCount = async () => {
  try {
    const params = {params: username}
    const res = await fetchReceivedTaskCount(params)
    receivedTaskCount.value = res.data?.count || 0
  } catch (err) {
    receivedTaskCount.value = 0
    throw new Error(`获取已领取任务数量失败：${err.message}`)
  }
}
</script>

<style scoped>
/* 样式保持不变 */
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

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
}

:deep(.el-pagination) {
  font-size: 14px;
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

.submit-dialog-content {
  padding: 10px 0;
}

.dialog-tip {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.uploaded-files {
  margin-bottom: 20px;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  padding: 12px;
}

.files-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.files-scroll {
  max-height: 180px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #F0F0F0;
  font-size: 13px;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  flex: 1;
  margin: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: #999;
  margin-right: 10px;
  font-size: 12px;
}

.delete-file-btn {
  color: #F56C6C !important;
  padding: 0 5px !important;
}

.file-uploader {
  margin-top: 16px;
}

.upload-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

/* 成果发布请求对话框样式 */
.publish-dialog-content {
  padding: 10px 0;
}

.publish-step {
  margin-bottom: 24px;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  display: flex;
  align-items: center;
}

.step-title:before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #165DFF;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  margin-right: 8px;
}

.step-desc {
  color: #666;
  margin-bottom: 12px;
  padding-left: 24px;
  font-size: 14px;
}

.email-info {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #F5F7FA;
  border-radius: 4px;
  margin-bottom: 12px;
  padding-left: 24px;
}

.email-address {
  margin: 0 10px;
  flex: 1;
  font-size: 14px;
}

.copy-btn {
  color: #165DFF !important;
  padding: 0 5px !important;
}

.download-btn {
  margin-left: 24px;
}

.publish-note {
  margin-top: 20px;
  padding: 12px;
  background-color: #FFF8E6;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  font-size: 13px;
}

.publish-note i {
  color: #FAAD14;
  margin-right: 8px;
  margin-top: 3px;
}

.publish-note p {
  color: #E6A23C;
  line-height: 1.5;
  margin: 0;
}
</style>