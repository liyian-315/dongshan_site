import { get } from './index'

export async function fetchDocList() {
  return get('/api/docs')
}
