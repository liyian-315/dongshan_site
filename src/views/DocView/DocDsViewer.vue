<template>
  <MarkdownReader base="/documents/dongshanpai">
    <template #empty>
      <div class="space-y-3">
        <h2 class="text-2xl font-bold">常见问题 · FAQ</h2>
        <p class="text-gray-600">从账号、权限到部署与兼容性，这里都有答案。左侧选择问题分类/条目。</p>
        <ul class="list-disc ml-5 text-gray-700">
          <li>账号与权限</li>
          <li>部署与环境</li>
          <li>故障排查</li>
          <li>版本与升级策略</li>
        </ul>
      </div>
    </template>
  </MarkdownReader>
</template>
<script setup>
import MarkdownReader from '@/components/MarkdownReader.vue'
</script>
