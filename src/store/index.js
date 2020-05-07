/*
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:05:19
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-18 12:28:54
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
// import user from './modules/user'
import leftbar from './modules/leftbar'
import team from './modules/team'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    // user
    leftbar,
    team
  },
  getters
})

export default store
