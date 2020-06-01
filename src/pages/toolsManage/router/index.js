/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-30 18:10:16
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'tools-manage',
    meta: {
      title: '工具',
      icon: 'el-icon-s-platform'
    },
    redirect: '/manage'
  },
  {
    path: '/manage',
    name: 'manage',
    meta: {
      title: '标签管理',
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
