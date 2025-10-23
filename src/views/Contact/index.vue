<template>
  <div class="contact-page">
    <section class="hero-section">
      <div class="hero-bg"></div>
      <img
          src="https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/4fe8902c858744d1b1be1abcf7ddc8fa~tplv-a9rns2rl98-image.image?rcl=20251023144832761A345866539C19529F&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1763794135&x-signature=1g4uTIZyjNpsVeEta6UjC0%2Bj%2BtM%3D"
          alt="背景图"
          class="hero-img"
      >
      <div class="hero-content">
        <h1>联系我们</h1>
        <p>CONTACT US</p>
      </div>
    </section>

    <div class="breadcrumb">
      <RouterLink to="/" class="breadcrumb-link">首页</RouterLink>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">联系我们</span>
    </div>

    <div class="main-container">
      <div class="contact-card">
        <div class="contact-content">
          <h2 class="contact-title">联系我们</h2>
          <p class="contact-desc">
            如有问题请发邮件联系我们，我们将尽快与您联系。
          </p>
          <div class="email-container">
            <p href="mailto:dssq_sdu@163.com" class="email-link">
              <svg class="email-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              dssq_sdu@163.com
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'ContactPage',
  components: {
    RouterLink
  }
}
</script>

<style scoped>
.contact-page {
  width: 100%;
}

.hero-section {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-section {
    height: 300px;
  }
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: rgba(153, 27, 27, 0.8);
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 10;
  padding: 0 16px;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.hero-content p {
  font-size: 1.25rem;
  opacity: 0.9;
}

@media (min-width: 768px) {
  .hero-content h1 {
    font-size: 3.125rem;
  }

  .hero-content p {
    font-size: 1.5rem;
  }
}

.breadcrumb {
  padding: 12px 16px;
  background-color: white;
  font-size: 0.875rem;
  color: #6b7280;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 1px;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #b91c1c;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-current {
  color: #374151;
}


.main-container {
  padding: 40px 16px;
  background-color: #f9f7f8;
}

.contact-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 30px;
  max-width: 512px;
  margin: 0 auto;
}

.contact-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #991b1b;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #fee2e2;
}

.contact-desc {
  color: #374151;
  margin-bottom: 24px;
  line-height: 1.6;
}

.email-container {
  margin-bottom: 16px;
}

.email-link {
  color: #b91c1c; /* red-700 */
  font-size: 1.125rem;
  font-weight: 500;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.email-link:hover {
  color: #7f1d1d; /* red-900 */
}

.email-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>