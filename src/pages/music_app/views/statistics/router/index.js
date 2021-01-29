/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-13 22:07:00
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
    redirect: '/priodPerformance'
  },
  {
    path: '/priodPerformance',
    name: 'priodPerformance',
    meta: {
      title: '按期情况汇总',
      keepAlive: false
    },
    component: () => import('../views/priodPerformance/index.vue')
  },
  {
    path: '/salesPerformance',
    name: 'salesPerformance',
    meta: {
      title: '销售过程分析',
      keepAlive: false
    },
    component: () => import('../views/salesPerformance/index.vue')
  },
  {
    path: '/salesProcess',
    name: 'salesProcess',
    meta: {
      title: '销售业绩分析',
      keepAlive: true
    },
    component: () => import('../views/salesProcess/index.vue')
  },
  {
    path: '/behavior',
    name: 'behavior',
    meta: {
      title: '行为轨迹',
      keepAlive: true
    },
    component: () => import('../views/behavior/index.vue')
  },
  {
    path: '/learnRecord',
    name: 'learnRecord',
    meta: {
      title: '学习记录',
      keepAlive: true
    },
    component: () => import('../views/learnRecord/index.vue')
  },
  {
    path: '/recordTrialDetails/:id/:course_id/:sup/:lesson_type',
    name: 'recordTrialDetails',
    meta: {
      title: '学习记录详情',
      keepAlive: true
    },
    component: () => import('../views/learnRecord/recordTrialDetails.vue')
  },
  {
    path: '/recordSystemDetails/:id/:course_id/:sup/:lesson_type',
    name: 'recordSystemDetails',
    meta: {
      title: '学习记录详情',
      keepAlive: true
    },
    component: () => import('../views/learnRecord/recordSystemDetails.vue')
  },
  {
    path: '/systemJoinCourseLog',
    name: 'systemJoinCourseLog',
    meta: {
      title: '参课统计',
      keepAlive: true
    },
    component: () => import('../views/systemJoinCourseLog/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
