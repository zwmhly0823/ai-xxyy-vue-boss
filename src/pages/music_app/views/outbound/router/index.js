/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-31 17:53:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-17 16:23:42
 */


// 工具类路由
const routes = [
  {
    path: '/CallRecord',
    name: 'CallRecord',
    meta: {
      title: '通话记录',
      keepAlive: true
    },

    component: () => import('../views/callRecord/index.vue')
  },
  {
    path: '/CallCenter',
    name: 'CallCenter',
    meta: {
      title: '席位配置',
      keepAlive: true
    },

    component: () => import('../views/callCenter/index.vue')
  }
]


export default routes