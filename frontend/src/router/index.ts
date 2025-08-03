import { createRouter, createWebHistory } from 'vue-router'
import EmployeesPage from '@/views/EmployeesPage.vue'
import StatisticsPage from '@/views/StatisticsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/employees'
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesPage
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage
    }
  ],
})

export default router
