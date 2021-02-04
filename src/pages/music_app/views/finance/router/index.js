/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-26 19:11:56
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-26 23:42:01
 */

const routes = [
  // 就是自己根Vue实例的路由
  {
    path: '/',
    name: 'finance',
    meta: {
      title: '财务',
      icon: 'el-icon-s-finance'
    },
    redirect: '/financeRefound'
    // 子路由
  },
  {
    path: '/financeRefound',
    name: 'financeRefound',
    meta: {
      title: '财务退款',
      keepAlive: true
    },
    component: () => import('../views/financeRefound.vue')
  }
]

export default routes
