/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:26:32
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-25 22:11:13
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

// 小度活动
import active from '../views/active/index.vue';
// 审批中心
import approval from '../views/approval/router';
// 运营管理
import {
    operatingRoutes,
    operatingSchedule,
    operatingUploadList,
    operatingMobile
} from '../views/operating/router';
// 体验课系统班级（新版）、班级管理
import studentTeam from '../views/studentTeam/router';
// 交易管理
import trad from '../views/trading/router'
// 学员中心
import users from '../views/users/router'
// 财务
import finance from '../views/finance/router'
// 投诉中心
import complaint from '../views/complaint/router'
// 呼叫中心
import outbound from '../views/outbound/router'
import express from '../views/express/router'
// 数据中心
import statistics from '../views/statistics/router'
const staff = JSON.parse(localStorage.getItem('staff'))

let superOperatingRouter = []
let uploadFilePeimission = []
    // 管理员、
const adminRouter = []

uploadFilePeimission = operatingUploadList
    // 超级管理员权限
    // if (staff.roleId === '7') {
superOperatingRouter = [
        ...operatingSchedule,
        ...operatingMobile
    ]
    // }
    // 管理员权限
    // if (staff.roleId === '1') {
adminRouter.push(operatingMobile[0])
    // }
Vue.use(VueRouter)

const routes = [{
        path: '/Active',
        name: 'Active',
        meta: {
            title: '小度活动',
            style: 'line'
        },
        component: active
    },
    ...uploadFilePeimission,
    ...superOperatingRouter,
    ...adminRouter,
    ...approval,
    ...operatingRoutes,
    ...studentTeam,
    ...trad,
    ...users,
    ...finance,
    ...complaint,
    ...outbound,
    ...express
]
const router = new VueRouter({
    base: process.env.BASE_URL,
    moudle: 'music_app',
    routes
})

export default router