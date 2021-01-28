<template>
  <div class="students-popup">
    <div>
      <el-dialog
        title="发放优惠卷"
        :visible.sync="issueCoupons"
        width="30%"
        :append-to-body="true"
      >
        <span class="label">选择优惠卷:</span>
        <el-select
          v-model="value"
          popper-class="select-sty"
          no-data-text="没有更多优惠券了"
          @change="seletedCoupon"
        >
          <el-option
            v-for="(item, index) of couponDropdown"
            :key="index"
            :label="`${item.amount}元${item.name} `"
            :value="item.amount"
          >
          </el-option>
        </el-select>
        <div class="coupons-time">
          <span class="label">选择到期时间:</span>
          <!-- <el-date-picker
            v-model="couponsTime"
            type="datetime"
            placeholder="请设置优惠券到期时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker> -->
          <el-date-picker
            v-model="couponsDate"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerDateOptions"
          >
          </el-date-picker>
        </div>
        <div class="coupons-time">
          <span class="label"></span>
          <el-time-select
            v-model="couponsTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
              minTime: now
            }"
            placeholder="请选择小时"
          >
          </el-time-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="issueCoupons = false">取 消</el-button>
          <el-button type="primary" :plain="true" @click="issueCouponsBtn">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="发放优惠券"
        :visible.sync="couponConf"
        width="30%"
        :append-to-body="true"
      >
        <i class="el-icon-warning">
          <span>
            是否确认向用户发放"{{ dropdownSelected.amount }}元
            {{ dropdownSelected.name }}"
            <br />
            到期时间：{{ couponsDateTime }}
          </span>
        </i>
        <span slot="footer" class="dialog-footer">
          <el-button @click="couponConf = false">取 消</el-button>
          <el-button type="primary" @click="couponconfBtn(dropdownSelected.id)">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <div class="paid-out">
      <el-dialog
        title="发放完毕"
        :visible.sync="couponSuccessful"
        width="30%"
        :append-to-body="true"
      >
        <div
          class="coupons-successful"
          v-show="paidOut === 'OK' || paidOut === 'ALL'"
        >
          {{ paidoutOk }}张优惠券发放成功
        </div>
        <div
          class="coupons-failure"
          v-show="paidOut === 'NO' || paidOut === 'ALL'"
        >
          {{ paidoutNo }}张优惠券发放失败
        </div>
        <!-- 优惠卷发放失败原因 -->
        <div class="failure-why" v-show="paidOut === 'NO' || paidOut === 'ALL'">
          <div v-for="(item, index) in failureWhy" :key="index">
            {{ index + 1 }}.用户:{{ item.mobile }} 失败原因:{{
              item.errorReason
            }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="couponsucBtn">取 消</el-button>
          <el-button type="primary" @click="couponsucBtn">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { isToss } from '@/utils'
export default {
  props: {
    couponData: Array,
    selectUserId: Array,
    needReload: Boolean
  },
  data() {
    return {
      pickerDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 发放优惠券弹窗
      issueCoupons: false,
      // 发放优惠券弹窗下拉菜单
      couponDropdown: [],
      // 选中哪张优惠券(用于接口)
      dropdownSelected: {},
      // 下拉框的v-model
      value: '',
      // 优惠卷日期
      couponsDate: '',
      // 优惠卷时间
      couponsTime: '',
      // 格式化优惠券
      formcouponsTime: '',
      // 优惠券发放确认弹窗
      couponConf: false,
      // 优惠券发放成功弹窗
      couponSuccessful: false,
      // 优惠券发放显示判断
      paidOut: '',
      // 优惠卷发放成功条数
      paidoutOk: '',
      // 优惠卷发放失败条数
      paidoutNo: '',
      // 优惠卷发放失败原因
      failureWhy: [],
      teacherInfo: {},
      // 当前时间
      now: '',
      // 系统课老师可发放优惠券ID
      systemCouponIds: ['11', '20'],
      // 体验课老师可发放优惠券ID
      trialCouponIds: ['6', '11', '20']
    }
  },
  computed: {
    // 选择的日期和时间组合
    couponsDateTime() {
      if (this.couponsDate && this.couponsTime) {
        return `${this.couponsDate} ${this.couponsTime}`
      }
      return ''
    }
  },
  created() {
    // this.teacherInfo = isToss(true)
  },
  mounted() {},
  watch: {
    couponsDateTime(val) {
      console.log(val)
    },
    couponData(val) {
      this.couponDropdown = val.filter((item) => {
        return this.trialCouponIds.includes(item.id)
      })
    },
    selectUserId(val) {
      console.log(val, '用户idprops传参')
    }
  },
  methods: {
    // 选中优惠券
    seletedCoupon(val) {
      this.dropdownSelected = this.couponDropdown.find(
        (item) => item.amount === val
      )
    },
    // 确认优惠券
    issueCouponsBtn() {
      if (!this.value) {
        this.$message.error('请选择优惠券')
        return
      }
      if (!this.couponsDate) {
        this.$message({
          showClose: true,
          message: '请选择优惠券到期日期',
          type: 'warning'
        })
        return
      }
      if (!this.couponsTime) {
        this.$message({
          showClose: true,
          message: '请选择优惠券到期时间',
          type: 'warning'
        })
        return
      }
      if (
        this.couponsDateTime &&
        new Date().getTime() > new Date(this.couponsDateTime).getTime()
      ) {
        this.$message({
          showClose: true,
          message: '到期时间应大于当前时间',
          type: 'warning'
        })
        return
      }

      this.issueCoupons = false
      this.couponConf = true
      // this.formcouponsTime = formatData(this.couponsDateTime, 's')
    },
    // 优惠券发放确认弹窗
    couponconfBtn(id) {
      console.log(id, '90890890')

      this.couponConf = false
      this.couponSuccessful = true
      this.$http.Team.sendCoupon(
        id,
        new Date(this.couponsDateTime).getTime(),
        this.selectUserId
      ).then((res) => {
        if (res.payload.length === 0) {
          // 成功
          this.paidoutOk = this.selectUserId.length
          this.paidOut = 'OK'
        } else if (res.payload.length === this.selectUserId.length) {
          // 失败
          this.paidoutNo = this.selectUserId.length
          this.paidOut = 'NO'
          this.failureWhy = res.payload
        } else if (res.payload.length !== this.selectUserId.length) {
          // 都显示
          this.paidoutOk = this.selectUserId.length - res.payload.length
          this.paidoutNo = res.payload.length
          this.paidOut = 'ALL'
          this.failureWhy = res.payload
        }
      })
    },
    // 优惠券发放成功弹窗
    couponsucBtn() {
      this.couponSuccessful = false
      this.$emit('couponSendSucc')
      // 需要刷新当前页面的情况
      if (this.needReload) {
        location.reload()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.label {
  width: 100px;
}
.coupons-successful {
  font-size: 14px;
  text-align: center;
  color: #606266;
}
.coupons-failure {
  font-size: 14px;
  text-align: center;
  color: #f56c6c;
}
// 优惠卷发放失败原因
.failure-why {
  margin: 10px 0 0 0;
  padding: 10px;
  height: 100px;
  overflow: auto;
  border: 1px solid #eaeefb;
  font-size: 14px;
  color: #909399;
}

.el-date-editor {
  width: 70%;
  margin: 10px 0 0 10px;
}
</style>
<style lang="scss" scoped>
/deep/ {
  .el-button--text {
    display: none !important;
  }

  .el-select {
    width: 70%;
    margin-left: 10px;
  }
  .el-dialog__body {
    color: #e6a13c !important;
    font-size: 18px;
    padding: 10px 20px;
    span {
      color: #606266;
      font-size: 14px;
      display: inline-table;
      padding: 0 0 0 5px;
      line-height: 20px;
    }
  }
}
</style>
