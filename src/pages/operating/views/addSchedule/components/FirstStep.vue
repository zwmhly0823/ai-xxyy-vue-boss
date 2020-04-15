<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-15 22:52:25
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
              v-model="sellCycleObj.sellCycleTime"
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
            <el-input v-model="acceptNum" placeholder="请输入内容"></el-input>
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
        <el-row v-for="i in sellCycleObj.diffDay" :key="i" :gutter="10">
          <el-col :span="2"
            ><el-input size="small" placeholder="请输入内容"></el-input
          ></el-col>
          <el-col :span="2" :offset="1"
            ><el-input size="small" placeholder="请输入内容"></el-input
          ></el-col>
          <el-col :span="2" :offset="1"
            ><el-input size="small" placeholder="请输入内容"></el-input
          ></el-col>
          <el-col :span="2" :offset="1"
            ><el-input size="small" placeholder="请输入内容"></el-input
          ></el-col>
        </el-row>
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
      sellCycleObj: {
        startTime: '',
        endTime: '',
        sellCycleTime: '',
        diffDay: ''
      },
      attendClassTime: '',
      acceptNum: '' // 接速设置
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 上课周期
    attendClassTimeChange(val) {
      console.log('attendClassTimeChange', val)
    },
    // 通过售卖日期的变化的天数，动态设置售卖周期
    calcSellTimeByDiffDay() {},
    // 售卖周期
    sellCycleTimeChange(val) {
      if (val) {
        const [startTime = '', endTime = ''] = val
        this.sellCycleObj = {
          ...this.sellCycleObj,
          startTime,
          endTime
        }
        const diffTime = Number(endTime) - Number(startTime)

        this.sellCycleObj.diffDay =
          Math.floor(diffTime / (24 * 3600 * 1000)) + 1
      } else {
        this.sellCycleObj.diffDay = ''
      }
    },
    nextStep() {
      this.$emit('listenStepStatus')
    }
  }
}
</script>
<style lang="scss" scoped>
.step-one-container {
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
