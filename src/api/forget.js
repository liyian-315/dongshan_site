import { post } from './index'


// 提交忘记密码请求（验证验证码 + 发送重置邮件）
export async function forgotPassword(params) {
    return post('/api/auth/forgot-password', params);
}

export async function resetPassword(token, params) {
    return post(`/api/auth/reset-password?token=${token}`, params);
}