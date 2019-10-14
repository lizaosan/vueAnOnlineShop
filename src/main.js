import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
 
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

axios.defaults.withCredentials = true;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next)

  if (to.meta.requiresAuth) { // 如果持續登入為 true
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check` //'https://vue-course-api.hexschool.io/api/lizaosan/products';
    const vm = this;
    axios.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        })
      }
    });
  } else {
    next();
  }
  // to and from are both route objects. must call `next`.
})