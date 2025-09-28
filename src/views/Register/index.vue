<template>
  <!-- 注册页：左侧介绍与插图 + 右侧注册卡片-->
  <div class="auth-bg">
    <div class="auth-panel">
      <!-- 左列：文案插图 -->
      <section class="panel-left">
        <el-link type="info" :underline="false" class="back-link" @click="goHome">
          ← 返回首页
        </el-link>

        <h1 class="headline">创建用户</h1>
        <p class="subline">
          加入东山社区，获取镜像下载、任务发布、资料文档等服务。
          我们坚持开放共享，致力于让技术更简单。
        </p>

        <img class="illustration" src="@/assets/img/dongshan.svg" alt="illustration" />
        <div class="dots"><span class="dot active"></span><span class="dot"></span><span class="dot"></span></div>
      </section>

      <!-- 右列：注册卡片 -->
      <section class="panel-right">
        <el-card class="reg-box" shadow="always">
          <h3 class="box-title">用户注册</h3>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="96px" :size="'large'">
            <el-row :gutter="16">
              <el-col :span="24">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model.trim="form.username" placeholder="请输入用户名" clearable>
                    <template #prefix>
                      <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 1 1 16 0H4Z"/></svg>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="姓名" prop="fullname">
                  <el-input v-model.trim="form.fullname" placeholder="请输入真实姓名" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="主邮箱" prop="email">
                  <el-input v-model.trim="form.email" type="email" placeholder="请输入主要邮箱" clearable>
                    <template #prefix>
                      <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="备用邮箱" prop="email2">
                  <el-input v-model.trim="form.email2" type="email" placeholder="请输入备用邮箱（选填）" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="电话" prop="phone">
                  <el-input v-model.trim="form.phone" placeholder="请输入手机号码" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  <el-input v-model.trim="form.address" placeholder="请输入详细地址" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="单位" prop="company">
                  <el-input v-model.trim="form.company" placeholder="学校/单位/组织" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="密码" prop="password">
                  <el-input v-model="form.password" type="password" show-password placeholder="设置登录密码" clearable>
                    <template #prefix>
                      <svg class="prefix-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 0H9V9a3 3 0 0 1 6 0v2h-2z"/></svg>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="form.confirmPassword" type="password" show-password placeholder="再次输入密码" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="row-helper">
              <el-checkbox v-model="agreeTerms">我已阅读并同意</el-checkbox>
              <el-link type="primary" :underline="false" @click="openTermsDialog">《用户协议》</el-link>
            </div>

            <el-button class="cta-btn" type="primary" size="large" @click="onSubmit">创建账户</el-button>

            <div class="signup-tip">
              已有账号？
              <el-link type="success" :underline="false" @click="goLogin">直接登录</el-link>
            </div>
          </el-form>
        </el-card>
      </section>
    </div>

    <div class="arc arc-blue"></div>
    <div class="arc arc-green"></div>

    <!-- 用户协议对话框 -->
    <el-dialog v-model="termsDialogVisible" title="东山社区用户协议" width="720px">
      <div class="terms-content">
        <div class="terms-text">
          <p>这里放置你的用户协议正文。为简洁起见省略，可替换为真实内容。</p>
          <p>1）请遵守相关法律法规；2）不得用于非法用途；3）尊重社区成员与内容版权；……</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="termsDialogVisible=false">关闭</el-button>
        <el-button type="primary" @click="agreeTerms=true;termsDialogVisible=false">同意并继续</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 注册逻辑：调用 /api/auth/register
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerUser } from '@/api/user.js'

const router = useRouter()
const formRef = ref(null)

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

const agreeTerms = ref(false)
const termsDialogVisible = ref(false)

// 验证规则）
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
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur','change'] }
  ],
  email2: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur','change'] }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^\+?[1-9]\d{5,14}$/, message: '请输入有效的国际电话号码（6-15位数字）', trigger: ['blur','change'] }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入单位或学校', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度必须在8-20个字符之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@\[\]\\\]^_`{-~])[A-Za-z\d!-/:-@\[\]\\\]^_`{-~]{8,}$/, message: '需含大小写字母、数字和特殊字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (r, v, cb) => v!==form.password ? cb(new Error('两次输入的密码不一致')) : cb(), trigger: ['blur','change'] }
  ]
}

function openTermsDialog(){ termsDialogVisible.value = true }
function goHome(){ router.push('/home') }
function goLogin(){ router.push('/login') }

async function onSubmit(){
  if (!agreeTerms.value){
    ElMessage.warning('请先阅读并同意用户协议')
    return
  }
  if (!formRef.value) return
  try{
    await formRef.value.validate()
    const res = await registerUser(form)
    ElMessage.success('注册成功，请登录...')
    setTimeout(()=> router.push('/login'), 800)
  }catch(e){
    if (e?.name === 'Error'){
      ElMessage.error(e?.message || '注册失败，请检查填写信息')
    }
  }
}
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
  letter-spacing: .04em;
  font-weight: 700;
  font-size: 22px;
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
.dots {
  margin-top: 12px;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c9d3e0;
  margin-right: 6px;
}
.dot.active {
  background: var(--el-color-primary);
}

.panel-right {
  position: relative;
  display: grid;
  place-items: center;
  padding: 36px;
  background: linear-gradient(120deg, rgba(0, 153, 255, .06), transparent 50%);
}
.reg-box { width: 92%; border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,.08); }
.box-title { text-align: center; margin: 4px 0 14px; letter-spacing: .12em; color: #2c3e50; }

@keyframes neonPulse {
  0%   { box-shadow: 0 0 0 2px rgba(0,209,255,0.16), 0 0 10px rgba(0,209,255,0.26); }
  100% { box-shadow: 0 0 0 3px rgba(0,209,255,0.28), 0 0 22px rgba(0,209,255,0.46); }
}
:root { --el-color-primary: #00d1ff; }

:deep(.el-input__wrapper.is-focus),
:deep(.el-input__wrapper.is-hovering) {
  border-color: var(--el-color-primary);
  animation: neonPulse 1.6s ease-in-out infinite alternate;
}

.cta-btn {
  width: 100%;
  height: 44px;
  margin: 8px 0 6px;
  border: 0;
  background-image: linear-gradient(90deg, #1e90ff, #00d1ff);
  box-shadow: 0 8px 16px rgba(0, 140, 255, .24);
  transition: transform .12s ease, box-shadow .2s ease;
}
.cta-btn:is(:hover,:focus-visible) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0,140,255,.32), 0 0 18px rgba(0,209,255,.35);
}

.signup-tip {
  text-align: center;
  color: #7b8aa0;
  margin-top: 6px;
}

.arc {
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  filter: blur(.2px);
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
  .auth-panel { grid-template-columns: 1fr; }
  .panel-right { padding: 24px; }
  .reg-box { width: min(560px, 92vw); }
  .illustration { width: 86%; }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.el-input__wrapper.is-focus),
  :deep(.el-input__wrapper.is-hovering) {
    animation: none !important;
  }
}
</style>
