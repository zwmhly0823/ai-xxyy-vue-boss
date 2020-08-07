<template>
  <div class="set-leads-container">
    <div class="btn-area">
      <el-button
        type="primary"
        size="small"
        class="btn-directed"
        @click="exportExcel"
      >
        导入数据
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
        <el-row>
          <el-col :span="6">
            <h4 class="row-style">线索分配占比设置</h4>
          </el-col>
          <el-col :span="6"><h3>S</h3></el-col>
          <el-col :span="6"><h3>A</h3></el-col>
          <el-col :span="6"><h3>B</h3></el-col>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">销售等级</el-col>
          <el-col :span="3" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="3" class="leads-title title-center">接速设置</el-col>
          <el-col :span="3" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="3" class="leads-title title-center">接速设置</el-col>
          <el-col :span="3" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="3" class="leads-title title-center">接速设置</el-col>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">1级社群销售</el-col>
          <el-form ref="rules_1" :model="percent[1]" :rules="rules_1">
            <el-col :span="3">
              <el-form-item prop="S">
                <el-input
                  class="input"
                  v-model.number="percent[1].S"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="SRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[1].SRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="A">
                <el-input
                  class="input"
                  v-model.number="percent[1].A"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="ARobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[1].ARobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="B">
                <el-input
                  class="input"
                  v-model.number="percent[1].B"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="BRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[1].BRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">2级社群销售</el-col>
          <el-form ref="rules_2" :model="percent[2]" :rules="rules_2">
            <el-col :span="3">
              <el-form-item prop="S">
                <el-input
                  class="input"
                  v-model.number="percent[2].S"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="SRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[2].SRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="A">
                <el-input
                  class="input"
                  v-model.number="percent[2].A"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="ARobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[2].ARobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="B">
                <el-input
                  class="input"
                  v-model.number="percent[2].B"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="BRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[2].BRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">3级社群销售</el-col>
          <el-form ref="rules_3" :model="percent[3]" :rules="rules_3">
            <el-col :span="3">
              <el-form-item prop="S">
                <el-input
                  class="input"
                  v-model.number="percent[3].S"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="SRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[3].SRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="A">
                <el-input
                  class="input"
                  v-model.number="percent[3].A"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="ARobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[3].ARobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="B">
                <el-input
                  class="input"
                  v-model.number="percent[3].B"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="BRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[3].BRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">新兵营</el-col>
          <el-form ref="rules_0" :model="percent[0]" :rules="rules_0">
            <el-col :span="3">
              <el-form-item prop="S">
                <el-input
                  class="input"
                  v-model.number="percent[0].S"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="SRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[0].SRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="A">
                <el-input
                  class="input"
                  v-model.number="percent[0].A"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="ARobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[0].ARobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="B">
                <el-input
                  class="input"
                  v-model.number="percent[0].B"
                  size="mini"
                  placeholder="请输入内容"
                ></el-input>
                <span class="gary-txt">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item prop="BRobinNum">
                <el-input
                  class="speed-input"
                  v-model.number="percent[0].BRobinNum"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
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

const robinNumRuls = [
  { required: true, message: '接速不能为空' },
  { type: 'number', message: '接速必须为数字值' },
  {
    validator: (rule, value, callback) => {
      if (value > 0) {
        callback()
      } else {
        return callback(new Error('接速需大于0'))
      }
    },
    trigger: 'change'
  }
]
export default {
  props: {},
  components: { ChannelThreeded, ChannelThreelist },
  data() {
    var checkFun = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error('请输入分配占比'))
      }
      if (!Number.isInteger(value)) {
        return callback(new Error('请输入数字值'))
      }
      // 当前销售级别下各等级分数及总和
      const S = Number(this.percent[rule.level].S)
      const A = Number(this.percent[rule.level].A)
      const B = Number(this.percent[rule.level].B)
      const sum = S + A + B
      if (S !== 0 && A !== 0 && B !== 0 && sum !== 100) {
        return callback(new Error('请填写正确的数字'))
      }
      if (value > 100 || sum > 100) {
        return callback(new Error('不能超过100'))
      }
      callback()
    }
    return {
      editChannelThreeded: null,
      channelThreededList: [],
      centerDialogVisible: false,
      uploading: false,
      dialogVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      percent: {
        0: {
          S: null,
          A: null,
          B: null,
          SRobinNum: null,
          ARobinNum: null,
          BRobinNum: null
        },
        1: {
          S: null,
          A: null,
          B: null,
          SRobinNum: null,
          ARobinNum: null,
          BRobinNum: null
        },
        2: {
          S: null,
          A: null,
          B: null,
          SRobinNum: null,
          ARobinNum: null,
          BRobinNum: null
        },
        3: {
          S: null,
          A: null,
          B: null,
          SRobinNum: null,
          ARobinNum: null,
          BRobinNum: null
        }
      },
      rules_1: {
        S: [
          { validator: checkFun, required: true, trigger: 'change', level: '1' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'change', level: '1' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'change', level: '1' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      },
      rules_2: {
        S: [
          { validator: checkFun, required: true, trigger: 'change', level: '2' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'change', level: '2' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'change', level: '2' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      },
      rules_3: {
        S: [
          { validator: checkFun, required: true, trigger: 'change', level: '3' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'change', level: '3' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'change', level: '3' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      },
      rules_0: {
        S: [
          { validator: checkFun, required: true, trigger: 'change', level: '0' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'change', level: '0' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'change', level: '0' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      }
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
      console.log('row', row)
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
        console.log(res, 'getRecord-res')
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
      // TODO 渠道线索定向分配
      console.log('渠道线索定向分配')
      this.centerDialogVisible = true
    },
    // 修改时获取数据
    getLeads(params) {
      this.$http.Operating.getLeads(params).then((res) => {
        if (res.code === 0 && Object.keys(res.payload).length > 0) {
          Object.assign(this.percent, res.payload)
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
        // 上一步
        this.$emit('listenStepStatus', type)
      } else {
        // 下一步
        // 数据填写校验
        const rules0 = this.$refs.rules_0.validate()
        const rules1 = this.$refs.rules_1.validate()
        const rules2 = this.$refs.rules_2.validate()
        const rules3 = this.$refs.rules_3.validate()
        Promise.all([rules0, rules1, rules2, rules3])
          .then((valids) => {
            if (valids) {
              this.$http.Operating.addLeads(
                this.percent,
                this.schedulePeriod
              ).then((res) => {
                if (res.code === 0) {
                  this.$message.success('保存成功')
                  this.$emit('listenStepStatus', type)
                } else {
                  this.$message.error('保存失败')
                }
              })
            }
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('请填写完全')
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
    padding-right: 6%;
  }
  .set-area {
    padding: 10px;
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
          margin-left: 5px;
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
