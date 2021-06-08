<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2021-03-11 12:52:04
 -->
<template>
  <div class="">
    <div class="head-info">
      <div class="title">
        <p>
          <span>{{ courseTypeObj[params.courseType] }}</span>
          <span>-</span><span>{{ scheduleStatistic.periodName || '-' }}</span>
        </p>
        <el-button type="primary" size="mini" @click="modify">修改</el-button>
      </div>
      <el-row :gutter="20">
        <el-col class="label-name" :span="2">排期ID:</el-col>
        <el-col :span="2">{{ scheduleStatistic.period || '-' }}</el-col>
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
            :showCamp="true"
            :teacherPlaceHolder="'教辅'"
          ></table-search>
        </div>
        <camp-table :paramsInfo="params"></camp-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import CampTable from '../components/CampTable'
import TableSearch from '../../../components/tableSearch/index'
import { courseTypeObj } from '../../../courseType'
export default {
  props: {
    courseType: {
      type: String,
      default: '0'
    },
    period: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      courseTypeObj,
      scheduleStatistic: {},
      params: {
        departmentIds: '',
        teacherId: '',
        campCodes: ''
      }
    }
  },
  components: {
    CampTable,
    TableSearch
  },
  computed: {},
  async created() {
    Object.assign(this.params, {
      period: this.period,
      courseType: this.courseType
    })

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
      }
    },
    searchChange(search) {
      const { department = [], groupSell = '', campCodes = '' } = search
      Object.assign(this.params, {
        departmentIds: department.join(),
        teacherId: groupSell,
        campCodes
      })
    },
    // 点击修改按钮
    modify() {
      this.$router.push({
        path: `/addSchedule/${this.period}/${this.courseType}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-row {
  margin-bottom: 10px;
}
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
</style>
