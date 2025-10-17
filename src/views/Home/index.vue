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
<!--                      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">-->
<!--              <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">-->
<!--                面向东山的RISC-V开源生态基地-->
<!--              </span><br/>——东山社区-->
<!--                      </h1>-->
                      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight text-white text-right">
                        <span class="block mb-3 md:mb-4">面向东山的RISC-V开源生态基地</span>
                        <span class="block">——东山社区</span>
                      </h1>

                      <p class="text-lg md:text-xl text-white/80 mt-6" style="text-indent: 2em;">
                        社区集中呈现了山东大学在“东山集群”和“东山派”上已经适配和优化的开源软件、正在研发的开源项目等RISC-V资源，作为教学与科研资料供所有社区成员参考和使用。
                      </p>
                      <a
                          href="https://gitee.com/dongshan-community"
                          class="mt-8 inline-block bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-red-500/40"
                      >
                        Gitee社区
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
                      href="/project"
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
            <div class="relative w-full h-[600px] bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
              <div class="absolute inset-0 bg-black/30"></div>
              <div class="absolute -inset-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 opacity-20 blur-xl"></div>
              <div class="relative h-full flex items-center justify-center text-center text-white p-8">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-3xl">
                  <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">加入实习生计划</span><br />
                  </h1>
                  <p class="text-lg md:text-xl text-white/80 mt-6">
                    助力RISC-V生态任务落地，推动代码、文档、工具等成果的标准化与复用。
                  </p>
                  <a
                      href="/join-process"
                      class="mt-8 inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg shadow-primary/40"
                  >
                    成为实习生
                  </a>
                </div>
              </div>
            </div>
          </el-carousel-item>

          <!-- 设计稿主屏 4 -->
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

    <!-- 模块区：介绍 / 新闻 / 文档 / 资源镜像（右侧同列） -->
    <section class="pt-12 md:pt-16 pb-10 md:pb-12">
      <div class="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 社区介绍（大卡，左侧两列，纵跨三行） -->
        <!-- 左侧：社区介绍 + 开源贡献榜（上下分栏） -->
        <div class="lg:col-span-2 lg:row-span-3 grid grid-rows-2 gap-6 h-full">
          <!-- 上：社区介绍 -->
          <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
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

          <!-- 下：开源贡献榜介绍 -->
          <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-pink-500 rounded-full opacity-20 blur-2xl"></div>
            <div class="flex flex-col h-full">
              <div class="bg-gradient-to-r from-secondary to-amber-400 inline-block p-4 rounded-xl self-start">
                <span class="material-symbols-outlined text-white text-4xl">leaderboard</span>
              </div>
              <h3 class="text-3xl font-bold mt-6">开源贡献榜</h3>
              <p class="text-subtext-light mt-4 flex-grow">
                展示社区成员在各项目中的 PR、Issue、文档、翻译等多维度贡献热度与影响力，鼓励更多开发者参与共建。
              </p>

<!--              &lt;!&ndash; 小预览：前三名占位 &ndash;&gt;-->
<!--              <div class="mt-4 flex items-center gap-4">-->
<!--                <div class="flex -space-x-2">-->
<!--                  <img class="w-8 h-8 rounded-full border border-white/30" src="https://api.dicebear.com/7.x/identicon/svg?seed=alice" alt="avatar1">-->
<!--                  <img class="w-8 h-8 rounded-full border border-white/30" src="https://api.dicebear.com/7.x/identicon/svg?seed=bob" alt="avatar2">-->
<!--                  <img class="w-8 h-8 rounded-full border border-white/30" src="https://api.dicebear.com/7.x/identicon/svg?seed=carol" alt="avatar3">-->
<!--                </div>-->
<!--                <span class="text-xs text-subtext-light">实时统计 · 每日更新</span>-->
<!--              </div>-->

              <a href="https://gitee.com/dongshan-community/dongshan-contribution-list" class="inline-flex items-center mt-6 text-primary font-bold hover:underline">
                查看榜单 <span class="material-symbols-outlined ml-1">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 最新新闻（右列·行1） -->
        <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-5 md:p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
          <div class="absolute bottom-0 left-0 -mb-3 -ml-3 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"></div>
          <div class="flex flex-col items-start space-y-3">
            <!-- 头部：图标 + 标题（同行） -->
            <div class="flex items-center gap-3">
              <div class="bg-gradient-to-r from-secondary to-accent inline-block p-2.5 rounded-lg">
                <span class="material-symbols-outlined text-white text-2xl">campaign</span>
              </div>
              <h3 class="text-xl md:text-2xl font-bold">最新新闻</h3>
            </div>

            <!-- 描述仍为列布局 -->
            <p class="text-subtext-light text-sm">及时发布社区活动、技术动态与行业资讯。</p>
            <a href="https://sddx.huimaibuy.net/" class="text-primary font-bold hover:underline">前往查看</a>
          </div>
        </div>

        <!-- 技术文档（右列·行2，紧凑） -->
        <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-5 md:p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
          <div class="flex flex-col items-start space-y-3">
            <!-- 头部：图标 + 标题（同行） -->
            <div class="flex items-center gap-3">
              <div class="bg-gradient-to-r from-accent to-green-400 inline-block p-2.5 rounded-lg">
                <span class="material-symbols-outlined text-white text-2xl">description</span>
              </div>
              <h3 class="text-xl md:text-2xl font-bold">技术文档</h3>
            </div>

            <!-- 描述仍为列布局 -->
            <p class="text-subtext-light text-sm">提供完善的开发指南、API 参考与教程。</p>
            <a href="/docs" class="text-primary font-bold hover:underline">查看文档</a>
          </div>
        </div>

        <!-- 资源镜像（右列·行3，紧凑） -->
        <div class="relative bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-5 md:p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
          <div class="flex flex-col items-start space-y-3">
            <!-- 头部：图标 + 标题（同行） -->
            <div class="flex items-center gap-3">
              <div class="bg-gradient-to-r from-primary to-cyan-400 inline-block p-3 rounded-xl">
                <!-- 如需更贴切可把 description 改成 cloud_download -->
                <span class="material-symbols-outlined text-white text-2xl">description</span>
              </div>
              <h3 class="text-xl md:text-2xl font-bold">资源镜像</h3>
            </div>

            <!-- 描述仍为列布局 -->
            <p class="text-subtext-light text-sm">提供开源软件、开发工具、系统镜像等资源的国内高速下载，优化开发者资源获取体验，加速开发进程。</p>
            <a href="/mirror" class="text-primary font-bold hover:underline">查看镜像</a>
          </div>
        </div>
      </div>
    </section>


    <!-- 项目板块 -->
    <section class="pt-6 md:pt-8 pb-10">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold mb-4">
          <span class="gradient-text">热门开源项目板块</span>
        </h2>
        <p class="text-lg text-subtext-light max-w-2xl mx-auto">聚合高热度仓库，助你快速上手并提交PR。</p>
      </div>

      <div class="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">FASE，FPGA-Assisted Syscall Emulation</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月1日</p>
            <p class="mt-3 text-sm">基于FPGA加速目标硬件运行用户模式模拟</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/project/3" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看详情 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">RISC-V生态标准化-BSA</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月1日</p>
            <p class="mt-3 text-sm">针对RISC-V生态中的硬件架构进行测试，构建RISC-V BSA测试体系，其针对RISC-V SOC ISA与外设标准进行测试，明确每一个硬件可以执行的环境。</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/project/7" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看详情 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">舜华OS</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月1日</p>
            <p class="mt-3 text-sm">分“舜华OS”是山东大学自主研发的面向AI大模型优化的操作系统，专注于对主流架构（x86、ARM、RISC-V）的AI能力支持。</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/project/1" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看详情 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">AI Benchmark</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月20日</p>
            <p class="mt-3 text-sm">AI Benchmark使用AI各领域经典深度学习模型集合对不同的硬件平台进行性能测试，硬件平台包括Nvidia、AMD的GPU、Sophgo的TPU（单卡）等。</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/project/8" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看详情 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
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
            <h3 class="text-xl font-bold">开源入门教学</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月1日 | 线上</p>
            <p class="mt-3 text-sm">从零开始了解“开源”。</p>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">技术分享</span>
            <a href="/openDocs" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
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
            <h3 class="text-xl font-bold">东山派教程</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月</p>
            <p class="mt-3 text-sm">分享东山派的产品介绍与使用</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/dspDocs" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              加入学习 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-background-light/70 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold">赛事活动</h3>
            <p class="text-subtext-light text-sm mt-2">2025年10月21日 | 线下·济南</p>
            <p class="mt-3 text-sm">聚焦RISC-V与开源数据库的全新议题</p>
          </div>
          <div class="mt-4 flex justify-end">
            <a href="/events/riscv_sql_1" class="inline-flex items-center text-primary text-sm font-bold hover:underline">
              查看活动 <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
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
import videoFile from '@/assets/img/dongshan-2min.mp4'
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
