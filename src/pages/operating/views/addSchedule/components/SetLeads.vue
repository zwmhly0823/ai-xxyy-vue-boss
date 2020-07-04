<template>
  <div class="set-leads-container">
    <div class="btn-area">
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
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
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
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
const robinNumRuls = [
  { required: true, message: '接速不能为空' },
  { type: 'number', message: '接速必须为数字值' }
]
export default {
  props: {},
  components: {},
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
      // if (sum > 100) {
      //   return callback(new Error('请填写正确的数字'))
      // }
      if (sum !== 100) {
        return callback(new Error('请填写正确的数字'))
      }
      callback()
    }
    return {
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
          { validator: checkFun, required: true, trigger: 'blur', level: '1' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'blur', level: '1' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'blur', level: '1' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      },
      rules_2: {
        S: [
          { validator: checkFun, required: true, trigger: 'blur', level: '2' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'blur', level: '2' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'blur', level: '2' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      },
      rules_3: {
        S: [
          { validator: checkFun, required: true, trigger: 'blur', level: '3' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'blur', level: '3' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'blur', level: '3' }
        ],
        SRobinNum: robinNumRuls,
        ARobinNum: robinNumRuls,
        BRobinNum: robinNumRuls
      },
      rules_0: {
        S: [
          { validator: checkFun, required: true, trigger: 'blur', level: '0' }
        ],
        A: [
          { validator: checkFun, required: true, trigger: 'blur', level: '0' }
        ],
        B: [
          { validator: checkFun, required: true, trigger: 'blur', level: '0' }
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
  },
  methods: {
    toSetChannelLeads() {
      // TODO 渠道线索定向分配
      console.log('渠道线索定向分配')
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
.set-leads-container {
  .btn-area {
    text-align: right;
  }
  .set-area {
    padding: 0 20px 20px;
    .set-percent {
      width: 80%;
      margin: 0 auto;
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
