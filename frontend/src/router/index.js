import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Groups from '@/pages/Groups.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Group from '@/pages/Group.vue'

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
    },

    {
        path: '/group/:id',
        name: 'Group',
        component: Group
    },

    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
