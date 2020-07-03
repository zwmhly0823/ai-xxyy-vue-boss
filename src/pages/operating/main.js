import Vue from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import router from './router'
import store from '@/store'
import '@/plugins/element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/lazy.css' // lazy css
import error from '@/assets/images/error.png'
import loading from '@/assets/images/loading.gif'
import directives from './directives.js'

import $http from '@/api' // global css

Vue.use(VueLazyload, {
  preLoad: 1,
  error: error,
  loading: loading,
  attempt: 2
})
Vue.use(directives)
Vue.config.productionTip = false

Object.assign(Vue.prototype, {
  $http
  //
})

const _Vue = new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')

window._Vue = _Vue
