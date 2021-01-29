<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:41
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-07 20:11:18
 -->
<template>
  <div class="right-container">
    <el-card
      shadow="never"
      class="box-card1"
      v-if="JSON.stringify(classMessage) != '{}'"
    >
      <!-- TODO: {{ teamDetail.id }}: 去掉班级id-->
      <div class="header" v-if="teamDetail.id">
        <div class="header-left">
          <div class="title">
            <span class="title-text">{{ teamDetail.team_name }}</span>
            <span class="text-iconsY">{{
              teamDetail.team_type == 0 ? '体验课' : '系统课'
            }}</span>
            <span class="text-iconsB">{{ teamDetail.WD }}</span>
            <!-- TODO: -->
            <span
              :class="[
                Number(teamDetail.team_state) === 2 ||
                Number(teamDetail.team_state) === 0
                  ? 'text-iconsGray'
                  : 'text-iconsR'
              ]"
              >{{ classMessage.state }}</span
            >
          </div>
          <div class="info">
            <span>学员:{{ teamDetail.enrolled }}</span>
            <span
              >辅导老师:{{
                teamDetail.teacher_info ? teamDetail.teacher_info.realname : ''
              }}</span
            >
            <span>辅导老师微信: {{ classMessage.teacher_wx }}</span>
            <!-- TODO: -->
            <span style="margin-right:0px">
              <span
                >开课~结课 &nbsp;{{ teamDetail.course_day }}~{{
                  teamDetail.end_course_day
                }}</span
              >
            </span>
            <span style="margin-right:0px">
              <span>创建 &nbsp;{{ teamDetail.ctime }}</span>
            </span>
          </div>
        </div>
        <div
          class="header-right"
          v-if="
            +classObj.teamId === 999 ||
              +classObj.teamId === 1030 ||
              +classObj.teamId === 1029 ||
              +classObj.teamId === 994 ||
              +classObj.teamId === 1185 ||
              +classObj.teamId === 1186 ||
              +classObj.teamId === 1187 ||
              +classObj.teamId === 1188 ||
              +classObj.teamId === 1189 ||
              +classObj.teamId === 1190 ||
              +classObj.teamId === 1191 ||
              +classObj.teamId === 1192 ||
              +classObj.teamId === 1193 ||
              +classObj.teamId === 1195 ||
              +classObj.teamId === 1196 ||
              +classObj.teamId === 1197
          "
        >
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
                    ;+teamDetail.team_state !== 2
                      ? (autoAddFriendsIn = true)
                      : ''
                  "
                  :class="+teamDetail.team_state !== 2 ? 'yClick' : 'nClick'"
                >
                  自动加好友
                </div>
              </el-tooltip>
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- TODO: TOP! -->
      <div class="body" v-if="classMessage.statictis">
        <div class="body-boxLeft" v-show="classMessage.team_type == 0">
          <div class="order-title">累计系统课订单</div>
          <div class="order-number">{{ classMessage.statictis.order_all }}</div>
          <div class="order-count">
            <span
              >今日
              <span>{{ classMessage.statictis.today_order }}</span>
            </span>
            <span
              >昨日
              <span>{{ classMessage.statictis.yesterday_order }}</span>
            </span>
          </div>
        </div>
        <div class="body-boxCenter" v-show="classMessage.team_type == 0">
          <div class="Conversion-title">累计转化率</div>
          <div class="Conversion-number">
            {{
              classMessage.allTrans == 'NaN'
                ? 0
                : (classMessage.allTrans * 100).toFixed(2)
            }}<span>%</span>
          </div>
          <!-- <div class="Conversion-count">
            <span
              >今日{{
                classMessage.todayTrans == 'NaN'
                  ? 0
                  : (classMessage.todayTrans * 100).toFixed(2)
              }}%</span
            >
            <span
              >昨日{{
                classMessage.yesterdayTrans == 'NaN'
                  ? 0
                  : (classMessage.yesterdayTrans * 100).toFixed(2)
              }}%</span
            >
          </div> -->
        </div>
        <div class="body-boxRight">
          <div class="params-top">
            <div>
              <div>{{ classMessage.statictis.wait_sent }}</div>
              <div>待发货</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.unadd_wechat }}</div>
              <div>待加好友</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.unadd_group }}</div>
              <div>待进群</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.unlogin }}</div>
              <div>待打开App</div>
            </div>
            <!-- <div>
              <div>{{ classMessage.statictis.today_add_class }}</div>
              <div>今日课程参课</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.yesterday_add_class }}</div>
              <div>昨日课程参课</div>
            </div> -->
          </div>
          <!-- <div class="params-bottom">
            <div>
              <div>{{ classMessage.statictis.tody_comp_class }}</div>
              <div>今日课程完课</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.yesterday_comp_class }}</div>
              <div>昨日课程完课</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.tody_works }}</div>
              <div>今日课程作品</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.yesterday_works }}</div>
              <div>昨日课程作品</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.tody_comment }}</div>
              <div>今日点评作品</div>
            </div>
            <div>
              <div>{{ classMessage.statictis.yesterday_comment }}</div>
              <div>昨日点评作品</div>
            </div>
          </div> -->
        </div>
      </div>
    </el-card>
    <div class="right-bar-empty" v-else>
      暂无可用数据
    </div>
    <tab-bar :classObj="classObj" />
  </div>
</template>

<script>
import TabBar from './TabPane/TabBar.vue'
import { calculateWD } from '@/utils/validate'
import { isToss, formatData } from '@/utils/index'
export default {
  props: {
    classObj: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    TabBar
  },
  data() {
    return {
      classMessage: {},
      cout: 0,
      teacherId: '',
      tableDataEmpty: true,
      count: 0,
      day: {},
      teamStatus: {
        0: '待开课',
        1: '上课中',
        2: '已结课'
      },
      autoAddFriends: false,
      teamDetail: {},
      autoAddFriendsIn: false,
      switchState: 'OFF' // 默认状态
    }
  },
  created() {
    this.$http.StudentTerm.getStudentTeamById({
      teamId: this.classObj.teamId || ''
    }).then((res) => {
      res && res.payload && (this.switchState = res.payload.switchState)
    })
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    const teamId = this.classObj.teamId
    if (teamId) {
      this.getClassTeacher(teamId)
      this.getTeamDetailById({ teamId })
    }
  },
  methods: {
    // TOSS助手自动加好友开关
    openAutoAddOpen() {
      this.autoAddFriends = false
      this.autoAddFriendsIn = false
      if (
        +this.classObj.teamId !== 999 &&
        +this.classObj.teamId !== 1030 &&
        +this.classObj.teamId !== 1029 &&
        +this.classObj.teamId !== 994 &&
        +this.classObj.teamId !== 1185 &&
        +this.classObj.teamId !== 1186 &&
        +this.classObj.teamId !== 1187 &&
        +this.classObj.teamId !== 1188 &&
        +this.classObj.teamId !== 1189 &&
        +this.classObj.teamId !== 1190 &&
        +this.classObj.teamId !== 1191 &&
        +this.classObj.teamId !== 1192 &&
        +this.classObj.teamId !== 1193 &&
        +this.classObj.teamId !== 1195 &&
        +this.classObj.teamId !== 1196 &&
        +this.classObj.teamId !== 1197
      ) {
        return
      }

      this.$http.StudentTerm.updateStudentTeamByState({
        status: 'ON',
        teamId: this.classObj.teamId || ''
      })
        .then((res) => {
          if (+res.code === 0) {
            this.$http.StudentTerm.getStudentTeamById({
              teamId: this.classObj.teamId || ''
            }).then((res) => {
              res && res.payload && (this.switchState = res.payload.switchState)
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
      this.autoAddFriends = false
      this.autoAddFriendsIn = false

      if (
        +this.classObj.teamId !== 999 &&
        +this.classObj.teamId !== 1030 &&
        +this.classObj.teamId !== 1029 &&
        +this.classObj.teamId !== 994 &&
        +this.classObj.teamId !== 1185 &&
        +this.classObj.teamId !== 1186 &&
        +this.classObj.teamId !== 1187 &&
        +this.classObj.teamId !== 1188 &&
        +this.classObj.teamId !== 1189 &&
        +this.classObj.teamId !== 1190 &&
        +this.classObj.teamId !== 1191 &&
        +this.classObj.teamId !== 1192 &&
        +this.classObj.teamId !== 1193 &&
        +this.classObj.teamId !== 1195 &&
        +this.classObj.teamId !== 1196 &&
        +this.classObj.teamId !== 1197
      ) {
        return
      }

      this.$http.StudentTerm.updateStudentTeamByState({
        status: 'OFF',
        teamId: this.classObj.teamId || ''
      })
        .then((res) => {
          if (+res.code === 0) {
            this.$http.StudentTerm.getStudentTeamById({
              teamId: this.classObj.teamId || ''
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
    // 根据班级id获取班级详情
    async getTeamDetailById(params) {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '玩命加载中...',
        fullscreen: true
      })
      try {
        const {
          data: { StudentTeam = {} }
        } = await this.$http.Team.getTeamDetailById({ id: params.teamId })

        const managementInfo = StudentTeam.managementInfo

        StudentTeam.ctime = +StudentTeam.ctime
          ? formatData(StudentTeam.ctime)
          : ''
        StudentTeam.WD = StudentTeam.current_lesson
          ? calculateWD(StudentTeam.current_lesson)
          : ''
        if (managementInfo) {
          StudentTeam.course_day = this.packeTime(managementInfo.course_day)
          StudentTeam.end_course_day = this.packeTime(
            managementInfo.end_course_day
          )
        }
        this.teamDetail = StudentTeam
      } catch (err) {
        console.error(err)
      } finally {
        loadingInstance.close()
      }
    },
    // 获取班级详情 顶部 统计数据
    getClassTeacher(teamId) {
      this.$http.Team.getTeacherStatistic(teamId).then((res) => {
        const enrolled = this.teamDetail.enrolled
        const {
          data: { detail = {} }
        } = res
        detail.state =
          detail && detail.team_state
            ? this.teamStatus[+detail.team_state] || '今日开课'
            : ''
        /** localstorage teacher 添加 “teacher_wx” 字段 */
        if (this.teacherId) {
          const teacher = JSON.parse(localStorage.getItem('teacher'))
          const teacherWx = detail.teacher_wx
          teacherWx && (teacher.teacher_wx = teacherWx)
          localStorage.setItem('teacher', JSON.stringify(teacher))
        }
        if (enrolled) {
          detail.allTrans = detail.statictis.order_all / enrolled
        }

        this.classMessage = detail
      })
    },
    packeTime(time) {
      if (+time) {
        return formatData(time)
          .replace(/-/g, '')
          .substr(4)
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

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
          font-weight: 500;
        }
        .order-count {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex: 1;
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
          height: 100%;
          > div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            > div {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              &:nth-child(1) {
                color: #4d4d4d;
                margin-bottom: 4px;
              }
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
