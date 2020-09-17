<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:20:12
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-14 15:43:55
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
          ref="searchUserByPhone"
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

      <el-form-item v-if="consigneePhone">
        <consignee-phone @result="getConsigneePhone" />
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
          v-if="this.$store.getters.subjects.subjectCode === 0"
          @stageCallBack="stageCallBack"
          @supCallBack="supCallBack"
          @levelCallBack="levelCallBack"
          :disabled="true"
          :stageName="stage"
          :supName="sup"
          :levelName="level"
          :addSupS="addSupS"
          :supPlaceholder="supPlaceholder"
          style="margin-bottom:0px"
        />

        <hard-write-level
          v-if="this.$store.getters.subjects.subjectCode === 1"
          :tab="tab"
          :subType="tab"
          :class="['margin_l10']"
          placeholder="难度"
          style="width:140px"
          name="sup"
          @result="supCallBack"
        />
      </el-form-item>

      <el-form-item v-if="schedule">
        <!-- 排期 -->
        <Schedule
          @result="selectSchedule"
          :name="schedule"
          :teamClass="teamClass"
        />
      </el-form-item>

      <el-form-item v-if="teacherphone">
        <!-- 老师模块手机号搜索 -->
        <teacher-phone
          @result="getteacherPhone"
          :teamId="teamId"
          :name="teacherphone"
          :onlyPhone="onlyPhone"
          :tip="phoneTip"
        />
      </el-form-item>

      <el-form-item v-if="teamDetail">
        <!-- 班级期数-->
        <team-detail @result="getTeamDetail" :name="teamDetail" />
      </el-form-item>

      <el-form-item v-if="teachername">
        <!-- 老师模块姓名搜索 -->
        <teacher-name
          @result="getteacherName"
          :name="teachername"
          :onlyPhone="onlyName"
          :tip="nameTip"
        />
      </el-form-item>

      <el-form-item v-if="staffname">
        <!-- 员工模块姓名搜索 -->
        <staff-name @result="getstaffName" :name="staffname" :tip="nameTip" />
      </el-form-item>

      <!-- 员工角色 -->
      <el-form-item v-if="employees">
        <employees-role
          :size="size"
          :devalueValue="devalueValue"
          @result="gerEmployeesName"
        />
      </el-form-item>

      <el-form-item v-if="teachernickname">
        <!-- 老师模块昵称搜索 -->
        <teacher-nickname
          @result="getteacherNickname"
          :name="teachernickname"
          :onlyPhone="onlyNickname"
          :tip="nicknameTip"
        />
      </el-form-item>
      <el-form-item v-if="teacherwx">
        <!-- 老师模块微信号搜索 -->
        <teacher-wx
          :teacherwx="teacherwx"
          :WeChat="WeChat"
          @getWxTeacher="getWxTeacher"
        />
      </el-form-item>
      <el-form-item v-if="rank || induction || landing || position">
        <!-- 老师模块职级，登陆状态，入职状态，选择职务搜索 -->
        <teacher-drop-down
          @rankCallBack="rankCallBack"
          @inductionCallBack="inductionCallBack"
          @landingCallBack="landingCallBack"
          @positionCallBack="positionCallBack"
          @sellerLevelCallBack="sellerLevelCallBack"
          :rankName="rank"
          :inductionName="induction"
          :landingName="landing"
          :positionName="position"
          :sellerLevelName="sellerLevel"
          style="margin-bottom:0px"
        />
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

      <el-form-item v-if="groupSell">
        <!-- 社群销售 -->
        <group-sell
          @result="selectSellTeacher"
          :name="groupSell"
          :tip="teacherTip"
        />
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

      <el-form-item
        v-if="wxSerch || wxTeacherPhone || wxStatus || wxConcatTeacher || wxId"
      >
        <wx-list
          :wxSerch="wxSerch"
          :wxTeacherPhone="wxTeacherPhone"
          :wxStatus="wxStatus"
          :wxConcatTeacher="wxConcatTeacher"
          :wxId="wxId"
          :wxRecordId="wxRecordId"
          @getWxSerch="getWxSerch"
          @getPhone="getPhoneData"
          @getWxStatus="getWxStatus"
          @getWxConcatTeacher="getWxConcatTeacher"
          @getWxIdSerch="getWxIdSerch"
          @getWechatRecordIdSearch="getWechatRecordIdSearch"
        />
      </el-form-item>
      <el-form-item v-if="selectAddress">
        <selectAddress @getAddress="getAddress" :name="selectAddress" />
      </el-form-item>
      <el-form-item>
        <slot name="searchItems"></slot>
      </el-form-item>
      <!-- 补发原因 -->
      <el-form-item v-if="replenishReason">
        <replenish-reason @result="getReplenishReason" />
      </el-form-item>
      <!-- 补发方式 -->
      <el-form-item v-if="replenishMethod">
        <replenish-method
          @result="getReplenishMethod"
          :sourceType="sourceType"
        />
      </el-form-item>
      <!-- 物流类型 -->
      <el-form-item v-if="regType">
        <express-type @result="getExpressType" name="regType" />
      </el-form-item>
      <el-form-item v-if="replenishProductType">
        <replenish-product-type
          @result="getReplenishProductType"
          :replenishProductType="replenishProductType"
        />
      </el-form-item>
      <!-- 补发商品 -->
      <el-form-item v-if="replenishProduct">
        <replenish-product
          :replenishProduct="replenishProduct"
          @result="getReplenishProduct"
          :replenishType="ExpressReplenishType"
        />
      </el-form-item>
      <!-- 申请人 -->
      <el-form-item v-if="operatorId">
        <operator-name @result="gerOperatorName" :name="operatorId" />
      </el-form-item>
      <el-form-item v-if="searchCourseware">
        <!-- 系统课名称搜索 -->
        <search-courseware
          @result="getSearchCourseware"
          :name="searchCourseware"
          type="0"
        />
      </el-form-item>
      <el-form-item>
        <slot></slot>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { isToss } from '@/utils/index'

import DatePicker from './searchItems/datePicker.vue'
import ChannelSelect from './searchItems/channel.vue'
import ProductTopic from './searchItems/productTopic.vue'
import StageSupLevels from './searchItems/stageSupLevels.vue'
import hardWriteLevel from './searchItems/hardWriteLevel.vue'

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
// 老师
import teacherPhone from './searchItems/teacherSearch/teacherPhone.vue'
import teacherName from './searchItems/teacherSearch/teacherName.vue'
import teacherNickname from './searchItems/teacherSearch/teacherNickname.vue'
import teacherDropDown from './searchItems/teacherSearch/teacherDropDown'
import teacherWx from './searchItems/teacherSearch/teachetWx'
import wxList from './searchItems/wxInput'
import selectAddress from './searchItems/selectAddress.vue'
import SearchStage from './searchItems/searchStage'
import operatorName from './searchItems/operatorName'
import replenishReason from './searchItems/replenishReason.vue'
import replenishMethod from './searchItems/replenishMethod.vue'
import replenishProduct from './searchItems/replenishProduct'
import replenishProductType from './searchItems/replenishProductType'
import ConsigneePhone from './searchItems/consigneePhone.vue'
import expressType from './searchItems/expressType'
// import SearchTrialStage from './searchItems/searchTrialStage'

// 员工角色
import employeesRole from './searchItems/role.vue'
import staffName from './searchItems/staffName.vue'
import SearchCourseware from './searchItems/searchCourseware'

export default {
  props: {
    // 物流体验课0 系统课1
    tab: {
      type: String,
      default: '' // tab
    },
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
    // teamClass 排期类别
    teamClass: {
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
    // 老师手机号搜索
    teacherphone: {
      type: String,
      default: '' // phone
    },
    // 老师微信号搜索
    teacherwx: {
      type: String,
      default: ''
    },
    // 是否只搜手机号
    onlyPhone: {
      type: String,
      default: '0' // 0
    },
    // 是否只搜手机号
    phoneTip: {
      type: String,
      default: '用户手机号查询'
    },
    // 微信号搜索
    weixinNumber: {
      type: String,
      default: '0'
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
    // 老师姓名搜索
    teachername: {
      type: String,
      default: ''
    },
    // 老师昵称搜索
    teachernickname: {
      type: String,
      default: ''
    },
    // 是否只搜老师姓名
    nameTip: {
      type: String,
      default: '姓名查询'
    },
    // 是否只搜老师昵称
    nicknameTip: {
      type: String,
      default: '对外昵称查询'
    },
    // 是否只搜老师姓名
    onlyName: {
      type: String,
      default: '0' // 0
    },
    // 是否只搜老师昵称
    onlyNickname: {
      type: String,
      default: '0' // 0
    },
    // 职级
    rank: {
      type: String,
      default: ''
    },
    // 老师微信传参
    WeChat: {
      type: Array,
      default: null
    },
    // 入职状态
    induction: {
      type: String,
      default: ''
    },
    // 登陆状态
    landing: {
      type: String,
      default: ''
    },
    // 职务
    position: {
      type: String,
      default: ''
    },
    // 销售等级
    sellerLevel: {
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
    // 微信号搜索
    wxSerch: {
      type: String,
      default: '' // wxSerch
    },
    // 手机号搜索
    wxTeacherPhone: {
      type: String,
      default: '' // wxInput
    },
    // 使用状态搜索
    wxStatus: {
      type: String,
      default: '' // wxStatus
    },
    // 是否关联老师搜索
    wxConcatTeacher: {
      type: String,
      default: ''
    },
    // wechat_id
    wxId: {
      type: String,
      default: ''
    },
    // wechat_record_id
    wxRecordId: {
      type: String,
      default: ''
    },
    // 是否关联老师搜索
    selectAddress: {
      type: Boolean,
      default: false // selectAddress
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
    },
    // 体验课排期 是否多选
    isMultiple: {
      type: Boolean,
      default: true
    },
    // 难度 placeholder
    supPlaceholder: {
      type: String,
      default: '难度'
    },
    // 补发原因
    replenishReason: {
      type: String,
      default: ''
    },
    // 补发方式
    replenishMethod: {
      type: String,
      default: ''
    },
    // 物流方式
    regType: {
      type: String,
      default: ''
    },
    // 申请人
    operatorId: {
      type: String,
      default: ''
    },
    // 5 代表活动课物流补发货
    sourceType: {
      type: String,
      default: ''
    },
    // 活动课补发商品
    replenishProduct: {
      type: String,
      default: ''
    },
    // 补发商品类别
    replenishProductType: {
      type: String,
      default: ''
    },
    // 收货人电话
    consigneePhone: {
      type: String,
      default: ''
    },
    teacherTip: {
      type: String,
      default: '社群销售' // topicType
    },
    // 员工姓名搜索
    staffname: {
      type: String,
      default: ''
    },
    employees: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'mini'
    },
    devalueValue: {
      type: String,
      default: ''
    },
    // 系统课名称
    searchCourseware: {
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
    teacherPhone,
    teacherName,
    teacherNickname,
    teacherDropDown,
    wxList,
    selectAddress,
    teacherWx,
    SearchStage,
    replenishProduct,
    ConsigneePhone,
    replenishReason,
    replenishMethod,
    operatorName,
    replenishProductType,
    employeesRole,
    staffName,
    expressType,
    SearchCourseware,
    hardWriteLevel
  },
  data() {
    return {
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: [],
      selectTime: null, // 物流时间下拉列表_选中项
      oldTime: '', // 上次时间选择值
      teacherId: '', // 判断是否是toss环境还是boss环境
      ExpressReplenishType: '' // 活动课 补发货 补发商品 筛选id
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
    // 选择老师手机号
    getteacherPhone(res) {
      this.setSeachParmas(res, [this.teacherphone || 'umobile'])
    },
    // 老师姓名
    getteacherName(res) {
      this.setSeachParmas(res, [this.teachername || 'umobile'])
    },
    // 老师昵称
    getteacherNickname(res) {
      this.setSeachParmas(res, [this.teachernickname || 'umobile'])
    },
    // 职级
    rankCallBack(res) {
      this.setSeachParmas(res, [this.rank || 'rankName'])
    },
    // 入职状态
    inductionCallBack(res) {
      this.setSeachParmas(res, [this.induction || 'inductionName'])
    },
    // 登陆状态
    landingCallBack(res) {
      this.setSeachParmas(res, [this.landing || 'inductionName'])
    },
    // 老师微信号
    getWxTeacher(res) {
      this.setSeachParmas(res, [this.teacherwx], 'wildcard')
    },
    // 职务
    positionCallBack(res) {
      this.setSeachParmas(res, [this.position || 'positionName'], 'terms')
    },
    // 销售等级
    sellerLevelCallBack(res) {
      this.setSeachParmas(res, [this.sellerLevel || 'sellerLevelName'], 'terms')
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
    getWxSerch(res) {
      this.setSeachParmas(res, [this.wxSerch], 'wildcard')
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
    getPhoneData(res) {
      this.setSeachParmas(res, [this.wxTeacherPhone], 'wildcard')
    },
    getWxStatus(res) {
      this.setSeachParmas(res, [this.wxStatus])
    },
    getWxConcatTeacher(res) {
      this.setSeachParmas(res, [this.wxConcatTeacher])
    },
    getWxIdSerch(res) {
      this.setSeachParmas(res, [this.wxId], 'wildcard')
    },
    getWechatRecordIdSearch(res) {
      this.setSeachParmas(res, [this.wxRecordId])
    },
    getAddress(res) {
      this.setSeachParmas(res, [this.selectAddress])
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
    getReplenishReason(res) {
      this.setSeachParmas(res, [this.replenishReason || 'replenish_reason'])
    },
    getReplenishMethod(res) {
      this.setSeachParmas(res, [this.replenishMethod || 'replenish_type'])
    },
    getExpressType(res) {
      this.setSeachParmas(res, [this.regType || 'regType'])
    },
    gerOperatorName(res) {
      this.setSeachParmas(res, [this.operatorId])
    },
    gerEmployeesName(res) {
      this.setSeachParmas(res, [this.employees])
    },
    getReplenishProduct(res) {
      this.setSeachParmas(res, [this.replenishProduct || 'product_type'])
    },
    getReplenishProductType(res) {
      this.ExpressReplenishType = res.id.join(',')
      this.setSeachParmas(
        { [this.replenishProductType]: res[this.replenishProductType] },
        [this.replenishProductType || 'product_type']
      )
    },
    // 员工姓名
    getstaffName(res) {
      this.setSeachParmas(res, [this.staffname || 'umobile'])
    },
    // 收货人电话
    getConsigneePhone(res) {
      this.setSeachParmas(res, [this.consigneePhone || 'receipt_tel'])
    },
    getSearchCourseware(res) {
      this.setSeachParmas(res, [this.searchTrialStage || 'course_id'], 'terms')
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
        if (res && (res.provincesCode || res.provincesCode === '')) {
          let hasAddress = false
          temp.forEach((item) => {
            if (item.term && item.term.provincesCode) {
              hasAddress = true
              item.term = res
              this.must = temp
            }
          })
          if (!hasAddress) {
            temp.push({
              // [`${extraKey}`]: `${JSON.stringify(res)}`
              [extraKey]: res
            })
            this.must = temp
          }
        } else if (res) {
          temp.push({
            // [`${extraKey}`]: `${JSON.stringify(res)}`
            [extraKey]: res
          })
          this.must = temp
        }
        // this.$emit('search', res === '' ? '' : temp)
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
    console.log(this.$store.getters.subjects.subjectCode)
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
