/*
 * @Descripttion: 多科目设置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-20 11:27:55
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-21 12:17:40
 */
// import Cookies from 'js-cookie'

import { subjects, subjectsList } from '@/config/subjects'

const state = {
  subjects,
  subjectsList,
  currentSubjectTitle: '',
  currentSubjectKey: '',
  currentSubject: {}
}

const mutations = {
  GET_SUBJECT: (state) => {
    const pathname = location.pathname.replace(/\//g, '')
    const key = Object.keys(subjects).includes(pathname) ? pathname : 'bear-art'
    console.log(key)

    state.currentSubject = { [`${key}`]: subjects[key] }
    state.currentSubjectKey = key
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
