<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 15:15:00
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-13 09:03:10
 */
 -->
<template>
  <el-upload
    class="upload-demo"
    action=""
    :on-remove="handleRemove"
    :before-upload="beforeAvatarUpload"
    :limit="limit"
    multiple
    :on-exceed="handleExceed"
    :on-error="uploadErr"
    :on-success="onloadSuccess"
    :on-progress="uploadProgress"
    :http-request="upload"
  >
    <el-button size="small" :style="{ width: btnWidth + 'px' }" type="primary"
      >点击上传</el-button
    >
    <slot name="mp3"></slot>
  </el-upload>
</template>

<script>
export default {
  props: {
    limit: {
      // 上传限制
      type: Number,
      default: 999
    },
    btnWidth: {
      // 上传按钮宽度
      type: Number,
      default: 80
    },
    format: {
      // 上传格式
      type: String,
      default: File
    },
    upload: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleExceed() {
      this.$message('超出上传限制！')
    },
    beforeAvatarUpload(file) {
      if (this.format !== File) {
        if (!file.type.includes(this.format)) {
          this.$message('您所上传的格式不正确！')
          return false
        }
      }
    },
    handleRemove(file, fileList) {
      this.$emit('handle-remove', fileList)
    },
    uploadErr(file, fileList) {
      const _name = fileList.name.split('.')[0]
      if (file.type === 'error') {
        this.$message({
          message: `${_name}上传失败！`,
          type: 'error'
        })
      }
    },
    onloadSuccess(file, fileList) {
      console.log('hehe', file, fileList)
    },
    uploadProgress(event, file, fileList) {
      console.log(
        event,
        file,
        fileList,
        'event, file, fileList--------------------'
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
