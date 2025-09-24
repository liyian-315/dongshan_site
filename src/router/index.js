import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/index.vue'
import NewsCarousel from '@/views/NewsCarousel/index.vue'
import MirrorDownload from '@/views/MirrorDownload/index.vue'
import DocumentDownload from '@/views/DocumentDownload/index.vue'
import About from '@/views/About/index.vue'
import Register from '@/views/Register/index.vue'
import Login from '@/views/Login/index.vue'
import PersonInfo from '@/views/PersonInfo/index.vue'
import Task from '@/views/Task/index.vue'
import DongshanJihua from '@/views/Activity/dongshanjihua.vue'


const routes = [
    { path: '/', component: Home },
    { path: '/home', component: Home },
    { path: '/news', component: NewsCarousel },
    { path: '/docs', component: DocumentDownload },
    { path: '/mirror', component: MirrorDownload },
    { path: '/about', component: About },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/personInfo', component: PersonInfo },
    { path: '/task', component: Task },
    { path: '/activity/dongshanjihua', component: DongshanJihua },
    {
        path: '/service',
        name: 'Service',
        component: () => import('@/views/Policies/Service.vue'),
        meta: { title: '服务条款' }
    },
    {
        path: '/privacy',
        name: 'Privacy',
        component: () => import('@/views/Policies/Privacy.vue'),
        meta: { title: '隐私权政策' }
    },
    {
        path: '/lawanno',
        name: 'LawAnno',
        component: () => import('@/views/Policies/LawAnno.vue'),
        meta: { title: '法律声明' }
    },

]

export default createRouter({
    history: createWebHistory(),
    routes
})


