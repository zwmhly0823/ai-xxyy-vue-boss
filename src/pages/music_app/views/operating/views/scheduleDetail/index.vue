<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-24 15:49:08
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
                <span>-</span>
                <span>{{ scheduleStatistic.periodName || '-' }}</span>
              </p>
              <el-button type="primary" size="mini" @click="modify">修改</el-button>
            </div>
            <el-row :gutter="20">
              <el-col class="label-name" :span="2">排期id:</el-col>
              <el-col :span="2">{{ scheduleStatistic.period || '-' }}</el-col>
              <!-- <el-col class="label-name" :span="2">接速设置:</el-col>
              <el-col :span="2">{{ scheduleStatistic.robinNum || '' }}</el-col>-->
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
              <div class="search-container">
                <table-search
                  @change="searchChange"
                  :isShowLevel="courseType == '0'"
                  :isShowSup="true"
                ></table-search>
              </div>
              <schedule-market :paramsInfo="params"></schedule-market>
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
            >-->
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import ScheduleMarket from './components/ScheduleMarket'
import TableSearch from '../../components/tableSearch/index'
export default {
  data() {
    return {
      scheduleStatistic: {},
      courseType: '0',
      params: {
        departmentIds: '',
        teacherId: '',
        level: '',
        courseDifficulties: ''
      }
    }
  },
  components: {
    ScheduleMarket,
    TableSearch
  },
  computed: {},
  async created() {
    const { period = '', courseType = '0' } = this.$route.params
    this.courseType = courseType
    Object.assign(this.params, { period, courseType })

    this.init()
  },
  watch: {},
  methods: {
    // 初始化数据
    init() {
      this.getScheduleDetailInfo()
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
    searchChange(search) {
      const {
        department = [],
        groupSell = '',
        level = [],
        courseDifficulties = []
      } = search
      Object.assign(this.params, {
        departmentIds: department.join(),
        teacherId: groupSell,
        level: level.join(),
        courseDifficulties: courseDifficulties.join()
      })
    },
    // 点击修改按钮
    modify() {
      const { period = 0, courseType = '0' } = this.params

      var staff = JSON.parse(localStorage.getItem('staff'))
      staff.stepStatus = 1
      localStorage.setItem('staff', JSON.stringify(staff))

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
        padding: 10px 0;
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
