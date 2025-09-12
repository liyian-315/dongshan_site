import {get} from './index'

export async function fetchDocList(params) {
    return get('/api/public/docs', params)
}

export async function fetchMenuList() {
    return get('/api/public/docs_menu')
}
