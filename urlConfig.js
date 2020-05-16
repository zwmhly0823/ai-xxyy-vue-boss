/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 18:29:05
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-12 10:50:10
 */
let url = ''
switch (process.env.NODE_ENV) {
  case 'development':
    url = 'https://dev.meixiu.mobi'
    break
  case 'test':
    url = 'https://test.meixiu.mobi'
    break
  case 'production':
    url = 'https://www.xiaoxiongmeishu.com'
    break
}

module.exports = url
