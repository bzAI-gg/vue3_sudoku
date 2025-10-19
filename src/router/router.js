import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Level from '../views/Level.vue';
import Setting from '../views/Setting.vue';
import Pojie from '../views/Pojie.vue';
import LevelList from '../views/LevelList.vue';
import Game from '../views/Game.vue';

const routes = [
   { path: '/', name: 'Home', component: Home },
   { path: '/level', name: 'Level', component: Level },
   { path: '/setting', name: 'Setting', component: Setting },
   { path: '/pojie', name: 'Pojie', component: Pojie },
   { path: '/level-list:lv?', name: 'LevelList', component: LevelList , props: true},
   { path: '/game', name: 'Game', component: Game},
];
const router = createRouter({
   history: createWebHistory('/sudoku/'),
   routes,
});
export default router;