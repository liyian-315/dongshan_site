import { get } from './index'

export async function fetchMirrorList(params) {
  return get('/api/mirrors',params)
}
