/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-29 20:11:08
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'trading',
    meta: {
      title: '交易',
      icon: 'el-icon-s-custom'
    },
    redirect: '/order'
  },
  // {
  //   path: '/express',
  //   name: 'express',
  //   meta: {
  //     title: '物流',
  //     keepAlive: false
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "expressModule" */
  //       '../views/express/expressModule.vue'
  //     )
  // },
  {
    path: '/order',
    name: 'order',
    meta: {
      title: '订单',
      keepAlive: false
    },
    component: () =>
      import(
        /* webpackChunkName: "orderModule" */
        '../views/order/orderModule.vue'
      )
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'trading',
  routes
})

export default router
