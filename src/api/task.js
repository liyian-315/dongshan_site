import {put, post, get} from './index'

export function claimTask(params) {
    return put('/api/task/claimTask',params)
}

export function fetchReceivedTaskCount(params) {
    return get('/api/task/fetchReceivedTaskCount',params)
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
