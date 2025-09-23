<template>
  <MarkdownPage title="隐私权政策" :md="raw" />
</template>

<script setup>
import MarkdownPage from '@/components/MarkdownPage.vue'
import raw from '@/policies/privacy.md?raw'
</script>
