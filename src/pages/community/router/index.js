/*
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-16 17:04:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 18:50:11
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'community',
    meta: {
      title: '物流',
      icon: 'el-icon-s-custom'
    },
    redirect: '/groupSop'
  },
  {
    path: '/groupSop',
    name: 'groupSop',
    meta: {
      title: '群sop',
      icon: 'el-icon-s-custom',
      keepAlive: false
    },
    component: () => import('../views/index/index.vue')
  },
  {
    path: '/newSoptmp',
    name: 'newSoptmp',
    meta: {
      title: '群sop',
      icon: 'el-icon-s-custom',
      keepAlive: false
    },
    component: () => import('../views/newSopTmp/index.vue')
  }
]

const router = new VueRouter({
  module: 'community',
  base: process.env.BASE_URL,
  routes
})

export default router
