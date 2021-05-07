<!--
 * @Author: your name
 * @Date: 2021-03-02 15:41:20
 * @LastEditTime: 2021-03-06 13:11:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ai-app-vue-boss/src/pages/operating/views/manageChangeClass/index.vue
-->
<template>
  <div class="change-class">
    <div class="change-class-tabs" v-loading="loading">
      <el-tabs v-model="changeCard" type="border-card">
        <el-tab-pane label="按人选择" name="0">
          <person flag="0" v-if="changeCard == 0"></person>
        </el-tab-pane>
        <el-tab-pane label="按班级选择" name="1">
          <person flag="1" v-if="changeCard == 1"></person>
          <!-- <group v-if="changeCard == 1"></group> -->
        </el-tab-pane>
        <el-tab-pane label="批量导入" name="2">
          <div v-if="changeCard == 2">
            <el-upload
              ref="upload"
              action=""
              accept=".xls, .xlsx"
              class="manageclass-upload"
              :headers="headers"
              :auto-upload="false"
              :limit="1"
              :http-request="uploadFile"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                :disabled="uploading"
                >选取文件</el-button
              >
              <el-button
                style="margin-left: 20px"
                size="small"
                type="success"
                @click="submitUpload"
                :disabled="uploading"
                >上传到服务器</el-button
              >
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
            </el-upload>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="3">
          <operation />
        </el-tab-pane>
      </el-tabs>
    </div>

    <change-class-dialog
      :dialogVisible="dialogVisible"
      :returnSuccess="successList"
      :returnErr="errList"
    />
  </div>
</template>

<script>
import person from './person'
import operation from './operationLog'
import changeClassDialog from './changeClassDialog'
import { getAppSubject } from '@/utils/index'
export default {
  components: {
    person,
    operation,
    changeClassDialog,
  },
  data() {
    return {
      dialogVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      uploading: false,
      changeCard: '0',
      loading: false,
      successList: [], // 返回成功数组
      errList: [], // 返回成功数组
      params: {
        operationId: '',
        subject: '',
        form: null,
      },
    }
  },
  created() {
    const operation = localStorage.getItem('staff')
    operation && (this.params.operationId = Number(JSON.parse(operation).id))
    // 科目
    this.params.subject = getAppSubject()
  },
  methods: {
    /** 导入数据上传 */
    uploadFile(params) {
      this.loading = true
      const formdata = new FormData()
      const { file } = params
      formdata.append('file', file)
      this.params.form = formdata
      this.uploading = true
      this.$http.Operating.trialChangeClassFile(this.params)
        .then((res) => {
          this.loading = false
          if (res.length) {
            this.dialogVisible = true
            res.forEach((item, i) => {
              if (item.state === 1) {
                this.errList.push(item)
              } else if (item.state === 0) {
                this.successList.push(item)
              }
            })
          } else {
            this.$message.error('数据错误')
          }
        })
        .finally(() => {
          this.uploading = false
        })
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },
  },
}
</script>

<style lang="scss" scoped>
.change-class {
  margin: 10px;
  .manageclass-upload {
    width: 240px;
    padding: 15px 0 0 20px;
    box-sizing: border-box;
  }
  .change-class-tabs .el-tabs {
    min-height: calc(100vh - 70px);
  }
}
</style>
