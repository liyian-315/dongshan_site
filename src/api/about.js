import { get } from './index'

export async function fetchAboutText(params) {
    return get('/api/public/about_text', params);
}