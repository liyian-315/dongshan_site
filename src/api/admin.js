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

// ==================== 镜像管理 ====================

// 获取指定架构下的所有设备
export async function getDevicesByArch(arch) {
    return get(`/api/admin/devices/${arch}`)
}

// 添加设备
export async function addDevice(data) {
    return post('/api/admin/device', data)
}

// 更新设备
export async function updateDevice(data) {
    return put('/api/admin/device', data)
}

// 删除设备
export async function deleteDevice(id, arch) {
    return del(`/api/admin/device/${id}/${arch}`)
}

// 添加镜像
export async function addMirror(data) {
    return post('/api/admin/mirror', data)
}

// 更新镜像
export async function updateMirror(data) {
    return put('/api/admin/mirror', data)
}

// 删除镜像
export async function deleteMirror(id) {
    return del(`/api/admin/mirror/${id}`)
}

// 上传镜像文件
export async function uploadMirrorFile(formData, onUploadProgress) {
    return post('/api/admin/mirror/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        timeout: 600000, // 10分钟超时，适应大文件上传
        onUploadProgress: onUploadProgress
    })
}
