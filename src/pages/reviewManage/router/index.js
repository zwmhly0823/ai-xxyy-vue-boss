/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-29 22:32:44
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-04 17:17:27
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'review-manage',
    meta: {
      title: '点评管理',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    redirect: '/schedule'
  },
  {
    path: '/schedule', // 体验课班级
    name: 'parttimeScheduleList',
    meta: {
      title: '兼职老师分配',
      keepAlive: true
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/parttimeSchedule/index.vue'
      )
  },
  // type: add, edit
  {
    path: '/scheduleSet/:type',
    name: 'parttimeScheduleSet',
    meta: {
      title: '兼职老师分配',
      keepAlive: true
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/parttimeSchedule/add/teamSet.vue'
      )
  },
  // term:期数，type:add-新增，edit-编辑
  {
    path: '/scheduleTeacherSet/:term/:type',
    name: 'parttimeScheduleTeacherSet',
    meta: {
      title: '兼职老师分配',
      keepAlive: false
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/parttimeSchedule/add/teacherSet.vue'
      )
  },
  // 查看详情-班级配置
  {
    path: '/scheduleSetView/:term',
    name: 'parttimeScheduleSetView',
    meta: {
      title: '兼职老师分配',
      keepAlive: true
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/parttimeSchedule/view/teamSet.vue'
      )
  },
  // 查看详情-兼职老师配置
  {
    path: '/scheduleTeacherSetView/:term',
    name: 'parttimeScheduleTeacherSetView',
    meta: {
      title: '兼职老师分配',
      keepAlive: false
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/parttimeSchedule/view/teacherSet.vue'
      )
  },
  {
    path: '/dataprepare',
    name: 'dataprepareList',
    meta: {
      title: '兼职老师数据看板',
      keepAlive: true
    },
    hidden: true,
    component: () =>
      import(
        /* webpackChunkName: "student" */ '../views/parttimeDataPrepare/index.vue'
      )
  },
  {
    path: '/parttimeHandover',
    name: 'parttimeHandover',
    meta: {
      title: '兼职老师移交学员',
      keepAlive: false
    },
    component: () => import('../views/parttimeHandover/index.vue')
  },
  /**
   * 真人点评配置
   */
  {
    path: '/realReviewSchedule',
    name: 'realReviewSchedule',
    meta: {
      title: '真人点评配置',
      keepAlive: true
    },
    hidden: true,
    component: () => import('../views/realReviewSchedule/index.vue')
  },
  // 新增or编辑  type: add, edit
  {
    path: '/realReviewScheduleSet/:type',
    name: 'realReviewScheduleSet/:type',
    meta: {
      title: '真人点评配置',
      keepAlive: true
    },
    hidden: true,
    component: () => import('../views/realReviewSchedule/set/index.vue')
  },
  // 查看详情 term: 期数
  {
    path: '/realReviewScheduleView/:term',
    name: 'realReviewScheduleView',
    meta: {
      title: '真人点评配置',
      keepAlive: true
    },
    component: () => import('../views/realReviewSchedule/view/index.vue')
  },
  {
    path: '/reviewManagement',
    name: 'reviewManagement',
    meta: {
      title: '作品点评',
      keepAlive: false
    },
    component: () => import('../../operating/views/reviewManagement')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'review-manage',
  routes
})

export default router
