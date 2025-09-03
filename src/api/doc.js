import {get} from './index'

export async function fetchDocList(params) {
    return get('/api/docs', params)
}

export async function fetchMenuList() {
    return get('/api/docs_menu')
}
