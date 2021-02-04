<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container" v-loading="loading">
      <!-- header 班级信息 -->
      <team-info :team="teamInfo" />
      <el-tabs
        class="user-page"
        v-model="activeTab"
        @tab-click="handleChangeTab"
      >
        <el-tab-pane label="体验学员" name="user"></el-tab-pane>
        <el-tab-pane label="课前准备" name="prepare"></el-tab-pane>
        <el-tab-pane label="上课记录" name="log"></el-tab-pane>
        <el-tab-pane label="订单记录" name="order"></el-tab-pane>
      </el-tabs>

      <div class="team-container" v-if="!loading">
        <!-- tabs -->
        <user-page :team-info="teamInfo" v-if="activeTab === 'user'" />
        <prepare-page
          :team-info="teamInfo"
          v-if="activeTab === 'prepare'"
          :update-count="updateCount"
        />
        <log-page-index
          :team-info="teamInfo"
          v-show="activeTab === 'log'"
        ></log-page-index>
        <order-page :team-info="teamInfo" v-if="activeTab === 'order'" />
      </div>
    </div>
  </el-row>
</template>

<script>
import { deepClone } from '@/utils'
import TeamInfo from './components/TeamInfo'
import UserPage from './pages/UserPage'
import PreparePage from './pages/PreparePage'
import OrderPage from './pages/OrderPage'
import LogPageIndex from './pages/LogPageIndex'

export default {
  components: {
    TeamInfo,
    UserPage,
    PreparePage,
    OrderPage,
    LogPageIndex
  },
  data() {
    return {
      // 当前定位显示的Tab
      activeTab: 'user',
      teamId: '',
      teamInfo: {},
      loading: true
    }
  },
  created() {
    // ?tab=log
    const { tab = 'user' } = this.$route.query
    const { id, status } = this.$route.params
    if (tab !== 'user') {
      this.activeTab = tab || 'user'
    }
    switch (status) {
      case '0':
        this.activeTab = 'prepare'
        break
      case '1':
        this.activeTab = 'log'
        break
      case '2':
        this.activeTab = 'user'
        break
    }
    this.teamId = id
    this.getTeamInfo()
  },
  methods: {
    handleChangeTab(tab) {
      // console.log(tab)
    },
    // 获取班级信息
    getTeamInfo() {
      if (!this.teamId) return
      this.$http.TeamV3.getStudentTrialTeamStatisticsById({
        id: this.teamId
      })
        .then((res) => {
          // console.log(res, 'team detail')
          this.teamInfo = res?.data?.StudentTrialTeamStatistics || {}
          // console.log(this.teamInfo)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 更新统计数据 @key:要更新的项  @type: 1-加微，0-取消加微
    updateCount(key, type) {
      const team = deepClone(this.teamInfo)
      // 待加微信统计
      let { unadd_group: unaddGroup, unadd_wechat: unaddWechat } = team
      if (key === 'group') {
        type === 0 ? (unaddGroup += 1) : (unaddGroup -= 1 || 0)
      }
      if (key === 'wechat') {
        type === 0 ? (unaddWechat += 1) : (unaddWechat -= 1 || 0)
      }
      Object.assign(this.teamInfo, {
        unadd_group: unaddGroup,
        unadd_wechat: unaddWechat
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$dangerColor: #f56c6c;
$mainColor: #2a75ed;
$grayColor: #f0f1f2;

.danger {
  color: $dangerColor;
}
::v-deep {
  .user-page.el-tabs {
    position: absolute;
    top: 38px;
    background: #fff;
    z-index: 8;
    right: 20px;
    left: 20px;
  }
}
.team-container {
  padding: 80px 10px 30px;
}
</style>
