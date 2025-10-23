<template>
  <div class="auth-bg">
    <div class="auth-panel">
      <section class="panel-left">
        <el-link type="info" :underline="false" class="back-link" @click="goHome">
          ← 返回首页
        </el-link>

        <h1 class="headline">邮件已发送</h1>
        <p class="subline">
          请检查您的邮箱，我们已发送密码重置链接。<br>
          若 5 分钟内未收到，请查看垃圾邮件文件夹。
        </p>

        <img class="illustration" src="@/assets/img/dongshan.svg" alt="邮件发送成功" />
      </section>

      <section class="panel-right">
        <el-card class="form-box" shadow="always">
          <div class="center-content">
            <el-button
                type="primary"
                size="large"
                @click="resendEmail"
                class="resend-btn"
            >
              重新发送邮件
            </el-button>
            <el-link type="info" :underline="false" @click="goToLogin" class="login-link">
              返回登录页
            </el-link>
          </div>
        </el-card>
      </section>
    </div>

    <div class="arc arc-blue"></div>
    <div class="arc arc-green"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { sendEmailVerificationCode } from '@/api/user.js'

const router = useRouter()

// 从路由参数获取邮箱（步骤1跳转时携带）
const email = router.currentRoute.value.query.email || ''

const goHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

// 重新发送邮件
const resendEmail = async () => {
  if (!email) {
    ElMessage.warning('未获取到邮箱地址，请重新操作')
    await router.push('/forgot-password')
    return
  }
  try {
    const res = await sendEmailVerificationCode(email)
    if (res.code === 200) {
      ElMessage.success('邮件已重新发送，请查收')
    } else {
      ElMessage.error('发送失败：' + res.message)
    }
  } catch (e) {
    ElMessage.error('系统异常，请稍后重试')
  }
}
</script>

<style scoped>
/* 复用基础样式 */
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
.center-content {
  text-align: center;
  padding: 20px;
}
.resend-btn {
  width: 80%;
  margin-bottom: 16px;
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
  box-shadow: 0 8px 16px rgba(0, 140, 255, .24);
}
.login-link {
  display: inline-block;
  margin-top: 8px;
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

@media (max-width: 1024px) {
  .auth-panel { grid-template-columns: 1fr; }
  .panel-right { padding: 24px; }
  .form-box { width: min(520px, 92vw); }
  .illustration { width: 86%; }
}
</style>