<template>
  <div class="project-list-container">
    <h1>探索我们的开源项目</h1>
    <p>深入了解我们社区贡献的各种项目，从操作系统到开发工具应有尽有。</p>
    <div class="search-filter">
      <input
          type="text"
          placeholder="按名称或关键词搜索..."
          v-model="searchKeyword"
          @input="fetchProjects"
      />
      <select v-model="category" @change="fetchProjects">
        <option value="all">所有分类</option>
        <option v-for="tag in allTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
      <select v-model="sortType" @change="fetchProjects">
        <option value="newest">最新</option>
        <option value="name">名称</option>
      </select>
    </div>
    <div class="projects">
      <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          :tags="projectTagsMap[project.id] || []"
      />
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="error" class="error">加载失败：{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchAllProjects, fetchAllTags, fetchProjectTags } from '@/api/project'
import ProjectCard from '@/components/ProjectCard.vue'

// 状态管理
const projects = ref([])
const allTags = ref([])
const projectTagsMap = ref({})
const loading = ref(true)
const error = ref('')
const searchKeyword = ref('')
const category = ref('all')
const sortType = ref('newest')

/**
 * 计算属性：筛选+排序后的项目列表
 * 依赖 projects、projectTagsMap、searchKeyword 等状态，自动响应变化
 */
const filteredProjects = computed(() => {
  let filtered = [...projects.value] // 拷贝原数组，避免修改源数据

  // 1. 关键词搜索（名称/描述）
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(keyword) ||
        (project.description && project.description.toLowerCase().includes(keyword))
    )
  }

  // 2. 分类筛选（基于项目标签）
  if (category.value !== 'all') {
    const targetTagId = parseInt(category.value)
    filtered = filtered.filter(project => {
      const projectTags = projectTagsMap.value[project.id] || []
      return projectTags.some(tag => tag.id === targetTagId)
    })
  }

  // 3. 排序（最新/名称）
  if (sortType.value === 'newest') {
    filtered.sort((a, b) => {
      const timeA = a.createTime ? new Date(a.createTime).getTime() : 0
      const timeB = b.createTime ? new Date(b.createTime).getTime() : 0
      return timeB - timeA
    })
  } else if (sortType.value === 'name') {
    filtered.sort((a, b) => {
      const nameA = a.name || ''
      const nameB = b.name || ''
      return nameA.localeCompare(nameB)
    })
  }

  return filtered
})

/**
 * 核心方法：获取所有项目 + 对应的标签（优化点：用Promise.all等待所有标签请求完成）
 * 解决原代码“异步循环导致标签加载不完整”的问题
 */
const fetchProjects = async () => {
  loading.value = true
  error.value = '' // 重置错误提示
  projectTagsMap.value = {} // 重置标签映射（避免旧数据干扰）

  try {
    const projectsRes = await fetchAllProjects()
    if (!projectsRes.length) {
      projects.value = []
      return
    }

    const tagPromises = projectsRes.map(project =>
        fetchProjectTags(project.id)
            .then(tags => ({ projectId: project.id, tags })) // 关联项目ID和标签
            .catch(err => {
              console.warn(`获取项目[${project.id}]标签失败：`, err)
              return ({ projectId: project.id, tags: [] })
            })
    )

    const tagResults = await Promise.all(tagPromises)
    tagResults.forEach(({ projectId, tags }) => {
      projectTagsMap.value[projectId] = tags // 构建项目-标签映射
    })

    projects.value = projectsRes

  } catch (err) {
    error.value = err.message || '获取项目列表失败，请重试'
    console.error('项目加载异常：', err)
  } finally {
    loading.value = false
  }
}

/**
 * 获取所有分类标签（用于筛选下拉框）
 */
const fetchAllTagsData = async () => {
  try {
    const tagsRes = await fetchAllTags()
    allTags.value = tagsRes || []
  } catch (err) {
    console.error('获取分类标签失败：', err)
    allTags.value = [] // 失败时显示空下拉框
  }
}

/**
 * 生命周期：组件挂载时初始化数据
 */
onMounted(async () => {
  try {
    await Promise.all([
      fetchProjects(),
      fetchAllTagsData()
    ])
  } catch (err) {
    console.error('初始化加载失败：', err)
  }
})
</script>

<style scoped>
.project-list-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.project-list-container h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #1a202c;
  font-size: 28px;
}

.project-list-container p {
  text-align: center;
  color: #4a5568;
  margin-bottom: 30px;
  font-size: 16px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-filter {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-filter input{
  flex: 1;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  min-width: 150px;
}
.search-filter select {
  flex: 1;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  min-width: 150px;
}

.search-filter input {
  flex: 1;
  min-width: 200px;
}

.projects {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.loading {
  text-align: center;
  margin-top: 40px;
  color: #4a5568;
  font-size: 16px;
}

.error {
  text-align: center;
  margin-top: 40px;
  color: #dc2626;
  font-size: 16px;
  padding: 16px;
  background-color: #fee2e2;
  border-radius: 4px;
}

@media (min-width: 768px) {
  .projects {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .project-list-container {
    padding: 15px;
  }

  .search-filter {
    flex-direction: column;
    gap: 10px;
  }

  .search-filter input,
  .search-filter select {
    width: 100%;
    min-width: auto;
  }
}
</style>