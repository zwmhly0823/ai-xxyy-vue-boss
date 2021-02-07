<template>
  <div class="log-page-log" v-loading="statisticsLoading || tableLoading">
    <div class="statistics-box" v-if="!this.isSpecial9dot9">
      <statistics
        :list="statisticsList"
        @result="filterStatisticData"
        @result-group="filterStatisticDataGroup"
      />
    </div>
    <div class="search-box">
      <log-page-search ref="search" @search="filterSearch"></log-page-search>
    </div>
    <div class="button-box">
      <class-details-buttons
        class="class-details-buttons"
        :team-id="teamId"
        :limit="limitQuery"
      ></class-details-buttons>
    </div>
    <div class="table-box">
      <basics-table
        ref="table"
        :table="tableSet"
        :events="events"
        :list="userList"
        :get-list="getUserList"
        :columns="columns"
        :list-query="listQuery"
        :action-function="actionFunction"
      >
        <!-- 参课 slot -->
        <template slot-scope="scope" slot="joinCourse">
          <div
            class="user-info-dialog"
            @click="showHoverUser(scope.row, 'course')"
          >
            <div>
              参课
              <span class="danger">
                {{ scope.row.join_course_count || 0 }}
              </span>
              节
            </div>
            <div>最近：{{ formatTime(scope.row.last_join_time) || '-' }}</div>
          </div>
        </template>
        <!-- 完课 slot -->
        <template slot-scope="scope" slot="completeCourse">
          <div
            class="user-info-dialog"
            @click="showHoverUser(scope.row, 'course')"
          >
            <div>
              完课
              <span class="danger">
                {{ scope.row.complete_course_count || 0 }}
              </span>
              节
            </div>
            <div>
              最近：{{ formatTime(scope.row.last_complete_time) || '-' }}
            </div>
          </div>
        </template>
        <!-- 传作品 slot -->
        <template slot-scope="scope" slot="task">
          <div
            class="user-info-dialog"
            @click="showHoverUser(scope.row, 'course')"
          >
            <div>
              作品
              <span class="danger">
                {{ scope.row.task_count || 0 }}
              </span>
              张
            </div>
            <div>最近：{{ formatTime(scope.row.last_task_time) || '-' }}</div>
          </div>
        </template>
        <!-- 作品点评 slot -->
        <template slot-scope="scope" slot="comment">
          <div
            class="user-info-dialog"
            @click="showHoverUser(scope.row, 'course')"
          >
            <div>
              已点评
              <span class="danger">
                {{ scope.row.comment_count || 0 }}
              </span>
            </div>
            <div>
              听点评
              <span class="danger">
                {{ scope.row.listen_comment_count || 0 }}
              </span>
            </div>
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
    </div>
    <!-- 用户详情 dialog -->
    <user-info-dialog
      :user="currentHoverUser"
      :tab="currentHoverTab"
      :limit="limitQuery"
      @close="handleCloseUserInfoDialog"
      ref="userInfoDialog"
    />
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
  </div>
</template>

<script>
import { formatData, openBrowserTab } from '@/utils'
import Statistics from '../components/Statistics'
import LogPageSearch from '../components/Search/LogPageSearch'
import BasicsTable from '@/components/BasicsTable'
import columns, { actions } from '../columns/logPage'
import UserFollow from '../components/UserFollow.vue'
import UserTags from '../components/UserTags.vue'
import ClassDetailsButtons from '@/pages/music_app/views/studentTeam/components/TabPane/components/classDetailsButtons.vue'
import UserInfoDialog from '@/pages/music_app/views/users/components/trial/UserInfoDialog.vue'
import IntentionDialog from '@/pages/music_app/views/users/components/intentionDialog'
import TagDetail from '@/pages/music_app/views/users/components/trial/tags/tagDetail.vue'
export default {
  name: 'LogPageLog',
  components: {
    Statistics,
    LogPageSearch,
    BasicsTable,
    UserFollow,
    UserTags,
    ClassDetailsButtons,
    UserInfoDialog,
    IntentionDialog,
    TagDetail
  },
  props: {
    teamInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      teamId: '',
      teacherIds: [],
      statisticsLoading: false,
      statisticsList: [],
      tableSet: { stripe: false, border: false },
      events: {
        'selection-change': this.handleSelectionChange
      },
      tableLoading: false,
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
        handleUserDetail: this.handleUserDetail
      }),
      statisticsParams: {},
      searchParams: {},
      sortParams: {},
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
      tagPopoverData: null,
      currentHoverUser: null,
      currentHoverTab: '',
      curModifyItem: {},
      tagDataMap: new Map(), // 标签的浮窗和弹窗的数据都从这个map里面取，避免重复请求
      selectUsers: [],
      selectUserIds: [], // 批量选择的用户ID
      timer: null,
      isSpecial9dot9: false,
      limitQuery: {}
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
    this.teamId = this.$route.params.id
    this.initLimit()
    // 统计
    this.initStatisticsData()
    // 列表
    this.getUserList()
  },
  mounted() {
    this.$nextTick(() => {
      // 监听排序方法 TODO:
      this.$root.$on('handle-log-sort', (res) => {
        // console.log(res, 'slort')
        this.sortParams = res || {}
        this.listQuery.currentPage = 1
        this.getUserList()
      })
    })
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  methods: {
    initLimit() {
      // 判断是不是9.9特价课
      if (this.teamInfo.category === 11) {
        this.isSpecial9dot9 = true
        this.limitQuery.isSpecial9dot9 = this.isSpecial9dot9
      }

      if (this.isSpecial9dot9) {
        // 隐藏不需要的表头
        let len = this.columns.length - 1
        const hideTableArr = ['跟进', '标签']
        for (let i = 0; len >= i; len--) {
          if (hideTableArr.includes(this.columns[len].label)) {
            this.columns.splice(len, 1)
          }
        }
        // 隐藏不需要的操作列按钮
        let len2 = this.actionFunction.action.length - 1
        const hideActionArr = ['跟进', '打标签']
        for (let i = 0; len2 >= i; len2--) {
          if (hideActionArr.includes(this.actionFunction.action[len2].label)) {
            this.actionFunction.action.splice(len2, 1)
          }
        }
      }
    },
    async initStatisticsData() {
      this.statisticsLoading = true
      const res = await this.getStatisticsData()
      if (!res) {
        return
      }
      // 完课人数列表
      const completeList = []
      JSON.parse(res.complete_course_count_group).forEach((item) => {
        completeList.push({
          name: `完${item.code}节`,
          filter: { complete_course_count: item.code },
          value: item.value,
          active: false
        })
      })
      const today0clock = new Date(new Date().toLocaleDateString()).getTime()
      const today24clock = today0clock + 24 * 60 * 60 * 1000 - 1
      // const yesterday0clock = today0clock - 24 * 60 * 60 * 1000
      // const yesterday24clock = today0clock - 1
      for (let i = 0, len = 12; i < len; i++) {
        if (!completeList[i] || completeList[i].name !== `完${i}节`) {
          completeList.splice(i, 0, {
            name: `完${i}节`,
            filter: { complete_course_count: i },
            value: 0,
            active: false
          })
        }
      }
      this.statisticsLoading = false
      this.statisticsList = [
        {
          label: '全部学员',
          count: this.teamInfo.student_count || 0,
          unit: '人'
        },
        // {
        //   label: '今日参课',
        //   count: res.today_join_course_uids?.length || 0,
        //   total: this.teamInfo.student_count || 0,
        //   filter: res.today_join_course_uids
        // },
        // {
        //   label: '今日完课',
        //   count: res.today_complete_course_uids?.length || 0,
        //   total: this.teamInfo.student_count || 0,
        //   filter: res.today_complete_course_uids
        // },
        {
          label: '累计完课',
          type: 'group',
          list: completeList
        },
        {
          label: '今日课情人数',
          type: 'group',
          list: [
            {
              name: '参课',
              value: res.today_join_course_count,
              filter: {
                last_join_time: { gte: today0clock, lte: today24clock }
              },
              active: false
            },
            {
              name: '完课',
              value: res.today_complete_course_count,
              filter: {
                last_complete_time: { gte: today0clock, lte: today24clock }
              },
              active: false
            },
            {
              name: '传作品',
              value: res.today_course_task_uids.length,
              filter: {
                last_task_time: { gte: today0clock, lte: today24clock }
              },
              active: false
            },
            {
              name: '点评',
              value: res.today_task_comment_uids.length,
              filter: {
                last_comment_time: { gte: today0clock, lte: today24clock }
              },
              active: false
            },
            {
              name: '听点评',
              value: res.today_listen_comment_uids.length,
              filter: {
                id: res.today_listen_comment_uids
              },
              active: false
            }
          ]
        },
        {
          label: '昨日课情人数',
          type: 'group',
          list: [
            {
              name: '参课',
              value: res.yesterday_join_course_uids.length,
              filter: {
                id: res.yesterday_join_course_uids
              },
              active: false
            },
            {
              name: '完课',
              value: res.yesterday_complete_course_uids.length,
              filter: {
                id: res.yesterday_complete_course_uids
              },
              active: false
            },
            {
              name: '传作品',
              value: res.yesterday_course_task_uids.length,
              filter: {
                id: res.yesterday_course_task_uids
              },
              active: false
            },
            {
              name: '点评',
              value: res.yesterday_task_comment_uids.length,
              filter: {
                id: res.yesterday_task_comment_uids
              },
              active: false
            },
            {
              name: '听点评',
              value: res.yesterday_listen_comment_uids.length,
              filter: {
                id: res.yesterday_listen_comment_uids
              },
              active: false
            }
          ]
        }
      ]
    },
    getStatisticsData() {
      // console.log(this.teamInfo)
      const params = {
        id: this.teamInfo.id
      }
      // '0'->课前准备 '1'->上课情况 '2'->本班订单
      return this.$http.TeamV2.getTrialTeamStatisticsExtra(params, '1')
        .then((res) => {
          if (res?.data?.StudentTrialTeamStatisticsExtra) {
            return res.data.StudentTrialTeamStatisticsExtra
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    filterStatisticData(index, name) {
      // console.log(index)
      const query = {}
      switch (index) {
        case 1:
          Object.assign(query, { id: this.statisticsList[1].filter })
          break
        case 2:
          Object.assign(query, { id: this.statisticsList[2].filter })
          break
      }
      this.statisticsParams = query
      this.listQuery.currentPage = 1
      // console.log(query)
      this.getUserList()
    },
    filterStatisticDataGroup(filter, active) {
      this.$refs.search.nowDate = Date.now()
      this.searchParams = {}
      const query = {}
      if (active) {
        Object.assign(query, filter)
      }
      this.statisticsParams = query
      this.listQuery.currentPage = 1
      // console.log(query)
      this.getUserList()
    },
    filterSearch(searchParams) {
      // console.log(searchParams, 'search')
      this.searchParams = searchParams
      this.listQuery.currentPage = 1
      this.getUserList()
    },
    getUserList(
      page = this.listQuery.currentPage,
      size = this.listQuery.pageSize
    ) {
      Object.assign(this.listQuery, {
        currentPage: page,
        pageSize: size
      })

      this.tableLoading = true
      const params = {}
      const { statisticsParams, searchParams = {}, sortParams = {} } = this
      Object.assign(
        params,
        { team_id: this.teamId },
        statisticsParams,
        searchParams
      )
      this.$http.TeamV3.getTialTeamUserList(
        params,
        {
          page,
          size
        },
        sortParams
      )
        .then((res) => {
          // console.log(res, 'res.....')
          const { content = [], totalElements = 0, totalPages = 0 } =
            res?.data?.StudentTrialV2StatisticsPage || {}
          this.userList = this.formatUserData(content)
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages
          })
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

    // 打标签
    handleTag(uid, data, index) {
      this.editSysTag(index, uid)
    },
    // 跟进
    handleFollow(uid, data, index) {
      const type = data.userIntention ? 'update' : 'create'
      this.handleIntention(index, uid, type)
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
    // 多选
    handleSelectionChange(data) {
      console.log(data, 'selection')
      const ids = data.map((item) => {
        const { id } = item
        return id
      })
      this.selectUsers = data
      this.selectUserIds = ids
    },
    // 取消多选
    handleSelectionClear() {
      console.log('clear....')

      this.$refs.tableSet.getRef().clearSelection()
      this.selectUserIds = []
      this.selectUsers = []
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
      this.getUserList()
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
    }
  }
}
</script>

<style lang="scss" scoped>
$dangerColor: #f56c6c;

.danger {
  color: $dangerColor;
}
.log-page-log {
  margin-top: 2px;
  .statistics-box {
    min-height: 45px;
  }
  .button-box {
    padding-bottom: 10px;
    border-bottom: 1px solid #dfe6ee;
  }
  .user-info-dialog {
    cursor: pointer;
    &:hover {
      background-color: rgba(42, 117, 237, 0.25);
    }
  }
}
/deep/ {
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
