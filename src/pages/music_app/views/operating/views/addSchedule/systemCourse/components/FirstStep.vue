<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-15 18:46:45
 -->
<template>
  <div class="first-step">
    <div class="step-container step-one-container">
      <!-- 排期基本设置 -->
      <div class="divider-title">
        <h4>排期基本设置</h4>
        <el-divider></el-divider>
      </div>
      <el-form :model="formInfo" :inline="true" :rules="rules" ref="formInfo">
        <div class="time-select">
          <el-row>
            <el-col :span="8">
              <h4>售卖周期</h4>
              <el-form-item label prop="sellCycleTime">
                <el-date-picker
                  size="small"
                  v-model="formInfo.sellCycleTime"
                  format="yyyy 年 MM 月 dd 日"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '00:00:00']"
                  @change="sellCycleTimeChange"
                  :picker-options="pickerBefore"
                ></el-date-picker>
              </el-form-item>
              <h6>建议体验课售卖周期从本周五至下周五</h6>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <h4>上课周期</h4>
              <el-form-item label prop="attendClassTimeStart">
                <el-date-picker
                  size="small"
                  v-model="formInfo.attendClassTimeStart"
                  type="date"
                  placeholder="开课时期"
                  value-format="timestamp"
                  :picker-options="pickerBeginDateBefore"
                  @change="startClassChange"
                  :default-value="
                    this.sellCycleObj.endDate
                      ? this.sellCycleObj.endDate
                      : new Date()
                  "
                ></el-date-picker>
              </el-form-item>
              <span
                class="time-space"
                v-if="courseType == '0' || courseType == '2'"
                >至</span
              >
              <el-form-item
                label
                prop="attendClassTimeEnd"
                v-if="courseType == '0' || courseType == '2'"
              >
                <el-date-picker
                  size="small"
                  v-model="formInfo.attendClassTimeEnd"
                  type="date"
                  placeholder="结课时期"
                  :picker-options="pickerBeginDateAfter"
                  value-format="timestamp"
                  @change="endClassChange"
                ></el-date-picker>
                <!-- <el-date-picker
                  size="small"
                  v-model="formInfo.attendClassTimeEnd"
                  type="date"
                  placeholder="结课时期"
                  :picker-options="pickerBeginDateAfter"
                >
                </el-date-picker>-->
                <!-- value-format="yyyy-MM-dd" <el-date-picker
                  size="small"
                  v-model="formInfo.attendClassTime"
                  format="yyyy 年 MM 月 dd 日"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00']"
                  @change="attendClassTimeChange"
                >
                </el-date-picker>-->
              </el-form-item>
              <!-- 体验课周三，系统课周五 -->
              <!-- <h6>{{`开始上课时间必须从星期${courseType==0?'三':'五'}开始`}}</h6> -->
            </el-col>
            <!-- </el-row>
            <el-row>-->
            <el-col v-if="courseType == '1'" :span="4">
              <h4>接速设置</h4>
              <el-form-item label prop="robinNum">
                <el-input
                  size="small"
                  v-model.number="formInfo.robinNum"
                  placeholder="请输入学生数"
                ></el-input>
              </el-form-item>
              <h6>轮询分配的学生数设置</h6>
            </el-col>
            <el-col v-else :span="4" :offset="1"></el-col>
          </el-row>
        </div>
        <!-- 售卖周期设置 -->
        <div class="divider-title">
          <h4>售卖周期设置</h4>
          <el-divider></el-divider>
        </div>
        <div class="sale-time" v-if="diffDay">
          <el-row>
            <el-col :span="3">
              <span class="t-head">售卖日期</span>
            </el-col>
            <el-col :span="3">
              <span class="t-head">限售(对内)</span>
            </el-col>
            <el-col :span="3">
              <span class="t-head">限售(对外)</span>
            </el-col>
            <el-col :span="3">
              <span class="t-head">已售(对外)</span>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in diffDay" :key="index" :gutter="10">
            <el-col :span="3">
              <el-form-item label style="width: 80%">
                <el-input
                  v-model="formInfo[`sellDate_${index}`]"
                  size="mini"
                  :disabled="true"
                  placeholder="售卖日期"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                label
                :inline="true"
                :prop="`limit_${index}`"
                :rules="[
                  {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur',
                  },
                  {
                    type: 'number',
                    transform: (value) => Number(value),
                    max: 99999,
                    min: 0,
                    message: '必须为(1-99999)数字',
                    trigger: 'blur',
                  },
                ]"
              >
                <!-- <el-input
                  type="number"
                  v-model=""
                  size="mini"
                  
                ></el-input>-->
                <el-input-number
                  v-model="formInfo[`limit_${index}`]"
                  controls-position="right"
                  size="mini"
                  :min="1"
                  :max="9999"
                  placeholder="限售(对内)"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-form-item
                label
                :prop="`fakeLimit_${index}`"
                :rules="[
                  {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur',
                  },
                  {
                    type: 'number',
                    transform: (value) => Number(value),
                    max: 99999,
                    min: 0,
                    message: '必须为(1-99999)数字',
                    trigger: 'blur',
                  },
                ]"
              >
                <!-- <el-input v-model="formInfo[`fakeLimit_${index}`]" size="mini" placeholder="限售(对外)"></el-input> -->
                <el-input-number
                  v-model="formInfo[`fakeLimit_${index}`]"
                  controls-position="right"
                  size="mini"
                  :min="1"
                  :max="9999"
                  placeholder="限售(对外)"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-form-item
                label
                :prop="`fakeSales_${index}`"
                :rules="[
                  {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur',
                  },
                  {
                    type: 'number',
                    transform: (value) => Number(value),
                    max: 99999,
                    min: 0,
                    message: '必须为(1-99999)数字',
                    trigger: 'blur',
                  },
                ]"
              >
                <!-- <el-input v-model="formInfo[`fakeSales_${index}`]" size="mini" placeholder="已售(对外)"></el-input> -->
                <el-input-number
                  v-model="formInfo[`fakeSales_${index}`]"
                  controls-position="right"
                  size="mini"
                  :min="1"
                  :max="9999"
                  placeholder="已售(对外)"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <h4 class="tip">（请先选择售卖周期）</h4>
        </div>
      </el-form>
      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="warning" plain @click="cancel"
          >取消</el-button
        >
        <el-button size="small" type="primary" @click="nextStep"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import { Sup_scheduleIndex, Sup_scheduleSubmit } from '@/utils/supList'
export default {
  props: ['stepStatus'],
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入学生数'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    return {
      // 周几放课
      passWeek: [1],
      courseType: 0, // 课程类型；0 体验课；1系统课
      formInfo: {
        sellCycleTime: '',
        attendClassTimeStart: '',
        attendClassTimeEnd: '',
        // attendClassTime: '',
        robinNum: '', // 接速设置
      },
      setSellTimeForm: [],
      attendClassObj: {
        // 上课周期
        courseDay: '',
        endCourseDay: '',
      },
      sellCycleObj: {
        startDate: '',
        endDate: '',
      },
      diffDay: '',
      rules: {
        sellCycleTime: [
          {
            required: true,
            message: '请选择售卖日期',
            trigger: 'change',
          },
        ],
        attendClassTimeStart: [
          {
            required: true,
            message: '请选择开课时期',
            trigger: 'change',
          },
        ],
        attendClassTimeEnd: [
          {
            required: true,
            message: '请选择结课时期',
            trigger: 'change',
          },
        ],
        // attendClassTime: [
        //   {
        //     required: true,
        //     message: '请选择上课周期',
        //     trigger: 'change'
        //   }
        // ],
        robinNum: [{ validator: checkNumber, required: true, trigger: 'blur' }],
      },
      pickerBefore: {
        disabledDate: (time) => {},
      },
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          // const endDateVal = this.formInfo.attendClassTimeEnd
          // // const now = new Date().getTime() - 86400000
          // if (endDateVal) {
          //   return time.getTime() > endDateVal
          // }
          // if (time.getTime()<=this.sellCycleObj.endDate) {
          //   return time.getDay() !== this.passWeek
          // }

          var endDate = this.sellCycleObj.endDate
          if (time.getTime() < endDate) {
            return true
          } else {
            // 体验课周三，系统课周五
            if (this.passWeek.indexOf(time.getDay()) < 0) {
              return true
            }
          }
        },
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          const endDateVal = this.formInfo.attendClassTimeStart
          if (endDateVal) {
            return time.getTime() < endDateVal
          }
        },
      },
    }
  },
  activated() {},
  computed: {},
  watch: {
    ['sellCycleObj.endDate']: (res) => {
      // this.pickerBeginDateBefore.disabledDate()
    },
  },
  async created() {
    let { period = '', courseType = 0 } = this.$route.params
    this.period = period
    this.courseType = courseType
    // 双周体验课  5,6,0,1
    // 系统课  2,6
    this.courseType !== '2'
      ? (this.passWeek = [5, 6, 0, 1])
      : (this.passWeek = [2, 6])

    if (+period) {
      // 编辑页面 TODO:
      try {
        const _data = await this.getScheduleFirstStep({
          period,
          courseType: Sup_scheduleSubmit[courseType],
        })
        const {
          courseDay = '',
          endCourseDay = '',
          startDate = '',
          endDate = '',
          robinNum = '',
          sellCycle = [],
        } = _data.payload

        const sellCycleTime = [
          new Date(Number(`${startDate}`)),
          new Date(Number(`${endDate}`)),
        ]

        this.formInfo = {
          sellCycleTime,
          attendClassTimeStart: new Date(Number(`${courseDay}`)),
          attendClassTimeEnd: new Date(Number(`${endCourseDay}`)),
          // attendClassTime: [
          //   new Date(Number(`${courseDay}`)),
          //   new Date(Number(`${endCourseDay}`))
          // ],
          sellCycle,
          robinNum, // 接速设置
        }
        // this.startClassChange()
        this.sellCycleTimeChange(sellCycleTime)
        // this.attendClassTimeChange(this.formInfo.attendClassTime)
      } catch (err) {}
    }
  },
  methods: {
    // 开课时期
    startClassChange(courseDay) {
      this.formInfo.attendClassTimeStart = courseDay || ''
      if(!courseDay){
        this.endClassChange()
        return
      }
      if (this.courseType == '2') {
        this.endClassChange(courseDay + 365 * 24 * 3600 * 1000)
      }else{
        this.endClassChange(courseDay + 13 * 24 * 3600 * 1000)
      }
    },
    // 节课时期
    endClassChange(endCourseDay) {
      this.formInfo.attendClassTimeEnd = endCourseDay || ''
    },
    // // 上课周期
    // attendClassTimeChange(val) {
    //   const [courseDay = '', endCourseDay = ''] = val || []
    //   this.attendClassObj = {
    //     ...this.attendClassObj,
    //     courseDay: courseDay ? courseDay.getTime() : '',
    //     endCourseDay: endCourseDay ? endCourseDay.getTime() : ''
    //   }
    // },
    // 售卖周期
    sellCycleTimeChange(val) {
      const [startDate = '', endDate = ''] = val || []

      var attendClassTimeStart = this.formInfo.attendClassTimeStart
      if (
        endDate.length != 0 &&
        attendClassTimeStart &&
        endDate.getTime() > attendClassTimeStart
      ) {
        this.$message({
          message: '售卖结束时间不能晚于开课时间',
          type: 'warning',
        })
        this.formInfo.attendClassTimeStart = ''
      }

      const diffTime = Number(endDate) - Number(startDate)
      // 编辑进来走这里

      this.diffDay = startDate
        ? Math.floor(diffTime / (24 * 3600 * 1000)) + 1
        : 0

      const { sellCycle = new Array(this.diffDay) } = this.formInfo

      for (let i = 0; i < this.diffDay; i++) {
        this.$set(
          this.formInfo,
          `sellDate_${i}`,
          this.calcSellYear(startDate, i)
        )
        this.$set(
          this.formInfo,
          `limit_${i}`,
          (sellCycle[i] && sellCycle[i].limit) || '10000'
        )

        this.$set(
          this.formInfo,
          `fakeLimit_${i}`,
          (sellCycle[i] && sellCycle[i].fakeLimit) || '1200'
        )
        this.$set(
          this.formInfo,
          `fakeSales_${i}`,
          (sellCycle[i] && sellCycle[i].fakeSales) || '100'
        )
      }

      this.sellCycleObj = {
        ...this.sellCycleObj,
        startDate: startDate.length != 0 ? startDate.getTime() : '',
        endDate: endDate.length != 0 ? endDate.getTime() : '',
      }
    },
    // 计算售卖设置里的 ’售卖日期‘
    calcSellYear(startDay, NumDay) {
      if (startDay) {
        var dtTmp = new Date(startDay)

        const time = new Date(Date.parse(dtTmp) + 86400000 * NumDay)
        const y = time.getFullYear()
        const month = time.getMonth() + 1
        const day = time.getDate()

        const m = month <= 9 ? '0' + month : month
        const d = day <= 9 ? '0' + day : day
        return y + '/' + m + '/' + d
      } else {
        return ''
      }
    },
    // 新增招生排期第一步-add
    async addScheduleFirstStep(params, cb) {
      const loadingInstance = Loading.service({
        target: '.app-main',
        lock: true,
        text: '正在保存...',
        fullscreen: true,
      })
      try {
        const _res = await this.$http.Operating.addScheduleFirstStep(params)

        if (_res.code === 0) cb(_res)
      } catch (err) {
        this.$message({
          message: '获取数据出错',
          type: 'warning',
        })
      } finally {
        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => loadingInstance.close())
      }
    },
    // 新增招生排期第一步-edit获取数据
    async getScheduleFirstStep(params) {
      try {
        const _res = await this.$http.Operating.getScheduleFirstStep(params)
        return Promise.resolve(_res)
      } catch (err) {
        this.$message({
          message: '获取列表出错',
          type: 'warning',
        })
        return Promise.reject(err)
      }
    },
    // 点击下一步时封装数据
    pacakageFormInfo() {
      const sendFrom = {}
      for (let i = 0; i < this.diffDay; i++) {
        const obj = {
          sellDate: new Date(this.formInfo[`sellDate_${i}`]).getTime(),
          limit: this.formInfo[`limit_${i}`],
          fakeLimit: this.formInfo[`fakeLimit_${i}`],
          fakeSales: this.formInfo[`fakeSales_${i}`],
        }
        this.setSellTimeForm.push(obj)
      }
      // 时间格式转化：转换为0点时刻
      const courseDay = new Date(this.formInfo.attendClassTimeStart).setHours(0)

      const endCourseDay = new Date(this.formInfo.attendClassTimeEnd).getTime()

      Object.assign(sendFrom, {
        ...this.sellCycleObj,
        courseDay,
        endCourseDay,
        robinNum: this.formInfo.robinNum,
        sellCycle: this.setSellTimeForm,
        type: Sup_scheduleIndex[this.courseType],
        period: +this.period || '',
      })

      return sendFrom
    },
    nextStep() {
      const sendFrom = this.pacakageFormInfo()

      // TODO:
      this.$refs.formInfo.validate((valid) => {
        if (valid) {
          const cb = (_res) => {
            const {
              payload: { period },
            } = _res

            this.period = period

            let routerPeriod = this.$route.params.period
            if (!routerPeriod || routerPeriod == '0') {
              this.$route.params.period = this.period
            }

            this.$store.commit('setSchedulePeriod', period)
            this.$emit('listenStepStatus', sendFrom)
          }
          // 掉接口 TODO:
          this.addScheduleFirstStep(sendFrom, cb)
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/operatingSchedule' })
    },
  },
}
</script>
<style lang="scss" scoped>
.step-one-container {
  .time-space {
    height: 40px;
    display: inline-flex;
    align-items: center;
    /* width: 20px; */
    justify-content: center;
    margin-right: 10px;
  }
  .el-divider {
    margin: 10px 0 !important;
  }
  .tip {
    color: #aaa;
    font-size: 12px;
  }
  .divider-title {
    h4 {
      margin: 10px 0;
    }
  }
  .time-select {
    h6 {
      margin: 10px 0;
      color: #aaa;
    }
  }
  .sale-time {
    .el-row {
      .el-form-item {
        margin-bottom: 13px;
      }
      // &:first-child {
      //   margin-bottom: 10px;
      // }
      &:last-child {
        margin-bottom: 0;
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
