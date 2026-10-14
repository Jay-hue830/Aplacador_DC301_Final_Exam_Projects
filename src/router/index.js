import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import RequirementsPage from '../pages/RequirementsPage.vue'
import HazardManagerPage from '../pages/HazardManagerPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/requirements',
    name: 'requirements',
    component: RequirementsPage
  },
  {
    path: '/hazards',
    name: 'hazards',
    component: HazardManagerPage
  },
  {
    path: '/architecture',
    redirect: '/'
  },
  {
    path: '/vue-basics',
    redirect: '/'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
