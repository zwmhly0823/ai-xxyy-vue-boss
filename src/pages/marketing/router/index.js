/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 17:08:18
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-06 20:29:54
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'marketing',
    meta: {
      title: '营销中心',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    redirect: '/redeemCode'
  },
  //   兑换码
  {
    path: '/redeemCode',
    name: 'redeemCode',
    meta: {
      title: '兑换码',
      keepAlive: true
    },
    component: () => import('../views/redeemCode/index.vue')
  },
  //   兑换码 - 码库
  {
    path: '/redeemCodeLibrary/:id',
    name: 'redeemCodeLibrary',
    meta: {
      title: '兑换码 / 码库',
      keepAlive: true
    },
    component: () => import('../views/redeemCode/library.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  module: 'marketing',
  routes
})

export default router
