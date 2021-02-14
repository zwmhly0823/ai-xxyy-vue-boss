/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-26 19:11:56
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-20 13:42:24
 */

const routes = [{
    path: '/approval',
    name: 'approval',
    alias: '/approvalCenter',
    meta: {
      title: '审批中心',
      keepAlive: false
    },
    component: () => import('../approvalCenter/index.vue'),
  },
  {
    path: '/moneyBack',
    name: 'moneyBack',
    meta: {
      title: '退款审批',
      keepAlive: false
    },
    component: () => import('../approvalCenter/components/moneyBack.vue')
  },
  {
    path: '/repair',
    name: 'repair',
    meta: {
      title: '补发货审批',
      keepAlive: false
    },
    component: () => import('../approvalCenter/components/repair.vue')
  },
  {
    path: '/adjust',
    name: 'adjust',
    meta: {
      title: '审批中心'
    },
    component: () =>
      import(
        /* webpackChunkName: "adjust" */
        '../approvalCenter/components/adjustClass.vue'
      )
  },
  {
    path: '/mergeboxes',
    name: 'mergeboxes',
    meta: {
      title: '审批中心'
    },
    component: () =>
      import(
        /* webpackChunkName: "mergeboxes" */
        '../approvalCenter/views/mergeBoxes.vue'
      )
  }

]

export default routes
