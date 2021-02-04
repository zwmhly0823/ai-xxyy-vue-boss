<!--
 * @Descripttion: 班级详情 - 课前准备tab
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 18:10:00
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-12 22:18:39
-->
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
      <prepare-page-search
        :limit="limitQuery"
        ref="search"
        @search="getSearch"
      />
    </div>

    <!-- 操作区 -->
    <basics-action :actions="act" />

    <div class="show-tips">
      当前结果：学员共计{{ listQuery.totalElements }}名
    </div>

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
      <!-- 加微 slot -->
      <template slot-scope="scope" slot="switch">
        <el-switch
          v-model="scope.row.added_wechat"
          active-color="#3582fb"
          inactive-color="#DCDFE6"
          :active-value="1"
          :inactive-value="0"
          @change="changeSwitch($event, scope.row, scope.$index, 'wechat')"
        >
        </el-switch>
      </template>
      <!-- 进群 slot -->
      <template slot-scope="scope" slot="switchGroup">
        <el-switch
          v-model="scope.row.added_group"
          active-color="#3582fb"
          inactive-color="#DCDFE6"
          :active-value="1"
          :inactive-value="0"
          @change="changeSwitch($event, scope.row, scope.$index, 'group')"
        >
        </el-switch>
      </template>

      <!-- 跟进 slot -->
      <template slot-scope="scope" slot="follow">
        <user-follow
          :row="scope.row"
          :index="scope.$index"
          @handle-intention="handleIntention"
        />
      </template>

      <!-- 公众号 -->
      <template slot-scope="scope" slot="followWechat">
        <p class="prepare">
          <i class="el-icon-check" v-if="scope.row.follow"></i>
          <i v-else class="el-icon-close"></i>
        </p>
      </template>

      <!-- 盒子物流 -->
      <template slot-scope="scope" slot="express">
        <div class="d-flex align-center space-between">
          <p
            :class="{
              'red-color':
                scope.row.expressInfo &&
                +scope.row.expressInfo.express_status === 0
            }"
          >
            {{
              expressStatus(
                scope.row.expressInfo && scope.row.expressInfo.express_status
              ) || '-'
            }}
          </p>
          <i
            class="el-icon-edit"
            v-if="
              scope.row.expressInfo &&
                +scope.row.expressInfo.express_status === 0
            "
            @click="createAddress(scope.row)"
          ></i>
          <!-- 待审核状态需要编辑物流地址 -->
          <i
            class="el-icon-edit"
            v-if="
              scope.row.expressInfo &&
                +scope.row.expressInfo.express_status === 6
            "
            @click="modifyAddress(scope.row)"
          ></i>
        </div>
      </template>

      <!-- 打开APP -->
      <template slot-scope="scope" slot="openApp">
        <p v-if="!scope.row.last_open_app_time">未登录</p>
        <div v-else>
          <p>有</p>
          <p>
            最近: {{ formatData(scope.row.last_open_app_time, 'shortDay') }}
          </p>
        </div>
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

    <!-- 用户详情 dialog -->
    <user-info-dialog
      :user="currentHoverUser"
      :tab="currentHoverTab"
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

    <!-- 无地址页面修改地址弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showCreateAddress"
      width="30%"
      title="添加收货信息"
    >
      <create-address
        @addExpress="handleModifyAddress"
        :formData="createFormData"
        v-if="showCreateAddress"
      />
    </el-dialog>
    <!-- 无地址页面修改地址弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showModifyAddress"
      width="30%"
      title="收货信息"
    >
      <modify-address
        @modifyAddressExpress="handleModifyAddress"
        :modifyFormData="modifyFormData"
        v-if="showModifyAddress"
      />
    </el-dialog>
  </div>
</template>

<script>
import { openBrowserTab, formatData } from '@/utils'
import { FOLLOW_EXPRESS_STATUS } from '@/utils/enums'
import { todayTimestamp, tomorrowTimestamp } from '../utils'
import BasicsTable from '@/components/BasicsTable'
import BasicsAction from '@/components/BasicsAction'
import SendFriendMessage from '@/components/SendFriendMessage/index.vue'
import intentionDialog from '@/pages/music_app/views/users/components/intentionDialog'
import UserInfoDialog from '@/pages/music_app/views/users/components/trial/UserInfoDialog.vue'
import tagDetail from '@/pages/music_app/views/users/components/trial/tags/tagDetail.vue'
import CreateAddress from '@/pages/music_app/views/users/components/ModifyAddress.vue'
import ModifyAddress from '@/pages/music_app/views/users/views/details/addressComponents/modifyAddress.vue'
import Statistics from '../components/Statistics'
import UserFollow from '../components/UserFollow.vue'
import UserTags from '../components/UserTags.vue'
import PreparePageSearch from '../components/Search/PreparePageSearch'
import act from '../actions/preparePage'
import columns, { actions } from '../columns/preparePage'
export default {
  components: {
    BasicsTable,
    BasicsAction,
    SendFriendMessage,
    intentionDialog,
    UserInfoDialog,
    CreateAddress,
    ModifyAddress,
    tagDetail,
    Statistics,
    UserFollow,
    UserTags,
    PreparePageSearch
  },
  props: {
    teamInfo: {
      type: Object,
      default: () => {}
    },
    updateCount: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      table: { stripe: false, border: false },
      columns,
      events: {
        'sort-change': this.sortChange,
        'selection-change': this.handleSelectionChange
      },
      act: act({
        sendMessage: this.sendMessage,
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
      formatData,
      showModifyAddress: false,
      showCreateAddress: false,
      modifyFormData: {},
      createFormData: {},
      isSpecial9dot9: false,
      // 所有关于权限判断的都放在这里面，免得权限太多传值太多不好看
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
      const {
        teamInfo,
        unFollowCount,
        unOpenAppCount,
        deliveredSignCount
      } = this
      if (teamInfo) {
        return [
          {
            label: '全部学员',
            count: teamInfo.student_count || 0,
            unit: '人'
          },
          {
            label: '待加微信',
            count: teamInfo.unadd_wechat || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '待关注公众号',
            count: unFollowCount || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '无发货地址',
            count: teamInfo.no_address_count || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '待发货',
            count: teamInfo.to_be_delivered_count || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '待签收',
            count: deliveredSignCount || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '待进群',
            count: teamInfo.unadd_group || 0,
            total: teamInfo.student_count || 0
          },
          {
            label: '待打开APP',
            count: unOpenAppCount || 0,
            total: teamInfo.student_count || 0
          }
        ]
      }
      return []
    },
    // 待关注公众号
    unFollowCount() {
      if (this.teamInfo) {
        return +this.teamInfo.student_count - +this.teamInfo.follow_count || 0
      }
      return 0
    },
    // 待打开app
    unOpenAppCount() {
      if (this.teamInfo) {
        return +this.teamInfo.student_count - +this.teamInfo.open_app_count || 0
      }
      return 0
    },
    // 待签收总数   delivered_sign_count:已签收总数
    // 待签收=班级人数-已完成-未发货的
    deliveredSignCount() {
      if (this.teamInfo) {
        return (
          +this.teamInfo.delivered_start_count -
            +this.teamInfo.delivered_sign_count || 0
        )
      }
      return 0
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

      if (this.isSpecial9dot9) {
        // 隐藏加好友短信
        this.act.splice(0, 1)
        // 隐藏不需要的表头
        let len = this.columns.length - 1
        const hideTableArr = ['盒子物流', '跟进', '标签']
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
     */
    getStatisticData(index) {
      this.$refs.search.nowDate = Date.now()
      this.searchParams = {}
      const query = {}
      switch (index) {
        case 1:
          Object.assign(query, { added_wechat: 0 })
          break
        case 2:
          Object.assign(query, { follow: 0 })
          break
        case 3:
          // 无地址
          Object.assign(query, { express_status: '0' })
          break
        case 4:
          // 待发货
          Object.assign(query, { express_status: '1' })
          break
        case 5:
          // 待签收
          Object.assign(query, { express_status: '2' })
          break
        case 6:
          Object.assign(query, { added_group: 0 })
          break
        case 7:
          // 待打开app TODO:为0时返回的null, 需要玉龙处理一下数据
          Object.assign(query, { open_app_count: 0 })
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

    // switch
    changeSwitch(val, data, index, type) {
      console.log(val, data, index, type)
      const params = {
        teamId: data.team_id,
        studentId: data.id
      }
      if (type === 'wechat') {
        params.addedWechat = val
      } else if (type === 'group') {
        params.addedGroup = val
      }
      if (this.isSpecial9dot9 === true) {
        params.courseType = 'SPECIAL'
      } else {
        params.courseType = 'TRAIL'
      }
      this.loading = true
      this.$http.User.updateTeamStudent(params)
        .then((res) => {
          if (res && res.code === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // TODO: 修改parent组件的加微信和公众号的统计数
            this.updateCount && this.updateCount(type, val)
          } else {
            // 换成原值
            if (type === 'wechat') {
              // 这么写的原因是值不是0就是1
              this.userList[index].added_wechat = Math.abs(val - 1)
            } else if (type === 'group') {
              this.userList[index].added_group = Math.abs(val - 1)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
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
      openBrowserTab(`/users/#/details/${uid}`)
    },
    // 发好友短信
    handleMessage(uid, data) {
      console.log(uid, data)
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
    // 地址催发短信
    sendMessage(uid, data) {
      let orderNo = []
      // 单条发
      if (uid && data) {
        this.currentUser.order_no && orderNo.push(this.currentUser.order_no)
      }
      // 批量发
      if (!data) {
        if (this.selectUsers.length === 0) {
          this.$message.warning('请选择学员')
          return
        }
        // 如果选择的学员物流已有地址，则中断并提示
        for (let index = 0; index < this.selectUsers.length; index++) {
          const item = this.selectUsers[index]
          if (item.expressInfo && +item.expressInfo.express_status > 0) {
            this.$message.error('不支持发送给已添加物流地址的学员')
            orderNo = []
            break
          }
          orderNo.push(item.order_no)
        }
      }
      if (orderNo.length === 0) return
      this.$confirm(
        `您即将给用户发送【催发地址短信】，发送人数：${orderNo.length}人`,
        '催发地址短信',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const orderIds = orderNo.join(',')
        // console.log(orderIds, 'orderIds')
        this.$http.Order.pushMsgByOrderIds(orderIds)
          .then((res) => {
            if (res.errors) {
              this.$message.error(res.errors)
              return
            }
            this.$message.success('提交成功')
          })
          .catch(() => {
            this.$message.error('提交失败')
          })
      })
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
    },

    expressStatus(status) {
      if (!status && +status !== 0) {
        return '-'
      }
      // 异常物流
      if ('4,5,7,8'.includes(status)) {
        return '异常物流'
      }
      return FOLLOW_EXPRESS_STATUS[status]
    },

    // 添加地址
    createAddress(row) {
      // console.log(row)
      /**
        orderId: this.formData.orderid,
        expressId: this.formData.id,
        userId: this.formData.userid,
       */
      const params = {
        userid: row.id,
        orderid:
          (row.orderInfo.trial_course && row.orderInfo.trial_course.order_no) ||
          row.order_no,
        id: row.express_id
      }
      this.createFormData = params
      this.showCreateAddress = true
    },

    // 填写地址 - 编辑
    modifyAddress(row) {
      // console.log(row)
      const params = {
        // userid: row.id,
        id: row.id,
        address: [row.expressInfo]
      }
      this.modifyFormData = params
      this.showModifyAddress = true
    },

    handleModifyAddress(res) {
      console.log(res, '0000000000')

      this.showModifyAddress = false
      this.showCreateAddress = false
      if (res === 1) {
        this.getUserList()
      }
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
