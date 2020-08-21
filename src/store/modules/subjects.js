/*
 * @Descripttion: 多科目设置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-20 11:27:55
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-21 17:11:20
 * 美术APP
  @ApiModelProperty("美术")
  ART_APP, 0
  * 写字APP
  @ApiModelProperty("写字")
  WRITE_APP, 1
  * AI学院
  @ApiModelProperty("AI学院")
  COLLEGE_APP 2
 */
// import Cookies from 'js-cookie'

import { subjects, subjectsList } from '@/config/subjects'

const state = {
  subjects,
  subjectsList,
  subject: '', // 当前科目枚举值ART_APP, WRITE_APP，COLLEGE_APP
  subjectCode: 0, // 当前科目枚举值对应的顺序  0，1，2
  currentSubjectTitle: '',
  currentSubjectKey: '', // 枚举值的小写art_app, write_app
  currentSubject: {}
}

const mutations = {
  GET_SUBJECT: (state) => {
    const pathname = location.pathname.replace(/\//g, '')
    const key = Object.keys(subjects).includes(pathname) ? pathname : 'art_app'
    console.log(key)

    state.currentSubject = { [`${key}`]: subjects[key] }
    state.currentSubjectKey = key
    state.subject = key.toUpperCase()
    state.subjectCode = Object.keys(subjects).findIndex((item) => item === key)
    state.currentSubjectTitle = subjects[key]
  }
}

const actions = {
  getSubject({ commit }) {
    commit('GET_SUBJECT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
