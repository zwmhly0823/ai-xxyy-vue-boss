/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-25 15:25:13
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-01 19:42:09
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let teacherInfo = {}
const teacher = localStorage.getItem('teacher')
if (teacher) {
  teacherInfo = JSON.parse(teacher) || {} // dutyId: 1-体验课老师， 2-系统课老师
}

const routes = [
  {
    path: '/',
    name: 'users',
    meta: {
      title: '学员中心',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    // TOSS,根据老师角色跳转
    redirect: teacherInfo.dutyId === '1' ? '/trial' : '/system'
  },
  {
    path: '/trial',
    name: 'trialUsers',
    meta: {
      title: '体验课学员',
      keepAlive: true
    },
    component: () => import('../views/usersModule.vue')
  }
  // {
  //   path: '/system',
  //   name: 'systemUsers',
  //   meta: {
  //     title: '系统课学员',
  //     keepAlive: true
  //   },
  //   component: () => import('../views/usersModule.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'trading',
  routes
})

export default router
