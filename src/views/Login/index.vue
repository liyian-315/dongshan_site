<template>
  <div class="auth-bg">
    <div class="auth-panel">
      <!-- 左侧内容区 -->
      <section class="panel-left">
        <el-link type="info" :underline="false" class="back-link" @click="goHome">
          ← 返回首页
        </el-link>

        <h1 class="headline">欢迎加入东山社区！</h1>
        <p class="subline">
          加入东山社区，获取镜像下载、任务发布、资料文档等服务。
          我们坚持开放共享，致力于让技术更简单。
        </p>

        <img class="illustration" src="@/assets/img/dongshan.svg" alt="illustration" />
        <div class="dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </section>

      <!-- 右侧：登录卡片（独立白卡，带阴影） -->
      <section class="panel-right">
        <el-card class="login-box" shadow="always">
          <h3 class="box-title">用户登录</h3>

          <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="0"
              :size="'large'"
              class="box-form"
          >
            <!-- 邮箱/用户名 -->
            <el-form-item prop="username">
              <el-input
                  v-model.trim="form.username"
                  placeholder="Email / 用户名"
                  clearable
                  :validate-event="false"
              >
                <!-- 使用内联 SVG 作为前缀图标，避免额外依赖 -->
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1
                    0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/>
                  </svg>
                </template>
              </el-input>
              <template #error="{ error }">
                <span class="err">{{ error }}</span>
              </template>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                  v-model="form.password"
                  type="password"
                  show-password
                  placeholder="Password / 密码"
                  clearable
                  :validate-event="false"
              >
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2
                    2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 0H9V9a3
                    3 0 0 1 6 0v2h-2z"/>
                  </svg>
                </template>
              </el-input>
              <template #error="{ error }">
                <span class="err">{{ error }}</span>
              </template>
            </el-form-item>

            <!-- 记住我 + 忘记密码 -->
            <div class="row-helper">
              <el-checkbox v-model="remember">记住我</el-checkbox>
              <el-link type="info" :underline="false" class="forget" @click="onForget">忘记密码</el-link>
            </div>

            <!-- 登录按钮（渐变 + 阴影） -->
            <el-button class="login-btn" type="primary" size="large" @click="submitForm">
              登录
            </el-button>

            <!-- 去注册 -->
            <div class="signup-tip">
              <span>还未加入？</span>
              <el-link class="signup-link" type="success" :underline="false" @click="goToRegister">
                创建用户
              </el-link>
            </div>
          </el-form>
        </el-card>
      </section>
    </div>

    <div class="arc arc-blue"></div>
    <div class="arc arc-green"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user.js'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const form = ref({
  username: '',
  password: ''
})

const remember = ref(false)

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
    { min: 2, message: '至少 2 个字符', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 6, message: '至少 6 位', trigger: ['blur', 'change'] }
  ]
}

function goHome() {
  router.push('/home')
}
function goToRegister() {
  router.push('/register')
}
function onForget() {
  router.push('/forgot-password')
}

async function submitForm() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    const response = await login(form.value)
    if (response && response.token) {
      const { token, username, role, id } = response
      localStorage.setItem('token', (token || '').trim())
      localStorage.setItem('username', (username || '').trim())
      localStorage.setItem('role', (role || '').trim())
      localStorage.setItem('userId',(id || ''))

      if (remember.value) {
        localStorage.setItem('remember_username', form.value.username)
      } else {
        localStorage.removeItem('remember_username')
      }

      ElMessage.success('登录成功')
      if (window.updateLoginStatus) window.updateLoginStatus()
      const redirect = route.query.redirect || '/'
      await router.push(redirect)
    } else {
      console.error('登录失败：未获取到有效 Token')
      ElMessage.info('登录失败')
      // console.error('登录失败：未获取到有效 Token')
    }
  } catch (e) {
    if (e?.name !== 'Error') return
    // ElMessage.error('登录失败: ' + (e?.message || '用户名或密码错误'))
    ElMessage.info('登录失败: 用户名或密码错误')
  }
}

onMounted(() => {
  const saved = localStorage.getItem('remember_username')
  if (saved) form.value.username = saved
})
</script>

<style scoped>

.auth-bg {
  position: relative;
  min-height: calc(100vh - 64px - 76px);
  padding: 48px 24px;
  background:
      radial-gradient(1200px 600px at 10% -10%, rgba(0, 209, 255, 0.10), transparent 60%),
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
  box-shadow: 0 22px 60px rgba(0,0,0,0.08);
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
  filter: drop-shadow(0 8px 18px rgba(0,0,0,.06));
}
.dots { margin-top: 12px; }
.dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #c9d3e0;
  margin-right: 6px;
}
.dot.active { background: var(--el-color-primary); }

.panel-right {
  position: relative;
  display: grid;
  place-items: center;
  padding: 36px;
  background: linear-gradient(120deg, rgba(0, 153, 255, .06), transparent 50%);
}
.login-box {
  width: 92%;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0,0,0,.08);
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

.err { color: #ff4d4f; }

/* 记住我/忘记密码行 */
.row-helper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2px 0 10px;
}
.forget { opacity: .8; }

.login-btn {
  width: 100%;
  height: 44px;
  margin: 4px 0 10px;
  border: 0;
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
  box-shadow: 0 8px 16px rgba(0, 140, 255, .24);
}

.signup-tip{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:2px;
  white-space:nowrap;
  line-height:1;
}
.signup-link{ padding-left:2px; }

.arc {
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  filter: blur(0.2px);
}
.arc-blue {
  right: -120px;
  top: -40px;
  width: 360px; height: 180px;
  background: radial-gradient(120% 120% at 50% 50%, #1e90ff 0%, #1e90ff 60%, transparent 61%);
  transform: rotate(-12deg);
}
.arc-green {
  left: -80px;
  bottom: -60px;
  width: 220px; height: 220px;
  background: radial-gradient(120% 120% at 50% 50%, #48c774 0%, #48c774 60%, transparent 61%);
  transform: rotate(24deg);
}

@media (max-width: 1024px) {
  .auth-panel { grid-template-columns: 1fr; }
  .panel-right { padding: 24px; }
  .login-box { width: min(520px, 92vw); }
  .illustration { width: 86%; }
}

@keyframes neonPulse {
  0%   { box-shadow: 0 0 0 2px rgba(0,209,255,0.16), 0 0 10px rgba(0,209,255,0.26); }
  100% { box-shadow: 0 0 0 3px rgba(0,209,255,0.28), 0 0 22px rgba(0,209,255,0.46); }
}

.login-form :deep(.el-input__wrapper.is-focus),

.login-form :deep(.el-input__wrapper.is-hovering) {
  border-color: var(--el-color-primary);
  animation: neonPulse 1.6s ease-in-out infinite alternate;
}

.login-btn,
.actions :deep(.el-button[type="primary"]) {
  transition: transform .12s ease, box-shadow .2s ease;
}

.login-btn:is(:hover,:focus-visible),
.actions :deep(.el-button[type="primary"]:is(:hover,:focus-visible)) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0,140,255,.32), 0 0 18px rgba(0,209,255,.35);
}

@media (prefers-reduced-motion: reduce) {
  .login-form :deep(.el-input__wrapper.is-focus),
  .login-form :deep(.el-input__wrapper.is-hovering) { animation: none !important; }
}

</style>
