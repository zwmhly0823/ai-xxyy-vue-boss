/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-31 17:53:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-12-09 15:19:58
 */

// 工具类路由
const routes = [
  // 二级路由
  {
    path: '/',
    name: 'complaint',
    meta: {
      title: '投诉中心',
      icon: 'el-icon-menu'
    },
    redirect: '/complaint'
    // 子路由
  },
  {
    path: '/complaint',
    name: 'complaint',
    meta: {
      title: '投诉中心',
      keepAlive: true
    },

    component: () => import('../views/complaintCenter/index.vue')
  }
]


export default routes
