/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-03 15:58:22
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
    path: '/pushConfig',
    name: 'pushConfig',
    meta: {
      title: '推送配置',
      keepAlive: false
    },
    component: () => import('../views/pushConfig/index.vue')
  },
  {
    path: '/changePhoneNumber',
    name: 'changePhoneNumber',
    meta: {
      title: '手机号替换',
      keepAlive: false
    },
    component: () => import('../views/changePhoneNumber/index.vue')
  },
  {
    path: '/problem',
    name: 'problem',
    meta: {
      title: '问卷管理',
      keepAlive: false
    },
    component: () => import('../views/problem/index.vue')
  },
  {
    path: '/issueBearCoins',
    name: 'issueBearCoins',
    meta: {
      title: '发放小熊币',
      keepAlive: false
    },
    component: () => import('../views/issueBearCoins/index.vue')
  },
  {
    path: '/recommend',
    name: 'recommend',
    meta: {
      title: '转介绍截图审批',
      keepAlive: false
    },
    component: () => import('../views/recommend/changeRecommend.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'teacher',
  routes
})

export default router
