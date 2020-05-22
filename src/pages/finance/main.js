/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-10 15:07:08
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-10 18:44:50
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import '@/plugins/element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/styles/index.scss' // global css

import $http from '@/api' // global css

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
