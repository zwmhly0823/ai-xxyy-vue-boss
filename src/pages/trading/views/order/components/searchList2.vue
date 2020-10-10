<!--
 * @Descripttion: 系统课搜索栏
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:24:23
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-21 21:36:43
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
          @result="getOrderSearch"
          @clear="clearNum()"
        />
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
      <br />

      <el-form-item :label="timeLabel" :class="{ [$style.marginer]: true }">
        <DatePicker
          :class="[$style.fourPoint, 'allmini']"
          :name="timeName"
          :key="payStatus"
          @result="getDate"
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
            class="margin_l10"
            name="packages_id"
            @result="getTrialCourseType"
          />
        </div>
      </el-form-item>
    </el-form>
    <div class="export-order">
      <el-button size="mini" type="primary" @click="showChooseDialog = true"
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
              style="padding-left:5px;"
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
              style="padding-left:5px;"
            ></i></el-tooltip
        ></el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChooseDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportOrderHandle">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import dayjs from 'dayjs'
import hardLevel from '@/components/MSearch/searchItems/hardLevel.vue' // add
import orderSearch from '@/components/MSearch/searchItems/orderSearch.vue' // add
// import orderStatus from '@/components/MSearch/searchItems/orderStatus.vue' // add
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import ChannelSelect from '@/components/MSearch/searchItems/channel.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import Department from '@/components/MSearch/searchItems/department'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import SearchStage from '@/components/MSearch/searchItems/searchStage'
import TrialCourseType from '@/components/MSearch/searchItems/trialClassType'
import { downloadHandle } from '@/utils/download'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
import { isToss } from '@/utils/index'

export default {
  props: {
    // 订单支付状态 3-已完成
    payStatus: {
      type: String,
      default: '3'
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
      searchParams: [],
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
      hasSendId: true,
      showChooseDialog: false,
      chooseExport: '1'
    }
  },
  computed: {
    timeLabel() {
      return this.payStatus === '3' ? '支付时间:' : '下单时间:'
    },
    timeName() {
      return this.payStatus === '3' ? 'buytime' : 'ctime'
    }
  },
  watch: {
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
    }
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
        // this.term_trial = res.trial_stage || ''
        this.term_trial = res.stage || []
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
      if (!res) {
        if (this.$refs.phoneName) {
          this.$refs.phoneName.handleEmpty()
        }
        this.setSeachParmas({ is_first_order_send_id: '' }, [
          'is_first_order_send_id'
        ])
        this.setSeachParmas('', ['first_order_send_id'], 'terms')
      } else {
        this.getSendUser(res, ['is_first_order_send_id'])
      }
      // this.setSeachParmas(res, ['is_first_order_send_id'])
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
          [`${extraKey}`]: `${JSON.stringify(res)}`
        })
        this.should = temp
      }
      this.$emit('searchShould', temp)
    },

    // 导出
    exportOrderHandle() {
      console.log(this.searchParams)
      console.log(this.$parent.$children[1].finalParams)
      const chooseExport = this.chooseExport
      if (this.searchParams.length === 0) {
        this.$message.error('请选择筛选条件')
        return
      }

      const query = this.$parent.$children[1].finalParams
      query.subject = 0
      const fileTitle = dayjs(new Date()).format('YYYY-MM-DD')
      const fileTitleTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

      // 导出条件为 v1 对象方式
      // const query = {
      //   status: 3
      // }
      // const search = this.searchParams[0]
      // for (const key in search) {
      //   if (Object.keys(search).includes(key)) {
      //     const item = search[key]
      //     Object.assign(query, item)
      //   }
      // }

      const loading = this.$loading({
        lock: true,
        text: '正在导出，请耐心等待……',
        spinner: 'el-icon-loading'
      })
      if (chooseExport === '1') {
        const params = {
          apiName: 'OrderPage',
          header: {
            buydate: '缴费时间',
            out_trade_no: '订单号',
            uid: '用户ID',
            'user.username': '用户昵称',
            'paymentPay.transaction_id': '交易流水号',
            'paymentPay.trade_type_text': '支付方式',
            amount: '交易金额',
            'packagesType.name': '套餐类型',
            'stageInfo.period_name': '期数',
            'channel.channel_outer_name': '线索渠道',
            sup_text: '课程难度',
            invoice_status_text: '开票状态',
            invoice_type_text: '开票类型',
            invoice_code: '发票号码'
          },
          fileName: `体验课订单导出-${fileTitleTime}`, // 文件名称
          query: JSON.stringify(query)
        }
        // console.log(exportExcel)

        this.$http.DownloadExcel.exportOrder(params)
          .then((res) => {
            console.log(res)
            downloadHandle(res, `体验课订单导出-${fileTitle}`, () => {
              loading.close()
              this.$message.success('导出成功')
            })
          })
          .catch(() => loading.close())
      } else {
        const params = {
          apiName: 'OrderPage',
          header: {
            id: '订单ID',
            uid: '学员ID',
            'stageInfo.period_name': '期数',
            packages_name: '类型',
            'stageInfo.course_day_text': '开课时间',
            'team.team_name': '班级',
            class_type: '班级类型',
            sup_text: '课程难度',
            'before_teacher.realname': '真实姓名',
            'before_teacher.ding_userid': '钉钉员工号',
            'after_teacher.realname': '接班老师',
            'after_teacher.ding_userid': '钉钉员工号',
            lastHandoverTime: '交接时间',
            'enrolledInfo.is_enrolled': '是否报名',
            'enrolledInfo.enrolled_amount': '报名金额',
            'enrolledInfo.enrolled_time': '报名时间',
            'enrolledInfo.group_name': '战队',
            'enrolledInfo.department_name': '部门',
            'enrolledInfo.department_area_name': '区',
            buydate: '体验课报名时间',
            'channelDetail.channel_class_name': '二级渠道',
            'channelDetail.p_channel_class_name': '一级渠道'
          },
          fileName: `体验课订单薪资核算表-${fileTitleTime}`, // 文件名称
          query: JSON.stringify(query)
          // query: '{"status":3}'
        }
        // console.log(exportExcel)

        this.$http.DownloadExcel.exportOrder(params)
          .then((res) => {
            console.log(res)
            downloadHandle(res, `体验课订单薪资核算表-${fileTitle}`, () => {
              loading.close()
              this.showChooseDialog = false
              this.$message.success('导出成功')
            })
          })
          .catch(() => loading.close())
      }
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
  position: relative;
  ::v-deep .el-icon-search {
    top: 14px;
  }
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
