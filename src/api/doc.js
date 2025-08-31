import { get } from './index'

export async function fetchDocList(params) {
  return get('/api/docs', params)
}
