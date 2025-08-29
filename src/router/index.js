import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/index.vue'
import NewsCarousel from '@/views/NewsCarousel/index.vue'
import MirrorDownload from '@/views/MirrorDownload/index.vue'
import DocumentDownload from '@/views/DocumentDownload/index.vue'

const routes = [
    { path: '/', component: Home },
    // { path: '/lab', component: () => import('@/pages/LabIntro.vue') },
    { path: '/news', component: NewsCarousel },
    { path: '/docs', component: DocumentDownload },
    { path: '/mirror', component: MirrorDownload },
    // { path: '/about', component: () => import('@/pages/About.vue') },
]

export default createRouter({
    history: createWebHistory(),
    routes
})
