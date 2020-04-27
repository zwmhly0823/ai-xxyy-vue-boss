<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:20:12
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-26 17:49:31
 -->

<template>
  <el-card class="search-style" shadow="never">
    <el-form :inline="true">
      <el-form-item v-if="orderType">
        <!-- 订单类型 -->
        <order-type @result="getOrderType" :name="orderType" />
      </el-form-item>

      <el-form-item v-if="phone">
        <!-- 手机号搜索 -->
        <search-phone
          @result="getPhoneHander"
          :teamId="teamId"
          :teamType="teamType"
          :name="phone"
          :onlyPhone="onlyPhone"
          :tip="phoneTip"
          :last_team_id="last_team_id"
        />
      </el-form-item>

      <el-form-item v-if="productName">
        <!-- 商品名称搜索 -->
        <product-name @result="getProductName" :name="productName" />
      </el-form-item>

      <el-form-item v-if="outTradeNo">
        <!-- 订单号搜索 -->
        <out-trade-no @result="getOutTradeNo" :name="outTradeNo" />
      </el-form-item>

      <el-form-item v-if="expressNo">
        <!-- 物流单号搜索 -->
        <express-no @result="getExpressNo" :name="expressNo" />
      </el-form-item>

      <el-form-item v-if="date">
        <!-- 下单时间 -->
        <date-picker
          :name="date"
          @result="getDate"
          :date-placeholder="datePlaceholder"
        />
      </el-form-item>

      <el-form-item v-if="timeData">
        <!-- 下拉时间选择 -->
        <select-date
          :name="timeData"
          @result="getTimeData"
          @timeCallBack="getTimeCallBack"
        />
      </el-form-item>

      <el-form-item v-if="channel">
        <!-- 渠道 -->
        <channel-select @result="getChannel" :name="channel" ref="channel" />
      </el-form-item>

      <el-form-item v-if="topicType">
        <!-- 主题 -->
        <product-topic @result="getProductTopic" :name="topicType" />
      </el-form-item>

      <el-form-item v-if="moreVersion">
        <!-- 随材版本-->
        <more-version-box @result="getVersionNu" :name="moreVersion" />
      </el-form-item>

      <el-form-item v-if="level || sup || stage">
        <stage-sup-levels
          @stageCallBack="stageCallBack"
          @supCallBack="supCallBack"
          @levelCallBack="levelCallBack"
          :disabled="true"
          :stageName="stage"
          :supName="sup"
          :levelName="level"
          :addSupS="addSupS"
          style="margin-bottom:0px"
        />
      </el-form-item>

      <el-form-item v-if="schedule">
        <!-- 排期 -->
        <Schedule @result="selectSchedule" :name="schedule" />
      </el-form-item>

      <el-form-item v-if="teamDetail">
        <!-- 班级期数-->
        <team-detail @result="getTeamDetail" :name="teamDetail" />
      </el-form-item>

      <el-form-item v-if="systemCourseType">
        <!-- 系统课类型 -->
        <system-course-type
          @result="getSystemCourseType"
          :name="systemCourseType"
        />
      </el-form-item>

      <!-- && !teacherId -->
      <el-form-item v-if="department && !teacherId">
        <!-- 社群销售组 -->
        <department @result="getDepartment" :name="department" />
      </el-form-item>

      <el-form-item v-if="groupSell && !teacherId">
        <!-- 社群销售 -->
        <group-sell @result="selectSellTeacher" :name="groupSell" />
      </el-form-item>

      <!-- && !teacherId -->
      <el-form-item v-if="searchTeamName">
        <!-- 班级名称搜索 -->
        <search-team-name @result="getTeamName" :name="searchTeamName" />
      </el-form-item>

      <!-- && !teacherId -->
      <el-form-item v-if="searchTrialTeamName">
        <!-- 体验课班级名称搜索 -->
        <search-trial-team-name
          @result="getTrialTeamName"
          :name="searchTrialTeamName"
        />
      </el-form-item>

      <el-form-item v-if="searchStage">
        <!-- 系统课排期搜索 -->
        <search-stage @result="getSearchStage" :name="searchStage" />
      </el-form-item>

      <el-form-item v-if="searchTrialStage">
        <!-- 体验课排期搜索 -->
        <search-stage
          @result="getSearchTrialStage"
          :name="searchTrialStage"
          type="0"
        />
      </el-form-item>

      <!-- <el-form-item
        size="mini"
        style="position:relative;top:6px"
        v-if="level || sup || stage"
      >
        <el-popover width="100%" trigger="click">
          <stage-sup-levels
            @stageCallBack="stageCallBack"
            @supCallBack="supCallBack"
            @levelCallBack="levelCallBack"
            :stageName="stage"
            :supName="sup"
            :levelName="level"
            style="margin-bottom:0px"
          />
          <el-button slot="reference" style="color:#c0c4cc ;font-weight: 400;">
            班级信息
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
      </el-form-item> -->
    </el-form>
  </el-card>
</template>
<script>
import DatePicker from './searchItems/datePicker.vue'
import ChannelSelect from './searchItems/channel.vue'
import ProductTopic from './searchItems/productTopic.vue'
import StageSupLevels from './searchItems/stageSupLevels.vue'
import SearchPhone from './searchItems/searchPhone.vue'
import OutTradeNo from './searchItems/outTradeNo.vue'
import ProductName from './searchItems/productName.vue'
import SelectDate from './searchItems/selectDate.vue'
import ExpressNo from './searchItems/expressNo'
import GroupSell from './searchItems/groupSell'
import TeamDetail from './searchItems/teamDetail'
import MoreVersionBox from './searchItems/moreVersionBox'
import OrderType from './searchItems/orderType'
import SystemCourseType from './searchItems/systemCourseType'
import Department from './searchItems/department'
import SearchTeamName from './searchItems/searchTeamName'
import SearchTrialTeamName from './searchItems/searchTrialTeamName'
import Schedule from './searchItems/schedule'
import SearchStage from './searchItems/searchStage'
// import SearchTrialStage from './searchItems/searchTrialStage'
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
    // 系统课排期
    searchStage: {
      type: String,
      default: ''
    },
    // 体验课排期
    searchTrialStage: {
      type: String,
      default: ''
    }
  },
  components: {
    ChannelSelect,
    ProductTopic,
    StageSupLevels,
    DatePicker,
    SearchPhone,
    SelectDate,
    OutTradeNo,
    ProductName,
    ExpressNo,
    GroupSell,
    TeamDetail,
    MoreVersionBox,
    OrderType,
    SystemCourseType,
    Department,
    SearchTeamName,
    SearchTrialTeamName,
    Schedule,
    SearchStage
    // SearchTrialStage
  },
  data() {
    return {
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
    // 选择渠道
    getChannel(res) {
      this.setSeachParmas(res, [this.channel || 'channelid'], 'terms')
    },
    // 主题
    getProductTopic(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.topicType || 'topicType'])
    },
    // 期数
    stageCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.stage || 'stage'], 'terms')
    },
    // 排期
    selectSchedule(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.schedule || 'id'])
    },
    // 难度
    supCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.sup || 'sup'], 'terms')
    },
    // 级别
    levelCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.level || 'current_level'], 'terms')
    },
    // 选择订单下单时间
    getDate(res) {
      this.setSeachParmas(res, [this.date || 'octime'], 'range')
    },
    // 选择手机号
    getPhoneHander(res) {
      console.log(res, '回调res') // 得到uid
      this.setSeachParmas(res, [this.phone || 'umobile'])
    },
    // 选择订单号
    getOutTradeNo(res) {
      this.setSeachParmas(res, [this.outTradeNo || 'out_trade_no'], 'wildcard')
    },
    // 选择商品名
    getProductName(res) {
      this.setSeachParmas(res, [this.productName || 'product_name'])
    },
    // 获取下拉时间选择select
    getTimeCallBack(data) {
      if (data) {
        this.selectTime = data
      } else {
        this.oldTime = data
      }
    },
    // 物流时间
    getTimeData(res) {
      console.log(this.selectTime, '清除时的this.selectTime')

      this.setSeachParmas(res, [this.selectTime || this.oldTime], 'range')
    },
    // 选择物流单号
    getExpressNo(res) {
      this.setSeachParmas(res, [this.expressNo || 'express_nu'], 'wildcard')
    },
    // 选择销售老师
    selectSellTeacher(res) {
      this.setSeachParmas(res, [this.groupSell || 'pay_teacher_id'])
    },
    getTeamDetail(res) {
      this.setSeachParmas(res, [this.teamDetail || 'last_team_id'])
    },
    getVersionNu(res) {
      this.setSeachParmas(res, [this.moreVersion || 'product_version'])
    },
    getOrderType(res) {
      this.setSeachParmas(res, [this.orderType || 'regtype'])
    },
    getSystemCourseType(res) {
      this.setSeachParmas(res, [this.systemCourseType || 'system_course_type'])
    },
    getDepartment(res) {
      this.setSeachParmas(res, [this.department || 'department'], 'terms')
    },
    getTeamName(res) {
      this.setSeachParmas(res, [this.searchTeamName || 'team_name'], 'terms')
    },
    getTrialTeamName(res) {
      this.setSeachParmas(
        res,
        [this.searchTrialTeamName || 'team_trial_name'],
        'terms'
      )
    },
    getSearchStage(res) {
      this.setSeachParmas(res, [this.searchStage || 'stage'], 'terms')
    },
    getSearchTrialStage(res) {
      this.setSeachParmas(
        res,
        [this.searchTrialStage || 'trial_stage'],
        'terms'
      )
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
        // temp.forEach((item, index) => {
        //   if (
        //     JSON.parse(item[extraKey])[k] &&
        //     (JSON.parse(item[extraKey])[k] ||
        //       +JSON.parse(item[extraKey])[k] === 0)
        //   )
        //     temp.splice(index, 1)
        // })
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
<style lang="scss" scoped>
.search-style {
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.search-style {
  .el-card__body {
    padding: 0px 10px 0px 10px;
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
