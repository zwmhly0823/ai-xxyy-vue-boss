<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:41
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-20 12:11:25
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
            <span>{{ item.onetime }}:{{ item.team_name }}</span>
            <span class="text-icons">{{
              item.team_type == 0 ? '体验课' : '系统课'
            }}</span>
            <span class="text-icons">{{ item.week }}</span>
            <span class="text-icons">{{ item.state }}</span>
          </div>
          <div class="info">
            <span>学员:{{ item.pre_enroll }}</span>
            <span
              >辅导老师:{{
                item.teacher.nickname || item.teacher.realname
              }}</span
            >
            <span>辅导老师微信: {{ item.teacher_wx }}</span>
            <span style="margin-right:0px">
              <span>{{ item.formatCtime }}开班</span>
              <span>02-16结课</span>
            </span>
            <span style="margin-right:0px">
              <span>{{ item.timebegin }}创建</span>
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
        <div class="body-boxLeft">
          <div class="order-title">累计订单</div>
          <div class="order-number">{{ item.statictis.order_all }}</div>
          <div class="order-count">
            <span>今日{{ item.statictis.today_order }}</span>
            <span>昨日{{ item.statictis.yesterday_order }}</span>
          </div>
        </div>
        <div class="body-boxCenter" v-show="item.team_type == 0">
          <div class="Conversion-title">累计转化率</div>
          <div class="Conversion-number">
            {{ item.allTrans == 'NaN' ? 0 : (item.allTrans * 100).toFixed(2) }}
          </div>
          <div class="Conversion-count">
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
          </div>
        </div>
        <div class="body-boxRight">
          <div class="params-top">
            <div>
              <div>{{ item.statictis.wait_sent }}</div>
              <div>待发货</div>
            </div>
            <div>
              <div>{{ item.statictis.unlogin }}</div>
              <div>待登录</div>
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
              <div>{{ item.statictis.today_add_class }}</div>
              <div>今日参课</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_add_class }}</div>
              <div>昨日参课</div>
            </div>
          </div>
          <div class="params-bottom">
            <div>
              <div>{{ item.statictis.tody_comp_class }}</div>
              <div>今日完课</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_comp_class }}</div>
              <div>昨日完课</div>
            </div>
            <div>
              <div>{{ item.statictis.tody_works }}</div>
              <div>今日作品</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_works }}</div>
              <div>昨日作品</div>
            </div>
            <div>
              <div>{{ item.statictis.tody_comment }}</div>
              <div>今日点评</div>
            </div>
            <div>
              <div>{{ item.statictis.yesterday_comment }}</div>
              <div>昨日点评</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <tab-bar :classId="classId" />
  </div>
</template>

<script>
import TabBar from './TabPane/TabBar.vue'
import axios from '@/api/axios'
import dayjs from 'dayjs'
export default {
  props: {
    classId: {
      type: Object,
      default: null
    }
  },
  components: {
    TabBar
  },
  data() {
    return {
      classMessage: {}
    }
  },
  computed: {},
  watch: {
    classId(vals) {
      if (vals.classId) {
        this.classMessage = ''
        this.getClassTeacher(vals.classId.id)
      }
    }
  },
  methods: {
    getClassTeacher(data) {
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
          console.log(
            this.classId,
            this.classId.week,
            this.classId.formatCtime,
            this.classId.classId.enrolled,
            'seeek'
          )

          res.data.detail.todayTrans =
            res.data.detail.statictis.today_order /
            this.classId.classId.enrolled
          res.data.detail.yesterdayTrans =
            res.data.detail.statictis.yesterday_order /
            this.classId.classId.enrolled
          res.data.detail.allTrans =
            res.data.detail.statictis.order_all / this.classId.classId.enrolled

          res.data.detail.week = this.classId.classId.week
          res.data.detail.pre_enroll = this.classId.classId.pre_enroll
          res.data.detail.timebegin = dayjs
            .unix(Number(this.classId.classId.ctime) / 1000)
            .format('MM-DD  hh:mm:ss')
          res.data.detail.formatCtime = dayjs
            .unix(Number(this.classId.classId.ctime) / 1000)
            .format('MM-DD')
          res.data.detail.onetime = dayjs
            .unix(Number(this.classId.classId.ctime) / 1000)
            .format('YYMMDD')
          this.classMessage = res.data
          // this.classMessage2 = res.data

          console.log(
            this.classMessage,
            this.classMessage.statictis,
            res.data,
            'res'
          )
        })
    }
  },
  mounted() {
    console.log(this.classId)
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';
.right-container {
  .box-card1 {
    border-bottom: 10px solid $gray-e3;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      .header-left {
        .title {
          font-size: 16px;
          .text-icons {
            margin-left: 8px;
            padding: 0 5px;
            color: white;
            background: #41a0fa;
          }
        }
        .info {
          font-size: 12px;
          color: gray;
          margin-top: 5px;
          span {
            margin-right: 8px;
          }
        }
      }
    }
    .body {
      background: #fff;
      color: gray;
      display: flex;
      font-size: 12px;
      &-boxLeft,
      &-boxCenter,
      &-boxRight {
        padding: 10px;
        margin-right: 15px;
        background: rgba(241, 242, 242, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      &-boxLeft {
        flex: 0.3;
        .order-title {
          margin-bottom: 10px;
          flex: 1;
        }
        .order-number {
          font-size: 18px;
          margin-bottom: 10px;
          flex: 1;
        }
        .order-count {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex: 1;
        }
      }
      &-boxCenter {
        flex: 0.3;
        .Conversion-title {
          margin-bottom: 10px;
          flex: 1;
        }
        .Conversion-number {
          font-size: 18px;
          margin-bottom: 10px;
          flex: 1;
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
        margin-right: 0px;
        .params-top {
          width: 100%;
          display: flex;
          margin-bottom: 10px;
          div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
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
.header-right {
  white-space: nowrap;
  .el-card__body {
    font-size: 14px;
    padding: 10px 15px;
    span {
      cursor: pointer;
    }
  }
}
</style>
