<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-17 19:37:24
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-20 19:53:27
-->
<template>
  <div class="details" v-loading="loading">
    <div v-if="Object.keys(experience_lk).length">
      <section class="setou123">
        <strong></strong>
        <span>体验课信息</span>
      </section>
      <section>
        <el-row>
          <el-col :span="5"
            ><div class="item1">
              <span>负责销售</span
              ><span>{{
                experience_lk.teacherInfo &&
                  experience_lk.teacherInfo.realname &&
                  experience_lk.teacherInfo.realname
              }}</span
              >-
              <span>{{
                experience_lk.teacherInfo &&
                  experience_lk.teacherInfo.departmentInfo &&
                  experience_lk.teacherInfo.departmentInfo.name &&
                  experience_lk.teacherInfo.departmentInfo.name + '战队'
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>销售微信</span
              ><span>{{
                experience_lk.teacherInfo &&
                  experience_lk.teacherInfo.weixin &&
                  experience_lk.teacherInfo.weixin[0] &&
                  experience_lk.teacherInfo.weixin[0].weixin_no &&
                  (experience_lk.teacherInfo.weixin[0].weixin_no || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>销售电话</span
              ><span>{{
                experience_lk.teacherInfo &&
                  experience_lk.teacherInfo.phone &&
                  (experience_lk.teacherInfo.phone || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>购买时间</span
              ><span>{{ experience_lk.sup && (experience_lk.sup || '-') }}</span
              ><span>{{
                experience_lk.orderInfo &&
                  experience_lk.orderInfo.packages_name &&
                  (experience_lk.orderInfo.packages_name.substring(4) || '-')
              }}</span
              >·<span>{{
                experience_lk.buytime && (experience_lk.buytime || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="4"
            ><div class="item1">
              <span>购买渠道</span
              ><span>{{
                experience_lk.payChannelInfo &&
                  experience_lk.payChannelInfo.channel_inner_name &&
                  (experience_lk.payChannelInfo.channel_inner_name || '-')
              }}</span>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5"
            ><div class="item1">
              <span>所属班级</span
              ><span
                ><el-link
                  :href="
                    `/student-team/#/teamDetail/${experience_lk.teamInfo &&
                      experience_lk.teamInfo.id}/0`
                  "
                  target="_blank"
                  type="primary"
                  >{{
                    experience_lk.teamInfo &&
                      experience_lk.teamInfo.team_name &&
                      (experience_lk.teamInfo.team_name || '-')
                  }}</el-link
                ></span
              >
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>开课结课</span
              ><span>{{
                experience_lk.managementInfo &&
                  experience_lk.managementInfo.course_day &&
                  (new Date(+experience_lk.managementInfo.course_day)
                    .toLocaleDateString()
                    .substring(5) ||
                    '-')
              }}</span
              >-
              <span>{{
                experience_lk.managementInfo &&
                  experience_lk.managementInfo.end_course_day &&
                  (new Date(+experience_lk.managementInfo.end_course_day)
                    .toLocaleDateString()
                    .substring(5) ||
                    '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>课程进度</span
              ><span>{{
                experience_lk.current_lesson &&
                  (experience_lk.current_lesson || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>课前准备</span
              ><span>{{
                typeof experience_lk.added_wechat === 'number' &&
                  (experience_lk.added_wechat ? '已加微' : '未加微')
              }}</span
              >、
              <span>{{
                typeof experience_lk.added_group === 'number' &&
                  (experience_lk.added_group ? '已进群' : '未进群')
              }}</span
              >、
              <span>{{ experience_lk.express_status }}</span>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5"
            ><div class="item1">
              <span>参课/放课</span>
              <span
                >{{
                  typeof experience_lk.all_join_course_count == 'number' &&
                    ('' + experience_lk.all_join_course_count || '-')
                }}次</span
              ><span style="color:#00000000">g</span>
              <span style="color:#f56c6c">{{
                experience_lk.join_course_count || '-'
              }}</span
              >/
              <span>{{ experience_lk.send_course_count || '-' }}节</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>完课/放课</span>
              <span
                >{{
                  typeof experience_lk.all_complete_course_count === 'number' &&
                    ('' + experience_lk.all_complete_course_count || '-')
                }}次</span
              ><span style="color:#00000000">g</span
              ><span style="color:#f56c6c">{{
                experience_lk.complete_course_count || '-'
              }}</span
              >/
              <span>{{ experience_lk.send_course_count || '-' }}节</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>作品</span
              ><span style="color:#f56c6c">{{
                '' + experience_lk.task_count || '-'
              }}</span
              >张
            </div></el-col
          >
          <el-col :span="4"
            ><div class="item1">
              <span>听点评/点评</span
              ><span style="color:#f56c6c">{{
                '' + experience_lk.listen_comment_count || '-'
              }}</span
              >/<span>{{ '' + experience_lk.comment_count || '-' }}</span>
            </div></el-col
          >
        </el-row>
      </section>
    </div>
    <div v-if="Object.keys(systerm_lk).length">
      <section class="setou123 external">
        <strong></strong>
        <span>系统课信息</span>
      </section>
      <section>
        <el-row>
          <el-col :span="5"
            ><div class="item1">
              <span>负责服务</span
              ><span>{{
                systerm_lk.teacherInfo && systerm_lk.teacherInfo.realname
              }}</span
              >-
              <span>{{ systerm_lk.departmentname || '-' }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>服务微信</span
              ><span>{{
                systerm_lk.teacherInfo &&
                  systerm_lk.teacherInfo.weixin &&
                  systerm_lk.teacherInfo.weixin[0] &&
                  systerm_lk.teacherInfo.weixin[0].weixin_no &&
                  (systerm_lk.teacherInfo.weixin[0].weixin_no || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>服务电话</span
              ><span>{{
                systerm_lk.teacherInfo &&
                  systerm_lk.teacherInfo.phone &&
                  (systerm_lk.teacherInfo.phone || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>购买时间</span
              ><span>{{
                systerm_lk.currentsuper && (systerm_lk.currentsuper || '-')
              }}</span
              ><span>{{
                systerm_lk.orderInfo &&
                  systerm_lk.orderInfo.packages_name &&
                  (systerm_lk.orderInfo.packages_name.substring(4) || '-')
              }}</span
              >·<span>{{
                systerm_lk.orderInfo &&
                  systerm_lk.orderInfo.buytime &&
                  (systerm_lk.orderInfo.buytime || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="4"
            ><div class="item1">
              <span>购买渠道</span
              ><span>{{ systerm_lk.channel_outer_name || '-' }}</span>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5"
            ><div class="item1">
              <span>所属班级</span
              ><span
                ><el-link
                  :href="
                    `/student-team/#/teamDetail/${systerm_lk.teamid &&
                      systerm_lk.teamid}/0`
                  "
                  target="_blank"
                  type="primary"
                  >{{ systerm_lk.teamname || '-' }}</el-link
                ></span
              >
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>开课时间</span
              ><span>{{
                systerm_lk.managementInfo &&
                  systerm_lk.managementInfo.course_day &&
                  (new Date(
                    +systerm_lk.managementInfo.course_day
                  ).toLocaleDateString() ||
                    '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>课程进度</span
              ><span>{{
                systerm_lk.currentsuper && (systerm_lk.currentsuper || '-')
              }}</span>
              <span>{{
                systerm_lk.currentlevel && (systerm_lk.currentlevel || '-')
              }}</span>
              <span>{{
                systerm_lk.currentunit && (systerm_lk.currentunit || '-')
              }}</span>
              <span>{{
                systerm_lk.currentlesson && (systerm_lk.currentlesson || '-')
              }}</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>课前准备</span
              ><span>{{
                typeof systerm_lk.addedwechat === 'number' &&
                  (systerm_lk.addedwechat ? '已加微' : '未加微')
              }}</span
              >、
              <span>{{
                typeof systerm_lk.addedgroup === 'number' &&
                  (systerm_lk.addedgroup ? '已进群' : '未进群')
              }}</span
              >、
              <span>{{ systerm_lk.expressstatus }}</span>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5"
            ><div class="item1">
              <span>参课/放课</span>
              <span
                >{{
                  typeof systerm_lk.all_noactivecount === 'number' &&
                    ('' + systerm_lk.all_noactivecount || '-')
                }}次</span
              >
              <span style="color:#00000000">g</span
              ><span style="color:#f56c6c">{{
                systerm_lk.activecount || '-'
              }}</span
              >/
              <span>{{ systerm_lk.currenttotal || '-' }}节</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>完课/放课</span>
              <span
                >{{
                  typeof systerm_lk.all_activecount === 'number' &&
                    ('' + systerm_lk.all_activecount || '-')
                }}次</span
              ><span style="color:#00000000">g</span
              ><span style="color:#f56c6c">{{
                systerm_lk.activecount || '-'
              }}</span
              >/
              <span>{{ systerm_lk.currenttotal || '-' }}节</span>
            </div></el-col
          >
          <el-col :span="5"
            ><div class="item1">
              <span>作品</span
              ><span style="color:#f56c6c">{{
                '' + systerm_lk.taskcount || '-'
              }}</span
              >张
            </div></el-col
          >
          <el-col :span="4"
            ><div class="item1">
              <span>听点评/点评</span
              ><span style="color:#f56c6c">{{
                '' + systerm_lk.flagcount || '-'
              }}</span
              >/<span>{{ '' + systerm_lk.flag_total_count || '-' }}</span>
            </div></el-col
          >
        </el-row>
      </section>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'

export default {
  created() {
    this.tiyan()
    this.xitong()
  },
  data() {
    return {
      experience_lk: {},
      systerm_lk: {},
      loading: false,
      userId: this.$route.params.id
    }
  },
  methods: {
    // 体验课
    async tiyan() {
      const {
        data: { StudentTrialV2Statistics }
      } = await this.$http.User.StudentTrialV2Statistics(
        this.$route.params.id
      ).catch((err) => {
        console.error(err)
        this.$message.error('该学员体验课信息获取失败')
      })
      if (StudentTrialV2Statistics) {
        StudentTrialV2Statistics.buytime = formatDate(
          +StudentTrialV2Statistics.buytime
        )
        StudentTrialV2Statistics.express_status = {
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
        }[String(StudentTrialV2Statistics.express_status)]
        this.experience_lk = StudentTrialV2Statistics
      }
    },
    // 系统课
    async xitong() {
      const {
        data: { StudentSystemStatisticsList }
      } = await this.$http.User.StudentSystemStatisticsList(
        this.$route.params.id
      ).catch((err) => {
        console.error(err)
        this.$message.error('该学员体验课信息获取失败')
      })
      if (StudentSystemStatisticsList[0]) {
        StudentSystemStatisticsList[0].orderInfo.buytime = formatDate(
          +StudentSystemStatisticsList[0].orderInfo.buytime
        )
        StudentSystemStatisticsList[0].expressstatus = {
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
        }[String(StudentSystemStatisticsList[0].expressstatus)]
        this.systerm_lk = StudentSystemStatisticsList[0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-purple {
  background: aqua;
  height: 10px;
}
.details {
  font-size: 14px;
}
.setou123 {
  padding: 10px 0px;
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
.external {
  padding-top: 40px;
}
.item1 {
  padding: 10px 0px 0px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
}
.item1 span:nth-of-type(1) {
  color: #ccc;
  display: inline-block;
  width: 80px;
  text-align: left;
}
.item1 /deep/ .el-link--inner {
  font-size: 12px;
}
</style>
