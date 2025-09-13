<template>
  <div class="app-wrapper">
    <!-- 页眉 -->
    <header class="top-bar-outer">
      <div class="container top-bar-inner">
        <div class="brand" @click="homeSelect">
          <img
              src="@/assets/img/dongshan.png" alt="东山图标"
              style="height: 2em; vertical-align: middle; margin-right: 0.3em;"
          />
          <el-text style="font-size: 26px;margin-bottom: 0;"> 社 区</el-text>
        </div>
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            background-color="#2c3e50"
            text-color="#fff"
            active-text-color="#ffd04b"
            class="right-menu"
            :default-active="activeMenu"
            @select="handleMenuSelect"
            style="flex: 1; justify-content: flex-end;"
        >
          <el-menu-item index="/lab">实验室介绍</el-menu-item>
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
          <el-menu-item index="/task">任务</el-menu-item>
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
          <a href="/terms">使用条款</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import 'element-plus/dist/index.css'
import {ElMenu, ElMenuItem, ElMessage} from 'element-plus'
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

.top-bar-outer {
  background-color: #2c3e50;
  width: 100%;
}

.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background-color: #2c3e50;
  height: 60px;
  width: 100%;
}

.brand {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: #9b0d14;
  transition: color 0.3s ease;
  display: flex;
}

.brand:hover {
  cursor: pointer;
}

.right-menu {
  border-bottom: none;
  margin-left: auto;
}

.right-menu .el-menu-item {
  margin: 0 10px;
}

.right-menu .el-menu-item[index="logout"] {
  color: #ff4d4f;
}

.right-menu .el-menu-item[index="logout"]:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 3rem 0 1.5rem;
  position: relative;
}

.footer .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.copyright {
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 1;
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
</style>