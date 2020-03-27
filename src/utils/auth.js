import Cookies from 'js-cookie'

const TokenKey = 'xiaoxiongmeishu_toss'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  localStorage.removeItem('teacher')
  // localStorage.removeItem('staff')
  return Cookies.remove(TokenKey)
}
