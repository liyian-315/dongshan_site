<template>
  <div class="auth-bg">
    <div class="auth-panel">
      <!-- 左侧内容区 -->
      <section class="panel-left">
        <el-link type="info" :underline="false" class="back-link" @click="goHome">
          ← 返回首页
        </el-link>

        <h1 class="headline">找回密码</h1>
        <p class="subline">
          输入您的邮箱地址，我们将向您发送密码重置链接。
        </p>

        <img class="illustration" src="@/assets/img/forgot.svg" alt="找回密码-信封图标" />
        <div class="dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </section>

      <!-- 右侧：表单卡片 -->
      <section class="panel-right">
        <el-card class="form-box" shadow="always">
          <h3 class="box-title">验证您的邮箱</h3>

          <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="0"
              :size="'large'"
              class="box-form"
          >
            <!-- 邮箱 -->
            <el-form-item prop="email">
              <el-input
                  v-model.trim="form.email"
                  placeholder="请输入邮箱"
                  clearable
                  :validate-event="false"
                  @blur="handleEmailBlur"
              >
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/>
                  </svg>
                </template>
              </el-input>
              <template #error="{ error }">
                <span class="err">{{ error }}</span>
              </template>
            </el-form-item>

            <!-- 验证码输入 + 图片 + 换图提示 -->
            <el-form-item prop="captchaCode">
              <div class="captcha-group">
                <el-input
                    v-model="form.captchaCode"
                    placeholder="请输入验证码"
                    clearable
                    :validate-event="false"
                >
                  <template #prefix>
                    <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 0H9V9a3 3 0 0 1 6 0v2h-2z"/>
                    </svg>
                  </template>
                </el-input>
                <!-- 验证码图片（点击切换）+ 自定义默认提示图 + 下方提示 -->
                <div class="captcha-img-container">
                  <img
                      :src="captchaImgUrl || defaultCaptchaImg"
                      alt="验证码"
                      class="captcha-img"
                      style="cursor: pointer; width: 100px; height: 40px;"
                      @click="refreshCaptcha"
                  />
                  <!-- 换图提示：放在图片下方，不换行 -->
                  <span class="captcha-tip" @click="refreshCaptcha">看不清？点击图片换一张</span>
                </div>
              </div>
              <!-- 验证码错误提示 -->
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
            >
              发送重置邮件
            </el-button>
          </el-form>
        </el-card>
      </section>
    </div>

    <div class="arc arc-blue"></div>
    <div class="arc arc-green"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { forgotPassword } from '@/api/forget.js'

const router = useRouter()
const formRef = ref(null)

const form = ref({
  email: '',
  captchaCode: ''
})

const captchaImgUrl = ref('') // 验证码图片地址
const defaultCaptchaImg = ref(`data:image/svg+xml;utf8,
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40" fill="none">
  <rect x="0.5" y="0.5" width="99" height="39" rx="4" fill="white" stroke="#1e90ff" stroke-width="1.5"/>
  <text x="50" y="22" text-anchor="middle" fill="#1e90ff" font-size="13" font-family="Arial, sans-serif">请先填写邮箱</text>
</svg>`)

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  captchaCode: [
    { required: true, message: '请输入验证码', trigger: ['blur', 'change'] }
  ]
}

// 邮箱失去焦点时加载验证码
const handleEmailBlur = () => {
  if (form.value.email) {
    refreshCaptcha()
  } else {
    captchaImgUrl.value = '' // 清空验证码，显示默认提示图
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  if (!form.value.email) {
    ElMessage.warning('请先填写注册邮箱')
    return
  }
  captchaImgUrl.value = `/api/public/captcha/${form.value.email}?t=${Date.now()}`
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    // 直接调用 forgotPassword 接口
    const res = await forgotPassword({
      forgotEmail: form.value.email,
      captchaCode: form.value.captchaCode
    })
    // 提示并跳转
    ElMessage.success(res.message || '邮件发送成功，请查收')
    router.push('/forgot-password/sent')
  } catch (e) {
    ElMessage.error('操作失败，请重试')
    console.error('表单验证失败或接口调用异常', e)
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* 复用 auth-bg 等样式（与登录页一致） */
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

/* 其余样式与登录页一致，可复用 */
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
.form-box {
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

/* 验证码组样式：输入框 + 图片 + 下方提示（关键调整） */
.captcha-group {
  display: flex;
  align-items: flex-start; /* 输入框与图片顶部对齐 */
  gap: 8px;
}
.captcha-img-container {
  display: flex;
  flex-direction: column; /* 图片和提示垂直排列 */
  align-items: center;
  gap: 4px; /* 图片与提示间距 */
}
.captcha-tip {
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
  white-space: nowrap; /* 强制不换行 */
}
.captcha-tip:hover {
  color: #1e90ff;
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin: 4px 0 10px;
  border: 0;
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
  box-shadow: 0 8px 16px rgba(0, 140, 255, .24);
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

/* 响应式适配 */
@media (max-width: 1024px) {
  .auth-panel { grid-template-columns: 1fr; }
  .panel-right { padding: 24px; }
  .form-box { width: min(520px, 92vw); }
  .illustration { width: 86%; }
}
</style>