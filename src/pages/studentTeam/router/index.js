/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-28 22:34:17
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
    redirect: '/trialTeam'
    // component: () => import('../views/studentTeam/student.vue')
  },
  {
    path: '/trialTeam', // 体验课班级
    name: 'trialTeam',
    meta: {
      title: '体验课班级',
      keepAlive: true
    },
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "student" */ '../views/trialTeam/index.vue')
  },
  {
    path: '/systemTeam', // 系统课班级
    name: 'systemTeam',
    meta: {
      title: '系统课班级',
      keepAlive: true
    },
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "student" */ '../views/systemTeam/index.vue')
  },
  {
    path: '/teamDetail/:id/:type', // 班级详情
    name: 'teamDetail',
    meta: {
      title: '班级中心'
    },
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "student" */ '../views/teamDetail/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'student-team',
  routes
})

export default router
