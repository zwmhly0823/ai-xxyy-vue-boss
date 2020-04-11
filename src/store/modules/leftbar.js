const state = {
  whackId: '0,1,2,3,6',
  bransh: false
}
const mutations = {
  getLeftBar(state, id) {
    state.whackId = id
    console.log(
      id,
      state.whackId,
      'state.whackId-------------------------------------------id'
    )
  },
  branshLeft(state, bool) {
    state.bransh = bool
    console.log(state.bransh, '000')
    // if (state.bransh) {
    //   console.log('----------------')
    //   return fun
    // }
  }
}
const actions = {
  getLeftBarId(context, id) {
    context.commit('getLeftBar', id)
    console.log(context, '-------------id', id)
  },
  bransh(context, bool) {
    context.commit('branshLeft', bool)
  }
}

export default {
  state,
  mutations,
  actions
}
