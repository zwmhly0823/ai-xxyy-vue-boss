/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 12:10:04
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-03-23 19:02:11
 * @Description: 全局公共方法，添加或改动及时全员通知。 注释一定要写详细！
 */

import dayjs from 'dayjs'

/**
 * 字符串 小驼峰转连接线
 * @param {string} str
 */
export function camel2Line(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 格式化时间戳
 * @str: 时间戳 @type: String 'd'：天 'm':分 's': 秒
 */
export function formatData(str, type = 'd') {
  if (!str) return ''
  let ft = 'YYYY-MM-DD'
  if (type !== 'd') {
    ft = type === 'm' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss'
  }
  return dayjs.unix(Number(str) / 1000).format(ft)
}
// 时间戳转年月日
export function timestamp(stamp, type) {
  // type = 1: 月-日 时-分   type = 2: 年-月-日 时-分-秒 type = 3: 20 08 type=4 : 2019年12月12日
  const now = new Date(Number(stamp))
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()

  const _mouth = month > 9 ? month : '0' + month
  const _day = day > 9 ? day : '0' + day
  const _hour = hour > 9 ? hour : '0' + hour
  const _minute = minute > 9 ? minute : '0' + minute
  if (type === 1) {
    return _mouth + '-' + _day + ' ' + _hour + ':' + _minute
  } else if (type === 2) {
    return (
      year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    )
  } else if (type === 3) {
    return _mouth + '.' + _day
  } else if (type === 4) {
    return year + '年' + _mouth + '月' + _day + '日'
  } else if (type === 5) {
    return year + '-' + _mouth + '-' + _day
  } else if (type === 6) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    const hours = hour <= 9 ? '0' + hour : hour
    const minutes = minute <= 9 ? '0' + minute : minute
    return months + '-' + days + ' ' + hours + ':' + minutes
  }
}

/**
 * 数组对象单一属性排序
 * @arr 源数组
 * @field 排序字段名
 */
function compare(prop) {
  return function cpare(obj1, obj2) {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    val1 = Number(val1) ? Number(val1) : obj1[prop]
    val2 = Number(val2) ? Number(val2) : obj2[prop]
    if (val1 < val2) {
      return -1
    }
    if (val1 > val2) {
      return 1
    }
    return 0
  }
}
export function sortArrObject(arr, field) {
  return arr.sort(compare(field))
}

export function baseUrl() {
  let myBaseUrl = '/'
  const { BASE_URL } = process.env // location.pathname
  if (BASE_URL === 'ghpageslive') {
    myBaseUrl = ''
  } else if (BASE_URL === 'ghpagestest' || BASE_URL.indexOf('test') > -1) {
    // myBaseUrl = '/frontend/ai-app-vue-toss/'
    myBaseUrl = ''
  }
  return myBaseUrl
}

/**
 * 转化跨年体验课或系统课时间戳
 * @param(开课时间，结课时间)
 * return [开课时间，结课时间] 如果跨年返回YYMMDD 否则MMDD
 */

export function startToEndTime(startTime, endTime) {
  const formatS = dayjs.unix(Number(startTime) / 1000).format('YYMMDD')
  const formatE = dayjs.unix(Number(endTime) / 1000).format('YYMMDD')
  if (formatS.slice(0, 2) === formatE.slice(0, 2)) {
    return [
      dayjs.unix(Number(startTime) / 1000).format('MMDD'),
      dayjs.unix(Number(endTime) / 1000).format('MMDD')
    ]
  }
  return [formatS, formatE]
}
