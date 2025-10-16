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
