/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-31 17:53:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-17 16:23:42
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 工具类路由
const routes = [
  // 二级路由
  {
    path: '/',
    name: 'outbound',
    meta: {
      title: '呼叫中心',
      icon: 'el-icon-menu'
    },
    redirect: '/CallRecord'
    // 子路由
  },
  {
    path: '/CallRecord',
    name: 'CallRecord',
    meta: {
      title: '通话记录',
      keepAlive: true
    },

    component: () => import('../views/callRecord/index.vue')
  },
  {
    path: '/CallCenter',
    name: 'CallCenter',
    meta: {
      title: '席位配置',
      keepAlive: true
    },

    component: () => import('../views/callCenter/index.vue')
  }
]
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'outbound',
  routes
})

export default router
