import {get, post} from './index'

export async function fetchDocList(params) {
    return post('/api/docs', params)
}

export async function fetchMenuList() {
    return get('/api/docs_menu')
}
