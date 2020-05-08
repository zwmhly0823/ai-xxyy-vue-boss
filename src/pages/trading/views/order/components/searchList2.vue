<!--
 * @Descripttion: 系统课搜索栏
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:24:23
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-07 19:13:43
 -->
<template>
  <el-card border="false" shadow="never" :class="$style.elard">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item label="订单搜索:" :class="{ [$style.marginer]: true }">
        <orderSearch class="allmini" @result="getOrderSearch" />
      </el-form-item>

      <el-form-item label="订单来源:" :class="{ [$style.marginer]: true }">
        <ChannelSelect @result="getChannel" name="pay_channel" />
      </el-form-item>

      <!-- <el-form-item label="物流状态:" :class="{ [$style.marginer]: true }">
        <orderStatus @result="getorderStatus" />
      </el-form-item> -->
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
            name="pay_teacher_id"
            placeholder="全部销售组"
            @result="getDepartment"
          />
          <group-sell
            :teacherscope="teacherscope"
            @result="selectPayTeacher"
            name="pay_teacher_id"
            class="margin_l10"
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
          <search-trial-team-name
            teamnameType="0"
            :term="term_trial"
            :teacher-id="teacherscope_trial || teacherscope"
            @result="getTrialTeamName"
            name="team_id"
            :class="['margin_l10']"
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
import SearchTrialTeamName from '@/components/MSearch/searchItems/searchTrialTeamName'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import { isToss } from '@/utils/index'

export default {
  props: {
    // 有无收货地址
    hasaddress: {
      type: String,
      default: '' // hasaddress
    },
    changeData: {
      type: String,
      default: '' // hasaddress
    },
    // 渠道
    channel: {
      type: String,
      default: '' // channelid
    },
    // 主题
    topicType: {
      type: String,
      default: '' // topicType
    },
    // 期数
    stage: {
      type: String,
      default: '' // stage
    },
    // 排期
    schedule: {
      type: String,
      default: '' // schedule
    },
    // 难度
    sup: {
      type: String,
      default: '' // sup
    },
    addSupS: {
      type: Boolean,
      default: false // sup+S ?
    },
    // 级别
    level: {
      type: String,
      default: '' // current_level
    },
    // 下单时间
    date: {
      type: String,
      default: '' // octime
    },
    // datepicker placeholder
    datePlaceholder: {
      type: String,
      default: '下单时间'
    },
    // 班级内搜索 需要班级类型
    teamType: {
      type: String,
      default: '' // 0
    },

    // 手机号
    phone: {
      type: String,
      default: '' // phone
    },
    // 是否只搜手机号
    onlyPhone: {
      type: String,
      default: '0' // 0
    },
    // 是否只搜手机号
    phoneTip: {
      type: String,
      default: '手机号查询'
    },
    // team_id
    teamId: {
      type: String,
      default: ''
    },
    // 查询班级  搜到用户的最后一个班
    last_team_id: {
      type: String,
      default: ''
    },
    // 订单状态
    orderStatus: {
      type: String,
      default: ''
    },
    // 订单号
    outTradeNo: {
      type: String,
      default: '' // out_trade_no
    },
    // 商品名称
    productName: {
      type: String,
      default: '' // product_name
    },
    // 下拉时间选择
    timeData: {
      type: Array,
      default: null // [ {text:'创建时间',value:'ectime'}]
    },
    // 物流单号查询
    expressNo: {
      type: String,
      default: '' // express_nu
    },
    // 社群销售查询
    groupSell: {
      type: String,
      default: '' //
    },
    // 班级信息查询
    teamDetail: {
      type: String,
      default: '' //
    },
    moreVersion: {
      type: String,
      default: '' //
    },
    orderType: {
      type: String,
      default: ''
    },
    systemCourseType: {
      type: String,
      default: ''
    },
    // 销售部门
    department: {
      type: String,
      default: ''
    },
    // 搜索系统课班级名称
    searchTeamName: {
      type: String,
      default: ''
    },
    // 搜索体验课班级名称
    searchTrialTeamName: {
      type: String,
      default: ''
    },
    // 排期
    searchStage: {
      type: String,
      default: ''
    }
  },

  components: {
    // orderStatus,
    hardLevel,
    orderSearch,
    ChannelSelect,
    DatePicker,
    GroupSell,
    Department,
    SearchTrialTeamName,
    SearchStage
  },

  data() {
    return {
      cur0: false,
      cur1: false,
      cur2: false,
      cur3: false,
      teacherscope: null, // 当前选择的体验课老师范围（销售组查询）
      teacherscope_trial: null, // 当前选择的体验课老师范围
      term_trial: null, // 当前选择体验课排期
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: [],
      selectTime: null, // 物流时间下拉列表_选中项
      oldTime: '', // 上次时间选择值
      teacherId: '' // 判断是否是toss环境还是boss环境
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
      console.info(res, 'lll')
      this.setSeachParmas(res, [this.channel || 'pay_channel'], 'terms')
    },
    // 难度
    supCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.sup || 'sup'], 'terms')
    },
    // 选择订单下单时间
    getDate(res) {
      console.log(res, 'lll')
      this.setSeachParmas(res, [this.date || 'ctime'], 'range')
    },
    // 4点外移
    today() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur0 = true
      const start = new Date(new Date().toLocaleDateString()).getTime() // 设定日期,时间默认0点
      const end = Date.now()
      this.$root.$emit('fourpoint', [start, end])
    },
    yesterday() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur1 = true
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
      const date = new Date()
      date.setDate(1)
      const start = new Date(new Date(date).toLocaleDateString()).getTime()
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },
    // 选择销售老师
    selectSellTeacher(res) {
      this.setSeachParmas(res, [this.groupSell || 'pay_teacher_id'], 'wildcard')
    },
    getSystemCourseType(res) {
      this.setSeachParmas(res, [this.systemCourseType || 'system_course_type'])
    },
    // 获取订单状态
    getorderStatus(res) {
      this.setSeachParmas(res, [this.orderStatus || 'order_status'])
    },
    getDepartment(res) {
      this.teacherscope = res.pay_teacher_id || null
      this.setSeachParmas(res, [this.department || 'department'], 'terms')
    },
    // 选择社群销售
    selectPayTeacher(res) {
      if (!res.pay_teacher_id || res.pay_teacher_id.length === 0) {
        this.teacherscope_trial = null
        if (this.teacherscope && this.teacherscope.length > 0) {
          res = {
            pay_teacher_id: this.teacherscope
          }
        } else {
          res = ''
        }
      } else {
        this.teacherscope_trial = res.pay_teacher_id
      }
      this.setSeachParmas(
        res,
        [this.pay_teacher_id || 'pay_teacher_id'],
        'terms'
      )
    },
    // 体验课排期
    selectScheduleTrial(res) {
      if (res) {
        this.term_trial = res.trial_stage || ''
      } else {
        this.term_trial = ''
      }
      this.setSeachParmas(res, [this.trial_stage || 'stage'])
    },
    // 体验课难度
    supCallBackTrial(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.trial_sup || 'sup'], 'terms')
    },
    getTrialTeamName(res) {
      this.setSeachParmas(res, [this.trial_team_id || 'team_id'], 'terms')
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
<style scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
