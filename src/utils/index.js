/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 12:10:04
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-03-13 12:18:35
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
