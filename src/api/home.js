import { get } from './index'

export async function fetchHomeCarousel() {
    return get('/api/public/home_carousel')
}

export async function fetchHomeProjects() {
    return get('/api/public/home_projects')
}

export async function fetchHomeEvents() {
    return get('/api/public/home_events')
}