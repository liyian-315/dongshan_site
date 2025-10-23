<template>
  <div class="project-detail-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载项目详情中...</p>
    </div>

    <div v-else-if="error" class="error">
      <i class="el-icon-error"></i>
      <p>{{ error }}</p>
      <button @click="fetchProject">重试</button>
    </div>

    <div v-else class="project-content">
      <div class="project-header">
        <h1>{{ project.name }}</h1>
        <p class="description">{{ project.description }}</p>
        <p class="publish-date">发布日期: {{ formatDate(project.createTime) }}</p>
      </div>

      <div class="tags-container" v-if="moduleDisplay.tags && tags.length">
        <span v-for="(tag, index) in tags" :key="index" class="tag">{{ tag.name }}</span>
      </div>

      <div class="git-repo" v-if="moduleDisplay.gitRepo && project.gitRepo">
        <a :href="project.gitRepo" target="_blank" rel="noopener noreferrer" class="git-link">
          <i class="el-icon-share"></i> 访问开源项目仓库
        </a>
      </div>

      <!-- 项目介绍（Markdown解析） -->
      <div class="project-intro" v-if="moduleDisplay.projectIntro && project.projectIntro">
        <h2>项目介绍</h2>
        <vue3-markdown-it
            :source="project.projectIntro"
            class="intro-content markdown-body"
            :options="markdownOptions"
        />
      </div>

      <div class="project-display" v-if="moduleDisplay.projectDisplay && projectDisplays.length">
        <h2>项目展示</h2>
        <p>以下是系统架构图和一些关键模块的性能测试结果截图。</p>
        <div v-for="(item, index) in projectDisplays" :key="item.id" class="display-item-row">
          <div class="image-container">
            <el-image
                :src="item.link"
                :alt="item.copyWritingText"
                class="display-image"
                fit="contain"
                :preview-src-list="[item.link]"
                :lazy="true"
                @load="handleImageLoad(item)"
                @error="handleImageError(item)"
            >
              <template #placeholder>
                <div class="image-loading">
                  <div class="spinner-small"></div>
                  <span>加载中...</span>
                </div>
              </template>
              <template #error>
                <div class="image-error">
                  <i class="el-icon-picture-outline"></i>
                  <span>图片加载失败</span>
                </div>
              </template>
            </el-image>
          </div>
          <div class="description-container">
            <h3 class="image-title">{{ item.title }}</h3>
            <p class="image-description">{{ item.copyWritingText }}</p>
          </div>
        </div>
      </div>

      <div class="learning-materials" v-if="moduleDisplay.learningMaterial && learningMaterials.length">
        <h2>学习资料</h2>
        <div class="materials-list">
          <div v-for="(material, index) in learningMaterials" :key="index" class="material-item">
            <h3>{{ material.title }}</h3>
            <p>{{ material.copyWritingText }}</p>
            <a :href="material.link" target="_blank" rel="noopener noreferrer" class="material-link">
              {{ material.buttonText || '查看资料' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProjectById, fetchProjectTags } from '@/api/project'
import Vue3MarkdownIt from 'vue3-markdown-it'
import 'github-markdown-css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import markdownItHighlightjs from 'markdown-it-highlightjs'

// Markdown解析器配置（包含代码高亮）
const markdownOptions = ref({
  html: true,        // 允许解析HTML
  breaks: true,       // 支持换行
  gfm: true,         // 支持GitHub Flavored Markdown
  use: [
    [markdownItHighlightjs, { hljs }]  // 配置代码高亮插件
  ]
})

// 路由参数获取
const route = useRoute()
const projectId = route.params.id

// 状态管理
const project = ref({
  name: '',
  description: '',
  createTime: '',
  gitRepo: '',
  projectIntro: '',
  stars: 0,
  watching: 0,
  forks: 0
})
const projectDisplays = ref([])
const learningMaterials = ref([])
const tags = ref([])
const moduleDisplay = ref({
  name: true,
  tags: true,
  gitRepo: true,
  projectIntro: true,
  projectDisplay: true,
  learningMaterial: true
})
const loading = ref(true)
const error = ref('')

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取项目详情
const fetchProject = async () => {
  loading.value = true
  error.value = ''
  try {
    const projectData = await fetchProjectById(projectId)
    project.value = projectData
    projectDisplays.value = projectData.projectDisplays || []
    learningMaterials.value = projectData.learningMaterials || []

    if (projectData.moduleDisplay) {
      moduleDisplay.value = { ...moduleDisplay.value, ...JSON.parse(JSON.stringify(projectData.moduleDisplay)) }
    }

    const tagsData = await fetchProjectTags(projectId)
    tags.value = tagsData || []
  } catch (err) {
    error.value = err.message || '获取项目详情失败，请稍后重试'
    console.error('项目详情加载失败:', err)
  } finally {
    loading.value = false
  }
}

// 图片加载回调（空实现，保留接口）
const handleImageLoad = (item) => {}
const handleImageError = (item) => {}

// 组件挂载时加载数据
onMounted(() => {
  fetchProject()
  console.info(moduleDisplay)
})
</script>

<style scoped>
.project-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loading {
  text-align: center;
  padding: 5rem 0;
  color: #4a5568;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 3rem 0;
  color: #e53e3e;
  background-color: #fff5f5;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.error i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error button:hover {
  background-color: #2b6cb0;
}

.project-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

.project-header h1 {
  font-size: 2.25rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.publish-date {
  color: #718096;
  font-size: 0.9rem;
}

.tags-container {
  margin-bottom: 1.5rem;
}

.tag {
  display: inline-block;
  background-color: #f0f4ff;
  color: #4096ff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
}

.git-repo {
  margin-bottom: 2rem;
}

.git-link {
  display: inline-flex;
  align-items: center;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.git-link:hover {
  background-color: #0056b3;
}

.git-link i {
  margin-right: 0.5rem;
}

.project-intro {
  margin-bottom: 3rem;
}

.project-intro h2 {
  font-size: 1.75rem;
  color: #1a202c;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.intro-content {
  margin-top: 1rem;
}

.markdown-body {
  box-sizing: border-box;
  max-width: 980px;
  margin: 0 auto;
  padding: 1rem;
}

.project-display {
  margin-bottom: 3rem;
}

.project-display h2 {
  font-size: 1.75rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.display-item-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.image-loading, .image-error {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #888;
}

.spinner-small {
  width: 20px;
  height: 20px;
  margin-bottom: 8px;
  border: 2px solid #ddd;
  border-top: 2px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 50%;
  max-width: 50%;
}

.display-image {
  width: 100%;
  max-height: 400px;
  border-radius: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.description-container {
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 2.5rem;
}

.image-title {
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.image-description {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

.learning-materials {
  margin-bottom: 3rem;
}

.learning-materials h2 {
  font-size: 1.75rem;
  color: #1a202c;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.materials-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.material-item {
  background-color: #f7fafc;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.material-item h3 {
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.material-item p {
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.material-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.material-link:hover {
  background-color: #2b6cb0;
}

@media (max-width: 768px) {
  .project-detail-container {
    padding: 1rem;
  }

  .project-header h1 {
    font-size: 1.75rem;
  }

  .display-item-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .image-container,
  .description-container {
    flex: 0 0 100%;
    max-width: 100%;
    padding-left: 0;
  }

  .image-container {
    margin-bottom: 1rem;
  }

  .markdown-body {
    padding: 0.5rem;
  }
}
</style>