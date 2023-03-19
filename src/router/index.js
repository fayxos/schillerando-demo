import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView'
import ProduktView from '../views/ProduktView'
import CompanyView from '../views/CompanyView'
import AccountView from '../views/AccountView'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/produkte',
    name: 'ProduktView',
    component: ProduktView,
  },
  {
    path: '/unternehmen',
    name: 'CompanyView',
    component: CompanyView,
  },
  {
    path: '/account',
    name: 'AccountView',
    component: AccountView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
