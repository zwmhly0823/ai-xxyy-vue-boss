<template>
  <div class="set-leads-container">
    <h4>
      体验课排期-渠道比例设置
    </h4>
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
          <el-col :span="6" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="6" class="leads-title title-center">渠道占比</el-col>
          <el-col :span="6" class="leads-title title-center">渠道占比</el-col>
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
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!-- 线索分配占比设置end -->
      </div>
    </div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Sup_scheduleSubmit } from '@/utils/supList'
export default {
  props: {
    category: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      editChannelThreeded: null,
      channelThreededList: [],
      centerDialogVisible: false,
      uploading: false,
      dialogVisible: false,
      exportType: '',
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
      this.getLeads({
        period: this.schedulePeriod,
        courseType
      })
    }
    // this.getRecord()
  },
  methods: {
    /** 渠道线索定向分配 教师渠道绑定-查找记录 */
    async getRecord(cb) {
      try {
        const { period = this.schedulePeriod } = this.$route.params
        const res = await this.$http.Operating.getRecord({ period })
        if (res.code === 0) {
          this.channelThreededList = res.payload
          cb && cb()
        }
      } catch (err) {
        this.$message.error('配置出错')
      }
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
          const { courseType } = this.$route.params
          if (valid) {
            this.$http.Operating.addLeads(
              this.leaderLineForm.leaderLine,
              this.schedulePeriod,
              Sup_scheduleSubmit[courseType]
            )
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success('保存成功')
                  this.$emit('listenStepStatus', type)
                }
              })
              .catch((err) => {
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
          width: 85%;
          .gary-txt {
            // width: 20px;
          }
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
