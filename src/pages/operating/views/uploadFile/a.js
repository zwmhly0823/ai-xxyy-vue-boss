/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-10-27 17:54:03
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-27 22:01:06
 */
import axios from 'axios'
import $http from '@/api'
import Contants from '@/utils/contants'

class GetFileCommentFn {
  constructor(file) {
    console.log(file)
    this.type = file.type
    this.name = file.name
  }

  judgeFileType() {
    const fileTypeArr = [
      'image/jpg',
      'image/jpeg',
      'audio/mpeg',
      'image/png',
      'video/mp4',
      'video/mov',
      'video/FLV',
      'video/rmvb'
    ]
    return fileTypeArr.includes(this.type)
  }

  getSuffix() {
    var pos = this.name.lastIndexOf('.')
    var suffix = ''
    if (pos !== -1) {
      suffix = this.name.substring(pos)
    }
    return suffix
  }
}

class UploadFiles extends GetFileCommentFn {
  constructor(file, device = 'Pc') {
    super(file)
    this.file = file
    this.name = file.name
    this.size = file.size
    this.type = file.type
    this.device = device
    this.puhSinged = null

    this.init()
  }

  // 上传签名
  async getOssToken() {
    try {
      const getPubSinged = await $http.Teacher.getPubWriteSinged()
      return getPubSinged.payload
    } catch (err) {
      return Promise.reject(err)
    }
  }

  beforeAvatarUpload() {
    const isRegulation = super.judgeFileType()

    if (!isRegulation) {
      window._Vue.$message.error(
        '上传头像图片只能是 png/jpg 格式! 音频只能是audio/mpeg格式！ 视频只能是mp4/flv/mov/rmvb格式!'
      )
      return 0
    }
    const isLt2G = this.size / 1024 / 1024 / 1024 < 2
    if (!isLt2G) {
      window._Vue.$message.error('单个上传文件大小不能超过 2G!')
      return 0
    }
    return isRegulation && isLt2G
  }

  async init() {
    const { formData, requestHost, fileUrl } = await this.getOssUploadSigned()
    return new Promise((resolve, reject) => {
      axios
        .post(requestHost, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          const resolveData = {
            status: 'success',
            fileUrl,
            filename: this.name
          }
          resolve(resolveData)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async getOssUploadSigned() {
    try {
      this.puhSinged = await this.getOssToken()
    } catch (err) {}
    if (this.puhSinged) {
      const {
        bucketName = '',
        endpoint = '',
        accessKeyId = '',
        policy = '',
        singed = ''
      } = this.puhSinged

      const requestHost = `https://${bucketName}.${endpoint}`
      const filename = new Date().getTime() + super.getSuffix()
      const dirPath = `${this.device}/fileUpload/`
      const formData = new FormData()
      const fileUrl = `${Contants.OSS_IMG_BASE_URL}/${dirPath}${filename}`

      formData.append('key', dirPath + filename) // 存储在oss的文件路径
      formData.append('OSSAccessKeyId', accessKeyId) // accessKeyId
      formData.append('policy', policy) // policy
      formData.append('Signature', singed) // 签名
      formData.append('success_action_status', 200) // 成功后返回的操作码
      formData.append('name', filename)
      formData.append('file', this.file, filename)

      const requstData = {
        formData,
        requestHost,
        fileUrl
      }
      return requstData
    }
  }
}

export default UploadFiles
