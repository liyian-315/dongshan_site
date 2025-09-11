<script setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElButton, ElCard, ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElRow} from 'element-plus'
import {registerUser} from '@/api/user.js'

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
  company: ''
})

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
  ]
}

// 表单引用
const formRef = ref(null)

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  try {
    // 表单验证
    await formRef.value.validate()

    // 提交注册数据
    const response = await registerUser(form)

    // 注册成功，显示消息并跳转
    ElMessage.success('注册成功，正在登录...')

    // 假设后端返回token等信息，这里可以处理登录状态
    // 例如存储token到localStorage
    if (response.token) {
      localStorage.setItem('token', response.token)
    }

    // 跳转到首页
    setTimeout(() => {
      router.push('/home')
    }, 1000)

  } catch (error) {
    // 处理验证失败或请求错误
    if (error.name === 'Error') {
      ElMessage.error('注册失败：' + error.message)
    } else {
      // 表单验证失败不需要额外处理，Element会自动提示
    }
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <el-card>
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

            <el-col :span="24" class="form-actions">
              <el-button type="primary" @click="submitForm">注册</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  padding: 0 20px 20px;
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
</style>
