<template>
  <el-card>
    <h2>文档下载</h2>

    <el-table :data="docs" style="width: 100%">
      <el-table-column prop="title" label="文档标题" width="180" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="download(scope.row)">
            下载
          </el-button>
          <el-button type="success" size="small" @click="preview(scope.row)">
            在线查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 预览弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        title="文档在线预览"
        width="70%"
        top="5vh"
        destroy-on-close
        @closed="closePreview"
    >
      <!-- PDF 预览 -->
      <iframe
          v-if="blobUrl"
          :src="blobUrl"
          style="width: 100%; height: 500px"
          frameborder="0"
      ></iframe>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElCard, ElMessage } from 'element-plus'
import { fetchDocList } from '@/api/doc'

const docs = ref([])
const loading = ref(true)
const error   = ref('')

onMounted(async () => {
  try {
    docs.value = await fetchDocList()
  } catch (e) {
    error.value = '获取文档列表失败'
  } finally {
    loading.value = false
  }
})

function download(row) {
  window.open(row.url, '_blank')
}

const dialogVisible = ref(false)
const blobUrl       = ref('')

async function preview(row) {
  try {
    // 1. 以 blob 形式拉取
    const res = await axios.get(row.url, {
      responseType: 'blob',
      // 如需 token： headers: { Authorization: 'Bearer ' + getToken() }
    })

    // 2. 生成本地 URL
    blobUrl.value = URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
    )

    // 3. 打开弹窗
    dialogVisible.value = true
  } catch (e) {
    ElMessage.error('加载 PDF 失败：' + e.message)
  }
}

function closePreview() {
  // 释放内存
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ''
  }
}
</script>