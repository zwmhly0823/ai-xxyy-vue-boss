const defaultSettings = require('./src/settings.js')

const WebpackAliyunOss = require('webpack-aliyun-oss')
const {
  getEntry,
  camel2Line,
  baseUrl,
  editOperation,
  dllReference
} = require('./util')
const { NODE_ENV } = process.env
const projectName = process.argv[3] || 'dashboard'
const name = defaultSettings.title || '小熊美术BOSS'
const { BASE_URL } = process.env
const ossConfig = {
  bucket: 'xxyy-devtest',
  region: 'oss-cn-hangzhou',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
  accessKeyId: 'LTAI4G6Z1YdzS7yEMtrfBrtH',
  accessKeySecret: 'T2WjNlLkAB4pDyMdfrx1aPHuQIEbaQ'
}
/**
 * api 环境切换，默认 dev
 */
const env = BASE_URL || 'default' // default, dev, test, prod, live
// graphql api
// let targetGrapqhlEnv = 'http://docker.meixiu.mobi:33401'
let targetGrapqhlEnv = 'http://ai-xxyy-default-graphql-boss.yinyuebao.cloud'
let targetApiEnv = 'http://ai-xxyy-default-boss.yinyuebao.cloud'
if (env === 'dev') {
  targetGrapqhlEnv = 'http://ai-xxyy-dev-graphql-boss.yinyuebao.cloud'
  targetApiEnv = 'http://ai-xxyy-dev-boss.yinyuebao.cloud'
} else if (env === 'test') {
  // test环境
  targetGrapqhlEnv = 'http://ai-xxyy-test-graphql-boss.yinyuebao.cloud'
  targetApiEnv = 'http://ai-xxyy-test-boss.yinyuebao.cloud'
} else if (env === 'prod') {
  // 预发布环境
  targetGrapqhlEnv = 'http://ai-xxyy-prod-graphql-boss.yinyuebao.cloud'
  targetApiEnv = 'http://ai-xxyy-prod-boss.yinyuebao.cloud'
} else if (env === 'live') {
  targetGrapqhlEnv = 'http://ai-xxyy-live-graphql-boss.yinyuebao.cloud'
  targetApiEnv = 'http://ai-xxyy-live-boss.yinyuebao.cloud'
}

editOperation('构建')
console.log(NODE_ENV)

module.exports = {
  publicPath:
    NODE_ENV === 'production' ? `${baseUrl()}` : `/${camel2Line(projectName)}`,
  pages: getEntry(),
  productionSourceMap: NODE_ENV !== 'production',
  configureWebpack: {
    name,
    plugins: [],
    // 解决build log日志warning
    performance: {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  chainWebpack(config) {
    if (NODE_ENV === 'production') {
      dllReference(config)
    }
    config.plugins.delete('prefetch')
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: '65-90', speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 }
      })
      .end()

    const ossDist = function() {
      switch (BASE_URL) {
        case 'default':
          return 'xiaoxiong/ai-app-vue-boss-default/'
        case 'dev':
          return 'xiaoxiong/ai-app-vue-boss-dev/'
        case 'test':
          return 'xiaoxiong/ai-app-vue-boss-test/'
        case 'prod':
          return 'xiaoxiong/ai-app-vue-boss-prod/'
        // case 'ghpageslive':
        //   return '/'
        default:
          return 'xiaoxiong/ai-app-vue-boss-default/'
      }
    }
    if (NODE_ENV === 'production') {
      // 上传阿里云oss
      config.plugin('webpack-aliyun-oss').use(WebpackAliyunOss, [
        {
          from: ['./dist/**'],
          dist: `${ossDist()}`,
          ...ossConfig
        }
      ])
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: targetApiEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      // 查询接口
      '/data': {
        target: targetApiEnv,
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
        //  线上环境
        // target: 'http://docker.meixiu.mobi:13401',
        // product -预发布环境
        // target: 'http://docker.meixiu.mobi:53401',
        target: targetGrapqhlEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/graphql': ''
        }
      },
      '/getStuRankingList': {
        // target: 'http://docker.meixiu.mobi:43401',
        // target: 'http://docker.meixiu.mobi:33401',
        target: targetGrapqhlEnv,
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/getStuRankingList': '/getStuRankingList'
        }
      }
    }
  }
}
