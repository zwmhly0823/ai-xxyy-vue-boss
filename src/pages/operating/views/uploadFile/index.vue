<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-10-23 15:06:24
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-23 16:02:21
-->
<template>
  <div class="upload-file-page app-main">
    <!-- <header>上传素材：</header> -->
    <div class="upload-contriner">
      <div class="upload-box">
        <el-upload
          class="upload-multiple"
          drag
          action=""
          :http-request="uploadHandle"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
      <div class="success-tip">success-tip</div>
      <div class="err-tip">err-tip</div>
    </div>
  </div>
</template>
<script>
// import uploadFile from './upload'
export default {
  data() {
    return {
      title: '111'
    }
  },
  methods: {
    // 上传附件
    uploadHandle(file) {
      console.log('file', file)
      //   uploadFile(file).then((res) => {
      //     console.log('res', res)
      //     this.addContentForm.imgUrl = res
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-file-page {
  background: #fff;
  padding: 20px;
  .upload-contriner {
    min-height: calc(100vh - 90px);
    text-align: center;
    .upload-box {
      margin-top: 40px;
    }
  }
}
</style>
