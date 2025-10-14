import {post, put, get, del} from './index'

export async function sendEmailVerificationCode(email) {
    return get(`/api/public/sendEmail/${email}`);
}


export function getPdfCopyWriting(params) {
    return get('/api/public/getPdfCW',params)
}


export function updatePersonInfo(params) {
    return put('/api/updatePersonInfo',params)
}

export async function registerUser(params) {
    return post('/api/auth/register',params)
}

export async function personInfo(params) {
    return post('/api/personInfo',params)
}

export async function login(params) {
    return post('/api/auth/login',params)
}

export async function selectUser(params) {
    return post('/api/admin/select_user', params)
}

export async function updateUser(data) {
    return post('/api/admin/update_user', data)
}

export async function deleteUser(id) {
    return del('/api/admin/delete_user', {
        id: id
    })
}