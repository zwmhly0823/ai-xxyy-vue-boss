<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-17 19:37:24
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-29 20:45:07
-->
<template>
  <div class="system-details">
    <!-- <el-radio-group v-if="!isFrom1v1" v-model="changeSubject" size="mini">
      <el-radio-button :label="0">美术</el-radio-button>
      <el-radio-button :label="1">写字</el-radio-button>
    </el-radio-group>-->
    <!-- 系统课 -->
    <template>
      <el-row :gutter="15" class="detail-container">
        <el-col :span="17" class="border-right">
          <div ref="userDetailref" :style="{ minHeight: detailHeight }">
            <!-- 第一部分 START -->
            <section class="student-info" v-if="Object.keys(stuInfor).length">
              <p>学员信息</p>
              <el-row :gutter="15">
                <el-col :span="7">
                  <div class="item1">
                    <span class="label">微信昵称：</span>
                    <img
                      style="vertical-align:middle"
                      class="head-portrait_small"
                      :src="stuInforAdd.wechat_avatar || defaultHead"
                    />
                    {{
                    stuInforAdd.wechat_nick_name
                    ? stuInforAdd.wechat_nick_name || '-'
                    : '-'
                    }}
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="item1">
                    <span class="label">微信号：</span>
                    <span class>
                      {{
                      stuInforAdd.wechat_no ? stuInforAdd.wechat_no : '-'
                      }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="item1">
                    <span>学习科目：</span>
                    <el-tag
                      style="margin-right:5px"
                      type="danger"
                      size="mini"
                      v-for="(item, index) in studyCount"
                      :key="index"
                    >{{ item }}</el-tag>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="7">
                  <div class="item1">
                    <span>注册时间：</span>
                    <span>{{ stuInforAdd.join_date }}</span>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="item1">
                    <span>注册渠道：</span>
                    <span class>
                      {{
                      stuInforAdd.channelInfo &&
                      (stuInforAdd.channelInfo.channel_inner_name || '-')
                      }}
                    </span>
                  </div>
                </el-col>
                <!-- <el-col :span="7">
                  <div class="item1">
                    <span>推荐人：</span>
                    <span
                      @click="$refs.recommend.recommendInfo = true"
                      style="color: #2a75ed;"
                    >
                      <span>{{
                        stuInforAdd.sender &&
                          (stuInforAdd.sender.username || '-')
                      }}</span>
                      <span> - </span>
                      <span>{{
                        stuInforAdd.sender && (stuInforAdd.sender.mobile || '-')
                      }}</span>
                    </span>
                  </div>
                </el-col>-->
              </el-row>
              <el-row :gutter="15">
                <el-col :span="24">
                  <div class="item1">
                    <span class="label">默认地址：</span>
                    <span v-if="stuInfor.address && stuInfor.address.length">
                      <span>{{ stuInfor.address[0].province || '-' }} ·</span>
                      <span>{{ stuInfor.address[0].city || '-' }} ·</span>
                      <span>{{ stuInfor.address[0].area || '-' }} ·</span>
                      <span>{{ stuInfor.address[0].street || '-' }} ·</span>
                      <span>
                        {{
                        stuInfor.address[0].address_detail || '-'
                        }}
                      </span>
                    </span>
                    <span class="edit-address-btn" @click="harvertAddressVisible = true">「管理地址」</span>
                  </div>
                </el-col>
              </el-row>

              <p :style="{ marginTop: '10px' }">转介绍信息</p>
              <el-row :gutter="15">
                <el-col :span="7">
                  <div class="item1">
                    <span class="label" :style="{ width: '90px' }">体验课推荐人：</span>
                    <el-link
                      v-if="recommendDetails.u_id"
                      type="primary"
                      :href="'/music_app/#/details/' + recommendDetails.u_id"
                      target="_blank"
                    >
                      {{
                      recommendDetails.username +
                      '·' +
                      recommendDetails.user_num
                      }}
                    </el-link>
                    <span v-else>--</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item1">
                    <span class="label" :style="{ width: '100px' }">体验课推荐记录：</span>
                    <el-button
                      size="mini"
                      type="text"
                      @click="jumpRecommendRecord"
                    >{{ recommendDetailsCount }}</el-button>
                  </div>
                </el-col>
              </el-row>
              <!-- 标签 start -->

              <el-row>
                <div class="student-labels">
                  <!-- <strong></strong> -->
                  <span>学员标签</span>
                  <!-- <span style="color:#aaa;font-size:14px"
                    >（ 包含微信标签 ）</span
                  >-->
                </div>
                <section v-if="!studentLabels.length && !aikelabel.length">
                  <el-row>
                    <el-col :span="7" style="color:#aaa">暂无标签</el-col>
                  </el-row>
                </section>
                <section v-else>
                  <!-- <el-tag
                    style="margin-right:10px"
                    type="sucess"
                    size="mini"
                    v-for="item of aikelabel"
                    :key="item"
                    >{{ item }}</el-tag
                  >-->
                  <span
                    v-if="
                      studentLabels &&
                        studentLabels.length &&
                        studentLabels[0].name
                    "
                  >
                    <el-tag
                      style="margin-right:10px"
                      type="warning"
                      size="small"
                      v-for="item of studentLabels"
                      :key="item.id"
                    >
                      {{
                      courseLevelReplace(item.name)
                      }}
                    </el-tag>
                  </span>
                </section>
              </el-row>
              <!-- 标签 END -->
            </section>
            <!-- 第2部分课程班级 START -->
            <section class="course-team-list">
              <P>课程班级</P>
              <div class="team" v-for="(team, index) in teams" :key="index">
                <div class="header">
                  <div class="name-status">
                    <div class="name">
                      <!-- 系统课 -->
                      <span v-if="team.currentsuper">
                        {{
                        courseLevelReplace(team.currentsuper) || '-'
                        }}
                      </span>
                      <!-- 体验课 -->
                      <span v-else>
                        {{
                        courseLevelReplace(team.sup) || '-'
                        }}
                      </span>
                      {{ team.orderInfo && team.orderInfo.packages_name }}
                    </div>
                    <div class="status">
                      <el-tag
                        :type="
                          team.teamStatusCH != '已结课' ? 'success' : 'info'
                        "
                        class="tag-setting"
                        size="small"
                      >{{ team.teamStatusCH }}</el-tag>
                    </div>
                  </div>
                  <div class="course-args">
                    <span>班级上课情况：</span>
                    <span>
                      <span>放课</span>
                      <span>
                        {{
                        team.send_course_count || team.currenttotal || 0
                        }}
                      </span>
                      <span>节</span>
                    </span>
                    <span>
                      <span>参课</span>
                      <span>
                        {{
                        team.join_course_count || team.noactivecount || 0
                        }}
                      </span>
                      <span>节</span>
                    </span>
                    <span>
                      <span>完课</span>
                      <span>
                        {{
                        team.complete_course_count || team.activecount || 0
                        }}
                      </span>
                      <span>节</span>
                    </span>
                    <span>
                      <span>作品</span>
                      <span>{{ team.task_count || team.taskcount || 0 }}</span>
                      <span>张</span>
                    </span>
                  </div>
                </div>
                <div class="teacher-info">
                  <div class="dept">
                    <span class="label">负责{{ teacherTitle(team) }}：</span>
                    <span>
                      <span>
                        <span>
                          {{
                          (team.teacherInfo && team.teacherInfo.realname) ||
                          '--'
                          }}
                        </span>
                      </span>
                      <span>·</span>
                      <span>
                        {{
                        (team.teacherInfo && team.teacherInfo.allDeptName) ||
                        '--'
                        }}
                      </span>
                    </span>
                  </div>
                  <div class="we-chat">
                    <span class="label">{{ teacherTitle(team) }}电话：</span>
                    <span>
                      {{
                      team.teacherInfo && team.teacherInfo.phone
                      }}
                    </span>
                    <span class="label">{{ teacherTitle(team) }}微信：</span>
                    <span v-if="team.teacherInfo && team.teacherInfo.weixin">
                      {{
                      team.teacherInfo.weixin[0] &&
                      team.teacherInfo.weixin[0].weixin_no
                      }}
                    </span>
                    <span v-else>
                      {{
                      team.teacherWeixinRelationInfo &&
                      team.teacherWeixinRelationInfo.weixin_no
                      }}
                    </span>
                  </div>
                </div>
                <div class="team-info">
                  <div>
                    <div class="label">所属班级</div>
                    <div class="class-name" @click="goClassDetail(team)">
                      {{
                      team.teamname ||
                      (team.teamInfo && team.teamInfo.team_name) ||
                      ''
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="label">加{{ teacherTitle(team) }}老师微信</div>
                    <el-switch
                      v-model="team.addedWechat"
                      active-color="#3582fb"
                      inactive-color="#DCDFE6"
                      :active-value="1"
                      :inactive-value="0"
                      @change="changeSwitch($event, team, index, 'wechat')"
                    ></el-switch>
                  </div>
                  <div>
                    <div class="label">进班级微信群</div>
                    <el-switch
                      v-model="team.addedGroup"
                      active-color="#3582fb"
                      inactive-color="#DCDFE6"
                      :active-value="1"
                      :inactive-value="0"
                      @change="changeSwitch($event, team, index, 'group')"
                    ></el-switch>
                  </div>
                  <div>
                    <div class="label">订单报名时间</div>
                    <div>{{ team.buytime }}</div>
                  </div>
                  <div>
                    <div class="label">班级课程进度</div>
                    <div>
                      <span>{{ team.current_lesson }}</span>
                      <!-- <span>{{
                      courseLevelReplace(team.currentsuper) ||
                        team.current_lesson
                      }}</span>-->
                    </div>
                  </div>
                  <div v-if="!isTrial(team)">
                    <div class="label">订单购买周数/剩余周数</div>
                    <div>
                      <span>{{ team.packagescourseweek || '--' }}/</span>
                      <span>{{ team.remaining_week || '--' }}</span>
                    </div>
                  </div>
                  <div v-if="isTrial(team)">
                    <div class="label">班级开课日期</div>
                    <div>
                      <!-- {{
                        (team.courseTime && team.courseTime.course_day) || '--'
                      }}-->
                      {{ (team.teamInfo && team.teamInfo.class_start) || '--' }}
                    </div>
                  </div>
                  <div v-if="isTrial(team)">
                    <div class="label">班级结课日期</div>
                    <div>
                      <!-- {{
                        (team.courseTime && team.courseTime.end_course_day) ||
                          '--'
                      }}-->
                      {{ (team.teamInfo && team.teamInfo.class_end) || '--' }}
                    </div>
                  </div>
                  <div v-if="!isTrial(team)">
                    <div class="label">班级开课日期</div>
                    <div>
                      <!-- {{
                        (team.courseTime && team.courseTime.course_day) || '--'
                      }}-->
                      {{ team.class_start || '--' }}
                    </div>
                  </div>
                  <div v-if="!isTrial(team)">
                    <div class="label">班级结课日期</div>
                    <div>
                      <!-- {{
                        (team.courseTime && team.courseTime.end_course_day) ||
                          '--'
                      }}-->
                      {{ team.class_end || '--' }}
                    </div>
                  </div>
                </div>
                <!-- <div class="team-info">
                  <div>
                    <div class="label">所属班级</div>
                    <div class="class-name" @click="goClassDetail(team)">
                      {{
                        team.teamname ||
                          (team.teamInfo && team.teamInfo.team_name) ||
                          '-'
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="label">班级课程进度</div>
                    <div>
                      <span>{{ team.current_lesson }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="label">班级开课日期</div>
                    <div>
                      {{
                        (team.courseTime && team.courseTime.course_day) || '--'
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="label">班级结课日期</div>
                    <div>
                      {{
                        (team.courseTime && team.courseTime.end_course_day) ||
                          '--'
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="label">订单报名时间</div>
                    <div>{{ team.buytime }}</div>
                  </div>
                  <div>
                    <div class="label">加{{ teacherTitle(team) }}老师微信</div>
                    <el-switch
                      v-model="team.addedWechat"
                      active-color="#3582fb"
                      inactive-color="#DCDFE6"
                      :active-value="1"
                      :inactive-value="0"
                      @change="changeSwitch($event, team, index, 'wechat')"
                    >
                    </el-switch>
                  </div>
                  <div>
                    <div class="label">进班级微信群</div>
                    <el-switch
                      v-model="team.addedGroup"
                      active-color="#3582fb"
                      inactive-color="#DCDFE6"
                      :active-value="1"
                      :inactive-value="0"
                      @change="changeSwitch($event, team, index, 'group')"
                    >
                    </el-switch>
                  </div>
                </div>-->
              </div>
              <div class="empty-team" v-if="!teams.length">暂无班级</div>
            </section>
            <!-- 课程班级 END -->
          </div>
        </el-col>
        <el-col :span="7" class="dular">
          <trackFlow />
        </el-col>
      </el-row>
      <!-- 推荐弹窗 -->
      <recommend
        ref="recommend"
        :recommendHuman="
          stuInforAdd.sender
            ? stuInforAdd.sender
            : { username: '', user_num: '', u_id: '' }
        "
      />
      <el-dialog
        width="950px"
        title="收货地址"
        v-if="harvertAddressVisible"
        :visible.sync="harvertAddressVisible"
      >
        <harvestAddress @modifyAddressExpress="modifyAddressExpress"></harvestAddress>
      </el-dialog>
      <!-- 地址弹窗 -->
      <!-- <showAddress
        :addressData="(stuInfor.address && stuInfor.address[0]) || {}"
        ref="showAddress"
        @changeAddress="dialogTableVisible = true"
      />-->
      <!-- 修改地址 -->
      <!-- <el-dialog
        width="500px"
        title="修改收货信息"
        :visible.sync="dialogTableVisible"
      >
        <modifyAddress
          :modifyFormData="stuInfor"
          @modifyAddressExpress="modifyAddressExpress"
        />
      </el-dialog>-->
    </template>
  </div>
</template>
<script>
import { openBrowserTab, calcBrowerClienHeight } from '@/utils/index'

import { courseLevelReplace } from '@/utils/supList'
import trackFlow from '../trackFlow/index'
// import showAddress from '../addressComponents/showAddress.vue'
import harvestAddress from '../addressComponents/harvestAddress.vue'
// import modifyAddress from '../addressComponents/modifyAddress.vue'
import recommend from '../recommendComponents/recommend.vue'

export default {
  name: 'stuInfoSystem',
  props: {
    stuInforAdd: {
      type: Object,
      default: () => {}
    },
    stuInfor: {
      type: Object,
      default: () => {}
    },
    sysCourse: {
      type: Object,
      default: () => {}
    },
    teamList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    // showAddress,
    // modifyAddress,
    trackFlow,
    recommend,
    harvestAddress
  },
  mounted() {},
  async created() {
    this.getlabelWithoutAike()
    this.detailHeight = await calcBrowerClienHeight(this, 'userDetailref', 68)
    this.$root.$on('recordData', (...args) => {
      this.recommendDetails = args[0] // 被转介绍人信息对象
      console.warn('接到传值-被转介绍人信息对象', args[0])
    })
    this.$root.$on('recordDataCount', (...args) => {
      this.recommendDetailsCount = '已推荐' + args[0] + '人' // 转介绍人数
      console.warn('接到传值-转介绍体验课个数', args[0])
    })
  },
  data() {
    return {
      recommendDetails: { u_id: '', user_num: '', username: '' }, // 转介绍信息-体验课推荐人信息
      recommendDetailsCount: '--', // 转介绍信息-体验课推荐人数
      detailHeight: 'auto',
      changeSubject: this.$store.state.subjects.subjectCode,
      courseLevelReplace,
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
      // 学员标签(非艾克的全部4项)
      studentLabels: [],
      dialogTableVisible: false,
      // 该学员id
      studentId: this.$route.params.id,
      teams: [],
      harvertAddressVisible: false
    }
  },
  computed: {
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
    },
    aikelabel() {
      return (
        (this.stuInfor &&
          this.stuInfor.jluserInfo &&
          this.stuInfor.jluserInfo.labels &&
          JSON.parse(this.stuInfor.jluserInfo.labels)) ||
        []
      )
    },
    // 1v1跳过来的
    isFrom1v1() {
      const { from } = this.$route.query
      return from === '1v1'
    }
  },
  watch: {
    teamList: {
      handler(val) {
        this.teams = val.filter((team) => {
          // 系统课
          if (team.isSystemTeam === 1) {
            return team.course_state !== '0'
          }
          return team
        })
      },
      deep: true
    },
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.log(this.stuInfor, 'this.stuInfor-----------------')
        this.systemCourse()
      }
    }
  },

  methods: {
    jumpRecommendRecord() {
      this.$root.$emit('jumpPartRecommend', 'changeRecord')
    },
    teacherTitle(team) {
      return team.teamInfo && +team.teamInfo.team_type === 0 ? '销售' : '教辅'
    },
    isTrial(team) {
      return team.teamInfo && +team.teamInfo.team_type === 0
    },
    // 修改开关
    changeSwitch(val, data, index, type) {
      const { teamInfo, team_id: teamId, teamid } = data
      const courseType =
        teamInfo && +teamInfo.team_type === 0 ? 'TRAIL' : 'YEAR'

      const params = {
        teamId: teamId || teamid,
        courseType,
        studentId: this.studentId
      }
      if (type === 'wechat') {
        params.addedWechat = val
      } else if (type === 'group') {
        params.addedGroup = val
      }

      this.$http.User.updateTeamStudent(params).then((res) => {
        if (res && res.code === 0) {
          this.$message.success('修改成功')
        } else {
          // 换成原值
          if (type === 'wechat') {
            // 这么写的原因是值不是0就是1
            data.addedWechat = Math.abs(val - 1)
          } else if (type === 'group') {
            data.addedGroup = Math.abs(val - 1)
          }
        }
      })
    },
    // 获取艾克之外的标签
    async getlabelWithoutAike() {
      const { code, payload = [] } = await this.$http.User.listLabelsForUser(
        this.studentId
      ).catch((err) => {
        this.$message.error('标签获取失败')
        console.error(err)
      })
      if (code === 0 && payload.length) {
        console.log(payload, 'pppppppppppppppppppppppp')
        this.studentLabels = payload
      }
    },
    // 修改地址子组件传来的数据
    modifyAddressExpress() {
      this.dialogTableVisible = false
      this.$emit('hasEditAddress', true)
    },
    goClassDetail(team) {
      const { teamInfo, teamstate } = team
      const teamId = team.team_id || team.teamid
      if (!teamId || teamId === '0') {
        this.$message.error('缺少班级信息')
        return
      }
      const type = teamInfo && +teamInfo.team_type === 0 ? '0' : '1'
      if (teamId) {
        ;+this.changeSubject === 0
          ? openBrowserTab(`/student-team/#/teamDetail/${teamId}/${type}`)
          : openBrowserTab(
              `/write_app/#/teamDetail/${teamId}/${type}/${teamstate}`
            )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.system-details {
  .el-tabs__nav-wrap::after {
    // height: 10px !important;
  }
  .d-flex {
    display: flex;
    align-items: center;
  }
  // background: #eee;
  position: relative;
  // top: -13px;
  font-size: 14px;
  .edit-address-btn {
    margin-left: 3px;
    color: #2a75ed;
    cursor: pointer;
    min-width: 72px;
  }
  .student-info {
    border-bottom: 10px solid #eee;
    padding: 10px 15px;

    padding-bottom: 15px;
    & > p {
      margin-top: 0;
      margin-bottom: 10px;
    }
    & .student-labels {
      padding: 15px 0px;
      span {
        vertical-align: middle;
      }
      strong {
        vertical-align: middle;
        background-color: #49a3ff;
        display: inline-block;
        width: 16px;
        height: 2px;
        transform: rotate(90deg);
      }
    }
  }
  .course-team-list {
    padding: 0 10px 0 15px;
    > p {
      margin: 14px 0;
    }
    .empty-team {
    }
    .team {
      border: 1px solid #fdf6ec;
      border-radius: 2px;
      margin-bottom: 15px;
      &:not(:last-child) {
      }
      .label {
        color: #aaa;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background: #fdf6ec;
        padding: 0 10px;
        color: #333;
        .name-status {
          display: flex;
          align-items: center;
          .name {
            margin-right: 30px;
          }
          .status {
          }
        }
        .course-args {
          .count-space {
            margin-right: 3px;
          }
          span:not(:last-child) {
            // margin-right: 10px;
          }
        }
      }
      .teacher-info {
        display: flex;
        justify-content: space-between;
        margin: 0 10px;
        height: 40px;
        align-items: center;
        font-size: 12px;
        border-bottom: 1px solid #eee;
        .dept {
        }
        .we-chat {
          > span:nth-of-type(2) {
            margin-right: 15px;
          }
        }
      }
      .team-info {
        display: flex;
        padding: 10px 0;
        & > div {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          height: 50px;
          padding-left: 10px;
          font-size: 12px;
          &:not(:last-child) {
            border-right: 1px solid #eee;
          }
          > div {
            &:first-child {
              margin-bottom: 10px;
            }
            &:last-child {
              color: #999;
            }
            &.class-name {
              color: #2a75ed;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .border-right {
    border-right: 10px solid #eee;
    padding: 0 !important;
  }
  .detail-container {
    // min-height: 100%;
  }
  .dular {
    // border-top: 8px solid #eee;
  }
  .head-portrait_small {
    width: 13px;
    height: 13px;
    border-radius: 50%;
  }
  .item1 {
    // padding: 10px 0px 0px 15px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
  }
  .item1 > span:nth-of-type(1) {
    color: #aaa;
    display: inline-block;
    min-width: 60px;
    text-align: right;
  }
  .item1 /deep/ .el-link--inner {
    font-size: 12px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
