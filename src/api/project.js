import { get } from './index'

// 获取所有项目
export async function fetchAllProjects() {
    return get('/api/projects')
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