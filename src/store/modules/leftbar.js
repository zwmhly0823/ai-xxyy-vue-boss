const state = {
  whackId: '0,1,2,3,6'
}
const mutations = {
  getLeftBar(state, id) {
    state.whackId = id
    console.log(
      id,
      state.whackId,
      'state.whackId-------------------------------------------id'
    )
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
