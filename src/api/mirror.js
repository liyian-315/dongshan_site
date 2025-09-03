import { get } from './index'

export async function fetchMirrorList(params) {
  return get('/api/mirrors',params)
}
export async function fetchMenuList() {
    return get('/api/mirrors_menu')
}
