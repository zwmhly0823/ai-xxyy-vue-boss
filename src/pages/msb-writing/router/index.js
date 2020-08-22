/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-21 21:46:46
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
  // {
  //   path: '/teacherManagement',
  //   name: 'teacherManagement',
  //   meta: {
  //     title: '员工账号',
  //     keepAlive: true
  //   },
  //   component: () => import('../../')
  // },
  {
    path: '/express',
    name: 'express',
    meta: {
      title: '物流管理',
      keepAlive: true
    },
    component: () => import('../views/express/views/expressCenter/index.vue')
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
  module: 'msb-writing',
  routes
})

export default router
