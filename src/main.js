import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import { ValidationProvider, extend, ValidationObserver} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { localize } from 'vee-validate';
import zh_TW from 'vee-validate/dist/locale/zh_TW.json';

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
  render: h => h(App),
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

// Register it globally
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

// 繁中化
localize({
  zh_TW
});
localize('zh_TW');

for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zh_TW.messages[rule] // add its message
  });
}

extend('phone', {
  message (fieldName) {
      return `${fieldName} is not a valid phone number`;
  },
  validate (value) {
      return new Promise(resolve => {
          let phone = new PhoneNumber(value);
          resolve({ valid: phone.isValid() })
      });
  }
});