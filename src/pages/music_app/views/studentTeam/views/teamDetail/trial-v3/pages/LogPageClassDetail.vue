<template>
  <div class="log-page-class-detail">
    <!-- 课程信息 -->
    <lesson-info class="lesson-info" :lesson="lessonData" v-if="lessonData" />
    <div
      class="log-page-class-detail-content"
      v-loading="statisticloading || tableLoading"
      element-loading-background="rgba(256, 256, 256, 1)"
    >
      <!-- 统计信息 -->
      <statistics
        class="statistics-box"
        :list="statisticsList"
        @result="statisticDataResult"
      />
      <!-- 搜索 -->
      <log-class-detail-page-search @search="searchResult" />

      <!-- 学员列表 -->
      <basics-table
        ref="table"
        :table="tableProperty"
        :loading="tableLoading"
        :list="userList"
        :get-list="initUserList"
        :columns="columns"
        :list-query="listQuery"
        :action-function="actionFunction"
      >
        <!-- 参课 slot -->
        <template slot-scope="scope" slot="joinCourse">
          <!-- class="user-info-dialog"
            @click="showHoverUser(scope.row, 'course')" -->
          <template v-if="scope.row.join_course_count > 0">
            已参课<br />最近：{{ formatTime(scope.row.last_join_course_time) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
        <!-- 当日参课 slot -->
        <template slot-scope="scope" slot="todayJoinCourse">
          <template v-if="scope.row.first_join_course_time">
            <template v-if="+scope.row.bu_join_state === 0">
              <span class="danger">是</span>
            </template>
            <template v-else-if="+scope.row.bu_join_state === 1">
              否<br />首次：{{ formatTime(scope.row.first_join_course_time) }}
            </template>
          </template>
          <template v-else>
            -
          </template>
        </template>
        <!-- 完课 slot -->
        <template slot-scope="scope" slot="completeCourse">
          <div>
            <template v-if="scope.row.complete_course_count > 0">
              已完课<br />
              最近：{{ formatTime(scope.row.last_complete_course_time) }}
            </template>
            <template v-else>
              -
            </template>
          </div>
        </template>
        <!-- 当日完课 slot -->
        <template slot-scope="scope" slot="todayCompleteCourse">
          <template v-if="scope.row.first_complete_course_time">
            <template v-if="+scope.row.bu_complete_state === 0">
              <span class="danger">是</span>
            </template>
            <template v-else-if="+scope.row.bu_complete_state === 1">
              否<br />
              首次：{{ formatTime(scope.row.first_complete_course_time) }}
            </template>
          </template>
          <template v-else>
            -
          </template>
        </template>
        <!-- 传作品 slot -->
        <template slot-scope="scope" slot="taskCount">
          <div>
            <template v-if="scope.row.task_count > 0">
              {{ scope.row.task_count }}张
            </template>
            <template v-else>
              -
            </template>
          </div>
        </template>
        <!-- 已点评作品 slot -->
        <template slot-scope="scope" slot="commentCount">
          <div>
            <template v-if="scope.row.comment_count > 0">
              {{ scope.row.comment_count }}张
            </template>
            <template v-else>
              -
            </template>
          </div>
        </template>
        <!-- 已听点评 slot -->
        <template slot-scope="scope" slot="listenCommentCount">
          <div>
            <template v-if="scope.row.listen_comment_count > 0">
              {{ scope.row.listen_comment_count }}
            </template>
            <template v-else>
              -
            </template>
          </div>
        </template>
        <!-- 跟进 slot -->
        <template slot-scope="scope" slot="follow">
          <user-follow
            :row="scope.row"
            :index="scope.$index"
            @handle-intention="handleIntention"
          />
        </template>

        <!-- 标签 -->
        <template slot-scope="scope" slot="tags">
          <user-tags
            :row="scope.row"
            :index="scope.$index"
            :tag-popover-data="tagPopoverData"
            @edit-tag="editSysTag"
            @show-tag="tagPopoverShow"
          />
        </template>

        <!-- 转化 slog -->
        <template slot-scope="scope" slot="status">
          <div class="d-flex align-center">
            <span
              :class="[
                {
                  danger: scope.row.user_status_name !== '未转化'
                }
              ]"
            >
              {{ scope.row.user_status_name }}
            </span>
          </div>
        </template>
      </basics-table>
      <!-- 意向度设置 -->
      <intention-dialog
        ref="intentionDialog"
        @intentConfirm="intentConfirm"
      ></intention-dialog>
      <!-- 手动标签 -->
      <tag-detail
        ref="tagDetail"
        @changeTagSucc="changeTagSucc"
        @saveTag="saveTag"
      ></tag-detail>
      <!-- 用户详情 dialog -->
      <user-info-dialog
        :user="currentHoverUser"
        :tab="currentHoverTab"
        @close="handleCloseUserInfoDialog"
        ref="userInfoDialog"
      />
      <!-- 发优惠券 -->
      <coupon-popover ref="couponPopover" :select-user-id="selectUserIds" />
    </div>
  </div>
</template>

<script>
import { formatData, openBrowserTab } from '@/utils'
import LessonInfo from '../components/LessonInfo'
import Statistics from '../components/Statistics'
import LogClassDetailPageSearch from '../components/Search/LogClassDetailPageSearch'
import BasicsTable from '@/components/BasicsTable'
import columns, { actions } from '../columns/logPageClassDetail'
import UserFollow from '../components/UserFollow.vue'
import TagDetail from '@/pages/music_app/views/users/components/trial/tags/tagDetail.vue'
import IntentionDialog from '@/pages/music_app/views/users/components/intentionDialog'
import UserTags from '../components/UserTags.vue'
import UserInfoDialog from '@/pages/music_app/views/users/components/trial/UserInfoDialog.vue'
import CouponPopover from '@/pages/music_app/views/studentTeam/components/TabPane/components/couponPopover'
export default {
  name: 'logPageClassDetail',
  components: {
    LessonInfo,
    Statistics,
    LogClassDetailPageSearch,
    BasicsTable,
    UserFollow,
    TagDetail,
    IntentionDialog,
    UserTags,
    UserInfoDialog,
    CouponPopover
  },
  data() {
    return {
      lessonData: null,
      statisticloading: false,
      tableLoading: false,
      lessonId: '',
      teamId: '',
      teacherIds: [],
      statisticsList: [],
      tableProperty: { stripe: false, border: false },
      userList: [],
      columns,
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500]
      },
      actionFunction: actions({
        handleTag: this.handleTag,
        handleFollow: this.handleFollow,
        handleUserDetail: this.handleUserDetail,
        handleCoupon: this.handleCoupon
      }),
      statisticsParams: {},
      searchParams: {},
      sortParams: {},
      curModifyItem: {},
      tagPopoverData: null,
      tagDataMap: new Map(),
      currentHoverUser: null,
      currentHoverTab: '',
      userIntentionMap: {
        1: '低意向',
        2: '中意向',
        3: '高意向',
        4: '无意向'
      },
      userIntentionClassMap: {
        1: 'main-text',
        2: 'success',
        3: 'danger'
      },
      selectUsers: [],
      selectUserIds: [], // 批量选择的用户ID
      timer: null
    }
  },
  computed: {
    formatTime() {
      return function(time) {
        return formatData(time, 'shortDay')
      }
    }
  },
  created() {
    this.lessonId = this.$route.params.lessonId
    this.teamId = this.$route.params.teamId
    this.initStatisticData()
    this.initUserList()
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     // 监听排序方法 TODO:
  //     this.$root.$on('handle-log-page-class-detail-sort', (res) => {
  //       // console.log(res, 'slort')
  //       this.sortParams = res || {}
  //       this.listQuery.currentPage = 1
  //       this.initUserList()
  //     })
  //   })
  // },
  destroyed() {
    clearTimeout(this.timer)
  },
  methods: {
    async initStatisticData() {
      const res = await this.getStatisticData()
      // console.log(res)
      if (!res) {
        return
      }
      this.lessonData = res
      this.statisticsList = [
        {
          label: '全部学员',
          count: res.enrolled || 0,
          unit: '人'
        },
        {
          label: '参课人数',
          count: res.join_count || 0,
          unit: '人'
          // disabled: true // 是否可点击
        },
        {
          label: '完课人数',
          count: res.complete_count || 0,
          unit: '人'
        },
        {
          label: '传作品人数',
          count: res.task_student_count || 0,
          unit: '人'
        },
        {
          label: '今日参课',
          count: res.new_today_join_count || 0,
          unit: '人'
        },
        {
          label: '今日完课',
          count: res.new_today_complete_count || 0,
          unit: '人'
        },
        {
          label: '待点评人数',
          count: res.no_task_comment_student_count || 0,
          unit: '人'
        }
      ]
    },
    getStatisticData() {
      const params = {
        team_id: this.teamId,
        course_id: this.lessonId
      }
      return this.$http.TeamV3.StudentTeamCourseStatistics(params)
        .then((res) => {
          if (res?.data?.StudentTeamCourseStatistics) {
            return res.data.StudentTeamCourseStatistics
          }
          return false
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          this.statisticloading = false
        })
    },
    async initUserList(
      page = this.listQuery.currentPage,
      size = this.listQuery.pageSize
    ) {
      const res = await this.getUserList(page, size)
      // console.log(res)
      if (!res) {
        return
      }
      this.userList = this.formatUserData(res.content)
      Object.assign(this.listQuery, {
        totalElements: +res.totalElements,
        totalPages: +res.totalPages
      })
    },
    getUserList(page, size) {
      Object.assign(this.listQuery, {
        currentPage: page,
        pageSize: size
      })
      this.tableLoading = true
      const params = {}
      const { statisticsParams, searchParams = {}, sortParams = {} } = this
      Object.assign(
        params,
        { course_id: this.lessonId },
        { team_id: this.teamId },
        statisticsParams,
        searchParams
      )
      return this.$http.TeamV3.StudentTrialLearnListStatisticsPage(
        params,
        {
          page,
          size
        },
        sortParams
      )
        .then((res) => {
          if (res?.data?.StudentTrialLearnListStatisticsPage) {
            return res.data.StudentTrialLearnListStatisticsPage
          }
          return false
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    formatUserData(list = []) {
      const res = list.map((item) => {
        if (item.userIntention?.type) {
          const { type } = item.userIntention
          item.userIntention.typeClass = this.userIntentionClassMap[type] || ''
          item.userIntention.typeText = this.userIntentionMap[type] || ''
        }

        switch (+item.user_status) {
          case 0:
          case 1:
          case 2:
            item.user_status_name = '未转化'
            break
          case 3:
          case 4:
            item.user_status_name = '已购月课'
            break
          case 5:
          case 6:
          case 7:
            item.user_status_name = '已购年课'
            break
          case 8:
            item.user_status_name = '注销失效'
            break
          case 9:
          case 10:
            item.user_status_name = '已购季度课'
            break
          case 11:
          case 12:
            item.user_status_name = '已购半年课'
            break
        }
        return item
      })
      return res
    },
    /**
     * 统计区域 参数
     * @index: 0-全部，1-参课人数，2-完课人数，3-传作品数，4-今日参课，5-今日完课，6-待点评人数
     */
    statisticDataResult(index) {
      // console.log(index)
      const query = {}
      const today0clock = new Date(new Date().toLocaleDateString()).getTime()
      switch (index) {
        case 1:
          Object.assign(query, { join_course_count: { gt: 0 } })
          break
        case 2:
          Object.assign(query, { complete_course_count: { gt: 0 } })
          break
        case 3:
          Object.assign(query, { task_count: { gt: 0 } })
          break
        case 4:
          Object.assign(query, {
            last_join_course_time: { gte: today0clock }
          })
          break
        case 5:
          Object.assign(query, {
            last_complete_course_time: { gte: today0clock }
          })
          break
        case 6:
          Object.assign(query, { comment_status: 1 })
          break
      }
      this.statisticsParams = query
      this.listQuery.currentPage = 1
      // console.log(query)
      this.initUserList()
    },
    searchResult(searchParams) {
      this.searchParams = searchParams
      this.listQuery.currentPage = 1
      this.initUserList()
    },
    // 跟进
    handleFollow(uid, data, index) {
      const type = data.userIntention ? 'update' : 'create'
      this.handleIntention(index, uid, type)
    },
    // 创建或修改意向度&跟进记录
    // @type: 'create'，'update'
    handleIntention(index, uid, type = 'update') {
      // console.log(index, uid, type)

      this.curModifyItem.index = index
      this.curModifyItem.uid = uid
      this.curModifyItem.type = type
      if (type === 'update') {
        this.$refs.intentionDialog.showDialog(
          this.userList[index].userIntention
        )
      }
      if (type === 'create') {
        this.$refs.intentionDialog.showDialog()
      }
    },
    // 意向度dialog过来的数据
    intentConfirm(data) {
      // console.log(data, '意向度dialog过来的数据')
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const IntentionMap1 = new Map()
      IntentionMap1.set('低', 'LOW')
      IntentionMap1.set('中', 'MIDDLE')
      IntentionMap1.set('高', 'HIGH')
      IntentionMap1.set('无', 'NONE')
      const IntentionMap2 = new Map()
      IntentionMap2.set('低', 1)
      IntentionMap2.set('中', 2)
      IntentionMap2.set('高', 3)
      IntentionMap2.set('无', 4)
      const urlMap = new Map()
      // 是新增还是修改
      urlMap.set('create', 'createUserInetention')
      urlMap.set('update', 'updateUserInetention')

      const query = {
        uid: this.curModifyItem.uid,
        type: IntentionMap1.get(data.radio),
        describe: data.textarea,
        ...data.track
      }
      this.$http.User[urlMap.get(this.curModifyItem.type)](query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            const singleData = Object.assign(
              {},
              this.userList[this.curModifyItem.index].userIntention,
              {
                type: IntentionMap2.get(data.radio),
                typeText: `${data.radio}意向`,
                typeClass: this.userIntentionClassMap[
                  IntentionMap2.get(data.radio)
                ],
                describe: data.textarea || '',
                is_track: data.track.isTrack,
                today: data.track.today
              }
            )
            this.$set(
              this.userList[this.curModifyItem.index],
              'userIntention',
              singleData
            )
            // this.userList = this.formatUserData(this.userList)
            this.$message.success('提交成功')
          } else {
            this.$message.error('提交失败')
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
          this.$message.error('更新用户意向度失败')
        })
    },
    // 打标签
    handleTag(uid, data, index) {
      this.editSysTag(index, uid)
    },
    // 标签
    async editSysTag(index, uid) {
      this.$refs.tagDetail.open()
      // Popover和点击出来的弹窗只需要请求一次数据
      if (!this.tagDataMap.get(uid)) {
        const data = await this.getTeacherLabel(uid)
        if (!data) {
          return
        }
        this.tagDataMap.set(uid, data)
      }
      // console.log(this.tagDataMap.get(uid))
      this.$refs.tagDetail.initdata(this.tagDataMap.get(uid), uid)
    },
    async tagPopoverShow(val) {
      // Popover和点击出来的弹窗只需要请求一次数据
      if (this.tagDataMap.get(val.id)) {
        this.tagPopoverData = null
        this.$nextTick(() => {
          this.tagPopoverData = this.tagDataMap.get(val.id)
        })
        return
      }
      const data = await this.getTeacherLabel(val.id)
      if (!data) {
        return
      }
      this.tagDataMap.set(val.id, data)
      // el-popover中的视图不会随着数据变化
      this.tagPopoverData = null
      this.$nextTick(() => {
        this.tagPopoverData = this.tagDataMap.get(val.id)
      })
    },
    getTeacherLabel(uid) {
      const query = {
        userId: uid,
        teacherIds: []
      }
      return this.$http.Setting.getTeacherLabel(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => {
          this.$message.error('获取标签信息错误')
          return false
        })
    },
    async changeTagSucc(type, uid) {
      const data = await this.getTeacherLabel(uid)
      if (!data) {
        return
      }
      if (type === 'createPersonTag') {
        this.$refs.tagDetail.rightPersonSysTag(data)
      } else if (type === 'deleteTagEmit') {
        this.$refs.tagDetail.initdata(data, uid)
      }
      this.initUserList()
      // this.$refs.searchC.$refs.defineLabelV2.initOptionsData(data)
      this.tagDataMap.clear()
    },
    saveTag(userLabel, uid) {
      for (let i = 0, len = this.userList.length; i < len; i++) {
        if (this.userList[i].id === uid) {
          this.userList[i].user_label = userLabel
        }
      }
      this.tagDataMap.delete(uid)
    },
    // 查看用户详情弹框
    showHoverUser(user, tab) {
      this.currentHoverUser = user
      this.currentHoverTab = tab
      this.$refs.userInfoDialog.visible = true
    },
    // 关闭用户详情dialog
    handleCloseUserInfoDialog() {
      this.currentHoverTab = ''
    },
    // 详情
    handleUserDetail(uid) {
      if (!uid) {
        this.$message.error('缺少用户信息')
        return
      }
      // 新标签打开详情页
      openBrowserTab(`/music_app/#/details/${uid}`)
    },
    // 发优惠券
    handleCoupon(uid, data) {
      this.selectUsers = []
      // 单条发
      if (uid && data) {
        this.selectUserIds = [uid]
      }
      // 批量发
      if (!data) {
        if (this.selectUserIds.length === 0) {
          this.$message.warning('请选择学员')
          return
        }
      }
      this.$refs.couponPopover.issueCoupons = true
      this.$refs.couponPopover.couponsTime = ''
    }
  }
}
</script>

<style lang="scss" scoped>
$dangerColor: #f56c6c;

.danger {
  color: $dangerColor;
}
.log-page-class-detail {
  position: relative;
  padding-top: 38px;
  .lesson-info {
    position: fixed;
    width: 100%;
    top: 50px;
    z-index: 10;
  }
  .log-page-class-detail-content {
    min-height: calc(100vh - 88px);
    background-color: #fff;
    .statistics-box {
      min-height: 45px;
    }
    .user-info-dialog {
      cursor: pointer;
      &:hover {
        background-color: rgba(42, 117, 237, 0.25);
      }
    }
  }
}
/deep/ {
  .m-pagination {
    bottom: 0;
    right: 0;
    width: 100vw !important;
    padding: 10px;
  }
  .el-table {
    margin-bottom: 52px;
  }
  .el-table-column--selection .cell {
    padding: 0 0 0 10px;
  }
  p {
    margin: 0;
    line-height: 20px;
  }
  .level {
    flex-flow: wrap;
    justify-content: flex-start;
  }
  .user-follow {
    .flex-1 {
      overflow: hidden;
    }
    i {
      margin-left: 8px;
      cursor: pointer;
    }
  }
}
</style>
