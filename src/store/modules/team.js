/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-05-16 19:12:45
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-27 22:20:31
 */
/**
 * 班级相关
 */

const state = {
  userByPhone: null,
  teamItem: {}
}

const mutations = {
  SET_USER: (state, user = {}) => {
    state.userByPhone = user
  },
  setTeamItem: (state, teamInfo = {}) => {
    state.teamItem = teamInfo
  }
}

const actions = {
  setUser({ commit }, user = {}) {
    commit('SET_USER', user)
  }
}

export default {
  // namespaced: true,
  state,
  mutations,
  actions
}
