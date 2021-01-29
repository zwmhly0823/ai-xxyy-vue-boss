/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-10 15:07:08
 * @LastEditors: liukun
 * @LastEditTime: 2020-06-02 12:57:14
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '../community/node_modules/@/store'
import '../community/node_modules/@/plugins/element-ui'
import '../community/node_modules/normalize.css/normalize.css' // A modern alternative to CSS resets
import '../community/node_modules/@/assets/styles/index.scss' // global css

import $http from '../community/node_modules/@/api' // global css

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
