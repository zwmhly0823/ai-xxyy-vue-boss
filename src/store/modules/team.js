/**
 * 班级相关
 */

const getDefaultState = () => {
  return {
    // 通过手机号搜索出的用户
    userByPhone: null
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER: (state, user = {}) => {
    state.userByPhone = user
  }
}

const actions = {
  setUser({ commit, state }, user = {}) {
    commit('SET_USER', user)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
