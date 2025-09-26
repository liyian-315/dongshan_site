<script setup>
import { ref } from 'vue';
import image1 from '@/assets/img/organization.png';
import image2 from '@/assets/img/flowchart.png';

const aboutText1 = ref(`欢迎来到东山社区！`);
const aboutText2 = ref(`东山社区由山东大学发起，是面向东山的 RISC-V 开源生态基地。社区集中呈现了山东大学在“东山集群”和“东山派”上已经适配和优化的开源软件、正在研发的开源项目等 RISC-V 资源，作为教学与科研资料供所有社区成员参考和使用，协力构建以人才培养为核心的开源创新生态，建立 RISC-V 人才储备库，为产学研合作输送优质开源技术人才。`);
const aboutText3 = ref(`同时，为进一步优化上述开源资源和 RISC-V 课程体系，助力“东山计划”吸引更多人才与智慧，构建开放、共享、创新的技术社群，我们发起了“东山—远程实习生计划”，鼓励同学们学有余力时实现从知识学习者到开源贡献者的转变，投身到东山社区发布的开源课程共建和开源项目优化中来，成为 RISC-V 开源生态的共建者与受益者。社区会针对成员对项目的贡献进行价值评估并发放奖励津贴。`);

</script>

<template>
  <div class="about-container">
    <div class="about-content">
      <div class="title-wrapper">
        <div class="about-title">面向东山的 RISC-V 开源生态基地——东山社区</div>
        <div class="title-watermark">About us</div>
      </div>
      <div class="watermark-main">东山社区</div>
      <div class="about-text">
        <p>{{ aboutText1 }}</p>
        <p>{{ aboutText2 }}</p>
        <p>{{ aboutText3 }}</p>
      </div>
      <div class="image-gallery">
        <figure>
          <img :src="image1" alt="组织架构图" />
          <figcaption>组织架构图</figcaption>
        </figure>
        <figure>
          <img :src="image2" alt="基本流程图" />
          <figcaption>基本流程图</figcaption>
        </figure>
      </div>
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
  top: 2%;
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

.image-gallery {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.image-gallery figure {
  margin: 0;
  text-align: center;
}

.image-gallery img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.image-gallery figcaption {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
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