import {post, put} from './index'

export function updatePersonInfo(params) {
    return put('/api/auth/updatePersonInfo',params)
}


export async function registerUser(params) {
    return post('/api/auth/register',params)
}

export async function personInfo(params) {
    return post('/api/auth/personInfo',params)
}

export async function login(params) {
    return post('/api/auth/login',params)
}