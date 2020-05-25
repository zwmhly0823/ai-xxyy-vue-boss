/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-26 19:11:56
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-19 17:38:29
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 就是自己根Vue实例的路由
  {
    path: '/',
    name: 'finance',
    meta: {
      title: '财务',
      icon: 'el-icon-s-finance'
    },
    redirect: '/financeRefound'
    // 子路由
  },
  {
    path: '/financeRefound',
    name: 'financeRefound',
    meta: {
      title: '财务退款',
      keepAlive: true
    },
    component: () => import('../views/financeRefound.vue')
  }
]
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'approval',
  routes
})

export default router
