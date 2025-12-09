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
            v-model="formData.taskProtocolId"
            placeholder="请选择或输入协议"
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

// 任务分类相关
const taskClassOptions = ref([])
const isAddingClass = ref(false)
const classOptionName = ref('')
const classOptionDescribe = ref('')

const protocolOptions = ref([])
const isAddingProtocol = ref(false)
const protocolOptionName = ref('')
const protocolOptionLink = ref('')

const formData = reactive({
  taskName: '',
  taskClass: null,  // 存储任务分类ID（数字）
  taskProtocolId: null,  // 存储协议ID（数字）
  taskDescription: '',
  deadlineTime: '',
  giteeLink: ''
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

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    loadTaskClasses()
    loadProtocols()
  }
})

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

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

const onAddClassOption = () => {
  isAddingClass.value = true
}

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
    formData.taskClass = String(newClass.id)
    ElMessage.success('任务分类创建成功')
    clearClassInput()
  } catch (error) {
    console.error('创建任务分类失败:', error)
    ElMessage.error('创建任务分类失败：' + (error.message || '操作失败'))
  } finally {
    classLoading.value = false
  }
}

const clearClassInput = () => {
  classOptionName.value = ''
  isAddingClass.value = false
}

const onAddProtocolOption = () => {
  isAddingProtocol.value = true
}

const onConfirmProtocol = async () => {
  if (!protocolOptionName.value.trim()) {
    ElMessage.warning('请输入协议名称')
    return
  }

  try {
    protocolLoading.value = true
    const newProtocol = await createProtocol({
      title: protocolOptionName.value.trim(),
      link: protocolOptionLink.value.trim() })
    protocolOptions.value.push(newProtocol)
    formData.taskProtocolId = String(newProtocol.id)
    ElMessage.success('协议创建成功')
    clearProtocolInput()
  } catch (error) {
    console.error('创建协议失败:', error)
    ElMessage.error('创建协议失败：' + (error.message || '操作失败'))
  } finally {
    protocolLoading.value = false
  }
}

const clearProtocolInput = () => {
  protocolOptionName.value = ''
  isAddingProtocol.value = false
}

const handleClassChange = (value) => {
  console.log('选中的分类ID:', value)
}

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

const resetForm = () => {
  formData.taskName = ''
  formData.taskClass = null
  formData.taskProtocolId = null
  formData.taskDescription = ''
  formData.deadlineTime = ''
  formData.giteeLink = ''
  clearClassInput()
  clearProtocolInput()
  formRef.value?.resetFields() // 重置表单验证状态
}

const handleCancel = () => {
  resetForm()
  dialogVisible.value = false
}

const handleConfirm = async () => {
  try {
    await formRef.value?.validate()

    submitLoading.value = true

    const submitData = {
      taskName: formData.taskName,
      taskClass: formData.taskClass,
      taskProtocolId: formData.taskProtocolId,
      taskDescription: formData.taskDescription,
      deadlineTime: formData.deadlineTime,
      giteeLink: formData.giteeLink
    }

    console.log('最终提交给后端的数据:', submitData)
    await createTask(submitData)

    ElMessage.success('任务创建成功')
    resetForm()
    dialogVisible.value = false
    emit('success') // 通知父组件刷新列表
  } catch (error) {
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

:deep(.option-input) {
  width: 100%;
  margin-bottom: 8px;
}

:deep(.el-select-dropdown__footer) {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>