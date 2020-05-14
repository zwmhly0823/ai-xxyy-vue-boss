<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:41
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-13 21:39:14
 -->
<template>
  <div class="right-container">
    <el-card
      shadow="never"
      class="box-card1"
      :key="i"
      v-for="(item, i) in classMessage"
    >
      <div class="header">
        <div class="header-left">
          <div class="title">
            <span class="title-text">{{ item.id }}:{{ item.team_name }}</span>
            <span class="text-iconsY">{{
              item.team_type == 0 ? '体验课' : '系统课'
            }}</span>
            <span class="text-iconsB">{{ item.week }}</span>
            <span
              :class="[
                Number(item.team_state) === 2 || Number(item.team_state) === 0
                  ? 'text-iconsGray'
                  : 'text-iconsR'
              ]"
              >{{ item.state }}</span
            >
          </div>
          <div class="info">
            <span>学员:{{ item.enrolled }}</span>
            <span
              >辅导老师:{{ item.teacher ? item.teacher.realname : '' }}</span
            >
            <span>辅导老师微信: {{ item.teacher_wx }}</span>
            <span style="margin-right:0px">
              <span
                >开课~结课 &nbsp;{{ item.formatStartDay }}~{{
                  item.formatEndDay
                }}</span
              >
            </span>
            <span style="margin-right:0px">
              <span>创建 &nbsp;{{ item.timebegin }}</span>
            </span>
          </div>
        </div>
        <div class="header-right" v-if="false">
          <el-tooltip
            class="item"
            popper-class="headerPop"
            effect="light"
            content="自动加好友"
            manual
            v-model="autoAddFriends"
            placement="left"
          >
            <i
              class="el-icon-s-tools toolsIcons"
              @click="autoAddFriends = true"
            ></i>
            <div slot="content">
              <el-tooltip
                popper-class="headerPopIn"
                v-model="autoAddFriendsIn"
                class="item"
                effect="light"
                manual
                placement="right-start"
              >
                <div slot="content" class="openBtn">
                  <div @click="openAutoAddOpen">
                    <span>开启</span>
                    <svg
                      v-if="switchState === 'ON'"
                      t="1588769464743"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2161"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M395.61216 862.14656a77.84448 77.84448 0 0 1-54.90688-22.67136L30.86336 528.11776C0.63488 497.88928 0.63488 448.512 30.86336 417.792a77.84448 77.84448 0 0 1 109.83424 0l255.42656 256.43008L883.32288 184.5248c30.22848-30.22848 79.09376-30.22848 109.83424 0a77.84448 77.84448 0 0 1 0 109.83424L450.53952 839.4752a77.0048 77.0048 0 0 1-54.92736 22.67136z m0 0"
                        fill="#66CCFF"
                        p-id="2162"
                      ></path>
                    </svg>
                  </div>
                  <div @click="openAutoAddClose">
                    <span>关闭</span>
                    <svg
                      v-if="switchState === 'OFF'"
                      t="1588769464743"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2161"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M395.61216 862.14656a77.84448 77.84448 0 0 1-54.90688-22.67136L30.86336 528.11776C0.63488 497.88928 0.63488 448.512 30.86336 417.792a77.84448 77.84448 0 0 1 109.83424 0l255.42656 256.43008L883.32288 184.5248c30.22848-30.22848 79.09376-30.22848 109.83424 0a77.84448 77.84448 0 0 1 0 109.83424L450.53952 839.4752a77.0048 77.0048 0 0 1-54.92736 22.67136z m0 0"
                        fill="#66CCFF"
                        p-id="2162"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div
                  @mouseenter="
                    ;+classId.classId.team_state !== 2
                      ? (autoAddFriendsIn = true)
                      : ''
                  "
                  :class="
                    +classId.classId.team_state !== 2 ? 'yClick' : 'nClick'
                  "
                >
                  自动加好友
                </div>
              </el-tooltip>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="body">
        <div class="body-boxLeft" v-show="item.team_type == 0">
          <div class="order-title">累计系统课订单</div>
          <div class="order-number">{{ item.statictis.order_all }}</div>
          <div class="order-count">
            <span
              >今日
              <span>{{ item.statictis.today_order }}</span>
            </span>
            <span
              >昨日
              <span>{{ item.statictis.yesterday_order }}</span>
            </span>
          </div>
        </div>
        <div class="body-boxCenter" v-show="item.team_type == 0">
          <div class="Conversion-title">累计转化率</div>
          <div class="Conversion-number">
            {{ item.allTrans == 'NaN' ? 0 : (item.allTrans * 100).toFixed(2)
            }}<span>%</span>
          </div>
          <!-- <div class="Conversion-count">
            <span
              >今日{{
                item.todayTrans == 'NaN'
                  ? 0
                  : (item.todayTrans * 100).toFixed(2)
              }}%</span
            >
            <span
              >昨日{{
                item.yesterdayTrans == 'NaN'
                  ? 0
                  : (item.yesterdayTrans * 100).toFixed(2)
              }}%</span
            >
          </div> -->
        </div>
        <div class="body-boxRight">
          <div class="params-top">
            <div>
              <div>{{ item.statictis.wait_sent }}</div>
              <div>待发货</div>
            </div>
            <div>
              <div>{{ item.statictis.unadd_wechat }}</div>
              <div>待加好友</div>
            </div>
            <div>
              <div>{{ item.statictis.unadd_group }}</div>
              <div>待进群</div>
            </div>
            <div>
              <div>{{ item.statictis.unlogin }}</div>
              <div>待打开App</div>
            </div>
            <div>
              <div>{{ item.statictis.today_add_class }}</div>
              <div>今日课程参课</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_add_class }}</div>
              <div>昨日课程参课</div>
            </div>
          </div>
          <div class="params-bottom">
            <div>
              <div>{{ item.statictis.tody_comp_class }}</div>
              <div>今日课程完课</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_comp_class }}</div>
              <div>昨日课程完课</div>
            </div>
            <div>
              <div>{{ item.statictis.tody_works }}</div>
              <div>今日课程作品</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_works }}</div>
              <div>昨日课程作品</div>
            </div>
            <div>
              <div>{{ item.statictis.tody_comment }}</div>
              <div>今日点评作品</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_comment }}</div>
              <div>昨日点评作品</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="right-bar-empty" v-if="!classMessage.detail">
      暂无可用数据
    </div>
    <tab-bar :classId="classId" />
  </div>
</template>

<script>
import TabBar from './TabPane/TabBar.vue'
import axios from '@/api/axiosConfig'
import dayjs from 'dayjs'
import { isToss } from '@/utils/index'
export default {
  props: {
    classId: {
      type: Object,
      default: null
    },
    teamDate: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    TabBar
  },
  data() {
    return {
      classMessage: [],
      cout: 0,
      teacherId: '',
      tableDataEmpty: true,
      count: 0,
      day: {},
      autoAddFriends: false,
      autoAddFriendsIn: false,
      switchState: 'OFF' // 默认状态
    }
  },
  mounted() {
    // document.onmousedown = () => {
    //   this.autoAddFriends = false
    //   this.autoAddFriendsIn = false
    // }
  },
  watch: {
    classId(vals) {
      const teacherId = isToss()
      if (teacherId) {
        this.teacherId = teacherId
      }
      if (vals.classId && vals.classId.id) {
        this.tableDataEmpty = true
        this.getClassTeacher(vals.classId.id)
      } else {
        this.tableDataEmpty = false
      }
    }
  },
  methods: {
    openAutoAddOpen() {
      this.autoAddFriends = false
      this.autoAddFriendsIn = false
      this.$http.StudentTerm.updateStudentTeamByState({
        status: 'ON',
        teamId: this.classId.classId.id || ''
      })
        .then((res) => {
          if (+res.code === 0) {
            this.$http.StudentTerm.getStudentTeamById({
              teamId: this.classId.classId.id || ''
            }).then((res) => {
              this.switchState = res.payload.switchState
            })
            this.$message({
              message: '已开启自动加好友功能',
              type: 'success'
            })
          }
        })
        .catch((rej) => {
          this.$message.error('设置失败')
        })
    },
    openAutoAddClose() {
      console.log(this.classId)

      this.autoAddFriends = false
      this.autoAddFriendsIn = false
      this.$http.StudentTerm.updateStudentTeamByState({
        status: 'OFF',
        teamId: this.classId.classId.id || ''
      })
        .then((res) => {
          if (+res.code === 0) {
            this.$http.StudentTerm.getStudentTeamById({
              teamId: this.classId.classId.id || ''
            }).then((res) => {
              this.switchState = res.payload.switchState
            })
            this.$message({
              message: '已关闭自动加好友功能',
              type: 'success'
            })
          }
        })
        .catch((rej) => {
          this.$message.error('设置失败')
        })
    },
    getClassTeacher(data) {
      const queryParams = `[{id:${data}}]`
      axios
        .get('/graphql/getClassTeacher', {
          // params: {
          query: `{
            detail (query: "${queryParams}"){
              id
              team_name
              team_state
              team_type
              teacher_wx
              enrolled
                teacher{
                  id
                  nickname
                  weixin_ids
                  weichat_num
                  ctime
                  realname
                }
              statictis {
                today_order
                  yesterday_order
                  order_all
                  wait_sent
                  unadd_wechat
                  unadd_group
                  unlogin
                  today_add_class
                  yesterday_add_class
                  tody_comp_class
                  yesterday_comp_class
                  tody_works
                  yesterday_works
                  tody_comment
                  yesterday_comment
                }
              }
            }`
          // }
        })
        .then((res) => {
          console.log(res.data.detail.team_state, 'res.data.detail.team_state')
          if (Number(res.data.detail.team_state) === 0) {
            res.data.detail.state = '待开课'
          } else if (Number(res.data.detail.team_state) === 1) {
            res.data.detail.state = '开课中'
          } else if (Number(res.data.detail.team_state) === 2) {
            res.data.detail.state = '已结课'
          } else {
            res.data.detail.state = '今日开课'
          }
          /** localstorage teacher 添加 “teacher_wx” 字段 */
          if (this.teacherId) {
            const teacher = JSON.parse(localStorage.getItem('teacher'))
            const teacherWx = res.data.detail.teacher_wx
            teacherWx && (teacher.teacher_wx = teacherWx)
            localStorage.setItem('teacher', JSON.stringify(teacher))
          }
          /** localstorage teacher 添加 “teacher_wx” 字段 */

          if (this.classId && this.classId.classId) {
            res.data.detail.todayTrans =
              res.data.detail.statictis.today_order /
              this.classId.classId.enrolled
            res.data.detail.yesterdayTrans =
              res.data.detail.statictis.yesterday_order /
              this.classId.classId.enrolled
            res.data.detail.allTrans =
              res.data.detail.statictis.order_all /
              this.classId.classId.enrolled

            res.data.detail.week = this.classId.classId.week
            res.data.detail.pre_enroll = this.classId.classId.pre_enroll
            res.data.detail.timebegin = dayjs
              .unix(Number(this.classId.classId.ctime) / 1000)
              .format('MM-DD  hh:mm:ss')
            res.data.detail.onetime = dayjs
              .unix(Number(this.classId.classId.start_day) / 1000)
              .format('YYMMDD')
            res.data.detail.formatStartDay = this.classId.classId.formatStartDay
            res.data.detail.formatEndDay = this.classId.classId.formatEndDay
          }
          if (this.tableDataEmpty) {
            this.classMessage = res.data
          } else {
            this.tableDataEmpty = false
            this.classMessage = []
          }

          // this.classMessage2 = res.dataformatEndDay
        })
      // this.$http.StudentTerm.getStudentTeamById({
      //   teamId: this.classId.classId.id || ''
      // }).then((res) => {
      //   this.switchState = res.payload.switchState
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

@font-face {
  font-family: 'number_font';
  src: url('~@/assets/fonts/TG-TYPE-Bold.otf');
} //引入本地字体数字文件

.right-container {
  .box-card1 {
    border-bottom: 10px solid rgba(240, 241, 242, 1);
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .header-left {
        .title {
          .title-text {
            font-size: 18px;
            font-weight: 500;
            color: #222222;
          }
          .text-iconsY {
            margin-left: 8px;
            padding: 2px 6px;
            color: #ff9c00;
            background: #fff5e5;
          }
          .text-iconsB {
            margin-left: 8px;
            padding: 2px 6px;
            color: #4096fb;
            background: #e5f1ff;
          }
          .text-iconsR {
            margin-left: 8px;
            padding: 2px 6px;
            color: #ff554d;
            background: #ffe7e5;
          }
          .text-iconsGray {
            margin-left: 8px;
            padding: 2px 6px;
            color: #808080;
            background: #ededed;
          }
        }
        .info {
          font-size: 12px;
          color: #666666;
          margin-top: 10px;
          span {
            margin-right: 8px;
          }
        }
      }
    }
    .body {
      background: #fff;
      color: #666666;
      display: flex;
      font-size: 12px;
      &-boxLeft,
      &-boxCenter,
      &-boxRight {
        flex: 0.15;
        padding: 10px;
        margin-right: 15px;
        background: #f5f6f7;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      &-boxLeft {
        .order-title {
          margin-bottom: 10px;
          flex: 1;
        }
        .order-number {
          color: #4d4d4d;
          font-size: 24px;
          margin-bottom: 10px;
          flex: 1;
          font-family: 'number_font';
          font-weight: 500;
        }
        .order-count {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex: 1;
          span {
            span {
              font-family: 'number_font';
            }
          }
        }
      }
      &-boxCenter {
        .Conversion-title {
          margin-bottom: 10px;
          flex: 1;
        }
        .Conversion-number {
          font-size: 24px;
          color: #4d4d4d;
          font-weight: 500;
          margin-bottom: 10px;
          font-family: 'number_font';
          flex: 1;
          span {
            font-size: 14px;
          }
        }
        .Conversion-count {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex: 1;
        }
      }
      &-boxRight {
        flex: 1;
        display: flex;
        justify-content: space-between;
        margin-right: 0px;
        .params-top {
          width: 100%;
          display: flex;
          div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            div:nth-child(1) {
              font-family: 'number_font';
              color: #4d4d4d;
              margin-bottom: 4px;
            }
          }
        }
        .params-bottom {
          width: 100%;
          display: flex;
          div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            div:nth-child(1) {
              font-family: 'number_font';
              color: #4d4d4d;
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }
  .el-tabs--border-card {
    border: none;
  }
}
</style>

<style lang="scss">
.box-card1 {
  border-radius: 0;
  .el-card__body {
    padding: 15px;
  }
}
.right-bar-empty {
  width: 100%;
  height: 179px;
  text-align: center;
  line-height: 159px;
  color: #808080;
  background-color: #fff;
  border: #ebebeb 10px solid;
}

.headerPop {
  font-size: 14px;
  padding: 8px;
  border: 1px solid rgb(228, 231, 237) !important;
  border-radius: 0;
  margin-right: 8px !important;
  box-shadow: #333 4px 4px 3px;
  right: 40px !important;
  background-color: rgb(245, 246, 247) !important;
  cursor: pointer;
  .popper__arrow {
    display: none !important;
  }
}
.headerPopIn {
  margin-right: 7px !important;
  font-size: 14px;
  padding: 5px;
  border: 1px solid rgb(228, 231, 237) !important;
  border-radius: 0;
  box-shadow: #333 4px 4px 3px;
  cursor: pointer;
  background-color: rgb(245, 246, 247) !important;
  .popper__arrow {
    display: none !important;
  }
}
.openBtn div {
  display: flex;
  align-items: center;
}
.openBtn div:hover {
  font-weight: 500;
}
.openBtn div svg {
  margin-left: 4px;
  width: 14px;
  height: 14px;
}
.yClick:hover {
  font-weight: 500;
}
.nClick {
  color: #ccc;
}
.toolsIcons {
  font-size: 16px;
}
</style>
