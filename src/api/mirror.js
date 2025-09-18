import { get, post } from './index'

export async function fetchMirrorList(params) {
  return post('/api/mirrors',params)
}
export async function fetchMenuList() {
    return get('/api/mirrors_menu')
}
