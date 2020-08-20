/*
 * @Descripttion: 美术宝写字项目
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:03:32
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-19 22:17:45
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import '@/plugins/element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/styles/index.scss' // global css

import $http from '@/api/index-msb-writing' // global

Vue.config.productionTip = false

Object.assign(Vue.prototype, {
  $http
})

const _Vue = new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')

window._Vue = _Vue
