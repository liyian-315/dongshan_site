import {put, post, get} from './index'

export function updateTaskStatus(data) {
    return put('/api/admin/update_task_status', data)
}

export function selectTask(params) {
    return post('/api/admin/select_task', params)
}


export function getPublishTemplateUrl() {
    return get('/api/task/getPublishTemplateUrl');
}


export function uploadTaskFiles(formData) {
    return post('/api/task/uploadFile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function claimTask(params) {
    return put('/api/task/claimTask', params)
}

export function fetchReceivedTaskCount(params) {
    return get('/api/task/fetchReceivedTaskCount', params)
}

export function fetchMyTasks(params) {
    return get('/api/task/fetchMyTasks', params)
}

export function fetchTasksByCategory(params) {
    return get('/api/task/fetchTasksByCategory', params)
}

export function fetchTaskCategories(params) {
    return get('/api/task/fetchTaskCategories', params)
}

export function createTask(data) {
    return post('/api/admin/create_task', data)
}

export function getProtocols(params) {
    return get('/api/protocols', params)
}

export function createTaskClass(data) {
    return post('/api/admin/task_class', data)
}

export function createProtocol(data) {
    return post('/api/admin/protocol', data)
}

export function getTasksForEdit(params) {
    return get('/api/admin/tasks_edit', params)
}

export function updateTaskInfo(taskId, data) {
    return put(`/api/admin/task/${taskId}`, data)
}
