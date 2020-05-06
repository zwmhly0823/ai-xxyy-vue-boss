const glob = require('glob')
const defaultSettings = require('./src/settings.js')
const { NODE_ENV } = process.env
// TODO: 使用router
const { getMenuText } = require('./src/utils/menuItems')
const name = defaultSettings.title || '小熊美术TOSS' // page title

let baseUrl = '/'
if (process.env.BASE_URL === 'ghpageslive') {
  baseUrl = '/'
} else if (process.env.BASE_URL === 'ghpagesdev') {
  baseUrl = '/frontend/ai-app-vue-toss-dev/'
} else if (process.env.BASE_URL === 'ghpagestest') {
  baseUrl = '/ai-app-vue-toss-test/'
}

function camel2Line(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 运行 npm run build [projectFileName] 打包指定模块;  projectName 取到指定的模块;
const projectName = process.argv[3] || 'dashboard'

/**
 * 设置入口文件，打包时按模块文件分开独立打包
 */
function getEntry() {
  let entries = {}
  if (NODE_ENV === 'production' && projectName) {
    const projectNameStr = camel2Line(projectName)
    entries = {
      index: {
        // page的入口
        entry: `src/pages/${projectName}/main.js`,
        // 模板来源
        template: 'public/index.html',
        // 在 dist/index.html 的输出
        filename: 'index.html',
        title: `${getMenuText(projectNameStr)}`,
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }
    }
  } else {
    const items = glob.sync('./src/pages/*/*.js')

    items.forEach((item) => {
      const filepath = item
      const fileList = filepath.split('/')
      const fileName = fileList[fileList.length - 2]
      const fileNameStr = camel2Line(fileName)
      entries[fileNameStr] = {
        entry: `src/pages/${fileName}/main.js`,
        // 模板来源
        template: 'public/index.html',
        // 在 dist/index.html 的输出
        filename: `${fileNameStr}.html`,
        title: `${getMenuText(fileNameStr)}`,
        // 提取出来的通用 chunk 和 vendor chunk。
        chunks: ['chunk-vendors', 'chunk-common', fileNameStr]
      }
    })
  }
  return entries
}

const pages = getEntry()

module.exports = {
  publicPath:
    NODE_ENV === 'production'
      ? `${baseUrl}${camel2Line(projectName)}/`
      : `/${camel2Line(projectName)}`,
  outputDir: `dist/${camel2Line(projectName)}`,
  // 页面入口
  pages,
  productionSourceMap: true,
  configureWebpack: {
    name,
    plugins: []
  },
  chainWebpack(config) {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://test.meixiu.mobi',
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      // 查询接口
      '/data': {
        target: 'https://test.meixiu.mobi',
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/data': '/data'
        }
      },
      '/graphql': {
        // local - 本地开发环境
        // target: 'http://localhost:3000',
        // release - 测试环境
        // target: 'http://docker.meixiu.mobi:43401',
        // dev - 开发环境
        // target: 'http://docker.meixiu.mobi:33401',
        // product -预发布环境
        target: 'http://docker.meixiu.mobi:53401',
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/graphql': ''
        }
      },
      '/getStuRankingList': {
        target: 'http://docker.meixiu.mobi:43401',
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/getStuRankingList': '/getStuRankingList'
        }
      }
    }
  }
  // css: {
  //   loaderOptions: {
  //     // 给 sass-loader 传递选项。
  //     // @/ 是 src/ 的别名
  //     scss: {
  //       prependData: '@import "~@/assets/scss/element-variables.scss";'
  //     }
  //   }
  // }
}
