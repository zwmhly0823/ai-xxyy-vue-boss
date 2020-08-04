/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-31 17:53:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-07-31 18:12:56
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 工具类路由
const routes = [
  // 二级路由
  {
    path: '/',
    name: 'CallCenter',
    meta: {
      title: '呼叫中心',
      icon: 'el-icon-menu'
    },
    redirect: '/callCenter'
    // 子路由
  },
  {
    path: '/CallCenter',
    name: 'CallCenter',
    meta: {
      title: '席位配置',
      keepAlive: false
    },
    component: () => import('../callCenter/index.vue')
  }
]
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'outbound',
  routes
})

export default router
