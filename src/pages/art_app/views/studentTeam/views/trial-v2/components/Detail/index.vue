<!--
 * @Descripttion: 班级详情
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-04 17:15:44
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-04 22:41:49
-->
<template>
  <div class="team-layout-main" v-loading="loading">
    <template v-if="teamId">
      <!-- 基本信息 -->
      <header class="team-base-info d-flex align-center">
        <h3>【{{ statusText }}】{{ teamInfo.team_name }}</h3>
        <p>
          辅导老师：{{
            (teamInfo.teacher_info && teamInfo.teacher_info.realname) || '-'
          }}
        </p>
        <p>辅导老师微信：{{ teamInfo.weixinNo || '-' }}</p>
        <p>开课~结课：{{ teamDate }}</p>
        <p>创建：{{ createDate || '-' }}</p>
      </header>

      <!-- Tab -->
      <el-tabs v-model="tab">
        <el-tab-pane label="课前准备" name="0"></el-tab-pane>
        <el-tab-pane
          label="上课情况"
          name="1"
          v-if="status !== '0'"
        ></el-tab-pane>
        <el-tab-pane label="本班订单" name="2"></el-tab-pane>
      </el-tabs>

      <!-- 统计信息 -->
      <team-statistic
        :status="status"
        :tab="tab"
        :team-id="teamId"
        @filter="getFilterParams"
        @teamStatisticFinish="teamStatisticFinish"
      />

      <!-- 班级 学员列表 -->
      <team-user-list
        ref="teamUserList"
        :status="status"
        :tab="tab"
        :team-id="teamId"
        :team-params="filterParams"
        v-if="statisticNext === true && (tab === '0' || tab === '1')"
      />

      <!-- 班级 订单列表 -->
      <team-order-list
        :team-id="teamId"
        :filter-params="filterParams"
        v-if="tab === '2'"
      />
    </template>
    <!-- 没有选择班级时 -->
    <p class="empty" v-else>
      <svg class="iconfont" aria-hidden="true">
        <use xlink:href="#iconwushuju"></use>
      </svg>
      请选择查看班级
    </p>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { formatData } from '@/utils/index'
import TeamStatistic from './TeamStatistic'
import TeamUserList from './TeamUserList/index'
import TeamOrderList from './TeamOrderList/index'
export default {
  components: {
    TeamStatistic,
    TeamUserList,
    TeamOrderList
  },
  props: {
    teamId: String
  },
  data() {
    return {
      status: '0',
      tab: '0',
      loading: false,
      teamInfo: {},
      teamStatistic: {},
      filterParams: {},
      statisticNext: false
    }
  },
  computed: {
    statusText() {
      let text = ''
      switch (this.status) {
        case '0':
          text = '待上课'
          break
        case '1':
          text = '上课中'
          break
        case '2':
          text = '已完课'
          break
        default:
          break
      }
      return text
    },
    createDate() {
      return formatData(this.teamInfo.ctime)
    },
    teamDate() {
      const { managementInfo = {} } = this.teamInfo
      const start = managementInfo && managementInfo.course_day
      const end = managementInfo && managementInfo.end_course_day
      if (start && end) {
        return (
          dayjs.unix(Number(start) / 1000).format('MMDD') +
          '~' +
          dayjs.unix(Number(end) / 1000).format('MMDD')
        )
      }
      return '-'
    }
  },
  created() {
    this.status = this.$route.params.status
  },
  watch: {
    teamId(val) {
      if (!val) return
      if (+this.status === 1) {
        this.tab = '1'
      } else {
        this.tab = '0'
      }
      this.getTeamDetail()
    },
    tab(val) {
      this.getFilterParams(null)
    }
  },
  methods: {
    // 获取班级详情信息
    getTeamDetail() {
      if (!this.teamId) return
      this.loading = true
      const params = {
        id: this.teamId
      }
      this.$http.TeamV2.getTeamDetailById(params)
        .then((res) => {
          // console.log(res)
          if (res?.data?.StudentTeam) {
            this.teamInfo = res.data.StudentTeam
          } else {
            this.teamInfo = {}
          }
          if (this.teamInfo.teacher_wechat_info) {
            this.teamInfo.weixinNo = this.teamInfo.teacher_wechat_info.wechat_no
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 获取统计区的筛选条件
    getFilterParams(res) {
      // console.log(res, 'filterparams')
      this.filterParams = res || {}
      this.$refs.teamUserList.filterParamsChange(this.filterParams)
    },
    // 统计信息渲染完成，开始加载后续
    teamStatisticFinish() {
      this.statisticNext = true
    }
  }
}
</script>

<style lang="scss" scoped>
$color-gray: #606266;
$color-light-gray: #b9b9b9;
.team-layout-main {
  position: relative;
  font-size: 12px;
  h3,
  p {
    margin: 0;
  }

  ::v-deep {
    .el-card__body {
      padding: 0;
    }
  }
}
.team-base-info {
  padding: 10px 0;
  h3 {
    font-size: 14px;
  }
  p {
    margin: 0 10px;
    color: $color-gray;
  }
}
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: $color-gray;
  .iconfont {
    display: block;
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
}
</style>
