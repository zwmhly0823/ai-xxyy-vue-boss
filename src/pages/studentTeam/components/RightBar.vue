<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:41
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-23 21:50:41
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
                >开课~结课 &nbsp;{{ teamDate.formatStartDay }}~{{
                  teamDate.formatEndDay
                }}</span
              >
            </span>
            <span style="margin-right:0px">
              <span>创建 &nbsp;{{ item.timebegin }}</span>
            </span>
          </div>
        </div>
        <!-- <div class="header-right">
          <el-card shadow="never">
            <i class="el-icon-plus"></i>
            <span>关联微信群</span>
          </el-card>
        </div> -->
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
import axios from '@/api/axios'
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
      day: {}
    }
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
    getClassTeacher(data, star, end) {
      const queryParams = `[{id:${data}}]`
      axios
        .get('/graphql/getClassTeacher', {
          params: {
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
          }
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
            // res.data.detail.formatStartDay = star
            // res.data.detail.formatEndDay = end
          }
          if (this.tableDataEmpty) {
            this.classMessage = res.data
          } else {
            this.tableDataEmpty = false
            this.classMessage = []
          }

          // this.classMessage2 = res.dataformatEndDay
        })
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
  // }
  // .header-right {
  //   white-space: nowrap;
  //   .el-card__body {
  //     font-size: 14px;
  //     padding: 10px 15px;
  //     span {
  //       cursor: pointer;
  //     }
  // }
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
</style>
