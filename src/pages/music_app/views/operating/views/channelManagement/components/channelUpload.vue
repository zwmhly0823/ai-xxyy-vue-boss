<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-05-06 16:33:15
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-22 14:32:16
 -->
<template>
  <div class="channelUpload-box">
    <div class="channelUpload-table">
      <div class="channelUpload-upload-box">
        <div>
          <el-button
            type="primary"
            size="small"
            plain
            @click="tempDownLoad"
            class="el-icon-download"
            >模版下载</el-button
          ><br />
          <span class="titleName">1.请输入导入表格备注</span><br />
          <el-input
            style="width: 350px"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入表格备注"
            v-model="remarks"
          >
          </el-input>
        </div>
        <p class="titleName">2.请选择需要上传的文件</p>
        <el-upload
          ref="upload"
          action=""
          accept=".xls, .xlsx"
          :on-remove="handleRemove"
          :headers="headers"
          :auto-upload="false"
          :on-change="onChange"
          :limit="1"
          :http-request="handleChange"
          :on-progress="uploadProgress"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            :class="fileList.length > 0 ? '' : 'btnActive'"
            @click="submitUpload"
            >上传文件</el-button
          >
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </div>
      <!-- <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column prop="date" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="导入时间" width="180">
        </el-table-column>
        <el-table-column prop="address" label="实际导入数"> </el-table-column>
        <el-table-column prop="address" label="备注"> </el-table-column>
        <el-table-column prop="address" label="操作人"> </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="1"
        :total="10"
        open="calc(100vw - 95px - 100px)"
        close="calc(100vw - 23px - 50px)"
      /> -->
    </div>
  </div>
</template>

<script>
// import MPagination from '@/components/MPagination/index.vue'
import dayjs from 'dayjs'
export default {
  props: {
    tabIndex: {
      type: String,
      default: '',
    },
  },
  components: {
    // MPagination
  },
  data() {
    return {
      remarks: '',
      fileTemp: '',
      headers: { 'Content-Type': 'multipart/form-data' },
      fileList: [],
      tableData: [],
    }
  },
  created() {},
  methods: {
    // 模版下载
    tempDownLoad() {
      this.$http.DownloadExcel.channelOrderTemplate()
        .then((res) => {
          if (res.status === 420) {
          } else {
            const blob = new Blob([res])
            const fileName = '渠道模版.xls'
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          }
        })
        .catch(() => {
          this.$message.error('无法下载此文件')
        })
     },
    onChange(file, filsList) {
      this.fileList = filsList
    },
    handleCurrentChange() {},
    // 上传进度
    uploadProgress(event, file, fileList) {},
    submitUpload(file, filelist) {
      if (this.fileList.length == 0) {
        this.$message.error('请上传文件')
        return false
      }
      this.$refs.upload.submit()
    },
    handleChange(params) {
      // 添加菊花
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '正在上传...',
        fullscreen: true,
      })
      const adminId = localStorage.getItem('staff')
      var formData = new FormData()
      const file = params.file
       const fileTitleTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      formData.append('file', file)
      formData.append('adminId', JSON.parse(adminId).id)
      formData.append('remark', this.remarks)
      this.$http.DownloadExcel.exportChannel(formData)
        .then((res) => {
          if (res.status === 420) {
          } else {
            const blob = new Blob([res])
            const fileName = `上传反馈表-${fileTitleTime}.xls`
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          }
        })
        .catch(() => {
          this.$message.error('无法下载此文件')
        })
        .finally(function () {
          loadingInstance.close()
        })

      this.fileTemp = params.file
    },
    handleRemove(file, fileList) {
      this.fileTemp = null
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f0f1f2;'
    },
  },
}
</script>
<style lang="scss" scoped>
.channelUpload-box {
  background: #f0f1f2;
  padding: 10px 10px 10px 10px;
  height: calc(100vh - 129px);
  overflow: scroll;
  .channelUpload-table {
    padding: 10px;
    margin-bottom: 20px;
    background: #fff;
    .channelUpload-upload-box {
      .upload-demo {
        margin-top: 20px;
        margin-bottom: 20px;
      }
      .upload-btn {
        margin-left: 10px;
        margin-bottom: 10px;
        width: 120px;
      }
    }
  }
}
.titleName {
  line-height: 40px;
}
.btnActive {
  background-color: #cccc;
  border: none;
}
/deep/ .el-upload-list__item {
  width: 300px;
}
</style>
