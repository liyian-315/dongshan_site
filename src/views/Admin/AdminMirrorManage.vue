<template>
  <div class="mirror-management-container">
    <h2 class="page-title">软件镜像管理</h2>

    <!-- 架构选择区域 -->
    <div class="arch-select-area">
      <el-form :inline="true" class="arch-form">
        <el-form-item label="选择架构">
          <el-radio-group v-model="selectedArchId" @change="handleArchChange" size="large">
            <el-radio-button v-for="arch in archList" :key="arch.id" :label="arch.id">
              {{ arch.title }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设备管理区域 -->
    <div class="device-management-area">
      <div class="area-header">
        <h3>设备管理</h3>
        <el-button type="primary" @click="showAddDeviceDialog">添加设备</el-button>
      </div>

      <el-table :data="devices" border class="device-table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="设备名称" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditDevice(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteDevice(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 镜像管理区域 -->
    <div class="mirror-management-area">
      <div class="area-header">
        <h3>镜像管理</h3>
        <div class="header-actions">
          <el-select v-model="selectedDeviceId" placeholder="请选择设备" @change="loadMirrors" style="width: 200px; margin-right: 12px;">
            <el-option
              v-for="device in devices"
              :key="device.id"
              :label="device.title"
              :value="device.id"
            />
          </el-select>
          <el-button type="primary" @click="showAddMirrorDialog" :disabled="!selectedDeviceId">添加镜像</el-button>
        </div>
      </div>

      <el-table :data="mirrors" border class="mirror-table" v-loading="mirrorLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="镜像名称" min-width="200" />
        <el-table-column prop="urlInter" label="内网地址" min-width="250" show-overflow-tooltip />
        <el-table-column prop="size" label="大小" width="120" />
        <el-table-column prop="time" label="更新时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditMirror(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteMirror(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑设备弹窗 -->
    <el-dialog :title="deviceDialogTitle" v-model="deviceDialogVisible" width="500px">
      <el-form :model="deviceForm" :rules="deviceRules" ref="deviceFormRef" label-width="100px">
        <el-form-item label="设备名称" prop="title">
          <el-input v-model="deviceForm.title" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属二级" prop="level" v-if="!isEditDevice">
          <el-select v-model="deviceForm.level" placeholder="请选择所属二级分类" style="width: 100%;">
            <el-option
              v-for="level2 in level2List"
              :key="level2.id"
              :label="level2.title"
              :value="level2.id"
            />
          </el-select>
          <div style="color: #999; font-size: 12px; margin-top: 5px;">
            如果没有二级分类，请先在数据库中添加
          </div>
        </el-form-item>
        <el-form-item label="所属二级" v-else>
          <el-input :value="getLevel2Title(deviceForm.level)" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDeviceForm" :loading="deviceSubmitting">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑镜像弹窗 -->
    <el-dialog :title="mirrorDialogTitle" v-model="mirrorDialogVisible" width="600px">
      <el-form :model="mirrorForm" :rules="mirrorRules" ref="mirrorFormRef" label-width="100px">
        <el-form-item label="镜像名称" prop="name">
          <el-input v-model="mirrorForm.name" placeholder="请输入镜像名称" />
        </el-form-item>
        <el-form-item label="上传目录">
          <el-input v-model="mirrorForm.uploadFolder" placeholder="如: mirrors/ 或 images/riscv/" />
          <div style="color: #999; font-size: 12px; margin-top: 5px;">
            指定文件上传到 MinIO 的哪个目录下，如 mirrors/ 或 images/riscv/（仅上传文件时必填）
          </div>
        </el-form-item>
        <el-form-item label="上传镜像">
          <el-upload
            class="upload-demo"
            :http-request="handleManualUpload"
            :before-upload="beforeUpload"
            :show-file-list="true"
            :limit="1"
            :file-list="fileList"
            :disabled="isUploading || !mirrorForm.uploadFolder"
          >
            <el-button
              type="primary"
              :loading="isUploading"
              :disabled="!mirrorForm.uploadFolder"
            >
              {{ isUploading ? '上传中...' : '选择文件' }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip" style="margin-top: 8px; color: #999; font-size: 12px;">
                <span v-if="!mirrorForm.uploadFolder" style="color: #E6A23C;">
                  请先填写上传目录才能选择文件
                </span>
                <span v-else>
                  支持镜像文件上传，上传成功后会自动填充内网地址
                </span>
              </div>
              <div v-if="isUploading" style="margin-top: 8px;">
                <el-progress
                  :percentage="uploadProgress"
                  :stroke-width="8"
                  :indeterminate="uploadPhase === 'processing'"
                />
                <div style="color: #409EFF; font-size: 12px; margin-top: 4px;">
                  <span v-if="uploadPhase === 'uploading'">
                    正在上传到服务器...（{{ uploadProgress }}%）
                  </span>
                  <span v-else-if="uploadPhase === 'processing'">
                    正在上传到 MinIO 存储服务器，请耐心等待...
                  </span>
                </div>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="内网地址" prop="urlInter">
          <el-input v-model="mirrorForm.urlInter" placeholder="请输入或上传文件自动填充" />
        </el-form-item>
        <el-form-item label="大小">
          <el-input v-model="mirrorForm.size" placeholder="如: 1.2GB（可选）" />
        </el-form-item>
        <el-form-item label="架构">
          <el-input :value="currentArchName" disabled />
        </el-form-item>
        <el-form-item label="设备">
          <el-input :value="currentDeviceName" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="mirrorDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMirrorForm" :loading="mirrorSubmitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  ElMessage, ElMessageBox, ElTable, ElTableColumn, ElButton, ElDialog,
  ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadioButton, ElUpload, ElProgress
} from 'element-plus'
import { fetchMenuList, fetchMirrorList } from '@/api/mirror.js'
import {
  getDevicesByArch,
  addDevice,
  updateDevice,
  deleteDevice,
  addMirror,
  updateMirror,
  deleteMirror,
  uploadMirrorFile
} from '@/api/admin.js'

const fileList = ref([])
const uploadProgress = ref(0)
const isUploading = ref(false)
const uploadPhase = ref('') // 'uploading' | 'processing'

// 所有菜单数据
const allMenus = ref([])

// 架构列表（一级菜单，level=0）
const archList = ref([])
const selectedArchId = ref(null)

// 二级菜单列表（用于添加设备时选择父级）
const level2List = ref([])

// 设备相关
const devices = ref([])
const deviceDialogVisible = ref(false)
const deviceDialogTitle = ref('添加设备')
const isEditDevice = ref(false)
const deviceSubmitting = ref(false)
const deviceFormRef = ref(null)
const deviceForm = reactive({
  id: null,
  level: null,
  title: ''
})

const deviceRules = {
  title: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择所属二级分类', trigger: 'change' }]
}

// 镜像相关
const selectedDeviceId = ref(null)
const mirrors = ref([])
const mirrorLoading = ref(false)
const mirrorDialogVisible = ref(false)
const mirrorDialogTitle = ref('添加镜像')
const isEditMirror = ref(false)
const mirrorSubmitting = ref(false)
const mirrorFormRef = ref(null)
const mirrorForm = reactive({
  id: null,
  name: '',
  urlInter: '',
  urlOut: '',
  size: '',
  time: '',
  arch: '',
  manufacturer: '',
  series: '',
  uploadFolder: ''
})

const mirrorRules = {
  name: [{ required: true, message: '请输入镜像名称', trigger: 'blur' }],
  urlInter: [{ required: true, message: '请输入内网地址', trigger: 'blur' }]
}

const currentArchName = computed(() => {
  const arch = archList.value.find(a => a.id === selectedArchId.value)
  return arch ? arch.title : ''
})

const currentDeviceName = computed(() => {
  const device = devices.value.find(d => d.id === selectedDeviceId.value)
  return device ? device.title : ''
})

onMounted(async () => {
  await loadMenuList()
})

// 加载菜单列表
async function loadMenuList() {
  try {
    const menuList = await fetchMenuList()
    allMenus.value = menuList

    // 筛选出一级菜单（架构）
    archList.value = menuList.filter(menu => menu.level === 0)

    if (archList.value.length > 0) {
      selectedArchId.value = archList.value[0].id
      await handleArchChange()
    }
  } catch (error) {
    ElMessage.error('加载架构列表失败：' + error.message)
  }
}

// 架构切换
async function handleArchChange() {
  selectedDeviceId.value = null
  mirrors.value = []

  // 加载该架构下的二级菜单
  level2List.value = allMenus.value.filter(menu => menu.level === selectedArchId.value)

  await loadDevices()
}

// 加载设备列表
async function loadDevices() {
  try {
    const data = await getDevicesByArch(currentArchName.value)
    devices.value = data || []
  } catch (error) {
    ElMessage.error('加载设备列表失败：' + error.message)
  }
}

// 获取二级菜单标题
function getLevel2Title(level2Id) {
  const level2 = allMenus.value.find(m => m.id === level2Id)
  return level2 ? level2.title : ''
}

// 显示添加设备对话框
function showAddDeviceDialog() {
  isEditDevice.value = false
  deviceDialogTitle.value = '添加设备'
  deviceForm.id = null
  deviceForm.level = null
  deviceForm.title = ''
  deviceDialogVisible.value = true
}

// 编辑设备
function handleEditDevice(row) {
  isEditDevice.value = true
  deviceDialogTitle.value = '编辑设备'
  deviceForm.id = row.id
  deviceForm.level = row.level
  deviceForm.title = row.title
  deviceDialogVisible.value = true
}

// 提交设备表单
async function submitDeviceForm() {
  if (!deviceFormRef.value) return

  await deviceFormRef.value.validate(async (valid) => {
    if (!valid) return

    deviceSubmitting.value = true
    try {
      if (isEditDevice.value) {
        await updateDevice(deviceForm)
        ElMessage.success('更新成功')
      } else {
        await addDevice(deviceForm)
        ElMessage.success('添加成功')
      }
      deviceDialogVisible.value = false
      await loadDevices()
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '操作失败')
    } finally {
      deviceSubmitting.value = false
    }
  })
}

// 删除设备
async function handleDeleteDevice(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除设备"${row.title}"吗？如果设备下有镜像则无法删除。`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteDevice(row.id, currentArchName.value)
    ElMessage.success('删除成功')
    await loadDevices()

    if (selectedDeviceId.value === row.id) {
      selectedDeviceId.value = null
      mirrors.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// 加载镜像列表
async function loadMirrors() {
  if (!selectedDeviceId.value) {
    mirrors.value = []
    return
  }

  mirrorLoading.value = true
  try {
    const device = devices.value.find(d => d.id === selectedDeviceId.value)
    const params = {
      arch: currentArchName.value,
      manufacturer: '',
      series: device ? device.title : ''
    }
    const data = await fetchMirrorList(params)
    mirrors.value = data || []
  } catch (error) {
    ElMessage.error('加载镜像列表失败：' + error.message)
  } finally {
    mirrorLoading.value = false
  }
}

// 显示添加镜像对话框
function showAddMirrorDialog() {
  if (!selectedDeviceId.value) {
    ElMessage.warning('请先选择设备')
    return
  }

  isEditMirror.value = false
  mirrorDialogTitle.value = '添加镜像'
  fileList.value = []  // 清空文件列表
  uploadProgress.value = 0  // 重置上传进度
  isUploading.value = false  // 重置上传状态
  uploadPhase.value = ''  // 重置上传阶段
  Object.assign(mirrorForm, {
    id: null,
    name: '',
    urlInter: '',
    urlOut: '',
    size: '',
    time: '',
    arch: currentArchName.value,
    manufacturer: '',
    series: currentDeviceName.value,
    uploadFolder: ''  // 默认为空，用户可以选择填写或不填写
  })
  mirrorDialogVisible.value = true
}

// 编辑镜像
function handleEditMirror(row) {
  isEditMirror.value = true
  mirrorDialogTitle.value = '编辑镜像'
  fileList.value = []  // 清空文件列表
  uploadProgress.value = 0  // 重置上传进度
  isUploading.value = false  // 重置上传状态
  uploadPhase.value = ''  // 重置上传阶段
  Object.assign(mirrorForm, {
    id: row.id,
    name: row.name,
    urlInter: row.urlInter,
    urlOut: row.urlOut || '',
    size: row.size || '',
    time: row.time || '',
    arch: currentArchName.value,
    manufacturer: '',
    series: currentDeviceName.value,
    uploadFolder: ''  // 编辑时默认为空
  })
  mirrorDialogVisible.value = true
}

// 上传前验证
function beforeUpload(file) {
  const maxSize = 10 * 1024 * 1024 * 1024 // 10GB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 10GB')
    return false
  }
  return true
}

// 手动上传处理
async function handleManualUpload(options) {
  const { file } = options

  if (!mirrorForm.uploadFolder) {
    ElMessage.error('请先输入上传目录')
    return
  }

  // 重置进度并开始上传
  uploadProgress.value = 0
  isUploading.value = true
  uploadPhase.value = 'uploading' // 第一阶段：上传到服务器

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', mirrorForm.uploadFolder)

  try {
    const response = await uploadMirrorFile(formData, (progressEvent) => {
      // 计算上传进度（上传到后端服务器）
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value = percent

        // 当上传到服务器完成后，切换到处理阶段
        if (percent >= 100) {
          uploadPhase.value = 'processing' // 第二阶段：后端上传到 MinIO
        }
      }
    })
    // 调用成功回调
    handleUploadSuccess(response, file)
  } catch (error) {
    // 调用失败回调
    handleUploadError(error, file)
  } finally {
    // 上传结束，重置状态
    isUploading.value = false
    uploadProgress.value = 0
    uploadPhase.value = ''
  }
}

// 上传成功回调
function handleUploadSuccess(response, file) {
  if (response && response.url) {
    mirrorForm.urlInter = response.url
    ElMessage.success('文件上传成功，已自动填充内网地址')

    // 自动计算文件大小
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
    const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2)
    if (sizeInGB >= 1) {
      mirrorForm.size = sizeInGB + 'GB'
    } else {
      mirrorForm.size = sizeInMB + 'MB'
    }
  } else {
    ElMessage.error('上传失败：' + (response?.message || '未知错误'))
  }
}

// 上传失败回调
function handleUploadError(error, file) {
  ElMessage.error('上传失败：' + (error.message || error))
}

// 提交镜像表单
async function submitMirrorForm() {
  if (!mirrorFormRef.value) return

  await mirrorFormRef.value.validate(async (valid) => {
    if (!valid) return

    mirrorSubmitting.value = true
    try {
      if (isEditMirror.value) {
        await updateMirror(mirrorForm)
        ElMessage.success('更新成功')
      } else {
        await addMirror(mirrorForm)
        ElMessage.success('添加成功')
      }
      mirrorDialogVisible.value = false
      await loadMirrors()
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '操作失败')
    } finally {
      mirrorSubmitting.value = false
    }
  })
}

// 删除镜像
async function handleDeleteMirror(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除镜像"${row.name}"吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteMirror(row.id)
    ElMessage.success('删除成功')
    await loadMirrors()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}
</script>

<style scoped>
.mirror-management-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.arch-select-area {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.arch-form {
  margin: 0;
}

.device-management-area,
.mirror-management-area {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.area-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
}

.device-table,
.mirror-table {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
