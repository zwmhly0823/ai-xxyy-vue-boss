/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-25 15:25:13
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-15 17:16:34
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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
    redirect: '/trial'
  },
  {
    path: '/trial',
    name: 'trialUsers',
    meta: {
      title: '体验课学员',
      keepAlive: true
    },
    component: () => import('../views/usersModule.vue')
  },
  {
    path: '/system',
    name: 'systemUsers',
    meta: {
      title: '系统课学员',
      keepAlive: true
    },
    component: () => import('../views/usersModule.vue')
  },
  {
    path: '/allUsers',
    name: 'allUsers',
    meta: {
      title: '全部学员',
      keepAlive: false
    },
    component: () => import('../views/usersModule.vue')
  },
  {
    path: '/details/:id',
    name: 'detailsUsers',
    meta: {
      title: '学员详情',
      keepAlive: false
    },
    component: () => import('../views/details/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'trading',
  routes
})

export default router
