/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2019-12-17 15:43:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-18 21:13:54
 */
import axios from 'axios'
import $http from '@/api'
import Contants from '@/utils/contants'
const getSuffix = (fileName) => {
  var pos = fileName.lastIndexOf('.')
  var suffix = ''
  if (pos !== -1) {
    suffix = fileName.substring(pos)
  }
  return suffix
}

// 头像上传签名
const getOssToken = async () => {
  let getPubSinged
  try {
    getPubSinged = await $http.Teacher.getPubWriteSinged()
    return Promise.resolve(getPubSinged.payload)
  } catch (err) {
    return Promise.reject(err)
  }
}

const uploadFile = async (file) => {
  let puhSinged
  try {
    puhSinged = await getOssToken()
  } catch (err) {
    console.log(err)
  }
  if (puhSinged) {
    const {
      bucketName = '',
      endpoint = '',
      accessKeyId = '',
      policy = '',
      singed = ''
    } = puhSinged

    const requestHost = `https://${bucketName}.${endpoint}`
    const filename = new Date().getTime() + getSuffix(file.file.name)
    const dirPath = 'h5/headPic/'
    const formData = new FormData()
    const fileUrl = `${Contants.OSS_IMG_BASE_URL}/${dirPath}${filename}`

    formData.append('key', dirPath + filename) // 存储在oss的文件路径
    formData.append('OSSAccessKeyId', accessKeyId) // accessKeyId
    formData.append('policy', policy) // policy
    formData.append('Signature', singed) // 签名
    formData.append('success_action_status', 200) // 成功后返回的操作码
    formData.append('name', filename)
    formData.append('file', file.file, filename)

    return new Promise((resolve, reject) => {
      axios
        .post(requestHost, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          resolve(fileUrl)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default uploadFile
