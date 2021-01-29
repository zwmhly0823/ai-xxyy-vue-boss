/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 17:04:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-17 18:52:26
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '../art_app/views/approval/node_modules/@/store'
import '../art_app/views/approval/node_modules/@/plugins/element-ui'
import '../art_app/views/approval/node_modules/normalize.css/normalize.css' // A modern alternative to CSS resets
import '../art_app/views/approval/node_modules/@/assets/styles/index.scss'

import $http from '../art_app/views/approval/node_modules/@/api' // global css

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
