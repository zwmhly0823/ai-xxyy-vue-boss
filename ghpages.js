// eslint-disable-next-line import/no-extraneous-dependencies
const dayjs = require('dayjs')
const ghpages = require('gh-pages')

const repo =
  'https://newsgitlab.meishubao.com/msb-ai/frontend/ai-app-vue-toss.git'
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
    }
    console.log('publish end', repo, date)
  }
)
