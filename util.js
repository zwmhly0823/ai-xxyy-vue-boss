/*
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-06-09 14:42:08
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-21 16:10:31
 */

const glob = require('glob')
const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { getMenuText } = require('./src/config/sidebarMenu/menuItems')
const { BASE_URL } = process.env
const entries = {}
// 多科目名称-除小熊美术
const subjects = ['write_app']

const camel2Line = function(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

const baseUrl = function() {
  switch (BASE_URL) {
    case 'ghpagesdev':
      return 'https://xxyy-devtest.oss-cn-hangzhou.aliyuncs.com/xiaoxiong/ai-app-vue-boss-dev/'
    case 'ghpagestest':
      return 'https://xxyy-devtest.oss-cn-hangzhou.aliyuncs.com/xiaoxiong/ai-app-vue-boss-test/'
    case 'ghpagesprod':
      return 'https://xxyy-devtest.oss-cn-hangzhou.aliyuncs.com/xiaoxiongyarn/ai-app-vue-boss-prod/'
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
      // 多科目项目只显示科目名称+BOSS，小熊显示模块名及小熊美术BOSS
      title: subjects.includes(fileNameStr)
        ? `${getMenuText(fileNameStr)}BOSS`
        : `${getMenuText(fileNameStr)} - 小熊美术BOSS`,
      chunks: ['chunk-vendors', 'chunk-common', fileNameStr]
    }
  })
  return entries
}

const editOperation = function(text) {
  if (BASE_URL && execSync('git status -s', { encoding: 'utf-8' }) !== '') {
    console.log(chalk.red(`同学，请先提交代码再${text}哦~`), '\n')
    process.exit(1)
  }
}

const dllReference = function(config) {
  config.plugin('vendorDll').use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require('./dll/vendor.manifest.json')
    }
  ])

  config.plugin('utilDll').use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require('./dll/util.manifest.json')
    }
  ])

  config
    .plugin('addAssetHtml')
    .use(AddAssetHtmlPlugin, [
      [
        {
          filepath: require.resolve(
            path.resolve(__dirname, `dll/vendor.dll.js`)
          ),
          outputPath: 'dll',
          publicPath: `${baseUrl()}dll`
        },
        {
          filepath: require.resolve(path.resolve(__dirname, `dll/util.dll.js`)),
          outputPath: 'dll',
          publicPath: `${baseUrl()}dll`
        }
      ]
    ])
    .after('html')
}

module.exports = {
  camel2Line,
  getEntry,
  baseUrl,
  editOperation,
  dllReference
}
