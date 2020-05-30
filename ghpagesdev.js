/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-26 14:42:40
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-26 19:36:15
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const dayjs = require('dayjs')
const ghpages = require('gh-pages')
const colors = require('colors/safe')

const repo =
  'https://newsgitlab.meishubao.com/msb-ai/frontend/ai-app-vue-boss-dev.git'
ghpages.publish(
  'dist',
  {
    dest: 'public',
    repo
  },
  (err) => {
    const date = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    if (err) {
      console.error(err, date)
      return
    }
    console.log(colors.green('开发环境发布成功：'), repo)
    console.log(colors.green('发布时间：', date))
  }
)
