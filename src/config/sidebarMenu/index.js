/*
 * @Descripttion: 左侧菜单导航
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 21:15:30
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-22 17:48:15
 */
// let teacherInfo = {}
// const teacher = localStorage.getItem('teacher')
// teacherInfo = JSON.parse(teacher) || {} // dutyId: 1-体验课老师， 2-系统课老师

import {
  getAppSubject
} from '@/utils/index'
import musicApp from './music_app'

/**
 * TODO:当前打开项目
 */
const staff = JSON.parse(localStorage.getItem('staff'))
if (staff === null) {
  window.location.replace('/login')
}

const subject = getAppSubject(false)
var menu = null
if (subject === 'music_app') {
  menu = musicApp
}

export default menu
