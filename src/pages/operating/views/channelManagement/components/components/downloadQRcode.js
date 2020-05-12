/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-05-09 16:02:33
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-12 11:32:01
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
  return new Promise((resolve, reject) => {
    const blogTitle = '二维码'
    const zip = new JSZip()
    const imgs = zip.folder(blogTitle)
    const baseList = []
    // let imgNameList = ['图片1', '图片2', '图片3']
    const imgNameList = imgListName
    const arr = imgUrlList
    // let arr = ['./img1.png', './img2.png', './img3.png']
    console.log(arr)

    for (let i = 0; i < arr.length; i++) {
      const image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      const downLoadImg = function(url) {
        if (!url) return
        // const canvas = document.createElement('canvas')
        // canvas.width = image.width
        // canvas.height = image.height

        // const context = canvas.getContext('2d')
        // context.drawImage(image, 0, 0, image.width, image.height)

        // const url = canvas.toDataURL() // 得到图片的base64编码数据
        // canvas.toDataURL('image/png')

        baseList.push(url.substring(22)) // 去掉base64编码前的 data:image/png;base64,
        if (baseList.length === arr.length && baseList.length > 0) {
          for (let k = 0; k < baseList.length; k++) {
            imgs.file(imgNameList[k] + '.png', baseList[k], { base64: true })
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
      image.onload = downLoadImg(arr[i])
      image.src = arr[i]
    }
  })
}
const FunLib = {
  // 图片打包下载
  download: function(images) {
    FunLib.packageImages(images)
  },
  // 打包压缩图片
  packageImages: function(imgs) {
    var imgBase64 = []
    var imageSuffix = [] // 图片后缀
    var zip = new JSZip()
    var img = zip.folder('images')

    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].url
      var suffix = src.substring(src.lastIndexOf('.'))
      imageSuffix.push(suffix)
      FunLib.getBase64(imgs[i].url).then(
        function(base64) {
          imgBase64.push(base64.substring(22))
          if (imgs.length === imgBase64.length) {
            for (var i = 0; i < imgs.length; i++) {
              img.file(imgs[i].name + imageSuffix[i], imgBase64[i], {
                base64: true
              })
            }
            zip.generateAsync({ type: 'blob' }).then(function(content) {
              FileSaver.saveAs(content, 'images.zip')
            })
          }
        },
        function(err) {
          console.log(err)
        }
      )
    }
  },
  // 传入图片路径，返回base64
  getBase64: function(img) {
    var image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = img
    var deferred = new Promise()
    if (img) {
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        var dataURL = canvas.toDataURL()
        deferred.resolve(dataURL)
      }
      return deferred.promise()
    }
  }
}
export default FunLib
