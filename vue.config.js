const defaultSettings = require('./src/settings.js')

// const WebpackAliyunOss = require('webpack-aliyun-oss')
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

// const ossConfig = {
//   bucket: 'xxyy-devtest',
//   region: 'oss-cn-hangzhou',
//   endpoint: 'oss-cn-hangzhou.aliyuncs.com',
//   accessKeyId: 'LTAI4G6Z1YdzS7yEMtrfBrtH',
//   accessKeySecret: 'T2WjNlLkAB4pDyMdfrx1aPHuQIEbaQ'
// }
/**
 * api 环境切换，默认 dev
 */
const env = 'dev' // dev, test, prod, live
// graphql api
// let targetGrapqhlEnv = 'http://docker.meixiu.mobi:33401'
let targetGrapqhlEnv = 'http://ai-xxyy-default-graphql-boss.yinyuebao.com'
// 后端api
// let targetApiEnv = 'https://dev.meixiu.mobi'
let targetApiEnv = 'http://ai-xxyy-dev-boss.yinyuebao.com'
if (env === 'dev') {
  targetGrapqhlEnv = 'http://ai-xxyy-dev-graphql-boss.yinyuebao.com'
  targetApiEnv = 'http://ai-xxyy-dev-boss.yinyuebao.com'
} else if (env === 'test') {
  // 测试环境
  targetGrapqhlEnv = 'http://ai-xxyy-test-graphql-boss.yinyuebao.com'
  targetApiEnv = 'http://ai-xxyy-test-boss.yinyuebao.com'
} else if (env === 'prod') {
  // 预发布环境
  targetGrapqhlEnv = 'http://ai-xxyy-prod-graphql-boss.yinyuebao.com'
  targetApiEnv = 'http://ai-xxyy-prod-boss.yinyuebao.com'
} else if (env === 'live') {
  targetGrapqhlEnv = 'http://ai-xxyy-live-graphql-boss.yinyuebao.com'
  targetApiEnv = 'http://ai-xxyy-live-boss.yinyuebao.com'
}

editOperation('构建')

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

    // 上传阿里云oss
    // config.plugin('webpack-aliyun-oss').use(WebpackAliyunOss, [
    //   {
    //     from : ['./dist/**'],
    //     dist : 'xiaoxiong/ai-xxyy-h5/',
    //     ...ossConfig
    //   }
    // ])
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
