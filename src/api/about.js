import { get } from './index'

export async function fetchAboutText(params) {
    return get('/api/about_text', params);
}