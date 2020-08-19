<template>
  <section class="details-body">
    <el-scrollbar>
      <!-- 头部 -->
      <el-row type="flex" justify="start" align="middle" class="header">
        <el-col>
          <div class="upset_24col">
            <!-- 男：1 女：2 -->
            <div class="img-box">
              <img class="head-portrait" :src="stuInfor.head || defaultHead" />
              <i v-if="stuInfor.sex === '2'" class="female el-icon-female " />
              <i v-else-if="stuInfor.sex === '1'" class="male el-icon-male" />
              <i v-else class="el-icon-toilet-paper" />
            </div>
            <div>
              {{ stuInfor.username || '-' }}
              ·
              {{ stuInfor.user_num || '-' }}
            </div>
            <!-- 只有'1'是关注了-->
            <div>
              <svg
                v-if="stuInfor.weixinUser && stuInfor.weixinUser.follow === '1'"
                class="lk-icon-green"
                aria-hidden="true"
              >
                <use xlink:href="#icongongzhonghao"></use>
              </svg>
              <svg v-else class="lk-icon" aria-hidden="true">
                <use xlink:href="#icongongzhonghao"></use>
              </svg>
            </div>
            <div>
              <span class="tccc">区域:</span>
              {{ stuInfor.mobile_province || '-' }}
              · {{ stuInfor.mobile_city || '-' }}
            </div>
            <div>
              <span class="tccc">年龄:</span>
              {{ stuInfor.age }}
            </div>
            <div>
              <span class="tccc">生日:</span>
              {{ stuInfor.birthday }}
            </div>
            <div>
              <span class="tccc">优惠券:</span>
              <b
                style="cursor:pointer"
                class="textonline"
                @click="jumpToAsset(1)"
              >
                {{ stuInfor.coupon && stuInfor.coupon.length }}
              </b>
            </div>
            <div>
              <span class="tccc">小熊币:</span>
              <b
                style="cursor:pointer"
                class="textonline"
                @click="jumpToAsset(2)"
              >
                {{
                  stuInfor.account &&
                  stuInfor.account[0] &&
                  stuInfor.account[0].balance
                    ? stuInfor.account[0].balance
                    : 0
                }}
              </b>
            </div>
            <div>
              <i
                style="cursor:pointer"
                class="el-icon-location-outline colorposition el-elment-lk"
                @click="$refs.showAddress.showAddress = true"
              />
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="upset_24col flex-end">
            <!-- <el-button size="mini" type="primary" @click="couponList"
              >发优惠券</el-button
            > -->
            <el-dropdown
              type="primary"
              split-button
              size="mini"
              @click="
                $message({
                  message: '右边选择审批类型',
                  type: 'warning'
                })
              "
              @command="queryJump"
            >
              发起审批
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) of [
                    '退款',
                    '补发货',
                    '调班',
                    '调级',
                    '调期'
                  ]"
                  :key="index"
                  :command="item"
                  >{{ item }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
      <!-- 大肚腩 -->
      <el-row type="flex" justify="start" align="middle" class="belly">
        <el-col :span="17" class="dular">
          <!-- 用户资料 -->
          <div class="padding-top20">
            <section class="setou123">
              <strong></strong>
              <span>用户资料</span>
            </section>
            <section style="margin-top:15px">
              <div class="gengbo">
                <span>基本信息</span>
                <el-divider></el-divider>
              </div>
              <el-row
                type="flex"
                justify="space-around"
                align="middle"
                style="margin-top:15px"
              >
                <el-col :span="7">
                  <span>手机号码:</span> {{ stuInfor.mobile || '-' }}
                </el-col>
                <el-col :span="7">
                  <span>推荐信息:</span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="$refs.recommend.recommendInfo = true"
                  >
                    详情
                  </el-button></el-col
                >
                <el-col :span="7">
                  <span>注册时间:</span>
                  {{ stuInfor.join_date }}
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-around" align="middle">
                <el-col :span="7">
                  <span>注册渠道:</span>
                  {{
                    stuInfor.channelInfo &&
                      (stuInfor.channelInfo.channel_inner_name || '-')
                  }}</el-col
                >
                <el-col :span="7">
                  <span>用户状态:</span>
                  <el-tag type="danger" size="mini">{{
                    stuInfor.status_text || '-'
                  }}</el-tag></el-col
                >

                <el-col :span="7">
                  <span>最近活跃:</span>
                  {{
                    stuInfor.loginData &&
                      stuInfor.loginData[0] &&
                      (stuInfor.loginData[0].device_model || '-')
                  }}
                  {{
                    stuInfor.loginData &&
                      stuInfor.loginData[0] &&
                      (stuInfor.loginData[0].login_time
                        ? new Date(
                            Number(stuInfor.loginData[0].login_time)
                          ).toLocaleDateString()
                        : '-')
                  }}
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-around" align="middle">
                <el-col :span="7">
                  <span>系统课剩余:</span>
                  {{ systemCourseTotal + '周' }}</el-col
                >
                <el-col :span="7">
                  <span>生命周期:</span>
                  <el-tag type="success" size="mini">{{
                    stuInfor.systemCourse_lifeCycle || '-'
                  }}</el-tag>
                </el-col>
                <el-col :span="7"></el-col>
              </el-row>
            </section>
            <section style="margin-top:20px">
              <div class="gengbo">
                <span>用户微信</span>
                <el-divider></el-divider>
              </div>
              <!-- 双编剧塌陷现场-BFC -->
              <el-row
                style="margin-top:15px"
                type="flex"
                justify="space-around"
                align="middle"
              >
                <el-col :span="7" style="vertical-align:middle">
                  <span>微信昵称:</span>
                  <img
                    style="vertical-align:middle"
                    class="head-portrait_small"
                    :src="
                      (stuInfor.jluserInfo && stuInfor.jluserInfo.avatar) ||
                        defaultHead
                    "
                  />
                  {{
                    stuInfor.jluserInfo
                      ? stuInfor.jluserInfo.nick_name || '-'
                      : '-'
                  }}
                </el-col>
                <el-col :span="7">
                  <span>微信号:</span>
                  {{
                    stuInfor.jluserInfo
                      ? stuInfor.jluserInfo.wechat_no || '-'
                      : '-'
                  }}
                </el-col>
                <el-col :span="7">
                  <span>微信备注:</span>
                  {{
                    stuInfor.jluserInfo
                      ? stuInfor.jluserInfo.remark || '-'
                      : '-'
                  }}
                </el-col>
              </el-row>
            </section>
          </div>
          <div class="padding-top20">
            <section class="setou123">
              <strong></strong>
              <span>用户标签</span>
              <span style="color:#ccc;font-size:14px">(包含微信标签)</span>
            </section>
            <section v-if="!babels_lk.length && !aikelabel.length">
              <el-row type="flex" justify="space-around" align="middle">
                <el-col :span="7" style="color:#ccc">
                  暂无标签
                </el-col>
                <el-col :span="7"></el-col>
                <el-col :span="7"></el-col>
              </el-row>
            </section>
            <section style="padding-left:15px" v-else>
              <el-tag
                style="margin-right:10px"
                type="sucess"
                size="mini"
                v-for="item of aikelabel"
                :key="item"
                >{{ item }}</el-tag
              >
              <span v-if="babels_lk && babels_lk.length && babels_lk[0].name">
                <el-tag
                  style="margin-right:10px"
                  type="warning"
                  size="small"
                  v-for="item of babels_lk"
                  :key="item.id"
                  >{{ item.name }}</el-tag
                >
              </span>
            </section>
          </div>
          <!-- <div class="padding-top20">
            <section class="setou123">
              <strong></strong>
              <span>用户群组</span>
            </section>
            <section>
              <el-row type="flex" justify="space-around" align="middle">
                <el-col :span="7" style="color:#ccc">
                  暂无群组
                </el-col>
                <el-col :span="7"></el-col>
                <el-col :span="7"></el-col>
              </el-row>
            </section>
          </div> -->
        </el-col>
        <el-col :span="7" class="dular">
          <!-- 跟进记录 -->
          <trackFlow />
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <div class="tab-sty">
        <el-tabs type="border-card" v-model="tabData" @tab-click="tabBtn">
          <el-tab-pane label="详细信息" name="detailsInfo">
            <detailsInfo />
          </el-tab-pane>
          <el-tab-pane label="学习记录" name="learningRecord"></el-tab-pane>
          <el-tab-pane label="作品集" name="collectionOf"></el-tab-pane>
          <el-tab-pane
            label="订单·物流记录"
            name="orderLogistics"
          ></el-tab-pane>
          <el-tab-pane label="用户资产" name="userAsset"></el-tab-pane>
          <el-tab-pane label="通知事件记录" name="notifyRecord"></el-tab-pane>
          <el-tab-pane label="转介绍" name="changeRecommend">
            <changeRecommend />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 夹在中间的学习记录,作品集 -->
      <div
        class="course-sty"
        v-if="['learningRecord', 'collectionOf'].includes(tabData)"
      >
        <el-tabs v-model="courseData" @tab-click="courseBtn">
          <el-tab-pane
            v-for="(item, key) in stuInfor.teams"
            :key="key"
            :label="`${item.team_type_formatting}:${item.team_name}`"
            :name="item.id"
          >
            <!-- 公用部分 -->
            <div class="statistical">
              <div>
                <span>社群销售</span>:
                {{ item.teacher_info && item.teacher_info.realname }}
              </div>
              <div>
                <span>微信昵称</span>:
                {{ item.teacher_info && item.teacher_info.nickname }}
              </div>
              <div>
                <span>微信号</span>:
                {{
                  item.teacher_wechat_info && item.teacher_wechat_info.wechat_no
                }}
              </div>
            </div>
            <!-- 学习记录特有 -->
            <div
              class="statistical class-statistical"
              v-if="tabData === 'learningRecord'"
            >
              <div>
                <span>已放课</span>:
                <span class="tatistical-span">
                  {{ item.send_course_count }}
                </span>
              </div>
              <div>
                <span>当日参课</span>:
                <span class="tatistical-span">
                  {{ item.day_join_course_count }}
                </span>
              </div>
              <div>
                <span>当日完课</span>:
                <span class="tatistical-span">
                  {{ item.day_complete_course_count }}
                </span>
              </div>
            </div>
            <!-- 作品集特有 -->
            <div
              class="statistical class-statistical"
              v-if="tabData === 'collectionOf'"
            >
              <div>
                <span>作品总数</span>:
                <span class="tatistical-span">{{
                  item.course_task_count
                }}</span>
              </div>
              <div>
                <span>收到点评</span>:
                <span class="tatistical-span">
                  {{ item.task_comment_count }}
                </span>
              </div>
              <div>
                <span>已听点评</span>:
                <span class="tatistical-span">
                  {{ item.listen_comment_count }}
                </span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- tab列表 -->
      <details-list
        ref="detailsList"
        :tabData="tabData"
        :tabList="tabList"
        :wholeData="wholeData"
        :wholeSecondData="wholeSecondData"
        @ivrBubbleData="ivrBubbleData"
        @changePagenation="changePagenation"
        @couponSendSucc="couponSendSucc"
      />
      <!-- 分页组件 -->
      <m-pagination
        v-if="
          [
            'learningRecord',
            'collectionOf',
            'orderLogistics',
            'notifyRecord'
          ].includes(tabData)
        "
        :current-page="currentPage"
        :page-count="totalPages"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px)"
        close="calc(100vw - 50px - 25px)"
      ></m-pagination>
    </el-scrollbar>
    <!-- 修改地址 -->
    <el-dialog
      width="500px"
      title="修改收货信息"
      :visible.sync="dialogTableVisible"
    >
      <modifyAddress
        :modifyFormData="stuInfor"
        @modifyAddressExpress="modifyAddressExpress"
      />
    </el-dialog>
    <!-- 地址弹窗 -->
    <showAddress
      :addressData="(stuInfor.address && stuInfor.address[0]) || {}"
      ref="showAddress"
      @changeAddress="dialogTableVisible = true"
    />
    <!-- 推荐弹窗 -->
    <recommend
      ref="recommend"
      :recommendHuman="
        stuInfor.sender
          ? stuInfor.sender
          : { username: '', user_num: '', id: '' }
      "
    />

    <!-- 被迫弹窗发券引到这里-->
    <!-- <coupon-popover
      ref="couponPopover"
      :couponData="couponData"
      :selectUserId="[studentId]"
    /> -->
  </section>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'
import detailsInfo from './detailsInfo/index.vue'
import changeRecommend from './changeRecommend/index.vue'
import recommend from './recommendComponents/recommend.vue'
import showAddress from './addressComponents/showAddress.vue'
import trackFlow from './trackFlow/index'
import MPagination from '@/components/MPagination/index.vue'
import DetailsList from './list.vue'
import { GetAgeByBrithday, formatData, openBrowserTab } from '@/utils/index'
import modifyAddress from './addressComponents/modifyAddress.vue'
// import CouponPopover from '@/pages/studentTeam/components/TabPane/components/couponPopover'

export default {
  components: {
    detailsInfo,
    changeRecommend,
    recommend,
    DetailsList,
    MPagination,
    modifyAddress,
    showAddress,
    // CouponPopover,
    trackFlow
  },
  data() {
    return {
      dialogTableVisible: false, // 修改地址弹窗组件
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      studentId: '', // 该学员id
      sendId: '0', // 推荐人id
      aFold: true, // 展开收起
      stuInfor: {
        address: [{}],
        sender: { username: '' },
        jluserInfo: {},
        teams: []
      }, // 学员基本信息(timeFormatted)
      babels_lk: [], // 学员标签(非艾克的全部4项)
      tabData: 'detailsInfo', // paneltab name
      tabList: [], // 学习记录,作品集,订单物流记录table数据list
      wholeData: {}, // 用户资产_优惠券_全套数据 '或' 通知事件记录_全套数据
      wholeSecondData: {}, // 用户资产_小熊币_全套数据

      courseData: '', // 学习记录-作品集-tab选中课程id
      lessonType: '', // 学习记录-作品集-tab选中课程类型(0是体验,1是系统)
      courseIndex: 0, // stuInfor.steams全部课程中,展示优先级最高课程的下标(受其影响:学习记录-作品集-tab选中课程)
      // couponData: [], // 被迫引进发券组件需要的couponlist
      loading: false, // loading
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
    }
  },
  computed: {
    aikelabel() {
      return (
        (this.stuInfor &&
          this.stuInfor.jluserInfo &&
          this.stuInfor.jluserInfo.labels &&
          JSON.parse(this.stuInfor.jluserInfo.labels)) ||
        []
      )
    },
    systemCourseTotal() {
      return this.stuInfor.systemCourse.length
        ? this.stuInfor.systemCourse.reduce((pre, cur, index, arr) => {
            return pre + cur.remaining_week
          }, 0)
        : '-'
    }
  },
  created() {
    this.studentId = this.$route.params.id
    // 学员信息接口
    this.reqUser()
    this.getlabelWithoutAike()
    // lk这里toss有两个特有的潘建+春晖↓↓
    // this.getListLabelsForUser()
    // this.initTeacherInfo()
  },
  methods: {
    // 获取艾克之外的标签
    async getlabelWithoutAike() {
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

    // 审批5项跳转
    queryJump(commandlk) {
      this.$message(commandlk + '去')
      const cellphone = this.stuInfor.mobile
      const obj = {
        退款: `/approval/#/moneyBack?cellphone=${cellphone}`,
        补发货: `/approval/#/repair?cellphone=${cellphone}`,
        调班: `/approval/#/approvalCenter/adjust?adjustType=3&cellphone=${cellphone}`,
        调级: `/approval/#/approvalCenter/adjust?adjustType=2&cellphone=${cellphone}`,
        调期: `/approval/#/approvalCenter/adjust?adjustType=1&cellphone=${cellphone}`
      }
      // this.$router.push(obj[commandlk])
      location.href = obj[commandlk]
    },
    // 给被迫引用发券组件拿couponlist
    // couponList() {
    //   this.$http.Team.getAllCoupons(0).then((res) => {
    //     this.couponData = (res.payload && res.payload.content) || []
    //     this.$refs.couponPopover.issueCoupons = true
    //   })
    // },
    // 数据接口_学员信息
    reqUser() {
      this.$http.User.getUser(this.studentId).then((res) => {
        console.log('学员基本信息', res, res.data.User)

        // ①推荐人id 可跳转
        this.sendId =
          res.data.User && res.data.User.send_id ? res.data.User.send_id : '0'

        // ②学习记录/作品集-tab第1条课程
        const teamData =
          res.data.User && res.data.User.teams && res.data.User.teams.length > 0
            ? res.data.User.teams[0]
            : { id: '', team_type: '' }
        // ②学习记录/作品集-把tab第1条课程当做默认选中项 ——id及类型
        this.courseData = teamData.id
        this.lessonType = teamData.team_type - 0 > 0 ? 1 : 0

        // ③学员基本资料_时间格式ed
        this.stuInfor = this.modifyData(res.data.User || {})
        // 设置 title
        document.title.startsWith('学员中心') &&
          (document.title = `${this.stuInfor.username +
            '·' +
            this.stuInfor.user_num}-小熊美术BOSS`)
        if (typeof this.stuInfor.systemCourse_lifeCycle === 'string') {
          this.stuInfor.systemCourse_lifeCycle = {
            0: '待开课',
            1: '开课中',
            2: '已结课',
            91: '已退费'
          }[this.stuInfor.systemCourse_lifeCycle]
        }
        this.loading = false

        // ④整合stuInfor里所有课程teams 添加字段isRefund(1退费,0正常)
        this.checkBack()

        // ⑤学习记录和作品集 能自己切换班级 所以他俩不用排优先级
        // ⑤tag页签展示优先级
        if (
          !(
            this.tabData === 'learningRecord' || this.tabData === 'collectionOf'
          ) &&
          this.stuInfor.teams.length
        ) {
          this.tagsPriorityLevel()
        }

        // ⑥取5个tab数据
        if (this.tabData === 'learningRecord') {
          // 学习记录接口
          this.reqSendCourseLogPage(teamData.id)
        } else if (this.tabData === 'collectionOf') {
          // 作品集接口
          this.reqStudentCourseTaskPage(teamData.id)
        } else if (this.tabData === 'orderLogistics') {
          // 订单·物流数据接口
          this.reqgetOrderPage()
        } else if (this.tabData === 'userAsset') {
          // 用户资产接口
          this.reqGetUserAssets()
        } else if (this.tabData === 'notifyRecord') {
          // 通知事件记录接口
          this.reqNotifyPage()
        }
      })
    },
    // 数据接口_学习记录
    reqSendCourseLogPage(id) {
      this.$http.User.getSendCourseLogPage(
        this.studentId,
        id, // 课程ID
        this.currentPage,
        this.lessonType // 课程类型
      ).then((res) => {
        console.log('学习记录接口', res, res.data.SendCourseLogPage.content)
        this.tabList = [] // 赋值前清空
        const _data = res.data.SendCourseLogPage.content
        _data.forEach((item) => {
          // 课程计划时间
          item.ctime = item.ctime ? formatData(item.ctime, 's') : '-'
          if (item.studentCompleteCourseLog) {
            // 参课时间
            if (item.studentCompleteCourseLog.ctime) {
              item.studentCompleteCourseLog.ctime = formatData(
                item.studentCompleteCourseLog.ctime,
                's'
              )
            }
            // 完课时间
            if (item.studentCompleteCourseLog.complete_time) {
              item.studentCompleteCourseLog.complete_time = formatData(
                item.studentCompleteCourseLog.complete_time,
                's'
              )
            }
          }
        })
        this.totalPages = +res.data.SendCourseLogPage.totalPages
        this.totalElements = +res.data.SendCourseLogPage.totalElements
        this.tabList = _data // 赋值
      })
    },
    // 数据接口_作品集
    reqStudentCourseTaskPage(id) {
      this.$http.User.getStudentCourseTaskPage(
        this.studentId,
        id, // 课程ID
        this.currentPage
      ).then((res) => {
        // console.log('作品集', res.data.StudentCourseTaskPage.content)
        this.tabList = [] // 赋值前清空
        const _data = res.data.StudentCourseTaskPage.content
        _data.forEach((item, index) => {
          item.serNum = ++index
          // if (item.taskComment && item.taskComment.ctime) {
          //   item.taskComment.ctime = formatData(item.taskComment.ctime, 's')
          // }
          if (item.taskComment && item.taskComment.length) {
            item.taskComment.forEach((tItem) => {
              tItem.ctime = formatData(tItem.ctime, 's')
              for (let i = 0, len = item.listenComment.length; i < len; i++) {
                if (item.listenComment[i].flag_id === tItem.id) {
                  tItem.hadListened = true
                  break
                }
              }
            })
          }
          item.ctime = item.ctime ? formatData(item.ctime, 's') : ''
        })
        this.totalPages = +res.data.StudentCourseTaskPage.totalPages
        this.totalElements = +res.data.StudentCourseTaskPage.totalElements
        this.tabList = _data // 赋值
      })
    },
    // 数据接口_订单·物流
    reqgetOrderPage() {
      this.$http.User.getOrderPage(this.studentId, this.currentPage).then(
        (res) => {
          // console.log('订单·物流数据接口', res)
          this.tabList = []
          const _data = res.data.OrderPage.content
          _data.forEach((item) => {
            item.ctime = item.ctime ? formatData(item.ctime, 's') : ''
          })
          this.totalPages = +res.data.OrderPage.totalPages

          this.totalElements = +res.data.OrderPage.totalElements

          this.tabList = _data
        }
      )
    },
    // 数据接口_用户资产_优惠券(取不取小熊币由currentPage传参决定 不传就取)
    reqGetUserAssets(currentPage) {
      this.$http.User.getUserAssetsCoupon(this.studentId, currentPage || 1)
        .then((res) => {
          // 增加俩个字段
          // couponUserCollect: 取自stuInfor,用于显示用户资产_优惠券中间层
          // userId:取自stuInfor,表示该学员id
          this.wholeData = res.data
          this.wholeData.couponUserCollect = this.stuInfor.couponUserCollect
          this.wholeData.userId = this.stuInfor.id
          if (!currentPage) {
            this.reqGetUserCoin()
          }
        })
        .catch(() => {
          this.$message.error('获取用户资产_优惠券_失败')
        })
    },
    // 数据接口_用户资产_小熊币
    reqGetUserCoin(currentPage) {
      this.$http.User.getUserAssetsCoin(this.studentId, currentPage || 1)
        .then((res) => {
          // 增加1个字段
          // accountUserCollect:取自stuInfor,用于显示用户资产_小熊币中间层
          this.wholeSecondData = res.data
          this.wholeSecondData.accountUserCollect = this.stuInfor.accountUserCollect
        })
        .catch(() => {
          this.$message.error('获取用户资产_小熊币_失败')
        })
    },
    // 数据接口_通知事件记录
    reqNotifyPage(data) {
      const query = {
        userId: this.studentId,
        pageSize: 20,
        pageNum: this.currentPage - 1,
        sjstime: '',
        ejstime: '',
        cdrStatus: '',
        stime: '',
        etime: ''
      }
      Object.assign(query, data)
      this.$http.User.getNotifyPage(query)
        .then((res) => {
          // console.log(res)
          if (res.code === 0 && res.status === 'OK') {
            // 增加1个字段
            // studentId:表示该学员id
            this.wholeData = res
            this.wholeData.studentId = this.studentId
            this.totalPages = +res.payload.totalPages
            this.totalElements = +res.payload.totalElements
          } else {
            this.$message.warn('获取用户通知事件记录失败')
          }
        })
        .catch(() => {
          this.$message.error('获取用户通知事件记录失败')
        })
    },

    // 修改地址子组件传来的数据✔️
    modifyAddressExpress() {
      this.dialogTableVisible = false
      this.reqUser()
    },
    // 打开地址子组件弹窗✔️
    onUpdataAddress() {
      this.dialogTableVisible = true
    },
    // 工具函数_时间格式化✔️
    modifyData(data) {
      // 年龄格式化
      data.age = data.birthday !== '0' ? GetAgeByBrithday(data.birthday) : '-'
      // 生日格式化
      data.birthday = data.birthday ? formatData(data.birthday * 1000) : '-'
      // 注册时间格式化
      data.join_date = data.join_date ? formatDate(+data.join_date) : '-'
      // 课程名称格式化 0:体验课   >0:系统课
      data.teams &&
        data.teams.length > 0 &&
        data.teams.forEach((item) => {
          if (item.team_type === '0') {
            item.team_type_formatting = '体验课'
          } else {
            item.team_type_formatting = '系统课'
          }
        })
      return data
    },
    // 功能函数-标识已退费✔️['isrefund' 再报错我吃了它]
    checkBack() {
      // 把体验课和系统课中的退费状态整合进teams,isrefund=1是退费的
      const map1 = new Map()
      // console.log(this.stuInfor)
      if (
        this.stuInfor.trialCourse &&
        this.stuInfor.trialCourse.team_id &&
        (this.stuInfor.trialCourse.orderInfo.isrefund === 1 ||
          this.stuInfor.trialCourse.orderInfo.isrefund === 0)
      ) {
        map1.set(
          +this.stuInfor.trialCourse.team_id,
          this.stuInfor.trialCourse.orderInfo.isrefund
        ) // [[2205,0],[]]
      }
      if (this.stuInfor.systemCourse && this.stuInfor.systemCourse.length) {
        this.stuInfor.systemCourse.forEach((sItem) => {
          if (
            sItem.team_id &&
            sItem.orderInfo &&
            (sItem.orderInfo.isrefund === 1 || sItem.orderInfo.isrefund === 0)
          )
            map1.set(+sItem.team_id, sItem.orderInfo.isrefund)
        })
      }
      if (map1.size !== 0) {
        this.stuInfor.teams.forEach((tItem) => {
          tItem.isRefund = map1.get(+tItem.id)
        })
      }
    },
    // 功能函数—tag页签展示优先级(多个系统课展示优先级:开课中>待开课>已开课>已退费)✔️
    tagsPriorityLevel() {
      const sortArr = []
      // team_state: 0: 待开课 1:开课中 2:已结课
      for (let i = 0, len = this.stuInfor.teams.length; i < len; i++) {
        const item = this.stuInfor.teams[i]
        if (+item.team_type > 0 && !item.isRefund) {
          // 系统课且没发生退费
          sortArr.push({
            index: i,
            team_state:
              item.team_state - 0 !== 2
                ? item.team_state - 0 + 3
                : item.team_state - 0
          })
        }
      }
      if (!sortArr.length) {
        return
      }
      // 如此,开课中1+3 待开课0+3 已结课2-0(从大到小)
      sortArr.sort(function(a, b) {
        return b.team_state - a.team_state
      })
      // courseIndex标识teams中展示优先级最高课程的下标
      this.courseIndex = sortArr[0].index
    },
    // 点击分页_除去用户资产✔️
    handleSizeChange(page) {
      // console.log(this.page)
      this.currentPage = +page
      if (this.tabData === 'learningRecord') {
        this.reqSendCourseLogPage(this.stuInfor.teams[this.courseIndex].id)
      } else if (this.tabData === 'collectionOf') {
        this.reqStudentCourseTaskPage(this.stuInfor.teams[this.courseIndex].id)
      } else if (this.tabData === 'orderLogistics') {
        this.reqgetOrderPage()
      } else if (this.tabData === 'notifyRecord') {
        this.reqNotifyPage()
      }
    },
    // 5个tab切换 重新走页面的created✔️
    tabBtn(tab, event) {
      this.currentPage = 1
      this.reqUser()
    },
    // 学习记录-作品集中间层 tab切换✔️
    courseBtn(tab, event) {
      // 把teams中展示优先级最高的课程下标,设定为当前选择的课程tab-pane下标[为了联动右上角el-tag]
      this.courseIndex = tab.index
      // 学习记录-作品集选中课程_类型确定[学习记录数据接口参数用这个]
      this.lessonType = this.stuInfor.teams[tab.index].team_type > 0 ? 1 : 0
      // 传选中的课程id 发起请求
      if (this.tabData === 'learningRecord') {
        this.reqSendCourseLogPage(this.stuInfor.teams[tab.index].id)
      } else if (this.tabData === 'collectionOf') {
        this.reqStudentCourseTaskPage(this.stuInfor.teams[tab.index].id)
      }
    },
    // 子组件传值_春晖_用户资产_独立分页的锅✔️
    changePagenation(data) {
      if (data.curPane === 'coupon') {
        // 获取用户资产_优惠券对应页
        this.reqGetUserAssets(data.page)
      } else if (data.curPane === 'coin') {
        // 获取用户资产_小熊币对应页
        this.reqGetUserCoin(data.page)
      }
    },
    // 子组件传值_春晖_用户资产_优惠券发放成功✔️
    couponSendSucc() {
      // 重新获取用户全部资产
      this.reqGetUserAssets()
    },
    // 子组件传值_通知事件记录✔️
    ivrBubbleData(data) {
      // 添加参数data 重新获取通知事件记录
      this.reqNotifyPage(data)
    },
    // 资产二级跳(优惠券+小熊币)
    jumpToAsset(type) {
      this.tabData = 'userAsset'
      this.tagsPriorityLevel() // 调这个标签展示优先级,让其默认选择最高课程的el-tag【一旦用户自己切学习记录、作品集的课程,最高优先级就是该课程】
      this.reqGetUserAssets() // 不传参数就取全部资产:优惠券+小熊币
      setTimeout(() => {
        if (type === 1) {
          this.$refs.detailsList.jumpToCoin('assetCoupon')
        } else if (type === 2) {
          this.$refs.detailsList.jumpToCoin('assetBearCoin')
        }
      }, 0)
    },
    // 点击推荐人✔️
    refereesBtn() {
      console.log('推荐人')
      // const { username, mobile } = this.stuInfor.sender
      this.sendId && openBrowserTab(`/users/#/details/${this.sendId}`)
      // this.$router.push({ path: '/details', query: { id: '123' } })
    },
    // 收起✔️
    packUp() {
      this.aFold = false
    },
    // 展开✔️
    openThe() {
      this.aFold = true
    }
  }
}
</script>
<style lang="scss" scoped>
.details-body {
  width: 100%;
  height: calc(100vh - 90px);
  margin: 10px 10px 0px;
  font-size: 12px;
  overflow: auto;
}
//head
.header {
  background-color: #fff;
  height: 50px;
  padding-right: 10px;
}

.img-box {
  height: 40px;
  width: 40px;
  position: relative;
  .head-portrait {
    height: 40px;
    width: 40px;
    border-radius: 50%;
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
  &.flex-end {
    justify-content: flex-end;
  }
  > div {
    margin: 0 10px;
  }
}
.upset_24col_space_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-elment-lk {
  vertical-align: middle;
  font-size: 20px;
  color: #ccc;
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
/deep/ .el-divider__text {
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
  color: #ccc;
}
.gengbo {
  padding: 0px 16px;
  font-size: 14px;
  color: #ccc;
}
</style>

<style lang="scss" scoped>
// 老物件
/deep/.el-tabs__content {
  padding: 8px;
}

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
