/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-05-09 16:02:33
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-09 17:15:49
 */

import JSZip from 'jszip'
import FileSaver from 'file-saver'
// 下载单张二维码
export function downloadByBlob(url, name) {
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      download(url, name)
      // 用完释放URL对象
      URL.revokeObjectURL(url)
    })
  }
  function download(href, name) {
    const eleLink = document.createElement('a')
    eleLink.download = name
    eleLink.href = href
    eleLink.click()
    eleLink.remove()
  }
}
// 批量下载二维码
export function downImgAll(imgListName, imgUrlList) {
  var blogTitle = '二维码'
  var zip = new JSZip()
  var imgs = zip.folder(blogTitle)
  var baseList = []
  // var imgNameList = ['图片1', '图片2', '图片3']
  var imgNameList = imgListName
  var arr = imgUrlList
  // var arr = ['./img1.png', './img2.png', './img3.png']

  for (var i = 0; i < arr.length; i++) {
    const image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')

    image.onload = function() {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)

      const url = canvas.toDataURL() // 得到图片的base64编码数据
      canvas.toDataURL('image/png')

      baseList.push(url.substring(22)) // 去掉base64编码前的 data:image/png;base64,
      if (baseList.length === arr.length && baseList.length > 0) {
        for (let k = 0; k < baseList.length; k++) {
          imgs.file(imgNameList[k] + '.png', baseList[k], { base64: true })
        }
        zip.generateAsync({ type: 'blob' }).then(function(content) {
          // see FileSaver.js
          FileSaver.saveAs(content, blogTitle + '.zip')
        })
      }
    }
    image.src = arr[i]
  }
}
