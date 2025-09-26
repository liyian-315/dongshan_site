import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 全局样式 Tailwind
import './style.css'

createApp(App).use(router).use(ElementPlus).mount('#app')