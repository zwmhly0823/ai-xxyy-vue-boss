<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2021-04-08 16:42:11
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-29 15:59:54
-->
<template>
  <div class="upload-excel">
    <el-dialog
      title="导入数据"
      :visible.sync="showUploadExcel"
      :before-close="handleCloseUpdata"
      width="30%"
    >
      <el-upload
        ref="upload"
        action=""
        accept=".xls, .xlsx"
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
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          :disabled="uploading"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { Sup_scheduleIndex} from '@/utils/supList'
const courseTypeEnum = {
  0: 'TESTCOURSE', // 双周
  1: 'SYSTEMCOURSE', // 系统课
  2: 'TESTCOURSE_SINGLE', //单周
}
export default {
  props: {
    showUploadExcel: {
      type: Boolean,
      default: false
    },
    uploadCategory: {
      type: String,
      default: ''
    },
    category: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      uploading: false,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  },
  created() {
  },
  methods: {
    /** 判断上传excel需要用到的接口 */
    judgeUploadUrl() {
      let { courseType = 0} = this.$route.params
      courseType = Sup_scheduleIndex[courseType]
      const reqUrl = {
        batchSetTeacher: `/api/t/v1/enroll/importEnrollTeacher?courseType=${courseType}`, // 批量配置接生销售
        batchSetVolume: `/api/t/v1/enroll/updateEnrollDifficulty?courseType=${courseType}`, // 批量修改容量
        importChannel: `/api/t/v1/teacher/direct/importDirectChannel?courseType=${courseType}`, // 批量导入定向渠道
        artBiweekly: `/api/s/v1/managementChannel/bacthEdit?type=${courseTypeEnum[courseType]}&subject=MUSIC_APP`, // 双周体验课、渠道定向排期页面，“批量配置/修改”按钮
        artWeekly: `/api/s/v1/managementChannel/bacthEdit?type=${courseTypeEnum[courseType]}&subject=MUSIC_APP` // 单周体验课、渠道定向排期页面，“批量配置/修改”按钮
      }
      return reqUrl[this.uploadCategory]
    },
    /** 导入数据上传 */
    uploadFile(params) {
      const { importScheduleExcel } = this.$http.DownloadExcel
      const formdata = new FormData()
      const { file } = params
      formdata.append('file', file)

      this.uploading = true
      Object.assign(formdata, { url: this.judgeUploadUrl() })

      importScheduleExcel(formdata)
        .then((res) => {
          if (res && Object.prototype.toString.call(res) === '[object Blob]') {
            this.$refs.upload.clearFiles()
            this.$emit('update:showUploadExcel', false)
            this.downloadFn(res, file.name, () => {
              // this.$emit('setExcelStatus', 'complete')
              this.$message.success('上传成功！')
            })
          } else {
            this.$message.error(`上传失败，${res.errors || '请检测文件！'}`)
          }
        })
        .catch((err) => {
          console.log('err-00', err)
        })
        .finally(() => {
          this.uploading = false
        })
    },
    /** 导入数据 关闭事件 */
    handleCloseUpdata() {
      this.$refs.upload.clearFiles()
      this.$emit('update:showUploadExcel', false)
    },
    // 下载文件
    downloadFn(data, fileName = '下载', cb) {
      if (!data) return
      const blob = new Blob([data])
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)

      cb && cb()
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
}
</style>
