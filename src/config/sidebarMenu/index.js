/*
 * @Descripttion: 左侧菜单导航
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 21:15:30
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-19 22:27:20
 */
// let teacherInfo = {}
// const teacher = localStorage.getItem('teacher')
// teacherInfo = JSON.parse(teacher) || {} // dutyId: 1-体验课老师， 2-系统课老师

import bearArt from './bear-art'
import msbWriting from './msb-writing'

import { subjects } from '../subjects'

/**
 * TODO:当前打开项目
 */
const pathname = location.pathname.replace(/\//g, '')
let currentSubject = 'bear-art'
if (Object.keys(subjects).includes(pathname)) {
  currentSubject = pathname
}

let menu = bearArt
if (currentSubject === 'msb-writing') {
  menu = msbWriting
}

export default menu
