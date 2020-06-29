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
        <h4 class="row-style">线索分配占比设置</h4>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">销售等级</el-col>
          <el-col :span="6" class="leads-title">S级渠道占比</el-col>
          <el-col :span="6" class="leads-title">A级渠道占比</el-col>
          <el-col :span="6" class="leads-title">B级渠道占比</el-col>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">1级社群销售</el-col>
          <el-form :model="percent[1]" :rules="rules_1">
            <el-col :span="6">
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
            <el-col :span="6">
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
            <el-col :span="6">
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
          </el-form>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">2级社群销售</el-col>
          <el-form :model="percent[2]" :rules="rules_2">
            <el-col :span="6">
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
            <el-col :span="6">
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
            <el-col :span="6">
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
          </el-form>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">3级社群销售</el-col>
          <el-form :model="percent[3]" :rules="rules_3">
            <el-col :span="6">
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
            <el-col :span="6">
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
            <el-col :span="6">
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
          </el-form>
        </el-row>
        <el-row :gutter="10" class="row-style">
          <el-col :span="6" class="leads-title">新兵营</el-col>
          <el-form :model="percent[0]" :rules="rules_0">
            <el-col :span="6">
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
            <el-col :span="6">
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
            <el-col :span="6">
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
          B: null
        },
        1: {
          S: null,
          A: null,
          B: null
        },
        2: {
          S: null,
          A: null,
          B: null
        },
        3: {
          S: null,
          A: null,
          B: null
        }
      },
      rules_1: {
        S: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '1'
          }
        ],
        A: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '1'
          }
        ],
        B: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '1'
          }
        ]
      },
      rules_2: {
        S: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '2'
          }
        ],
        A: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '2'
          }
        ],
        B: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '2'
          }
        ]
      },
      rules_3: {
        S: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '3'
          }
        ],
        A: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '3'
          }
        ],
        B: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '3'
          }
        ]
      },
      rules_0: {
        S: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '0'
          }
        ],
        A: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '0'
          }
        ],
        B: [
          {
            validator: checkFun,
            required: true,
            trigger: 'blur',
            level: '0'
          }
        ]
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
        for (const obj of Object.values(this.percent)) {
          for (const val of Object.values(obj)) {
            if (val === null || val === undefined || val === 0 || val === '') {
              this.$message({
                message: '请填写完全',
                type: 'warning'
              })
              return
            }
          }
        }
        this.$http.Operating.addLeads(this.percent, this.schedulePeriod).then(
          (res) => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$emit('listenStepStatus', type)
            } else {
              this.$message.error('保存失败')
            }
          }
        )
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
      width: 60%;
      margin: 0 auto;
      h4 {
        margin: 0;
      }
      .row-style {
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }
        .leads-title {
          line-height: 40px;
          color: #666;
        }
        .input {
          width: 90px;
          & input {
            padding: 0 5px !important;
          }
        }
        .gary-txt {
          margin-left: 10px;
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
