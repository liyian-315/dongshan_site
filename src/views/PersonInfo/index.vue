<template>
  <div class="person-info-container">
    <el-card>
      <div class="header">
        <h2>个人信息</h2>
      </div>

      <el-skeleton :loading="loading" row-count="6" :title="false" v-if="loading"></el-skeleton>

      <el-form
          ref="formRef"
          :model="userInfo"
          :rules="formRules"
          label-width="120px"
          class="info-form"
          v-else
      >
        <!-- 不可修改字段（禁用） -->
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userInfo.fullname" disabled></el-input>
        </el-form-item>
        <el-form-item label="主邮箱">
          <el-input v-model="userInfo.email" disabled></el-input>
        </el-form-item>

        <!-- 可修改字段（带校验） -->
        <el-form-item label="备用邮箱" prop="email2">
          <el-input v-model="userInfo.email2" placeholder="请输入备用邮箱（选填）"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="company">
          <el-input v-model="userInfo.company" placeholder="请输入单位名称（选填）"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" placeholder="请输入详细地址（选填）"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCardNumber">
          <el-input v-model="userInfo.bankCardNumber" placeholder="请输入银行卡号（选填）"></el-input>
        </el-form-item>

        <!-- 提交修改按钮 -->
        <el-form-item class="submit-btn-group">
          <el-button
              type="primary"
              @click="handleSubmit"
              :loading="submitLoading"
          >
          提交修改
          </el-button>
          <el-button
              type="text"
              @click="handleReset"
              style="margin-left: 10px"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {ElCard, ElForm, ElFormItem, ElInput, ElSkeleton, ElMessage, ElButton} from 'element-plus'
import {personInfo, updatePersonInfo} from '@/api/user.js'

const router = useRouter()
const loading = ref(true)
const submitLoading = ref(false)
const formRef = ref(null)

const originalUserInfo = ref({})
const userInfo = ref({
  username: '',
  fullname: '',
  email: '',
  email2: '',
  phone: '',
  company: '',
  address: '',
  bankCardNumber: ''
})
const formRules = reactive({
  // 备用邮箱：可选，但填了必须符合邮箱格式
  email2: [
    {
      type: 'email',
      message: '请输入有效的备用邮箱格式',
      trigger: ['blur', 'change'],
      required: false  // 非必填
    }
  ],
  // 电话：必填，11位手机号
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: ['blur', 'change']
    },
    {
      pattern: /^1[3-9]\d{9}$/,  // 手机号正则（13-19开头，共11位）
      message: '请输入有效的11位手机号',
      trigger: ['blur', 'change']
    }
  ],
  // 单位：可选，最大50字符
  company: [
    {
      max: 50,
      message: '单位名称不能超过50个字符',
      trigger: ['blur', 'change'],
      required: false
    }
  ],
  // 地址：可选，最大100字符
  address: [
    {
      max: 100,
      message: '地址不能超过100个字符',
      trigger: ['blur', 'change'],
      required: false
    }
  ],
  // 银行卡号：可选，需符合银行卡格式（13-19位数字）
  bankCardNumber: [
    {
      pattern: /^\d{13,19}$/,  // 银行卡正则（13-19位数字）
      message: '请输入有效的银行卡号（13-19位数字）',
      trigger: ['blur', 'change'],
      required: false
    }
  ]
})

onMounted(async () => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  if (!token && !username) {
    ElMessage.warning('请先登录')
    await router.push({
      path: '/login',
      query: {redirect: '/personInfo'}
    })
    return
  }
  const params = {username: username}
  try {
    const response = await personInfo(params)
    if (response) {
      const userData = response.data || response
      userInfo.value = {...userInfo.value, ...userData}
      originalUserInfo.value = { ...userInfo.value }
    } else {
      ElMessage.error('获取个人信息失败：接口返回空数据')
    }
  } catch (error) {
    let errorMsg = '获取个人信息失败: '
    if (error.response) {
      errorMsg += error.response.data?.message || `状态码: ${error.response.status}`

      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        ElMessage.warning('登录已过期，请重新登录')
        await router.push('/login')
      } else if (error.response.status === 404) {
        localStorage.removeItem('username')
      }
    } else {
      errorMsg += error.message || '未知错误'
    }

    ElMessage.error(errorMsg)
    console.error('获取个人信息错误详情:', error)
  } finally {
    loading.value = false
  }
})

// 提交修改
const handleSubmit = async () => {
  const isValid = await formRef.value.validate().catch(() => false)
  if (!isValid) return
  submitLoading.value = true
  try {
    const updateParams = {
      username: userInfo.value.username,
      email2: userInfo.value.email2,
      phone: userInfo.value.phone,
      company: userInfo.value.company,
      address: userInfo.value.address,
      bankCardNumber: userInfo.value.bankCardNumber
    }
    const response = await updatePersonInfo(updateParams)
    if (response) {
      ElMessage.success('个人信息修改成功！')
      originalUserInfo.value = { ...userInfo.value }
    } else {
      ElMessage.error(response?.message || '修改失败，请重试')
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || '修改异常'
    ElMessage.error(`修改个人信息失败: ${errorMsg}`)
  } finally {
    submitLoading.value = false
  }
}
const handleReset = () => {
  userInfo.value = { ...originalUserInfo.value }
  formRef.value.clearValidate()
  ElMessage.info('已重置为原始信息')
}
</script>

<style scoped>
.person-info-container {
  padding: 20px 5%;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px - 180px);
}

.header {
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
}

h2 {
  color: #1f2329;
  font-size: 20px;
}

.info-form {
  padding: 10px 0;
}

.submit-btn-group {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
}

.submit-btn-group .el-button + .el-button {
  margin-left: 10px;
}
</style>
