<template>
  <div class="app-container">
    <el-affix offset="0">
      <div class="top-bar-inner">
        <h1 class="brand">山东大学资源下载</h1>
        <div class="menu-container">
          <el-menu
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              class="right-menu"
          >
            <el-menu-item index="1" @click="scrollTo('news')">
              学术新闻
            </el-menu-item>
            <el-menu-item index="2" @click="scrollTo('mirror')">
              镜像下载
            </el-menu-item>
            <el-menu-item index="3" @click="scrollTo('doc')">
              文档下载
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </el-affix>

    <el-main class="main-content">
      <!-- 新闻 -->
      <section id="news" class="section">
        <el-row :gutter="20">
          <el-col :span="24">
            <NewsCarousel/>
          </el-col>
        </el-row>
      </section>

      <!-- 镜像 -->
      <section id="mirror" class="section">
        <el-row :gutter="20">
          <el-col :span="24">
            <MirrorDownload/>
          </el-col>
        </el-row>
      </section>

      <!-- 文档 -->
      <section id="doc" class="section">
        <el-row :gutter="20">
          <el-col :span="24">
            <DocumentDownload/>
          </el-col>
        </el-row>
      </section>
    </el-main>
  </div>
</template>

<script setup>
import 'element-plus/dist/index.css'
import {ElAffix, ElMenu, ElMenuItem, ElMain, ElRow, ElCol} from 'element-plus'
import NewsCarousel from './components/NewsCarousel.vue'
import MirrorDownload from './components/MirrorDownload.vue'
import DocumentDownload from './components/DocumentDownload.vue'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({behavior: 'smooth'})
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.section {
  scroll-margin-top: 64px;
  padding: 40px 0;
  width: 100%;
}

.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background-color: #545c64;
  height: 60px;
  width: 100%;
}

.brand {
  color: #fff;
  margin: 0;
  font-size: 20px;
  line-height: 1;
  min-width: 180px;
  white-space: nowrap;
}
.menu-container {
  flex: 0 1 auto;
  min-width: 300px;
}
.right-menu {
  border-bottom: none;
  margin-left: auto;
}

.right-menu .el-menu-item {
  margin: 0 10px;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  background: #fff;
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
