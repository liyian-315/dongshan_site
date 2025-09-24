<!--<template>-->
<!--  <div class="person-info-container">-->
<!--    <el-card>-->
<!--      <div class="header">-->
<!--        <h2>个人信息</h2>-->
<!--      </div>-->

<!--      <el-skeleton :loading="loading" row-count="8" :title="false" v-if="loading"></el-skeleton>-->

<!--      <el-form-->
<!--          ref="formRef"-->
<!--          :model="userInfo"-->
<!--          :rules="formRules"-->
<!--          label-width="120px"-->
<!--          class="info-form"-->
<!--          v-else-->
<!--      >-->
<!--        &lt;!&ndash; 不可修改字段（禁用） &ndash;&gt;-->
<!--        <el-form-item label="用户名">-->
<!--          <el-input v-model="userInfo.username" disabled></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="姓名">-->
<!--          <el-input v-model="userInfo.fullname" disabled></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="主邮箱">-->
<!--          <el-input v-model="userInfo.email" disabled></el-input>-->
<!--        </el-form-item>-->

<!--        &lt;!&ndash; 可修改字段（带校验） &ndash;&gt;-->
<!--        <el-form-item label="备用邮箱" prop="email2">-->
<!--          <el-input v-model="userInfo.email2" placeholder="请输入备用邮箱（选填）"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="电话" prop="phone">-->
<!--          <el-input v-model="userInfo.phone" placeholder="请输入手机号"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="单位" prop="company">-->
<!--          <el-input v-model="userInfo.company" placeholder="请输入单位名称（选填）"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="地址" prop="address">-->
<!--          <el-input v-model="userInfo.address" placeholder="请输入详细地址（选填）"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="银行卡号" prop="bankCardNumber">-->
<!--          <el-input v-model="userInfo.bankCardNumber" placeholder="请输入银行卡号（选填）"></el-input>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash; PDF协议签署状态 &ndash;&gt;-->
<!--        <el-form-item label="协议签署">-->
<!--          <div class="agreement-status">-->
<!--            &lt;!&ndash; 已签署状态 &ndash;&gt;-->
<!--            <template v-if="userInfo.hasSignedPdf">-->
<!--              <el-tag type="success">已签署{{ pdfCW.title || 'PDF协议' }}</el-tag>-->
<!--            </template>-->
<!--            &lt;!&ndash; 未签署状态（区分链接加载中/加载完成） &ndash;&gt;-->
<!--            <template v-else>-->
<!--              <span class="warning-text">请签署{{ pdfCW.title || 'PDF协议' }}：</span>-->
<!--              &lt;!&ndash; 链接加载完成 &ndash;&gt;-->
<!--              <el-link-->
<!--                  v-if="pdfCW.link"-->
<!--                  type="primary"-->
<!--                  :href="pdfCW.link"-->
<!--                  target="_blank"-->
<!--                  :title="pdfCW.copyWritingText"-->
<!--              class="pdf-download-link"-->
<!--              >-->
<!--              {{ pdfCW.copyWritingText || '下载协议' }}-->
<!--              </el-link>-->
<!--              &lt;!&ndash; 链接加载中 &ndash;&gt;-->
<!--              <span v-else class="loading-text">正在获取协议链接...</span>-->
<!--            </template>-->
<!--            &lt;!&ndash; 协议备注信息（若有） &ndash;&gt;-->
<!--            <el-tooltip-->
<!--                v-if="pdfCW.note"-->
<!--                placement="top"-->
<!--                effect="dark"-->
<!--                :content="pdfCW.note"-->
<!--                class="agreement-note"-->
<!--            >-->
<!--              <i class="el-icon-info"></i>-->
<!--            </el-tooltip>-->
<!--          </div>-->
<!--        </el-form-item>-->

<!--        &lt;!&ndash; 提交修改按钮 &ndash;&gt;-->
<!--        <el-form-item class="submit-btn-group">-->
<!--          <el-button-->
<!--              type="primary"-->
<!--              @click="handleSubmit"-->
<!--              :loading="submitLoading"-->
<!--          >-->
<!--          提交修改-->
<!--          </el-button>-->
<!--          <el-button-->
<!--              type="text"-->
<!--              @click="handleReset"-->
<!--              style="margin-left: 10px"-->
<!--          >-->
<!--            重置-->
<!--          </el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-card>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import {ref, onMounted, reactive} from 'vue'-->
<!--import {useRouter} from 'vue-router'-->
<!--import {-->
<!--  ElCard, ElForm, ElFormItem, ElInput, ElSkeleton, ElMessage, ElButton,-->
<!--  ElTag, ElLink, ElTooltip, ElIcon-->
<!--} from 'element-plus'-->
<!--import {personInfo, updatePersonInfo, getPdfCopyWriting} from '@/api/user.js'-->

<!--const router = useRouter()-->
<!--const loading = ref(true)-->
<!--const submitLoading = ref(false)-->
<!--const formRef = ref(null)-->

<!--const originalUserInfo = ref({})-->
<!--const userInfo = ref({-->
<!--  username: '',-->
<!--  fullname: '',-->
<!--  email: '',-->
<!--  email2: '',-->
<!--  phone: '',-->
<!--  company: '',-->
<!--  address: '',-->
<!--  bankCardNumber: '',-->
<!--  hasSignedPdf: false,      // 是否已签署PDF协议-->
<!--})-->

<!--const pdfCW = ref({-->
<!--  area:'person-info-pdf-download',-->
<!--  title:'',-->
<!--  copyWritingText:'',-->
<!--  link:'',-->
<!--  note:''-->
<!--})-->
<!--const formRules = reactive({-->
<!--  // 备用邮箱：可选，但填了必须符合邮箱格式-->
<!--  email2: [-->
<!--    {-->
<!--      type: 'email',-->
<!--      message: '请输入有效的备用邮箱格式',-->
<!--      trigger: ['blur', 'change'],-->
<!--      required: false  // 非必填-->
<!--    }-->
<!--  ],-->
<!--  // 电话：必填，11位手机号-->
<!--  phone: [-->
<!--    {-->
<!--      required: true,-->
<!--      message: '请输入手机号',-->
<!--      trigger: ['blur', 'change']-->
<!--    },-->
<!--    {-->
<!--      pattern: /^1[3-9]\d{9}$/,  // 手机号正则（13-19开头，共11位）-->
<!--      message: '请输入有效的11位手机号',-->
<!--      trigger: ['blur', 'change']-->
<!--    }-->
<!--  ],-->
<!--  // 单位：可选，最大50字符-->
<!--  company: [-->
<!--    {-->
<!--      max: 50,-->
<!--      message: '单位名称不能超过50个字符',-->
<!--      trigger: ['blur', 'change'],-->
<!--      required: false-->
<!--    }-->
<!--  ],-->
<!--  // 地址：可选，最大100字符-->
<!--  address: [-->
<!--    {-->
<!--      max: 100,-->
<!--      message: '地址不能超过100个字符',-->
<!--      trigger: ['blur', 'change'],-->
<!--      required: false-->
<!--    }-->
<!--  ],-->
<!--  // 银行卡号：可选，需符合银行卡格式（13-19位数字）-->
<!--  bankCardNumber: [-->
<!--    {-->
<!--      pattern: /^\d{13,19}$/,  // 银行卡正则（13-19位数字）-->
<!--      message: '请输入有效的银行卡号（13-19位数字）',-->
<!--      trigger: ['blur', 'change'],-->
<!--      required: false-->
<!--    }-->
<!--  ]-->
<!--})-->

<!--onMounted(async () => {-->
<!--  const token = localStorage.getItem('token')-->
<!--  const username = localStorage.getItem('username')-->
<!--  if (!token && !username) {-->
<!--    ElMessage.warning('请先登录')-->
<!--    await router.push({-->
<!--      path: '/login',-->
<!--      query: {redirect: '/personInfo'}-->
<!--    })-->
<!--    return-->
<!--  }-->
<!--  const params = {username: username}-->
<!--  try {-->
<!--    const userInfoPromise = personInfo(params)-->
<!--    const pdfCWPromise = getPdfCopyWriting({area: pdfCW.value.area})-->
<!--    const [userResponse, pdfCWResponse] = await Promise.all([-->
<!--      userInfoPromise,-->
<!--      pdfCWPromise-->
<!--    ])-->
<!--    console.info(pdfCWResponse)-->
<!--    // 处理个人信息数据-->
<!--    if (userResponse) {-->
<!--      const userData = userResponse.data || userResponse-->
<!--      userInfo.value = {...userInfo.value, ...userData}-->
<!--      originalUserInfo.value = {...userInfo.value} // 保存原始数据用于重置-->
<!--    } else {-->
<!--      ElMessage.error('获取个人信息失败：接口返回空数据')-->
<!--    }-->
<!--    // 处理PDF文案数据-->
<!--    if (pdfCWResponse) {-->
<!--      pdfCW.value = {...pdfCW.value, ...pdfCWResponse}-->
<!--    } else {-->
<!--      ElMessage.warning('获取协议配置失败，将使用默认文案')-->
<!--      pdfCW.value.title = 'PDF协议'-->
<!--      pdfCW.value.copyWritingText = '下载协议'-->
<!--    }-->
<!--  } catch (error) {-->
<!--    let errorMsg = ''-->
<!--    if (error.config.url.includes('getPdfCopyWriting')) {-->
<!--      errorMsg = '获取协议配置失败：'-->
<!--    } else {-->
<!--      errorMsg = '获取个人信息失败：'-->
<!--    }-->
<!--    if (error.response) {-->
<!--      errorMsg += error.response.data?.message || `状态码: ${error.response.status}`-->
<!--      // 401登录过期处理-->
<!--      if (error.response.status === 401) {-->
<!--        localStorage.removeItem('token')-->
<!--        localStorage.removeItem('username')-->
<!--        ElMessage.warning('登录已过期，请重新登录')-->
<!--        await router.push('/login')-->
<!--      } else if (error.response.status === 404 && error.config.url.includes('personInfo')) {-->
<!--        localStorage.removeItem('username')-->
<!--      }-->
<!--    } else {-->
<!--      errorMsg += error.message || '未知网络错误'-->
<!--    }-->
<!--    ElMessage.error(errorMsg)-->
<!--    console.error(errorMsg, error)-->
<!--  } finally {-->
<!--    loading.value = false-->
<!--  }-->
<!--})-->
<!--// 提交修改-->
<!--const handleSubmit = async () => {-->
<!--  const isValid = await formRef.value.validate().catch(() => false)-->
<!--  if (!isValid) return-->
<!--  submitLoading.value = true-->
<!--  try {-->
<!--    const updateParams = {-->
<!--      username: userInfo.value.username,-->
<!--      email2: userInfo.value.email2,-->
<!--      phone: userInfo.value.phone,-->
<!--      company: userInfo.value.company,-->
<!--      address: userInfo.value.address,-->
<!--      bankCardNumber: userInfo.value.bankCardNumber-->
<!--    }-->
<!--    const response = await updatePersonInfo(updateParams)-->
<!--    if (response) {-->
<!--      ElMessage.success('个人信息修改成功！')-->
<!--      originalUserInfo.value = { ...userInfo.value }-->
<!--    } else {-->
<!--      ElMessage.error(response?.message || '修改失败，请重试')-->
<!--    }-->
<!--  } catch (error) {-->
<!--    const errorMsg = error.response?.data?.message || error.message || '修改异常'-->
<!--    ElMessage.error(`修改个人信息失败: ${errorMsg}`)-->
<!--  } finally {-->
<!--    submitLoading.value = false-->
<!--  }-->
<!--}-->
<!--const handleReset = () => {-->
<!--  userInfo.value = { ...originalUserInfo.value }-->
<!--  formRef.value.clearValidate()-->
<!--  ElMessage.info('已重置为原始信息')-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.person-info-container {-->
<!--  padding: 20px 5%;-->
<!--  background-color: #f5f7fa;-->
<!--  min-height: calc(100vh - 60px - 180px);-->
<!--}-->

<!--.header {-->
<!--  margin-bottom: 20px;-->
<!--  border-bottom: 1px solid #e4e7ed;-->
<!--  padding-bottom: 10px;-->
<!--}-->

<!--h2 {-->
<!--  color: #1f2329;-->
<!--  font-size: 20px;-->
<!--}-->

<!--.info-form {-->
<!--  padding: 10px 0;-->
<!--}-->

<!--.submit-btn-group {-->
<!--  margin-top: 20px;-->
<!--  display: flex;-->
<!--  justify-content: flex-end;-->
<!--  padding-right: 40px;-->
<!--}-->

<!--.submit-btn-group .el-button + .el-button {-->
<!--  margin-left: 10px;-->
<!--}-->
<!--</style>-->


<template>
  <!-- 个人信息：统一登录/注册风格（浅色渐变背景 + 玻璃卡 + 科技蓝） -->
  <div class="info-bg">
    <div class="info-panel glass">
      <div class="panel-header">
        <div>
          <h2 class="title">个人信息</h2>
          <p class="desc">完善个人资料以便于账户安全与服务对接。</p>
        </div>
      </div>

      <el-divider></el-divider>

      <el-skeleton :loading="loading" :rows="6" animated v-if="loading"></el-skeleton>

      <el-form
          v-else
          ref="formRef"
          :model="userInfo"
          :rules="formRules"
          label-width="120px"
          class="info-form"
          :size="'large'"
      >
        <!-- 基本信息 -->
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="userInfo.username" placeholder="请输入用户名" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model.trim="userInfo.nickname" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12">
            <el-form-item label="主邮箱" prop="email">
              <el-input v-model.trim="userInfo.email" placeholder="请输入主邮箱" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="备用邮箱" prop="backupEmail">
              <el-input v-model.trim="userInfo.backupEmail" placeholder="请输入备用邮箱" clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model.trim="userInfo.phone" placeholder="请输入电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="单位" prop="company">
              <el-input v-model.trim="userInfo.company" placeholder="学校/单位/组织" clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model.trim="userInfo.address" placeholder="请输入详细地址" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 协议签署区-->
        <el-form-item label="身份状态">
          <template v-if="pdfCW.signed">
            <el-tag type="success">已签署{{ pdfCW.title || 'PDF 协议' }}</el-tag>
          </template>
          <template v-else>
            <span class="warning-text">请签署{{ pdfCW.title || 'PDF 协议' }}：</span>
            <el-link
                v-if="pdfCW.link"
                type="primary"
                :href="pdfCW.link"
                target="_blank"
                :title="pdfCW.copyWritingText"
                class="pdf-download-link"
            >{{ pdfCW.copyWritingText || '点击查看并签署' }}</el-link>
            <el-text v-else type="info">链接生成中...</el-text>
          </template>
        </el-form-item>

        <!-- 底部操作按钮 -->
        <div class="submit-btn-group">
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" class="btn-grad" :loading="submitLoading" @click="onSubmit">保存修改</el-button>
        </div>
      </el-form>
    </div>

    <!-- 装饰弧形，与站点风格一致 -->
    <div class="arc arc-blue"></div>
    <div class="arc arc-green"></div>
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
/* 背景：与登录/注册保持一致 */
.info-bg{
  position: relative;
  min-height: calc(100vh - 64px - 76px);
  padding: 32px 20px;
  background:
      radial-gradient(1200px 600px at 10% -10%, rgba(0, 209, 255, 0.10), transparent 60%),
      radial-gradient(1000px 500px at 110% 110%, rgba(99, 102, 241, 0.10), transparent 60%),
      linear-gradient(180deg, #f7fafc, #eef2f7);
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* 主卡片采用玻璃拟态 */
.glass{
  width: min(980px, 96vw);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255,255,255,.66);
  border: 1px solid rgba(15,23,42,.06);
  box-shadow: 0 14px 34px rgba(15,23,42,.08);
  padding: 18px 20px 22px;
}

/* 标题区 */
.panel-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.title{ margin: 2px 0 2px; color:#1f2937; }
.desc{ margin:0; color:#6b778c; }
.save-top{ background-image: linear-gradient(90deg, #1e90ff, #00d1ff); border:none; }

/* 表单样式与霓虹微光交互 */
.info-form :deep(.el-input__wrapper.is-focus),
.info-form :deep(.el-input__wrapper.is-hovering){
  border-color: var(--el-color-primary);
  animation: neonPulse 1.4s ease-in-out infinite alternate;
}
@keyframes neonPulse{
  0%{ box-shadow: 0 0 0 2px rgba(0,209,255,0.16), 0 0 10px rgba(0,209,255,0.22); }
  100%{ box-shadow: 0 0 0 3px rgba(0,209,255,0.28), 0 0 22px rgba(0,209,255,0.38); }
}

.btn-grad{
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
  border: none; color: #fff;
  transition: transform .12s ease, box-shadow .2s ease;
}
.btn-grad:is(:hover,:focus-visible){
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0,140,255,.28), 0 0 18px rgba(0,209,255,.25);
}

.warning-text{ color:#f59e0b; margin-right:8px; }

/* 底部按钮组 */
.submit-btn-group{
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-right: 4px;
}

/* 装饰弧形 */
.arc{ position:absolute; z-index:1; border-radius:999px; filter: blur(.2px); }
.arc-blue{ right:-120px; top:-40px; width:360px; height:180px;
  background: radial-gradient(120% 120% at 50% 50%, #1e90ff 0%, #1e90ff 60%, transparent 61%); transform: rotate(-12deg);
}
.arc-green{ left:-80px; bottom:-60px; width:220px; height:220px;
  background: radial-gradient(120% 120% at 50% 50%, #48c774 0%, #48c774 60%, transparent 61%); transform: rotate(24deg);
}

@media (max-width: 768px){
  .glass{ padding: 14px 14px 18px; }
}
</style>
