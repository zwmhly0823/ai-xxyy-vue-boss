<!--
 * @Descripttion: 系统课搜索栏
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:24:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-17 09:52:38
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
        <orderSearch
          class="allmini"
          :searchProp="searchProp"
          @result="getOrderSearch"
          @clear="clearNum()"
        />
      </el-form-item>

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
            ref="phoneName"
            @result="getSendUser"
            :custom-style="{ width: '200px' }"
            placeholder="推荐人手机号/用户名称"
            name="first_order_send_id"
            type="2"
            v-if="hasSendId"
          />
        </div>
      </el-form-item>
      <el-form-item label="订单类型:" :class="{ [$style.marginer]: true }">
        <div class="row_colum">
          <simple-select
            name="regtype"
            :data-list="orderTypeList"
            :multiple="false"
            placeholder="全部"
            @result="getOrderType"
          ></simple-select>
        </div>
      </el-form-item>
      <!-- 是否关联其他订单 -->
      <el-form-item label="是否关联其他订单:" label-width="120px" :height="300">
        <el-select
          @change="selectOrder"
          v-model="associated_order_id"
          placeholder="请选择关联订单"
        >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item :label="timeLabel" :class="{ [$style.marginer]: true }">
        <DatePicker
          :class="[$style.fourPoint, 'allmini']"
          :name="timeName"
          @result="getDate"
          :key="payStatus"
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
      <el-form-item label="业绩归属:" :class="{ [$style.marginer]: true }">
        <div class="row_colum">
          <orderAttr
            name="pay_teacher_duty_id"
            :data-list="orderTypeList"
            :multiple="false"
            placeholder="全部"
            @result="getPerformType"
          ></orderAttr>
        </div>
      </el-form-item>
      <el-form-item
        label="是否体验课转化:"
        :class="{ [$style.marginer]: true }"
      >
        <div class="row_colum">
          <simple-select
            name="trial_team_id"
            :data-list="expChangeList"
            :multiple="false"
            placeholder="全部"
            @result="getExpChange"
          ></simple-select>
        </div>
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
            is-multiple
            tip="全部社群销售"
            @result="selectPayTeacher"
            name="pay_teacher_id"
            class="margin_l10"
          />
          <search-stageEC
            :teacher-id="teacherscope_trial || teacherscope"
            class="margin_l10"
            name="trial_stage"
            placeholder="全部体验课排期"
            type="0"
            @result="selectScheduleTrial"
          />
          <hardLevel
            :class="['margin_l10']"
            placeholder="全部体验课难度"
            style="width: 140px"
            name="trial_team_id"
            :courseType="false"
            @result="supCallBackTrial"
          />
          <search-team-name
            teamnameType="0"
            :term="term_trial"
            :teacher-id="teacherscope_trial || teacherscope"
            @result="getTrialTeamName"
            name="trial_team_id"
            :class="['margin_l10']"
          />
          <ChannelSelect
            class="margin_l10"
            @result="getTrialChannel"
            name="trial_pay_channel"
            @clear="clearChannel(0)"
          />
        </div>
      </el-form-item>
      <br />
      <el-form-item label="系统课:" :class="{ [$style.marginer]: true }">
        <div class="row_colum">
          <systemCourseType
            style="width: 140px"
            teamType="1"
            @result="getSystemCourseType"
            name="packages_type"
          />
          <group-sell
            :teacherscope="teacherscope_s"
            is-multiple
            @result="selectLastTeacher"
            name="last_teacher_id"
            class="margin_l10"
            tip="全部服务老师"
          />
          <search-stage
            :teacher-id="teacherscope_system || teacherscope_s"
            class="margin_l10"
            @result="selectSchedule"
            name="stage"
            type="1"
            placeholder="全部系统课排期"
          />
          <hardLevel
            :class="['margin_l10']"
            placeholder="全部系统课难度"
            style="width: 140px"
            name="sup"
            @result="supCallBack"
          />
          <search-team-name
            teamnameType="1"
            :term="term_sys"
            :teacher-id="teacherscope_system || teacherscope_s"
            @result="getTeamName"
            name="team_id"
            class="margin_l10"
          />
          <ChannelSelect
            class="margin_l10"
            @result="getChannel"
            name="pay_channel"
            @clear="clearChannel(1)"
          />
        </div>
      </el-form-item>
    </el-form>
    <div class="export-order">
      <el-button size="mini" type="primary" @click="showChooseDialogClick"
        >订单导出</el-button
      >
    </div>
    <el-dialog title="导出订单" :visible.sync="showChooseDialog" width="30%">
      <el-radio-group v-model="chooseExport" class="chooseExpBox">
        <el-radio label="1"
          ><span>财务订单导出</span
          ><el-tooltip
            class="item"
            effect="dark"
            content="财务人员核对小熊业务流水专用"
            placement="top"
            ><i
              class="el-icon-question"
              style="padding-left: 5px"
            ></i></el-tooltip
        ></el-radio>
        <el-radio label="2"
          ><span>薪资核算订单导出</span
          ><el-tooltip
            class="item"
            effect="dark"
            content="薪资核算人员专用"
            placement="top"
            ><i
              class="el-icon-question"
              style="padding-left: 5px"
            ></i></el-tooltip
        ></el-radio>
        <el-radio label="3"
          ><span>续费开课订单导出</span
          ><el-tooltip
            class="item"
            effect="dark"
            content="财务人员确认续费订单专用"
            placement="top"
            ><i
              class="el-icon-question"
              style="padding-left: 5px"
            ></i></el-tooltip
        ></el-radio>
      </el-radio-group>
      <section v-show="chooseExport === '3'">
        <h4>订单时间区间筛选</h4>
        <el-form>
          <el-form-item label="时间查询:">
            <div style="display: flex; align-items: center">
              <el-select size="mini" v-model="timeType" placeholder="请选择">
                <el-option label="订单支付时间" value="0"></el-option>
                <el-option label="订单开课时间" value="1"></el-option>
              </el-select>
              <el-date-picker
                value-format="timestamp"
                type="daterange"
                unlink-panels
                size="mini"
                v-model="timeValue"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChooseDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportOrderHandle">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import dayjs from 'dayjs'
import orderAttr from '@/components/MSearch/searchItems/orderAttribution.vue' // add
import hardLevel from '@/components/MSearch/searchItems/hardLevel.vue' // add
import orderSearch from '@/components/MSearch/searchItems/orderSearch.vue' // add
import systemCourseType from '@/components/MSearch/searchItems/systemCourseType.vue'
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import ChannelSelect from '@/components/MSearch/searchItems/channel.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import Department from '@/components/MSearch/searchItems/department'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
// import SearchTrialTeamName from '@/components/MSearch/searchItems/searchTrialTeamName'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import SearchStageEC from '@/components/MSearch/searchItems/searchStageEC'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
import { isToss } from '@/utils/index'
import { downloadHandle } from '@/utils/download'
import entranceMixins from './mixins/exportLog'
// import axios from '@/api/axiosConfig'

export default {
  props: {
    searchProp: {
      type: Object,
      default: () => {},
    },
    // 订单支付状态 3-已完成
    payStatus: {
      type: String,
      default: '3',
    },
  },
  components: {
    hardLevel,
    systemCourseType,
    orderSearch,
    ChannelSelect,
    DatePicker,
    GroupSell,
    Department,
    SearchTeamName,
    // SearchTrialTeamName,
    SearchStage,
    orderAttr,
    SearchPhoneAndUsername,
    SimpleSelect,
    SearchStageEC,
  },
  mixins: [entranceMixins],
  data() {
    return {
      timeType: '', // 三类导出_类型
      timeValue: [], // 三类导出_时间
      associated_order_id: '全部',
      options1: [
        {
          value: 2,
          label: '全部',
        },
        {
          value: 1,
          label: '已关联',
        },
        {
          value: 0,
          label: '无关联',
        },
      ],
      cur0: false,
      cur1: false,
      cur2: false,
      cur3: false,
      currentBtn: null,
      package_type: null, // 当前选择系统课类型
      teacherscope: null, // 当前选择的体验课老师范围（销售组查询）
      teacherscope_s: null, // 当前选择的系统课老师范围（根据类型查询）
      teacherscope_system: null, // 当前选择的系统课老师范围
      teacherscope_trial: null, // 当前选择的体验课老师范围
      packages_type: null, // 当前选择系统课类型
      term_sys: null, // 当前选择系统课排期
      term_trial: null, // 当前选择体验课排期
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: [],
      selectTime: null, // 物流时间下拉列表_选中项
      oldTime: '', // 上次时间选择值
      teacherId: '', // 判断是否是toss环境还是boss环境
      searchParams: [],
      firstOrderList: [
        // {
        //   id: 1,
        //   text: '全部'
        // },
        {
          id: '1',
          text: '有推荐人',
        },
        {
          id: '0',
          text: '无推荐人',
        },
      ],
      orderTypeList: [
        {
          id: '2',
          text: '首单',
        },
        {
          id: '3',
          text: '续费',
        },
        {
          id: '12',
          text: '新签补差',
        },
        {
          id: '11',
          text: '续费补差',
        },
      ],
      expChangeList: [
        {
          id: '1',
          text: '是',
        },
        {
          id: '2',
          text: '否',
        },
      ],
      hasSendId: true,
      showChooseDialog: false,
      chooseExport: '1',
    }
  },
  computed: {
    timeLabel() {
      return this.payStatus === '3' ? '支付时间:' : '下单时间:'
    },
    timeName() {
      return this.payStatus === '3' ? 'buytime' : 'ctime'
    },
  },
  watch: {
    packages_type(val, old) {
      const { getTeacherIdByCategory } = this.$http.Teacher
      if (val) {
        getTeacherIdByCategory({ category: val }).then((data) => {
          if (data.data.StudentTeamList && data.data.StudentTeamList.length) {
            const teacherIds = data.data.StudentTeamList.map(
              (item) => item.teacher_id
            )
            this.teacherscope_s = teacherIds
          }
        })
      } else {
        this.teacherscope_s = null
      }
    },
    payStatus(val) {
      /**
       * 切换支付状态时，清空支付时间/下单时间搜索条件
       */
      this.searchParams.forEach((item) => {
        if (item.range) {
          const time = item.range?.ctime || item.range?.buytime
          if (time) {
            delete item.range
            for (let i = 0; i < 4; i++) {
              this['cur' + i] = false
            }
          }
        }
      })
    },
  },
  methods: {
    // 切换手机/订单清空筛选项
    clearNum() {
      this.getOrderSearch({ uid: '' })
      this.getOrderSearch({ out_trade_no: '' })
      // this.setSeachParmas(val, [key])
    },
    // 订单号、手机号
    getOrderSearch(res) {
      const key = Object.keys(res || {})[0]
      const val = res[key] ? res : ''
      this.setSeachParmas(val, [key])
    },
    // 清空渠道选项
    clearChannel(res) {
      if (res) {
        this.setSeachParmas({ pay_channel: '' }, ['pay_channel'], 'terms')
      } else {
        this.setSeachParmas(
          { trial_pay_channel: '' },
          ['trial_pay_channel'],
          'terms'
        )
      }
    },
    // 是否关联订单
    selectOrder(val) {
      this.searchParams.forEach((item, index) => {
        if (
          (item.terms && item.terms.associated_order_id) ||
          (item.terms && item.terms.associated_order_id == 0)
        ) {
          this.searchParams.splice(index, 1)
        }
      })
      let res = { associated_order_id: val }
      this.setSeachParmas(res, ['associated_order_id'], 'terms')
    },
    // 选择渠道
    getChannel(res) {
      this.setSeachParmas(res, ['pay_channel'], 'terms')
    },
    getTrialChannel(res) {
      this.setSeachParmas(res, ['trial_pay_channel'], 'terms')
    },
    // 系统课排期
    selectSchedule(res) {
      if (res) {
        this.term_sys = res.stage
      } else {
        this.term_sys = null
      }
      this.setSeachParmas(res, ['stage'], 'terms')
    },
    // 体验课排期
    selectScheduleTrial(res) {
      if (res) {
        this.term_trial = res.trial_stage
      } else {
        this.term_trial = null
      }
      this.setSeachParmas(res, ['trial_stage'], 'terms')
    },
    // 系统课难度
    supCallBack(res) {
      this.setSeachParmas(res, ['sup'], 'terms')
    },
    // 体验课难度
    supCallBackTrial(res) {
      this.setSeachParmas(res, ['trial_team_id'], 'terms')
    },
    // 选择订单下单时间
    getDate(res) {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      if (!res || !res.quick) this.currentBtn = null
      if (res.quick && this.currentBtn) this[`cur${this.currentBtn}`] = true
      delete res.quick
      this.setSeachParmas(res, [this.timeName], 'range')
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
    // 选择社群销售
    selectPayTeacher(res) {
      if (!res.pay_teacher_id || res.pay_teacher_id.length === 0) {
        this.teacherscope_trial = null
        if (this.teacherscope && this.teacherscope.length > 0) {
          res = {
            pay_teacher_id: this.teacherscope,
          }
        } else {
          res = ''
        }
      } else {
        this.teacherscope_trial = res.pay_teacher_id
      }
      this.setSeachParmas(res, ['pay_teacher_id'], 'terms')
    },
    // 选择销售老师
    selectLastTeacher(res) {
      if (!res.last_teacher_id || res.last_teacher_id.length === 0) {
        res = ''
        this.teacherscope_system = null
      } else {
        this.teacherscope_system = res.last_teacher_id
      }
      this.setSeachParmas(res, ['last_teacher_id'], 'terms')
    },
    // 系统课选择课程类型
    getSystemCourseType(res) {
      if (res && res.packages_type === '6') {
        this.must.map((item, idx) => {
          if (item.term && item.term.packages_type) {
            this.must.splice(idx, 1)
          }
        })
        return this.setSeachParmas({ packages_course_week: '72' }, [
          'packages_course_week',
        ])
      }
      if (res && res.packages_type === '5') {
        this.must.map((item, idx) => {
          if (item.term && item.term.packages_type) {
            this.must.splice(idx, 1)
          }
        })
        return this.setSeachParmas({ packages_course_week: '96' }, [
          'packages_course_week',
        ])
      }
      if (res && res.packages_type === '4') {
        this.must.map((item, idx) => {
          if (item.term && item.term.packages_type) {
            this.must.splice(idx, 1)
          }
        })
        return this.setSeachParmas({ packages_course_week: '48' }, [
          'packages_course_week',
        ])
      }
      if (res && res.packages_type === '3') {
        this.must.map((item, idx) => {
          if (item.term && item.term.packages_type) {
            this.must.splice(idx, 1)
          }
        })
        return this.setSeachParmas({ packages_course_week: '24' }, [
          'packages_course_week',
        ])
      }
      if (res) {
        this.packages_type = res.packages_type
      } else {
        this.packages_type = null
      }
      this.must.map((item, idx) => {
        if (item.term && item.term.packages_course_week) {
          this.must.splice(idx, 1)
        }
      })
      this.setSeachParmas(res, ['packages_type'])
    },
    getDepartment(res, res1) {
      this.teacherscope = res1.pay_teacher_id || null
      this.setSeachParmas(res, ['pay_teacher_id'], 'terms')
    },
    getTeamName(res) {
      this.setSeachParmas(res, ['team_id'], 'terms')
    },
    getTrialTeamName(res) {
      this.setSeachParmas(res, ['trial_team_id'], 'terms')
    },
    async getSendUser(res) {
      this.setSeachParmas(res, ['first_order_send_id'], 'terms')
    },
    // fix
    getFirstOrder(res) {
      if (res && res.is_first_order_send_id === '0') {
        this.$refs.phoneName.handleEmpty()
        this.setSeachParmas({ is_first_order_send_id: '' }, [
          'is_first_order_send_id',
        ])
        this.hasSendId = false
      } else {
        this.hasSendId = true
      }
      if (!res) {
        if (this.$refs.phoneName) {
          this.$refs.phoneName.handleEmpty()
        }
        this.setSeachParmas('', ['first_order_send_id'], 'terms')
        this.setSeachParmas({ is_first_order_send_id: '' }, [
          'is_first_order_send_id',
        ])
      } else {
        this.getSendUser(res, ['is_first_order_send_id'])
      }
    },
    getOrderType(res) {
      this.setSeachParmas(res, ['regtype'])
    },
    getExpChange(res) {
      if (res.trial_team_id === '1') {
        this.setSeachParmas({ trial_team_id: { gt: 0 } }, ['trial_team_id'])
      } else if (res.trial_team_id === '2') {
        this.setSeachParmas({ trial_team_id: { lte: 0 } }, ['trial_team_id'])
      } else {
        this.setSeachParmas({ trial_team_id: { gte: 0 } }, ['trial_team_id'])
      }
    },
    getPerformType(res) {
      this.setSeachParmas(res, ['pay_teacher_duty_id'])
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
            [extraKey]: res,
          })
          this.must = temp
        }
        // if (
        //   temp[0].terms.trial_pay_channel &&
        //   temp[0].terms.trial_pay_channel.length <= 0
        // ) {
        //   temp.map((item) => {
        //
        //     delete item.terms.trial_pay_channel
        //   })

        // }
        // if (
        //   temp[0].terms.pay_channel &&
        //   temp[0].terms.pay_channel.length <= 0
        // ) {
        //   temp.map((item) => {
        //     delete item.terms.pay_channel
        //   })
        // }
        temp.map((item, index) => {
          if (
            item.terms &&
            item.terms.pay_channel &&
            item.terms.pay_channel.length <= 0
          ) {
            temp.splice(index, 1)
          }
          if (
            item.terms &&
            item.terms.trial_pay_channel &&
            item.terms.trial_pay_channel.length <= 0
          ) {
            temp.splice(index, 1)
          }
        })
        this.searchParams = temp
        this.$emit('search', temp)

        return
      }
      // should
      if (res) {
        temp.push({
          [`${extraKey}`]: `${JSON.stringify(res)}`,
        })
        this.should = temp
      }
      this.$emit('searchShould', temp)
    },
    showChooseDialogClick() {
      // 获取查询条件
      const query = this.$parent.$children[1].finalParams
      // 限制导出全部订单
      if (!query.status || query.status[0] != 3) {
        this.$message.error('只能导出已完成的订单，请重新选择')
        return
      } else {
        this.showChooseDialog = true
      }
    },
    // 导出
    exportOrderHandle() {
      if (
        (this.chooseExport === '1' || this.chooseExport === '2') &&
        this.searchParams.length === 0
      ) {
        this.$message.error('请选择筛选条件')
        return
      }

      // 获取查询条件
      const query = this.$parent.$children[1].finalParams
      query.subject = 3

      const fileTitle = dayjs(new Date()).format('YYYY-MM-DD')
      const fileTitleTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

      const loading = this.$loading({
        lock: true,
        text: '正在导出，请耐心等待……',
        spinner: 'el-icon-loading',
      })
      if (this.chooseExport === '1') {
        const params = {
          apiName: 'OrderOptStatistics',
          header: {
            buydate: '缴费时间',
            out_trade_no: '母订单号',
            course_sub_out_trade_no: '课程子商品订单号',
            uid: '用户ID',
            'user.username': '用户昵称',
            'paymentPay.transaction_id': '交易流水号',
            'paymentPay.trade_type_text': '支付方式',
            total_amount: '母订单商品原价',
            associated_order_amout: '优惠券实收金额',
            discount_amount: '优惠券抵扣金额',
            associated_order_out_trade_no: '关联优惠券订单号',
            amount: '母订单实付金额',
            order_total_amount: '订单总支付金额',
            system_course_order_total_amount: '系统课实际支付总金额',
            'packagesType.name': '套餐类型',
            'stageInfo.period_name': '期数',
            'channel.channel_outer_name': '线索渠道',
            invoice_status_text: '开票状态',
            invoice_type_text: '开票类型',
            invoice_code: '发票号码',
          },
          fileName: `系统课订单导出-${fileTitleTime}`, // 文件名称
          query: JSON.stringify(query),
          // query: '{"status":3}'
        }
        this.operatorObj.query = JSON.stringify(query)
        this.$http.DownloadExcel.exportOrder(params)
          .then((res) => {
            downloadHandle(res, `系统课订单导出-${fileTitle}`, () => {
              loading.close()
              this.showChooseDialog = false
              this.$message.success('导出成功')
              this.initOperateExportLog(this.operatorObj)
            })
          })
          .catch(() => loading.close())
      } else if (this.chooseExport === '3') {
        if (this.timeType && this.timeValue.length !== 0) {
          const params = {
            timeType: this.timeType,
            timeValue: { gte: this.timeValue[0], lte: this.timeValue[1] },
          }
          this.$http.DownloadExcel.renewOrder(params)
            .then((res) => {
              downloadHandle(res, `续费开课订单-${fileTitle}`, () => {
                this.showChooseDialog = false
                this.$message.success('导出成功')
              })
            })
            .finally(() => {
              loading.close()
            })
        } else {
          loading.close()
          this.$message.warning('请确认选择时间类型与节点')
        }
      } else {
        const query = this.$parent.$children[1].finalParams
        const queryF = Object.assign({}, query, {
          trial_team_id: 0,
          pay_teacher_id: { gt: 0 },
        })
        const params = {
          apiName: 'OrderPage',
          header: {
            id: '订单ID',
            uid: '学员ID',
            'payTeacherInfo.realname': '真实姓名',
            'payTeacherInfo.ding_userid': '钉钉员工号',
            'enrolledInfo.enrolled_amount': '报名金额',
            'enrolledInfo.enrolled_time': '报名时间',
            'senderTrialManagement.period_name': '所属期',
            'enrolledInfo.group_name': '战队',
            'enrolledInfo.department_name': '部门',
            'enrolledInfo.department_area_name': '区',
            'channelDetail.channel_class_name': '二级渠道',
            'channelDetail.p_channel_class_name': '一级渠道',
          },
          fileName: `系统课订单薪资核算表-${fileTitleTime}`, // 文件名称
          query: JSON.stringify(queryF),
          // query: '{"status":3}'
        }

        this.$http.DownloadExcel.exportOrder(params)
          .then((res) => {
            downloadHandle(res, `系统课订单薪资核算表-${fileTitle}`, () => {
              loading.close()
              this.showChooseDialog = false
              this.$message.success('导出成功')
            })
          })
          .catch(() => loading.close())
      }
    },
  },
  created() {
    for (let i = 0; i < 4; i++) {
      this['cur' + i] = false
    }
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
  },
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
  position: relative;
  ::v-deep .el-icon-search {
    top: 14px;
  }
}
/deep/ .el-input--suffix .el-input__inner {
  height: 30px !important;
}
</style>
<style scoped>
.export-order {
  position: absolute;
  bottom: 25px;
  right: 20px;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
