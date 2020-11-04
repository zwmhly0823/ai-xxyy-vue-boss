<!--
 * @Descripttion: 班级详情-统计信息
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-04 20:53:55
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-04 20:56:19
 * 待上课只有 课前准备和本班订单，
 上课中和已完课有三个-课前准备、上课情况、本班订单
-->
<template>
  <div class="team-statistic">
    <!-- 课前准备 -->
    <el-card class="team-statistic-prepare" v-if="tab === '0'">
      <ul class="d-flex">
        <li
          v-for="(item, index) in statisticsPrePareList"
          :key="index"
          :class="[{ active: item.active }]"
          @click="chooseFilterItem(item, index)"
        >
          <h4>{{ item.value }}</h4>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </el-card>

    <!-- 上课情况 -->
    <el-card v-if="tab === '1' && status !== '0'">
      <div class="team-statistic-follow d-flex">
        <!-- left -->
        <div class="team-statistic-follow_left flex-1" v-if="+status !== 2">
          <ul class="follow-total d-flex align-start">
            <li
              v-for="(li, index) in statisticsOngoingList.topList"
              :key="index"
              :class="[{ active: li.active }]"
              @click="chooseFilterItem2('topList', li, index)"
            >
              <p>{{ li.name }}</p>
              <h4>{{ li.value || 0 }}人</h4>
            </li>
          </ul>
          <div class="follow-item d-flex align-center">
            <div class="follow-item-label">昨日</div>
            <div class="follow-item-content flex-1">
              <ul class="d-flex">
                <li
                  v-for="(li,
                  index) in statisticsOngoingList.yesterdayList.slice(0, 5)"
                  :key="index"
                  :class="[{ active: li.active }]"
                  @click="chooseFilterItem2('yesterdayList', li, index)"
                >
                  <p>{{ li.name }}</p>
                  <h4>{{ li.value || 0 }}人</h4>
                </li>
              </ul>
              <ul class="d-flex underline">
                <li
                  v-for="(li,
                  index) in statisticsOngoingList.yesterdayList.slice(5)"
                  :key="index + 5"
                  :class="[{ active: li.active }]"
                  @click="chooseFilterItem2('yesterdayList', li, index + 5)"
                >
                  <p>{{ li.name }}</p>
                  <h4>{{ li.value || 0 }}人</h4>
                </li>
                <li></li>
              </ul>
            </div>
          </div>
          <div class="follow-item d-flex align-center">
            <div class="follow-item-label">今日</div>
            <div class="follow-item-content flex-1">
              <ul class="d-flex flex-1">
                <li
                  :class="[{ active: li.active }]"
                  v-for="(li, index) in statisticsOngoingList.todayList.slice(
                    0,
                    5
                  )"
                  :key="index"
                  @click="chooseFilterItem2('todayList', li, index)"
                >
                  <p>{{ li.name }}</p>
                  <h4>{{ li.value || 0 }}人</h4>
                </li>
              </ul>
              <ul class="d-flex">
                <li
                  :class="[{ active: li.active }]"
                  v-for="(li, index) in statisticsOngoingList.todayList.slice(
                    5
                  )"
                  :key="index + 5"
                  @click="chooseFilterItem2('todayList', li, index + 5)"
                >
                  <p>{{ li.name }}</p>
                  <h4>{{ li.value || 0 }}人</h4>
                </li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- right 小计 -->
        <div
          class="team-statistic-follow_right"
          :class="[{ 'width-100': +status === 2 }]"
        >
          <div class="right-total-box" v-if="+status === 2">
            <span
              class="box-item"
              :class="[{ 'box-item-active': item.active }]"
              v-for="(item, index) in statisticsOngoingList.topList"
              :key="index"
              @click="chooseFilterItem2('topList', item, index)"
            >
              {{ item.name }}
              <span class="box-num">{{ item.value || 0 }}人</span>
            </span>
          </div>
          <h3>完课小计</h3>
          <ul class="d-flex wrap">
            <li
              v-for="(item, index) in statisticsOngoingList.rightList"
              :key="item.code"
              :class="[{ active: item.active }]"
              @click="chooseFilterItem2('rightList', item, index)"
            >
              <p>完{{ item.code }}节</p>
              <h4>{{ item.value || 0 }}人</h4>
            </li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 本班订单 -->
    <el-card v-if="tab === '2'">
      <div class="team-statistic-order d-flex justify-center">
        <ul class="d-flex">
          <li
            @click="getFilter('all')"
            :class="{ active: currentFilter === 'all' }"
          >
            <h4>
              {{ statistics.total_system_order_count || 0 }}<span>笔</span>
            </h4>
            <p>全部单</p>
          </li>
          <li
            @click="getFilter('complete')"
            :class="{ active: currentFilter === 'complete' }"
          >
            <h4>
              {{
                (statistics.system_order_amount &&
                  (+statistics.system_order_amount).toFixed(2)) ||
                  0
              }}<span>元 / {{ statistics.system_order_count || 0 }}笔</span>
            </h4>
            <p>已成单</p>
          </li>
          <li
            @click="getFilter('yestoday')"
            :class="{ active: currentFilter === 'yestoday' }"
          >
            <h4>
              {{
                (statistics.yesterday_system_order_amount &&
                  (+statistics.yesterday_system_order_amount).toFixed(2)) ||
                  0
              }}<span>
                元 /
                {{ statistics.yesterday_system_order_count || 0 }}笔</span
              >
            </h4>
            <p>昨日成单</p>
          </li>
          <li
            @click="getFilter('today')"
            :class="{ active: currentFilter === 'today' }"
          >
            <h4>
              {{
                statistics.today_system_order_amount &&
                  (+statistics.today_system_order_amount).toFixed(2)
              }}<span> 元 / {{ statistics.today_system_order_count }}笔</span>
            </h4>
            <p>今日成单</p>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { todayTimestamp, tomorrowTimestamp } from '@/pages/users/utils.js'
export default {
  props: {
    teamId: String,
    // 班级状态  0-待上课，1-上课中，2-已完课
    status: {
      type: String,
      default: '0'
    },
    // tab 0-课前准备, 1-上课情况, 2-本班订单
    tab: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      statistics: {},
      statisticsPrePareList: [],
      statisticsOngoingList: {
        topList: [],
        yesterdayList: [],
        todayList: [],
        rightList: []
      },
      curPrepareActive: -1,
      curPosition: '',
      curOngoningActive: -1,
      // 当前选中的统计项,作为筛选条件
      currentFilter: '',
      // 筛选条件
      filterParams: {}
    }
  },
  computed: {
    listenProps() {
      return { teamId: this.teamId, tab: this.tab }
    }
  },
  created() {
    this.getTrailTeamStatistics()
    this.filterParams = {}
    this.currentFilter = ''
  },
  watch: {
    listenProps(val, old) {
      this.getTrailTeamStatistics()
      this.currentFilter = ''
    }
  },
  methods: {
    // 点击统计项作为当前列表筛选条件，传给列表参数
    getFilter(key) {
      // console.log(key)
      this.currentFilter = key
      // 全部
      if (key === 'all') {
        this.filterParams = {}
        this.$emit('filter', this.filterParams)
        return
      }
      /**
       * 上课情况
       */
      if (this.tab === '1') {
        //
      }

      /**
       * 订单
       */
      if (this.tab === '2') {
        switch (key) {
          case 'complete':
            // Object.assign(this.filterParams, { status: '3' })
            this.filterParams = { status: '3' }
            break
          case 'yestoday':
            this.filterParams = { buytime: this.yestoday() }
            break
          case 'today':
            this.filterParams = { buytime: this.today() }
            break
          default:
        }
      }

      this.$emit('filter', this.filterParams)
    },

    // 今日时间范围 0点-24点
    today() {
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      const end = new Date()
      end.setHours(24, 0, 0, 0)
      return { gte: start.getTime(), lte: end.getTime() }
    },

    // 昨天
    yestoday() {
      const end = new Date()
      end.setHours(0, 0, 0, 0)
      const start = new Date()
      start.setDate(start.getDate() - 1)
      start.setHours(0, 0, 0, 0)
      const startStr = start.getTime()
      const endStr = end.getTime()
      return { gte: startStr, lte: endStr }
    },

    /**
     * 获取本班级统计数据。 根据tab状态请求相应数据
     */
    getTrailTeamStatistics() {
      if (!this.teamId) {
        this.$message.error('缺少班级ID')
        return
      }
      const params = {
        id: this.teamId
      }
      this.$http.TeamV2.getTrialTeamStatisticsExtra(params, this.tab).then(
        (res) => {
          const data = res?.data?.StudentTrialTeamStatisticsExtra || {}
          // 上课情况 - 完课小结
          if (this.tab === '1' && data.complete_course_count_group) {
            data.complete_course_count_group =
              JSON.parse(data.complete_course_count_group) || []
          }
          this.statistics = data
          if (this.tab === '0') {
            this.initPrePareList()
          }
          if (this.tab === '1' && this.status !== '0') {
            this.initOngoingList()
          }
          // 渲染完毕后的回调
          this.$nextTick(() => {
            this.$emit('teamStatisticFinish')
          })
        }
      )
    },
    // 变成数组用来渲染
    initPrePareList() {
      const today = todayTimestamp()
      const tomorrow = tomorrowTimestamp()
      this.statisticsPrePareList = [
        {
          name: '总人数',
          value: this.statistics.student_count || 0,
          filter: {}
        },
        {
          name: '待加好友',
          // value: this.statistics.un_added_wechat_count || 0,
          // filter: { added_wechat: 0 }
          value: this.statistics.un_added_wechat_uids?.length || 0,
          filter: { id: this.statistics.un_added_wechat_uids }
        },
        {
          name: '待绑定公众号',
          // value: this.statistics.un_follow_count || 0,
          // filter: { follow: 0 }
          value: this.statistics.un_added_group_uids?.length || 0,
          filter: { id: this.statistics.un_added_group_uids }
        },
        {
          name: '待添加发货地址',
          value: this.statistics.no_address_count || 0,
          filter: { express_address_id: '0' }
        },
        {
          name: '待发货',
          value: this.statistics.to_be_delivered_count || 0,
          filter: { express_status: ['1'] }
        },
        {
          name: '待进群',
          value: this.statistics.un_added_group_count || 0,
          filter: { added_group: 0 }
        },
        {
          name: '待登陆APP',
          value: this.statistics.un_open_app_count || 0,
          filter: { is_login: 0 }
        },
        {
          name: '今日待跟进',
          value: this.statistics.today_track_count || 0,
          filter: { is_track: 1, today }
        },
        {
          name: '明日待跟进',
          value: this.statistics.tomorrow_track_count || 0,
          filter: { is_track: 1, today: tomorrow }
        }
      ]
    },
    initOngoingList() {
      const today = todayTimestamp()
      const tomorrow = tomorrowTimestamp()
      this.statisticsOngoingList.topList = [
        {
          name: '总人数:',
          value: this.statistics.student_count,
          filter: {}
        },
        {
          name: '今日待跟进:',
          value: this.statistics.today_track_count,
          filter: { is_track: 1, today }
        },
        {
          name: '明日待跟进:',
          value: this.statistics.tomorrow_track_count,
          filter: { is_track: 1, today: tomorrow }
        }
      ]
      this.statisticsOngoingList.yesterdayList = [
        {
          name: '参课:',
          value:
            this.statistics.yesterday_join_course_uids &&
            this.statistics.yesterday_join_course_uids.length,
          filter: { id: this.statistics.yesterday_join_course_uids }
        },
        {
          name: '完课:',
          value:
            this.statistics.yesterday_complete_course_uids &&
            this.statistics.yesterday_complete_course_uids.length,
          filter: { id: this.statistics.yesterday_complete_course_uids }
        },
        {
          name: '传作品:',
          value:
            this.statistics.yesterday_course_task_uids &&
            this.statistics.yesterday_course_task_uids.length,
          filter: { id: this.statistics.yesterday_course_task_uids }
        },
        {
          name: '点评:',
          value:
            this.statistics.yesterday_task_comment_uids &&
            this.statistics.yesterday_task_comment_uids.length,
          filter: { id: this.statistics.yesterday_task_comment_uids }
        },
        {
          name: '听点评:',
          value:
            this.statistics.yesterday_listen_comment_uids &&
            this.statistics.yesterday_listen_comment_uids.length,
          filter: { id: this.statistics.yesterday_listen_comment_uids }
        },
        {
          name: '未参课:',
          value:
            this.statistics.yesterday_un_join_course_uids &&
            this.statistics.yesterday_un_join_course_uids.length,
          filter: { id: this.statistics.yesterday_un_join_course_uids }
        },
        {
          name: '未完课:',
          value:
            this.statistics.yesterday_un_complete_course_uids &&
            this.statistics.yesterday_un_complete_course_uids.length,
          filter: { id: this.statistics.yesterday_un_complete_course_uids }
        },
        {
          name: '未听点评:',
          value:
            this.statistics.yesterday_un_listen_comment_uids &&
            this.statistics.yesterday_un_listen_comment_uids.length,
          filter: { id: this.statistics.yesterday_un_listen_comment_uids }
        },
        {
          name: '未打开APP:',
          value:
            this.statistics.yesterday_un_open_app_uids &&
            this.statistics.yesterday_un_open_app_uids.length,
          filter: { id: this.statistics.yesterday_un_open_app_uids }
        }
      ]
      this.statisticsOngoingList.todayList = [
        {
          name: '参课:',
          value:
            this.statistics.today_join_course_uids &&
            this.statistics.today_join_course_uids.length,
          filter: { id: this.statistics.today_join_course_uids }
        },
        {
          name: '完课:',
          value:
            this.statistics.today_complete_course_uids &&
            this.statistics.today_complete_course_uids.length,
          filter: { id: this.statistics.today_complete_course_uids }
        },
        {
          name: '传作品:',
          value:
            this.statistics.today_course_task_uids &&
            this.statistics.today_course_task_uids.length,
          filter: { id: this.statistics.today_course_task_uids }
        },
        {
          name: '点评:',
          value:
            this.statistics.today_task_comment_uids &&
            this.statistics.today_task_comment_uids.length,
          filter: { id: this.statistics.today_task_comment_uids }
        },
        {
          name: '听点评:',
          value:
            this.statistics.today_listen_comment_uids &&
            this.statistics.today_listen_comment_uids.length,
          filter: { id: this.statistics.today_listen_comment_uids }
        },
        {
          name: '未参课:',
          value:
            this.statistics.today_un_join_course_uids &&
            this.statistics.today_un_join_course_uids.length,
          filter: { id: this.statistics.today_un_join_course_uids }
        },
        {
          name: '未完课:',
          value:
            this.statistics.today_un_complete_course_uids &&
            this.statistics.today_un_complete_course_uids.length,
          filter: { id: this.statistics.today_un_complete_course_uids }
        },
        {
          name: '未听点评:',
          value:
            this.statistics.today_un_listen_comment_uids &&
            this.statistics.today_un_listen_comment_uids.length,
          filter: { id: this.statistics.today_un_listen_comment_uids }
        },
        {
          name: '未打开APP:',
          value:
            this.statistics.today_un_open_app_uids &&
            this.statistics.today_un_open_app_uids.length,
          filter: { id: this.statistics.today_un_open_app_uids }
        }
      ]
      this.statisticsOngoingList.rightList = []
      for (
        let i = 0, len = +this.statistics.send_course_count_per_student || 0;
        i <= len;
        i++
      ) {
        this.statisticsOngoingList.rightList.push({
          code: i,
          value: 0
        })
        for (const index in this.statistics.complete_course_count_group) {
          const item = this.statistics.complete_course_count_group[index]
          if (+item.code === i) {
            this.statisticsOngoingList.rightList[i].value = item.value
          }
        }
      }
    },
    chooseFilterItem(item, index) {
      if (index === this.curPrepareActive) {
        return
      }
      this.$set(this.statisticsPrePareList[index], 'active', true)
      if (this.curPrepareActive > -1) {
        this.$set(
          this.statisticsPrePareList[this.curPrepareActive],
          'active',
          false
        )
      }
      this.curPrepareActive = index
      this.$emit('filter', item.filter)
    },
    chooseFilterItem2(position, item, index) {
      if (this.curPosition === position && this.curOngoningActive === index) {
        return
      }
      if (this.curPosition) {
        this.$set(
          this.statisticsOngoingList[this.curPosition][this.curOngoningActive],
          'active',
          false
        )
      }
      this.curPosition = position
      this.curOngoningActive = index
      this.$set(
        this.statisticsOngoingList[this.curPosition][this.curOngoningActive],
        'active',
        true
      )
      if (position === 'rightList') {
        this.$emit('filter', { complete_course_count: item.code })
      } else {
        this.$emit('filter', item.filter)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$pink: #f56c6c;
.team-statistic {
  // margin-top: 10px;
  .pink {
    color: $pink !important;
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      padding: 20px 0;
      list-style: none;
      flex: 1;
      text-align: center;
      cursor: pointer;
      // 选中状态
      &.active {
        background-color: #2a75ed20;
      }
    }
  }
  h4,
  p {
    margin: 0;
  }
  h4 {
    color: #2a75ed;
    span {
      font-weight: normal;
      color: #303133;
    }
  }
  // 课前准备
  &-prepare {
    min-height: 76px;
    ul {
      width: 80%;
      margin: 0 auto;
    }
    p {
      line-height: 22px;
    }
  }
  // 课中
  &-follow {
    // min-height: 166px;
    padding: 10px 10px 10px 0;
    h4 {
      font-weight: normal;
    }
    &_left {
      min-height: 146px;
      ul li {
        display: flex;
        padding: 8px 5px;
      }
    }
    .follow-total {
      margin-left: 10px;
      li {
        flex: none;
      }
    }
    .follow-item {
      .underline {
        li {
          border-bottom: 1px solid #e3e3e3;
        }
      }
      &-label {
        margin: 0 10px 0 15px;
        width: 50px;
      }
    }
    &_right {
      min-height: 119px;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-left: 20px;
      width: 281px;
      overflow: hidden;
      h3 {
        margin: 0 0 10px 0;
        font-size: 12px;
      }
      ul {
        border: 1px solid #e3e3e3;
        max-height: 105px;
        overflow: auto;
        // border-top: 1px solid #e3e3e3;
        // border-left: 1px solid #e3e3e3;
        li {
          padding: 10px 0px;
          min-width: 39px;
          flex: none;
          // border: 1px solid #e3e3e3;
          // border-left: none;
          // border-top: none;
          p {
            margin-bottom: 10px;
          }
        }
      }
      .right-total-box {
        margin-top: -5px;
        margin-bottom: 10px;
        cursor: pointer;
        .box-item {
          padding: 7px 2px;
          margin-right: 5px;
          .box-num {
            color: #2a75ed;
          }
        }
        .box-item-active {
          background-color: #2a75ed20;
        }
      }
    }
    .width-100 {
      width: 100%;
    }
  }

  // 本班订单
  &-order {
    min-height: 76px;
    ul {
      width: 60%;
      li {
        p {
          line-height: 22px;
        }
      }
    }
  }
}
</style>
