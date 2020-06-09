/*
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-06-09 14:42:08
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-09 18:28:20
 */

const glob = require('glob')
const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const { getMenuText } = require('./src/utils/menuItems')
const { NODE_ENV, BASE_URL } = process.env
const plugins = []
const entries = {}

const resolve = (dir) => path.resolve(__dirname, dir)

const camel2Line = function(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

const baseUrl = function() {
  switch (BASE_URL) {
    case 'ghpagesdev':
      return '/ai-app-vue-boss-dev/'
    case 'ghpagestest':
      return '/ai-app-vue-boss-test/'
    case 'ghpagesprod':
      return '/ai-app-vue-boss-prod/'
    case 'ghpageslive':
      return '/'
    default:
      return '/'
  }
}

const getEntry = function() {
  const items = glob.sync('./src/pages/*/*.js')
  items.forEach((item) => {
    const filepath = item
    const fileList = filepath.split('/')
    const fileName = fileList[fileList.length - 2]
    const fileNameStr = camel2Line(fileName)
    entries[fileNameStr] = {
      entry: `src/pages/${fileName}/main.js`,
      template: 'public/index.html',
      filename: `${fileNameStr}/index.html`,
      title: `${getMenuText(fileNameStr)}`,
      chunks: ['chunk-vendors', 'chunk-common', fileName]
    }
  })
  return entries
}

const dynamicPlugin = function() {
  if (NODE_ENV === 'production') {
  }
  // 性能优化分析插件
  if (process.env.npm_config_report) {
    plugins.push(new BundleAnalyzerPlugin())
  }
  return plugins
}

const editOperation = function(text) {
  if (NODE_ENV === 'production' && execSync('git status -s', { encoding: 'utf-8' }) !== '') {
    console.log(chalk.red(`同学，请先提交代码再${text}哦~`), '\n')
    process.exit(1)
  }
}

module.exports = {
  camel2Line,
  getEntry,
  baseUrl,
  dynamicPlugin,
  resolve,
  editOperation
}
