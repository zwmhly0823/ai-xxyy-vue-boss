/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 15:56:38
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '班级',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    component: () => import('../views/studentTeam/student.vue')
  },
  {
    path: '/student-team', // 班级模块
    name: 'student',
    meta: {
      title: '班级详情',
      icon: 'el-icon-s-custom'
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/studentTeam/student.vue'
      )
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'student-team',
  routes
})

export default router
