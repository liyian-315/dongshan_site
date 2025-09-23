<template>
  <MarkdownPage title="法律声明" :md="raw" />
</template>

<script setup>
import MarkdownPage from '@/components/MarkdownPage.vue'
import raw from '@/policies/lawanno.md?raw'
</script>
