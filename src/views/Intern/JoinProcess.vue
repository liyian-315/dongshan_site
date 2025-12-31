<template>
  <div class="relative min-h-screen">
    <!-- Subtle background -->
    <div
        class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>

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
            <h2 class="step-title">第一步 个人注册</h2>
            <div class="step-body">
              <p>
                同学们先登录东山社区网站
                <a
                    href="https://www.riscv-cn.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link"
                >https://www.riscv-cn.org/</a>
                ，并创建个人用户吧
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_6.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_5.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_4.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
            </div>
          </section>

          <!-- STEP 2 -->
          <section class="step step-card scroll-mt-24" id="step-2">
            <h2 class="step-title">第二步 协议签署</h2>
            <div class="step-body">
              <p>接下来，完善大家的“个人信息”，并选择立即加入“实习生”。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_3.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
              <p class="mt-4">
                跳转并下载附件一：“实习协议.PDF”，请同学们完善“乙方信息”，并在最后手动签署个人姓名和时间。
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_1.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_2.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
              <p class="mt-4">
                填好后，请大家将「实习协议.PDF」发送至邮箱：
                <a href="mailto:dssq_sdu@163.com" class="link">dssq_sdu@163.com</a>。
                社区执行人签署完成后，我们会将“实习协议.PDF”通过电子邮件寄回，用于双方保存。
              </p>
              <p class="mt-3">注意啦，为了确保贡献者和津贴发放对象一致，请附上以下文件：</p>
              <ul class="mt-2 list-disc pl-5 text-slate-700">
                <li>① 身份证正反面，标准「仅用于注册东山远程实习生计划」。</li>
                <li>② 近三个月的照片一张。</li>
              </ul>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_14.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_15.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
              <p class="mt-4 flex items-center flex-wrap">
                此时，大家的个人身份状态就会更改为“实习生”啦，记得把gitee信息也更新上哦，这样后续可以给大家统计个人成果！
                <span
                    class="link cursor-pointer ml-1"
                    @click="goToPersonInfo"
                    tabindex="0"
                    @keydown.enter.prevent="goToPersonInfo"
                    @keydown.space.prevent="goToPersonInfo"
                    aria-label="点击完善个人Gitee名称"
                >
                  点击此处完善个人Gitee名称
                </span>
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_13.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
              <p class="mt-3">
                对了！如果大家想要参与社区的“东山派”任务，需要用到“东山派”硬件设备，请大家同步下载填写附件二：“东山派开发板借用协议”，并发送至邮箱：
                <a href="mailto:dssq_sdu@163.com" class="link">dssq_sdu@163.com</a>。
                我们会根据申请地址为你寄出开发套件。
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_16.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_17.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_18.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
            </div>
          </section>

          <!-- STEP 3 -->
          <section class="step step-card scroll-mt-24" id="step-3">
            <h2 class="step-title">第三步 领取任务</h2>
            <div class="step-body">
              <p>在领取任务之前，我们先一起看看“远程实习生教学计划概述”吧，这部分详细说明了同学们关心的
                <span style="color: red;">津贴、荣誉奖励</span>
                等内容，一定要多多关注哦。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_11.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
              <p class="mt-4">接下来，同学们就可以领取“实习生任务”啦。</p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_10.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
            </div>
          </section>

          <!-- STEP 4 -->
          <section class="step step-card scroll-mt-24" id="step-4">
            <h2 class="step-title">第四步 加入社区</h2>
            <div class="step-body">
              <p>
                同学们要注意啦，东山社区每项任务的Pull Requests提交都通过Gitee平台完成。
              </p>
              <p>
                所以大家要提前学会使用Gitee，我们也为大家准备了超详细的攻略，快到东山社区网站首页的最下面的活动板块
                <span style="color: red;">“开源入门教学”里学习吧！</span>
              </p>
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_7.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
              <p class="mt-4">同学们需要关注
                <span style="color: red;">Gitee东山社区</span>
                ，申请加入组织，成为开发者。</p>
              <p class="mt-4">为了帮助大家更熟练地使用Gitee，我们为大家设置了一个很简单的任务：
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
              <div class="img-grid mt-4">
                <img src="@/assets/img/doc_image_9.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/doc_image_8.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                     @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)"
                     tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>
            </div>
          </section>

          <!-- STEP 5 -->
          <section class="step step-card scroll-mt-24" id="step-5">
            <h2 class="step-title">第五步 提交任务</h2>
            <div class="step-body">
              <p>
                大家掌握了Gitee的基本技能之后，就可以大展拳脚了！
              </p>
              <p>
                现在我们进一步了解如何完成任务吧。
              </p>
              <p>
                以“课程类任务——C语言程序设计”为例，大家在东山社区官网领取任务后，点击“查看详情”，就可以浏览任务描述，了解任务目标、截止时间等信息。
              </p>
            </div>
            <div class="img-grid mt-4">
              <img src="@/assets/img/doc_image_19.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                   @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0"
                   role="button" aria-label="点击放大预览"/>
              <img src="@/assets/img/doc_image_20.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                   @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0"
                   role="button" aria-label="点击放大预览"/>
              <img src="@/assets/img/doc_image_21.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                   @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0"
                   role="button" aria-label="点击放大预览"/>
            </div>
            <p class="mt-4">
              实际上，此时我们已经完成了任务流程的前两个步骤，可以跳转到第三步了：Gitee东山社区上查看任务的详细题目
            </p>
            <div class="img-grid mt-4">
              <img src="@/assets/img/doc_image_22.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                   @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0"
                   role="button" aria-label="点击放大预览"/>
            </div>
            <p class="mt-4">
              我们会邀请社区技术老师和同学们针对领取的任务进行交流，对实习生的任务参与资格进行预审。
            </p>
            <p>
              审核通过后，同学们就可以进一步完成项目啦。
            </p>
            <p>
              最终，同学们需要在Gitee上提交自己的最终成果PR，还要记得在东山社区官网提交一份PDF版本的报告书哦。
            </p>
            <div class="img-grid mt-4">
              <img src="@/assets/img/doc_image_23.png" alt="文档图片" class="doc-img" @click="onImgClick($event)"
                   @keydown.enter.prevent="onImgClick($event)" @keydown.space.prevent="onImgClick($event)" tabindex="0"
                   role="button" aria-label="点击放大预览"/>
            </div>
            <p class="mt-4">
              如果大家希望把自己的成果修改发布为论文、知乎等内容，为避免版权纠纷，请大家下载附件三：《成果发布请求模板》，提交到“成果发布请求”这里。
            </p>
          </section>

          <!-- STEP 6 -->
          <section class="step step-card scroll-mt-24" id="step-6">
            <h2 class="step-title">第六步 成果认定与津贴发放</h2>
            <div class="step-body">
              <p class="mt-3">
                社区技术组委会会针对大家的PR内容和报告书的质量进行评估，与大家进行技术上的交流之后，财务小助手就会为大家发放“东山远程实习生计划津贴”了！
              </p>
            </div>
          </section>

          <!-- STEP 7 -->
          <section class="step step-card scroll-mt-24" id="step-7">
            <h2 class="step-title">第七步 实习证明与荣誉证书</h2>
            <div class="step-body">
              <p>
                在这里你的每次提交都将被认真对待，经过社区的技术委员会审核完成后，我们将对并入主线的贡献者发放津贴和荣誉奖励，以感谢大家的辛勤贡献！完成实习任务后，你可以随时申请实习证明，发送至邮箱<a
                  href="mailto:dssq_sdu@163.com" class="link">dssq_sdu@163.com</a>。内容如下：
              </p>
              <p class="mt-3">
                “申请实习证明：姓名、东山社区用户名称、Gitte用户名称。”为保证实习证明信息准确，请务必提供准确的Gitte用户名称哦。
              </p>

              <div class="img-grid mt-4">
                <img src="@/assets/img/shixizhengming-1.jpg" alt="实习证明模板正面" class="doc-img"
                     @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)"
                     @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览"/>
                <img src="@/assets/img/shixizhengming-2.jpg" alt="实习证明模板背面" class="doc-img"
                     @click="onImgClick($event)" @keydown.enter.prevent="onImgClick($event)"
                     @keydown.space.prevent="onImgClick($event)" tabindex="0" role="button" aria-label="点击放大预览"/>
              </div>

              <p class="mt-3 text-red-600 font-semibold">
                为保证实习证明信息准确，请务必提供准确的Gitte用户名称。
              </p>
            </div>
          </section>
          <p>最后，再次诚挚地邀请同学们加入我们！</p>
          <!-- Downloads (inside main card) -->
          <section class="step step-card scroll-mt-24" aria-labelledby="downloads">
            <h2 id="downloads" class="step-title">资料下载</h2>
            <ul class="dl-list">
              <li v-for="att in attachments" :key="att.download_url" class="dl-item">
                <div class="dl-meta">
                  <span class="dl-label">{{ att.label }}：</span>
                  <span class="dl-name">{{ att.name }}</span>
                </div>
                <div class="dl-actions">
                  <a class="btn btn-solid" @click.prevent="downloadFile(att)">附件下载</a>
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
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
// 实习协议 PDF 地址（放在 public/docs/ 目录或换成你的线上地址）
const AGREEMENT_URL = 'https://dongshan-file.oss-cn-beijing.aliyuncs.com/%E8%BF%9C%E7%A8%8B%E5%AE%9E%E4%B9%A0%E7%94%9F%E8%AE%A1%E5%88%92--%E5%AE%9E%E4%B9%A0%E5%8D%8F%E8%AE%AE.pdf'

// 下载清单（可自行增删）
interface Attachment {
  label: string;
  name: string;
  download_url: string;
  read_url: string
}

const attachments: Attachment[] = [
  {
    label: '附件一',
    name: '实习协议.pdf',
    read_url: "https://www.riscv-cn.org/sduproxy/dongshan-file/%E8%BF%9C%E7%A8%8B%E5%AE%9E%E4%B9%A0%E7%94%9F%E8%AE%A1%E5%88%92--%E5%AE%9E%E4%B9%A0%E5%8D%8F%E8%AE%AE.pdf",
    download_url: "https://www.riscv-cn.org/sduproxy/dongshan-file/%E8%BF%9C%E7%A8%8B%E5%AE%9E%E4%B9%A0%E7%94%9F%E8%AE%A1%E5%88%92--%E5%AE%9E%E4%B9%A0%E5%8D%8F%E8%AE%AE.pdf"
  },
  {
    label: '附件二',
    name: '东山派借用协议.docx',
    read_url: 'https://www.riscv-cn.org/sduproxy/dongshan-file/dongshanjieyongxieyi.docx',
    download_url: 'https://www.riscv-cn.org/sduproxy/dongshan-file/dongshanjieyongxieyi.docx'
  },
  {
    label: '附件三',
    name: '成果发布申请.docx',
    read_url: 'https://www.riscv-cn.org/sduproxy/dongshan-file/chengguofabuqingqiu.docx',
    download_url: 'https://www.riscv-cn.org/sduproxy/dongshan-file/chengguofabuqingqiu.docx'
  }
]

// 图片预览（灯箱）
const lightboxOpen = ref(false)
const lightboxSrc = ref<string>('')
// 初始化 Router 实例
const router = useRouter()
const goToPersonInfo = () => {
  router.push('/personInfo')
}

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
const downloadFile = (item: Attachment) => {
  // 1. 创建一个隐藏的a标签
  const link = document.createElement('a');
  // 2. 赋值文件真实下载地址（和之前一样）
  link.href = item.download_url;
  // 3. 核心关键：强制指定下载文件名+后缀，优先级最高，浏览器必遵从
  link.download = item.name;
  // 4. 触发点击下载
  link.click();
  // 5. 清理临时标签，无内存泄漏
  link.remove();
};
</script>

<style scoped>
/* ---- 通用排版 ---- */
.hero :where(h1) {
  letter-spacing: -0.02em;
}

.main-title {
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

@media (min-width: 1280px) {
  /* xl */
  .img-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* 资料下载列表 */
.dl-list {
  margin-top: .5rem;
  display: grid;
  gap: 12px;
}

.dl-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(2, 6, 23, .06);
  background: #fff;
  box-shadow: 0 6px 16px rgba(2, 6, 23, .06);
}

.dl-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-weight: 600;
}

.dl-label {
  color: #334155;
  font-weight: 700;
}

.dl-name {
  color: #0f172a;
  font-weight: 600;
}

.dl-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 1;
}

.btn-ghost {
  border: 1px solid rgba(2, 6, 23, .12);
  background: #fff;
  color: #0f172a;
}

.btn-ghost:hover {
  background: #f8fafc;
}

.btn-solid {
  background: #0f172a;
  color: #fff;
  border: 1px solid rgba(15, 23, 42, .8);
}

.btn-solid:hover {
  background: #111827;
}

@media (max-width: 640px) {
  .dl-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .dl-actions {
    width: 100%;
  }

  .dl-actions .btn {
    width: 100%;
  }
}

</style>
