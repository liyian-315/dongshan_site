<template>
  <div class="policy-wrapper">
    <el-card class="policy-card" shadow="always">
      <h1 class="policy-title">{{ title }}</h1>
      <div class="md-body" v-html="html"></div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import MarkdownIt from 'markdown-it'
import '@/assets/markdown.css' // Markdown 的样式（下一步会创建）

const props = defineProps({
  title: { type: String, default: '' },
  md: { type: String, default: '' }
})

// 配置 markdown-it：允许 HTML、自动链接、换行
const md = new MarkdownIt({ html: true, linkify: true, breaks: true })

// 把传入的 markdown 字符串转成 HTML
const html = computed(() => md.render(props.md || ''))

// 动态设置页面标题
watchEffect(() => {
  if (props.title) document.title = `${props.title} - 东山社区`
})
</script>

<style scoped>
.policy-wrapper {
  min-height: calc(100vh - 64px - 76px); /* 避开顶部导航和底部 */
  display: grid;
  place-items: start center;
  padding: 32px 16px 24px;
  background:
      radial-gradient(1200px 600px at 10% -10%, rgba(0, 209, 255, 0.08), transparent 60%),
      radial-gradient(1000px 500px at 110% 110%, rgba(99, 102, 241, 0.08), transparent 60%),
      linear-gradient(180deg, #f7fafc, #eef2f7);
}

.policy-card {
  width: min(960px, 96vw);
  border-radius: 16px;
}

.policy-title {
  margin: 4px 0 12px;
  letter-spacing: .01em;
}
</style>
