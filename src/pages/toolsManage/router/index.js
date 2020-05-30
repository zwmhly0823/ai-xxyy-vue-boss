/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-30 17:42:34
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'toolsManage',
    meta: {
      title: '运营中心',
      icon: 'el-icon-s-platform'
    },
    redirect: '/manage'
  },
  {
    path: '/manage',
    name: 'manage',
    meta: {
      title: '招生排期',
      keepAlive: true
    },
    component: () => import('../views/manage/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'toolsManage',
  routes
})

export default router
