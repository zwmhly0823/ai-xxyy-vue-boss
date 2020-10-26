<template>
  <div>
    <el-upload
      drag
      multiple
      action=""
      :auto-upload="false"
      :on-change="OnChange"
      :on-remove="OnRemove"
      :on-preview="handlePictureCardPreview"
      :before-remove="beforeRemove"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-button type="" @click="fun">点击查看filelist</el-button>
    <el-button type="" @click="onSubmit">提交</el-button>
  </div>
</template>

<script>
// import { host, batchTagInfo } from '../../api/api'
import uploadFile from './upload'
export default {
  data() {
    return {
      param: new FormData(),
      form: {},
      count: 0,
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    OnChange(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    OnRemove(file, fileList) {
      this.fileList = fileList
    },
    // 阻止upload的自己上传，进行再操作
    // beforeupload(file) {
    //     console.log('-------------------------')
    //     console.log(file);
    //     //创建临时的路径来展示图片
    //     //重新写一个表单上传的方法
    //     this.param = new FormData();
    //     this.param.append('file[]', file, file.name);
    //     this.form={
    //       a:1,
    //       b:2,
    //       c:3
    //     }
    //     // this.param.append('file[]', file, file.name);
    //     this.param.append('form',form)
    //     return true;
    // },
    fun() {
      console.log('------------------------')
      console.log(this.fileList)
    },
    promiseAll() {
      return [1, 3, 4, 5, 6].map((item, index) => {
        return this.lomal(item)
      })
    },
    lomal(file) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(file.name || '没名')
        }, 2000)
      })
    },
    fileListPromise() {
      return this.fileList.map((item) => uploadFile(item.raw))
    },
    onSubmit() {
      Promise.all(this.fileListPromise())
        .then((res) => {
          console.log('Promise.all-res', res)
        })
        .catch((err) => {
          console.log('Promise.all-err', err)
        })
      // Promise.all(this.promiseAll()).then((res) => {
      //   console.log('all-res', res)
      // })
      // this.fileList.forEach(async (item) => {
      //   const result = await this.lomal(item.raw)
      //   // const result = await uploadFile(item.raw)
      //   console.log('result', result)
      // })
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
