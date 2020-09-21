<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-21 21:48:42
-->
<template>
  <el-dialog
    :title="'新建定向发放规则'"
    :visible.sync="centerDialog"
    width="60%"
    top="10vh"
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
            <el-radio v-model="formData.exeType" label="0">仅选中期</el-radio>
            <div class="tooltip-gap">
              <el-tooltip
                class="item"
                effect="dark"
                content="Right Center 提示文字"
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
              :disabled="formData.exeType == '1'"
              multiple
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
            <el-radio v-model="formData.exeType" label="1"
              >仅选中期及后续所有期</el-radio
            >
            <div class="tooltip-gap">
              <el-tooltip
                class="item"
                effect="dark"
                content="Right Center 提示文字"
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
              :disabled="formData.exeType == '0'"
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
              @changeSubmit="changeSubmit"
            ></dept-tree>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
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
    }
  },
  data() {
    return {
      isSubmit: false,
      checkedAll: false,
      formData: {
        exeType: '0',
        exePeriod: [],
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
      dayDeptId: {}
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
    // TODO: 查看的时候用
    // this.getDayTimeAndDeptId({
    //   couponDispensadRulesId: 17
    // })
  },
  mounted() {},
  watch: {
    'formData.exeType': {
      handler: function(newVal, old) {
        if (old === '0') {
          this.formData.exePeriod = []
        } else if (old === '1') {
          this.formData.periodMore = ''
        }
      }
    }
  },
  methods: {
    validateData() {
      const { exeType, exePeriod, periodMore } = this.formData
      console.log(
        'exeType,exePeriod,periodMore',
        exeType,
        exePeriod,
        periodMore
      )
      if (exeType === '0' && !exePeriod.length) {
        this.$message.warning('请选择执行期')
        return 0
      } else if (exeType === '1' && periodMore === '') {
        this.$message.warning('请选择执行期')
        return 0
      }
      return 1
    },
    /** 新增、修改 优惠券发放规则，部门id和天数关联数据 TODO: */
    async getDayTimeAndDeptId(params) {
      const { getDayTimeAndDeptId } = this.$http.Marketing
      const dayDeptIds = await getDayTimeAndDeptId(params).catch()
      //
      const { payload: { couponDispensedDetails = [] } = {} } = dayDeptIds || {}

      return couponDispensedDetails
    },
    /** img-upload */
    dialogClose() {
      this.$emit('emitDialogOperate', { close: true })
    },
    packageDeptIdAndDay(allTree, checkedNode) {
      // console.log('----', allTree, checkedNode)
      return checkedNode.map((item) => {
        return {
          day: item.day,
          uid: item.id
        }
      })
    },
    bundleData(a, b) {
      const couponDispensedDetails = this.packageDeptIdAndDay(a, b)

      const {
        formData: { exeType, exePeriod, periodMore },
        couponInfo: { id: couponId, name: couponName }
      } = this

      const periodAndName = {}
      const couponDispensedRules = {}
      const periodName = []
      const periodList = exeType === '0' ? exePeriod : periodMore // periodMore 是 string
      const originPeriodArr =
        exeType === '0' ? 'onlyExePeriod' : 'exePeriodMore'

      this[originPeriodArr].forEach((item) => {
        periodAndName[item.period] = item.periodName
      })

      periodList.forEach((p) => {
        periodName.push(periodAndName[p])
      })

      Object.assign(couponDispensedRules, {
        period: periodList.join(),
        periodName: periodName.join(),
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
      this.isSubmit = true
      // this.$emit('emitDialogOperate', { close: true })
    },
    // 仅选中期被选中change事件
    async onlyExePeriodChange(res) {
      console.log('onlyExePeriodChange-res', res)
      const dayDeptId = await this.getDayTimeAndDeptId({
        couponDispensadRulesId: res.join()
      })
      const deptAndDay = {}
      dayDeptId.forEach((item) => {
        const { day, uid } = item
        deptAndDay[uid] = day
      })
      /** 回显 tree */
      this.dayDeptId = deptAndDay
    },
    changeSubmit({ val, oldVal, deptFlatList, checkedNode }) {
      if (val && !oldVal) {
        if (!this.validateData()) {
          this.isSubmit = false
        } else {
          console.log('保存')
          /** 打包好的需要掉接口的数据 */
          const result = this.bundleData(deptFlatList, checkedNode)
          console.log(result, 'result')
          this.saveCouponRule(result)

          setTimeout(() => {
            this.isSubmit = false
          }, 3000)
        }
      }
    },
    /** 新增 优惠券发放规则， 保存按钮 */
    async saveCouponRule(params) {
      const { saveCouponRule } = this.$http.Marketing

      const save = await saveCouponRule(params).catch()
      if (save && save.code === 0) {
        this.$message.success('保存成功')
      }
    },
    /** 优惠券 期 下拉框 */
    /**
     * @status 0 待开始；1 招生中；2 待开课；3 上课中；4 已结课"
     * @desc 1、仅选中期--->仅可选择开课中、待开课期，可支持多选（2,3）；
     *       2、选中期和后续所有期---->仅可选择开课中、待开课、招生中期，仅可单选(1,2,3)
     *
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
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
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
        margin-bottom: 20px;
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
  &.is-edit {
  }
}
</style>
