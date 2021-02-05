<template>
  <div class="set-leads-container">
    <div class="btn-area">
      <el-button
        type="primary"
        size="small"
        class="btn-directed"
        @click="exportExcel"
      >
        转介绍规则导入
      </el-button>
      <el-button
        type="primary"
        size="small"
        class="btn-directed"
        @click="toSetChannelLeads"
      >
        渠道线索定向分配
      </el-button>
    </div>
    <div class="set-area">
      <div class="set-percent">
        <el-row v-if="leaderLineForm.leaderLine.length">
          <el-col :span="4">
            <h4 class="row-style">线索分配占比设置</h4>
          </el-col>
          <el-col
            v-for="(line, index) in leaderLineForm.leaderLine[0]
              .channelLevelList"
            :key="index"
            :span="6"
            ><h3>{{ line.channelLevel }}</h3></el-col
          >
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="4" class="leads-title">销售等级</el-col>
          <el-col :span="3" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="3" class="leads-title title-center">接速设置</el-col>
          <el-col :span="3" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="3" class="leads-title title-center">接速设置</el-col>
          <el-col :span="3" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="3" class="leads-title title-center">接速设置</el-col>
        </el-row>
        <!-- 线索分配占比设置start -->
        <el-form ref="leaderLineForm" :model="leaderLineForm" :inline="true">
          <el-row
            :gutter="10"
            class="row-style"
            v-for="(line, index) in leaderLineForm.leaderLine"
            :key="index"
          >
            <el-col :span="4" class="leads-title">{{
              line.teacherLevelName
            }}</el-col>
            <el-col
              :span="6"
              v-for="(channel, i_channel) in line.channelLevelList"
              :key="i_channel"
            >
              <div class="chanel-item">
                <!-- :prop="'channelLevelList.' + i_channel + '.rate'" -->
                <el-form-item
                  :prop="
                    'leaderLine.' +
                      index +
                      '.channelLevelList.' +
                      i_channel +
                      '.rate'
                  "
                  :rules="leaderLineRule"
                >
                  <el-input
                    class="input"
                    v-model.number="channel.rate"
                    size="mini"
                    placeholder="输入占比"
                  ></el-input>
                  <span class="gary-txt">%</span>
                </el-form-item>
                <el-form-item
                  :prop="
                    'leaderLine.' +
                      index +
                      '.channelLevelList.' +
                      i_channel +
                      '.robinNum'
                  "
                  :rules="robinNumRuls"
                >
                  <el-input
                    class="input"
                    v-model.number="channel.robinNum"
                    size="mini"
                    placeholder="输入接速"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!-- 线索分配占比设置end -->
      </div>
    </div>
    <ChannelThreelist
      :channelThreededList="channelThreededList"
      @editRow="editRow"
    ></ChannelThreelist>
    <!-- 取消、下一步 -->
    <div class="operate-btn">
      <el-button size="small" type="primary" @click="stepOperate(0)">
        上一步
      </el-button>
      <el-button size="small" type="primary" @click="stepOperate(1)">
        下一步
      </el-button>
      <el-button size="small" type="info" @click="skip">
        跳过此步
      </el-button>
    </div>
    <!-- 导入数据模态框 -->
    <el-dialog
      title="导入物流信息"
      :visible.sync="dialogVisible"
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
        :on-progress="uploadProgress"
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
        <!-- :loading="uploading" -->
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>

    <!-- 渠道线索定向分配模态框 -->
    <channel-threeded
      :centerDialogVisible="centerDialogVisible"
      @dialogOperate="dialogOperate"
      :editChannelThreeded="editChannelThreeded"
      v-if="centerDialogVisible"
    ></channel-threeded>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelThreeded from './ChannelThreeded'
import ChannelThreelist from './ChannelThreelist'

export default {
  props: {},
  components: { ChannelThreeded, ChannelThreelist },
  data() {
    return {
      editChannelThreeded: null,
      channelThreededList: [],
      centerDialogVisible: false,
      uploading: false,
      dialogVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      leaderLineForm: {
        leaderLine: []
      },
      leaderLineRule: [
        {
          required: true,
          message: '不能为空',
          trigger: 'blur'
        },
        {
          type: 'number',
          transform: (value) => Number(value),
          message: '必须为数字',
          trigger: 'blur'
        }
      ],
      robinNumRuls: [
        { required: true, message: '不能为空' },
        { type: 'number', message: '必须为数字' },
        {
          validator: (rule, value, callback) => {
            if (value > 0) {
              callback()
            } else {
              return callback(new Error('接速需>0'))
            }
          },
          trigger: 'change'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['schedulePeriod'])
  },
  created() {
    const { courseType = 0 } = this.$route.params
    if (this.schedulePeriod) {
      this.getLeads({ period: this.schedulePeriod, courseType })
    }
    this.getRecord()
  },
  methods: {
    editRow(row) {
      this.centerDialogVisible = true
      this.editChannelThreeded = row
    },
    dialogOperate(args) {
      const { close = true, submitSucc = false } = args
      this.centerDialogVisible = !close
      this.editChannelThreeded = null
      if (submitSucc) this.getRecord()
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },
    /** 导入数据 关闭事件 */
    handleCloseUpdata() {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
    },
    /** 导入数据上传 */
    uploadFile(params) {
      const { courseType = 0 } = this.$route.params
      const formdata = new FormData()
      const { file } = params
      formdata.append('file', file)

      this.uploading = true
      Object.assign(formdata, { courseType })

      this.$http.DownloadExcel.updateScheduleExcel(formdata)
        .then((res) => {
          console.log(res)
          // 有可能下载失败，返回{code: '500'},但responseType: 'blob'会把data强制转为blob，导致下载undefined.excel
          // 解决：将已转为blob类型的data转回json格式，判断是否下载成功
          //  let r = new FileReader()
          //   r.onload = function () {

          //   }
          if (res && Object.prototype.toString.call(res) === '[object Blob]') {
            this.$refs.upload.clearFiles()
            this.dialogVisible = false
            this.downloadFn(res, file.name, () => {
              this.$emit('setExcelStatus', 'complete')
            })
          } else {
            this.$message.error('上传失败')
          }
        })
        .finally(() => {
          this.uploading = false
        })
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
    /** 渠道线索定向分配 教师渠道绑定-查找记录 */
    async getRecord(cb) {
      try {
        const { period = '' } = this.$route.params
        const res = await this.$http.Operating.getRecord({ period })
        if (res.code === 0) {
          this.channelThreededList = res.payload
          cb && cb()
        }
      } catch (err) {
        this.$message.error('配置出错')
      }
    },
    /** 上传进度 */
    uploadProgress(event, file, fileList) {},
    /** 导入数据 */
    exportExcel() {
      this.dialogVisible = true
    },
    toSetChannelLeads() {
      this.centerDialogVisible = true
    },
    // 修改时获取数据
    getLeads(params) {
      this.$http.Operating.getLeads(params).then((res) => {
        if (res.code === 0 && Object.keys(res.payload).length > 0) {
          this.leaderLineForm.leaderLine = res.payload
        } else {
          this.$message({
            message: '获取数据失败',
            type: 'warning'
          })
        }
      })
    },
    // 上一步、下一步
    stepOperate(type) {
      if (!type) {
        this.$emit('listenStepStatus', type)
      } else {
        this.$refs.leaderLineForm.validate((valid) => {
          if (valid) {
            this.$http.Operating.addLeads(
              this.leaderLineForm.leaderLine,
              this.schedulePeriod
            )
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success('保存成功')
                  this.$emit('listenStepStatus', type)
                } else {
                  this.$message.error('保存失败')
                }
              })
              .catch((err) => {
                console.log(err)
                this.$message.error('保存失败')
              })
          } else {
            return false
          }
        })
      }
    },
    // 跳过这一步 产品临时需求
    skip() {
      this.$emit('listenStepStatus', 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-loading-mask.is-fullscreen {
  z-index: 14000 !important; //因为我的header的z-index比较大。这里看情况
}
.set-leads-container {
  width: 80%;
  margin: 0 auto;
  .btn-area {
    text-align: right;
  }
  .set-area {
    padding: 10px 10px 25px 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-top: 10px;
    // padding: 0 20px 20px;
    .set-percent {
      h4 {
        margin: 0;
      }
      h3 {
        margin: 0;
        text-align: center;
      }
      .row-style {
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }
        .chanel-item {
          display: flex;
        }
        .title-center {
          text-align: center;
        }
        .leads-title {
          line-height: 40px;
          color: #666;
        }
        .input {
          min-width: 80px;
          width: 80%;
          & input {
            padding: 0 5px !important;
          }
        }
        .speed-input {
          width: 60px;
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }
        .gary-txt {
          display: inline-block;
          text-align: center;
          width: 20px;
          color: #999;
        }
      }
    }
  }
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 40px 0 10px 0;
  }
}
</style>
<style lang="scss">
.set-leads-container {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
