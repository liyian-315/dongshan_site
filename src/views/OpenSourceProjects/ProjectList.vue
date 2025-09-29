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

    <div class="pagination-container" v-if="totalProjects > 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalProjects"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchAllProjects, fetchAllTags, fetchProjectTags } from '@/api/project'
import ProjectCard from '@/components/ProjectCard.vue'
import { ElPagination, ElMessage } from 'element-plus'

const projects = ref([])
const allTags = ref([])
const projectTagsMap = ref({})
const loading = ref(true)
const error = ref('')
const searchKeyword = ref('')
const category = ref('all')
const sortType = ref('newest')

const currentPage = ref(1)
const pageSize = ref(10)
const totalProjects = ref(0)

const filteredProjects = computed(() => {
  let filtered = [...projects.value]
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(keyword) ||
        (project.description && project.description.toLowerCase().includes(keyword))
    )
  }
  if (category.value !== 'all') {
    const targetTagId = parseInt(category.value)
    filtered = filtered.filter(project => {
      const projectTags = projectTagsMap.value[project.id] || []
      return projectTags.some(tag => tag.id === targetTagId)
    })
  }
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

const fetchProjects = async () => {
  loading.value = true
  error.value = ''
  projectTagsMap.value = {}

  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value.trim() || undefined,
      categoryId: category.value !== 'all' ? category.value : undefined,
      sortType: sortType.value
    }

    const response = await fetchAllProjects(params)

    const { projectList, total, pageNum, pageSize: resPageSize } = response || {}
    projects.value = projectList || []
    totalProjects.value = total || 0
    currentPage.value = pageNum || currentPage.value
    pageSize.value = resPageSize || pageSize.value


    if (projects.value.length > 0) {
      const tagPromises = projects.value.map(project =>
          fetchProjectTags(project.id)
              .then(tags => ({ projectId: project.id, tags }))
              .catch(err => {
                console.warn(`获取项目[${project.id}]标签失败：`, err)
                return ({ projectId: project.id, tags: [] })
              })
      )
      const tagResults = await Promise.all(tagPromises)
      tagResults.forEach(({ projectId, tags }) => {
        projectTagsMap.value[projectId] = tags
      })
    }

  } catch (err) {
    error.value = err.message || '获取项目列表失败，请重试'
    console.error('项目加载异常：', err)
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProjects()
}


const handleCurrentPageChange = (page) => {
  currentPage.value = page
  fetchProjects()
  document.querySelector('.pagination-container')?.scrollIntoView({ behavior: 'smooth' })
}

const fetchAllTagsData = async () => {
  try {
    const tagsRes = await fetchAllTags()
    allTags.value = tagsRes || []
  } catch (err) {
    console.error('获取分类标签失败：', err)
    allTags.value = []
    ElMessage.error('获取分类标签失败')
  }
}

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
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 30px 30px 80px;
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
    padding: 15px 15px 70px;
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

.pagination-container {
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding-right: 8px;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 20px;
  right: 30px;
}

@media (max-width: 767px) {
  .pagination-container {
    padding-right: 0;
    bottom: 15px;
    right: 15px;
    width: calc(100% - 30px);
  }
}

:deep(.el-pagination) {
  font-size: 14px;
  background-color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>