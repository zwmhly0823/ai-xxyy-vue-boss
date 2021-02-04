/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-24 17:11:27
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-24 17:11:28
 */
/**
 * 获取今天日期时间戳 00:00:00
 */
export function todayTimestamp() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const today = now.getTime()
  return today
}

/**
 * 获取明天时间戳 00：00：00
 */
export function tomorrowTimestamp() {
  const cur = new Date()
  cur.setDate(cur.getDate() + 1)
  cur.setHours(0, 0, 0, 0)
  const tomorrow = cur.getTime()
  return tomorrow
}
