<template>
  <div class="project-card" :style="{ borderLeftColor: borderColor }">
    <div class="project-header">
      <h3>{{ project.name }}</h3>
      <span class="project-date">{{ formattedDate }}</span>
    </div>
    <p class="project-description">{{ project.description }}</p>
    <div class="tags">
      <span
          v-for="tag in tags"
          :key="tag.id"
          class="tag"
          :style="{
            backgroundColor: tag.color || getDefaultTagColor(tag.id),
            color: tag.textColor || getDefaultTagTextColor(tag.id)
          }"
          :title="tag.name"
      >
        {{ tag.name }}
      </span>
    </div>
    <div class="project-meta">
      <!--      <span class="meta-item">-->
      <!--        <i class="fas fa-star"></i> {{ project.stars || 0 }}-->
      <!--      </span>-->
      <!--      <span class="meta-item">-->
      <!--        <i class="fas fa-code-branch"></i> {{ project.forks || 0 }}-->
      <!--      </span>-->
      <router-link :to="`/project/${project.id}`" class="detail-link">查看详情 →</router-link>
    </div>
  </div>
</template>

<script setup>
import {defineProps, computed} from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  tags: {
    type: Array,
    required: true
  }
})

// 格式化日期
const formattedDate = computed(() => {
  if (!props.project.createTime) return ''
  const date = new Date(props.project.createTime)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
})

// 项目卡片左侧边框颜色
const borderColor = computed(() => {
  if (Array.isArray(props.tags) && props.tags.length > 0) {
    const firstTag = props.tags[0]
    if (firstTag.color && typeof firstTag.color === 'string' && firstTag.color.trim()) {
      return firstTag.color
    }
    return getDefaultTagColor(firstTag.id || 0)
  }
  const colors = [
    '#fc818133', '#f6ad5533', '#68d39133', '#90cdf433',
    '#b794f433', '#fbd38d39', '#f687b333', '#805ad580',
    '#48bb7833', '#38b2ac33', '#ed893633', '#c5303050'
  ]
  const projectId = Number(props.project.id) || 0
  return colors[projectId % colors.length]
})

// 标签背景颜色(20% transparent)
const getDefaultTagColor = (id) => {
  const colors = [
    '#e53e3e33', '#dd6b2033', '#3182ce33', '#38a16933', '#805ad533',
    '#ed64a633', '#00ced133', '#ff634733', '#ba55d333', '#4682b433',
    '#8b451333', '#20b2aa33', '#d2691e33', '#ff149333', '#9400d333',
    '#0000cd33', '#00800033', '#ffd70033', '#ff69b433', '#1e90ff33'
  ]
  return colors[id % colors.length]
}

// 标签文字颜色
const getDefaultTagTextColor = (id) => {
  const textColors = [
    '#c53030', '#c05621', '#2b6cb0', '#2f855a', '#6b46c1',
    '#d53f8c', '#008b8b', '#c8553d', '#9f7aea', '#3d5a80',
    '#5d2f0f', '#147c74', '#9c4200', '#c1128f', '#6e0dad',
    '#00008b', '#006400', '#b8860b', '#ff1493', '#1864ab'
  ]
  return textColors[id % textColors.length]
}
</script>

<style scoped>
.project-card {
  background-color: #fff;
  border-radius: 0 6px 6px 0;
  border-left: 4px solid;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 1.25rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.project-card h3 {
  font-size: 1.25rem;
  margin: 0;
  color: #1a202c;
  font-weight: 600;
  transition: color 0.2s ease;
}

.project-card:hover h3 {
  color: #3182ce;
}

.project-date {
  font-size: 0.875rem;
  color: #a0aec0;
  white-space: nowrap;
}

.project-description {
  color: #4a5568;
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-size: 0.9375rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  margin: 0 0 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f7fafc;
}

.detail-link {
  color: #e53e3e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin-top: 4px;
  transition: color 0.2s ease;
}

.detail-link:hover {
  color: #c53030;
  text-decoration: underline;
}
</style>
