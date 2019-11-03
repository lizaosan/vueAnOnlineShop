import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Login from './components/pages/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Products from './components/pages/Products.vue'
import CustomerOrder from './components/pages/CustomerOrders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*', // 亂輸入網址會回到 login
      redirect: 'login',
    },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: Home,
    //   meta: { requiresAuth: true }
    // },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products', // 不要再寫斜線
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true }
        },
      ]
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer-order', // 不要再寫斜線
          name: 'CustomerOrder',
          component: CustomerOrder,
        },
      ]
    },
  ]
})
