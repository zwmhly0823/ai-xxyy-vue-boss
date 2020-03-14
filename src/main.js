/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:17:45
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 17:47:02
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element-ui components
import './plugins/element-ui'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
