<template>
  <div class="user-container">
    <!-- 统计信息 -->
    <statistics
      v-if="!isSpecial9dot9"
      :list="statisticsList"
      @result="getStatisticData"
    />

    <!-- 搜索 -->
    <div>
      <user-page-search :limit="limitQuery" ref="search" @search="getSearch" />
    </div>

    <!-- 操作区 -->
    <basics-action :actions="act" />

    <!-- 学员列表 -->
    <basics-table
      ref="table"
      :table="table"
      :events="events"
      :loading="loading"
      :list="userList"
      :get-list="getUserList"
      :columns="columns"
      :list-query="listQuery"
      :action-function="actionFunction"
    >
      <!-- 学习概况 slot -->
      <template slot-scope="scope" slot="survey">
        <div class="user-survey" @click="showHoverUser(scope.row, 'course')">
          <p>
            打开:<span class="danger">{{ scope.row.open_app_count || 0 }}</span>
            参课:<span class="danger">
              {{ scope.row.join_course_count || 0 }}
            </span>
            完课:<span class="danger">
              {{ scope.row.complete_course_count || 0 }}
            </span>
          </p>
          <p>
            作品:<span class="danger">{{ scope.row.task_count || 0 }}</span>
            点评:<span class="danger">{{ scope.row.comment_count || 0 }}</span>
            听点评:<span class="danger">
              {{ scope.row.listen_comment_count || 0 }}
            </span>
          </p>
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

      <!-- 课前准备 slot -->
      <template slot-scope="scope" slot="prepare">
        <div class="prepare">
          <p>
            好友<i class="el-icon-check" v-if="scope.row.added_wechat"></i>
            <i v-else class="el-icon-close"></i>
            入群<i class="el-icon-check" v-if="scope.row.added_group"></i>
            <i v-else class="el-icon-close"></i>
          </p>
          <p>
            <!-- 物流：体验课盒子物流【已完成】为对勾，其余状态“—” -->
            <span v-if="!isSpecial9dot9">
              物流
              <i
                class="el-icon-check"
                v-if="+scope.row.express_status === 3"
              ></i>
              <i v-else class="el-icon-close"></i>
            </span>
            公众号<i class="el-icon-check" v-if="scope.row.follow"></i>
            <i v-else class="el-icon-close"></i>
          </p>
        </div>
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

    <!-- 加好友短信 -->
    <send-friend-message
      ref="sendFriendMessage"
      :result="handleSelectionClear"
      :user-list="selectUsers"
    />
  </div>
</template>

<script>
import { openBrowserTab } from '@/utils'
import { todayTimestamp, tomorrowTimestamp } from '../utils'
import BasicsTable from '@/components/BasicsTable'
import BasicsAction from '@/components/BasicsAction'
import SendFriendMessage from '@/components/SendFriendMessage/index.vue'
import intentionDialog from '@/pages/music_app/views/users/components/intentionDialog'
import UserInfoDialog from '@/pages/music_app/views/users/components/trial/UserInfoDialog.vue'
import tagDetail from '@/pages/music_app/views/users/components/trial/tags/tagDetail.vue'
import Statistics from '../components/Statistics'
import UserFollow from '../components/UserFollow.vue'
import UserTags from '../components/UserTags.vue'
import UserPageSearch from '../components/Search/UserPageSearch'
import act from '../actions/userPage'
import columns, { actions } from '../columns/userPage'
export default {
  components: {
    BasicsTable,
    BasicsAction,
    SendFriendMessage,
    intentionDialog,
    UserInfoDialog,
    tagDetail,
    Statistics,
    UserFollow,
    UserTags,
    UserPageSearch
  },
  props: {
    teamInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      table: { stripe: false, border: false },
      columns,
      events: {
        // 'sort-change': this.sortChange,
        'selection-change': this.handleSelectionChange
      },
      act: act({
        sendFriendMessage: this.handleMessage
      }),
      actionFunction: actions({
        handleTag: this.handleTag,
        handleFollow: this.handleFollow,
        handleUserDetail: this.handleUserDetail,
        handleMessage: this.handleMessage
      }),
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500]
      },
      loading: false,
      userList: [],
      teamId: '',
      teacherIds: [],
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
      curModifyItem: {},
      selectUsers: [], // 批量选择的用户
      selectUserIds: [], // 批量选择的用户ID
      tagDataMap: new Map(), // 标签的浮窗和弹窗的数据都从这个map里面取，避免重复请求
      tagPopoverData: null,
      currentHoverUser: null,
      currentHoverTab: '',
      statisticsParams: {},
      searchParams: {},
      sortParams: {},
      isSpecial9dot9: false,
      limitQuery: {}
    }
  },
  computed: {
    today() {
      return todayTimestamp()
    },
    tomorrow() {
      return tomorrowTimestamp()
    },
    statisticsList() {
      const { teamInfo } = this
      if (teamInfo) {
        return [
          {
            label: '全部学员',
            count: teamInfo.student_count || 0,
            unit: '人'
            // disabled: true // 是否可点击
          },
          {
            label: '转化率',
            count: teamInfo.order_conversion_rate || 0,
            unit: '%',
            disabled: true // 是否可点击
          },
          {
            label: '系统课首单',
            count: teamInfo.system_order_count || 0,
            unit: '单',
            disabled: true // 是否可点击
          },
          {
            label: '总参课人数',
            count: teamInfo.student_join_course_count || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '总完课人数',
            count: teamInfo.student_complete_course_count || 0,
            total: teamInfo.student_count
          },
          {
            label: '总传作品人数',
            count: teamInfo.student_task_count || 0,
            total: teamInfo.student_count || 0
          }
        ]
      }
      return []
    }
  },
  created() {
    const { id } = this.$route.params
    this.teamId = id
    this.initLimit()
    if (id) {
      this.getUserList()
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 监听排序方法 TODO:
      this.$root.$on('handle-sort', (res) => {
        // console.log(res, 'slort')
        this.sortParams = res || {}
        this.listQuery.currentPage = 1
        this.getUserList()
      })
    })
  },
  methods: {
    initLimit() {
      // 判断是不是9.9特价课
      if (this.teamInfo.category === 11) {
        this.isSpecial9dot9 = true
        this.limitQuery.isSpecial9dot9 = this.isSpecial9dot9
      }

      // 原来的按钮数据写在'../actions/userPage.js'里不方便传值过去，只能通过取巧操作隐藏与否
      // 同理，column数据也不方便传值过去
      if (this.isSpecial9dot9) {
        // 隐藏加好友短信
        this.act.splice(0, 1)
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
        const hideActionArr = ['跟进', '打标签', '好友短信']
        for (let i = 0; len2 >= i; len2--) {
          if (hideActionArr.includes(this.actionFunction.action[len2].label)) {
            this.actionFunction.action.splice(len2, 1)
          }
        }
      }
    },
    /**
     * 统计区域 参数
     * @index: 2-参课人数，3-完课人数，4-传作品数
     */
    getStatisticData(index) {
      this.$refs.search.nowDate = Date.now()
      this.searchParams = {}
      const query = {}
      switch (index) {
        case 3:
          Object.assign(query, { join_course_count: { gt: 0 } })
          break
        case 4:
          Object.assign(query, { complete_course_count: { gt: 0 } })
          break
        case 5:
          Object.assign(query, { task_count: { gt: 0 } })
          break
        default:
      }
      this.statisticsParams = query
      this.listQuery.currentPage = 1
      this.getUserList()
    },

    getUserList(
      page = this.listQuery.currentPage,
      size = this.listQuery.pageSize
    ) {
      // reset page, size
      Object.assign(this.listQuery, {
        currentPage: page,
        pageSize: size
      })

      this.loading = true
      const { statisticsParams, searchParams = {}, sortParams = {} } = this
      const params = {}
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
          console.log(res, 'res.....')
          const { content = [], totalElements = 0, totalPages = 0 } =
            res?.data?.StudentTrialV2StatisticsPage || {}
          this.userList = this.formatUserData(content)
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    // format data
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

    // 创建或修改意向度&跟进记录
    // @type: 'create'，'update'
    handleIntention(index, uid, type = 'update') {
      console.log(index, uid, type)

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

    /**
     * 标签
     */
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
      this.$refs.searchC.$refs.defineLabelV2.initOptionsData(data)
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

    /**
     * 用户详情
     */
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

    /**
     * 操作项
     */
    handleFollow(uid, data, index) {
      const type = data.userIntention ? 'update' : 'create'
      this.handleIntention(index, uid, type)
    },
    handleTag(uid, data, index) {
      this.editSysTag(index, uid)
    },
    handleUserDetail(uid) {
      if (!uid) {
        this.$message.error('缺少用户信息')
        return
      }
      // 新标签打开详情页
      openBrowserTab(`/music_app/#/details/${uid}`)
    },
    // 发好友短信
    handleMessage(uid, data) {
      // console.log(uid, data)
      // 单条发
      if (uid && data) {
        this.selectUsers = [data]
      }
      // 批量发
      if (!data) {
        if (this.selectUsers.length === 0) {
          this.$message.warning('请选择学员')
          return
        }
      }
      this.$refs.sendFriendMessage.visible = true
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

      this.$refs.table.getRef().clearSelection()
      this.selectUserIds = []
      this.selectUsers = []
    },

    /**
     * 搜索
     */
    getSearch(searchParams) {
      console.log(searchParams, 'search')
      this.searchParams = searchParams
      this.listQuery.currentPage = 1
      this.getUserList()
    },

    /**
     * 排序
     */
    sortChange(params) {
      console.log(params, 'sortChange')
      const { prop, order } = params
      let sort = ''
      if (order) sort = order.replace(/ending/, '')
      if (sort) {
        Object.assign(this.sortParams, { [`${prop}`]: sort })
      } else {
        this.$delete(this.sortParams, prop)
      }
      this.listQuery.currentPage = 1
      this.getUserList()
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
@import './page.scss';
</style>
