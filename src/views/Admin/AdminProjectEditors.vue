<template>
  <div class="project-editor-container">
    <!-- 左侧项目列表 -->
    <div class="project-sidebar">
      <div class="sidebar-header">
        <h2>项目管理</h2>
        <button class="btn-new-project" @click="createNewProject">
          <i class="el-icon-plus"></i> 新增项目
        </button>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索项目名称..."
          class="search-input"
        />
        <i class="el-icon-search search-icon"></i>
      </div>

      <!-- 项目列表 -->
      <div class="project-list">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          :class="['project-item', { active: selectedProject?.id === project.id }]"
          @click="selectProject(project)"
        >
          <div class="project-name">{{ project.name }}</div>
          <div class="project-id">ID: {{ project.id }}</div>
        </div>
        <div v-if="filteredProjects.length === 0" class="no-projects">
          {{ searchKeyword ? '未找到匹配的项目' : '暂无项目' }}
        </div>
      </div>
    </div>

    <!-- 右侧编辑区 -->
    <div class="project-editor">
      <div v-if="!selectedProject" class="editor-empty">
        <i class="el-icon-document"></i>
        <p>请选择左侧项目进行编辑，或点击"新增项目"创建新项目</p>
      </div>

      <div v-else class="editor-content">
        <div class="editor-header">
          <h1>{{ isNewProject ? '新增项目' : '编辑项目' }}</h1>
          <div class="editor-actions">
            <button class="btn-save" @click="saveProject" :disabled="saving">
              <i class="el-icon-check"></i>
              {{ saving ? '保存中...' : '保存' }}
            </button>
            <button class="btn-cancel" @click="cancelEdit" :disabled="saving">
              <i class="el-icon-close"></i>
              取消
            </button>
          </div>
        </div>

        <div class="editor-form">
          <!-- 项目名称 -->
          <div class="form-group">
            <label class="form-label">项目名称 *</label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="请输入项目名称"
            />
          </div>

          <!-- 项目描述 -->
          <div class="form-group">
            <label class="form-label">项目描述 *</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="3"
              placeholder="请输入项目描述"
            ></textarea>
          </div>

          <!-- Git 仓库地址 -->
          <div class="form-group">
            <label class="form-label">Git 仓库地址</label>
            <input
              v-model="formData.gitRepo"
              type="text"
              class="form-input"
              placeholder="https://github.com/..."
            />
          </div>

          <!-- 创建时间（只读） -->
          <div class="form-group" v-if="!isNewProject">
            <label class="form-label">创建时间</label>
            <input
              :value="formatDate(formData.createTime)"
              type="text"
              class="form-input"
              readonly
              disabled
            />
          </div>

          <!-- 标签选择 -->
          <div class="form-group">
            <label class="form-label">项目标签</label>
            <div class="tags-selector">
              <div class="selected-tags">
                <span
                  v-for="tagId in formData.selectedTagIds"
                  :key="tagId"
                  class="tag-chip"
                >
                  {{ getTagNameById(tagId) }}
                  <i class="el-icon-close" @click="removeTag(tagId)"></i>
                </span>
                <span v-if="formData.selectedTagIds.length === 0" class="no-tags">
                  未选择标签
                </span>
              </div>
              <button class="btn-select-tags" @click="showTagSelector = true">
                选择标签
              </button>
            </div>

            <!-- 标签选择弹窗 -->
            <div v-if="showTagSelector" class="tag-selector-modal">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>选择标签</h3>
                  <i class="el-icon-close" @click="showTagSelector = false"></i>
                </div>
                <div class="modal-body">
                  <div class="available-tags">
                    <label
                      v-for="tag in allTags"
                      :key="tag.id"
                      class="tag-checkbox"
                    >
                      <input
                        type="checkbox"
                        :value="tag.id"
                        v-model="formData.selectedTagIds"
                      />
                      <span>{{ tag.name }}</span>
                    </label>
                  </div>
                  <div class="modal-footer">
                    <div class="new-tag-input">
                      <input
                        v-model="newTagName"
                        type="text"
                        placeholder="新标签名称"
                        @keyup.enter="addNewTag"
                      />
                      <button @click="addNewTag" :disabled="!newTagName.trim()">
                        <i class="el-icon-plus"></i> 添加
                      </button>
                    </div>
                    <button class="btn-confirm" @click="showTagSelector = false">
                      确定
                    </button>
                  </div>
                </div>
              </div>
              <div class="modal-backdrop" @click="showTagSelector = false"></div>
            </div>
          </div>

          <!-- Markdown 编辑器 -->
          <div class="form-group markdown-editor-group">
            <label class="form-label">项目介绍（Markdown）</label>
            <div class="markdown-editor">
              <div class="editor-tabs">
                <button
                  :class="['tab', { active: editorTab === 'edit' }]"
                  @click="editorTab = 'edit'"
                >
                  <i class="el-icon-edit"></i> 编辑
                </button>
                <button
                  :class="['tab', { active: editorTab === 'preview' }]"
                  @click="editorTab = 'preview'"
                >
                  <i class="el-icon-view"></i> 预览
                </button>
              </div>

              <!-- 编辑模式 -->
              <div v-show="editorTab === 'edit'" class="editor-pane">
                <textarea
                  v-model="formData.projectIntro"
                  class="markdown-textarea"
                  placeholder="请输入项目介绍，支持 Markdown 格式...&#10;&#10;# 标题&#10;## 二级标题&#10;&#10;**粗体** *斜体*&#10;&#10;- 列表项 1&#10;- 列表项 2"
                ></textarea>
              </div>

              <!-- 预览模式 -->
              <div v-show="editorTab === 'preview'" class="preview-pane">
                <vue3-markdown-it
                  v-if="formData.projectIntro"
                  :source="formData.projectIntro"
                  class="markdown-body"
                  :options="markdownOptions"
                />
                <div v-else class="preview-empty">
                  暂无内容，请在编辑模式下输入
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息提示 -->
      <div v-if="message.show" :class="['message-toast', message.type]">
        <i :class="message.type === 'success' ? 'el-icon-success' : 'el-icon-error'"></i>
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, warn} from 'vue'
import {
  fetchAllProjectsForAdmin,
  fetchAllTags,
  fetchProjectById,
  fetchProjectTags,
  createProject,
  updateProject,
  updateProjectTags,
  createTag
} from '@/api/project'
import Vue3MarkdownIt from 'vue3-markdown-it'
import 'github-markdown-css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import markdownItHighlightjs from 'markdown-it-highlightjs'

// Markdown 配置
const markdownOptions = ref({
  html: true,
  breaks: true,
  gfm: true,
  use: [[markdownItHighlightjs, { hljs }]]
})

// 状态管理
const allProjects = ref([])
const allTags = ref([])
const selectedProject = ref(null)
const searchKeyword = ref('')
const isNewProject = ref(false)
const saving = ref(false)
const showTagSelector = ref(false)
const newTagName = ref('')
const editorTab = ref('edit')

// 表单数据
const formData = ref({
  id: null,
  name: '',
  description: '',
  gitRepo: '',
  createTime: '',
  projectIntro: '',
  selectedTagIds: []
})

// 消息提示
const message = ref({
  show: false,
  type: 'success',
  text: ''
})

// 过滤后的项目列表
const filteredProjects = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allProjects.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return allProjects.value.filter(project =>
    project.name.toLowerCase().includes(keyword)
  )
})

// 根据标签 ID 获取标签名称
const getTagNameById = (tagId) => {
  const tag = allTags.value.find(t => t.id === tagId)
  return tag ? tag.name : '未知标签'
}

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 显示消息
const showMessage = (text, type = 'success') => {
  message.value = { show: true, type, text }
  setTimeout(() => {
    message.value.show = false
  }, 3000)
}

// 加载所有项目
const loadProjects = async () => {
  try {
    const projects = await fetchAllProjectsForAdmin()
    allProjects.value = projects || []
  } catch (error) {
    console.error('加载项目列表失败:', error)
  }
}

// 加载所有标签
const loadTags = async () => {
  try {
    const tags = await fetchAllTags()
    allTags.value = tags || []
  } catch (error) {
    console.error('加载标签列表失败:', error)
  }
}

// 选择项目
const selectProject = async (project) => {
  selectedProject.value = project
  isNewProject.value = false
  editorTab.value = 'edit'

  try {
    // 根据项目ID获取完整的项目详情
    const fullProject = await fetchProjectById(project.id)

    // 填充表单数据（使用完整的项目信息）
    formData.value = {
      id: fullProject.id,
      name: fullProject.name || '',
      description: fullProject.description || '',
      gitRepo: fullProject.gitRepo || '',
      createTime: fullProject.createTime || '',
      projectIntro: fullProject.projectIntro || '',
      selectedTagIds: []
    }

    // 加载项目的标签
    const projectTags = await fetchProjectTags(project.id)
    formData.value.selectedTagIds = projectTags.map(tag => tag.id)
  } catch (error) {
    console.error('加载项目详情失败:', error)
  }
}

// 创建新项目
const createNewProject = () => {
  isNewProject.value = true
  selectedProject.value = { id: null, name: '新项目' }
  editorTab.value = 'edit'
  formData.value = {
    id: null,
    name: '',
    description: '',
    gitRepo: '',
    createTime: '',
    projectIntro: '',
    selectedTagIds: []
  }
}

// 取消编辑
const cancelEdit = () => {
  if (isNewProject.value) {
    selectedProject.value = null
    isNewProject.value = false
  } else if (selectedProject.value) {
    // 重新加载原数据
    selectProject(allProjects.value.find(p => p.id === selectedProject.value.id))
  }
}

// 移除标签
const removeTag = (tagId) => {
  formData.value.selectedTagIds = formData.value.selectedTagIds.filter(id => id !== tagId)
}

// 添加新标签
const addNewTag = async () => {
  const tagName = newTagName.value.trim()
  if (!tagName) return

  try {
    const newTag = await createTag({ name: tagName })

    // 重新加载所有标签以确保数据同步
    await loadTags()

    // 查找新添加的标签并选中它
    const addedTag = allTags.value.find(tag => tag.name === tagName)
    if (addedTag && !formData.value.selectedTagIds.includes(addedTag.id)) {
      formData.value.selectedTagIds.push(addedTag.id)
    }

    newTagName.value = ''
    showMessage('标签添加成功')
  } catch (error) {
    console.error('添加标签失败:', error)
  }
}

// 保存项目
const saveProject = async () => {
  // 表单验证
  if (!formData.value.name.trim()) {
    showMessage('请输入项目名称', 'error')
    return
  }
  if (!formData.value.description.trim()) {
    showMessage('请输入项目描述', 'error')
    return
  }

  saving.value = true

  // 记录当前是否是新项目，用于错误恢复
  const wasNewProject = isNewProject.value

  try {
    const projectData = {
      projectId: formData.value.id,
      name: formData.value.name,
      description: formData.value.description,
      gitRepo: formData.value.gitRepo,
      tagIds: formData.value.selectedTagIds,
      projectIntro: formData.value.projectIntro
    }

    let savedProject
    if (wasNewProject) {
      // 新增项目（后端会自动处理标签关联）
      savedProject = await createProject(projectData)

      // 更新表单ID
      formData.value.id = savedProject.id
    } else {
      // 更新项目
      projectData.id = formData.value.id
      savedProject = await updateProject(projectData)

      // 更新项目标签（仅在更新模式下需要）
      await updateProjectTags(savedProject.id, formData.value.selectedTagIds)
    }

    // 所有操作都成功后，才更新状态
    if (wasNewProject) {
      showMessage('项目创建成功')
      isNewProject.value = false
      selectedProject.value = savedProject
    } else {
      showMessage('项目更新成功')
      // 更新列表中的项目信息
      const index = allProjects.value.findIndex(p => p.id === savedProject.id)
      if (index !== -1) {
        allProjects.value[index] = { ...allProjects.value[index], ...savedProject }
      }
    }

    // 刷新项目列表
    await loadProjects()
  } catch (error) {
    console.error('保存项目失败:', error)
    showMessage('保存项目失败: ' + error.message, 'warning')
  } finally {
    saving.value = false
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadProjects()
  await loadTags()
})
</script>

<style scoped>
.project-editor-container {
  display: flex;
  height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

/* 左侧项目列表 */
.project-sidebar {
  width: 320px;
  background-color: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.sidebar-header h2 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #303133;
}

.btn-new-project {
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-new-project:hover {
  background-color: #66b1ff;
}

.search-box {
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.search-input {
  width: 100%;
  padding: 8px 35px 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #409eff;
}

.search-icon {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
}

.project-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.project-item {
  padding: 12px 15px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.project-item:hover {
  background-color: #ecf5ff;
}

.project-item.active {
  background-color: #409eff;
  color: white;
}

.project-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.project-id {
  font-size: 12px;
  opacity: 0.7;
}

.no-projects {
  text-align: center;
  color: #909399;
  padding: 30px 20px;
  font-size: 14px;
}

/* 右侧编辑区 */
.project-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.editor-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.editor-empty i {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.3;
}

.editor-empty p {
  font-size: 16px;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #e4e7ed;
}

.editor-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.editor-actions {
  display: flex;
  gap: 10px;
}

.btn-save,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-save {
  background-color: #67c23a;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background-color: #85ce61;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #f56c6c;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #f78989;
}

.editor-form {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #409eff;
}

.form-input:disabled {
  background-color: #f5f7fa;
  color: #909399;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 标签选择器 */
.tags-selector {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.selected-tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 46px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background-color: #f0f4ff;
  color: #4096ff;
  border-radius: 4px;
  font-size: 13px;
}

.tag-chip i {
  margin-left: 6px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.tag-chip i:hover {
  opacity: 1;
}

.no-tags {
  color: #909399;
  font-size: 14px;
}

.btn-select-tags {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.btn-select-tags:hover {
  background-color: #66b1ff;
}

/* 标签选择弹窗 */
.tag-selector-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.modal-header i {
  font-size: 20px;
  cursor: pointer;
  color: #909399;
}

.modal-header i:hover {
  color: #606266;
}

.modal-body {
  padding: 20px;
}

.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-checkbox:hover {
  background-color: #f5f7fa;
}

.tag-checkbox input {
  margin-right: 8px;
  cursor: pointer;
}

.tag-checkbox span {
  font-size: 14px;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.new-tag-input {
  display: flex;
  gap: 10px;
}

.new-tag-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.new-tag-input input:focus {
  border-color: #409eff;
}

.new-tag-input button {
  padding: 8px 16px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.new-tag-input button:hover:not(:disabled) {
  background-color: #85ce61;
}

.new-tag-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-confirm {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-confirm:hover {
  background-color: #66b1ff;
}

/* Markdown 编辑器 */
.markdown-editor-group {
  margin-bottom: 0;
}

.markdown-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.tab {
  flex: 1;
  padding: 12px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s;
}

.tab:hover {
  color: #409eff;
}

.tab.active {
  background-color: white;
  color: #409eff;
  font-weight: 500;
}

.editor-pane,
.preview-pane {
  min-height: 400px;
  max-height: 600px;
}

.markdown-textarea {
  width: 100%;
  min-height: 400px;
  max-height: 600px;
  padding: 15px;
  border: none;
  outline: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
}

.preview-pane {
  padding: 15px;
  overflow-y: auto;
  background-color: white;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #909399;
  font-size: 14px;
}

.markdown-body {
  box-sizing: border-box;
  padding: 15px;
}

/* 消息提示 */
.message-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.message-toast.success {
  background-color: #f0f9ff;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.message-toast.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.message-toast i {
  font-size: 18px;
}

/* 滚动条样式 */
.project-list::-webkit-scrollbar,
.editor-form::-webkit-scrollbar,
.available-tags::-webkit-scrollbar,
.preview-pane::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.project-list::-webkit-scrollbar-thumb,
.editor-form::-webkit-scrollbar-thumb,
.available-tags::-webkit-scrollbar-thumb,
.preview-pane::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 4px;
}

.project-list::-webkit-scrollbar-thumb:hover,
.editor-form::-webkit-scrollbar-thumb:hover,
.available-tags::-webkit-scrollbar-thumb:hover,
.preview-pane::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}
</style>
