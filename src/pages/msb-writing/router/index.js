/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-21 15:42:21
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

  /**
   * 运营管理
   */
  {
    path: '/channel',
    name: 'channel',
    meta: {
      title: '渠道管理',
      keepAlive: true
    },
    component: () =>
      import('../views/operating/views/channelManagement/channelManagement.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  module: 'msb-writing',
  routes
})

export default router
