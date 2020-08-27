/*
 * @Descripttion: 美术宝写字项目
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:03:32
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-27 17:17:18
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import '@/plugins/element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/styles/index.scss' // global css

import $http from '@/api' // global
import { getAppSubject, getAppSubjectCode } from '@/utils'

Vue.config.productionTip = false

const $subject = {
  key: getAppSubject(), // 大写 ’WRITE_APP‘
  lowerKey: getAppSubject(false), // 小写 ’WRITE_APP‘
  code: getAppSubjectCode() // code: 0,1,2
}

Object.assign(Vue.prototype, {
  $http,
  $subject
})

const _Vue = new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')

window._Vue = _Vue
