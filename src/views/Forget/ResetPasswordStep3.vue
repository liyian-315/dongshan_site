<template>
  <div class="auth-bg">
    <div class="auth-panel">
      <section class="panel-left">
        <el-link type="info" :underline="false" class="back-link" @click="goHome">
          ← 返回首页
        </el-link>

        <h1 class="headline">重置密码</h1>
        <p class="subline">
          请设置新密码，密码长度至少 6 位，建议包含字母和数字。
        </p>

        <img class="illustration" src="@/assets/img/dongshan.svg" alt="重置密码"/>
      </section>

      <section class="panel-right">
        <el-card class="form-box" shadow="always" v-if="!tokenInvalid">
          <h3 class="box-title">设置新密码</h3>

          <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="0"
              :size="'large'"
              class="box-form"
          >
            <!-- 新密码 -->
            <el-form-item prop="newPassword">
              <el-input
                  v-model="form.newPassword"
                  type="password"
                  show-password
                  placeholder="请输入新密码"
                  clearable
                  :validate-event="false"
              >
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor"
                          d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 0H9V9a3 3 0 0 1 6 0v2h-2z"/>
                  </svg>
                </template>
              </el-input>
              <template #error="{ error }">
                <span class="err">{{ error }}</span>
              </template>
            </el-form-item>

            <!-- 确认密码 -->
            <el-form-item prop="confirmPassword">
              <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  show-password
                  placeholder="请确认新密码"
                  clearable
                  :validate-event="false"
              >
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor"
                          d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 0H9V9a3 3 0 0 1 6 0v2h-2z"/>
                  </svg>
                </template>
              </el-input>
              <template #error="{ error }">
                <span class="err">{{ error }}</span>
              </template>
            </el-form-item>

            <!-- 提交按钮 -->
            <el-button
                class="submit-btn"
                type="primary"
                size="large"
                @click="submitForm"
                :loading="loading"
            >
              确认重置
            </el-button>
          </el-form>
        </el-card>

        <!-- 令牌无效提示 -->
        <el-card class="form-box" shadow="always" v-else>
          <div class="invalid-token">
            <el-icon class="error-icon">
              <Close/>
            </el-icon>
            <h3>链接无效或已过期</h3>
            <p>请重新发起密码重置请求</p>
            <el-button
                type="primary"
                size="large"
                @click="goToForgot"
                class="retry-btn"
            >
              重新找回密码
            </el-button>
          </div>
        </el-card>
      </section>
    </div>

    <div class="arc arc-blue"></div>
    <div class="arc arc-green"></div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {Close} from '@element-plus/icons-vue' // 导入正确的图标
import {resetPassword} from '@/api/forget.js' // 假设接口在 user.js 中

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)
const tokenInvalid = ref(false)

// 从URL获取token
const token = route.query.token || ''

const form = ref({
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  newPassword: [
    {required: true, message: '请输入新密码', trigger: ['blur', 'change']},
    {min: 6, message: '密码长度不能少于6位', trigger: ['blur', 'change']}
  ],
  confirmPassword: [
    {required: true, message: '请确认新密码', trigger: ['blur', 'change']},
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]
}

onMounted(() => {
  // 检查token是否存在
  if (!token) {
    tokenInvalid.value = true
  }
})

const submitForm = async () => {
  if (!formRef.value || !token) return
  try {
    loading.value = true
    await formRef.value.validate()
    // 调用重置密码接口
    const res = await resetPassword(token, {
      newPassword: form.value.newPassword,
      confirmPassword: form.value.confirmPassword
    })
    ElMessage.success('密码重置成功，请使用新密码登录')
    router.push('/login')
  } catch (e) {
    console.error('表单验证失败', e)
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push('/')
}

const goToForgot = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>
/* 复用基础样式 */
.auth-bg {
  position: relative;
  min-height: calc(100vh - 64px - 76px);
  padding: 48px 24px;
  background: radial-gradient(1200px 600px at 10% -10%, rgba(0, 209, 255, 0.10), transparent 60%),
  radial-gradient(1000px 500px at 110% 110%, rgba(99, 102, 241, 0.10), transparent 60%),
  linear-gradient(180deg, #f7fafc, #eef2f7);
  display: grid;
  place-items: center;
  overflow: hidden;
}

.auth-panel {
  position: relative;
  z-index: 2;
  width: min(1100px, 96vw);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  overflow: hidden;
}

.panel-left {
  padding: 40px 48px 48px 56px;
}

.back-link {
  margin-bottom: 8px;
  display: inline-block;
  opacity: .7;
}

.headline {
  margin: 10px 0 6px;
  letter-spacing: .25em;
  font-weight: 700;
  font-size: 18px;
  color: #1f2d3d;
}

.subline {
  color: #6b778c;
  max-width: 520px;
  line-height: 1.7;
  margin-bottom: 24px;
}

.illustration {
  width: 75%;
  max-width: 520px;
  min-width: 320px;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, .06));
}

.panel-right {
  position: relative;
  display: grid;
  place-items: center;
  padding: 36px;
  background: linear-gradient(120deg, rgba(0, 153, 255, .06), transparent 50%);
}

.form-box {
  width: 92%;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .08);
}

.box-title {
  text-align: center;
  margin: 4px 0 14px;
  letter-spacing: .12em;
  color: #2c3e50;
}

.box-form {
  padding: 0 10px 10px 10px;
}

.prefix-icon {
  color: #5686ff;
  opacity: .85;
}

.err {
  color: #ff4d4f;
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin: 4px 0 10px;
  border: 0;
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
  box-shadow: 0 8px 16px rgba(0, 140, 255, .24);
}

/* 令牌无效样式 */
.invalid-token {
  text-align: center;
  padding: 30px 20px;
}

.error-icon {
  font-size: 48px;
  color: #ff4d4f;
  margin-bottom: 16px;
}

.invalid-token h3 {
  color: #1f2d3d;
  margin-bottom: 8px;
}

.invalid-token p {
  color: #6b778c;
  margin-bottom: 24px;
}

.retry-btn {
  width: 80%;
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
}

.arc {
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  filter: blur(0.2px);
}

.arc-blue {
  right: -120px;
  top: -40px;
  width: 360px;
  height: 180px;
  background: radial-gradient(120% 120% at 50% 50%, #1e90ff 0%, #1e90ff 60%, transparent 61%);
  transform: rotate(-12deg);
}

.arc-green {
  left: -80px;
  bottom: -60px;
  width: 220px;
  height: 220px;
  background: radial-gradient(120% 120% at 50% 50%, #48c774 0%, #48c774 60%, transparent 61%);
  transform: rotate(24deg);
}

@media (max-width: 1024px) {
  .auth-panel {
    grid-template-columns: 1fr;
  }

  .panel-right {
    padding: 24px;
  }

  .form-box {
    width: min(520px, 92vw);
  }

  .illustration {
    width: 86%;
  }
}
</style>