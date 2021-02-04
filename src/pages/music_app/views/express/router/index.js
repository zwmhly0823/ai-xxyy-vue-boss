/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-05-18 16:51:39
 * @LastEditors: zhouzebin
 * @LastEditTime: 2020-07-11 15:59:42
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'express',
    meta: {
      title: '物流',
      icon: 'el-icon-s-custom'
    },
    redirect: '/expressCenter'
  },
  {
    path: '/expressCenter',
    name: 'expressCenter',
    meta: {
      title: '物流管理',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "expressCenter" */
        '../views/expressCenter/index.vue'
      )
  },
  {
    path: '/experienceClass',
    name: 'experienceClass',
    meta: {
      title: '体验课物流',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "experienceClass" */
        '../views/experienceClass/index.vue'
      )
  },
  {
    path: '/activityClass',
    name: 'activityClass',
    meta: {
      title: '活动物流',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "activityClass" */
        '../views/activityClass/index.vue'
      )
  },
  {
    path: '/systemClass',
    name: 'systemClass',
    meta: {
      title: '系统课物流',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "systemClass" */
        '../views/systemClass/system.vue'
      )
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'express',
  routes
})

export default router
