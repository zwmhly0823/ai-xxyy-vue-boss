/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-21 22:22:49
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
    }
  },
  {
    path: '/trialUser',
    name: 'trialUsers',
    meta: {
      title: '体验课学员',
      keepAlive: true
    },
    component: () => import('../views/Users/index.vue')
  },
  {
    path: '/operatingSchedule',
    name: 'operatingSchedule',
    meta: {
      title: '招生排期',
      keepAlive: true
    },
    component: () => import('../views/Operating/index.vue')
  }
  //   {
  //     path: '/system',
  //     name: 'systemUsers',
  //     meta: {
  //       title: '系统课学员',
  //       keepAlive: true
  //     },
  //     component: () => import('../views/usersModule.vue')
  //   },
  //   {
  //     path: '/details/:id',
  //     name: 'detailsUsers',
  //     meta: {
  //       title: '学员详情',
  //       keepAlive: false
  //     },
  //     component: () => import('../views/details/index.vue')
  //   }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  module: 'write_app',
  routes
})

export default router
