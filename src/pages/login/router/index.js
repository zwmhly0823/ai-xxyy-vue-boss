/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-16 20:12:27
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登录',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    component: () => import('../views/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
