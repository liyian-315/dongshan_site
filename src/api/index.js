import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/',
  timeout: 5000
})

apiClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export function get(url, params, config ={}) {
  return apiClient.get(url, {
      ...config,
      params:params
  })
}

export function post(url, data, config) {
  return apiClient.post(url, data, config)
}

export function put(url, data, config) {
  return apiClient.put(url, data, config)
}

export function del(url, config) {
  return apiClient.delete(url, config)
}
