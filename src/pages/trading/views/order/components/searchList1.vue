<!--
 * @Descripttion: 系统课搜索栏
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:24:23
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-04-27 15:50:55
 -->
<template>
  <el-card border="false" shadow="never" :class="$style.elard">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item label="订单搜索:" :class="{ [$style.marginer]: true }">
        <orderSearch class="allmini" />
      </el-form-item>
      <br />

      <el-form-item label="订单来源:" :class="{ [$style.marginer]: true }">
        <ChannelSelect />
      </el-form-item>
      <br />

      <el-form-item label="下单时间:" :class="{ [$style.marginer]: true }">
        <DatePicker :class="[$style.fourPoint, 'allmini']">
          <template v-slot:buttons>
            <div class="row_colum">
              <el-button size="mini" plain>今日</el-button>
              <el-button size="mini" plain>何夕</el-button>
              <el-button size="mini" plain>今朝</el-button>
              <el-button size="mini" plain>去日</el-button>
            </div>
          </template>
        </DatePicker>
      </el-form-item>
      <br />
      <el-form-item label="体验课:" :class="{ [$style.marginer]: true }">
        <ChannelSelect />
      </el-form-item>
      <br />
      <el-form-item label="系统课:" :class="{ [$style.marginer]: true }">
        <ChannelSelect />
      </el-form-item>

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
        <channel-select @result="getChannel" :name="channel" />
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

      <el-form-item v-if="groupSell && !teacherId">
        <!-- 社群销售 -->
        <group-sell @result="selectSellTeacher" :name="groupSell" />
      </el-form-item>

      <el-form-item v-if="department && !teacherId">
        <!-- 社群销售组 -->
        <department @result="getDepartment" :name="department" />
      </el-form-item>

      <el-form-item v-if="searchTeamName">
        <!-- 班级名称搜索 -->
        <search-team-name @result="getTeamName" :name="searchTeamName" />
      </el-form-item>

      <el-form-item v-if="searchTrialTeamName">
        <!-- 班级名称搜索 -->
        <search-trial-team-name
          @result="getTrialTeamName"
          :name="searchTrialTeamName"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import orderSearch from '@/components/MSearch/searchItems/orderSearch.vue' // add
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import ChannelSelect from '@/components/MSearch/searchItems/channel.vue'
import ProductTopic from '@/components/MSearch/searchItems/productTopic.vue'
import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import OutTradeNo from '@/components/MSearch/searchItems/outTradeNo.vue'
import ProductName from '@/components/MSearch/searchItems/productName.vue'
import SelectDate from '@/components/MSearch/searchItems/selectDate.vue'
import ExpressNo from '@/components/MSearch/searchItems/expressNo'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import TeamDetail from '@/components/MSearch/searchItems/teamDetail'
import MoreVersionBox from '@/components/MSearch/searchItems/moreVersionBox'
import OrderType from '@/components/MSearch/searchItems/orderType'
import Department from '@/components/MSearch/searchItems/department'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import SearchTrialTeamName from '@/components/MSearch/searchItems/searchTrialTeamName'
import Schedule from '@/components/MSearch/searchItems/schedule'
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
    }
  },

  components: {
    orderSearch,
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
    Department,
    SearchTeamName,
    SearchTrialTeamName,
    Schedule
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
      this.setSeachParmas(res, [this.groupSell || 'pay_teacher_id'], 'wildcard')
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
<style lang="scss" module>
.elard {
  border: none;
  margin-top: 5px;
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
    margin-left: 10px;
    display: flex;
  }
}
</style>
