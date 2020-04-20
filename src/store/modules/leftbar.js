/*
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-11 16:06:42
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-18 17:03:55
 */
const state = {
  whackId: '0,1,2,3,6',
  bransh: false,
  disableClick: false,
  typeStage: 0
}
const mutations = {
  getLeftBar(state, id) {
    state.whackId = id
  },
  bransh(state, bool) {
    state.bransh = bool
  },
  showStatus(state, obj) {
    state.disableClick = obj.disableClick
    state.typeStage = obj.stage
  }
}
const actions = {
  getLeftBarId(context, id) {
    context.commit('getLeftBar', id)
    console.log(context, '-------------id', id)
  },
  getShowStatus(context, obj) {
    context.commit('showStatus', obj)
    console.log(context, '-------------id', obj)
  }
}

export default {
  state,
  mutations,
  actions
}
