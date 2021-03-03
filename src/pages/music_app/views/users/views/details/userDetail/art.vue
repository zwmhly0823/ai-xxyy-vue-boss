<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-17 19:37:24
 * @LastEditors: Shentong
 * @LastEditTime: 2021-02-05 21:08:35
-->
<template>
  <div class="system-details">
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
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="item1">
                    <span class="label">微信号：</span>
                    <span class="">{{
                      stuInfor.jluserInfo
                        ? stuInfor.jluserInfo.wechat_no || '-'
                        : '-'
                    }}</span>
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
                      >{{ item }}</el-tag
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="7"
                  ><div class="item1">
                    <span>注册时间：</span>
                    <span>{{ stuInforAdd.join_date }}</span>
                  </div></el-col
                >
                <el-col :span="17">
                  <div class="item1">
                    <span>注册渠道：</span>
                    <span class="">{{
                      stuInforAdd.channelInfo &&
                        (stuInforAdd.channelInfo.channel_inner_name || '-')
                    }}</span>
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
                </el-col> -->
              </el-row>
              <el-row :gutter="15">
                <el-col :span="24">
                  <div class="item1">
                    <span class="label">默认地址：</span>
                    <span v-if="stuInfor.address && stuInfor.address.length">
                      <span>{{ stuInfor.address[0].province || '-' }} ·</span>
                      <span>{{ stuInfor.address[0].city || '-' }} ·</span>
                      <span>{{ stuInfor.address[0].area || '-' }} ·</span>
                      <span>{{
                        stuInfor.address[0].address_detail || '-'
                      }}</span>
                      <span
                        class="edit-address-btn"
                        @click="$refs.showAddress.showAddress = true"
                        >「管理地址」</span
                      >
                    </span>
                  </div>
                </el-col>
              </el-row>
              <p :style="{ marginTop: '10px' }">转介绍信息</p>
              <el-row :gutter="15">
                <el-col :span="7">
                  <div class="item1">
                    <span class="label" :style="{ width: '90px' }"
                      >体验课推荐人：</span
                    >
                    <el-link
                      v-if="recommendDetails.u_id"
                      type="primary"
                      :href="'/music_app/#/details/' + recommendDetails.u_id"
                      target="_blank"
                      >{{
                        recommendDetails.username +
                          '·' +
                          recommendDetails.user_num
                      }}</el-link
                    >
                    <span v-else>--</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item1">
                    <span class="label" :style="{ width: '100px' }"
                      >体验课推荐记录：</span
                    >
                    <el-button
                      size="mini"
                      type="text"
                      @click="jumpRecommendRecord"
                      >{{ recommendDetailsCount }}</el-button
                    >
                  </div>
                </el-col>
              </el-row>
              <!-- 标签 start -->
              <el-row>
                <div class="student-labels">
                  <!-- <strong></strong> -->
                  <span>学员标签</span>
                  <span style="color:#aaa;font-size:14px"
                    >（ 包含微信标签 ）</span
                  >
                </div>
                <section v-if="!studentLabels.length && !aikelabel.length">
                  <el-row>
                    <el-col :span="7" style="color:#aaa">
                      暂无标签
                    </el-col>
                  </el-row>
                </section>
                <section v-else>
                  <el-tag
                    style="margin-right:10px"
                    type="sucess"
                    size="mini"
                    v-for="item of aikelabel"
                    :key="item"
                    >{{ item }}</el-tag
                  >
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
                      >{{
                        item.subject === 'ART_APP'
                          ? formatTeamNameSup(item.name)
                          : item.name
                      }}</el-tag
                    >
                  </span>
                </section>
              </el-row>
              <!-- 标签 END -->
            </section>
            <!-- 第2部分课程班级 START -->
            <section class="course-team-list">
              <div class="team-cut-tabs">
                <div v-if="teamCutTabs.length > 1" style="display:flex">
                  <div
                    class="tab"
                    :class="{ active: curTeamTab == index }"
                    v-for="(tab, index) in teamCutTabs"
                    :key="`team-cut-${index}`"
                    @click="cutTeamStatus(index)"
                  >
                    <span>{{ tab.label }}</span>
                  </div>
                </div>
                <div
                  v-else-if="
                    teamCutTabs[0].label === '体验课信息' &&
                      teamCutTabs.length === 1
                  "
                >
                  <div
                    class="tab"
                    :class="{ active: curTeamTab == 1 }"
                    v-for="(tab, index) in teamCutTabs"
                    :key="`team-cut-${index}`"
                    @click="cutTeamStatus(index)"
                  >
                    <span>{{ tab.label }}</span>
                  </div>
                </div>
                <div
                  v-else-if="
                    teamCutTabs[0].label === '系统课信息' &&
                      teamCutTabs.length === 1
                  "
                >
                  <div
                    class="tab"
                    :class="{ active: curTeamTab == 0 }"
                    v-for="(tab, index) in teamCutTabs"
                    :key="`team-cut-${index}`"
                    @click="cutTeamStatus(index)"
                  >
                    <span>{{ tab.label }}</span>
                  </div>
                </div>
                <div
                  v-else-if="
                    teamCutTabs[0].label === '暂无班级信息' &&
                      teamCutTabs.length === 1
                  "
                >
                  <div
                    class="tab"
                    :class="{ active: curTeamTab == 2 }"
                    v-for="(tab, index) in teamCutTabs"
                    :key="`team-cut-${index}`"
                    @click="cutTeamStatus(index)"
                  >
                    <span>{{ tab.label }}</span>
                  </div>
                </div>
              </div>
              <teamTmp
                @orderList="orderList"
                :sys_student_details="sys_student_details"
                :curTeamTab="curTeamTab"
              />
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
      <!-- 地址弹窗 -->
      <showAddress
        :addressData="(stuInfor.address && stuInfor.address[0]) || {}"
        ref="showAddress"
        @changeAddress="dialogTableVisible = true"
      />
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
    </template>
  </div>
</template>
<script>
import { openBrowserTab, calcBrowerClienHeight } from '@/utils/index'
import { SUP_LEVEL_UPPER, formatTeamNameSup } from '@/utils/supList'
import trackFlow from '../trackFlow/index'
import showAddress from '../addressComponents/showAddress.vue'
import modifyAddress from '../addressComponents/modifyAddress.vue'
import recommend from '../recommendComponents/recommend.vue'
import teamTmp from './teamTmp'
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
    showAddress,
    modifyAddress,
    recommend,
    teamTmp,
    trackFlow
  },
  mounted() {
    this.sysStudentDetails()
  },
  async created() {
    this.detailHeight = await calcBrowerClienHeight(this, 'userDetailref', 68)
    this.getlabelWithoutAike()
    this.$root.$on('recordData', (...args) => {
      this.recommendDetails = args[0] // 被转介绍人信息对象
    })
    this.$root.$on('recordDataCount', (...args) => {
      this.recommendDetailsCount = '已推荐' + args[0] + '人' // 转介绍人数
    })
  },
  data() {
    return {
      sys_student_details: null,
      recommendDetails: { u_id: '', user_num: '', username: '' }, // 转介绍信息-体验课推荐人信息
      recommendDetailsCount: '--', // 转介绍信息-体验课推荐人数
      detailHeight: 'auto',
      changeSubject: this.$store.state.subjects.subjectCode,
      SUP_LEVEL_UPPER,
      formatTeamNameSup,
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
      // 学员标签(非艾克的全部4项)
      studentLabels: [],
      dialogTableVisible: false,
      // 该学员id
      studentId: this.$route.params.id,
      teamCutTabs: [
        {
          label: '系统课信息'
        },
        {
          label: '体验课信息'
        }
      ],
      curTeamTab: 0, // 当前选中的系统课、体验课
      teams: []
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
        this.systemCourse()
      }
    }
  },
  methods: {
    // 跳转订单列表
    orderList(val) {
      console.log(val, '-------9999999')
      this.$emit('orderLists', val)
    },
    // 获取学员详情
    sysStudentDetails() {
      const data = {
        uid: this.studentId
      }
      this.$http.User.sysStudentDetails(data)
        .then((res) => {
          console.log(res, '学员信息------------------')
          this.sys_student_details = res.data && res.data.StudentDetails
          if (
            res.data.StudentDetails.trialOfStudentDetails === null &&
            res.data.StudentDetails.systemCourseOfStudentDetails === null
          ) {
            this.teamCutTabs = [
              {
                label: '暂无班级信息'
              }
            ]
            return
          }
          if (res.data.StudentDetails.systemCourseOfStudentDetails === null) {
            this.teamCutTabs = [
              {
                label: '体验课信息'
              }
            ]
            this.curTeamTab = 1
          }
          if (res.data.StudentDetails.trialOfStudentDetails === null) {
            this.teamCutTabs = [
              {
                label: '系统课信息'
              }
            ]
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    /**
     * @description 切换系统课信息、体验课信息
     */
    cutTeamStatus(index) {
      console.log('index=tem', index, this.curTeamTab)
      if (this.teamCutTabs.length === 1) {
        return
      }
      if (index !== this.curTeamTab) {
        this.curTeamTab = index
      }
    },
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
        this.studentLabels = payload
      }
    },
    // 修改地址子组件传来的数据
    modifyAddressExpress() {
      this.dialogTableVisible = false
      this.$emit('hasEditAddress', true)
    },
    goClassDetail(team) {
      const { teamInfo } = team
      const teamId = team.team_id || team.teamid
      if (!teamId || teamId === '0') {
        this.$message.error('缺少班级信息')
        return
      }
      const type = teamInfo && +teamInfo.team_type === 0 ? '0' : '1'
      teamId && openBrowserTab(`/student-team/#/teamDetail/${teamId}/${type}`)
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
    .team-cut-tabs {
      display: flex;
      background: #f9f9f9;
      padding-left: 10px;
      .tab {
        width: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        color: #333;
        cursor: pointer;
        &.active {
          background: #fff;
          color: #2a75ed;
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
}
</style>
