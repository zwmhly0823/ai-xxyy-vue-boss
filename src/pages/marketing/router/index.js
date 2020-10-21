/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 17:08:18
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-18 17:12:47
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
  //   兑换码列表
  {
    path: '/redeemCode',
    name: 'redeemCode',
    meta: {
      title: '兑换码',
      keepAlive: true
    },
    component: () => import('../views/redeemCode/index.vue')
  },
  //   兑换码 - 码库 @status: 1-有效 0-失效
  {
    path: '/redeemCodeLibrary/:id/:status',
    name: 'redeemCodeLibrary',
    meta: {
      title: '兑换码 / 码库',
      keepAlive: true
    },
    component: () => import('../views/redeemCode/library.vue')
  },
  {
    path: '/coupon',
    name: 'coupon',
    meta: {
      title: '优惠券',
      keepAlive: true
    },
    component: () => import('../views/coupon/index.vue')
  },
  {
    path: '/grantRule/:couponId',
    name: 'grantRule',
    meta: {
      title: '定向发放配置',
      keepAlive: true
    },
    component: () => import('../views/coupon/grantRule.vue')
  }
  //   创建兑换码
  //   {
  //     path: '/addRedeemCode',
  //     name: 'addRedeemCode',
  //     meta: {
  //       title: '创建兑换码',
  //       keepAlive: true
  //     },
  //     component: () => import('../views/redeemCode/add.vue')
  //   }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  module: 'marketing',
  routes
})

export default router
