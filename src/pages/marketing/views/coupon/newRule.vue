<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-10 20:38:48
-->
<template>
  <el-dialog
    :title="'新建定向发放规则'"
    :visible.sync="centerDialog"
    width="800px"
    top="20px"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    custom-class="dialog-custom"
  >
    <div class="dialog-center">
      <div class="rule-content">
        <div class="excuse-way divider">
          <div class="label">
            <span>执行方式</span>
          </div>
          <div class="ctn">
            <div class="title">执行方式：</div>
            <el-radio
              v-model="formData.exeType"
              label="0"
              :disabled="lookPeriod != ''"
              @change="radioChange"
              >仅选中期</el-radio
            >
            <div class="tooltip-gap">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑保存后，对已领取未使用且未过期的优惠券生效"
                placement="right"
              >
                <i
                  class="el-icon-question"
                  style="fontSize:17px;cursor:pointer;"
                ></i>
              </el-tooltip>
            </div>
            <el-select
              v-model="formData.exePeriod"
              size="mini"
              placeholder="请选择执行期"
              :disabled="formData.exeType == '1' || lookPeriod != ''"
              @change="onlyExePeriodChange"
            >
              <el-option
                v-for="item in onlyExePeriod"
                :key="item.id"
                :label="item.periodName"
                :value="item.period"
              >
              </el-option>
            </el-select>
          </div>
          <div class="ctn">
            <div class="title"></div>
            <el-radio
              v-model="formData.exeType"
              label="1"
              :disabled="lookPeriod != ''"
              @change="radioChange"
              >仅选中期及后续所有期</el-radio
            >
            <div class="tooltip-gap">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑保存后，从选中期开始，已领取未使用及后续期领取的券均生效"
                placement="right"
              >
                <i
                  class="el-icon-question"
                  style="fontSize:17px;cursor:pointer;"
                ></i>
              </el-tooltip>
            </div>
            <el-select
              v-model="formData.periodMore"
              size="mini"
              placeholder="请选择执行期"
              :disabled="formData.exeType == '0' || lookPeriod != ''"
              @change="onlyExePeriodChange"
            >
              <el-option
                v-for="(item, index) in exePeriodMore"
                :key="item.utime + index"
                :label="item.periodName"
                :value="item.period"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="selected-group divider">
          <div class="label">
            <span>选择组/设置期时间</span>
          </div>
          <div class="my-tree">
            <div class="select-all">
              <!-- <el-checkbox v-model="checkedAll">全选</el-checkbox> -->
              <span>未能选中的部门将不能发放此优惠券</span>
            </div>
            <dept-tree
              :dayDept="dayAndDeptIdKeyVal"
              :submit="isSubmit"
              :dayDeptId="dayDeptId"
              :period="lookPeriod"
              @changeSubmit="changeSubmit"
              :isChangeRadio.sync="isChangeRadio"
            ></dept-tree>
          </div>
        </div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
      :class="{ hiddenBtn: lookPeriod != '' }"
    >
      <el-button @click="dialogOperate('cancel')" size="mini">取消</el-button>
      <el-button type="primary" @click="dialogOperate('submit')" size="mini"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
// import { debounce } from 'lodash'
import DeptTree from './deptTree'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: () => {}
    },
    couponInfo: {
      type: Object,
      default: () => {}
    },
    period: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isSubmit: false,
      checkedAll: false,
      formData: {
        exeType: '0',
        exePeriod: '',
        periodMore: ''
      },
      onlyExePeriod: [],
      exePeriodMore: [],
      addContentForm: {
        imgUrl: '',
        textarea: ''
      },
      changeEmojiToggle: false,
      dayAndDeptIdKeyVal: {},
      submitData: {
        couponDispensedDetails: [],
        couponDispensedRules: {}
      },
      dayDeptId: {},
      lookPeriod: '',
      couponDetail: {},
      isChangeRadio: false
    }
  },
  components: { DeptTree },
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  created() {
    /**
     * @description 1:仅选中期；2：选中期后续所有期
     */
    this.getPeriodByStatus(1)
    this.getPeriodByStatus(2)

    this.echoInit()
  },
  mounted() {},
  watch: {
    lookPeriod(val, oldVal) {
      const params = {
        couponDispensadRulesId: val
      }

      val && this.echoTree(params)
    },
    'formData.exeType': {
      handler: function(newVal, old) {
        if (old === '0') {
          this.formData.exePeriod = ''
        } else if (old === '1') {
          this.formData.periodMore = ''
        }
      }
    }
  },
  methods: {
    radioChange(res) {
      this.dayDeptId = {}
      this.isChangeRadio = true
    },
    // 回显初始化
    echoInit() {
      this.lookPeriod = this.period
      this.couponDetail = this.couponInfo
    },
    /** 点击查看按钮，通过期数period回显树结构和select框 */
    async echoTree(params) {
      const { getDayTimeAndDeptId } = this.$http.Marketing
      const echoData = await getDayTimeAndDeptId(params).catch()
      const {
        payload: { couponDispensedDetails = [], couponDispensedRules = {} } = {}
      } = echoData || {}

      const { executeType = '0', period = '' } = couponDispensedRules
      Object.assign(this.formData, {
        exeType: String(executeType)
      })

      if (executeType === 1) {
        this.formData.periodMore = Number(period)
      } else {
        this.formData.exePeriod = Number(period)
        // this.formData.exePeriod = period.split(',').map(Number)
      }

      this.couponDetail = couponDispensedRules
      /** 回显 tree */
      this.dayDeptId = this.getIdDayKeyVal(couponDispensedDetails)
    },
    validateData(checkedNode) {
      const { exeType, exePeriod, periodMore } = this.formData
      if (
        (exeType === '0' && exePeriod === '') ||
        (exeType === '1' && periodMore === '')
      ) {
        this.$message.warning('请选择执行期')
        return 0
      }
      const emptyDay = checkedNode.filter((item) => item.day === '')

      if (!checkedNode.length) {
        this.$message.warning('请先配置组和优惠券到期时间')
        return 0
      } else if (emptyDay.length) {
        this.$message.warning('请填写全部组的优惠券到期时间')
        return 0
      }
      return 1
    },
    /** 新增、修改 优惠券发放规则，部门id和天数关联数据 TODO: */
    async lookSendRule(params) {
      const { lookSendRule } = this.$http.Marketing
      const dayDeptIds = await lookSendRule(params).catch()
      const { payload: { couponDispensedDetailsList = [] } = {} } =
        dayDeptIds || {}

      return couponDispensedDetailsList
    },
    dialogClose() {
      this.$emit('emitDialogOperate', { close: true })
    },
    packageDeptIdAndDay(allTree, checkedNode) {
      return checkedNode.map((item) => {
        return {
          day: item.day,
          uid: item.id
        }
      })
    },
    /** 打包封装需要提交的数据 */
    bundleData(a, b) {
      const couponDispensedDetails = this.packageDeptIdAndDay(a, b)

      const {
        formData: { exeType, exePeriod, periodMore },
        couponDetail: { id: couponId, name: couponName }
      } = this

      console.log(exeType, exePeriod, periodMore)

      const periodAndName = {}
      const couponDispensedRules = {}
      // const periodName = []
      // if
      const selPeriod = exeType === '0' ? exePeriod : periodMore
      // exeType === '0' ? exePeriod : String(periodMore).split(',') // periodMore 是 string
      const originPeriodArr =
        exeType === '0' ? 'onlyExePeriod' : 'exePeriodMore'

      this[originPeriodArr].forEach((item) => {
        periodAndName[item.period] = item.periodName
      })

      // selPeriod.forEach((p) => {
      //   periodName.push(periodAndName[p])
      // })

      Object.assign(couponDispensedRules, {
        // period: selPeriod.join(),
        period: selPeriod,
        periodName: periodAndName[selPeriod],
        // periodName: periodName.join(),
        executeType: exeType,
        couponId,
        couponName
      })

      return {
        couponDispensedDetails,
        couponDispensedRules
      }
    },
    /** 新增内容底部按钮操作 */
    dialogOperate(type) {
      if (type === 'submit') {
        this.isSubmit = true
      } else {
        this.$emit('emitDialogOperate', { close: true })
      }
    },
    /** 通过uid、day 返回组合的 id:day 键值对 */
    getIdDayKeyVal(arr = []) {
      const deptAndDay = {}
      arr.forEach((item) => {
        const { day, uid } = item
        deptAndDay[uid] = day
      })
      return deptAndDay
    },
    // 仅选中期被选中change事件
    async onlyExePeriodChange(res) {
      const { couponId } = this.$route.params
      const dayDeptId = await this.lookSendRule({
        couponId,
        period: Array.isArray(res) ? res.join() : res
      })
      /** 回显 tree */
      this.dayDeptId = this.getIdDayKeyVal(dayDeptId)
    },
    async changeSubmit({ val, oldVal, deptFlatList, checkedNode }) {
      if (val && !oldVal) {
        if (!this.validateData(checkedNode)) {
          this.isSubmit = false
        } else {
          /** 打包好的需要掉接口的数据 */
          const result = this.bundleData(deptFlatList, checkedNode)
          console.log('result', result)
          // await this.saveCouponRule(result) TODO:

          this.isSubmit = false
        }
      }
    },
    /** 新增 优惠券发放规则， 保存 */
    async saveCouponRule(params) {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '正在保存...',
        fullscreen: true
      })
      const { saveCouponRule } = this.$http.Marketing

      const save = await saveCouponRule(params).catch()
      if (save && save.code === 0) {
        this.$message.success('保存成功')
        this.$emit('emitDialogOperate', { close: true, refresh: true })
      }
      loadingInstance.close()
    },
    /** 优惠券 期 下拉框 */
    /**
     * @status 0 待开始；1 招生中；2 待开课；3 上课中；4 已结课"
     * @desc 1、仅选中期--->仅可选择开课中、待开课期，可支持多选（2,3）；
     *       2、选中期和后续所有期---->仅可选择开课中、待开课、招生中期，仅可单选(1,2,3)
     */
    async getPeriodByStatus(type) {
      let {
        periodType = 'onlyExePeriod',
        status = '2,3',
        getPeriodByStatus
      } = this.$http.Marketing

      if (type === 2) {
        periodType = 'exePeriodMore'
        status = '1,2,3'
      }
      const period = await getPeriodByStatus(status).catch()
      const { payload = [] } = period || {}

      this[periodType] = payload
    }
  }
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: auto;
}
.dialog-custom {
  margin-bottom: 0 !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 !important;
}
.dialog-center {
  .rule-content {
    padding: 15px;
    min-height: 180px;
    .divider {
      .label {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        justify-content: space-between;
        margin-bottom: 10px;
        span {
          display: flex;
          align-items: center;
          &::before {
            display: inline-block;
            content: '';
            width: 5px;
            height: 22px;
            background: #409eff;
            margin-right: 10px;
          }
        }
      }
      .el-radio {
        margin-right: 10px !important;
      }
      .tooltip-gap {
        margin-right: 20px;
      }
    }
    .excuse-way {
      margin-bottom: 20px;
      .ctn {
        height: 33px;
        display: flex;
        align-items: center;
        .title {
          width: 75px;
        }
      }
    }
    .selected-group {
      .label {
        // margin-bottom: 20px;
      }
      .my-tree {
        .select-all {
          margin-left: 24px;
          span {
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.dialog-footer {
  &.hiddenBtn {
    display: none;
  }
}
</style>
