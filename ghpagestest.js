// eslint-disable-next-line import/no-extraneous-dependencies
const dayjs = require('dayjs')
const ghpages = require('gh-pages')
const colors = require('colors/safe')

const repo = 'https://newsgitlab.meishubao.com/msb-ai/ai-app-vue-boss-test.git'
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
    console.log(colors.green('测试环境发布成功：'), repo)
    console.log(colors.green('发布时间：', date))
  }
)
