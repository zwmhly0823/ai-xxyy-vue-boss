/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-16 15:16:00
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'noticeCenter',
    meta: {
      title: '通知中心',
      icon: 'el-icon-s-platform'
    },
    redirect: '/noticeHome'
  },
  {
    path: '/noticeHome',
    name: 'noticeHome',
    meta: {
      title: '通知中心',
      keepAlive: false
    },
    component: () => import('../views/noticeHome.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'noticeCenter',
  routes
})

export default router
