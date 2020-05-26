/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-26 19:35:12
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-26 19:35:30
 */
const glob = require('glob')
var chalk = require('chalk')
const { spawn } = require('child_process')

const { BASE_URL } = process.env
const environment = {
  ghpagesdev: {
    text: '开发环境',
    dpy: 'deploy:dev'
  },
  ghpagestest: {
    text: '测试环境',
    dpy: 'deploy:test'
  },
  ghpagesprod: {
    text: '预发布环境',
    dpy: 'deploy:prod'
  },
  ghpageslive: {
    text: '生产环境',
    dpy: 'deploy:live'
  }
}

// 获取所有modules
const moduleArr = glob.sync('./src/pages/*')
let count = 0

console.log(chalk.yellow(`开始打包 ${environment[BASE_URL].text}`))
for (const m of moduleArr) {
  if (!m) return
  const mod = m.split('/')[3]
  const build = spawn(`npm`, ['run', 'build', `${mod}`])
  build.stdout.on('data', (data) => {
    if (data.includes('DONE  Build complete.')) {
      console.log(chalk.green(`******* ${mod} ******打包成功`))
      count++
      if (count === moduleArr.length) {
        console.log('\n')
        console.log(chalk.yellow(`开始部署${environment[BASE_URL].text}……`))
        // const deploy = spawn('npm', ['run', `${environment[BASE_URL].dpy}`])
        const deploy = spawn('npm', ['run', `${environment[BASE_URL].dpy}`])
        deploy.stdout.on('data', (data) => {
          console.log(`depoy: ${data}`)
        })
      }
    } else {
      // console.log(chalk.white(`stdout ${data}, ${mod}`))
    }
  })
  build.stderr.on('data', (data) => {
    if (data.includes('Building for production...')) {
      console.log(chalk.green(`******* 正在打包： ${mod} ******`))
    } else {
      if (!data) return
      console.log(chalk.red(`build 的 stderr ${data}`))
    }
  })
  build.on('close', (code) => {
    if (code !== 0) {
      console.log(chalk.red(`build进程退出 -> ${mod},退出码：${code}`))
    }
  })
  build.on('error', (err) => {
    console.log(chalk.red(`err: ${err}`))
  })
}
