import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Groups from '@/pages/Groups.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Group from '@/pages/Group.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/groups', name: 'Groups', component: Groups, meta: { requiresAuth: true } },
  { path: '/group/:id', name: 'Group', component: Group, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 🔐 Protéger les routes privées
router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (to.meta.requiresAuth && !user) {
        next('/'); // redirige vers la page d'accueil si pas connecté
    } else {
        next(); // autorise la navigation
    }
});

export default router;
