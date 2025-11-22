<template>
  <el-dialog
      v-model="dialogVisible"
      title="新建任务"
      width="600px"
      :close-on-click-modal="false"
      @close="handleCancel"
  >
    <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input
            v-model="formData.taskName"
            placeholder="请输入任务名称"
            clearable
        />
      </el-form-item>

      <el-form-item label="任务分类" prop="taskClass">
        <el-select
            v-model="formData.taskClass"
            placeholder="请选择任务分类"
            clearable
            style="width: 300px"
            @change="handleClassChange"
            :loading="classLoading"
        >
          <el-option
              v-for="item in taskClassOptions"
              :key="item.id"
              :label="item.name"
              :value="String(item.id)"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="协议" prop="taskProtocolId">
        <el-select
            v-model="formData.taskProtocolId"
            placeholder="请选择或输入协议"
            allow-create
            clearable
            style="width: 100%"
            @change="handleProtocolChange"
            :loading="protocolLoading"
        >
          <el-option
              v-for="item in protocolOptions"
              :key="item.id"
              :label="item.title"
              :value="String(item.id)"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任务描述" prop="taskDescription">
        <el-input
            v-model="formData.taskDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入任务描述"
        />
      </el-form-item>

      <el-form-item label="截止时间" prop="deadlineTime">
        <el-date-picker
            v-model="formData.deadlineTime"
            type="datetime"
            placeholder="请选择截止时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="Gitee链接" prop="giteeLink">
        <el-input
            v-model="formData.giteeLink"
            placeholder="请输入Gitee链接"
            clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="submitLoading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { createTask, fetchTaskCategories, getProtocols, createTaskClass, createProtocol } from '@/api/task'

// 定义 props 和 emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'success'])

// 控制弹窗显示
const dialogVisible = ref(false)
const submitLoading = ref(false)
const classLoading = ref(false)
const protocolLoading = ref(false)
const formRef = ref(null)

// 任务分类选项（后端返回的原始数据）
const taskClassOptions = ref([])
// 协议选项
const protocolOptions = ref([])

// 表单数据
const formData = reactive({
  taskName: '',
  taskClass: null,  // 存储任务分类ID（数字）
  taskProtocolId: null,  // 存储协议ID（数字）
  taskDescription: '',
  deadlineTime: '',
  giteeLink: ''
})

// 监听表单数据变化（调试用）
watch(() => formData.taskClass, (newVal) => {
  console.log('任务分类ID变化为:', newVal)
})

watch(() => formData.taskProtocolId, (newVal) => {
  console.log('协议ID变化为:', newVal)
})

// 表单验证规则
const rules = {
  taskName: [
    { required: true, message: '请输入任务名称', trigger: 'blur' }
  ],
  taskClass: [
    { required: true, message: '请选择任务分类', trigger: 'change' }
  ],
  taskProtocolId: [
    { required: true, message: '请选择或输入协议', trigger: 'change' }
  ],
  deadlineTime: [
    { required: true, message: '请选择截止时间', trigger: 'change' }
  ]
}

// 监听父组件 visible 变化，同步弹窗状态并加载数据
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    loadTaskClasses()
    loadProtocols()
  }
})

// 监听弹窗状态变化，同步给父组件
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 加载任务分类列表（后端返回 Long 类型 ID）
const loadTaskClasses = async () => {
  try {
    classLoading.value = true
    const response = await fetchTaskCategories()
    console.log('加载的任务分类:', response) // 格式：[{id:1, name:'课程类'}, ...]
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
    console.log('加载的协议:', response)
    protocolOptions.value = response || []
  } catch (error) {
    console.error('加载协议列表失败:', error)
    ElMessage.error('加载协议列表失败')
  } finally {
    protocolLoading.value = false
  }
}

// 处理任务分类变化（可选，仅调试用）
const handleClassChange = (value) => {
  console.log('选中的分类ID:', value)
}

// 处理协议变化（保持原有逻辑）
const handleProtocolChange = async (value) => {
  console.log('协议选择值:', value)
  const existingProtocol = protocolOptions.value.find(item => String(item.id) === value)

  if (!existingProtocol && value) {
    try {
      protocolLoading.value = true
      const newProtocol = await createProtocol({ title: value })
      protocolOptions.value.push(newProtocol)
      formData.taskProtocolId = String(newProtocol.id)
      ElMessage.success('协议创建成功')
    } catch (error) {
      console.error('创建协议失败:', error)
      ElMessage.error('创建协议失败：' + (error.message || '操作失败'))
      formData.taskProtocolId = null
    } finally {
      protocolLoading.value = false
    }
  }
}

// 重置表单（恢复初始状态）
const resetForm = () => {
  formData.taskName = ''
  formData.taskClass = null
  formData.taskProtocolId = null
  formData.taskDescription = ''
  formData.deadlineTime = ''
  formData.giteeLink = ''
  formRef.value?.resetFields() // 重置表单验证状态
}

// 取消操作
const handleCancel = () => {
  resetForm()
  dialogVisible.value = false
}

// 确认提交
const handleConfirm = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()

    submitLoading.value = true

    // 准备提交数据
    const submitData = {
      taskName: formData.taskName,
      taskClass: formData.taskClass,  // 直接传递分类ID（数字）
      taskProtocolId: formData.taskProtocolId,  // 直接传递协议ID（字符串/数字）
      taskDescription: formData.taskDescription,
      deadlineTime: formData.deadlineTime,
      giteeLink: formData.giteeLink
    }

    console.log('最终提交给后端的数据:', submitData)

    // 调用创建任务API
    await createTask(submitData)

    ElMessage.success('任务创建成功')
    resetForm()
    dialogVisible.value = false
    emit('success') // 通知父组件刷新列表
  } catch (error) {
    // 表单验证失败时 error 为 false，不提示错误
    if (error !== false) {
      ElMessage.error('创建任务失败：' + (error.message || '操作失败'))
    }
  } finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}
</style>