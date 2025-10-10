<template>
  <div class="relative min-h-screen">
    <!-- Subtle background -->
    <div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <!-- Hero -->
      <header class="hero text-center">
        <h1
            class="main-title"
        >
          如何加入东山 · 远程实习生计划
        </h1>
      </header>

      <!-- Card -->
      <div
          class="mt-8 rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-xl ring-1 ring-black/5"
      >
        <div class="p-6 sm:p-8 lg:p-10 space-y-10">
          <!-- STEP 1 -->
          <section class="step step-card scroll-mt-24" id="step-1">
            <h2 class="step-title">第一步</h2>
            <div class="step-body">
              <p>
                登录东山社区网站，并创建用户：
                <a
                    href="https://www.riscv-cn.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link"
                >https://www.riscv-cn.org/</a>
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_6.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_5.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_4.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
            </div>
          </section>

          <!-- STEP 2 -->
          <section class="step step-card scroll-mt-24" id="step-2">
            <h2 class="step-title">第二步</h2>
            <div class="step-body">
              <p>完善「个人信息」，选择成为「实习生」。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_3.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
              <p class="mt-4">
                跳转并下载「实习协议.PDF」，请同学们完善相关个人信息，并签署个人姓名和时间，将「实习协议.PDF」发送至邮箱：
                <a href="mailto:dssq_sdu@163.com" class="link">dssq_sdu@163.com</a>。
                社区签署执行人姓名后，我们会将实习协议通过电子邮件寄回，用于双方保存。
              </p>
              <p class="mt-3">同时为了确保贡献者和津贴发放对象一致，请附上以下两个文件：</p>
              <ul class="mt-2 list-disc pl-5 text-slate-700">
                <li>① 身份证正反面，标准「仅用于注册东山远程实习生计划」。</li>
                <li>② 近三个月的照片一张。</li>
              </ul>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_1.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_2.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_14.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
              <p class="mt-4">此时，个人身份状态将更改为「实习生」。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_13.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
            </div>
          </section>

          <!-- STEP 3 -->
          <section class="step step-card scroll-mt-24" id="step-3">
            <h2 class="step-title">第三步</h2>
            <div class="step-body">
              <p>查看「实习生教学计划概述」，内容涵盖津贴、荣誉奖励等内容。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_11.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_12.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
              <p class="mt-4">接下来，你就可以领取「实习生任务」了。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_10.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
            </div>
          </section>

          <!-- STEP 4 -->
          <section class="step step-card scroll-mt-24" id="step-4">
            <h2 class="step-title">第四步</h2>
            <div class="step-body">
              <p>
                每个任务的 Pull Requests 提交将通过 Gitee 平台完成。请关注 Gitee 东山社区，申请加入组织，成为开发者。
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_7.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_8.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/doc_image_9.png" alt="文档图片" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>
              <p class="mt-4">Gitee 的具体使用方法，见东山社区网站首页的活动板块——开源入门。（附件）</p>
            </div>
          </section>

          <!-- STEP 5 -->
          <section class="step step-card scroll-mt-24" id="step-5">
            <h2 class="step-title">第五步</h2>
            <div class="step-body">
              <p>
                按照链接中的任务要求，完成提交个人代码到东山社区，就正式加入东山社区啦！
              </p>
              <p class="mt-1">
                <a
                    href="https://gitee.com/dongshan-community/welcome-to-dongshan-community"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link"
                >https://gitee.com/dongshan-community/welcome-to-dongshan-community</a>
              </p>
              <p class="mt-3">
                在这里你的每次提交都将被认真对待，经过社区的技术委员会审核完成后，我们将对并入主线的贡献者发放津贴和荣誉奖励，以感谢大家的辛勤贡献！最后，再次诚挚地邀请同学们加入我们！
              </p>
            </div>
          </section>

          <!-- STEP 6 -->
          <section class="step step-card scroll-mt-24" id="step-5">
            <h2 class="step-title">第六步</h2>
            <div class="step-body">
              <p>
                完成实习任务后，你可以随时申请实习证明，发送至邮箱<a href="mailto:dssq_sdu@163.com" class="link">dssq_sdu@163.com</a>。，内容如下：
              </p>
              <p class="mt-3">
                申请实习证明：姓名、东山社区用户名称、Gitte用户名称。
              </p>

              <div class="img-grid mt-4">
                <img src="@/assets/img/shixizhengming-1.jpg" alt="实习证明模板正面" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
                <img src="@/assets/img/shixizhengming-2.jpg" alt="实习证明模板背面" class="doc-img" @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览" />
              </div>

              <p class="mt-3 text-red-600 font-semibold">
                为保证实习证明信息准确，请务必提供准确的Gitte用户名称。
              </p>
            </div>
          </section>

          <!-- Downloads (inside main card) -->
          <section class="step step-card scroll-mt-24" aria-labelledby="downloads">
            <h2 id="downloads" class="step-title">资料下载</h2>
            <ul class="dl-list">
              <li v-for="att in attachments" :key="att.url" class="dl-item">
                <div class="dl-meta">
                  <span class="dl-label">{{ att.label }}：</span>
                  <span class="dl-name">{{ att.name }}</span>
                </div>
                <div class="dl-actions">
                  <a :href="att.url" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">在线查看</a>
                  <a :href="att.url" :download="att.name" class="btn btn-solid">附件下载</a>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <!-- Lightbox overlay -->
    <transition name="fade">
      <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closeLightbox"
          aria-modal="true"
          role="dialog"
      >
        <img
            :src="lightboxSrc"
            alt="预览图片"
            class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl ring-1 ring-white/20"
        />
        <button
            class="absolute top-5 right-5 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg ring-1 ring-slate-200"
            @click="closeLightbox"
            aria-label="关闭预览"
        >
          ✕
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 实习协议 PDF 地址（放在 public/docs/ 目录或换成你的线上地址）
const AGREEMENT_URL = '/docs/实习协议.pdf'

// 下载清单（可自行增删）
interface Attachment { label: string; name: string; url: string }
const attachments: Attachment[] = [
  { label: '附件一', name: '实习协议.PDF', url: AGREEMENT_URL },
  // { label: '附件二', name: '开源入门.pdf', url: '/docs/开源入门.pdf' },
]

// 图片预览（灯箱）
const lightboxOpen = ref(false)
const lightboxSrc = ref<string>('')

function openLightbox(src: string) {
  if (!src) return
  lightboxSrc.value = src
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function onImgClick(e?: Event) {
  const el = (e?.currentTarget || e?.target) as HTMLImageElement | undefined
  const src = el?.currentSrc || el?.src
  if (src) openLightbox(src)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* ---- 通用排版 ---- */
.hero :where(h1) {
  letter-spacing: -0.02em;
}

.main-title{
  margin: 24px 0 16px;
  color: #1e293b;
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(to right, #0ea5e9, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 链接样式：沉稳又可见 */
.link {
  color: rgb(30 41 59);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.2s ease;
}
.link:hover {
  opacity: 0.8;
}

/* ---- Step 标题适配（多端尺寸 & 统一格式） ---- */
.step-title {
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: rgb(15 23 42);
  font-size: 1.25rem; /* text-xl */
}
@media (min-width: 640px) {
  .step-title {
    font-size: 1.5rem; /* sm:text-2xl */
  }
}
@media (min-width: 1024px) {
  .step-title {
    font-size: 1.875rem; /* lg:text-3xl */
  }
}

/* ---- Step 卡片：左侧渐变导引线 + 内部层次 ---- */
.step-card {
  position: relative;
  padding-left: 1rem; /* 给导引线留空 */
}
.step-card::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 9999px;
  background: linear-gradient(180deg, #34d399 0%, #60a5fa 100%);
  opacity: 0.9;
}
.step-body {
  margin-top: 0.75rem; /* 与标题分隔 */
  color: rgb(51 65 85);
}
.step-body p {
  line-height: 1.75;
}

/* ---- 图片网格 ---- */
.img-grid {
  display: grid;
  gap: 1rem;
}
@media (min-width: 640px) {
  /* sm */
  .img-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  /* lg */
  .img-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* 单图在小屏默认占满，在网格中优雅排列 */
.doc-img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 10px 25px rgba(2, 6, 23, 0.1);
  border: 1px solid rgba(2, 6, 23, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #fff;
  cursor: zoom-in;
  user-select: none;
  outline: none;
}
.doc-img:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.12);
}
.doc-img:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.6), 0 10px 25px rgba(2, 6, 23, 0.1);
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (min-width: 1280px) { /* xl */
  .img-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* 资料下载列表 */
.dl-list { margin-top: .5rem; display: grid; gap: 12px; }
.dl-item { display:flex; align-items:center; justify-content:space-between; gap: 12px;
  padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(2,6,23,.06);
  background: #fff; box-shadow: 0 6px 16px rgba(2,6,23,.06); }
.dl-meta { display:flex; align-items:center; gap: 8px; color:#0f172a; font-weight: 600; }
.dl-label { color:#334155; font-weight: 700; }
.dl-name { color:#0f172a; font-weight: 600; }
.dl-actions { display:flex; gap: 8px; flex-shrink: 0; }

.btn { display:inline-flex; align-items:center; justify-content:center; border-radius: 10px;
  padding: 8px 14px; font-size: 14px; line-height: 1; }
.btn-ghost { border: 1px solid rgba(2,6,23,.12); background: #fff; color:#0f172a; }
.btn-ghost:hover { background:#f8fafc; }
.btn-solid { background:#0f172a; color:#fff; border: 1px solid rgba(15,23,42,.8); }
.btn-solid:hover { background:#111827; }

@media (max-width: 640px) {
  .dl-item { flex-direction: column; align-items: flex-start; }
  .dl-actions { width: 100%; }
  .dl-actions .btn { width: 100%; }
}

</style>
