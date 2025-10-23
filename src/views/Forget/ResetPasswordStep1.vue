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
              >
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
                    />
                  </svg>
                </template>
              </el-input>
              <template #error="{ error }">
                <span class="err">{{ error }}</span>
              </template>
            </el-form-item>

            <!-- 验证码输入 + 图片/占位 + 换图提示 -->
            <el-form-item prop="captchaCode">
              <div class="captcha-group">
                <el-input
                    v-model="form.captchaCode"
                    placeholder="请输入验证码"
                    clearable
                    :validate-event="false"
                    @focus="onCaptchaFocus"
                >
                <template #prefix>
                  <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 0H9V9a3 3 0 0 1 6 0v2h-2z"
                    />
                  </svg>
                </template>
                </el-input>

                <div class="captcha-img-container">
                  <!-- 占位：内联 SVG（首屏或未激活时显示），不会被 CSP 拦截 -->
                  <button
                      v-if="showPlaceholder"
                      class="captcha-ph-wrapper"
                      type="button"
                      :class="{ 'is-disabled': !canLoadCaptcha }"
                      @click="handleCaptchaClick"
                      :tabindex="canLoadCaptcha ? 0 : -1"
                      :aria-disabled="!canLoadCaptcha"
                      aria-label="获取验证码"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40">
                      <rect x="0.75" y="0.75" width="98.5" height="38.5" rx="4" fill="white" />
                      <rect x="0.75" y="0.75" width="98.5" height="38.5" rx="4" stroke="#1e90ff" stroke-width="1.5" fill="none"/>
                      <text x="50" y="23" text-anchor="middle" fill="#1e90ff" font-size="13" font-family="Arial, sans-serif">请先填写邮箱</text>
                    </svg>
                  </button>

                  <!-- 真实验证码图（仅点击时刷新） -->
                  <img
                      v-else
                      :src="captchaImgUrl"
                      alt="验证码"
                      class="captcha-img"
                      style="cursor: pointer; width: 100px; height: 40px;"
                      @click="handleCaptchaClick"
                      @error="onCaptchaError"
                  />

                  <span
                      class="captcha-tip"
                      :class="{ 'is-disabled': !canLoadCaptcha }"
                      @click="handleCaptchaClick"
                  >
                    {{ tipText }}
                  </span>
                </div>
              </div>

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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { forgotPassword } from '@/api/forget.js'

const router = useRouter()
const formRef = ref(null)

const form = ref({
  email: '',
  captchaCode: ''
})

/** 是否已触发验证码区（用户是否聚焦过验证码输入框） */
const isCaptchaActivated = ref(false)
/** 验证码真实图地址（含时间戳） */
const captchaImgUrl = ref('')
/** 最近一次获取验证码时使用的邮箱（用于提交前一致性校验） */
const lastCaptchaEmail = ref('')

/** 邮箱是否可用（非空） */
const canLoadCaptcha = computed(() => !!form.value.email.trim())
/** 首次进入或未加载成功前显示占位 */
const showPlaceholder = computed(() => !isCaptchaActivated.value || !captchaImgUrl.value)
/** 提示文字 */
const tipText = computed(() =>
    canLoadCaptcha.value ? '看不清？点击图片换一张' : '请先填写邮箱'
)

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  captchaCode: [{ required: true, message: '请输入验证码', trigger: ['blur', 'change'] }]
}

/** 用户聚焦验证码输入框：此时才尝试首次加载验证码 */
const onCaptchaFocus = () => {
  isCaptchaActivated.value = true
  if (!canLoadCaptcha.value) {
    ElMessage.warning('请先填写注册邮箱')
    return
  }
  if (!captchaImgUrl.value) {
    refreshCaptcha()
  }
}

/** 点击图片/提示时刷新验证码（唯一的刷新入口） */
const handleCaptchaClick = () => {
  if (!canLoadCaptcha.value) {
    ElMessage.warning('请先填写注册邮箱')
    return
  }
  // 若还未激活，占位->图
  if (!isCaptchaActivated.value) isCaptchaActivated.value = true
  refreshCaptcha()
}

/** 刷新验证码（加时间戳防缓存） */
const refreshCaptcha = () => {
  const email = form.value.email.trim()
  captchaImgUrl.value = `/api/public/captcha/${encodeURIComponent(email)}?t=${Date.now()}`
  lastCaptchaEmail.value = email
}

/** 图片加载失败时回到占位，但保持已激活状态，等待用户再次点击 */
const onCaptchaError = () => {
  captchaImgUrl.value = ''
  if (canLoadCaptcha.value) {
    ElMessage.error('验证码加载失败，请点击重试')
  }
}

/** 提交表单前校验：必须获取过验证码，且邮箱未改动 */
const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()

    const emailNow = form.value.email.trim()
    if (!isCaptchaActivated.value || !captchaImgUrl.value) {
      ElMessage.warning('请点击验证码获取图片后再提交')
      return
    }
    if (emailNow !== lastCaptchaEmail.value) {
      ElMessage.warning('邮箱已修改，请点击验证码刷新后再提交')
      return
    }

    const res = await forgotPassword({
      forgotEmail: emailNow,
      captchaCode: form.value.captchaCode
    })
    ElMessage.success(res?.message || '邮件发送成功，请查收')
    router.push('/forgot-password/sent')
  } catch (e) {
    ElMessage.error('操作失败，请重试')
    console.error('表单验证失败或接口调用异常', e)
  }
}

const goHome = () => router.push('/')
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

/* 验证码组样式：输入框 + 图片/占位 + 下方提示 */
.captcha-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.captcha-img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* 占位按钮样式：与图片尺寸一致，可点击刷新 */
.captcha-ph-wrapper {
  width: 100px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.captcha-tip {
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
  white-space: nowrap;
}
.captcha-tip:hover { color: #1e90ff; }

/* 禁用态（邮箱未填） */
.captcha-tip.is-disabled,
.captcha-ph-wrapper.is-disabled {
  opacity: .5;
  pointer-events: none;
  cursor: not-allowed !important;
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
