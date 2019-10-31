import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
// 上面通常載入 npm 的套件內容

import App from './App.vue'
import router from './router'
import './bus';
import currencyFilter from './filters/currency'
// 下面通常載入 自定義 的套件內容
 
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter)

axios.defaults.withCredentials = true;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next);
  if (to.meta.requiresAuth) { // 如果下個頁面的 meta.requirsAuth 為 true
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check` //'https://vue-course-api.hexschool.io/api/lizaosan/products';
    axios.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
  // to and from are both route objects. must call `next`.
})