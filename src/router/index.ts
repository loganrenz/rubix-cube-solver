import { createRouter, createWebHistory } from 'vue-router';

const CubeSolver = () => import('../pages/CubeSolver.vue');
const NameWheel = () => import('../pages/NameWheel.vue');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: CubeSolver },
        { path: '/wheel', name: 'NameWheel', component: NameWheel }
    ],
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;
