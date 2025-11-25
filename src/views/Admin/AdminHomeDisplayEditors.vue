<template>
  <div class="flex min-h-screen bg-gray-50">
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-6">首页板块管理</h2>
        <nav class="space-y-2">
          <button
            @click="activeTab = 'projects'"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg transition-colors',
              activeTab === 'projects'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            ]"
          >
            热门开源项目
          </button>
          <button
            @click="activeTab = 'events'"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg transition-colors',
              activeTab === 'events'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            ]"
          >
            活动
          </button>
        </nav>
      </div>
    </aside>

    <main class="flex-1 p-8">
      <div v-if="activeTab === 'projects'">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">热门开源项目管理</h1>
          <button
            @click="openAddProjectDialog"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            新增项目
          </button>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  项目标题
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in homeProjects" :key="project.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ project.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    @click="openEditProjectDialog(project)"
                    class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    @click="handleDeleteProject(project.id)"
                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
              <tr v-if="!homeProjects || homeProjects.length === 0">
                <td colspan="2" class="px-6 py-4 text-center text-gray-500">
                  暂无数据
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="activeTab === 'events'">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">活动管理</h1>
          <button
            @click="openAddEventDialog"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            新增活动
          </button>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活动标题
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in homeEvents" :key="event.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ event.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    @click="openEditEventDialog(event)"
                    class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    @click="handleDeleteEvent(event.id)"
                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
              <tr v-if="!homeEvents || homeEvents.length === 0">
                <td colspan="2" class="px-6 py-4 text-center text-gray-500">
                  暂无数据
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <el-dialog
      v-model="projectDialogVisible"
      :title="isProjectEdit ? '编辑项目' : '新增项目'"
      width="600px"
    >
      <el-form :model="projectFormData" label-width="120px">
        <el-form-item label="选择项目">
          <el-select
            v-model="selectedProjectId"
            placeholder="请选择项目"
            @change="handleProjectSelect"
            class="w-full"
          >
            <el-option
              v-for="project in allProjects"
              :key="project.id"
              :label="project.name"
              :value="project.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="项目标题">
          <el-input v-model="projectFormData.title" placeholder="请输入项目标题" />
        </el-form-item>

        <el-form-item label="项目简介">
          <el-input
            v-model="projectFormData.copyWritingText"
            type="textarea"
            :rows="4"
            placeholder="自动填充"
          />
        </el-form-item>

        <el-form-item label="项目ID">
          <el-input v-model="projectFormData.link" placeholder="自动填充" readonly />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-input v-model="projectFormData.note" placeholder="自动填充" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="projectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitProject">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="eventDialogVisible"
      :title="isEventEdit ? '编辑活动' : '新增活动'"
      width="600px"
    >
      <el-form :model="eventFormData" label-width="120px">
        <el-form-item label="活动标题">
          <el-input v-model="eventFormData.title" placeholder="请输入活动标题" />
        </el-form-item>

        <el-form-item label="活动简介">
          <el-input
            v-model="eventFormData.copyWritingText"
            type="textarea"
            :rows="4"
            placeholder="请输入活动简介"
          />
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-input v-model="eventFormData.link" placeholder="请输入跳转路由，如：/events/xxx" />
        </el-form-item>

        <el-form-item label="时间地点">
          <el-input v-model="eventFormData.note" placeholder="请输入活动时间和地点，如：2025年10月1日 | 线上" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="eventDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitEvent">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import {
  getAllProjects,
  getHomeProjects,
  addHomeProject,
  deleteHomeProject,
  updateHomeProject,
  getHomeEvents,
  addHomeEvent,
  deleteHomeEvent,
  updateHomeEvent
} from '@/api/admin.js'

const activeTab = ref('projects')

const homeProjects = ref([])
const allProjects = ref([])
const projectDialogVisible = ref(false)
const isProjectEdit = ref(false)
const selectedProjectId = ref(null)
const projectFormData = ref({
  id: null,
  title: '',
  copyWritingText: '',
  link: '',
  note: ''
})

const homeEvents = ref([])
const eventDialogVisible = ref(false)
const isEventEdit = ref(false)
const eventFormData = ref({
  id: null,
  title: '',
  copyWritingText: '',
  link: '',
  note: ''
})

onMounted(async () => {
  await loadHomeProjects()
  await loadAllProjects()
  await loadHomeEvents()
})

async function loadHomeProjects() {
  try {
    const res = await getHomeProjects()
    homeProjects.value = res || []
  } catch (error) {
    console.error('加载首页项目失败', error)
    ElMessage.error('加载失败')
  }
}

async function loadAllProjects() {
  try {
    const res = await getAllProjects()
    allProjects.value = res || []
  } catch (error) {
    console.error('加载项目列表失败', error)
    ElMessage.error('加载项目列表失败')
  }
}

function openAddProjectDialog() {
  isProjectEdit.value = false
  selectedProjectId.value = null
  projectFormData.value = {
    id: null,
    title: '',
    copyWritingText: '',
    link: '',
    note: ''
  }
  projectDialogVisible.value = true
}

function openEditProjectDialog(project) {
  isProjectEdit.value = true
  projectFormData.value = { ...project }
  selectedProjectId.value = parseInt(project.link)
  projectDialogVisible.value = true
}

function handleProjectSelect(projectId) {
  const project = allProjects.value.find(p => p.id === projectId)
  if (project) {
    projectFormData.value.title = project.name
    projectFormData.value.copyWritingText = project.description || ''
    projectFormData.value.link = String(project.id)
    projectFormData.value.note = project.createTime || ''
  }
}

async function handleSubmitProject() {
  if (!projectFormData.value.title) {
    console.warn('请输入项目标题')
    return
  }

  try {
    if (isProjectEdit.value) {
      await updateHomeProject(projectFormData.value)
      ElMessage.success('更新成功')
    } else {
      const result = await addHomeProject(projectFormData.value)
      if (result.code === 403) {
        ElMessage.error(result.message || '首页项目展示已达上限（最多4个）')
        return
      }
      ElMessage.success('添加成功')
    }
    projectDialogVisible.value = false
    await loadHomeProjects()
  } catch (error) {
    console.error('操作失败', error)
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message)
    } else {
      console.error('操作失败')
    }
  }
}

async function handleDeleteProject(id) {
  try {
    await ElMessageBox.confirm(
      '确定要删除该项目吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteHomeProject(id)
    ElMessage.success('删除成功')
    await loadHomeProjects()
  } catch (error) {
    if (error === 'cancel') {
      return
    }
    console.error('删除失败', error)
  }
}


async function loadHomeEvents() {
  try {
    const res = await getHomeEvents()
    homeEvents.value = res || []
  } catch (error) {
    console.error('加载首页活动失败', error)
    ElMessage.error('加载失败')
  }
}

function openAddEventDialog() {
  isEventEdit.value = false
  eventFormData.value = {
    id: null,
    title: '',
    copyWritingText: '',
    link: '',
    note: ''
  }
  eventDialogVisible.value = true
}

function openEditEventDialog(event) {
  isEventEdit.value = true
  eventFormData.value = { ...event }
  eventDialogVisible.value = true
}

async function handleSubmitEvent() {
  if (!eventFormData.value.title) {
    return
  }

  try {
    if (isEventEdit.value) {
      await updateHomeEvent(eventFormData.value)
    } else {
      const result = await addHomeEvent(eventFormData.value)
      if (result.code === 403) {
        ElMessage.error(result.message || '首页活动展示已达上限（最多4个）')
        return
      }
    }
    eventDialogVisible.value = false
    await loadHomeEvents()
  } catch (error) {
    console.error('操作失败', error)
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message)
    } else {
      console.error('操作失败')
    }
  }
}

async function handleDeleteEvent(id) {
  try {
    await ElMessageBox.confirm(
      '确定要删除该活动吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteHomeEvent(id)
    await loadHomeEvents()
  } catch (error) {
    if (error === 'cancel') {
      return
    }
    console.error('删除失败', error)
  }
}
</script>
