/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-25 11:23:44
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
var systemAccount = []

const routes = [{
    path: '/',
    name: 'teacher',
    meta: {
      title: '社群销售',
      icon: 'el-icon-s-custom'
    },
    redirect: '/teacherManagement'
  },
  {
    path: '/teacherManagement',
    name: 'teacherManagement',
    meta: {
      title: '销售管理',
      keepAlive: true
    },
    component: () =>
      import(
        /* webpackChunkName: "teacherManagement" */
        '../views/teacherManagement/teacherManage.vue'
      )
  },
  {
    path: '/weixinManagement',
    name: 'weixinManagement',
    meta: {
      title: '微信管理',
      keepAlive: false
    },
    component: () => import('../views/weixinManagement/accountManagement.vue')
  },
  {
    path: '/workHandover',
    name: 'workHandover',
    meta: {
      title: '工作交接',
      keepAlive: false
    },
    component: () => import('../views/workHandover/index.vue')
  },
  {
    path: '/workHandover/partTimeTeacher',
    name: 'partTimeTeacher',
    meta: {
      title: '兼职老师交接',
      keepAlive: false
    },
    component: () => import('../views/workHandover/components/partTeacher.vue')
  },
  {
    path: '/loginRecord',
    name: 'loginRecord',
    meta: {
      title: '操作日志',
      icon: 'el-icon-s-custom',
      keepAlive: false
    },
    component: () => import('../views/loginRecord/index.vue')
  },
  {
    path: '/wechatWaterArmy',
    name: 'wechatWaterArmy',
    meta: {
      title: '水军微信',
      keepAlive: false
    },
    component: () => import('../views/wechatWaterArmy/index.vue')
  },
  {
    path: '/backstageSql',
    name: 'backstageSql',
    meta: {
      title: 'app升级管理',
      keepAlive: false
    },
    component: () => import('../views/backstageSql/index.vue')
  },
  ...systemAccount
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
