/*
 * @Descripttion: 左侧菜单导航
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 21:15:30
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-21 16:31:09
 */
// let teacherInfo = {}
// const teacher = localStorage.getItem('teacher')
// teacherInfo = JSON.parse(teacher) || {} // dutyId: 1-体验课老师， 2-系统课老师

import artApp from './art_app'
import writeApp from './write_app'

import { subjects } from '../subjects'

/**
 * TODO:当前打开项目
 */
const pathname = location.pathname.replace(/\//g, '')
let currentSubject = 'art_app'
if (Object.keys(subjects).includes(pathname)) {
  currentSubject = pathname
}

let menu = artApp
if (currentSubject === 'write_app') {
  menu = writeApp
}

export default menu
