<template>
  <MarkdownPage title="法律声明" :md="raw" />
</template>

<script setup>
import MarkdownPage from '@/components/MarkdownPage.vue'
import raw from '@/Policies/lawanno.md?raw'
</script>
