<template>
  <el-card>
    <h2>镜像下载</h2>
    <el-table :data="mirrors" style="width: 100%">
      <el-table-column prop="name" label="资源名称" width="150"/>
      <el-table-column prop="url" label="镜像地址" width="200">
        <template #default="scope">
          <el-link :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="150"/>
      <el-table-column prop="time" label="时间" width="150"/>
    </el-table>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {ElCard, ElLink, ElTable, ElTableColumn} from 'element-plus'
import {fetchMirrorList} from '@/api/mirror.js'

const mirrors = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    mirrors.value = await fetchMirrorList()
  } catch (e) {
    error.value = '获取镜像列表失败，请检查网络或联系管理员'
  } finally {
    loading.value = false
  }
})
</script>
