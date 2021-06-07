<!--
 * @Descripttion: 素质课搜索栏
 * @version: 1.0.0
 * @Author: songyanan
 * @Date: 2020-07-01 11:08:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-14 12:36:52
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
      <!-- 商品状态 -->
      <el-form-item label="商品状态:" :class="{ [$style.marginer]: true }">
        <productStatus @result="getStatus" name="coupon_status" />
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
import orderSearch from '@/components/MSearch/searchItems/orderSearch.vue' // add
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import productStatus from '@/components/MSearch/searchItems/productStatus.vue'
import { downloadHandle } from '@/utils/download'
import entranceMixins from './mixins/exportLog'
export default {
  components: {
    orderSearch,
    productStatus,
    DatePicker,
  },
 mixins: [entranceMixins],
  data() {
    return {
      cur0: false,
      cur1: false,
      cur2: false,
      cur3: false,
      currentBtn: null,
      term_trial: null, // 当前选择体验课排期
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: [],
      selectTime: null, // 物流时间下拉列表_选中项
      oldTime: '', // 上次时间选择值
      searchParams: [],
      firstOrderList: [
        {
          id: '1',
          text: '有推荐人',
        },
        {
          id: '0',
          text: '无推荐人',
        },
      ],
      hasSendId: true,
      showChooseDialog: false,
      chooseExport: '1',
    }
  },
  computed: {},
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
    // 选择状态
    getStatus(res) {
      if(res.coupon_status && res.coupon_status ==='1') {
         res.coupon_status = [0,1]
      }
      this.setSeachParmas(res, ['coupon_status'], 'terms')
    },
    // 难度
    supCallBack(res) {
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
          'is_first_order_send_id',
        ])
        this.setSeachParmas('', ['first_order_send_id'], 'terms')
      } else {
        this.getSendUser(res, ['is_first_order_send_id'])
      }
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
      const chooseExport = this.chooseExport
      if (this.searchParams.length === 0) {
        this.$message.error('请选择筛选条件')
        return
      }

      const query = this.$parent.$children[1].finalParams
      query.subject = 3

      const fileTitle = dayjs(new Date()).format('YYYY-MM-DD')
      const fileTitleTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

      const loading = this.$loading({
        lock: true,
        text: '正在导出，请耐心等待……',
        spinner: 'el-icon-loading',
      })
      if (chooseExport === '1') {
        const params = {
          apiName: 'CouponOrderStatistics',
          header: {
            buydate: '缴费时间',
            out_trade_no: '订单号',
            uid: '用户ID',
            'user.username': '用户昵称',
            'paymentPay.transaction_id': '交易流水号',
            'paymentPay.trade_type_text': '支付方式',
            amount: '交易金额',
            packages_name: '商品类型',
            'user_coupon.status_text': '商品状态',
            invoice_status_text: '开票状态',
            invoice_type_text: '开票类型',
            invoice_code: '发票号码',
            'user_coupon.coupon_used_amount': '使用金额',
            'user_coupon.coupon_refund_amount': '退费金额',
            'user_coupon.coupon_rest_amount': '剩余金额',
          },
          fileName: `预付款优惠券订单导出-${fileTitleTime}`, // 文件名称
          query: JSON.stringify(query),
        }
        // console.log(exportExcel)
        this.operatorObj.query = JSON.stringify(query)
        this.$http.DownloadExcel.exportOrder(params)
          .then((res) => {
            downloadHandle(res, `预付款优惠券订单导出-${fileTitle}`, () => {
              loading.close()
              this.$message.success('导出成功')
              this.initOperateExportLog(this.operatorObj)
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
            'enrolledInfo.is_enrolled': '是否报名',
            'enrolledInfo.enrolled_amount': '报名金额',
            'enrolledInfo.enrolled_time': '报名时间',
            'enrolledInfo.group_name': '战队',
            'enrolledInfo.department_name': '部门',
            'enrolledInfo.department_area_name': '区',
            buydate: '体验课报名时间',
            'channelDetail.channel_class_name': '二级渠道',
            'channelDetail.p_channel_class_name': '一级渠道',
          },
          fileName: `体验课订单薪资核算表-${fileTitleTime}`, // 文件名称
          query: JSON.stringify(query),
          // query: '{"status":3}'
        }
        // console.log(exportExcel)
        this.operatorObj.query = JSON.stringify(query)
        this.$http.DownloadExcel.exportOrder(params)
          .then((res) => {
            downloadHandle(res, `体验课订单薪资核算表-${fileTitle}`, () => {
              loading.close()
              this.showChooseDialog = false
              this.$message.success('导出成功')
              this.initOperateExportLog(this.operatorObj)
            })
          })
          .catch(() => loading.close())
      }
    },
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
