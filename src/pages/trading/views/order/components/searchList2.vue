<!--
 * @Descripttion: 系统课搜索栏
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:24:23
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-09 22:16:07
 -->
<template>
  <el-card
    border="false"
    shadow="never"
    :class="$style.elard"
    class="search-section"
  >
    <el-form :inline="true" label-position="right" label-width="100px">
      <el-form-item label="订单搜索:" :class="{ [$style.marginer]: true }">
        <orderSearch class="allmini" @result="getOrderSearch" />
      </el-form-item>

      <el-form-item label="订单来源:" :class="{ [$style.marginer]: true }">
        <ChannelSelect @result="getChannel" name="pay_channel" />
      </el-form-item>

      <!-- <el-form-item label="物流状态:" :class="{ [$style.marginer]: true }">
        <orderStatus @result="getExpressStatus" />
      </el-form-item> -->

      <el-form-item label="推荐人信息:" :class="{ [$style.marginer]: true }">
        <div class="row_colum">
          <simple-select
            name="is_first_order_send_id"
            @result="getFirstOrder"
            :multiple="false"
            :data-list="firstOrderList"
            placeholder="全部"
          ></simple-select>
          <SearchPhoneAndUsername
            @result="getSendUser"
            :custom-style="{ width: '200px' }"
            placeholder="推荐人手机号/用户名称"
            name="first_order_send_id"
            type="2"
            v-if="hasSendId"
          />
        </div>
      </el-form-item>
      <br />

      <el-form-item label="下单时间:" :class="{ [$style.marginer]: true }">
        <DatePicker
          :class="[$style.fourPoint, 'allmini']"
          @result="getDate"
          name="ctime"
        >
          <template v-slot:buttons>
            <div class="row_colum margin_l10">
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur0 }"
                @click="today"
                >今日</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur1 }"
                @click="yesterday"
                >昨天</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur2 }"
                @click="thisweek"
                >本周</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur3 }"
                @click="thismonth"
                >本月</el-button
              >
            </div>
          </template>
        </DatePicker>
      </el-form-item>
      <br />
      <el-form-item label="体验课:" :class="{ [$style.marginer]: true }">
        <div class="row_colum">
          <department
            name="last_teacher_id"
            placeholder="全部销售组"
            @result="getDepartment"
          />
          <group-sell
            :teacherscope="teacherscope"
            is-multiple
            @result="selectPayTeacher"
            name="last_teacher_id"
            class="margin_l10"
            style="width:140px"
          />
          <search-stage
            :teacher-id="teacherscope_trial || teacherscope"
            class="margin_l10"
            name="stage"
            placeholder="全部体验课排期"
            type="0"
            @result="selectScheduleTrial"
          />
          <hardLevel
            :class="['margin_l10']"
            placeholder="体验课难度"
            style="width:140px"
            name="sup"
            @result="supCallBackTrial"
          />
          <search-team-name
            teamnameType="0"
            :term="term_trial"
            :teacher-id="teacherscope_trial || teacherscope"
            @result="getTrialTeamName"
            name="team_id"
            :class="['margin_l10']"
            style="width:140px"
          />
          <!-- BOSS 显示单双周选择 -->
          <trial-course-type
            v-if="!teacherId"
            class="margin_l10"
            name="packages_id"
            @result="getTrialCourseType"
          />
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import hardLevel from '@/components/MSearch/searchItems/hardLevel.vue' // add
import orderSearch from '@/components/MSearch/searchItems/orderSearch.vue' // add
// import orderStatus from '@/components/MSearch/searchItems/orderStatus.vue' // add
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import ChannelSelect from '@/components/MSearch/searchItems/channel.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import Department from '@/components/MSearch/searchItems/department'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import TrialCourseType from '@/components/MSearch/searchItems/trialCourseType'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
import { isToss } from '@/utils/index'

export default {
  components: {
    // orderStatus,
    hardLevel,
    orderSearch,
    ChannelSelect,
    DatePicker,
    GroupSell,
    Department,
    SearchTeamName,
    SearchStage,
    TrialCourseType,
    SearchPhoneAndUsername,
    SimpleSelect
  },

  data() {
    return {
      cur0: false,
      cur1: false,
      cur2: false,
      cur3: false,
      currentBtn: null,
      teacherscope: null, // 当前选择的体验课老师范围（销售组查询）
      teacherscope_trial: null, // 当前选择的体验课老师范围
      term_trial: null, // 当前选择体验课排期
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: [],
      selectTime: null, // 物流时间下拉列表_选中项
      oldTime: '', // 上次时间选择值
      teacherId: '', // 判断是否是toss环境还是boss环境
      firstOrderList: [
        {
          id: '1',
          text: '有推荐人'
        },
        {
          id: '0',
          text: '无推荐人'
        }
      ],
      hasSendId: true
    }
  },
  computed: {},
  methods: {
    // 订单号、手机号
    getOrderSearch(res) {
      const key = Object.keys(res || {})[0]
      const val = res[key] ? res : ''
      this.setSeachParmas(val, [key])
    },
    // 选择渠道
    getChannel(res) {
      this.setSeachParmas(res, ['pay_channel'], 'terms')
    },
    // 难度
    supCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, ['sup'], 'terms')
    },
    // 选择订单下单时间
    getDate(res) {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      if (!res || !res.quick) this.currentBtn = null
      if (res.quick && this.currentBtn) this[`cur${this.currentBtn}`] = true
      delete res.quick
      this.setSeachParmas(res, ['ctime'], 'range')
    },
    // 4点外移
    today() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur0 = true
      this.currentBtn = '0'
      const start = new Date(new Date().toLocaleDateString()).getTime() // 设定日期,时间默认0点
      const end = Date.now()
      this.$root.$emit('fourpoint', [start, end])
    },
    yesterday() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur1 = true
      this.currentBtn = '1'
      const yester = new Date()
      yester.setDate(new Date().getDate() - 1)
      yester.toLocaleDateString()
      const start = new Date(
        yester.toLocaleDateString() + ' 00:00:00'
      ).valueOf()
      const end = new Date(yester.toLocaleDateString() + ' 23:59:59').valueOf()
      this.$root.$emit('fourpoint', [start, end])
    },
    thisweek() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur2 = true
      this.currentBtn = '2'
      const week = new Date()
      const reverseDays = week.getDay() ? week.getDay() - 1 : 6
      const start =
        new Date(new Date().toLocaleDateString()).getTime() -
        reverseDays * 86400000
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },
    thismonth() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur3 = true
      this.currentBtn = '3'
      const date = new Date()
      date.setDate(1)
      const start = new Date(new Date(date).toLocaleDateString()).getTime()
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },
    // 选择销售老师
    selectSellTeacher(res) {
      this.setSeachParmas(res, ['last_teacher_id'], 'wildcard')
    },
    // 获取订单状态 TODO:
    getExpressStatus(res) {
      this.setSeachParmas(res, ['express_status'])
    },
    getDepartment(res) {
      this.teacherscope = res.last_teacher_id || null
      this.setSeachParmas(res, ['last_teacher_id'], 'terms')
    },
    // 选择社群销售
    selectPayTeacher(res) {
      if (!res.last_teacher_id || res.last_teacher_id.length === 0) {
        this.teacherscope_trial = null
        if (this.teacherscope && this.teacherscope.length > 0) {
          res = {
            last_teacher_id: this.teacherscope
          }
        } else {
          res = ''
        }
      } else {
        this.teacherscope_trial = res.last_teacher_id
      }
      this.setSeachParmas(res, ['last_teacher_id'], 'terms')
    },
    // 体验课排期
    selectScheduleTrial(res) {
      if (res) {
        this.term_trial = res.trial_stage || ''
      } else {
        this.term_trial = []
      }
      this.setSeachParmas(res, ['stage'], 'terms')
    },
    // 体验课难度
    supCallBackTrial(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, ['sup'], 'terms')
    },
    getTrialTeamName(res) {
      this.setSeachParmas(res, ['team_id'], 'terms')
    },

    // 体验课类型
    getTrialCourseType(res) {
      this.setSeachParmas(res, ['packages_id'], 'terms')
    },

    async getSendUser(res) {
      this.setSeachParmas(res, ['first_order_send_id'], 'terms')
    },
    getFirstOrder(res) {
      if (res && res.is_first_order_send_id === '0') {
        this.hasSendId = false
      } else {
        this.hasSendId = true
      }
      this.setSeachParmas(res, ['is_first_order_send_id'])
    },

    /**  处理接收到的查询参数
     * @res: Object, 子筛选组件返回的表达式对象，如 {sup: 2}
     * @key: Array 指定res的key。如课程类型+期数选项，清除课程类型时，期数也清除了，这里要同步清除must的数据
     * @extraKey: String 默认must数组的每项值为 {term: {}}, 如果不为 term，单独指定
     * 如 {range: {lte:0,gte:0}} -> 'range'
     * @name: String 结果放到上层表达式中的位置，默认must. 可指定 should
     */
    setSeachParmas(res, key = [], extraKey = 'term', name = 'must') {
      const { must, should } = this
      const temp = name === 'must' ? must : should
      key.forEach((k) => {
        temp.forEach((item, index) => {
          if (
            item[extraKey] &&
            item[extraKey][k] &&
            (item[extraKey][k] || +item[extraKey][k] === 0)
          )
            temp.splice(index, 1)
        })
      })
      // must
      if (name === 'must') {
        if (res) {
          temp.push({
            // [`${extraKey}`]: `${JSON.stringify(res)}`
            [extraKey]: res
          })
          this.must = temp
        }
        this.$emit('search', temp)
        return
      }
      // should
      if (res) {
        temp.push({
          [`${extraKey}`]: `${JSON.stringify(res)}`
        })
        this.should = temp
      }
      this.$emit('searchShould', temp)
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
  }
}
</script>
<style lang="scss" module>
.cur {
  background-color: #ecf5ff;
}
.elard {
  border: none;
  margin-top: 5px;
}
.rw100 {
  width: 140px;
}
.marginer {
  margin-bottom: 2px;
}
.fourPoint {
  display: flex;
}
:global {
  /* 定义多个全局样式 */
  .allmini {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .row_colum {
    display: flex;
  }
  .margin_l10 {
    margin-left: 10px;
  }
}
</style>
<style lang="scss" scoped>
.search-section {
  ::v-deep .el-icon-search {
    top: 14px;
  }
}
</style>
<style scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
