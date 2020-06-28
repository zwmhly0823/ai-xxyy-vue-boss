/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-28 17:09:56
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
    redirect: '/channelManagement'
  },
  {
    path: '/operatingSchedule',
    name: 'operatingSchedule',
    meta: {
      title: '招生排期',
      keepAlive: true
    },
    component: () => import('../views/enrollmentSchedule/index.vue')
  },
  {
    path: '/channelManagement',
    name: 'channelManagement',
    meta: {
      title: '渠道管理',
      keepAlive: false
    },
    component: () => import('../views/channelManagement/channelManagement.vue')
  },
  // 新增、编辑
  {
    path: '/addSchedule/:period/:courseType/',
    name: 'addSchedule',
    meta: {
      title: '新建排期',
      keepAlive: false
    },
    component: () => import('../views/addSchedule/index.vue')
  },
  {
    path: '/scheduleDetail/:period/:courseType/',
    name: 'scheduleDetail',
    meta: {
      title: '排期详情',
      keepAlive: false
    },
    component: () => import('../views/scheduleDetail/index.vue')
  },
  {
    path: '/reviewManagement',
    name: 'reviewManagement',
    meta: {
      title: '点评管理',
      keepAlive: false
    },
    component: () => import('../views/reviewManagement/index.vue')
  },
  {
    path: '/audioAdd',
    name: 'audioAdd',
    meta: {
      title: '点评管理',
      keepAlive: false
    },
    component: () => import('../views/reviewManagement/components/audioAdd.vue')
  },
  {
    path: '/verificationCode',
    name: 'verificationCode',
    meta: {
      title: '验证码查询',
      keepAlive: false
    },
    component: () =>
      import('../views/reviewManagement/components/verificationCode.vue')
  },
  {
    path: '/labelManage',
    name: 'labelManage',
    meta: {
      title: '标签管理',
      keepAlive: false
    },
    component: () => import('../views/labelManage/index.vue')
  },
  {
    path: '/problem',
    name: 'problem',
    meta: {
      title: '标签管理',
      keepAlive: false
    },
    component: () => import('../views/problem/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
