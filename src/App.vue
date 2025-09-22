<template>
  <div class="app-wrapper">
    <!-- 页眉 -->
    <header class="top-bar-outer">
      <div class="container top-bar-inner">
        <div class="brand" @click="homeSelect">
          <img
              src="@/assets/img/dongshan.png" alt="东山图标"
              class="brand-logo"
          />
          <el-text class="brand-title"> 社 区</el-text>
        </div>
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            background-color="transparent"
            text-color="#1f2d3d"
            active-text-color="#00d1ff"
            class="right-menu"
            :default-active="activeMenu"
            @select="handleMenuSelect"
            style="flex: 1; justify-content: flex-end;"
            menu-trigger="hover"
        >
          <el-menu-item index="/lab">开源项目介绍</el-menu-item>
          <el-menu-item >
            <a
                href="https://sddx.huimaibuy.net/"
                target="_blank"
                rel="noopener noreferrer"
                class="el-menu-item external-link"
            >
              开源新闻
            </a>
          </el-menu-item>
          <el-menu-item index="/docs">文档</el-menu-item>
          <el-menu-item index="/mirror">镜像下载</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>

          <el-sub-menu index="/intern">
            <template #title>实习生</template>
            <el-menu-item index="/task">实习生任务领取</el-menu-item>
            <el-menu-item index="/intern/plan">实习生教学计划概述</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/personInfo" v-if="isLoggedIn">个人信息</el-menu-item>
          <el-menu-item
              :index="isLoggedIn ? 'logout' : 'login'"
              @click="handleLoginLogout"
              style="cursor: pointer;"
          >
            {{ isLoggedIn ? '退出登录' : '登录' }}
          </el-menu-item>
        </el-menu>
      </div>
    </header>
    <main>
      <router-view/>
    </main>
    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p class="copyright">© 2025 东山社区 版权所有</p>
        <div class="footer-links">
          <a href="/about">关于我们</a>
          <a href="/contact">联系我们</a>
          <a href="/service">服务条款</a>
          <a href="/privacy">隐私权政策</a>
          <a href="/lawanno">法律声明</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import 'element-plus/dist/index.css'
import { ElMenu, ElMenuItem, ElSubMenu, ElMessage } from 'element-plus'
import {useRouter, useRoute} from 'vue-router'
import {ref, watch, onMounted, onUnmounted} from "vue";

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path === '/' ? '' : route.path)
const isLoggedIn = ref(false)

function checkLoginStatus() {
  isLoggedIn.value = !!localStorage.getItem('token')
}

onMounted(() => {
  checkLoginStatus()

  window.addEventListener('storage', checkLoginStatus)
})

const routeUnwatch = watch(
    () => route.path,
    (newPath) => {
      activeMenu.value = newPath === '/' ? '' : newPath
      // 路由变化时主动更新登录状态
      checkLoginStatus()
    }
)

onUnmounted(() => {
  window.removeEventListener('storage', checkLoginStatus)
})

watch(
    () => route.path,
    (newPath) => {
      activeMenu.value = newPath === '/' ? '' : newPath
    }
)

function handleMenuSelect(index) {
  // 子菜单会把对应 index 传进来，比如 /intern/task 或 /intern/plan
  if (index === 'logout') return
  router.push(index)
}

function homeSelect() {
  router.push("/")
  activeMenu.value = ''
}

function handleLoginLogout() {
  if (isLoggedIn.value) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    ElMessage.success('已成功退出登录')
    isLoggedIn.value = false
    router.push('/')
  } else {
    router.push('/login')
  }
}
window.updateLoginStatus = checkLoginStatus
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}



.top-bar-outer{
  position: sticky;
  top:0;
  z-index:50;
  width:100%;
  background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.55));
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(15,23,42,.06);
}
.top-bar-inner{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 5%;
  height:64px;
}
.brand{
  display: flex;            /* 横向一行 */
  align-items: center;      /* 图标与文字垂直居中 */
  gap: .35rem;              /* 两者间距 */
  white-space: nowrap;      /* 不换行 */
  font-size:20px;           /* 你原来的 */
  font-weight:600;
  color:#0f172a;
  cursor:pointer;
}

.brand-logo{
  height: 2em;
  display: block;
  flex: 0 0 auto;
}

.brand-title{
  font-size: 26px;
  line-height: 1;
  margin: 0;
  display: inline-block;
}



.brand:hover {
  cursor: pointer;
}

.right-menu {
  border-bottom: none;
  margin-left: auto;
}


.footer{
  background: linear-gradient(180deg, rgba(255,255,255,.8), rgba(241,245,249,.9));
  color:#334155;
  padding:1.2rem 0 0.4rem; /* ↓ 降低高度 */
  border-top:1px solid rgba(15,23,42,.06);
}
.footer-links{
  display:flex;
  justify-content:center;
  gap:1.25rem;
  flex-wrap:wrap;
}
.footer-links a{
  color:#0ea5e9;
}
.footer-links a:hover{
  color:#0284c7;
}


.footer .container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.copyright {
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
}

@media (max-width: 768px) {
  .brand {
    font-size: 16px;
  }

  .right-menu {
    min-width: auto;
  }

  .section {
    padding: 20px 0;
  }
}

.right-menu {
  border-bottom: none;
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.right-menu :deep(.el-menu-item),
.right-menu :deep(.el-sub-menu),
.right-menu :deep(.el-sub-menu__title) {
  flex: 0 0 104px;
  padding: 0;
  justify-content: center;
  text-align: center;
}

.right-menu :deep(.el-menu-item .external-link) {
  display: block;
  width: 100%;
}

.right-menu .el-menu-item { margin: 0; }

.right-menu .el-menu-item[index="logout"] {
  color: #ff4d4f;
}
.right-menu .el-menu-item[index="logout"]:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

</style>