/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:17:45
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 17:47:40
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import '@/plugins/element-ui'

import api from '@/api'
Vue.config.productionTip = false

Object.assign(Vue.prototype, {
  $http: api
  //
})

const _Vue = new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')

window._Vue = _Vue
