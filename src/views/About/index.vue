<script setup>
import {onMounted, ref} from 'vue';
import {fetchAboutText} from '@/api/about'

const aboutText = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    aboutText.value = await fetchAboutText({area: 'about-text'});
  } catch (err) {
    console.error('获取关于我们文本失败:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="about-container">
    <div class="about-content">
      <div class="title-wrapper">
        <div class="about-title">关于我们</div>
        <div class="title-watermark">About us</div>
      </div>
      <div class="watermark-main">东山社区</div>
      <div class="about-text" v-if="!loading">
        <p>
          {{ aboutText }}
        </p>
      </div>
      <!-- 加载状态 -->
      <div class="loading" v-else-if="loading">加载中...</div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
}

.about-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.title-wrapper {
  position: relative;
  margin-bottom: 30px;
  text-align: center;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.about-title {
  font-size: 32px;
  color: #333333;
  margin: 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  position: relative;
  z-index: 2;
  line-height: 1;
}

.title-watermark {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 60px;
  font-weight: 200;
  color: #f0f0f0;
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  line-height: 1;
  width: 100%;
  max-width: 200px;
}

.watermark-main {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 140px;
  font-weight: 200;
  color: #f0f0f0;
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  opacity: 0.9;
}

.about-text {
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
  position: relative;
  z-index: 2;
  margin-top: 20px;
}

.about-text p {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .watermark-main {
    font-size: 100px;
  }

  .title-watermark {
    font-size: 40px;
    bottom: 12px;
    max-width: 160px;
  }

  .about-title {
    font-size: 26px;
    padding-bottom: 12px;
  }

  .title-wrapper {
    height: 50px;
  }

  .about-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .watermark-main {
    font-size: 60px;
  }

  .title-watermark {
    font-size: 30px;
    bottom: 10px;
    max-width: 130px;
  }

  .about-title {
    font-size: 22px;
    padding-bottom: 10px;
  }

  .title-wrapper {
    height: 40px;
  }

  .about-container {
    padding: 30px 15px;
  }
}
</style>