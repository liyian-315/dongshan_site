<template>
  <div class="person-info-container">
    <el-card>
      <div class="header">
        <h2>个人信息</h2>
      </div>

      <el-skeleton :loading="loading" row-count="8" :title="false" v-if="loading"></el-skeleton>

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
        <!-- PDF协议签署状态 -->
        <el-form-item label="协议签署">
          <div class="agreement-status">
            <!-- 已签署状态 -->
            <template v-if="userInfo.hasSignedPdf">
              <el-tag type="success">已签署{{ pdfCW.title || 'PDF协议' }}</el-tag>
            </template>
            <!-- 未签署状态（区分链接加载中/加载完成） -->
            <template v-else>
              <span class="warning-text">请签署{{ pdfCW.title || 'PDF协议' }}：</span>
              <!-- 链接加载完成 -->
              <el-link
                  v-if="pdfCW.link"
                  type="primary"
                  :href="pdfCW.link"
                  target="_blank"
                  :title="pdfCW.copyWritingText"
              class="pdf-download-link"
              >
              {{ pdfCW.copyWritingText || '下载协议' }}
              </el-link>
              <!-- 链接加载中 -->
              <span v-else class="loading-text">正在获取协议链接...</span>
            </template>
            <!-- 协议备注信息（若有） -->
            <el-tooltip
                v-if="pdfCW.note"
                placement="top"
                effect="dark"
                :content="pdfCW.note"
                class="agreement-note"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </div>
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
import {
  ElCard, ElForm, ElFormItem, ElInput, ElSkeleton, ElMessage, ElButton,
  ElTag, ElLink, ElTooltip, ElIcon
} from 'element-plus'
import {personInfo, updatePersonInfo, getPdfCopyWriting} from '@/api/user.js'

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
  bankCardNumber: '',
  hasSignedPdf: false,      // 是否已签署PDF协议
})

const pdfCW = ref({
  area:'person-info-pdf-download',
  title:'',
  copyWritingText:'',
  link:'',
  note:''
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
    const userInfoPromise = personInfo(params)
    const pdfCWPromise = getPdfCopyWriting({area: pdfCW.value.area})
    const [userResponse, pdfCWResponse] = await Promise.all([
      userInfoPromise,
      pdfCWPromise
    ])
    console.info(pdfCWResponse)
    // 处理个人信息数据
    if (userResponse) {
      const userData = userResponse.data || userResponse
      userInfo.value = {...userInfo.value, ...userData}
      originalUserInfo.value = {...userInfo.value} // 保存原始数据用于重置
    } else {
      ElMessage.error('获取个人信息失败：接口返回空数据')
    }
    // 处理PDF文案数据
    if (pdfCWResponse) {
      pdfCW.value = {...pdfCW.value, ...pdfCWResponse}
    } else {
      ElMessage.warning('获取协议配置失败，将使用默认文案')
      pdfCW.value.title = 'PDF协议'
      pdfCW.value.copyWritingText = '下载协议'
    }
  } catch (error) {
    let errorMsg = ''
    if (error.config.url.includes('getPdfCopyWriting')) {
      errorMsg = '获取协议配置失败：'
    } else {
      errorMsg = '获取个人信息失败：'
    }
    if (error.response) {
      errorMsg += error.response.data?.message || `状态码: ${error.response.status}`
      // 401登录过期处理
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        ElMessage.warning('登录已过期，请重新登录')
        await router.push('/login')
      } else if (error.response.status === 404 && error.config.url.includes('personInfo')) {
        localStorage.removeItem('username')
      }
    } else {
      errorMsg += error.message || '未知网络错误'
    }
    ElMessage.error(errorMsg)
    console.error(errorMsg, error)
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
