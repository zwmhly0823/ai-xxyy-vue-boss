/*
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-29 20:16:46
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/router/index.js
 */

const routes = [{
        path: '/trading',
        name: 'trading',
        // hidden: true,
        meta: {
            title: '交易管理',
            icon: 'iconjianyiguanli'
        },
        component: () =>
            import ('../views/order/orderModule.vue')
    },
    {
        path: '/order',
        name: 'order',
        meta: {
            title: '订单管理',
            show: true
        },
        component: () =>
            import ('../views/order/orderModule.vue')
    },
    {
        path: '/financeRefound',
        name: 'financeRefound',
        meta: {
            title: '订单退款',
            show: true
        },
        component: () =>
            import ('../views/financeRefound/financeRefound.vue')
    },
    {
        path: '/invoiceManage',
        name: 'invoiceManage',
        meta: {
            title: '发票管理',
            show: true
        },
        component: () =>
            import ('../views/invoiceManage/index.vue')
    },
    {
        path: '/contractManage',
        name: 'contractManage',
        meta: {
            title: '合同管理',
            keepAlive: false
        },
        component: () =>
            import ('../views/contractManage/index.vue')
    }, {
        path: '/contractManageAdd',
        name: 'contractManageAdd',
        meta: {
            // 新增合同
            title: '合同管理'
        },
        component: () =>
            import ('../views/contractManage/addContract.vue')
    },
]

export default routes