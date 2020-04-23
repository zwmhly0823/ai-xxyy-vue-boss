<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-23 17:02:16
 -->
<template>
  <div class="app-main height add-schedule-container">
    <div class="grid-content">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="scroll-container">
          <div class="head-info">
            <div class="title">
              <p>
                <span v-if="params.courseType == '0'">体验课</span>
                <span v-else>系统课</span>
                <span>-</span
                ><span>{{ scheduleStatistic.periodName || '-' }}</span>
              </p>
              <el-button type="primary" size="mini" @click="modify"
                >修改</el-button
              >
            </div>
            <el-row :gutter="20">
              <el-col class="label-name" :span="2">排期id:</el-col>
              <el-col :span="2">{{ scheduleStatistic.period || '-' }}</el-col>
              <el-col class="label-name" :span="2">接速设置:</el-col>
              <el-col :span="2">{{ scheduleStatistic.robinNum || '' }}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col class="label-name" :span="2">开始招生:</el-col>
              <el-col :span="2">{{ scheduleStatistic.startDate }}</el-col>
              <el-col class="label-name" :span="2">结束招生:</el-col>
              <el-col :span="2">{{ scheduleStatistic.endDate }}</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col class="label-name" :span="2">开始上课:</el-col>
              <el-col :span="2">{{ scheduleStatistic.courseDay }}</el-col>
              <el-col class="label-name" :span="2">结束上课:</el-col>
              <el-col :span="2">{{ scheduleStatistic.endCourseDay }}</el-col>
            </el-row>
            <!-- TODO:<div class="description">
              当前结果：社群销售<span>9</span>人，计划招生<span>8992</span>（S1:2020
              S2:2020 S3:3000） 实际招生<span>9000</span>（S1:2020 S2:2020
              S3:3000）
            </div> -->
          </div>
          <el-tabs type="border-card">
            <el-tab-pane label="招生详情-销售">
              <schedule-market></schedule-market>
            </el-tab-pane>
            <!-- <el-tab-pane label="招生详情-部门" disabled
              >招生详情-部门</el-tab-pane
            >
            <el-tab-pane label="招生详情-班级" disabled
              >招生详情-班级</el-tab-pane
            >
            <el-tab-pane label="招生详情-级别" disabled
              >招生详情-级别</el-tab-pane
            >
            <el-tab-pane label="售卖周期设置" disabled
              >售卖周期设置</el-tab-pane
            > -->
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import ScheduleMarket from './components/ScheduleMarket'
export default {
  data() {
    return {
      scheduleStatistic: {},
      params: {}
    }
  },
  components: {
    ScheduleMarket
  },
  computed: {},
  async created() {
    const { period = '', courseType = '0' } = this.$route.params
    Object.assign(this.params, { period, courseType })

    const { payload = {} } = await this.getScheduleDetailInfo(this.params) // formatData
    const {
      startDate = '',
      endDate = '',
      courseDay = '',
      endCourseDay = ''
    } = payload
    Object.assign(payload, {
      startDate: startDate ? formatData(startDate) : '-',
      endDate: endDate ? formatData(endDate) : '-',
      courseDay: courseDay ? formatData(courseDay) : '-',
      endCourseDay: endCourseDay ? formatData(endCourseDay) : '-'
    })
    this.scheduleStatistic = payload
    console.log(this.scheduleStatistic)
  },
  methods: {
    async getScheduleDetailInfo() {
      try {
        const info = this.$http.Operating.getScheduleDetailInfo(this.params)
        return info
      } catch (err) {
        console.log(err)
      }
    },
    modify() {
      const { period = 0, courseType = '0' } = this.params

      this.$router.push({ path: `/addSchedule/${period}/${courseType}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}
.add-schedule-container {
  min-width: 1200px;
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
  .scroll-container {
    padding: 0 20px 20px 20px;
    .head-info {
      margin-bottom: 20px;
      .title {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        > p {
          margin-right: 15px;
        }
      }
      .label-name {
        color: #000;
        font-weight: 500;
      }
    }
  }
}
</style>
