<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-27 10:17:03
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-28 23:45:05
-->
<template>
  <section class="details-body">
    <el-scrollbar>
      <header class="asset-header" v-if="stuInfor_add.id">
        <div class="asset">
          <div class="module">
            <i class="el-icon-time"></i>
            <span>剩余系统课：</span>
            <span>{{ allSysRemainingWeeks || 0 }} 周</span>
          </div>
          <div class="module">
            <i class="el-icon-alarm-clock"></i>
            <span v-if="changeSubject === 0">小熊</span>
            <span v-else>点点</span>
            <span>币：</span>
            <span>{{ coinNumList[2].value }} 个</span>
          </div>
          <div class="module" v-if="changeSubject === 0">
            <i class="el-icon-potato-strips"></i>
            <span>钻石：</span>
            <span>{{ diamondNumList[2].value }} 个</span>
          </div>
        </div>
        <div class="course-base">
          <div class="module">
            <span>最近活跃：</span>
            <span>
              {{
              (stuInfor_add.lastBehaviorLog &&
              stuInfor_add.lastBehaviorLog.device_model) ||
              '--'
              }}
            </span>
            <span style="margin-left:5px;">
              {{
              (stuInfor_add.lastBehaviorLog &&
              stuInfor_add.lastBehaviorLog.action_time) ||
              '--'
              }}
            </span>
          </div>
          <div class="module">
            <span>最近参课：</span>
            <span>{{ firstTeam.last_join_time || '--' }}</span>
          </div>
          <div class="module">
            <span>最近完课：</span>
            <span>{{ firstTeam.last_complete_time || '--' }}</span>
          </div>
        </div>
      </header>
      <!-- 头部 -->
      <el-row
        type="flex"
        justify="start"
        align="middle"
        class="header"
        v-loading="sectionLoading"
        element-loading-spinner="el-icon-loading"
      >
        <div class="img-box">
          <!-- <img class="head-portrait" :src="stuInfor_add.head || defaultHead" /> -->
          <el-image
            class="head-portrait"
            :src="stuInfor_add.head || defaultHead"
            :preview-src-list="[stuInfor_add.head || defaultHead]"
          ></el-image>
          <i v-if="stuInfor_add.sex == '2'" class="female el-icon-female" />
          <i v-else-if="stuInfor_add.sex == '1'" class="male el-icon-male" />
          <i v-else class="el-icon-toilet-paper" />
        </div>

        <el-col :span="16">
          <div class="user-base-info upset_24col">
            <div>
              <span>{{ stuInfor_add.username || '--' }}</span>
              <span style="margin: 0 5px;">·</span>
              <span>{{ stuInfor_add.mobile || '--' }}</span>
            </div>
            <div>ID：{{ stuInfor_add.user_num || '--' }}</div>
            <div>
              <span class="tccc">年龄：</span>
              {{ stuInfor_add.age || '--' }}
            </div>
            <div>
              <span class="tccc">生日：</span>
              {{ stuInfor_add.birthday || '--' }}
            </div>
            <div>
              <span class="tccc">归属地：</span>
              <span>{{ stuInfor.mobile_province || '-' }}</span>
              <span>·</span>
              <span>{{ stuInfor.mobile_city || '-' }}</span>
            </div>
            <!-- 只有'1'是关注了-->
            <div
              v-if="
                stuInfor_add.weixinUser &&
                  stuInfor_add.weixinUser.follow === '1'
              "
              class="d-flex"
            >
              <svg class="lk-icon-green" aria-hidden="true">
                <use xlink:href="#icongongzhonghao" />
              </svg>
              <span>已关注公众号</span>
            </div>
            <div v-else class="d-flex">
              <svg class="lk-icon" aria-hidden="true">
                <use xlink:href="#icongongzhonghao" />
              </svg>
              <span style="margin-left: 3px;">未关注公众号</span>
            </div>
          </div>
          <!-- 只有系统课显示 -->
          <div class="course-info upset_24col">
            <el-tag type="danger" class="tag-setting" size="small">
              {{
              (stuInfor && stuInfor.statusCH) || '--'
              }}
            </el-tag>
            <!-- <el-tag type="danger" class="tag-setting" size="small">{{
              (firstTeam.orderInfo && firstTeam.orderInfo.packages_name) || '--'
            }}</el-tag>-->
            <!-- <el-tag type="warning" class="tag-setting" size="small">{{
              firstTeam.teamStatusCH || '--'
            }}</el-tag>-->
          </div>
        </el-col>

        <el-col :span="8">
          <div class="upset_24col flex-end authoraziton-btn">
            <el-button
              size="mini"
              type="primary"
              @click="$refs.couponPopover.issueCoupons = true"
              v-if="isTossSys"
            >发优惠券</el-button>
            <template v-if="changeSubject === 0">
              <el-button
                size="mini"
                type="primary"
                @click="queryJump(item)"
                v-for="(item, index) of operatBtn"
                :key="index"
              >{{ item }}</el-button>
            </template>
          </div>
          <!-- <div class="authoraziton-btn" v-if="changeSubject === 0">
            <el-button
              size="mini"
              type="primary"
              @click="queryJump(item)"
              v-for="(item, index) of operatBtn"
              :key="index"
              >{{ item }}</el-button
            >
          </div>-->
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <div
        class="tab-sty"
        ref="autoHeight"
        :style="{ height: autoHeight }"
        v-loading="sectionLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="玩命加载中"
      >
        <el-tabs v-model="tabData" class="parent-tabs">
          <el-tab-pane label="详细信息" name="detailsInfo">
            <userInfo
              :stuInforAdd="stuInfor_add"
              :stuInfor="stuInfor"
              :sysCourse="sysCourse"
              :teamList="trialSysTeamList"
              @hasEditAddress="hasEditAddress"
              @orderLists="orderLists"
            />
          </el-tab-pane>
          <el-tab-pane label="上课记录" name="learningRecord">
            <studyRecord :stuInforAdd="stuInfor_add" :stuInfor="stuInfor" :tab="tabData" />
          </el-tab-pane>
          <el-tab-pane label="作品集" name="collectionOf">
            <portfolio />
          </el-tab-pane>
          <el-tab-pane label="学习周报" name="studyWeekly" v-if="changeSubject === 0">
            <studyWeekly />
          </el-tab-pane>
          <el-tab-pane label="订单记录" name="orderRecord">
            <orderRecord />
          </el-tab-pane>
          <el-tab-pane label="物流记录" name="logistics">
            <logistics />
          </el-tab-pane>
          <el-tab-pane label="账户资产" name="userAsset">
            <capital :tab="tabData" :stuInforAdd="stuInfor_add" />
          </el-tab-pane>
          <el-tab-pane label="转介绍" name="changeRecommend">
            <changeRecommend />
          </el-tab-pane>
          <el-tab-pane label="审批记录" name="approvalRecord">
            <approval-record :stuInfor_add="stuInfor_add.mobile" />
          </el-tab-pane>
          <el-tab-pane label="行为轨迹" name="behaviorLocus" v-if="changeSubject === 0">
            <behaviorLocus />
          </el-tab-pane>
          <el-tab-pane label="用户触达" name="notifyRecord">
            <ivr />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-scrollbar>
    <!-- 优惠券弹窗 -->
    <coupon-popover ref="couponPopover" :selectUserId="[studentId]" />
  </section>
</template>

<script>
import { sortBy } from 'lodash'
import { USER_FLLOW_UP } from '@/utils/enums'
import { formatDate, formatDateByType } from '@/utils/mini_tool_lk'
import userInfo from './userDetail/art.vue' // 系统课学员信息
import studyRecord from './studyRecord/index.vue'
import orderRecord from './orderRecord/index.vue'
import logistics from './orderLogistics/index.vue'
import capital from './userCapital/index.vue'
import portfolio from './portfolio/index.vue'
import ivr from './ivrComponents/ivrCon.vue'
import studyWeekly from './studyWeekly/index.vue'
import behaviorLocus from './behaviorLocus/index.vue'
import changeRecommend from './changeRecommend/index.vue'
import approvalRecord from '../../components/approvalRecord'
import {
  GetAgeByBrithday,
  formatData,
  calcBrowerClienHeight,
  isToss
} from '@/utils/index'

import CouponPopover from '@/pages/music_app/views/studentTeam/components/TabPane/components/couponPopover'
import { courseLevelReplace } from '@/utils/supList'

export default {
  components: {
    userInfo,
    studyRecord,
    portfolio,
    orderRecord,
    logistics,
    capital,
    ivr,
    changeRecommend,
    CouponPopover,
    studyWeekly,
    behaviorLocus,
    approvalRecord
  },
  data() {
    return {
      allSysRemainingWeeks: 0,
      USER_FLLOW_UP,
      courseLevelReplace,
      changeSubject: this.$store.state.subjects.subjectCode,
      // <修改地址>组件弹窗显示隐藏
      dialogTableVisible: false,
      // 该学员id
      studentId: '',
      // 推荐人id
      sendId: '0',
      // 学员基本信息(公用_老)
      stuInfor: {
        address: [{}],
        jluserInfo: {},
        teams: [],
        bought_subject: [] // 学习科目
      },
      // 学员基本信息(分类补充)
      stuInfor_add: {
        sender: { username: '' }
      },
      // 学员标签(非艾克的全部4项)
      babels_lk: [],
      callInfo: null,
      // paneltab name
      tabData: 'detailsInfo',
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',

      couponData: [], // 优惠券组件列表数据
      operatBtn: [],
      systemStatusKeyVal: {
        0: '未开始',
        1: '待开课',
        2: '上课中',
        3: '暂停',
        4: '停止',
        5: '已退款',
        6: '已结束'
      },
      trialStatusVal: {
        0: '待开课',
        1: '上课中',
        2: '已结课'
      },
      sysTeamFirst: {},
      autoHeight: 'auto',
      headerLoading: false,
      sectionLoading: false,
      sysCourse: {},
      trialSysTeamList: [], // 体验课+系统课 列表
      firstTeam: {},
      bearCoin: {}, // 用户资产_小熊币
      coinNumList: [
        // 小熊币
        {
          label: '共获取',
          value: 0
        },
        {
          label: '已消耗',
          value: 0
        },
        {
          label: '剩余',
          value: 0
        }
      ],
      diamondNumList: [
        // 砖石
        {
          label: '共获取',
          value: 0
        },
        {
          label: '已消耗',
          value: 0
        },
        {
          label: '剩余',
          value: 0
        }
      ],
      expressstatus: {
        '-1': '无信息',
        0: '待发货',
        1: '待发货',
        2: '已发货',
        3: '已签收',
        4: '退签',
        5: '退回',
        6: '待确认发货',
        7: '无效',
        8: '疑难',
        9: '暂停'
      }
    }
  },
  computed: {
    isTossSys() {
      return isToss()
    },
    aikelabel() {
      return (
        (this.stuInfor.jluserInfo &&
          this.stuInfor.jluserInfo.labels &&
          JSON.parse(this.stuInfor.jluserInfo.labels)) ||
        []
      )
    },
    studyCount() {
      return this.stuInfor.bought_subject.map((item) => {
        switch (item) {
          case 'ART_APP':
            item = '小熊美术'
            break
          case 'WRITE_APP':
            item = '美术宝写字'
            break
          case 'COLLEGE_APP':
            item = 'AI学院'
            break
          case 'MUSIC_APP':
            item = '小熊音乐'
            break
          default:
            item = '未知学科'
            break
        }
        return item
      })
    }
  },
  async created() {
    this.$root.$on('jumpPartRecommend', (r) => {
      if (r === 'changeRecord') {
        this.tabData = 'changeRecommend'
      }
    })
    this.studentId = this.$route.params.id
    this.teamType()
    this.getUserAllTeam()

    this.getUserInfo() // 学员信息接口
    this.UserExtends() // 学员信息接口-分类补充
    this.getlabelWithoutAike() // 获取艾克之外的标签

    this.autoHeight = await calcBrowerClienHeight(this, 'autoHeight', 68)
  },
  mounted() {},
  methods: {
    // 订单列表
    orderLists() {
      const type = document.getElementById('tab-orderRecord')
      type.click()
    },
    // 体验课、系统课区分
    teamType() {
      // const teacher = localStorage.getItem('teacher')
      // const { dutyId } = JSON.parse(teacher)
      if (isToss(true)?.dutyId === '1') {
        this.operatBtn = ['补发货', '退款']
      } else {
        this.operatBtn = ['补发货', '调级', '调班', '调期', '退款']
      }
    },
    async getUserAllTeam() {
      this.sectionLoading = true
      try {
        const id = this.$route.params.id
        const subject = this.changeSubject

        const trialList = await this.trialList(id, subject)
        const sysList = await this.systemList(id, subject)

        this.trialSysTeamList = [
          ...this.sysTemSortTeamList(sysList),
          ...trialList
        ]

        const [firstTeam = {}] = this.trialSysTeamList
        // 头部课程信息取第一个
        this.firstTeam = firstTeam
      } catch (err) {
        console.error(err)
      } finally {
        this.sectionLoading = false
      }
    },
    calcCoinAndDiamond(coin = [], dataList = []) {
      const [first, second, third] = dataList
      // 头3数据取自老爹-总获取
      first.value = coin.reduce((pre, cur) => {
        if (!['5', '11', '13', '14'].includes(cur.code)) {
          return pre + Number(cur.value)
        } else {
          return pre + 0
        }
      }, 0)
      // 头3数据取自老爹-已消耗
      second.value = coin.reduce((pre, cur) => {
        if (['5', '11', '13', '14'].includes(cur.code)) {
          return pre + Number(cur.value)
        } else {
          return pre + 0
        }
      }, 0)
      // 头3数据取自老爹-计算剩余
      third.value = first.value - second.value
    },
    // 体验课
    async trialList(id, subject) {
      const {
        data: { StudentTrialV2StatisticsList }
      } = await this.$http.User.StudentTrialList({ id, subject })
      this.packageTrialTeamList(StudentTrialV2StatisticsList)
      StudentTrialV2StatisticsList.map((item) => {
        if (item.teamInfo) {
          item.teamInfo.class_start = item.teamInfo.class_start
            ? formatData(item.teamInfo.class_start)
            : ''
          item.teamInfo.class_end = item.teamInfo.class_end
            ? formatData(item.teamInfo.class_end)
            : ''
          item.teamInfo.stop_end_time = item.teamInfo.stop_end_time
            ? formatData(item.teamInfo.stop_end_time)
            : ''
        }
      })
      return StudentTrialV2StatisticsList
    },
    // 系统课
    async systemList(studentid, subject) {
      const {
        data: { StudentSystemStatisticsList = [] }
      } = await this.$http.User.StudentSystemStatisticsList({
        studentid,
        subject,
        course_state: [0, 1, 2, 6]
      })
      StudentSystemStatisticsList.map((item) => {
        item.class_start = item.class_start ? formatData(item.class_start) : ''
        item.class_end = item.class_end ? formatData(item.class_end) : ''
        item.stop_end_time = item.stop_end_time
          ? formatData(item.stop_end_time)
          : ''
      })
      this.packageSysTeamList(StudentSystemStatisticsList)
      return StudentSystemStatisticsList
    },
    // 体验课包装
    packageTrialTeamList(list = []) {
      list.forEach((team) => {
        const {
          // orderInfo = {},
          teacherInfo = {},
          expressstatus = -1,
          course_state: teamstate,
          managementInfo
          // teacherInfo: trialTeacher = {}
        } = team
        team.last_join_time = formatDateByType(+team.last_join_time, '-', 'MS')
        team.last_complete_time = formatDateByType(
          +team.last_complete_time,
          '-',
          'MS'
        )
        team.buytime = formatDateByType(+team.buytime, '/', 'M')
        team.expressstatus = this.expressstatus[String(expressstatus)]
        team.teamStatusCH = this.trialStatusVal[teamstate]
        team.addedWechat = team.added_wechat || 0
        team.addedGroup = team.added_group || 0

        if (teacherInfo) {
          teacherInfo.allDeptName = this.getDeptNameRecursion(
            teacherInfo.departmentInfo || {}
          ).join('/')
        } else {
          team.teacherInfo = {}
        }
        if (managementInfo) {
          const {
            course_day: courseDay = 0,
            end_course_day: endCourseDay = 0
          } = managementInfo

          managementInfo.course_day = formatDateByType(+courseDay, '/', 'Y')
          managementInfo.end_course_day = formatDateByType(
            +endCourseDay,
            '/',
            'Y'
          )
        } else {
          team.managementInfo = {}
        }
        team.courseTime = team.managementInfo
      })
    },
    // 系统课包装
    packageSysTeamList(team = []) {
      team.forEach((team) => {
        const {
          orderInfo = {},
          teacherInfo = {},
          expressstatus = -1,
          course_state: courseState,
          currentlesson = '',
          currentlevel = '',
          currentsuper = '',
          currentunit = '',
          end_course_day: endCourseDay = '',
          course_day: courseDay = '',
          remaining_week: remainingWeek
        } = team

        if (remainingWeek) {
          this.allSysRemainingWeeks += +remainingWeek
        }
        team.sortCountDesc = this.courseStateSort(courseState)
        team.buytime =
          orderInfo && formatDateByType(+orderInfo.buytime, '/', 'M')
        team.current_lesson = `${currentsuper}${currentlevel}${currentunit}${currentlesson}`
        team.last_join_time = formatDateByType(+team.last_join_time, '-', 'MS')
        team.last_complete_time = formatDateByType(
          +team.last_complete_time,
          '-',
          'MS'
        )
        team.ctime = formatDateByType(+team.ctime, '/', 'M')
        team.expressstatus = this.expressstatus[String(expressstatus)]
        team.teamStatusCH = this.systemStatusKeyVal[courseState] || '未开始'
        team.addedWechat = team.addedwechat || 0
        team.addedGroup = team.addedgroup || 0

        // 系统课老师信息
        if (teacherInfo) {
          teacherInfo.allDeptName = this.getDeptNameRecursion(
            teacherInfo.departmentInfo || {}
          ).join('/')
        } else {
          team.teacherInfo = {}
        }
        team.courseTime = {
          course_day: formatDateByType(+courseDay, '/', 'Y'),
          end_course_day: formatDateByType(+endCourseDay, '/', 'Y')
        }

        team.isSystemTeam = 1
      })
    },
    getDeptNameRecursion(deptInfo = {}, arr = []) {
      if (deptInfo.name) arr.push(deptInfo.name)

      const pDeptInfo = deptInfo.parentDepartmentInfo
      if (pDeptInfo && pDeptInfo.name !== null) {
        this.getDeptNameRecursion(pDeptInfo, arr)
      }
      return arr
    },
    sysTemSortTeamList(list = []) {
      return sortBy(list, (item) => {
        return -item.sortCountDesc
      })
    },
    // 按 上课中>待开课>已退费>已结课 规则排序 2>1>5>6 // 2:99; 1:98; 5:97; 6:96
    courseStateSort(courseState) {
      if (!courseState) return 0
      const obj = {
        2: 99,
        1: 98,
        5: 97,
        6: 96
      }
      return obj[courseState]
    },
    // 获取艾克之外的标签
    async getlabelWithoutAike() {
      console.log('studentId', this.studentId)
      const { code, payload } = await this.$http.User.listLabelsForUser(
        this.studentId
      ).catch((err) => {
        this.$message.error('标签获取失败')
        console.error(err)
      })
      if (!code && payload && payload.length) {
        this.babels_lk = payload
      }
    },
    // 学员信息
    getUserInfo() {
      this.$http.User.getUser(this.studentId).then((res = {}) => {
        const { data: { User = {} } = {} } = res
        User.statusCH = User.status ? USER_FLLOW_UP[User.status] : ''

        // ②-1课程名称格式化 0:体验课   >0:系统课
        if (User.teams && User.teams.length) {
          User.teams.forEach((item) => {
            if (item.team_type === '0') {
              item.team_type_formatting = '体验课'
            } else {
              item.team_type_formatting = '系统课'
            }
          })
        }
        console.log(res, 'userinfo---------------------------')
        this.stuInfor = User
        // ②-2给各个组件传基础数据
        this.$root.$emit('study', User.teams, User.zero_teamid_write_trials) // 学习记录+0元体验课
        this.$root.$emit('portfolio', User.teams, User.zero_teamid_write_trials) // 作品集+0元体验课
      })
    },
    // 数据接口_学员信息分类补充
    UserExtends() {
      this.$http.User.getUser_add({
        u_id: this.studentId,
        subject: this.changeSubject
      }).then((res = {}) => {
        // ①学员基本资料_分类补充_赋值
        const { data: { UserExtends = {} } = {} } = res
        const {
          username,
          user_num: userNum,
          lastBehaviorLog,
          accountUserCollect = [],
          accountUserStoneCollect = []
          // lesson_sl: LS
        } = UserExtends
        // UserExtends.lesson_sl = LS.map((l) => courseLevelReplace(l))
        this.stuInfor_add = UserExtends ? this.modifyData(UserExtends) : {}
        // 用户资产
        // this.bearCoin = accountUserCollect
        // 小熊币
        this.calcCoinAndDiamond(accountUserCollect, this.coinNumList)
        // 砖石
        this.calcCoinAndDiamond(accountUserStoneCollect, this.diamondNumList)
        if (lastBehaviorLog) {
          const { action_time: aTime } = lastBehaviorLog

          lastBehaviorLog.action_time = aTime
            ? formatDateByType(+aTime, '-', 'MS')
            : ''
        }

        this.$root.$emit('stuInfoSystem', this.stuInfor_add)
        // ②设置 title
        document.title.startsWith('学员中心') &&
          (document.title = `${username + '·' + userNum}-小熊美术TOSS`)
        document.title.indexOf('写字') !== -1 &&
          (document.title = `${username + '·' + userNum}-美术宝写字TOSS`)
      })
    },
    // 工具函数_时间格式化
    modifyData(data) {
      // 年龄格式化
      data.age = data.birthday !== '0' ? GetAgeByBrithday(data.birthday) : '-'
      // 生日格式化
      data.birthday = data.birthday ? formatData(data.birthday * 1000) : '-'
      // 注册时间格式化
      data.join_date = data.join_date ? formatDate(+data.join_date) : '-'
      return data
    },

    // 审批5项跳转
    queryJump(commandlk) {
      this.$message(commandlk + '去')
      const cellphone = this.stuInfor_add.mobile
      const obj = {
        退款: `/approval/#/moneyBack?cellphone=${cellphone}`,
        补发货: `/approval/#/repair?cellphone=${cellphone}`,
        调班: `/approval/#/approvalCenter/adjust?adjustType=3&cellphone=${cellphone}`,
        调级: `/approval/#/approvalCenter/adjust?adjustType=2&cellphone=${cellphone}`,
        调期: `/approval/#/approvalCenter/adjust?adjustType=1&cellphone=${cellphone}`
      }
      // location.href = obj[commandlk]
      window.open(obj[commandlk])
    },

    hasEditAddress(res = false) {
      console.log('hasEditAddress', res)
      if (res) {
        this.getUserInfo()
        this.UserExtends()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-tabs.parent-tabs > div:nth-of-type(1) {
  margin-bottom: 0 !important;
  padding: 0 10px;
  border-bottom: 8px solid #eee;
}
/deep/ .el-loading-mask {
  font-size: 20px;
}
.d-flex {
  display: flex;
  align-items: center;
}
.details-body {
  height: calc(100vh - 70px);
  margin: 0 10px 10px 10px;
  overflow: auto;
  position: relative;
  background: #fff;
}
.asset-header {
  display: flex;
  justify-content: space-between;
  height: 38px;
  border-top: 8px solid #eee;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  width: 100%;
  padding: 0 10px;
  font-size: 12px;
  & > div {
    display: flex;
  }
  .module {
    &:not(:last-of-type) {
      margin-right: 15px;
    }
    & > i {
      margin-right: 5px;
    }
  }
  .asset {
  }
  .course-base {
  }
}
.call-phone {
  position: relative;
}
//head
.header {
  background-color: #fff;
  // height: 50px;
  padding: 10px;
  border-bottom: 10px solid #eee;
  .course-info {
    // margin: 15px 0 0 10px;
    margin-left: 10px;
    height: 35px;
    .tag-setting {
      margin-right: 15px;
    }
  }
}

.tab-sty {
  background: #fff;
  // padding: 0 10px;
}

.img-box {
  height: 50px;
  width: 50px;
  position: relative;
  .head-portrait {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    /deep/ .el-image-viewer__canvas img {
      transform: scale(0.8) rotate(0deg) !important;
    }
    /deep/ .el-icon-circle-close {
      color: #fff !important;
    }
    // /deep/ el-image-viewer__btn.el-image-viewer__close {
    //   color: #fff !important;
    // }
  }
  i {
    position: absolute;
    bottom: 0px;
    right: 0px;
    display: block;
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 100%;
    overflow: hidden;
    color: #fff;
    text-align: center;
  }
  .male {
    background-color: #369bff;
  }
  .female {
    background-color: #f23589;
  }
}
.lk-icon {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #bfbfbf;
  fill: currentColor;
}
.lk-icon-green {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #42b983;
  fill: currentColor;
}
.upset_24col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  &.flex-end {
    padding-right: 10px;
    justify-content: flex-end;
  }
  > div {
    margin: 0 5px;
  }
}
.el-elment-lk {
  vertical-align: middle;
  font-size: 20px;
  color: #aaa;
}

// belly
.belly {
  margin: 10px 0;
}

.dular {
  // overflow: auto;
  height: 420px;
  background-color: #fff;
  // padding: 10px;
  ::v-deep {
    .el-row {
      line-height: 24px;
    }
    .el-col {
      > span:first-child {
        display: inline-block;
        width: 65px;
        color: #aeaeae;
      }
    }
  }
}
.dular:nth-last-of-type(1) {
  margin-left: 10px;
}
.padding-top20 {
  padding-top: 20px;
}
.padding-top20:nth-of-type(1) {
  padding-top: 10px;
}
.setou123 {
  padding: 10px 15px;
  span {
    vertical-align: middle;
    font-size: 14px;
  }
  strong {
    vertical-align: middle;
    background-color: #49a3ff;
    display: inline-block;
    margin-right: 5px;
    width: 2px;
    height: 14px;
    // transform: rotate(90deg);
  }
}
.el-divider {
  margin: 8px 0px;
}
.el-divider__text {
  color: #30313359;
}

.head-portrait_small {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.colorposition {
  color: #49a3ff;
}
.textonline {
  color: #2a75ed;
  text-decoration: underline;
}
.tccc {
  color: #aaa;
}
.gengbo {
  padding: 0px 16px;
  font-size: 14px;
  color: #aaa;
}
</style>

<style lang="scss" scoped>
// 老物件
// /deep/.el-tabs__content {
//   padding: 8px;
// }

// 课程tab+统计
.course-sty {
  background-color: #fff;
  .statistical {
    div {
      float: left;
      span {
        color: #aeaeae;
      }
    }
  }
  .class-statistical {
    margin: 0 15px 0 0;
    float: left;
    margin: 0 0 0 25px;
    .tatistical-span {
      color: #5ea0f5;
    }
  }
}
</style>
