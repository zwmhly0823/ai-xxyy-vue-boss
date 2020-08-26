/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-30 14:15:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-28 22:45:01
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

/**
 * 动态获取与今天相距N天的时间戳 00：00：00
 * @day: Number, 今天后的是正数，今天前的是负数
 */
export function getDaysTimestamp(day) {
  if (!Number.isInteger(day)) {
    console.log('参数类型错误')
    return
  }
  const cur = new Date()
  cur.setDate(cur.getDate() + day)
  cur.setHours(0, 0, 0, 0)
  const tomorrow = cur.getTime()
  return tomorrow
}

/**
 * 获取近1小时内时间
 */
export function withinAnHour(key) {
  const now = Date.now()
  const last = Date.now() - 3600 * 1000
  const res = key
    ? { [`${key}`]: { gte: last, lte: now } }
    : { gte: last, lte: now }
  return res
}
