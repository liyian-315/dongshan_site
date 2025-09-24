<template>
  <div class="community-home bg-background-light text-text-light min-h-screen noise-bg">
    <!-- Hero / 轮播 -->
    <section class="relative overflow-hidden">
      <!-- 轻微彩色光晕 -->
      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl pointer-events-none"></div>

      <div class="container mx-auto px-4 relative z-10">
        <el-carousel
            height="600px"
            :autoplay="true"
            :interval="5000"
            arrow="hover"
            trigger="click"
            class="rounded-2xl overflow-hidden shadow-2xl"
        >
          <!-- 视频主屏（保持玻璃+渐变风格） -->
          <el-carousel-item>
            <div class="relative w-full h-[600px]">
              <!-- 背景光晕 -->
              <div class="absolute -inset-4 bg-gradient-to-br from-rose-700 via-red-600 to-rose-500 opacity-20 blur-2xl"></div>
              <div class="absolute inset-0 bg-black/20"></div>

              <div class="relative h-full flex items-center">
                <div class="container mx-auto px-6 w-full">
                  <div class="grid lg:grid-cols-2 gap-8 items-center">
                    <!-- 左：文案 -->
                    <div class="text-white">
                      <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                探索开源技术的
              </span><br/>无限可能
                      </h1>
                      <p class="text-lg md:text-xl text-white/80 mt-6">
                        东山社区是面向未来的 RISC-V / GPGPU 开源生态协作平台，致力于构建开放、共享、创新的技术社群。
                      </p>
                      <a
                          href="/join"
                          class="mt-8 inline-block bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-red-500/40"
                      >
                        加入我们
                      </a>
                    </div>

                    <!-- 右：视频 -->
                    <div class="w-full">
                      <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-2xl">
                        <video
                            class="w-full aspect-video rounded-xl"
                            :src="videoSrc"
                            controls
                            autoplay
                            loop
                            muted
                            playsinline
                            preload="auto"
                            :poster="videoPoster"
                        >
                          您的浏览器不支持视频播放
                        </video>
                      </div>
                      <p v-if="pdfCW.note" class="text-white/70 text-xs mt-2 line-clamp-1">
                        {{ pdfCW.note }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>


          <!-- 设计稿主屏 1 -->
          <el-carousel-item>
            <div class="relative w-full h-[600px] bg-[url('https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
              <div class="absolute inset-0 bg-black/30"></div>
              <div class="absolute -inset-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 opacity-20 blur-xl"></div>
              <div class="relative h-full flex items-center justify-center text-center text-white p-8">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-3xl">
                  <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">东山计划</span><br />推动RISC-V教学发展
                  </h1>
                  <p class="text-lg md:text-xl text-white/80 mt-6">
                    东山计划旨在构建从基础教育到高等教育的全阶段RISC-V人才培养体系。
                  </p>
                  <a
                      href="/activity/dongshanjihua"
                      class="mt-8 inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-primary/40"
                  >
                    查看详情
                  </a>
                </div>
              </div>
            </div>
          </el-carousel-item>

          <!-- 设计稿主屏 2 -->
          <el-carousel-item>
            <div class="relative w-full h-[600px] bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="absolute -inset-4 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-20 blur-xl"></div>
              <div class="relative h-full flex items-center justify-center text-center text-white p-8">
                <div class="bg-black/20 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-3xl">
                  <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">探索前沿</span><br />开源项目
                  </h1>
                  <p class="text-lg md:text-xl text-white/80 mt-6">
                    发现和贡献最新的开源项目，从人工智能到区块链，应有尽有。
                  </p>
                  <a
                      href="/lab"
                      class="mt-8 inline-block bg-gradient-to-r from-accent to-primary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-accent/40"
                  >
                    浏览项目
                  </a>
                </div>
              </div>
            </div>
          </el-carousel-item>

          <!-- 设计稿主屏 3 -->
          <el-carousel-item>
            <div class="relative w-full h-[600px] bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
              <div class="absolute inset-0 bg-black/30"></div>
              <div class="absolute -inset-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 opacity-20 blur-xl"></div>
              <div class="relative h-full flex items-center justify-center text-center text-white p-8">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-3xl">
                  <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">共享知识</span><br />共创未来
                  </h1>
                  <p class="text-lg md:text-xl text-white/80 mt-6">
                    加入技术分享会、研讨会和黑客马拉松，与全球开发者共同成长。
                  </p>
                  <a
                      href="/events"
                      class="mt-8 inline-block bg-gradient-to-r from-secondary to-accent text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-secondary/40"
                  >
                    查看活动
                  </a>
                </div>
              </div>
            </div>
          </el-carousel-item>

          <!-- 动态新闻扩展屏 -->
          <el-carousel-item v-for="(item, idx) in newsList" :key="`news-${idx}`">
            <div
                class="relative w-full h-[600px] bg-cover bg-center"
                :style="{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop'})` }"
            >
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="relative h-full flex items-center justify-center text-center text-white p-8">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-3xl">
                  <h3 class="text-3xl md:text-4xl font-extrabold leading-tight">{{ item.title }}</h3>
                  <p class="text-white/80 mt-4 md:text-lg line-clamp-3">{{ item.context }}</p>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- 模块区：介绍 / 新闻 / 文档 / 资源镜像（宽） -->
    <section class="pt-12 md:pt-16 pb-10 md:pb-12">
      <div class="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 社区介绍（大卡） -->
        <div class="lg:col-span-2 lg:row-span-2 relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full opacity-20 blur-2xl"></div>
          <div class="flex flex-col h-full">
            <div class="bg-gradient-to-r from-primary to-accent inline-block p-4 rounded-xl self-start">
              <span class="material-symbols-outlined text-white text-4xl">hub</span>
            </div>
            <h3 class="text-3xl font-bold mt-6">社区介绍</h3>
            <p class="text-subtext-light mt-4 flex-grow">
              东山社区是面向开发者的开放社区，致力于帮助开发者交流内容、构建完善的开源生态体系，为开发者提供一个充满活力、资源丰富的学习、交流与合作平台。
            </p>
            <a href="/about" class="inline-flex items-center mt-6 text-primary font-bold hover:underline">
              了解更多 <span class="material-symbols-outlined ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <!-- 最新新闻 -->
        <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"></div>
          <div class="flex flex-col items-start space-y-4">
            <div class="bg-gradient-to-r from-secondary to-accent inline-block p-3 rounded-lg">
              <span class="material-symbols-outlined text-white text-3xl">campaign</span>
            </div>
            <h3 class="text-2xl font-bold">最新新闻</h3>
            <p class="text-subtext-light text-sm">及时发布社区活动、技术动态与行业资讯。</p>
            <a href="https://sddx.huimaibuy.net/" class="text-primary font-bold hover:underline">前往查看</a>
          </div>
        </div>

        <!-- 技术文档 -->
        <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="flex flex-col items-start space-y-4">
            <div class="bg-gradient-to-r from-accent to-green-400 inline-block p-3 rounded-lg">
              <span class="material-symbols-outlined text-white text-3xl">description</span>
            </div>
            <h3 class="text-2xl font-bold">技术文档</h3>
            <p class="text-subtext-light text-sm">提供完善的开发指南、API 参考与教程。</p>
            <a href="/docs" class="text-primary font-bold hover:underline">查看文档</a>
          </div>
        </div>

        <!-- 资源镜像（整行） -->
        <div class="lg:col-span-3 relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div class="absolute bottom-0 right-0 -mb-6 -mr-6 w-28 h-28 bg-gradient-to-br from-indigo-500 to-cyan-300 rounded-full opacity-10 blur-2xl"></div>
          <div class="flex flex-col md:flex-row items-start md:items-center md:space-x-6 space-y-4 md:space-y-0">
            <div class="bg-gradient-to-r from-primary to-cyan-400 inline-block p-4 rounded-xl">
              <span class="material-symbols-outlined text-white text-4xl">cloud_download</span>
            </div>
            <div class="flex-grow">
              <h3 class="text-2xl font-bold">资源镜像</h3>
              <p class="text-subtext-light mt-1">
                提供开源软件、开发工具、系统镜像等资源的国内高速下载，优化开发者资源获取体验，加速开发进程。
              </p>
            </div>
            <a
                href="/mirror"
                class="inline-block bg-primary/20 text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary/30 transition"
            >
              前往下载
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 活动板块 -->
    <section class="pt-6 md:pt-8 pb-10">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold mb-4">
          <span class="gradient-text">活动板块</span>
        </h2>
        <p class="text-lg text-subtext-light max-w-2xl mx-auto">参与我们丰富多彩的线上线下活动，与技术大牛面对面交流。</p>
      </div>

      <div class="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">年度开发者大会</h3>
            <p class="text-subtext-light text-sm mt-2">2024年12月15日 | 线上直播</p>
            <p class="mt-3 text-sm">汇聚全球顶尖开发者，分享最新技术趋势，共同探讨开源未来。</p>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">技术分享</span>
            <a href="#event-1" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看详情 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">东山教学计划</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月1日</p>
            <p class="mt-3 text-sm">覆盖从基础到高级全年级的教学计划</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/activity/dongshanjihua" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看详情 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">AI大模型应用实践</h3>
            <p class="text-subtext-light text-sm mt-2">每周三晚 8:00</p>
            <p class="mt-3 text-sm">系列线上分享会，深入浅出地讲解大模型应用开发。</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="#event-3" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              加入学习 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">开源操作系统内核研讨会</h3>
            <p class="text-subtext-light text-sm mt-2">2024年10月20日 | 线下·北京</p>
            <p class="mt-3 text-sm">与内核专家深入交流，探讨操作系统核心技术的最新进展。</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="#event-4" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看议程 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 悬浮咨询按钮 -->
    <button
        class="fixed bottom-8 right-8 bg-gradient-to-tr from-purple-500 to-cyan-400 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        aria-label="咨询"
    >
      <span class="material-symbols-outlined text-3xl">forum</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'
import videoFile from '@/assets/img/dongshan-video.mp4'
// import posterFile from '@/assets/img/video-cover.png' // 可选本地封面
// 视频配置
import { getPdfCopyWriting } from '@/api/user.js'

const newsList = ref([])

// 视频文案/链接
const pdfCW = ref({
  area: 'home-video-mp4',
  title: '',
  copyWritingText: '',
  link: '',
  note: ''
})

// 视频地址 & 海报
const videoSrc = ref(videoFile)

const videoPoster = ref('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop')

// 兜底：来自你提供的示例链接
const FALLBACK_VIDEO =
    'https://mpvideo.qpic.cn/0b2epudbsaagjqagypfk6bufm7oddf6qmgia.f10002.mp4?dis_k=d3366686da843bda625c511b9e7bbc18&dis_t=1757651990&play_scene=10120&auth_info=C/2XvawvG1dlo+OslwBTc0d7dTAEZkIQOghgOGscUjAyGHAxNAQAGhIjRQktb15TU3E=&auth_key=aec1185c26c4754b30960e937cfa5fab&vid=wxv_4136261317352931331&format_id=10002&support_redirect=0&mmversion=false'

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
/* 调整 Element Plus 轮播圆角 */
:deep(.el-carousel){ border-radius: 1rem; }
:deep(.el-carousel__container){ border-radius: 1rem; }

</style>
