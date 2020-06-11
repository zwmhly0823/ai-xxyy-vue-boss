/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-18 18:52:36
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-11 16:45:20
 */

import Cookies from 'js-cookie'

const state = {
  sidebar: {
    test: '',
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
    withoutAnimation: false
  },
  popMenu: {
    show: false,
    item: {},
    left: 0,
    top: 0,
    bottom: 0
  },
  rightpop: {
    show: false,
    item: {},
    left: 0,
    top: 0
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_POPMENU: (state, obj = {}) => {
    state.popMenu = {
      ...state.popMenu,
      ...obj
    }
  },
  SET_RIGHTPOP: (state, obj = {}) => {
    state.rightpop = {
      ...state.rightpop,
      ...obj
    }
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setRightPop({ commit }, obj) {
    commit('SET_RIGHTPOP', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
