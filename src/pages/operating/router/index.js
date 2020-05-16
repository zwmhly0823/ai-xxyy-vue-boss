/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-16 19:22:37
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
    path: '/operatingScheduleDisable',
    name: 'operatingScheduleDisable',
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
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
