const state = {
  whackId: '0,1,2,3,6'
}
const mutations = {
  getLeftBarId(state, id) {
    state.whackId = id
  }
}

export default {
  state,
  mutations
}
