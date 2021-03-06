let originUrl = location.origin
let ossImgUrl = ''
if (originUrl.indexOf('prod') > 0 || originUrl.indexOf('live') > 0) {
  ossImgUrl = 'https://ai-xxyy-backend-online.oss-cn-hangzhou.aliyuncs.com'
} else {
  ossImgUrl = 'https://xxyy-kczzht.oss-cn-hangzhou.aliyuncs.com'
}

export default {
  OSS_IMG_BASE_URL: ossImgUrl,
  OSS_IMG_BASE_URL_2: 'https://s2.xiaoxiongmeishu.com',
  DEFAUTL_URL: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png?', // 默认的图片路径
  PHOTO_BORDER: 'https://s1.meixiu.mobi/image/border.png/', // 作品详情页相框
  OSS_IMG_DEMO: 'https://s1.meixiu.mobi/image/border.png?x-oss-process=image/resize,w_200'
}
