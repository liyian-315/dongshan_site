import { get, post } from './index'

// 分页获取所有项目
export async function fetchAllProjects(params) {
    return get('/api/projects', params)
}

// 获取单个项目
export async function fetchProjectById(id) {
    return get(`/api/projects/${id}`)
}

// 获取所有标签
export async function fetchAllTags() {
    return get('/api/projects/tags')
}

// 获取项目的标签
export async function fetchProjectTags(projectId) {
    return get(`/api/projects/${projectId}/tags`)
}

// 管理员相关接口

// 获取所有项目列表（管理员用）
export async function fetchAllProjectsForAdmin() {
    return get('/api/admin/projects/all')
}

// 创建新项目
export async function createProject(data) {
    return post('/api/admin/project/createProject', data)
}

// 更新项目基础信息
export async function updateProject(data) {
    const { put } = await import('./index')
    return put('/api/admin/project/updateProject', data)
}

// 更新项目标签
export async function updateProjectTags(projectId, tagIds) {
    const { put } = await import('./index')
    return put('/api/admin/project/updateProjectTags', { projectId, tagIds })
}

// 添加新标签
export async function createTag(tag) {
    const { post } = await import('./index')
    return post('/api/admin/project/addTag', tag)
}