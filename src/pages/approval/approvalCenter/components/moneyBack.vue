<!--
 * @Descripttion: 
 * @version: 
 * @LastEditors: liukun
 * @LastEditTime: 2020-07-04 18:15:11
 -->
<template>
  <div class="adjustModule">
    <div class="title">
      <i class="el-icon-arrow-left back-icon" @click="back"></i>
      <span class="title-text">退款审批</span>
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
          <div :class="$style.tip" v-if="isThird">该订单为第三方导入订单</div>
        </el-form-item>
        <el-form-item label="退款规则：" prop="isRules">
          <el-input
            v-model="refundForm.isRules"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <el-input
            v-model="refundForm.businessType"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单来源" prop="orderSource" v-if="isThird">
          <el-input
            v-model="refundForm.orderSource"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付渠道：" prop="payChannel">
          <el-input
            v-model="refundForm.payChannel"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>
        <template v-if="isAlipay">
          <el-form-item label="支付宝账号：" prop="alipayAccount">
            <div class="alipayAccount-name">
              <el-input
                v-model="refundForm.alipayAccount"
                placeholder="请输入支付宝账号"
                :class="$style.order100"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="收款人姓名：" prop="accountName">
            <div class="account-name">
              <el-input
                v-model="refundForm.accountName"
                placeholder="请输入收款人姓名"
                :class="$style.order100"
              ></el-input>
              <div :class="$style.tip">
                支付宝原路退回的，需要填写支付宝实名认证的姓名
              </div>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="交易金额：" prop="orderAmount">
          <el-input
            v-model="refundForm.orderAmount"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>
        <el-form-item label="剩余金额：" prop="residueFee">
          <el-input
            v-model="refundForm.residueFee"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>
        <el-form-item label="退款类型：" prop="refundType">
          <el-radio-group v-model="refundForm.refundType">
            <el-radio :label="1">课程退款</el-radio>
            <el-radio :label="2" v-show="refundForm.businessType === '系统课'"
              >降半年课包</el-radio
            >
            <el-radio :label="3" v-show="refundForm.businessType === '系统课'"
              >补偿</el-radio
            >
            <el-radio :label="0" v-show="refundForm.businessType === '系统课'"
              >优惠券退款</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <!-- 课程退款&&系统课 -->
        <template
          v-if="refundForm.refundType && refundForm.businessType === '系统课'"
        >
          <el-form-item label="用户已上课周期：" prop="pureWeekYto">
            <el-input
              v-model="pureWeekYto"
              disabled
              :class="$style.order100"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="选择退款月数：" prop="refundMonths">
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
          </el-form-item> -->
        </template>
        <el-form-item
          v-if="
            refundForm.refundType === 0 && refundForm.businessType === '系统课'
          "
          label="选择优惠券："
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
          <el-input
            v-model="refundForm.refundAmount"
            disabled
            :class="$style.order100"
          ></el-input>
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
            <!-- <el-radio label="其他">其他</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else label="退款原因：" prop="reason">
          <el-radio-group v-model="refundForm.reason">
            <el-radio label="补发优惠券">补发优惠券</el-radio>
            <!-- <el-radio label="其他">其他</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="退款说明：" prop="explain">
          <el-input
            :class="$style.order100"
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
        this.refundForm.isRules = ''
        this.refundForm.businessType = ''
        this.refundForm.payChannel = ''
        this.refundForm.accountName = ''
        this.refundForm.alipayAccount = ''
        this.refundForm.orderAmount = ''
        this.refundForm.residueFee = '' // 剩余金额
        this.refundForm.refundType = ''
        this.refundForm.couponType = ''
        this.refundForm.refundMonths = ''
        this.refundForm.refundAmount = '' // 退款金额
        this.refundForm.reason = ''
        this.refundForm.explain = ''
        this.refundForm.imageUrl = ''
        this.refundForm.orderId = ''
        this.refundForm.order = ''
        this.refundForm.orderSource = '' // 订单来源
        this.refundForm.orderSourceId = '' // 订单来源id
        this.orderOptions = []

        // this.monthOptions = [] // 退款月份项
        this.couponTypeOptions = [] // 优惠券项
        this.selectOrder = '' // 公用选中的订单项
        // this.backStatus= ''
        this.isAlipay = false
        this.everyPrice = '' // 月单价
        this.pureWeekY = '' // 已周数(给接口)
        this.pureWeekS = '' // 剩周数(给接口)
        this.isThird = '' // 是否第三方
      }
    },
    // 关联订单改变~巴拉巴拉
    'refundForm.order': {
      immediate: true,
      deep: true,
      async handler(newValue, oldValue) {
        this.isAlipay = false
        this.refundForm.payChannel = '' // 支付渠道
        this.refundForm.refundType = '' // 退款类型
        this.refundForm.orderAmount = '' // 交易金额
        this.refundForm.residueFee = '' // 剩余金额
        this.refundForm.refundAmount = '' // 退款金额(给女测试)
        const targetItem = this.orderOptions.filter((item) => {
          return item.outTradeNo === newValue
        })[0]
        // primary->存起来方便公用
        this.selectOrder = targetItem
        console.info('选择关联订单是我,大家快来公用--', targetItem)

        // 导入订单红色显示(只限体验课)
        if (targetItem && targetItem.regtype === 'EXPERIENCE') {
          this.isThird =
            Number(targetItem.importTime) > 0 && targetItem.importTime ? 1 : 0
          console.info(this.isThird)
        }

        // 获取该订单剩余金额
        if (this.isThird) {
          // 第三方直接为0
          this.refundForm.residueFee = 0
        } else {
          if (targetItem && targetItem.id) {
            const {
              code,
              payload
            } = await this.$http.RefundApproval.getResidueFee({
              orderId: targetItem.id
            }).catch((err) => {
              console.warn(err)
              this.$message({
                message: '该订单剩余金额获取失败',
                type: 'error'
              })
            })
            if (!code && payload > 0) {
              this.refundForm.residueFee = payload
            } else {
              this.$message({
                message: '该订单剩余金额获取失败或为0',
                type: 'warning'
              })
              this.$refs.refundForm.resetFields()
            }
          }
        }

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
              message: '未能获取退款规则',
              type: 'error'
            })
          })
          if (code === 0 && isRefundStatus === 1) {
            this.refundForm.isRules = '不符合'
          } else if (code === 0 && isRefundStatus !== 1) {
            // this.backStatus = isRefundStatus
            this.refundForm.isRules = '符合'
          } else {
            this.$message({
              message: '未能获取退款规则',
              type: 'warning'
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
            // this.$confirm('该订单类型为兑换赠送类型, 不支持退款', {
            //   showCancelButton: false,
            //   type: 'error'
            // }).then(() => {
            //   this.onCancel('refundForm')
            // })
          }
        }
        // 只有体验课,才去查-订单来源
        if (
          targetItem &&
          targetItem.id &&
          targetItem.regtype === 'EXPERIENCE'
        ) {
          const { code, payload } = await this.$http.RefundApproval.getChannel(
            targetItem.payChannel
          ).catch((err) => {
            console.error(err)
            this.$message({
              message: '第三方导入订单来源获取失败',
              type: 'error'
            })
          })
          if (!code && payload && payload.channelOuterName) {
            this.refundForm.orderSource = payload.channelOuterName
            this.refundForm.orderSourceId = payload.id
          } else {
            this.$message({
              message: '第三方导入订单来源获取失败',
              type: 'warning'
            })
          }
        }

        // 只有系统课才去查-已上课时
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
              message: '系统课剩余信息未获能获取,无法计算退款',
              type: 'error'
            })
          })
          if (StudentSystemCourse && StudentSystemCourse.remaining_week) {
            this.pureWeekS = StudentSystemCourse.remaining_week
            this.pureWeekY = StudentSystemCourse.reduce_week
            console.info(
              `选择系统订单后接口得到剩余${this.pureWeekS},已经${this.pureWeekY}`
            )
          } else {
            this.$message({
              message: '系统课剩余信息未获取或为0,无法计算退款',
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
                IMPORT: '第三方订单支付'
              }
              if (PaymentPay && PaymentPay.trade_type) {
                this.refundForm.payChannel = rainbow[PaymentPay.trade_type]
                // this.$confirm(
                //   '<strong>该订单类型为导入订单, 不支持退款</strong>',
                //   {
                //     dangerouslyUseHTMLString: true,
                //     showCancelButton: false,
                //     type: 'error'
                //   }
                // ).then(() => {
                //   this.onCancel('refundForm')
                // })

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
              this.$message({
                message: '支付渠道未能获取',
                type: 'error'
              })
            })
        }
      }
    },
    // 退款类型改变
    'refundForm.refundType': {
      immediate: true,
      deep: true,
      async handler(newValue) {
        // 初始就触发,执行前确认关联订单已选择
        if (this.selectOrder && Object.keys(this.selectOrder).length) {
          // 判断系统课是整年or半年
          if (
            this.refundForm.businessType === '系统课' &&
            (newValue === 1 || newValue === 2) &&
            this.selectOrder.packagesId
          ) {
            this.half = '' // 全年、半年
            const {
              code,
              payload
            } = await this.$http.RefundApproval.getPackages(
              this.selectOrder.packagesId
            ).catch((err) => {
              console.error(err)
              this.$message({
                message: '系统课分类失败,无法计算退款',
                type: 'error'
              })
            })
            if (!code && payload.type === 'SYSTEM_COURSE_HALFYEAR') {
              this.half = 180
            } else if (!code && payload.type === 'SYSTEM_COURSE_YEAR') {
              this.half = 365
            } else {
              this.$message({
                message: '系统课分类失败,无法计算退款',
                type: 'warning'
              })
            }
          }

          if (newValue === 0) {
            // newValue:0 选中优惠券时-获取优惠券列表
            this.refundForm.refundAmount = '' // 退款额
            this.refundForm.refundMonths = ''

            if (this.refundForm.residueFee >= 200) {
              this.couponTypeOptions = []
              this.refundForm.couponType = ''
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
                    type: 'error'
                  })
                })
            } else {
              this.$message({
                message: '当前剩余金额小于200元,不能选择优惠券退款昂',
                type: 'warning'
              })
            }
          } else if (newValue === 1) {
            // newValue:1 选中课程退款时-创建退款周期数组(依赖接口数据async↓↓)
            // this.monthOptions = []
            this.refundForm.refundMonths = ''
            this.refundForm.refundAmount = '' // 退款额
            if (this.refundForm.businessType === '系统课') {
              if (this.pureWeekS && this.pureWeekY !== '') {
                // 计算系统课退费,得保证取到剩总课时和已上课时
                const shengYue = Math.floor(this.pureWeekS / 4)
                console.warn(
                  '选择退款类型为课程退款-系统课,计算所得',
                  '可退月份:' + shengYue,
                  '剩余可退总周数:' + this.pureWeekS
                )
                // 计算系统课退费
                if (shengYue <= 0) {
                  this.$confirm('该订单剩余课程时间不足1个月, 不支持退款', {
                    showCancelButton: false,
                    type: 'error'
                  }).then(() => {
                    this.onCancel('refundForm')
                  })
                } else {
                  if (this.half === 180) {
                    this.refundForm.refundAmount = Math.round(
                      ((1499 / 6) * shengYue).toFixed(2)
                    )
                  } else if (this.half === 365) {
                    this.refundForm.refundAmount = Math.round(
                      ((2600 / 12) * shengYue).toFixed(2)
                    )
                  }
                  this.refundForm.refundMonths = shengYue
                  // for (let i = 1; i <= shengYue; i++) {
                  //   const item = {}
                  //   item.guanzhong = i + '个月'
                  //   item.iphone = i
                  //   this.monthOptions.push(item)
                  // }
                  // 计算出每月单价后,交给change事件算退费
                  // if (this.selectOrder && this.selectOrder.id) {
                  //   const {
                  //     code,
                  //     payload: { price }
                  //   } = await this.$http.RefundApproval.getEveryPrice(
                  //     this.selectOrder.id
                  //   ).catch((err) => {
                  //     console.warn('获取订单单价接口报错:', err)
                  //     this.$message({
                  //       message: '获取订单单价接口报错',
                  //       type: 'error'
                  //     })
                  //   })
                  //   // 单价赋值成功
                  //   if (code === 0) {
                  //     this.everyPrice = price * 4
                  //     console.info(
                  //       '接口拿到系统课周单价:',
                  //       price,
                  //       '换算得到月单价:',
                  //       this.everyPrice
                  //     )
                  //   }
                  // }
                }
              } else {
                // 课程剩余总课时或已上课时未能获取,怎么计算系统课退费呀
              }
            } else {
              // 体验课直接退全部,导入型直接0
              this.refundForm.refundAmount = this.isThird
                ? 0
                : this.refundForm.residueFee
            }
          } else if (newValue === 2) {
            // 降为半年包
            this.refundForm.refundAmount = '' // 退款额
            this.refundForm.refundMonths = ''
            const shengYue = Math.floor(this.pureWeekS / 4)
            if (
              this.half === 365 &&
              shengYue >= 6 &&
              this.refundForm.residueFee >= 1101
            ) {
              this.refundForm.refundAmount = 1101
              this.refundForm.refundMonths = 6
            } else {
              this.$message({
                message: '该订单课余量低于6或不是全年课,不支持降包类型',
                type: 'warning'
              })
            }
          } else if (newValue === 3) {
            // 补偿
            this.refundForm.refundAmount = '' // 退款额
            this.refundForm.refundMonths = ''
            if (this.refundForm.residueFee >= 1101) {
              this.refundForm.refundAmount = 1101
            } else {
              this.$message({
                message: '退款金额不能大于剩余金额',
                type: 'warning'
              })
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
    }
    // 退几个月,更新退款额
    // 'refundForm.refundMonths': {
    //   immediate: true,
    //   deep: true,
    //   handler(newValue) {
    //     if (newValue) {
    //       // 退款_向上取整
    //       this.refundForm.refundAmount = Math.round(
    //         Number(this.refundForm.refundMonths * this.everyPrice).toFixed(2)
    //       )
    //     }
    //   }
    // }
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
        isRules: '', // 该订单是否符合规则
        name: '', // 用户uid
        order: '', // 订单号
        businessType: '', // 业务类型
        payChannel: '',
        accountName: '',
        alipayAccount: '',
        orderAmount: '',
        residueFee: '', // 剩余金额
        refundType: '',
        couponType: '', // 优惠券类型
        refundMonths: '', // 退款周数(给接口)
        refundAmount: '', // 退款金额(给接口)
        reason: '',
        explain: '',
        imageUrl: '',
        // 附加
        orderId: '', // 取关联订单项的id
        cellPhone: '',
        orderSource: '', // 订单来源+
        orderSourceId: '' // 订单来源id+
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        order: [
          { required: true, message: '请选择关联订单', trigger: 'change' }
        ],
        isRules: [
          { required: true, message: '退款规则为必填项', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请输入业务类型', trigger: 'blur' }
        ],
        orderSource: [
          { required: true, message: '请输入第三方订单来源', trigger: 'blur' }
        ],
        payChannel: [
          { required: true, message: '请输入支付渠道', trigger: 'blur' }
        ],
        alipayAccount: [
          { required: true, message: '请输入支付宝账号', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: '你家支付宝账号能有汉字?',
            trigger: 'blur'
          }
        ],
        accountName: [
          { required: true, message: '请输入收款人姓名', trigger: 'blur' }
        ],
        orderAmount: [
          { required: true, message: '请输入订单金额', trigger: 'blur' }
        ],
        residueFee: [{ required: true, message: '该项必填', trigger: 'blur' }],
        refundType: [
          { required: true, message: '请选择退款类型', trigger: 'change' }
        ],
        // refundMonths: [
        //   { required: true, message: '请选择退款月数', trigger: 'change' }
        // ],
        couponType: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        refundAmount: [
          { required: true, message: '请输入退款金额', trigger: 'blur' }
        ],
        explain: [
          { required: true, message: '请选择原因', trigger: 'change' },
          {
            min: 0,
            max: 200,
            message: '200个字符是上限',
            trigger: 'change'
          }
        ],
        reason: [{ required: true, message: '请输入说明', trigger: 'blur' }]
      },
      // monthOptions: [], // 退款月份项
      orderOptions: [], // 关联订单项
      couponTypeOptions: [], // 优惠券项
      selectOrder: '', // 公用选中的订单项
      // backStatus: '',
      isAlipay: false,
      everyPrice: '', // 月单价
      pureWeekY: '', // 已周数(给接口)
      pureWeekS: '', // 剩周数(给接口)
      isThird: 0, // 是第三方订单麽+
      half: ''
    }
  },
  computed: {
    pureWeekYto() {
      // 已经上课时间
      if (this.pureWeekY === '') {
        return ''
      } else if (this.pureWeekY / 4 >= 1) {
        return `${Math.floor(this.pureWeekY / 4)}个月${
          this.pureWeekY % 4 ? (this.pureWeekY % 4) + '周' : ''
        }`
      } else {
        return (this.pureWeekY % 4) + '周'
      }
    },
    pureWeekSto() {
      // 剩余上课时间
      if (this.pureWeekS / 4 >= 1) {
        return `${Math.floor(this.pureWeekS / 4)}个月${
          this.pureWeekS % 4 ? (this.pureWeekS % 4) + '周' : ''
        }`
      } else {
        return (this.pureWeekS % 4) + '周'
      }
    }
  },
  methods: {
    // 后退
    back() {
      this.$router.push('/approvalCenter')
    },
    // 选择手机号后获取uid和手机号
    getUid({ uid }) {
      console.info(uid)
      if (uid) {
        this.refundForm.name = uid
        this.refundForm.cellPhone = this.$refs.toGetPhone.input
        this.$http.RefundApproval.getOrdersByUid(uid) // 用uid获取订单
          .then(({ code, payload }) => {
            if (!code && payload.length) {
              this.refundForm.order = ''
              this.orderOptions = []
              this.orderOptions = payload.map((item) => {
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
      } else {
        // this.$message({
        //   message: 'searchPhone组件没有得到uid',
        //   type: 'warning'
        // })
      }
    },
    // 提交表单
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params1 = {
            refundRule:
              this.refundForm.isRules === '符合'
                ? 0
                : this.refundForm.isRules === '不符合'
                ? 1
                : null, // 符合规则
            channelOuterName: this.refundForm.orderSource, // 第三方导入订单来源
            channelId: this.refundForm.orderSourceId, // 第三方导入订单来源id
            isImport: this.isThird, // 1是0否
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
            residueFee: this.refundForm.residueFee, // 剩余金额
            refundType: this.refundForm.refundType, // 退款类型:课程退款-1，优惠券退款-0
            refundFee: this.refundForm.refundAmount, // 退款金额
            refundReason: this.refundForm.reason, // 退款原因
            refundMsg: this.refundForm.explain, // 退款说明
            couponType: this.refundForm.couponType, // 选择退哪种优惠券
            attsUrl: this.refundForm.imageUrl, // 附件地址

            periodAll: this.pureWeekS + this.pureWeekY, // 订单总周期“周”
            periodAlready: this.pureWeekY, // 已上课周期“周”
            // periodResidue: this.pureWeekS, // 剩余上课周期“周”
            periodRefund: this.refundForm.refundMonths * 4, // 选择退款周期“周”
            applyUserId: JSON.parse(localStorage.getItem('staff')).id,
            applyUserName: JSON.parse(localStorage.getItem('staff')).realName,
            applyUserDeapartmentId: JSON.parse(localStorage.getItem('staff'))
              .departmentId,
            applyUserDeapartmentName: JSON.parse(localStorage.getItem('staff'))
              .department
          }
          if (this.isThird) {
            this.$confirm(
              '此订单是第三方渠道导入订单,请顾问老师告知用户，去购买渠道进行退款操作。详情联系杨阳老师',
              '提示',
              {
                showCancelButton: false,
                type: 'warning'
              }
            ).then(() => {
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
            })
          } else {
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
          }
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
  color: red;
}

.search_phone100 {
  width: 50% !important;
  // 体外控制手机号组件样式(组件内100%w,根节点别写样式造成局限)
  // 只生效当前显示页面(组件),追加给子组件的全局或局部类名
}
.order100 {
  width: 50%;
}
.refundMonths100 {
  width: 50%;
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
<style lang="scss" scoped>
.adjustModule {
  background-color: #fff;
  margin: 10px;
  .title {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f0f1f2;
    i.back-icon {
      display: inline-block;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      border: 1px solid #ddd;
      margin: 0 20px;
      text-align: center;
      line-height: 19px;
      color: #ddd;
      vertical-align: middle;
      cursor: pointer;
    }
    .title-text {
      margin-left: 10px;
    }
  }
  .adjust-form {
    padding: 0 50px;
    margin-top: 30px;
    /deep/ .el-form-item__content {
      margin-left: 200px !important;
    }
    .search-phone-class {
      width: 200px;
      /deep/ .el-input--mini {
        .el-input__inner {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .supp-text {
      margin-left: 15px;
      color: red;
      font-size: 12px;
    }
    .input-loading {
      margin-left: 10px;
      font-size: 18px;
      color: #aaa;
    }
  }
}
</style>
