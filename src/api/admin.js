import { get, post, put, del } from './index'

// 获取所有项目列表（用于下拉框）
export async function getAllProjects() {
    return get('/api/admin/projects/all')
}

// 获取首页展示的项目列表
export async function getHomeProjects() {
    return get('/api/public/home_projects')
}

// 添加首页项目展示
export async function addHomeProject(data) {
    return post('/api/public/admin/home_projects', data)
}

// 删除首页项目展示
export async function deleteHomeProject(id) {
    return del(`/api/public/admin/home_projects/${id}`)
}

// 更新首页项目展示
export async function updateHomeProject(data) {
    return put('/api/public/admin/home_projects', data)
}

// 获取首页展示的活动列表
export async function getHomeEvents() {
    return get('/api/public/home_events')
}

// 添加首页活动展示
export async function addHomeEvent(data) {
    return post('/api/public/admin/home_events', data)
}

// 删除首页活动展示
export async function deleteHomeEvent(id) {
    return del(`/api/public/admin/home_events/${id}`)
}

// 更新首页活动展示
export async function updateHomeEvent(data) {
    return put('/api/public/admin/home_events', data)
}
