<template>
  <div class="app-wrapper">
    <!-- 页眉 -->
    <header class="top-bar-outer">
      <div class="container top-bar-inner">
        <div class="brand" @click="homeSelect">东山社区</div>
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            background-color="#283272"
            text-color="#fff"
            active-text-color="#ffd04b"
            class="right-menu"
            :default-active="activeMenu"
            @select="handleMenuSelect"
            style="flex: 1; justify-content: flex-end;"
        >
          <el-menu-item index="/lab">实验室介绍</el-menu-item>
          <el-menu-item index="/news">开源新闻</el-menu-item>
          <el-menu-item index="/docs">文档</el-menu-item>
          <el-menu-item index="/mirror">镜像下载</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
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
import {ElAffix, ElMenu, ElMenuItem} from 'element-plus'
import {useRouter, useRoute} from 'vue-router'
import {ref, watch} from "vue";

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path === '/' ? '' : route.path)

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
  background-color: #283272;
  width: 100%;
}

.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background-color: #283272;
  height: 60px;
  width: 100%;
}

.brand {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: #ffd04b;
  transition: color 0.3s ease;
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

.footer {
  background-color: #283272;
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
