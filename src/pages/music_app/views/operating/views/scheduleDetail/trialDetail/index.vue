<!--
 * @Descripttion: TOSS小熊(新版本体验课详情)
 * @version: 1.0.0
 * @Author: Zhoufei
 * @Date: 2021-04-08 18:16:50
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-20 11:50:05
 -->
<template>
  <div class="">
    <div class="head-info">
      <div class="title">
        <p>
          <span>{{ courseTypeObj201[params.courseType] }}</span>
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
            :isShowSup="true"
            :isShowLevel="false"
            :isShowTrans="true"
            :isShowMarket="true"
            :showChannel="true"
            :isShowTransOver="true"
            channelPlaceHolder="定向渠道"
          ></table-search>
        </div>
        <trial-table :paramsInfo="params" v-if="showChildTable"></trial-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import { Sup_scheduleIndex } from '@/utils/supList'
import TrialTable from '../components/TrialTable'
import TableSearch from '../../../components/tableSearch/index'
import { courseTypeObj201 } from '../../../courseType'
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
      courseTypeObj201,
      scheduleStatistic: {},
      trial_28_category: '',
      params: {
        departmentIds: '',
        teacherId: '',
        level: '',
        courseDifficulties: '',
        category: '',
        conversionStatus: '',
        marketStatus: '',
        overshootStatus: '',
        channel: ''
      },
      showChildTable: false
    }
  },
  components: {
    TrialTable,
    TableSearch
  },
  computed: {},
  async created() {
    // await this.getCategory()

    Object.assign(this.params, {
      period: this.period,
      courseType: Sup_scheduleIndex[this.courseType]
    })

    this.showChildTable = true

    this.getScheduleDetailInfo()
  },
  watch: {},
  methods: {
    // 获取头部基本信息
    async getScheduleDetailInfo() {
      const {
        getScheduleDetailInfo: _reqAPI
      } = this.$http.Operating
      try {
        const { payload = {} } = await _reqAPI(this.params)
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

    // 搜索条件emit
    searchChange(search) {
      const {
        department = [],
        groupSell = '',
        level = [],
        courseDifficulties = [],
        conversionStatus = '',
        marketStatus = '',
        overshootStatus = '',
        channel = []
      } = search
      Object.assign(this.params, {
        departmentIds: department.join(),
        teacherId: groupSell,
        level: level.join(),
        courseDifficulties: courseDifficulties.join(),
        conversionStatus: this.calcStatus(conversionStatus),
        marketStatus: this.calcStatus(marketStatus),
        overshootStatus: this.calcStatus(overshootStatus),
        channel: channel.join()
      })
    },
    async getCategory() {
      const { getCourseListByCourseType } = this.$http.Operating

      const res = await getCourseListByCourseType({ courseType: 4 })
      const { code, payload } = res
      if (code === 0) {
        const first = payload.length ? payload[0] : {}
        this.trial_28_category = first.category || ''
      }
    },

    // 点击修改按钮
    modify() {
      this.$router.push({
        path: `/addSchedule/${this.period}/${this.courseType}`
      })
    },

    // 搜索条件 状态 1 OPEN 0 CLOSE
    calcStatus(status = '') {
      return status === '1' ? 'OPEN' : status === '0' ? 'CLOSE' : ''
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
