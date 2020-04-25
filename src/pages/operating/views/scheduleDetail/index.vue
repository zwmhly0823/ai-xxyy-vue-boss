<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-25 13:58:27
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
          </div>
          <el-tabs type="border-card">
            <el-tab-pane label="招生详情-销售">
              <div class="description" v-if="resultStatistics">
                当前结果：社群销售<span>{{ resultStatistics.wechatSize }}</span
                >人，计划招生<span>{{ resultStatistics.planSumTeamSize }}</span>
                <span>（</span>
                <span>S1:{{ resultStatistics.PS1 }} </span>
                <span>S2:{{ resultStatistics.PS2 }} </span>
                <span>S3:{{ resultStatistics.PS3 }} </span>
                <span>）</span>

                实际招生<span>{{ resultStatistics.realSumTeamSize }}</span>
                <span>（</span>
                <span>S1:{{ resultStatistics.RS1 }} </span>
                <span>S2:{{ resultStatistics.RS2 }} </span>
                <span>S3:{{ resultStatistics.RS3 }} </span>
                <span>）</span>
              </div>
              <!-- TODO: -->
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
      params: {},
      resultStatistics: {}
    }
  },
  components: {
    ScheduleMarket
  },
  computed: {},
  async created() {
    const { period = '', courseType = '0' } = this.$route.params
    Object.assign(this.params, { period, courseType })

    this.init()
  },
  methods: {
    // 初始化数据
    init() {
      this.getScheduleDetailInfo()
      this.getScheduleDetailStatistic()
    },
    // 获取头部基本信息
    async getScheduleDetailInfo() {
      try {
        const {
          payload = {}
        } = await this.$http.Operating.getScheduleDetailInfo(this.params)
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
      } catch (err) {
        console.log(err)
      }
    },
    async getScheduleDetailStatistic() {
      try {
        const info = await this.$http.Operating.getScheduleDetailStatistic(
          this.params
        )
        const { payload = [] } = info

        const obj = {
          wechatSize: 0, // 带班销售总人数
          planSumTeamSize: 0, // 计划招生总人数
          realSumTeamSize: 0, // 实际招生总人数
          PS1: 0,
          PS2: 0,
          PS3: 0,
          RS1: 0,
          RS2: 0,
          RS3: 0
        }

        payload.forEach((item, index) => {
          obj.wechatSize += +item.wechatSize
          obj.planSumTeamSize += +item.planSumTeamSize
          obj.realSumTeamSize += +item.realSumTeamSize

          if (index === 0) {
            obj.PS1 = item.planSumTeamSize || '0'
            obj.RS1 = item.realSumTeamSize || '0'
          } else if (index === 1) {
            obj.PS2 = item.planSumTeamSize || '0'
            obj.RS2 = item.realSumTeamSize || '0'
          } else if (index === 2) {
            obj.PS3 = item.planSumTeamSize || '0'
            obj.RS3 = item.realSumTeamSize || '0'
          }
        })

        this.resultStatistics = obj
      } catch (err) {
        console.log(err)
      }
    },
    // 点击修改按钮
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
