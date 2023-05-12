import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView';
import ProductView from '../views/ProductView';
import ProductDetailView from '../views/ProductDetailView';
import CompanyView from '../views/CompanyView';
import CompanyDetailView from '../views/CompanyDetailView';
import AccountView from '../views/AccountView';
import AuthView from '../views/AuthView';
import UpdatePasswordView from '../views/UpdatePasswordView';
import AGBView from '../views/AGBView';
import store from '../store/index';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/produkte',
    name: 'ProductView',
    component: ProductView,
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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    name: 'AuthView',
    component: AuthView,
    meta: {
      footer: false,
    },
  },
  {
    path: '/update-password',
    name: 'UpdatePasswordView',
    component: UpdatePasswordView,
    meta: {
      footer: false,
    },
  },
  {
    path: '/agb',
    name: 'AGBView',
    component: AGBView,
  },
  {
    path: '/qr1',
    redirect: '/',
  },
  {
    path: '/qr2',
    redirect: '/account',
  },
  {
    path: '/:companyalias',
    component: CompanyDetailView
  },
  {
    path: '/:company/:productid',
    component: ProductDetailView
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('navbarToggler').classList.remove('show');
  },
});

router.beforeEach((to, from, next) => {
  // get current user info
  const user = store.getters.getUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  
  if (requiresAuth && user == null)
    next({ path: 'auth', query: { redirect: to.fullPath } });
  else if (to.name == 'AuthView' && user != null) next({ path: 'account' });
  else if (!requiresAuth && user != null) next();
  else next();
});


export default router;
