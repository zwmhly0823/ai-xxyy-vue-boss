<!--
 * @Descripttion: sidebar班级列表
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-03 15:34:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-16 17:31:51
-->
<template>
  <div class="side-team-list-class">
    <!-- 待上课 班级信息 -->
    <template v-if="status === '0'">
      <sidebar-team-item
        v-for="(team, index) in teamList"
        :team="team"
        :key="index"
        :current-team-id="currentTeamId"
        @current="getSelectTeam"
      >
        <!-- body 自定义-->
        <div slot="body">
          <div class="team-item-body-data count-3">
            <p>人数</p>
            <h6>{{ team.enrolled || 0 }}/{{ team.pre_enroll || 0 }}</h6>
          </div>
          <div class="team-item-body-data count-3">
            <p>好友</p>
            <h6>{{ team.added_wechat_rate || 0 }}%</h6>
          </div>
          <div class="team-item-body-data count-3">
            <p>公众号</p>
            <h6>{{ team.follow_rate || 0 }}%</h6>
          </div>
          <div class="team-item-body-data count-3">
            <p>APP</p>
            <h6>{{ team.open_app_rate || 0 }}%</h6>
          </div>
          <div class="team-item-body-data count-3">
            <p>盒子发货</p>
            <h6>{{ team.delivered_start_rate || 0 }}%</h6>
          </div>
          <div class="team-item-body-data count-3">
            <p>盒子签收</p>
            <h6>{{ team.delivered_sign_rate || 0 }}%</h6>
          </div>
        </div>
      </sidebar-team-item>
    </template>

    <!-- 上课中 班级信息 -->
    <template v-if="status === '1'">
      <sidebar-team-item
        v-for="(team, index) in teamList"
        :team="team"
        :key="index"
        :current-team-id="currentTeamId"
        @current="getSelectTeam"
      >
        <!-- body 自定义-->
        <div slot="body">
          <div class="team-item-body-data" style="min-width: 23%">
            <p>人数</p>
            <h6>{{ team.enrolled || 0 }}/{{ team.pre_enroll || 0 }}</h6>
          </div>
          <div class="team-item-body-data" style="min-width: 23%">
            <p>今完课</p>
            <h6>{{ team.today_complete_course_rate || 0 }}%</h6>
          </div>
          <div class="team-item-body-data" style="min-width: 23%">
            <p>今参课</p>
            <h6>{{ team.today_join_course_rate || 0 }}%</h6>
          </div>
          <div class="team-item-body-data" style="min-width: 23%">
            <p>今登录APP</p>
            <h6>{{ team.today_open_app_rate || 0 }}%</h6>
          </div>
        </div>
        <!-- <div class="team-footer" slot="footer">
          个人排名：XX组7部10/区13/全国30
        </div> -->
      </sidebar-team-item>
    </template>

    <!-- 已完课 班级信息 -->
    <template v-if="status === '2'">
      <sidebar-team-item
        v-for="(team, index) in teamList"
        :team="team"
        :key="index"
        :current-team-id="currentTeamId"
        @current="getSelectTeam"
      >
        <!-- body 自定义-->
        <div slot="body">
          <div class="team-item-body-data d-flex">
            <p style="margin-right: 5px;">人数</p>
            <h6>{{ team.enrolled || 0 }}/{{ team.pre_enroll || 0 }}</h6>
          </div>
        </div>
      </sidebar-team-item>
    </template>
    <p class="infinite-status" v-if="loading">加载中...</p>
    <p
      class="infinite-status"
      :class="{ empty: totalElements === 0 }"
      v-if="noMore && !loading && totalElements > 3"
    >
      没有更多了
    </p>
    <p class="infinite-status empty" v-if="!loading && totalElements === 0">
      暂无数据
    </p>

    <!-- button -->
    <div
      class="toggle-btn"
      @click="handleToggle"
      :class="[
        { 'toggle-btn-left': isSidebarOpen, 'toggle-btn-right': !isSidebarOpen }
      ]"
    >
      <!-- open -->
      <i class="el-icon-arrow-left" v-if="isSidebarOpen"></i>
      <!-- close -->
      <i class="el-icon-arrow-right" v-else></i>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import SidebarTeamItem from './SidebarTeamItem'
export default {
  components: {
    SidebarTeamItem
  },
  props: {
    // 班级状态  0-待上课，1-上课中，2-已完课
    status: {
      type: String,
      default: '0'
    },
    // 搜索条件
    searchParams: {
      type: Object,
      default: () => {}
    },
    // 排序
    sortParams: {
      type: Object,
      default: () => ({ ctime: 'desc' })
    }
  },
  data() {
    return {
      // 当前页
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 总数量
      totalElements: 0,
      loading: false,
      // 班级列表
      teamList: [],
      // 选中的班级ID，列表只有一个班级里，默认选中，多个时不默认选中（需要手动选择）
      currentTeamId: '',
      isSidebarOpen: true
    }
  },
  computed: {
    noMore() {
      return this.currentPage > this.totalPages
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    sortParams(val, old) {
      if (_.isEqual(val, old) || !old) return
      this.currentPage = 1
      this.teamList = []
      this.currentTeamId = ''
      this.getTeamData()
    },
    searchParams: {
      handler(val, old) {
        // console.log(val, old)
        if (!old) return
        this.currentPage = 1
        this.teamList = []
        this.currentTeamId = ''
        this.getTeamData()
      },
      deep: true,
      immediate: true
    },
    // 选中的班级ID
    currentTeamId(val, old) {
      // console.log(val, old, 'currentTeamId')
      this.$emit('select', val)
    }
  },
  created() {
    console.log(1111)
    this.getTeamData()
  },
  methods: {
    getTeamData() {
      this.loading = true
      const query = Object.assign({}, this.searchParams, {
        team_state: this.status
      })
      // 测试提的bug说要加二级排序
      if (
        Object.keys(this.sortParams)[0] === 'enrolled' ||
        Object.keys(this.sortParams)[0] === 'order_conversion_rate'
      ) {
        Object.assign(this.sortParams, {
          ctime: 'desc'
        })
      }
      const params = {
        page: this.currentPage,
        size: 10,
        query,
        sort: this.sortParams
      }
      console.log(params)
      this.$http.TeamV2.getTrialTeamList(params)
        .then((res) => {
          // console.log(res)
          if (res?.data?.StudentTrialTeamStatisticsPage) {
            const {
              totalPages = 1,
              totalElements = 0,
              number = 1,
              content = []
            } = res.data.StudentTrialTeamStatisticsPage
            this.totalPages = +totalPages
            this.totalElements = +totalElements
            this.teamList.push(...content)
            this.currentPage = +number + 1

            if (+number < +totalPages) {
              if (+number === 1) {
                // 开启懒加载
                this.$emit('openLazyload')
              } else {
                // 单次加载成功后再开启下一次懒加载,否则在loading过程中，懒加载判断的div依旧在视图中
                this.$emit('oneLazyFinish')
              }
            }

            if (this.currentTeamId) return
            // 是否默认选中-一个
            if (this.teamList.length === 1) {
              this.currentTeamId = this.teamList[0].id
            } else {
              this.currentTeamId = ''
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 获取选中的班级信息ID
    getSelectTeam(team) {
      this.currentTeamId = team
    },

    handleToggle() {
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggle', this.isSidebarOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
.side-team-list-class {
  position: relative;
  z-index: 1000;
  p {
    &.infinite-status {
      text-align: center;
      font-size: 12px;
      color: #b9b9b9;
    }
    &.empty {
      margin-top: 100px;
    }
  }

  .toggle-btn {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #999;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background-color: rgb(96, 98, 102);
    }
  }
  .toggle-btn-left {
    left: 425px;
  }
  .toggle-btn-right {
    left: 175px;
    i {
      margin-left: -1px;
    }
  }
}
</style>
