/*
 * @Author: your name
 * @Date: 2021-03-29 16:39:28
 * @LastEditTime: 2021-04-12 17:51:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ai-xxyy-vue-boss/src/utils/contants.js
 */
let originUrl = location.origin
let ossImgUrl = ''
if (originUrl.indexOf('prod') > -1 || originUrl.indexOf('live') > -1 || originUrl.indexOf('boss.xiaoxiongyinyue.com')) {
  // ossImgUrl = 'https://ai-xxyy-backend-online.oss-cn-hangzhou.aliyuncs.com' //oss域名
  ossImgUrl = 'https://ai-xxyy-backend-online-oss.xiaoxiongyinyue.com'   //cdn域名
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
