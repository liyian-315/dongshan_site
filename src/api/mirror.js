import { get } from './index'

export async function fetchMirrorList() {
  return get('/api/mirrors')
}
