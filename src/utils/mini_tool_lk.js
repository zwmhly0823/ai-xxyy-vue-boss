/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-25 19:15:30
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-14 19:14:01
 */
export function formatDate(date1) {
  if (!date1 || date1 === '0') return '-'
  var date = new Date(date1)
  var YY = date.getFullYear() + '-'
  var MM =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hh =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var mm =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return YY + MM + DD + ' ' + hh + mm + ss
}
