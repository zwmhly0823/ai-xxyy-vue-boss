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

import { getAppSubject } from '@/utils/index'
import artApp from './art_app'
import writeApp from './write_app'
import musicApp from './music_app'

/**
 * TODO:当前打开项目
 */
const subject = getAppSubject(false)
let menu = artApp
if (subject === 'artApp') {
  menu = artApp
}
if (subject === 'write_app') {
  menu = writeApp
}
if (subject === 'music_app') {
  menu = musicApp
}

export default menu
