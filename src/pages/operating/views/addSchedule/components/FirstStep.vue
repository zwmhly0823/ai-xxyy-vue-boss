<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-16 16:29:49
 -->
<template>
  <div class="first-step">
    <div class="step-container step-one-container">
      <!-- 排期基本设置 -->
      <div class="divider-title">
        <h4>排期基本设置</h4>
        <el-divider></el-divider>
      </div>
      <div class="time-select">
        <el-row>
          <el-col :span="8">
            <h4>售卖周期</h4>
            <el-date-picker
              v-model="sellCycleTime"
              format="yyyy 年 MM 月 dd 日"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '22:00:00']"
              @change="sellCycleTimeChange"
            >
            </el-date-picker>
            <h6>建议体验课售卖周期从本周五至下周五</h6>
          </el-col>
          <el-col :span="8">
            <h4>上课周期</h4>
            <el-date-picker
              v-model="attendClassTime"
              format="yyyy 年 MM 月 dd 日"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              @change="attendClassTimeChange"
            >
            </el-date-picker>
            <h6>开始上课时间必须从星期一开始</h6>
          </el-col>
          <el-col :span="6">
            <h4>接速设置</h4>
            <el-input v-model="robinNum" placeholder="请输入学生数"></el-input>
            <h6>轮询分配的学生数设置</h6>
          </el-col>
        </el-row>
      </div>
      <!-- 售卖周期设置 -->
      <div class="divider-title">
        <h4>售卖周期设置</h4>
        <el-divider></el-divider>
      </div>
      <div class="sale-time" v-if="sellCycleObj.diffDay">
        <el-row>
          <el-col :span="3"><span class="t-head">售卖日期</span></el-col>
          <el-col :span="3"><span class="t-head">限售(对内)</span></el-col>
          <el-col :span="3"><span class="t-head">限售(对外)</span></el-col>
          <el-col :span="3"><span class="t-head">已售(对外)</span></el-col>
        </el-row>
        <el-row
          v-for="(item, index) in sellCycleObj.diffDay"
          :key="index"
          :gutter="10"
        >
          <el-col :span="2"
            ><el-input
              v-model="formInfo[`sell_day_${index}`]"
              size="small"
              :disabled="true"
              placeholder="售卖日期"
            ></el-input
          ></el-col>
          <el-col :span="2" :offset="1"
            ><el-input
              v-model="formInfo[`limit_sell_in_${index}`]"
              size="small"
              placeholder="限售(对内)"
            ></el-input
          ></el-col>
          <el-col :span="2" :offset="1"
            ><el-input
              v-model="formInfo[`limit_sell_out_${index}`]"
              size="small"
              placeholder="限售(对外)"
            ></el-input
          ></el-col>
          <el-col :span="2" :offset="1"
            ><el-input
              v-model="formInfo[`has_sell_out_${index}`]"
              size="small"
              placeholder="已售(对外)"
            ></el-input
          ></el-col>
        </el-row>
      </div>
      <div v-else>
        <h4 class="tip">（请先选择售卖周期）</h4>
      </div>
      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="warning" plain @click="stepStatus = 1"
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
// import { GetAgeByBrithday } from '@/utils'
export default {
  props: ['stepStatus'],
  data() {
    return {
      courseType: 0, // 课程类型；0 体验课；1系统课
      formInfo: {},
      setSellTimeForm: [],
      attendClassObj: {
        // 上课周期
        courseDay: '',
        endCourseDay: ''
      },
      sellCycleObj: {
        startDate: '',
        endDate: '',
        diffDay: ''
      },
      sellCycleTime: '',
      attendClassTime: '',
      robinNum: '' // 接速设置
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 上课周期
    attendClassTimeChange(val) {
      const [courseDay = '', endCourseDay = ''] = val || []
      this.attendClassObj = {
        ...this.attendClassObj,
        courseDay: courseDay ? courseDay.getTime() : '',
        endCourseDay: endCourseDay ? endCourseDay.getTime() : ''
      }
    },
    // 通过售卖日期的变化的天数，动态设置售卖周期
    calcSellTimeByDiffDay() {},
    // 售卖周期
    sellCycleTimeChange(val) {
      const [startDate = '', endDate = ''] = val || []

      const diffTime = Number(endDate) - Number(startDate)
      const diffDay = startDate
        ? Math.floor(diffTime / (24 * 3600 * 1000)) + 1
        : 0

      for (let i = 0; i < diffDay; i++) {
        this.$set(
          this.formInfo,
          `sell_day_${i}`,
          this.calcSellYear(startDate, i)
        )
        this.$set(this.formInfo, `limit_sell_in_${i}`, '10000')
        this.$set(this.formInfo, `limit_sell_out_${i}`, '1200')
        this.$set(this.formInfo, `has_sell_out_${i}`, '100')
      }
      this.sellCycleObj = {
        ...this.sellCycleObj,
        startDate: startDate ? startDate.getTime() : '',
        endDate: endDate ? endDate.getTime() : '',
        diffDay
      }
    },
    // 计算售卖设置里的 ’售卖日期‘
    calcSellYear(time, index) {
      if (time) {
        const y = time.getFullYear()
        const month = time.getMonth() + 1
        const day = time.getDate() + index

        const m = month <= 9 ? '0' + month : month
        const d = day <= 9 ? '0' + day : day
        return y + '-' + m + '-' + d
      } else {
        return ''
      }
    },
    // 点击下一步时封装数据
    pacakageFormInfo() {
      const sendFrom = {}
      for (let i = 0; i < this.sellCycleObj.diffDay; i++) {
        const obj = {
          sellDate: this.formInfo[`sell_day_${i}`],
          limit: this.formInfo[`limit_sell_in_${i}`],
          fakeLimit: this.formInfo[`limit_sell_out_${i}`],
          fakeSales: this.formInfo[`has_sell_out_${i}`]
        }
        this.setSellTimeForm.push(obj)
      }

      Object.assign(sendFrom, {
        ...this.attendClassObj,
        ...this.sellCycleObj,
        robinNum: this.robinNum,
        sellCycle: this.setSellTimeForm
      })
      return sendFrom
    },
    nextStep() {
      const sendFrom = this.pacakageFormInfo()
      console.log('sendFrom', sendFrom)
      this.$emit('listenStepStatus', sendFrom)
    }
  }
}
</script>
<style lang="scss" scoped>
.step-one-container {
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
      margin-bottom: 10px;
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
