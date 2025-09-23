<template>
  <MarkdownPage title="服务条款" :md="raw" />
</template>

<script setup>
import MarkdownPage from '@/components/MarkdownPage.vue'
import raw from '@/policies/service.md?raw'
</script>
