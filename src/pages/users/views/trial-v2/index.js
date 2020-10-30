/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-09-04 18:38:15
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-12 18:26:04
 */
import _ from 'lodash'
import { todayTimestamp, tomorrowTimestamp } from '../../utils'
import MPagination from '@/components/MPagination/index.vue'
import ExtendUserInfo from '@/components/BaseUserInfo/Extend.vue'
import BaseUserInfo from '@/components/BaseUserInfo/Base.vue'
// import BaseUserInfo from '../../components/BaseUserInfo.vue'
import ModifyAddress from '../../components/ModifyAddress.vue'
import enums from '../../components/searchData'
import { formatData, openBrowserTab } from '@/utils/index'
import intentionDialog from '../../components/intentionDialog'
import { FOLLOW_EXPRESS_STATUS } from '@/utils/enums'
import Search from '../../components/Search.vue'
import ToolTip from '../../components/ToolTip.vue'
import TrialSidebar from '../../components/trial/TrialSidebar.vue'
import QuestionaireDrawerComponent from '../../components/trial/QuestionaireDrawerComponent.vue'
import UserInfoDialog from '../../components/trial/UserInfoDialog.vue'
import tagsItem from '../../components/trial/tags/TagsItem.vue'
import tagsPopover from '../../components/trial/tags/TagsPopover.vue'
// import ModifyWechatRemark from '../../components/ModifyWechatRemark.vue'
// import HandleDrawer from '../../components/trial/HandleDrawer.vue'
export default {
  name: 'trialUsers',
  components: {
    MPagination,
    ExtendUserInfo,
    BaseUserInfo,
    ModifyAddress,
    intentionDialog,
    Search,
    ToolTip,
    TrialSidebar,
    QuestionaireDrawerComponent,
    UserInfoDialog,
    tagsItem,
    tagsPopover
    // ModifyWechatRemark
    // HandleDrawer
  },
  computed: {
    searchParams() {
      const search = Object.assign({}, this.search)
      if (this.term && +this.term !== 0) {
        Object.assign(search, { term: this.term })
      }
      if (+this.term === 0) {
        delete search.term
      }

      // filter 与 search params 组合
      Object.assign(search, this.filterParams)
      // 系统课转化学员条件冲突，处理交互 TODO: 待优化
      if (this.filterParams) {
        if (this.filterParams.user_status) {
          // 已转化学员
          if (
            this.search.user_status &&
            this.filterParams.user_status.gte === 3
          ) {
            if (this.search.user_status.lte !== 2) {
              Object.assign(search, { user_status: this.search.user_status })
            } else {
              Object.assign(search, { user_status: { gte: 3, lte: 2 } })
            }
          }
          // 未转化学员
          if (
            this.search.user_status &&
            this.filterParams.user_status.lte === 2
          ) {
            if (this.search.user_status.lte !== 2) {
              Object.assign(search, { user_status: { gte: 3, lte: 2 } })
            }
          }
        }
      }
      return search
    },
    today() {
      return todayTimestamp()
    },
    tomorrow() {
      return tomorrowTimestamp()
    },
    tagList() {
      return function(list) {
        if (list.length > 4) {
          return list.slice(0, 4)
        } else {
          return list
        }
      }
    }
  },
  props: {
    /** 体验课班级2.0 特有 props, 判断从班级引用此组件 */
    // 班级ID
    teamIdProp: {
      type: String,
      default: ''
    },
    // 体验课班级过来的筛选项
    teamParams: {
      type: Object,
      default: null
    },
    // 体验课班级的状态
    teamStatus: {
      type: String,
      default: ''
    },
    propHeight: {
      type: Number,
      default: 0
    }
    /** 班级 props end */
  },
  data() {
    return {
      // 查询条件
      search: [],
      term: '',
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      dataList: [],
      manageMentList: [], // 排期列表
      conversionType: enums.conversionType,
      showModifyAddress: false,
      showDialogFormVisible: false,
      modifyFormData: {},
      tableHeight: 0,
      labelRowValue: {},
      curModifyItem: {},
      selectUsers: [], // 批量选择的用户
      selectUsersTemparr: [],
      currentUser: {}, // 当前选择用户
      sortKeys: {
        // 参课节数
        join_course_count: 'desc',
        // 参课次数
        // all_join_course_count: 'desc',
        // 参课最近操作时间
        last_join_time: 'desc',
        // 完课次数
        // all_complete_course_count: 'desc',
        // 完课节数
        complete_course_count: 'desc',
        // 完课最近操作时间
        last_complete_time: 'desc',
        task_count: 'desc',
        listen_comment_count: 'desc',
        questionnaire_count: 'desc',
        // 预测转化
        'bi_label.keyword': 'desc'
      },
      sortActive: '',
      // 0-待开始 1 招生中   2待开课   3 开课中  4 已结课'
      period: {
        0: '待开始',
        1: '招生中',
        2: '待开课 ',
        3: '上课中',
        4: '已结课'
      },
      // 通知中心传给search的值
      searchProp: {},
      // 本页面传给search的值都放在这个对象下
      paramsToSearch: {},
      filterParams: {},
      isOpened: true,
      currentDate: '',
      todayTotal: 0,
      tomorrowTotal: 0,
      // 合到dev后没了，换个位置更新然后重新合一下
      // 消息中心传过来的期数值
      propTerm: '',
      tagDataMap: new Map(), // 标签的浮窗和弹窗的数据都从这个map里面取，避免重复请求
      tagPopoverData: null,
      currentHoverUser: null,
      currentHoverTab: '',
      showMode: 'trialUserListMode'
    }
  },
  watch: {
    // 切换期数，清空搜索及筛选项
    term(val, old) {
      if (old === '') return
      this.currentDate = new Date().getTime()
      this.search = []
      this.filterParams = {}
      // 切换期数时清除缓存的选中项
      this.selectUsers = []
      this.selectUsersTemparr = []
      this.paramsToSearch.term = val
      this.$refs.searchC && this.$refs.searchC.changeTerm(val)
      // 切换期数时清空筛选项
      this.$refs.searchC && this.$refs.searchC.resetFilter()
    },
    searchParams(params, oldval) {
      console.log(params, oldval, 'sdgasdgasg')

      if (
        Object.keys(params).length === 0 &&
        Object.keys(oldval).length === 0
      ) {
        return
      }
      this.currentPage = 1
      // 清空筛选项
      this.selectUsers = []
      this.selectUsersTemparr = []
      this.getData()
      // 获取今日、明日待跟进数量
      if (!this.teamIdProp) {
        setTimeout(() => {
          this.getTodayCount()
          this.getTodayCount('tomorrow')
        }, 500)
      }
    },
    teamIdProp(val, old) {
      if (!val || val === old) {
        return
      }
      this.getData()
    },
    teamParams() {
      this.getData()
    }
  },
  created() {
    // 首先判断根据调用的地方的不同，列表的哪些该显示哪些该隐藏
    this.checkShowMode()
    // 消息中心传递过来的预设参数
    this.paramsFromUrl()
    this.getManagement()
  },
  methods: {
    checkShowMode() {
      // 默认是学员列表
      if (this.teamIdProp) {
        if (this.teamStatus === '0') {
          this.showMode = 'classesPerpareListMode'
        } else if (this.teamStatus === '1') {
          this.showMode = 'classesOngoingListMode'
        } else if (this.teamStatus === '2') {
          this.showMode = 'classesCompleteListMode'
        }
      }
    },
    paramsFromUrl() {
      const urlParams = localStorage.getItem('noticeParams')
      // console.log(urlParams)
      if (urlParams) {
        this.searchProp = {
          name: urlParams.split(',')[0],
          value: urlParams.split(',')[1]
        }
        // 期数
        let termIndex
        urlParams.split(',').forEach((uItem, uKey) => {
          if (uItem === 'period') {
            termIndex = uKey
          }
        })
        this.propTerm = urlParams.split(',')[termIndex + 1]
      }
    },
    getSearchQuery(res) {
      // console.log(res, 'search result')
      this.search = res
    },
    onRefresh(data) {
      setTimeout(() => {
        this.getManagement()
      }, 1000)
    },
    // 获取一行数据
    hoverRow(row, column, cell, event) {
      this.labelRowValue = row
      this.showDialogFormVisible = true
    },
    // 获取排期期数
    getManagement() {
      const params = {
        teacher_id: [],
        team_state: [0, 1]
      }
      this.$http.User.ManagementForTeacherList(params).then((res) => {
        // console.log(res)
        if (res && res.data && res.data.ManagementForTeacherList) {
          // 只显示开课中和待开课的期数 status // 0 待开始 1 招生中   2待开课   3 开课中  4 已结课',
          const arr = res.data.ManagementForTeacherList.filter(
            (item) =>
              item.management &&
              (+item.management.status === 1 ||
                +item.management.status === 2 ||
                +item.management.status === 3)
          )
          // console.log(arr)
          if (arr.length === 0) {
            this.term = '0'
            this.getData()
            // 获取今日、明日待跟进数量
            setTimeout(() => {
              this.getTodayCount()
              this.getTodayCount('tomorrow')
            }, 500)
            this.renderSearchAndTable()
            return
          }

          const list = arr.map((item) => {
            item.management.period_label = `${item.management.period_name}(${
              this.period[item.management.status]
            })`

            return item.management
          })

          this.manageMentList = _.orderBy(list, ['status'], ['desc'])
          if (this.propTerm) {
            this.term = this.propTerm
          } else {
            this.term =
              this.manageMentList.length > 0
                ? this.manageMentList[0].period
                : '0'
          }
          this.renderSearchAndTable()
        }
      })
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })

      // 标签处理
      const obj = {}
      let label = {}
      if (Object.keys(this.searchParams).includes('user_label')) {
        label = {
          'user_label.like': {
            'user_label.keyword': `*${this.searchParams.user_label}*`
          }
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
      const query = Object.assign({}, obj)

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
              content
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
    // 格式化数据
    initName(data) {
      const intentionArr = ['低', '中', '高', '无']
      data.forEach((item, key) => {
        item.index = key
        if (item.userIntention && item.userIntention.type) {
          item.userIntention.type_name =
            intentionArr[item.userIntention.type - 1]
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
      })
      return data
    },
    renderSearchAndTable() {
      // 把参数传给search，获取班级用
      this.paramsToSearch.term = this.term
      // 上面的方法获取到term之后，才会加载search组件，加载完search组件之后才去算table的高
      // 之所以要等是为了避免重绘 ---我是这么想的
      this.$nextTick(() => {
        let tableHeight =
          document.body.clientHeight -
          (this.propHeight || this.$refs.tableInner.offsetTop) -
          110
        this.tableHeight = tableHeight + ''
        tableHeight = null
      })
    },
    handleSizeChange(page) {
      this.currentPage = page
      this.getData()
    },

    changeStatus(res) {
      // console.log(res)
      const list = this.dataList.map((item) => {
        if (item.id === res.id) {
          item = res
        }
        return item
      })
      this.dataList = list
    },

    // 填写地址
    modifyAddress(row) {
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
      this.modifyFormData = params
      this.showModifyAddress = true
    },

    handleModifyAddress(res) {
      this.showModifyAddress = false
      if (res === 1) {
        this.getData()
      }
    },
    handleSelect(data) {
      // 本页选中的数据，翻页后依旧需要保留,比如说，在第一页选了10条数据，翻到第二页，再选十条数据，点地址催发短信或者群发消息，selectUsers应该长度为20
      // 方案就是selectUsersTemparr
      let hasExist = false
      let hasExistIndex = 0
      for (let i = 0, len = this.selectUsersTemparr.length; i < len; i++) {
        if (this.selectUsersTemparr[i].curPageNum === this.currentPage) {
          hasExist = true
          hasExistIndex = i
          break
        }
      }
      if (hasExist) {
        // 已经存在
        this.selectUsersTemparr[hasExistIndex].curPageData = data
      } else {
        // 还不存在当页数据
        this.selectUsersTemparr.push({
          curPageNum: this.currentPage,
          curPageData: data
        })
      }
      // 先清空selectUsers
      this.selectUsers = []
      this.selectUsersTemparr.forEach((sItem) => {
        this.selectUsers = this.selectUsers.concat(sItem.curPageData)
      })
    },
    handleSelectAll(data) {
      if (data.length) {
        this.handleSelect(data)
      } else {
        let index = 0
        for (let i = 0, len = this.selectUsersTemparr.length; i < len; i++) {
          if (this.selectUsersTemparr[i].curPageNum === this.currentPage) {
            index = i
            break
          }
        }
        this.selectUsersTemparr.splice(index, 1)
        // 先清空selectUsers
        this.selectUsers = []
        this.selectUsersTemparr.forEach((sItem) => {
          this.selectUsers = this.selectUsers.concat(sItem.curPageData)
        })
      }
    },
    defaultSelected() {
      // 先看看当前页有没有选中项
      let tarIndex = -1
      for (let i = 0, len = this.selectUsersTemparr.length; i < len; i++) {
        if (this.selectUsersTemparr[i].curPageNum === this.currentPage) {
          tarIndex = i
        }
      }
      if (
        tarIndex !== -1 &&
        this.selectUsersTemparr[tarIndex].curPageData.length
      ) {
        // 说明当前页有选中项
        // 把当前页选中项的index去都摘出来
        const tempIndexArr = this.selectUsersTemparr[tarIndex].curPageData.map(
          (tItem) => tItem.index
        )
        // console.log(tempIndexArr)
        tempIndexArr.forEach((iItem) => {
          this.$refs.table.toggleRowSelection(this.dataList[iItem], true)
        })
      }
    },

    // 点击用户信息回调事件
    userHandle(user) {
      if (!user || !user.id) {
        this.$message.error('缺少用户信息')
        return
      }
      const { id } = user
      // 新标签打开详情页
      id && openBrowserTab(`/users/#/details/${id}`)
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

    // 点击班级名称，打开班级详情
    openTeam(row) {
      if (!row.teacherInfo || !row.teamInfo || !row.team_id) return
      const teamId = row.team_id
      const teamType = row.teamInfo.team_type || '0'
      teamId &&
        openBrowserTab(`/student-team/#/teamDetail/${teamId}/${teamType}`)
    },

    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    createIntention(index, uid) {
      // 当前修改项
      this.curModifyItem.index = index
      this.curModifyItem.uid = uid
      this.curModifyItem.type = 'create'
      this.$refs.intentionDialog.showDialog()
    },
    // 意向度dialog过来的数据
    intentConfirm(data) {
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
              this.dataList[this.curModifyItem.index].userIntention,
              {
                type: IntentionMap2.get(data.radio),
                type_name: data.radio,
                describe: data.textarea || '',
                is_track: data.track.isTrack,
                today: data.track.today
                // tomorrow: data.track.tomorrow
              }
            )
            this.$set(
              this.dataList[this.curModifyItem.index],
              'userIntention',
              singleData
            )
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
    // 意向下拉框发生修改
    intentChange(tar, index) {
      const IntentionMap1 = new Map()
      IntentionMap1.set('LOW', '低')
      IntentionMap1.set('MIDDLE', '中')
      IntentionMap1.set('HIGH', '高')
      IntentionMap1.set('NONE', '无')
      const IntentionMap2 = new Map()
      IntentionMap2.set('LOW', 1)
      IntentionMap2.set('MIDDLE', 2)
      IntentionMap2.set('HIGH', 3)
      IntentionMap2.set('NONE', 4)
      if (IntentionMap2.get(tar) === this.dataList[index].userIntention.type) {
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const query = {
        uid: this.dataList[index].id,
        type: tar,
        describe: this.dataList[index].userIntention.describe,
        isTrack: this.dataList[index].userIntention.is_track,
        today: this.dataList[index].userIntention.today
        // tomorrow: this.dataList[index].userIntention.tomorrow
      }
      this.$http.User.updateUserInetention(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            const singleData = Object.assign(
              {},
              this.dataList[index].userIntention,
              {
                type: IntentionMap2.get(tar),
                type_name: IntentionMap1.get(tar)
              }
            )
            this.$set(this.dataList[index], 'userIntention', singleData)
          } else {
            this.$message.error('更新用户意向度失败')
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
          this.$message.error('更新用户意向度失败')
        })
    },
    intentDescribeChange(index, uid) {
      this.curModifyItem.index = index
      this.curModifyItem.uid = uid
      this.curModifyItem.type = 'update'
      this.$refs.intentionDialog.showDialog(this.dataList[index].userIntention)
    },
    // 修改开关
    changeSwitch(val, data, index, type) {
      const params = {
        teamId: data.team_id,
        courseType:
          data.teamInfo && +data.teamInfo.team_type === 0 ? 'TRAIL' : 'YEAR',
        studentId: data.id
      }
      if (type === 'wechat') {
        params.addedWechat = val
      } else if (type === 'group') {
        params.addedGroup = val
      }
      this.$http.User.updateTeamStudent(params).then((res) => {
        if (res && res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          // 换成原值
          if (type === 'wechat') {
            // 这么写的原因是值不是0就是1
            this.dataList[index].added_wechat = Math.abs(val - 1)
          } else if (type === 'group') {
            this.dataList[index].added_group = Math.abs(val - 1)
          }
        }
      })
    },

    // 地址催发短信 @isSingle Boolean， 是否单条发
    sendMessage(isSingle = false) {
      let orderNo = []
      // 批量发送
      if (!isSingle) {
        if (this.selectUsers.length === 0) {
          this.$message.error('请选择学员')
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
      // 单条发送
      else {
        this.currentUser.order_no && orderNo.push(this.currentUser.order_no)
      }
      // console.log(orderNo)

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
    // 操作列的下拉
    handleColumnCommand(command, user = {}, index) {
      this.currentUser = user
      switch (command) {
        // 沟通备注
        case '1':
          if (!user.userIntention || +user.userIntention.type === 0) {
            this.createIntention(index, user.id)
          } else {
            this.intentDescribeChange(index, user.id)
          }
          break
        // 催发地址短信
        case '2':
          this.sendMessage(true)
          break
      }
    },

    handleCommandChange(visible) {
      if (visible) {
        this.resetCurrentUser()
      }
    },

    // 重置当前选择用户
    resetCurrentUser() {
      this.currentUser = {}
    },

    // 参课的下拉排序
    classesDropdown(command) {
      this.sortRules(command)
    },
    // 改变排序规则
    sortRules(sortKey) {
      // let sort = ''
      if (this.sortActive) {
        this.sortKeys[this.sortActive] =
          this.sortKeys[this.sortActive] === 'asc' ? 'desc' : 'asc'
      }
      this.sortActive = sortKey
      this.getData()
    },

    /**
     * 左侧快速切换回调 */
    getFilter(data) {
      this.filterParams = data || {}
      console.log(this.filterParams, 'filter')
    },
    handleToggle(data) {
      this.isOpened = data
    },

    // 待跟进数量
    getTodayCount(type = 'today') {
      const params = {
        teacher_id: [],
        is_track: 1,
        today: type === 'today' ? this.today : this.tomorrow
      }
      if (+this.term !== 0) {
        Object.assign(params, { term: this.term })
      }
      // console.log(params)

      this.$http.User.trialCourseUsersV2(params, 1, {}).then((res) => {
        // console.log(res, 'todaycount')
        if (res && res.data && res.data.StudentTrialV2StatisticsPage) {
          const { totalElements = 0 } = res.data.StudentTrialV2StatisticsPage
          // console.log(totalElements)
          if (type === 'today') this.todayTotal = totalElements
          if (type === 'tomorrow') this.tomorrowTotal = totalElements
        }
      })
    },
    clickQuestionaire(userinfo) {
      const query = {
        uid: userinfo.id,
        mobile: userinfo.mobile,
        page: 1,
        pagesize: 20
      }
      this.$refs.questionaireDrawerC.openDrawer(query)
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

    // cell hover ： 指定单元格hover可点击状态
    cellHover(obj) {
      // 因为表格的列不固定，在不同情况下是不一样的，所以用header(label)来做判断条件,不用 columnIndex
      const {
        // columnIndex,
        column: { label }
      } = obj
      if (
        label === '参课' ||
        label === '完课' ||
        label === '作品' ||
        label === '点评' ||
        label === '活跃信息'
      ) {
        return 'cell-hover'
      }
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

    // 编辑学员微信备注 @type 0-新增，1-编辑
    handleMofifyWechatRemark(index, user, type) {
      console.log(user)
      this.$refs.modifyWechatRemark.visible = true
    }
  }
}
