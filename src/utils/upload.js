/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2019-12-17 15:43:27
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-14 14:46:17
 */
// const uploadFile = function(params, myConfig) {
//   const filePath = params.tempFilePath || params.path

//   if (!filePath) {
//     console.error('文件错误')
//     return
//   }

//   const filetime = Date.now()
//   const fileradom = (Math.random() * 10000).toFixed(0)
//   const filearr = filePath.split('.')
//   const fileext = filearr[filearr.length - 1]
//   const filename = `11/${filetime}${fileradom}.${fileext}`
//   const aliyunFileKey = `ai-app-mp-teacher/audio/${filename}`
//   const config = {
//     ...myConfig,
//     ossPath: `https://${myConfig.bucketName}.${myConfig.endpoint}`,
//     urlPath: `https://${myConfig.bucketName}.${myConfig.endpoint}/${aliyunFileKey}`
//   }

//   return new Promise((resolve, reject) => {
//     const formData = {
//       key: aliyunFileKey,
//       policy: config.policy,
//       OSSAccessKeyId: config.accessKeyId,
//       success_action_status: '200', // 让服务端返回200,不然，默认会返回204
//       signature: config.singed
//     }
//     mpvue.uploadFile({
//       url: config.ossPath,
//       filePath: filePath,
//       name: 'file',
//       // 参数绑定
//       formData: formData,
//       success: function(res) {
//         if (res.statusCode !== 200) {
//           resolve({
//             res: res,
//             url: config.urlPath
//           })
//         } else {
//           resolve({
//             res: res,
//             url: config.urlPath
//           })
//         }
//       },
//       fail: function(err) {
//         console.error(err)
//         reject(err)
//       }
//     })
//   })
// }

// export default uploadFile
