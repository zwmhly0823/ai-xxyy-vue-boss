/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-05-09 16:02:33
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-16 18:56:53
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
    canvas.width = 150
    canvas.height = 150
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
  return new Promise((resolve, reject) => {
    const blogTitle = '二维码'
    const zip = new JSZip()
    const imgs = zip.folder(blogTitle)
    const baseList = []
    // let imgNameList = ['图片1', '图片2', '图片3']
    const imgNameList = imgListName
    const arr = imgUrlList
    console.log(imgUrlList, 'imgUrlList')

    // let arr = ['./img1.png', './img2.png', './img3.png']

    for (let i = 0; i < arr.length; i++) {
      const image = new Image()
      image.src = arr[i].shortCode
      // console.log(arr[i].shortCode)

      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      // const downLoadImg = function(url) {
      image.onload = function() {
        const canvas = document.createElement('canvas')
        canvas.width = 150
        canvas.height = 150
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)

        const url = canvas.toDataURL() // 得到图片的base64编码数据

        canvas.toDataURL('image/png')
        const urlBase64 = { url: url.substring(22), channel: arr[i].id }

        baseList.push(urlBase64) // 去掉base64编码前的 data:image/png;base64,
        if (baseList.length === arr.length && baseList.length > 0) {
          for (let k = 0; k < baseList.length; k++) {
            imgs.file(
              imgNameList[baseList[k].channel] + '.png',
              baseList[k].url,
              { base64: true }
            )
          }

          zip
            .generateAsync({ type: 'blob' })
            .then(function(content) {
              // see FileSaver.js
              FileSaver.saveAs(content, blogTitle + '.zip')
              resolve('success')
            })
            .catch(() => {
              reject(new Error('fail'))
            })
        }
      }
      // image.onload = downLoadImg(arr[i])
    }
  })
}
