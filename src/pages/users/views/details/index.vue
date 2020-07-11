<template>
  <div class="details-body">
    <div
      class="datails-content"
      v-loading="loading"
      element-loading-background="transparent"
    >
      <!-- 用户信息 -->
      <template>
        <el-row class="personal">
          <el-col :span="2">
            <div class="img-box">
              <img class="head-portrait " :src="stuInfor.head || defaultHead" />
              <!-- 男：1 女：2 -->
              <i v-show="stuInfor.sex === '2'" class="female el-icon-female " />
              <i v-show="stuInfor.sex === '1'" class="gender el-icon-male" />
            </div>
          </el-col>
          <el-col :span="15">
            <div class="text-oneline">
              <div>
                {{ stuInfor.username ? stuInfor.username : '-' }}
                ·
                {{ stuInfor.mobile }}
              </div>

              <div
                :class="
                  stuInfor.weixinUser && stuInfor.weixinUser.follow === '1'
                    ? `the-public`
                    : `not-bound`
                "
              >
                <!-- if follow === 1 绑定    else 没绑定 -->
                <template
                  v-if="
                    stuInfor.weixinUser && stuInfor.weixinUser.follow === '1'
                  "
                >
                  <img
                    src="../../../../../src/assets/images/WeChat.png"
                  />公众号已绑定 ·
                  {{
                    stuInfor.weixinUser.nickname
                      ? stuInfor.weixinUser.nickname
                      : '-'
                  }}
                </template>
                <template v-else>
                  <img
                    src="../../../../../src/assets/images/WeChat-no.png"
                  />公众号未绑定
                </template>
              </div>
            </div>
            <div class="text-twoline">
              <div>
                用户编号:
                {{ stuInfor.user_num || '-' }}
              </div>
              <div class="coupons">
                <img
                  src="../../../../../src/assets/images/coupons.png"
                />优惠券:
                <span @click="jumpToAsset(1)" class="jump-class">{{
                  stuInfor.coupon && stuInfor.coupon.length
                }}</span>
              </div>
              <div class="gold-conins">
                <img
                  src="../../../../../src/assets/images/gold-conins.png"
                />小熊币:
                <span @click="jumpToAsset(2)" class="jump-class">
                  {{
                    stuInfor.account &&
                      stuInfor.account[0] &&
                      stuInfor.account[0].balance
                  }}
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <template v-if="stuInfor.teams && stuInfor.teams.length > 0">
              <!-- 开课状态 -->
              <!-- 逻辑：当前班级状态 0: 待开课 1:开课中 2:已结课-->
              <template
                v-if="
                  stuInfor.teams[courseIndex].isRefund === 1 &&
                    ['learningRecord', 'collectionOf'].includes(tabData)
                "
              >
                <el-tag :disable-transitions="true" type="danger">
                  已退费
                </el-tag>
              </template>
              <template v-else>
                <el-tag
                  :disable-transitions="true"
                  type="info"
                  v-if="stuInfor.teams[courseIndex].team_state === '0'"
                >
                  待开课
                </el-tag>
                <el-tag
                  :disable-transitions="true"
                  type="success"
                  v-if="stuInfor.teams[courseIndex].team_state === '1'"
                >
                  开课中
                </el-tag>
                <el-tag
                  :disable-transitions="true"
                  type="info"
                  v-if="stuInfor.teams[courseIndex].team_state === '2'"
                >
                  已结课
                </el-tag>
              </template>
              <!-- 课程进度 -->
              <el-tag
                :disable-transitions="true"
                :type="
                  stuInfor.teams[courseIndex].team_state === '1'
                    ? 'success'
                    : 'info'
                "
              >
                <span v-if="+stuInfor.teams[courseIndex].team_type > 0">
                  {{
                    stuInfor.teams[courseIndex].current_lesson.substring(
                      stuInfor.teams[courseIndex].current_lesson.indexOf('L')
                    )
                  }}
                </span>
                <span v-else>
                  {{ stuInfor.teams[courseIndex].wd_info }}
                </span>
              </el-tag>
              <!-- 添加好友状态，进群状态 -->
              <!-- 体验课-->
              <template
                v-if="
                  stuInfor.teams &&
                    stuInfor.teams[courseIndex].team_type === '0'
                "
              >
                <!-- 已加微信数 > 0:已加好友  else 未加好友 -->
                <el-tag
                  :disable-transitions="true"
                  type="success"
                  v-if="stuInfor.trialCourse.added_wechat > 0"
                >
                  已加好友
                </el-tag>
                <el-tag :disable-transitions="true" type="danger" v-else>
                  未加好友
                </el-tag>
                <el-tag
                  :disable-transitions="true"
                  type="success"
                  v-if="stuInfor.trialCourse.added_group > 0"
                  >已进群</el-tag
                >
                <el-tag :disable-transitions="true" type="danger" v-else
                  >未进群</el-tag
                >
              </template>
              <!-- 系统课 -->
              <template
                v-else-if="
                  stuInfor.systemCourse && stuInfor.systemCourse.length > 0
                "
              >
                <!-- 当前课程teams.id === systemCourse.team_id -->
                <span
                  v-for="item in stuInfor.systemCourse"
                  :key="item.team_id"
                  v-show="item.team_id === stuInfor.teams[courseIndex].id"
                >
                  <el-tag
                    :disable-transitions="true"
                    type="success"
                    v-if="item.added_wechat > 0"
                  >
                    已加好友
                  </el-tag>
                  <el-tag :disable-transitions="true" type="danger" v-else>
                    未加好友
                  </el-tag>
                  <el-tag
                    :disable-transitions="true"
                    type="success"
                    v-if="item.added_group > 0"
                    >已进群</el-tag
                  >
                  <el-tag :disable-transitions="true" type="danger" v-else
                    >未进群</el-tag
                  >
                </span>
              </template>
              <!-- 展开 -->
              <div class="open-the" v-if="!aFold">
                <div @click="openThe">
                  展开<i class="el-icon-caret-bottom"></i>
                </div>
              </div>
            </template>
          </el-col>
        </el-row>
        <el-row class="specific" v-if="aFold">
          <el-col :span="16">
            <el-row>
              <el-col :span="8">
                <span>区域</span>：
                {{ stuInfor.mobile_province ? stuInfor.mobile_province : '-' }}
                · {{ stuInfor.mobile_city ? stuInfor.mobile_city : '-' }}
              </el-col>
              <el-col :span="8"
                ><span>注册渠道</span>：
                {{
                  stuInfor.channelInfo &&
                  stuInfor.channelInfo.channel_inner_name
                    ? stuInfor.channelInfo.channel_inner_name
                    : '-'
                }}</el-col
              >
              <el-col :span="8"
                ><span>最近登陆设备</span>：
                {{
                  stuInfor.loginData &&
                  stuInfor.loginData.length > 0 &&
                  stuInfor.loginData[0].device_model
                    ? stuInfor.loginData[0].device_model
                    : '-'
                }}
              </el-col>
              <el-col :span="8"
                ><span>年龄</span>：
                {{ stuInfor.birthday ? stuInfor.age : '-' }}</el-col
              >
              <el-col :span="8">
                <span>美术基础</span>：
                {{
                  stuInfor.base_painting_text
                    ? stuInfor.base_painting_text
                    : '-'
                }}
              </el-col>
              <el-col :span="8">
                <span>推荐人</span>
                ：
                <span
                  v-if="
                    stuInfor.sender &&
                      (stuInfor.sender.username || stuInfor.sender.mobile)
                  "
                  class="referees"
                  @click="refereesBtn"
                >
                  {{ stuInfor.sender.username }} - {{ stuInfor.sender.mobile }}
                </span>
                <span v-else>-</span>
              </el-col>
              <el-col :span="8"
                ><span>生日</span>：{{
                  stuInfor.birthday ? stuInfor.birthday : '-'
                }}</el-col
              >
              <el-col :span="8"
                ><span>用户状态</span>：{{ stuInfor.status_text }}
              </el-col>
              <el-col :span="8">
                <span>注册时间</span>：{{ stuInfor.join_date }}
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="6" style="color: #aeaeae;">默认地址：</el-col>
              <div @click="onUpdataAddress" class="updateAddress">
                <div>
                  修改
                </div>
              </div>
              <el-col :span="18">
                {{
                  stuInfor.address &&
                  stuInfor.address.length > 0 &&
                  stuInfor.address[0].receipt_name
                    ? stuInfor.address[0].receipt_name
                    : '-'
                }}
                {{
                  stuInfor.address &&
                  stuInfor.address.length > 0 &&
                  stuInfor.address[0].receipt_tel
                    ? stuInfor.address[0].receipt_tel
                    : '-'
                }}
                <br />
                {{
                  stuInfor.address &&
                  stuInfor.address.length > 0 &&
                  stuInfor.address[0].province
                    ? stuInfor.address[0].province
                    : '-'
                }}
                {{
                  stuInfor.address &&
                  stuInfor.address.length > 0 &&
                  stuInfor.address[0].city
                    ? stuInfor.address[0].city
                    : '-'
                }}
                {{
                  stuInfor.address &&
                  stuInfor.address.length > 0 &&
                  stuInfor.address[0].area
                    ? stuInfor.address[0].area
                    : '-'
                }}
                <br />
                {{
                  stuInfor.address &&
                  stuInfor.address.length > 0 &&
                  stuInfor.address[0].address_detail
                    ? stuInfor.address[0].address_detail
                    : '-'
                }}
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <div @click="packUp">收起<i class="el-icon-caret-top"></i></div>
          </el-col>
        </el-row>
      </template>
      <!-- tab标签页 -->
      <div class="tab-sty">
        <el-tabs type="border-card" v-model="tabData" @tab-click="tabBtn">
          <el-tab-pane label="学习记录" name="learningRecord"></el-tab-pane>
          <el-tab-pane label="作品集" name="collectionOf"></el-tab-pane>
          <el-tab-pane
            label="订单·物流记录"
            name="orderLogistics"
          ></el-tab-pane>
          <el-tab-pane label="用户资产" name="userAsset"></el-tab-pane>
          <el-tab-pane label="通知事件记录" name="notifyRecord"></el-tab-pane>
        </el-tabs>
      </div>
      <div
        class="course-sty"
        v-if="['learningRecord', 'collectionOf'].includes(tabData)"
      >
        <el-tabs v-model="courseData" @tab-click="courseBtn">
          <el-tab-pane
            v-for="item in stuInfor.teams"
            :key="item.id"
            :label="`${item.team_type_formatting}:${item.team_name}`"
            :name="item.id"
          >
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
            <div
              class="statistical class-statistical"
              v-if="tabData === 'learningRecord'"
            >
              <!-- <div>
                <span>课程总数</span>:
                <span class="tatistical-span">{{ item.course_count }}</span>
              </div> -->
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
      <div class="tab-content">
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
      </div>
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
    </div>
    <div>
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
    </div>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import DetailsList from './list.vue'
import { GetAgeByBrithday, formatData, openBrowserTab } from '@/utils/index'
import modifyAddress from './addressComponetns/modifyAddress'
export default {
  components: { DetailsList, MPagination, modifyAddress },
  data() {
    return {
      dialogTableVisible: false,
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      // 学员id
      studentId: '456179524149972992',
      // 推荐人id
      sendId: '0',
      // 展开收起
      aFold: true,
      // 学习记录tab
      tabData: 'learningRecord',
      tabList: [],
      wholeSecondData: {},
      // 学习记录>课程tab
      courseData: '',
      // loading
      loading: false,
      // 学员信息
      stuInfor: {},
      // 课程tab下标
      courseIndex: 0,
      lessonType: null,
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
      wholeData: {}
    }
  },
  created() {
    this.studentId = this.$route.params.id

    // 学员信息接口
    this.reqUser()
  },
  methods: {
    modifyAddressExpress() {
      this.dialogTableVisible = false
      this.reqUser()
    },
    onUpdataAddress() {
      this.dialogTableVisible = true
    },
    // 学员信息接口
    reqUser() {
      this.$http.User.getUser(this.studentId).then((res) => {
        console.log('学员基本信息', res.data.User)
        this.sendId =
          res.data.User && res.data.User.send_id ? res.data.User.send_id : '0'
        // 课程tab默认显示
        this.courseData = res.data.User.teams[0].id
        this.stuInfor = this.modifyData(res.data.User)
        this.loading = false
        // init lessonType
        this.lessonType = this.stuInfor.teams[0].team_type - 0 > 0 ? 1 : 0
        // 判断是不是已退费
        this.checkBack()
        // 在不能自己选系统课体验课的页面，用户在有多个系统课的情况下，右上角的tag页签展示优先级开课中>待开课>已开课>已退费
        // 目前学习记录和作品集里能自己切换班级固排除
        if (
          !(
            this.tabData === 'learningRecord' || this.tabData === 'collectionOf'
          ) &&
          this.stuInfor.teams.length
        ) {
          this.tagsPriorityLevel()
        } else {
          this.courseIndex = 0
        }
        if (this.tabData === 'learningRecord') {
          // 学习记录接口
          this.reqSendCourseLogPage(
            res.data.User.teams[0].id,
            res.data.User.teams[0].team_type
          )
        } else if (this.tabData === 'collectionOf') {
          // 作品集接口
          this.reqStudentCourseTaskPage(res.data.User.teams[0].id)
        } else if (this.tabData === 'orderLogistics') {
          // 订单·物流数据接口
          this.reqgetOrderPage()
        } else if (this.tabData === 'userAsset') {
          // 用户资产
          this.reqGetUserAssets()
        } else if (this.tabData === 'notifyRecord') {
          this.reqNotifyPage()
        }
      })
    },
    modifyData(data) {
      // 年龄格式化
      data.age = data.birthday !== '0' ? GetAgeByBrithday(data.birthday) : '-'
      // 生日格式化
      data.birthday = data.birthday ? formatData(data.birthday * 1000) : '-'
      // 注册时间格式化
      data.join_date = data.join_date ? formatData(data.join_date) : '-'
      data.teams.length > 0 &&
        data.teams.forEach((item) => {
          // 课程名称格式化 0:体验课   >0:系统课
          if (item.team_type === '0') {
            item.team_type_formatting = '体验课'
          } else {
            item.team_type_formatting = '系统课'
          }
        })
      return data
    },
    // 已退费模块
    checkBack() {
      // 把体验课和系统课中的id和状态都抽出来，isrefund=1是退费的
      const classObj = new Map()
      // console.log(this.stuInfor)
      if (this.stuInfor.trialCourse && this.stuInfor.trialCourse.team_id) {
        classObj.set(
          +this.stuInfor.trialCourse.team_id,
          this.stuInfor.trialCourse.orderInfo.isrefund
        )
      }
      if (this.stuInfor.systemCourse.length) {
        this.stuInfor.systemCourse.forEach((sItem) => {
          classObj.set(+sItem.team_id, sItem.orderInfo.isrefund)
        })
      }
      if (classObj.size !== 0) {
        this.stuInfor.teams.forEach((tItem) => {
          tItem.isRefund = classObj.get(+tItem.id)
        })
      }
    },
    tagsPriorityLevel() {
      const sortArr = []
      // team_state: 0: 待开课 1:开课中 2:已结课
      for (let i = 0, len = this.stuInfor.teams.length; i < len; i++) {
        const item = this.stuInfor.teams[i]
        if (+item.team_type > 0 && !item.isRefund) {
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
      // 这样顺序就是开课中 - 待开课 - 已结课
      sortArr.sort(function(a, b) {
        return b.team_state - a.team_state
      })
      // courseIndex控制显示哪个
      this.courseIndex = sortArr[0].index
    },
    // 学习记录接口
    reqSendCourseLogPage(id) {
      this.$http.User.getSendCourseLogPage(
        this.studentId,
        id,
        this.currentPage,
        this.lessonType
      ).then((res) => {
        // console.log('学习记录接口', res.data.SendCourseLogPage.content)
        const _data = res.data.SendCourseLogPage.content
        _data.forEach((item) => {
          this.tabList = []
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
        this.tabList = _data
      })
    },
    // 作品集
    reqStudentCourseTaskPage(id) {
      this.$http.User.getStudentCourseTaskPage(
        this.studentId,
        id,
        this.currentPage
      ).then((res) => {
        // console.log('作品集', res.data.StudentCourseTaskPage.content)
        this.tabList = []
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
        this.tabList = _data
      })
    },
    // 订单·物流数据接口
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
    reqGetUserAssets(page) {
      // 先获取优惠券
      this.$http.User.getUserAssetsCoupon(this.studentId, page || 1)
        .then((res) => {
          // console.log(res)
          this.wholeData = res.data
          this.wholeData.couponUserCollect = this.stuInfor.couponUserCollect
          this.wholeData.userId = this.stuInfor.id
          // 再获取小熊币
          if (!page) {
            this.reqGetUserCoin()
          }
        })
        .catch(() => {
          this.$message.error('获取用户资产失败')
        })
    },
    reqGetUserCoin(page) {
      this.$http.User.getUserAssetsCoin(this.studentId, page || 1)
        .then((res) => {
          // console.log(res)
          this.wholeSecondData = res.data
          this.wholeSecondData.accountUserCollect = this.stuInfor.accountUserCollect
        })
        .catch(() => {
          this.$message.error('获取用户资产失败')
        })
    },
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
            this.wholeData = res
            this.wholeData.studentId = this.studentId
            this.totalPages = +res.payload.totalPages
            this.totalElements = +res.payload.totalElements
          } else {
            this.$message.error('获取用户通知事件记录失败')
          }
        })
        .catch(() => {
          this.$message.error('获取用户通知事件记录失败')
        })
    },
    // 点击分页
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
    // 收起
    packUp() {
      this.aFold = false
    },
    // 展开
    openThe() {
      this.aFold = true
    },
    tabBtn(tab, event) {
      this.currentPage = 1
      // console.log(tab, event, '学习记录')
      this.assetCouponDone = false
      this.assetCoinDone = false
      this.reqUser()
    },
    // 学习记录课程
    courseBtn(tab, event) {
      this.courseIndex = tab.index
      this.lessonType =
        this.stuInfor.teams[this.courseIndex].team_type > 0 ? 1 : 0
      if (this.tabData === 'learningRecord') {
        this.reqSendCourseLogPage(this.stuInfor.teams[tab.index].id)
      } else if (this.tabData === 'collectionOf') {
        this.reqStudentCourseTaskPage(this.stuInfor.teams[tab.index].id)
      }
    },
    // 点击推荐人
    refereesBtn() {
      console.log('推荐人')
      // const { username, mobile } = this.stuInfor.sender
      this.sendId && openBrowserTab(`/users/#/details/${this.sendId}`)
      // this.$router.push({ path: '/details', query: { id: '123' } })
    },
    changePagenation(data) {
      if (data.curPane === 'coupon') {
        this.reqGetUserAssets(data.page)
      } else if (data.curPane === 'coin') {
        this.reqGetUserCoin(data.page)
      }
    },
    couponSendSucc() {
      this.reqGetUserAssets()
    },
    jumpToAsset(type) {
      this.tabData = 'userAsset'
      this.tagsPriorityLevel()
      this.reqGetUserAssets()
      setTimeout(() => {
        if (type === 1) {
          this.$refs.detailsList.jumpToCoin('assetCoupon')
        } else if (type === 2) {
          this.$refs.detailsList.jumpToCoin('assetBearCoin')
        }
      }, 0)
    },
    ivrBubbleData(data) {
      this.reqNotifyPage(data)
    }
  }
}
</script>
<style scoped lang="scss">
.details-body {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  .datails-content {
    width: 100%;
    margin: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
  }
  // 头像行
  .personal {
    height: 70px;
    margin: 20px 0 0 0;
    // background: gold;
    .el-col-2 {
      display: flex;
      justify-content: center;

      .img-box {
        height: 70px;
        width: 70px;
        position: relative;
        .head-portrait {
          height: 70px;
          width: 70px;
          border-radius: 50%;
        }
        i {
          position: absolute;
          top: 50px;
          right: 5px;
          display: block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 100%;
          overflow: hidden;
          color: #fff;
          text-align: center;
        }
        .gender {
          background-color: #369bff;
        }
        .female {
          background-color: #f23589;
        }
      }
    }
    .el-col-15 {
      div {
        line-height: 35px;
      }
      .text-oneline {
        width: 100%;
        font-size: 16px;
        color: #555555;
        float: left;
        display: flex;
        align-items: center;
        // background: red;
        div {
          float: left;
          margin: 0 20px 0 0;
        }
        .the-public {
          line-height: 25px;
          background-color: #d8f4d3;
          color: #67c23a;
          padding: 0px 15px 0px 10px;
          border-radius: 25px;
          font-size: 13px;
          display: flex;
          align-items: center;
          img {
            width: 17px;
            height: 17px;
            margin-right: 5px;
          }
        }
        .not-bound {
          line-height: 25px;
          background-color: #e2e2e2;
          color: #808080;
          padding: 0px 15px 0px 10px;
          border-radius: 25px;
          font-size: 13px;
          display: flex;
          align-items: center;
          img {
            width: 17px;
            height: 17px;
            margin-right: 5px;
          }
        }
      }
      .text-twoline {
        // background: green;
        width: 100%;
        float: left;
        font-size: 14px;
        div {
          float: left;
          margin: 0 40px 0 0;
          color: #424242;
        }
        .coupons {
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
          .jump-class {
            margin-left: 10px;
            color: #409eff;
            cursor: pointer;
            text-decoration: underline;
          }
        }
        .gold-conins {
          display: flex;
          align-items: center;
          img {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
          .jump-class {
            margin-left: 10px;
            color: #409eff;
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
    .el-col-7 {
      .el-tag {
        line-height: 25px;
        height: 25px;
        // background: #d8f4d3;
        margin: 0 10px 0 0;
        font-size: 14px;
      }
    }
  }
  // 详情行
  .specific {
    margin: 10px 0 0 40px;
    height: 90px;
    // background: #67c23a;
    .el-col {
      line-height: 30px;
      span {
        color: #aeaeae;
      }
      .referees {
        color: #5ea0f5;
        cursor: pointer;
      }
    }
    // 默认地址
    .el-col-8 {
      .el-col-4 {
        color: #aeaeae;
      }
    }
    // 收起
    .el-col-2 {
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      div {
        float: right;
        margin: 0 20px 0 0;
        cursor: pointer;
        color: #aeaeae;
      }
    }
    .updateAddress {
      width: 40px;
      height: 20px;
      position: absolute;
      top: 35px;
      left: 15px;
      color: #fff;
      background: #409eff;
      border-radius: 50px;
      line-height: 20px;
      cursor: pointer;
      div {
        text-align: center;
        font-size: 12px;
      }
    }
  }
  // 展开
  .open-the {
    width: 100%;
    div {
      margin: 20px 20px 0 0;
      float: right;
      color: #aeaeae;
      cursor: pointer;
    }
  }
  // tab样式
  .tab-sty {
    margin: 5px 10px 10px 10px;
    .el-tabs--border-card {
      box-shadow: none;
    }
  }
  // 课程tab+统计
  .course-sty {
    margin: 0px 10px 10px 10px;
    .statistical {
      div {
        float: left;
        margin: 0 15px 0 0;
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
  // tab列表
  .tab-content {
    flex: 1;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    padding: 0px 10px 35px 10px;
  }
}
</style>
<style lang="scss">
.el-tabs__header {
  border: 0 !important;
}
.el-tabs__item {
  border: 0 !important;
}
.el-tabs__content {
  padding: 0px !important;
}
.el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
