<script setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElButton, ElCard, ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElRow, ElTooltip, ElDialog, ElCheckbox} from 'element-plus'
import {login, registerUser} from '@/api/user.js'
import {InfoFilled, Document} from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()

// 表单数据
const form = reactive({
  username: '',
  fullname: '',
  email: '',
  email2: '',
  phone: '',
  address: '',
  company: '',
  password: '',
  confirmPassword: ''
})

// 新增：用户协议相关状态
const agreeTerms = ref(false)
const termsDialogVisible = ref(false)

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  fullname: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入主邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  email2: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度必须在8-20个字符之间', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: '密码必须包含大小写字母、数字和特殊字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 表单引用
const formRef = ref(null)

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  // 检查是否同意用户协议
  if (!agreeTerms.value) {
    ElMessage.warning('请阅读并同意用户协议')
    return
  }

  try {
    await formRef.value.validate()

    const response = await registerUser(form)

    ElMessage.success('注册成功，请登录...')

    // 跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1000)

  } catch (error) {
    if (error.name === 'Error') {
      ElMessage.error('注册失败：' + error.message)
    } else {
      // 表单验证失败，不做额外处理
    }
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 重置同意状态
  agreeTerms.value = false
}

// 打开用户协议对话框
const openTermsDialog = () => {
  termsDialogVisible.value = true
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <el-card class="card-inner">
        <div class="header">
          <h2>用户注册</h2>
        </div>

        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            class="register-form"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="姓名" prop="fullname">
                <el-input v-model="form.fullname" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="主邮箱" prop="email">
                <el-input v-model="form.email" type="email" placeholder="请输入主要邮箱"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备用邮箱" prop="email2">
                <el-input v-model="form.email2" type="email" placeholder="请输入备用邮箱（选填）"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="单位" prop="company">
                <el-input v-model="form.company" placeholder="请输入所在单位"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="密码" prop="password">
                <el-input
                    v-model="form.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                    v-model="form.confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    show-password
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="password-hint">
              <el-tooltip content="密码必须包含大小写字母、数字和特殊字符，长度8-20位" placement="top">
                <div class="hint-content">
                  <InfoFilled class="info-icon" />
                  <span class="hint-text">密码强度要求：包含大小写字母、数字和特殊字符，长度8-20位</span>
                </div>
              </el-tooltip>
            </el-col>

            <!-- 新增：用户协议勾选 -->
            <el-col :span="24" class="terms-section">
              <el-checkbox v-model="agreeTerms" class="terms-checkbox">
                我已阅读并同意
                <span class="terms-link" @click.stop="openTermsDialog">《用户服务协议》</span>
                和
                <span class="terms-link" @click.stop="openTermsDialog">《隐私政策》</span>
              </el-checkbox>
            </el-col>

            <el-col :span="24" class="form-actions">
              <el-button
                  type="primary"
                  @click="submitForm"
                  :disabled="!agreeTerms"
              >
                注册
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>

  <!-- 新增：用户协议对话框 -->
  <el-dialog
      title="用户服务协议"
      v-model="termsDialogVisible"
      width="70%"
      :modal="true"
  >
    <div class="terms-content">
      <h3 style="text-align: center; margin-bottom: 20px;">用户服务协议</h3>
      <div class="terms-text">
        <p>欢迎注册并使用本平台服务。在注册前，请您仔细阅读以下条款：</p>
        <p>1. 服务条款的接受</p>
        <p>通过点击"注册"按钮，您表示您同意并接受本协议的全部条款和条件。如果您不同意本协议的任何内容，请不要注册或使用本平台服务。</p>
        <p>2. 用户注册</p>
        <p>您声明并保证所提供的注册信息真实、准确、完整，并将及时更新您的个人信息以保持其真实性和准确性。</p>
        <p>3. 用户账号</p>
        <p>您应对您的账号和密码安全负责，任何通过您的账号进行的操作都将被视为您本人的操作，您将承担由此产生的全部责任。</p>
        <p>4. 隐私保护</p>
        <p>我们将按照隐私政策保护您的个人信息，详情请参阅《隐私政策》。</p>
        <p>5. 服务变更与终止</p>
        <p>我们保留随时修改或终止服务的权利，如有重大变更，我们将通过适当方式通知用户。</p>
        <p>6. 法律适用</p>
        <p>本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
        <p>7. 其他</p>
        <p>本协议构成您与本平台之间的完整协议，取代先前所有关于本服务的理解和协议。如您对本协议有任何疑问，请联系我们的客服团队。</p>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px; /* 保留页面边距，避免移动端溢出 */
}


.register-card {
  width: 100%;
  max-width: 700px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 给card内部增加内边距，避免内容贴边 */
.card-inner {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  color: #1f2329;
  margin-bottom: 10px;
}

.register-form {
  padding: 0;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 15px;
}

.password-hint {
  padding-left: 0;
  margin-bottom: 10px;
  font-size: 12px;
  color: #606266;
  text-align: left;
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: default;
}


.info-icon {
  color: #409eff;
  font-size: 12px !important;
  width: 12px;
  height: 12px;
}

.hint-text {
  white-space: nowrap;
}

/* 新增：用户协议样式 */
.terms-section {
  margin: 15px 0;
  padding-left: 0;
  font-size: 14px;
}

.terms-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
  margin: 0 3px;
}

.terms-link:hover {
  color: #66b1ff;
}

.terms-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

.terms-text p {
  margin-bottom: 12px;
  line-height: 1.6;
  text-align: justify;
}
</style>
