<template>
  <div class="community-home">
<!--    <div class="middle-content">-->
      <section class="hero-section">
        <div class="container hero-container">
          <img
              src="@/assets/img/dongshan.png"
              alt="东山社区Logo"
              class="community-logo"
              @error="handleLogoError"
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
                <source src="@/assets/img/23e771d0c2d3ef70e2be721b1446b3b5.mp4" type="video/mp4">
                您的浏览器不支持视频播放，请升级浏览器
              </video>
            </div>
          </div>
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
<!--  </div>-->
</template>

<script>
export default {
  name: 'DongshanCommunityHome',
  mounted() {
    console.log('东山社区首页加载完成');
  },
  methods: {
    handleLogoError(e) {
      e.target.src = '@/assets/img/backup-logo.png';
      e.target.alt = '东山社区默认Logo';
    }
  }
}
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

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap');
@font-face {
  font-family: 'Alibaba Sans';
  src: url('https://cdn.jsdelivr.net/npm/@alibaba/ailab-font@1.0.2/Alibaba-PuHuiTi-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

.community-home {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.middle-content {
  background-image: url('@/assets/img/global-bg2.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-clip: border-box;
  position: relative;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 2rem;
  z-index: 1;
}

.hero-section {

  background:
      repeating-radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 2px, transparent 10px),
      linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ffffff;
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
  color: rgba(255, 255, 255, 0.85);
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

@media (max-width: 992px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
  }

  .community-title {
    font-size: 3rem;
  }

  .modules-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .community-title {
    font-size: 2.5rem;
  }

  .community-logo {
    width: 140px;
    height: 140px;
  }

  .module-card {
    padding: 1.5rem;
  }
}
</style>
