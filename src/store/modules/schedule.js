/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-17 16:27:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-20 15:32:52
 */
const state = {
  scheduleTeacherId: [],
  schedulePeriod: ''
}
const mutations = {
  setScheduleTeacher: (state, teacherIds = []) => {
    state.scheduleTeacherId = teacherIds
  },
  setSchedulePeriod: (state, schedulePeriod = '') => {
    state.schedulePeriod = schedulePeriod
  }
}
const actions = {
  //   getLeftBarId(context, id) {
  //     context.commit('getLeftBar', id)
  //     console.log(context, '-------------id', id)
  //   }
}

export default {
  state,
  mutations,
  actions
}
