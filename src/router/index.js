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
import InternPlan from '@/views/Intern/Plan.vue'


const routes = [
    { path: '/intern/plan', component: InternPlan },
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
        path: '/events',
        name: 'Events',
        component: () => import('@/views/Events/index.vue'),
        meta: {title: '活动'}
    },
    {
        path: '/events/:slug',
        name: "EventDetail",
        component: () => import('@/views/Events/Detail.vue'),
        props: true,
        meta: {title: "活动详情"}
    },
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
    {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/OpenSourceProjects/index.vue'),
        meta: { title: '开源项目介绍' },
        children: [
            // 项目列表（默认子路由）
            {
                path: '', // 空路径，作为默认子路由
                name: 'ProjectList',
                component: () => import('@/views/OpenSourceProjects/ProjectList.vue'),
                meta: { title: '项目列表' }
            },
            // 项目详情
            {
                path: ':id',
                name: 'ProjectDetail',
                component: () => import('@/views/OpenSourceProjects/OneProject.vue'),
                meta: { title: '项目详情' },
                props: true
            }
        ]
    },
]

export default createRouter({
    history: createWebHistory(),
    routes
})


