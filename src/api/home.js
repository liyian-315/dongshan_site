import { get } from './index'

export async function fetchHomeCarousel() {
    return get('/api/home_carousel')
}