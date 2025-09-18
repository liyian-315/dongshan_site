import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'

const apiClient = axios.create({
    baseURL: '/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})
let isHandlingUnauth = false

// ============================== 工具方法 ==============================
function handleAuthError() {
    localStorage.removeItem('token')

    // 2. 仅当未在登录页且未处理过未授权逻辑时，执行跳转
    if (router.currentRoute.value.path !== '/login' && !isHandlingUnauth) {
        isHandlingUnauth = true // 加锁：标记开始处理未授权逻辑

        // 提示+跳转（跳转用nextTick确保提示先显示）
        ElMessage.error('登录已过期或 Token 无效，请重新登录')
        router.push('/login').finally(() => {
            // 跳转完成后解锁（防止后续正常请求被拦截）
            setTimeout(() => { isHandlingUnauth = false }, 500)
        })
    }
}

function handleClientError(status, res) {
    switch (status) {
        case 400:
            return res?.message || '参数错误，请检查请求参数'
        case 401:
            handleAuthError()
            return '登录已过期或 Token 无效，请重新登录'
        case 404:
            return '请求的资源不存在'
        default:
            return `客户端错误（${status}）：${res?.message || '操作失败'}`
    }
}

function handleServerError(status, res) {
    return `服务器错误（${status}）：${res?.message || '服务器内部异常，请稍后重试'}`
}

// ============================== 拦截器配置 ==============================
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (username) {
            config.headers.username = `Bearer ${username}`
        }
        return config
    },
    error => Promise.reject(error)
)

apiClient.interceptors.response.use(
    response => {
        const { status, data: res } = response
        if (status >= 200 && status < 300) {
            if (typeof res === 'object' && res !== null && 'data' in res) {
                // 业务错误（如401业务码，非HTTP状态码）：同样通过锁处理
                if (res.code === 401 && !isHandlingUnauth) {
                    handleAuthError()
                    ElMessage.error(res.message || '登录已过期，请重新登录')
                } else if (res.code >= 400) {
                    ElMessage.warning(res.message)
                }
                return res.data
            }
            return res
        }

        if (status >= 400 && status < 500) {
            const msg = handleClientError(status, res)
            if (status !== 401) {
                ElMessage.error(msg)
            }
            return Promise.reject(new Error(msg))
        }
        if (status >= 500 && status < 600) {
            const msg = handleServerError(status, res)
            ElMessage.error(msg)
            return Promise.reject(new Error(msg))
        }
        const msg = `未知错误（${status}）：${res?.message || '操作失败'}`
        ElMessage.error(msg)
        return Promise.reject(new Error(msg))
    },
    error => {
        let msg = ''

        if (error.response) {
            const { status, data: res } = error.response
            if (status === 401) {
                handleAuthError()
                msg = '登录已过期或 Token 无效，请重新登录'
            } else if (status >= 400 && status < 500) {
                msg = handleClientError(status, res)
                ElMessage.error(msg)
            } else if (status >= 500) {
                msg = handleServerError(status, res)
                ElMessage.error(msg)
            }
        } else if (error.request) {
            msg = '请求无响应，请检查后端服务或网络是否正常'
            ElMessage.error(msg)
        } else {
            msg = error.message || '请求发送失败，请检查请求配置'
            ElMessage.error(msg)
        }

        return Promise.reject(new Error(msg))
    }
)

// ============================== 封装方法 ==============================
export function get(url, params = {}, config) {
    return apiClient.get(url, { params, ...config })
}

export function post(url, data, config) {
    return apiClient.post(url, data, config)
}

export function put(url, data, config) {
    return apiClient.put(url, data, config)
}

export function del(url, params = {}, config) {
    return apiClient.delete(url, { params, ...config })
}