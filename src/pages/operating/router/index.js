/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-14 18:46:10
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'operating',
    meta: {
      title: '运营中心',
      icon: 'el-icon-s-platform'
    },
    redirect: '/enrollmentSchedule'
  },
  {
    path: '/enrollmentSchedule',
    name: 'enrollmentSchedule',
    meta: {
      title: '销售管理',
      keepAlive: true
    },
    component: () => import('../views/enrollmentSchedule/index.vue')
  },
  {
    path: '/addSchedule',
    name: 'addSchedule',
    meta: {
      title: '销售管理',
      keepAlive: false
    },
    component: () => import('../views/addSchedule/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
