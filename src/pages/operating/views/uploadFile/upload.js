/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2019-12-17 15:43:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-27 15:10:41
 */
import axios from 'axios'
import $http from '@/api'
import Contants from '@/utils/contants'

const getSuffix = (_) => {
  var pos = _.lastIndexOf('.')
  var suffix = ''
  if (pos !== -1) {
    suffix = _.substring(pos)
  }
  return suffix
}

const judgeFileType = (type) => {
  // 'audio/mpeg',

  const fileTypeArr = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'video/mp4',
    'video/mov',
    'video/FLV',
    'video/rmvb'
  ]
  return fileTypeArr.includes(type)
}

// 头像上传格式校验
const beforeAvatarUpload = (File) => {
  const file = File
  const { type, size } = file
  const isRegulation = judgeFileType(type)

  if (!isRegulation) {
    window._Vue.$message.error(
      '上传头像图片只能是 png/jpg 格式! 音频只能是audio/mpeg格式！ 视频只能是mp4/flv/mov/rmvb格式!'
    )
    return 0
  }
  const isLt2G = size / 1024 / 1024 / 1024 < 2
  if (!isLt2G) {
    window._Vue.$message.error('单个上传文件大小不能超过 2G!')
    return 0
  }
  return isRegulation && isLt2G
}
// 头像上传签名
const getOssToken = async () => {
  try {
    const getPubSinged = await $http.Teacher.getPubWriteSinged()
    return getPubSinged.payload
  } catch (err) {
    return Promise.reject(err)
  }
}

const uploadFile = async (file, device = 'Pc') => {
  console.log('ready upload file ->', file)

  const canUpload = beforeAvatarUpload(file)
  if (!canUpload)
    return {
      status: 'fail',
      filename: file.name
    }

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
    const filename = new Date().getTime() + getSuffix(file.name)
    const dirPath = `${device}/fileUpload/`
    const formData = new FormData()
    const fileUrl = `${Contants.OSS_IMG_BASE_URL}/${dirPath}${filename}`

    formData.append('key', dirPath + filename) // 存储在oss的文件路径
    formData.append('OSSAccessKeyId', accessKeyId) // accessKeyId
    formData.append('policy', policy) // policy
    formData.append('Signature', singed) // 签名
    formData.append('success_action_status', 200) // 成功后返回的操作码
    formData.append('name', filename)

    formData.append('file', file, filename)

    return new Promise((resolve, reject) => {
      axios
        .post(requestHost, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          const resolveData = {
            status: 'success',
            fileUrl,
            filename: file.name
          }
          resolve(resolveData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default uploadFile
