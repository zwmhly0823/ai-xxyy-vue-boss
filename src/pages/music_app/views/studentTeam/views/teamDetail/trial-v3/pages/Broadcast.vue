<template>
  <div class="boradcast-page">
    <!-- 活动列表 -->
    <div class="actives">
      <div class="lbl">活动选择</div>
      <el-select class="control" size="small" v-model="liveActivityId">
        <el-option
          v-for="(item, index) in liveActive"
          :key="index"
          :value="item.activityId"
          :label="item.liveName"
        >
          <div class="active-option">
            <span>{{ item.liveName }}</span>
            <span style="color: red; font-size: 12px">{{
              activeStatus[item.liveStatus]
            }}</span>
          </div>
        </el-option>
      </el-select>
    </div>

    <!-- 统计信息 -->
    <statistics :list="statisticsList" @result="getStatisticData" />

    <!-- 搜索 -->
    <broadcast-search
      ref="search"
      @search="getSearch"
      :activeId="liveActivityId"
    />
    <!-- 操作区 -->
    <!-- <div class="act">
      <el-button
        type="default"
        size="mini"
        style="margin-right: 20px;"
        @click="handleSendWechatMessage"
        >微信群发</el-button
      >
      <el-button size="mini" @click="wechatGroupTag">
        批量微信标签
      </el-button>
    </div> -->
    <!-- 学员列表 -->
    <basics-table
      ref="table"
      :table="table"
      :events="events"
      :loading="loading"
      :list="userList"
      :get-list="getActiveList"
      :columns="columns"
      :list-query="listQuery"
      :action-function="actionFunction"
    >
      <!-- 学习概况 slot -->
      <template slot-scope="scope" slot="survey">
        <div class="user-survey" @click="showHoverUser(scope.row, 'course')">
          <p>
            打开:<span class="danger">{{ scope.row.open_app_count || 0 }}</span>
            参课:<span class="danger">{{ scope.row.join_course_count }}</span>
            完课:<span class="danger">{{
              scope.row.complete_course_count
            }}</span>
          </p>
          <p>
            作品:<span class="danger">{{ scope.row.task_count }}</span>
            点评:<span class="danger">{{ scope.row.comment_count }}</span>
            听点评:<span class="danger">{{
              scope.row.listen_comment_count
            }}</span>
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
      <!-- 评论数 -->
      <el-table-column prop="chat_count" label="评论数">
        <template slot-scope="scope">
          <p
            :class="scope.row.chat_count ? 'liveActive' : ''"
            @click="scope.row.chat_count ? handleChatCount(scope.row) : ''"
          >
            {{ scope.row.chat_count ? scope.row.chat_count : '-' }}
          </p>
        </template>
      </el-table-column>
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
            物流<i
              class="el-icon-check"
              v-if="+scope.row.express_status === 3"
            ></i>
            <i v-else class="el-icon-close"></i> 公众号<i
              class="el-icon-check"
              v-if="scope.row.follow"
            ></i>
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
                danger: scope.row.user_status_name !== '未转化',
              },
            ]"
          >
            {{ scope.row.user_status_name }}
          </span>
        </div>
      </template>
    </basics-table>
    <!-- 微信标签 -->
    <wechat-group-tag
      ref="wechatGroupTag"
      @wxLabel="getData"
    ></wechat-group-tag>
    <!-- 评论数dialog -->
    <el-dialog title="直播评论" :visible.sync="chatDialogVisible" width="30%">
      <div class="">学员：{{ phoneNumber }}</div>
      <el-table :data="chatList">
        <el-table-column label="评论时间" prop="chatTime"></el-table-column>
        <el-table-column label="评论内容" prop="chatContent"></el-table-column>
      </el-table>
      <div class="chat-pagination">
        <el-pagination
          layout="prev,pager,next,total,sizes,jumper"
          :page-size="chatPageSize"
          :current-page="chatCurrentPage"
          :total="chatTotalElements"
          :page-sizes="[10, 20, 30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isToss, openBrowserTab } from '@/utils'
import Statistics from '../components/Statistics'
import BroadcastSearch from '../components/Search/BroadcastSearch'
import BasicsTable from '@/components/BasicsTable'
import wechatGroupTag from '../../../../components/wechatTags/WechatGroupDialog'
import columns, { actions } from '../columns/broadcast'
import UserFollow from '../components/UserFollow'
import UserTags from '../components/UserTags'

export default {
  components: {
    Statistics,
    BroadcastSearch,
    wechatGroupTag,
    BasicsTable,
    UserFollow,
    UserTags,
  },
  data() {
    return {
      table: { stripe: false, border: false },
      columns,
      events: {
        // 'sort-change': this.sortChange,
        'selection-change': this.handleSelectionChange,
      },
      phoneNumber: '-',
      chatTotalElements: 0,
      chatPageSize: 10,
      chatCurrentPage: 1,
      chatList: [],
      chatDialogVisible: false,
      selectUsers: [], // 批量选择的用户
      loading: false,
      userList: [],
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500],
      },
      actionFunction: actions({
        handleUserDetail: this.handleUserDetail,
      }),
      tagPopoverData: null,
      liveActive: [],
      liveStatistics: [],
      liveActivityId: null,
      activeStatus: {
        0: '--',
        1: '直播中',
        2: '预告',
        3: '回放',
        4: '结束',
        5: '关闭',
      },
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
    }
  },
  computed: {
    statisticsList() {
      return this.liveStatistics.map((item) => {
        return {
          name: item.name,
          label: item.desc,
          count: item.value,
          unit: '人',
        }
      })
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.chatCurrentPage = val
      this.getchatList()
    },
    handleSizeChange(val) {
      this.chatCurrentPage = 1 // 处理当前第30页-页容量5=>改页容量100后,页码不归1的组件内部问题
      this.chatPageSize = val
      this.getchatList()
    },
    handleUserDetail(uid) {
      if (!uid) {
        this.$message.error('缺少用户信息')
        return
      }
      // 新标签打开详情页
      openBrowserTab(`/music_app/#/details/${uid}`)
    },
    async getLiveCount() {
      const data = await this.$http.liveBroadcast.getLiveCount({
        teamId: this.teamId,
        activityId: this.liveActivityId,
      })
      if (data.code === 0) {
        this.liveStatistics = data.payload
      }
    },
    async getLiveActive() {
      const data = await this.$http.liveBroadcast.getLiveActive({
        teamId: this.teamId,
      })
      if (data.code === 0) {
        this.liveActive = data.payload
        this.liveActivityId = data.payload[0] && data.payload[0].activityId
        this.getLiveCount()
        this.getActiveList()
      }
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
        teacherId: this.teacherId,
        teacherIds: [this.teacherId],
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
    // 创建或修改意向度&跟进记录
    // @type: 'create'，'update'
     // 跟进
    handleFollow(uid, data, index) {
      const type = data.userIntention ? 'update' : 'create'
      this.handleIntention(index, uid, type)
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
    // 批量发送微信消息
    handleSendWechatMessage() {
      const len = this.selectUsers.length || 0
      if (len === 0) {
        this.$message.warning('请选择学员')
        return
      }
      const userArr = this.selectUsers.map((item) => {
        return item.id
      })
      const query = {
        teacherId: this.teacherId,
        userId: userArr,
        totalNum: len,
      }
      this.$refs.wechatGroupMessageV2.openWechatDrawer(query)
    },
    /**
     * 统计区域 参数
     * @index: 2-参课人数，3-完课人数，4-传作品数
     */
    getStatisticData(index) {
      this.$refs.search.nowDate = Date.now()
      this.searchParams = {}
      const name = this.liveStatistics[index] && this.liveStatistics[index].name
      const value =
        this.liveStatistics[index] && this.liveStatistics[index].value
      const query = {}
      switch (name) {
        case 'enteredLiveRoomNum': //进入直播间人数
          Object.assign(query, { in_room_num: { gt: 0 } })
          break
        case 'notEnteredLiveRoomNum': //未进入直播间人数
          Object.assign(query, { in_room_num: 0 })
          break
        case 'watchLiveNum': //观看过直播人数
          Object.assign(query, { live_watch_time: { gt: 0 } })
          break
        case 'watchReplayNum': //观看过回放人数
          Object.assign(query, { playback_watch_time: { gt: 0 } })
          break
        case 'buyGoodsNum': //购买商品人数
          Object.assign(query, { by_shop_flag: { gt: 0 } })
          break

        default:
          break
      }

      this.statisticsParams = query
      this.listQuery.currentPage = 1
      this.getActiveList()
    },

    getActiveList(
      page = this.listQuery.currentPage,
      size = this.listQuery.pageSize
    ) {
      // reset page, size
      Object.assign(this.listQuery, {
        currentPage: page,
        pageSize: size,
      })

      this.loading = true
      const { statisticsParams, searchParams = {}, sortParams = {} } = this
      const params = {}
      Object.assign(
        params,
        {
          team_id: this.teamId,
          act_id: this.liveActivityId,
        },
        statisticsParams,
        searchParams
      )
      this.$http.liveBroadcast
        .getActiveList(params, {
          page,
          size,
        })
        .then((res) => {
          const { content = [], totalElements = 0, totalPages = 0 } =
            res?.data?.ActivityUserStatisticsPage || {}
          this.userList = this.formatUserData(content)
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages,
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
          item.userIntention = this.userIntentionClassMap[type] || ''
          item.userIntention = this.userIntentionMap[type] || ''
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
     * 搜索
     */
    getSearch(searchParams) {
      console.log(searchParams, 'search')
      this.searchParams = searchParams
      this.listQuery.currentPage = 1
      this.getActiveList()
    },
    // 批量微信标签
    wechatGroupTag() {
      if (!this.selectUsers.length) {
        this.$message.error('请选择学员')
        return
      }
      this.$refs.wechatGroupTag.open(this.selectUsers)
    },
    handleChatCount(row) {
      this.activeRow = row
      this.phoneNumber = row.user.mobile
      this.getchatList()
      this.chatDialogVisible = true
    },
    async getchatList() {
      const res = await this.$http.liveBroadcast.getLiveChatList({
        userId: this.activeRow.uid,
        huoUserId: this.activeRow.huo_user_id,
        activityId: this.liveActivityId,
        pageNum: this.chatCurrentPage,
        pageSize: this.chatPageSize,
      })
      if (res.code === 0) {
        this.chatTotalElements = res.payload.totalElements * 1
        this.chatList = res.payload.content
      }
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)',
      })
      // 如果搜索销售，用获取的老师id替换权限老师id
      const teacher = {}
      // TODO: 注意放开
      if (!Object.keys(this.searchParams).includes('teacher_id')) {
        Object.assign(teacher, {
          teacher_id: this.teacherIds,
        })
      }

      // 标签处理
      const obj = {}
      let label = {}
      if (Object.keys(this.searchParams).includes('user_label')) {
        label = {
          'user_label.like': {
            'user_label.keyword': `*${this.searchParams.user_label}*`,
          },
        }
        delete obj.user_label
      }
      Object.assign(obj, this.searchParams, label)
      // 班级管理2.0过来的参数
      if (this.teamIdProp) {
        Object.assign(obj, { team_id: this.teamIdProp })
        // 把期数去掉
        delete obj.term
      }
      if (this.teamParams) {
        Object.assign(obj, this.teamParams)
      }
      const query = Object.assign({}, obj, teacher)
      // 学员列表筛掉特价课的
      query.team_category = [0, 5, 6, 7]

      const page = this.currentPage
      const sort = {}
      if (this.sortActive) {
        sort[this.sortActive] = this.sortKeys[this.sortActive]
      }
      this.$http.User.trialCourseUsersV2(query, page, sort)
        .then((res) => {
          // console.log(res)
          var defTotalElements = 0
          var defTotalPages = 1
          var defContent = []
          if (res && res.data && res.data.StudentTrialV2StatisticsPage) {
            const {
              totalElements,
              totalPages,
              content,
            } = res.data.StudentTrialV2StatisticsPage
            defTotalElements = totalElements
            defTotalPages = totalPages
            // defContent = content
            defContent = this.initName(content)
          }
          this.dataList = defContent
          // console.log('dataList', this.dataList)
          this.totalPages = +defTotalPages
          this.totalElements = +defTotalElements
          this.$nextTick(() => {
            loading.close()
            // 处理翻页后默认选中的问题
            this.defaultSelected()
          })
        })
        .catch(() => {
          loading.close()
        })
    },
  },
  watch: {
    liveActivityId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getLiveCount()
        this.getActiveList()
      }
    },
  },
  created() {
    const { id } = this.$route.params
    this.teamId = id
    if (id) {
      this.getLiveActive()
    }
  },
}
</script>

<style lang="scss" scoped>
.actives {
  display: flex;
  align-items: center;
  margin: 5px 0 15px;
  .control {
    margin-left: 10px;
  }
}
.act {
  margin-bottom: 10px;
}
.active-option {
  display: flex;
  justify-content: space-between;
}
.liveActive {
  color: #2a75ed; 
  cursor: pointer
}
</style>

