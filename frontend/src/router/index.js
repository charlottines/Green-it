import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Groups from '@/pages/Groups.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },

    {
        path: '/groups',
        name: 'Groups',
        component: Groups
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
