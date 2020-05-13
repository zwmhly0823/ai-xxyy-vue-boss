/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-24 17:30:50
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-13 21:30:45
 * @github: https://github.com/js-cookie/js-cookie
 */
import Cookies from 'js-cookie'

const TokenKey = 'xiaoxiongmeishu_toss'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  /** 设置过期时间为"15"分钟 */
  // var expires = new Date(new Date().getTime() + 15 * 60 * 1000)
  return Cookies.set(TokenKey, token, {
    expires: 99 // 过期时间为99天
  })
}

export function removeToken() {
  localStorage.removeItem('teacher')
  // localStorage.removeItem('staff')
  return Cookies.remove(TokenKey)
}
