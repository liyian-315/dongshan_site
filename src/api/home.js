import { get } from './index'

export async function fetchHomeCarousel() {
    return get('/api/public/home_carousel')
}