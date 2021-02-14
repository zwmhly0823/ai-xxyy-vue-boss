/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-26 19:11:56
 * @LastEditors: liukun
 * @LastEditTime: 2021-02-02 18:10:03
 */


// 工具类路由
const routes = [
  {
    path: '/approval',
    name: 'approval',
    meta: {
      title: '审批中心',
      keepAlive: false
    },
    component: () => import('../approvalCenter/index.vue')
  },
  {
    path: '/moneyBack',
    name: 'moneyBack',
    meta: {
      title: '退款',
      keepAlive: false
    },
    component: () => import('../approvalCenter/components/moneyBack.vue')
  },
  {
    path: '/repair',
    name: 'repair',
    meta: {
      title: '补发货',
      keepAlive: false
    },
    component: () => import('../approvalCenter/components/repair.vue')
  },
  {
    path: '/approval/adjust',
    name: 'adjust',
    meta: {
      title: '系统课调整'
    },
    component: () =>
      import(
        /* webpackChunkName: "adjust" */
        '../approvalCenter/components/adjustClass.vue'
      )
  },
  {
    path: '/approvalGift',
    name: 'approvalGift',
    meta: {
      title: '赠品',
      keepAlive: false
    },
    component: () => import('../approvalCenter/components/approvalGift.vue')
  },
  {
    path: '/approval/mergeboxes',
    name: 'mergeboxes',
    meta: {
      title: '随材打包'
    },
    component: () =>
      import(
        /* webpackChunkName: "mergeboxes" */
        '../approvalCenter/views/mergeBoxes.vue'
      )
  }
]


export default routes
