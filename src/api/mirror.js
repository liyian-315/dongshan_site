import { get, post } from './index'

export async function fetchMirrorList(params) {
  return post('/api/public/mirrors',params)
}
export async function fetchMenuList() {
    return get('/api/public/mirrors_menu')
}
