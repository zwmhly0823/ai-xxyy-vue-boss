<!--
 * @Descripttion: 
 * @version: 
 * @Author: huzhifu
 * @Date: 2020-05-07 10:50:45
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-16 19:12:00
 -->
<template>
  <div class="refund-container">
    <div class="header">
      <h2 style="text-indent:1em">新建退款审批</h2>
    </div>
    <div :class="$style.content">
      <el-form
        label-position="right"
        label-width="130px"
        :model="refundForm"
        :rules="rules"
        ref="refundForm"
      >
        <el-form-item label="选择用户：" prop="name">
          <SearchPhone
            size="medium"
            :class="$style.search_phone100"
            @result="getUid"
            name="uid"
            ref="toGetPhone"
          />
        </el-form-item>

        <el-form-item label="关联订单：" prop="order">
          <el-select
            v-model="refundForm.order"
            placeholder="请选择订单"
            :class="$style.order100"
            clearable
          >
            <el-option
              v-for="item in orderOptions"
              :key="item.outTradeNo"
              :value="item.outTradeNo"
              :label="item.relationOrder"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <el-input v-model="refundForm.businessType" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付渠道：" prop="payChannel">
          <el-input v-model="refundForm.payChannel" disabled></el-input>
        </el-form-item>
        <template v-if="isAlipay">
          <el-form-item label="支付宝账号" prop="alipayAccount">
            <div class="alipayAccount-name">
              <el-input
                v-model="refundForm.alipayAccount"
                placeholder="请输入支付宝账号"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="收款人姓名：" prop="accountName">
            <div class="account-name">
              <el-input
                v-model="refundForm.accountName"
                placeholder="请输入收款人姓名"
              ></el-input>
              <div :class="$style.tip">
                支付宝原路退回的，需要填写支付宝实名认证的姓名
              </div>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="订单金额：" prop="orderAmount">
          <el-input v-model="refundForm.orderAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款类型：" prop="refundType">
          <el-radio-group v-model="refundForm.refundType">
            <el-radio :label="1">课程退款</el-radio>
            <el-radio
              :label="0"
              :disabled="refundForm.businessType === '体验课'"
              v-show="refundForm.businessType !== '体验课'"
              >优惠券退款</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 课程退款&&系统课 -->
        <template
          v-if="refundForm.refundType && refundForm.businessType === '系统课'"
        >
          <el-form-item label="用户已上课周期：" prop="pureWeekYto">
            <el-input v-model="pureWeekYto" disabled></el-input>
          </el-form-item>
          <el-form-item label="选择退款月数：" prop="refundMonths">
            <el-select
              v-model="refundForm.refundMonths"
              placeholder="请选择"
              clearable
              :class="$style.refundMonths100"
            >
              <el-option
                v-for="(item, index) in monthOptions"
                :key="index"
                :label="item.guanzhong"
                :value="item.iphone"
              >
              </el-option>
            </el-select>
            <div :class="$style.tip">用户剩余可上课周期:{{ pureWeekSto }}</div>
          </el-form-item>
        </template>
        <el-form-item
          v-if="!refundForm.refundType && refundForm.businessType === '系统课'"
          label="选择优惠券"
          prop="couponType"
        >
          <el-select
            v-model="refundForm.couponType"
            placeholder="请选择"
            clearable
            :class="$style.refundMonths100"
          >
            <el-option
              v-for="item in couponTypeOptions"
              :key="item.startDate"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款金额：" prop="refundAmount">
          <el-input v-model="refundForm.refundAmount" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-if="refundForm.refundType"
          label="退款原因："
          prop="reason"
        >
          <el-radio-group v-model="refundForm.reason">
            <el-radio label="服务">服务</el-radio>
            <el-radio label="内容">内容</el-radio>
            <el-radio label="销售">销售</el-radio>
            <el-radio label="盒子">盒子</el-radio>
            <el-radio label="其他">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else label="退款原因：" prop="reason">
          <el-radio-group v-model="refundForm.reason">
            <el-radio label="补发优惠券">补发优惠券</el-radio>
            <el-radio label="其他">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款说明：" prop="explain">
          <el-input
            type="textarea"
            v-model="refundForm.explain"
            placeholder="请输入"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件：">
          <el-upload
            action=""
            :http-request="upload"
            :class="$style.refundForm_imageUrl"
            :show-file-list="false"
          >
            <img
              v-if="refundForm.imageUrl"
              :src="refundForm.imageUrl"
              :class="$style.avatar"
            />
            <i
              v-else
              class="el-icon-plus"
              :class="$style.avatar_uploader_icon"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCancel('refundForm')">取消</el-button>
          <el-button type="primary" @click="onSubmit('refundForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// prop 与绑定的form model字段要一致
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
import uploadFile from '@/utils/upload' // 上传公共方法

export default {
  components: {
    SearchPhone
  },
  watch: {
    // 首框改变,清空关联订单
    'refundForm.cellPhone': {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.refundForm.order = ''
        this.orderOptions = []
      }
    },
    // 关联订单改变~巴拉巴拉
    'refundForm.order': {
      immediate: true,
      deep: true,
      async handler(newValue, oldValue) {
        const targetItem = this.orderOptions.filter((item) => {
          return item.outTradeNo === newValue
        })[0]
        // primary->存起来方便公用
        this.selectOrder = targetItem
        console.info('选择关联订单是我,大家快来公用--', targetItem)

        // 查询订单退款规则状态
        if (targetItem && targetItem.id) {
          const {
            code,
            payload: { isRefundStatus }
          } = await this.$http.RefundApproval.getBackStatus({
            orderId: targetItem.id
          }).catch((err) => {
            console.warn(err)
            this.$message({
              message: '未能获取退款新规则',
              type: 'error'
            })
          })
          if (code === 0 && isRefundStatus === 1) {
            // 剥夺退款资格
            this.$confirm('购课超过30天或盒子已经发出, 不支持退款', {
              showCancelButton: false,
              type: 'error'
            }).then(() => {
              this.onCancel('refundForm')
            })
          } else if (code === 0 && isRefundStatus !== 1) {
            this.backStatus = isRefundStatus
          } else {
            this.$message({
              message: '未能获取退款新规则',
              type: 'error'
            })
          }
        }
        // 显示业务类型
        if (targetItem && targetItem.regtype) {
          if (
            targetItem.regtype === 'EXPERIENCE' ||
            targetItem.regtype === 'FIRST_ORDER' ||
            targetItem.regtype === 'RENEW'
          ) {
            this.refundForm.businessType =
              targetItem.regtype === 'EXPERIENCE' ? '体验课' : '系统课'
          } else {
            this.$confirm('该订单类型为兑换赠送类型, 不支持退款', {
              showCancelButton: false,
              type: 'error'
            }).then(() => {
              this.onCancel('refundForm')
            })
          }
        }
        // 只有系统课才去查-已上课时长
        if (
          targetItem &&
          targetItem.id &&
          this.refundForm.businessType === '系统课'
        ) {
          const {
            data: { StudentSystemCourse }
          } = await this.$http.RefundApproval.getPeriod(
            JSON.stringify({ order_no: targetItem.id })
          ).catch((err) => {
            console.warn(err)
            this.$message({
              message: '系统课已上时长未能获取,无法计算退款',
              type: 'warning'
            })
          })
          if (StudentSystemCourse && StudentSystemCourse.remaining_week) {
            this.pureWeekZ = StudentSystemCourse.remaining_week
            this.pureWeekY = StudentSystemCourse.reduce_week
            this.pureWeekS = this.pureWeekZ - this.pureWeekY
          } else {
            this.$message({
              message: '课程已上时长未能获取,无法计算退款',
              type: 'warning'
            })
          }
        }
        // 显示订单金额
        if (targetItem && targetItem.amount) {
          this.refundForm.orderAmount = targetItem.amount
        }
        // 拿到选中订单的id,取支付渠道
        if (targetItem && targetItem.id) {
          this.refundForm.orderId = targetItem.id // 存oid給iphone
          this.$http.RefundApproval.getPaymentPay(
            JSON.stringify({ oid: targetItem.id, status: '2' })
            // 查询条件:status-2完成状态;type-1收入
          )
            .then(({ data: { PaymentPay } }) => {
              const rainbow = {
                JSAPI: '微信内部支付',
                APP: '微信APP支付',
                MWEB: '微信H5支付',
                WAP: '支付宝H5支付',
                APPLE: '苹果支付',
                IMPORT: 'boom'
              }
              if (PaymentPay && PaymentPay.trade_type) {
                if (rainbow[PaymentPay.trade_type] !== 'boom') {
                  this.refundForm.payChannel = rainbow[PaymentPay.trade_type]
                } else {
                  this.$confirm(
                    '<strong>该订单类型为导入订单, 不支持退款</strong>',
                    {
                      dangerouslyUseHTMLString: true,
                      showCancelButton: false,
                      type: 'error'
                    }
                  ).then(() => {
                    this.onCancel('refundForm')
                  })
                }
                if (rainbow[PaymentPay.trade_type] === '支付宝H5支付') {
                  this.isAlipay = true
                }
              } else {
                this.$message({
                  message: '支付渠道未能获取',
                  type: 'warning'
                })
              }
            })
            .catch((e) => {
              console.error(e)
            })
        }
      }
    },
    // 退款类型改变
    'refundForm.refundType': {
      immediate: true,
      deep: true,
      handler(newValue) {
        // 初始就触发,执行前确认关联订单已选择
        if (this.selectOrder && Object.keys(this.selectOrder).length) {
          if (!newValue) {
            // newValue:0 选中优惠券时-获取优惠券列表
            this.couponTypeOptions = []
            this.refundForm.couponType = ''
            this.refundForm.refundAmount = '' // 退款额
            this.$http.RefundApproval.getCoupon({
              packageId: this.selectOrder.packagesId
            })
              .then(({ code, payload }) => {
                if (!code && payload.length) {
                  this.couponTypeOptions = payload
                } else {
                  this.$message({
                    message: '优惠券类型未能获取',
                    type: 'warning'
                  })
                }
              })
              .catch((err) => {
                console.warn(err)
                this.$message({
                  message: '优惠券类型未能获取',
                  type: 'warning'
                })
              })
          } else {
            // newValue:1 选中课程退款时-创建退款周期数组(依赖接口数据async↓↓)
            this.monthOptions = []
            this.refundForm.refundMonths = ''
            this.refundForm.refundAmount = '' // 退款额
            if (this.refundForm.businessType === '系统课') {
              if (this.backStatus === 2) {
                if (this.pureWeekS === this.pureWeekZ) {
                  this.decreaseOne = 1
                  this.$message({
                    message: '该订单退款时,需要扣除当月费用',
                    type: 'warning'
                  })
                } else {
                  this.decreaseOne = 0
                  this.$message({
                    message: '该订单可退全额费用',
                    type: 'success'
                  })
                }
              }
              const shengYue = Math.floor(this.pureWeekS / 4) - this.decreaseOne
              console.warn(
                '可退月份:' + shengYue,
                '可退周数:' + this.pureWeekS,
                '是否扣当月:' + this.decreaseOne
              )

              if (shengYue <= 0) {
                this.$confirm('该订单剩余课程时间不足1个月, 不支持退款', {
                  showCancelButton: false,
                  type: 'error'
                }).then(() => {
                  this.onCancel('refundForm')
                })
              } else {
                for (let i = 1; i <= shengYue; i++) {
                  const item = {}
                  item.guanzhong = i + '个月'
                  item.iphone = 4 * i
                  this.monthOptions.push(item)
                }
                // 算每月单价
                this.everyPrice = (
                  this.refundForm.orderAmount /
                  (this.pureWeekZ / 4)
                ).toFixed(2)
              }
            } else {
              // 体验课直接退全部
              this.refundForm.refundAmount = this.refundForm.orderAmount
            }
          }
        }
      }
    },
    // 优惠券种类改变,更新退款额
    'refundForm.couponType': {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue) {
          const targetItem = this.couponTypeOptions.filter((item) => {
            return item.name === newValue
          })[0]
          this.refundForm.refundAmount = targetItem.amount
        }
      }
    },
    // 退几个月,更新退款额
    'refundForm.refundMonths': {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue) {
          this.refundForm.refundAmount =
            this.refundForm.refundMonths * this.everyPrice
        }
      }
    }
  },
  data() {
    var validateName = (rule, value, callback) => {
      setTimeout(() => {
        if (this.refundForm.name && this.refundForm.cellPhone) {
          callback() // 该控件咩有用v-model绑定name;自定义校验-以获取到uid为准
        } else {
          callback(new Error('此手机号未能获取uid'))
        }
      }, 200)
    }
    return {
      refundForm: {
        name: '', // 用户uid
        order: '', // 订单号
        businessType: '', // 业务类型
        payChannel: '',
        accountName: '',
        alipayAccount: '',
        orderAmount: '',
        refundType: '',
        couponType: '', // 优惠券类型
        refundMonths: '', // 退款周数(给接口)
        refundAmount: '', // 退款金额(给接口)
        reason: '',
        explain: '',
        imageUrl: '',
        // 附加
        orderId: '', // 取关联订单项的id
        cellPhone: ''
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        order: [
          { required: true, message: '请选择关联订单', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请输入业务类型', trigger: 'blur' }
        ],
        payChannel: [
          { required: true, message: '请输入支付渠道', trigger: 'blur' }
        ],
        alipayAccount: [
          { required: true, message: '请输入支付宝账号', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '请输入收款人姓名', trigger: 'blur' }
        ],
        orderAmount: [
          { required: true, message: '请输入订单金额', trigger: 'blur' }
        ],
        refundType: [
          { required: true, message: '请选择退款类型', trigger: 'change' }
        ],
        refundMonths: [
          { required: true, message: '请选择退款月数', trigger: 'change' }
        ],
        couponType: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        refundAmount: [
          { required: true, message: '请输入退款金额', trigger: 'blur' }
        ],
        explain: [{ required: true, message: '请选择原因', trigger: 'change' }],
        reason: [
          { required: true, message: '请输入说明', trigger: 'blur' },
          { min: 0, max: 50, message: '最大长度50个字符', trigger: 'change' }
        ]
      },
      monthOptions: [], // 退款月份项
      orderOptions: [], // 关联订单项
      couponTypeOptions: [], // 优惠券项
      selectOrder: '', // 公用选中的订单项
      backStatus: '',
      isAlipay: false,
      everyPrice: '', // 月单价
      pureWeekZ: '', // 总周数(给接口)
      pureWeekY: '', // 已周数(给接口)
      pureWeekS: '' // 剩周数(给接口)
    }
  },
  computed: {
    pureWeekYto() {
      // 已经上课时间
      if (this.pureWeekY === '') {
        return ''
      }
      const item =
        this.pureWeekY / 4 > 1
          ? `${Math.floor(this.pureWeekY / 4)}个月零${this.pureWeekY % 4}周`
          : `${this.pureWeekY % 4}周`
      return item
    },
    pureWeekSto() {
      // 剩余上课时间
      const result = this.pureWeekZ - this.pureWeekY
      const item =
        result / 4 > 1
          ? `${Math.floor(result / 4)}个月零${result % 4}周`
          : `${result % 4}周`
      return item
    }
  },
  methods: {
    // 选择手机号后获取uid和手机号
    getUid({ uid }) {
      this.refundForm.name = uid
      this.refundForm.cellPhone = this.$refs.toGetPhone.input
      this.$http.Order.getOrdersByUid(uid) // 用uid获取订单
        .then(({ code, payload: { content } }) => {
          if (!code && content.length) {
            this.refundForm.order = ''
            this.orderOptions = []
            this.orderOptions = content.map((item) => {
              item.relationOrder =
                item.outTradeNo.replace(/[^\d]+/g, '') +
                `(^_^)${item.packagesName}`
              return item
            })
          } else {
            this.$message({
              message: '该手机号未查询到订单',
              type: 'warning'
            })
          }
        })
        .catch((err) => console.error(err))
    },
    // 提交表单
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params1 = {
            userId: this.refundForm.name, // userId(选择用户取)
            customerPhone: this.refundForm.cellPhone, // 客户手机(选择用户取)
            orderId: this.refundForm.orderId, // 订单id(关联订单取)
            outTradeNo: this.refundForm.order, // 订单号(关联订单取)
            productMsg: this.selectOrder.relationOrder.split('(^_^)')[1], // 商品信息(关联订单取)
            regType: this.refundForm.businessType, // 业务类型
            channel: this.refundForm.payChannel, // 支付渠道
            payeeName: this.refundForm.accountName, // 收款人姓名
            payeeAccount: this.refundForm.alipayAccount, // 支付宝账号
            orderFee: this.refundForm.orderAmount, // 订单金额
            refundType: this.refundForm.refundType, // 退款类型:课程退款-1，优惠券退款-0
            refundFee: this.refundForm.refundAmount, // 退款金额
            refundReason: this.refundForm.reason, // 退款原因
            refundMsg: this.refundForm.explain, // 退款说明
            couponType: this.refundForm.couponType, // 选择退哪种优惠券
            attsUrl: this.refundForm.imageUrl, // 附件地址

            periodAll: this.pureWeekZ, // 订单总周期“周”
            periodAlready: this.pureWeekY, // 已上课周期“周”
            periodResidue: this.pureWeekS, // 剩余上课周期“周”
            periodRefund: this.refundForm.refundMonths, // 选择退款周期“周”
            applyUserId: JSON.parse(localStorage.getItem('teacher')).id,
            applyUserName: JSON.parse(localStorage.getItem('teacher')).realName,
            applyUserDeapartmentId: JSON.parse(localStorage.getItem('teacher'))
              .departmentId,
            applyUserDeapartmentName: JSON.parse(
              localStorage.getItem('teacher')
            ).department
          }
          this.$http.RefundApproval.submito(params1)
            .then(({ code }) => {
              if (!code) {
                this.$router.push({
                  name: 'approvalCenter',
                  params: { activeApprove: 'second' }
                })
                // 回首掏
                this.onCancel('refundForm')
              }
            })
            .catch((err) => {
              console.info(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 置空表单
    onCancel(formName) {
      this.$refs[formName].resetFields()
    },
    // 上传附件
    upload(file) {
      uploadFile(file).then((res) => {
        this.refundForm.imageUrl = res // 取来图片remote地址
      })
    }
  },
  created() {
    // console.info(JSON.parse(localStorage.getItem('teacher')).id)
  }
}
</script>

<style lang="scss" module>
.content {
  padding: 10px 20px 10px;
}
.tip {
  color: navy;
}

.search_phone100 {
  width: 100% !important;
  // 体外控制手机号组件样式(组件内100%w,根节点别写样式造成局限)
  // 只生效当前显示页面(组件),追加给子组件的全局或局部类名
}
.order100 {
  width: 100%;
}
.refundMonths100 {
  width: 100%;
}

.refundForm_imageUrl {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 178px;
  overflow: hidden;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar_uploader_icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>
