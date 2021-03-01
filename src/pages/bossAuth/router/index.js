
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'boss-auth',
    meta: {
      title: 'boss权限',
      icon: 'el-icon-s-custom',
      keepAlive: true
    },
    redirect: '/systemAccount'
  },
  {
    path: '/systemAccount',
    name: 'systemAccount',
    meta: {
      title: '系统账号',
      keepAlive: false
    },
    component: () => import('../views/systemAccount/index.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  module: 'boss-auth',
  routes
})

export default router
