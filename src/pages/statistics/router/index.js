/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-24 17:39:14
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'statistics',
    meta: {
      title: '统计分析',
      icon: 'el-icon-s-platform'
    },
    redirect: '/salesPerformance'
  },
  {
    path: '/salesPerformance',
    name: 'salesPerformance',
    meta: {
      title: '按期情况汇总',
      keepAlive: true
    },
    component: () => import('../views/salesPerformance/index.vue')
  },
  {
    path: '/salesProcess',
    name: 'salesProcess',
    meta: {
      title: '销售过程分析',
      keepAlive: true
    },
    component: () => import('../views/salesProcess/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
