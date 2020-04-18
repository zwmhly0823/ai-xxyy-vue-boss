/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-11 16:06:42
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-16 15:28:07
 */
const state = {
  whackId: '0,1,2,3,6',
  bransh: false,
  disableClick: false
}
const mutations = {
  getLeftBar(state, id) {
    state.whackId = id
  },
  bransh(state, bool) {
    state.bransh = bool
  },
  getShowStatus(state, bool) {
    state.disableClick = bool
    console.log(state.disableClick, '==========disableClick')
  }
}
const actions = {
  getLeftBarId(context, id) {
    context.commit('getLeftBar', id)
    console.log(context, '-------------id', id)
  }
}

export default {
  state,
  mutations,
  actions
}
