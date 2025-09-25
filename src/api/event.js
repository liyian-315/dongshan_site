import {get, post, put} from "./index"

export function fetchEvents(params) {
    return get('/api/events', params)
}

export function fetchEventDetail(slug) {
    return get(`/api/events/${slug}`)
}

export function fetchEventMeta() {
    // 返回 { code, message, data: { types:[{code,label}], hotTags:[...]} }
    return get('/api/events/meta')
}

// 后续的管理员后端
export function createEvent(data) {
    return post('/api/admin/events', data)
}
export function updateEvent(id, data) {
    return put(`/api/admin/events/${id}`, data)
}