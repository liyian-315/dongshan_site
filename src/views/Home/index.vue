<template>
  <div class="community-home">
    <section class="hero-section">
      <div class="container">
        <el-carousel
            height="400px"
            indicator-position="outside"
            :autoplay="true"
            class="custom-carousel"
        >
          <el-carousel-item>
            <div class="hero-container">
              <img
                  src="@/assets/img/dongshan.png"
                  alt="东山社区Logo"
                  class="community-logo"
              >
              <div class="hero-text">
                <h1 class="hero-title animate-fade-in">
                  探索开源技术的<br><span class="highlight">无限可能</span>
                </h1>
                <p class="hero-subtitle animate-fade-in-delay">
                  东山社区是面向未来的RISC-V开源生态协作平台，致力于构建开放、共享、创新的技术社群
                </p>
              </div>

              <!-- 右侧：视频播放区域 -->
              <div class="hero-right">
                <div class="video-container">
                  <video
                      class="community-video"
                      controls
                      autoplay
                      loop
                      muted
                      playsinline
                      preload="auto"
                      poster="@/assets/img/video-cover.png"
                  >
                    <source src="@/assets/img/dongshan-video.mp4" type="video/mp4">
                  您的浏览器不支持视频播放，请升级浏览器
                  </video>
                </div>
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item v-for="(item, idx) in newsList" :key="idx + 1">
            <div class="carousel-item-container vertical">
              <div class="carousel-img-wrapper vertical">
                <img
                    :src="item.image || 'https://via.placeholder.com/800x200?text=News+Banner'"
                    alt="新闻图片"
                    class="carousel-img"
                    loading="lazy"
                >
              </div>
              <div class="carousel-text-wrapper vertical">
                <h3 class="carousel-title">{{ item.title }}</h3>
                <p class="carousel-desc">{{ item.context }}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- 下半部分：功能模块区域 -->
    <section class="modules-section">
      <div class="container modules-container">
        <!-- 介绍模块 -->
        <div class="module-card" id="intro">
          <div class="module-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13H17V11H13V7Z"
                  fill="#333"/>
            </svg>
          </div>
          <h2 class="module-title">社区介绍</h2>
          <p class="module-desc">
            东山社区是面向开发者的开源技术社区，致力于推动技术交流与创新，构建完善的开源生态体系，为开发者提供学习、交流与合作的平台。
          </p>
          <router-link to="/introduction" class="module-btn">查看详情</router-link>
        </div>

        <!-- 新闻模块 -->
        <div class="module-card" id="news">
          <div class="module-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
                  fill="#333"/>
            </svg>
          </div>
          <h2 class="module-title">最新新闻</h2>
          <p class="module-desc">
            及时发布社区活动、技术动态、行业资讯等内容，让开发者第一时间了解社区发展与开源领域最新趋势。
          </p>
          <router-link to="/news" class="module-btn">查看详情</router-link>
        </div>

        <!-- 文档模块 -->
        <div class="module-card" id="docs">
          <div class="module-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM15 12H13V14H15V12ZM15 8H13V10H15V8Z"
                  fill="#333"/>
            </svg>
          </div>
          <h2 class="module-title">技术文档</h2>
          <p class="module-desc">
            提供完善的技术文档库，包括开发指南、API参考、教程手册等内容，助力开发者快速掌握相关技术与工具使用方法。
          </p>
          <router-link to="/docs" class="module-btn">查看详情</router-link>
        </div>

        <!-- 镜像模块 -->
        <div class="module-card" id="mirror">
          <div class="module-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="#333"/>
            </svg>
          </div>
          <h2 class="module-title">资源镜像</h2>
          <p class="module-desc">
            提供开源软件、开发工具、系统镜像等资源的高速下载服务，优化开发者资源获取体验，加速开发流程。
          </p>
          <router-link to="/mirror" class="module-btn">查看详情</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ElCarousel, ElCarouselItem} from "element-plus";
import {fetchHomeCarousel} from "@/api/home.js";
import {getPdfCopyWriting} from "@/api/user.js";

const newsList = ref([]);
const pdfCW = ref({
  area: 'home-video-mp4',
  title: '',
  copyWritingText: '',
  link: '',
  note: ''
})
onMounted(async () => {
  try {
    const res = await fetchHomeCarousel();
    if (res && res.length > 0) {
      newsList.value = res;
    }
    const pdfCWPromise = await getPdfCopyWriting({area: 'home-video-mp4'})
    if(pdfCWPromise){
      pdfCW.value = pdfCWPromise.data ? pdfCWPromise.data : pdfCWPromise;
    }
    if (pdfCW.value && pdfCW.value.link) {
      console.info('视频链接:', pdfCW.value.link);
    } else {
      // 兜底：保留初始 link，避免视频无法播放
      pdfCW.value.link = 'https://mpvideo.qpic.cn/0b2epudbsaagjqagypfk6bufm7oddf6qmgia.f10002.mp4?dis_k=d3366686da843bda625c511b9e7bbc18&dis_t=1757651990&play_scene=10120&auth_info=C/2XvawvG1dlo+OslwBTc0d7dTAEZkIQOghgOGscUjAyGHAxNAQAGhIjRQktb15TU3E=&auth_key=aec1185c26c4754b30960e937cfa5fab&vid=wxv_4136261317352931331&format_id=10002&support_redirect=0&mmversion=false';
    }
  } catch (err) {
    console.error('获取轮播文本失败:', err);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px;
}

.community-home {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.carousel-item-container.vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
  height: 100%;
}

.carousel-img-wrapper.vertical {
  width: 100%;
  min-height: 200px;
  max-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.carousel-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
}

.carousel-text-wrapper.vertical {
  text-align: center;
  padding: 0 20px;
}

.carousel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.carousel-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-section {
  background: #f6f7f9;

  color: #2c3e50;
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
  background-size: 200px 20px;
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 0 10px;
}

.community-logo {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 4px;
  margin: 0 auto;
}

.hero-right {
  flex: 1.8;
}

.hero-text {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.hero-title {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #2c3e50;
  max-width: 100%;
  margin: 0 auto 30px;
  line-height: 1.6;
}

.video-container {
  background-color: rgba(248, 249, 250, 0.95);
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.community-video {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0;
  min-height: 320px;
  object-fit: cover;
}


.modules-section {
  padding: 4rem 0;
  background-color: rgba(248, 249, 250, 0.55);
  position: relative;
}

.modules-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
}

.module-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.module-icon {
  margin-bottom: 1.5rem;
  color: #3498db;
  display: flex;
  justify-content: center;
  align-items: center;
}

.module-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.module-desc {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex: 1;
}

.module-btn {
  display: inline-block;
  background-color: #3498db;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin: 0 auto;
  align-self: center;
}

.module-btn:hover {
  background-color: #2980b9;
}

.footer .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

@media (max-width: 576px) {
  .carousel-img-wrapper.vertical {
    height: 150px;
  }

  .carousel-title {
    font-size: 16px;
  }

  .community-title {
    font-size: 2.5rem;
  }

  .hero-container {
    flex-direction: column;
    text-align: center;
  }

  .community-logo {
    width: 140px;
    height: 140px;
  }

  .module-card {
    padding: 1.5rem;
  }

  .modules-container {
    grid-template-columns: 1fr;
  }
}
</style>
