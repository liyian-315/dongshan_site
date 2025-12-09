<template>
  <div class="app-wrapper bg-background-light text-text-light min-h-screen flex flex-col">
    <!-- 顶部导航 / 玻璃风 -->
    <header class="top-bar sticky top-0 z-50 w-full bg-white/70 dark:bg-background-light/50 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/40">
      <div class="container mx-auto px-4 h-16 flex items-center">
        <!-- 品牌 -->
        <div class="brand flex items-center gap-2 text-text-light cursor-pointer" @click="homeSelect">
          <img src="@/assets/img/dongshan.jpg" alt="东山图标" class="h-8 w-auto" />
          <span class="text-xl font-semibold leading-none">社 区</span>
        </div>

        <!-- 右侧菜单 -->
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            background-color="transparent"
            class="right-menu ml-auto"
            :default-active="activeMenu"
            @select="handleMenuSelect"
            menu-trigger="hover"
        >
          <el-menu-item index="/project">开源项目</el-menu-item>

          <el-menu-item class="!px-0">
            <a
                href="https://qloc-cn.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="external-link px-4 h-16"
            >
              开源新闻
            </a>
          </el-menu-item>

          <el-menu-item index="/docs">技术文档</el-menu-item>
          <el-menu-item index="/mirror">软件镜像</el-menu-item>
          <el-menu-item index="/events">活动赛事</el-menu-item>
          <el-menu-item index="/about">关于我们</el-menu-item>

          <el-sub-menu index="/intern">
            <template #title>实习生计划</template>
            <el-menu-item index="/task">任务领取</el-menu-item>
            <el-menu-item index="/intern/plan">教学计划</el-menu-item>
            <el-menu-item index="/join-process">如何加入</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="isAdmin" index="/admin">
            <template #title>管理员操作</template>
            <el-menu-item index="/adminEventEditors">活动管理</el-menu-item>
            <el-menu-item index="/AdminUserEditors">实习生管理</el-menu-item>
            <el-menu-item index="/AdminTaskEditors">任务管理</el-menu-item>
            <el-menu-item index="/adminHomeDisplayEditors">首页板块管理</el-menu-item>
            <el-menu-item index="/adminProjectEditors">项目管理</el-menu-item>
          </el-sub-menu>


          <el-menu-item v-if="isLoggedIn" index="/personInfo">个人信息</el-menu-item>

          <!-- 登录/退出，做成渐变主色按钮视觉 -->
          <el-menu-item :index="isLoggedIn ? 'logout' : 'login'" @click="handleLoginLogout" class="!px-0">
            <span
                class="inline-flex items-center justify-center h-9 min-w-[88px] px-4 rounded-lg font-medium text-white
                     bg-gradient-to-r from-primary to-secondary shadow-glow-sm hover:shadow-glow-md hover:scale-[1.02] transition-all"
            >
              {{ isLoggedIn ? '退出登录' : '登录' }}
            </span>
          </el-menu-item>
        </el-menu>
      </div>
    </header>

    <!-- 内容区 -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- 页脚 / 玻璃风 -->
    <footer class="bg-white/50 dark:bg-background-light/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/40">
      <div class="container mx-auto px-4 py-6 text-center">
        <p class="text-sm text-subtext-light">© 2025 东山社区 版权所有</p>
        <div class="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm">
          <RouterLink class="text-primary hover:underline font-medium" to="/about">关于我们</RouterLink>
          <RouterLink class="text-primary hover:underline font-medium" to="/contact">联系我们</RouterLink>
          <RouterLink class="text-primary hover:underline font-medium" to="/service">服务条款</RouterLink>
          <RouterLink class="text-primary hover:underline font-medium" to="/privacy">隐私权政策</RouterLink>
          <RouterLink class="text-primary hover:underline font-medium" to="/lawanno">法律声明</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import 'element-plus/dist/index.css'
import { ElMenu, ElMenuItem, ElSubMenu, ElMessage } from 'element-plus'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import IosToast from '@/components/IosToast.vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path === '/' ? '' : route.path)
const isLoggedIn = ref(false)
const isAdmin = ref(false)

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('storage', checkLoginStatus)
})
onUnmounted(() => {
  window.removeEventListener('storage', checkLoginStatus)
})
watch(
    () => route.path,
    (newPath) => {
      activeMenu.value = newPath === '/' ? '' : newPath
      checkLoginStatus()
    }
)

function checkLoginStatus() {
  isLoggedIn.value = !!localStorage.getItem('token')
  // 仅当已登录且角色为 admin 时才展示管理员菜单
  isAdmin.value = isLoggedIn.value && localStorage.getItem('role') === 'ROLE_ADMIN'  // NEW
}

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('storage', checkLoginStatus)
})
onUnmounted(() => {
  window.removeEventListener('storage', checkLoginStatus)
})

watch(
    () => route.path,
    (newPath) => {
      activeMenu.value = newPath === '/' ? '' : newPath
      checkLoginStatus()
    }
)

function handleLoginLogout() {
  if (isLoggedIn.value) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    ElMessage.success('已成功退出登录')
    isLoggedIn.value = false
    isAdmin.value = false // NEW: 退出同时清空管理员标记
    router.push('/')
  } else {
    router.push('/login')
  }
}

function handleMenuSelect(index) {
  if (index === 'logout') return
  if (index && typeof index === 'string' && index.startsWith('/')) {
    router.push(index)
  }
}
function homeSelect() {
  router.push('/')
  activeMenu.value = ''
}
window.updateLoginStatus = checkLoginStatus
</script>

<style scoped>
/* —— 顶栏 Element Plus 的“透明导航”适配 —— */

/* 整个菜单透明 + 去掉默认下边框、分隔线 */
.right-menu :deep(.el-menu) {
  background: transparent;
  border-bottom: none;
}

/* 横向菜单项的尺寸、居中 */
.right-menu :deep(.el-menu--horizontal > .el-menu-item),
.right-menu :deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
  height: 64px;
  line-height: 64px;
  padding: 0 14px;
}

/* 文字颜色：默认=正文色；hover=更深；active=主色 */
.right-menu :deep(.el-menu-item),
.right-menu :deep(.el-sub-menu__title) {
  color: rgb(30 41 59); /* slate-800 */
  background: transparent !important;
}
.right-menu :deep(.el-menu-item:hover),
.right-menu :deep(.el-sub-menu__title:hover) {
  color: rgb(15 23 42); /* slate-900 */
}


.right-menu :deep(.el-menu--horizontal > .el-menu-item.is-active),
.right-menu :deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
  color: rgb(99 102 241); /* indigo-500, 等效于 primary */
}
.right-menu :deep(.el-menu--horizontal > .el-menu-item.is-active::after),
.right-menu :deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title::after) {
  display: none;
}

/* 子菜单浮层圆角/阴影更柔和 */
.right-menu :deep(.el-popper.is-pure .el-menu--popup) {
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(2,6,23,.08);
}


.right-menu :deep(.external-link) {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 64px;
  color: inherit;
}


.right-menu :deep(.el-menu-item.is-active .inline-flex),
.right-menu :deep(.el-menu-item:hover .inline-flex) {
}



@media (max-width: 480px) {
  .right-menu :deep(.el-menu--horizontal > .el-menu-item),
  .right-menu :deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
    padding: 0 10px;
  }
}


.right-menu :deep(.el-menu--horizontal > .el-menu-item),
.right-menu :deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
  height: 64px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  line-height: normal;
}


.right-menu :deep(.external-link) {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: inherit;
  line-height: normal;
}

</style>
