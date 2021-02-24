<!--
 * @Descripttion: 
 * @version: 
 * @Author: Shasen
 * @Date: 2020-07-28 13:50:45
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-21 16:47:59
 -->
<template>
  <div class="container-content">
    <div class="title">
      <i class="el-icon-arrow-left back-icon" @click="back"></i>
      <span class="title-text">新建赠品审批</span>
    </div>
    <div class="content">
      <el-form
        label-position="right"
        label-width="120px"
        :model="formGift"
        ref="ruleForm"
        :rules="rules"
      >
        <el-form-item label="选择用户" prop="cellPhone">
          <SearchPhone
            @result="getSearchPhone"
            name="uid"
            size="medium"
            :class="$style.searchphonerepair"
            ref="toGetPhone"
            :lswitch="paramOrderId ? true : false"
          />
        </el-form-item>

        <el-form-item label="关联订单" prop="showMessage">
          <el-select
            v-model="formGift.showMessage"
            placeholder="请选择订单号"
            :class="$style.chooseinput"
            value-key="id"
            @change="getSeletInput"
            :disabled="orderDisable"
          >
            <el-option
              v-for="item in orderList"
              :key="item.id"
              :label="item.showMessage"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择活动" prop="promotionsId">
          <el-select
            v-model="formGift.promotionsId"
            :class="$style.chooseinput"
            :reserve-keyword="true"
            size="medium"
            clearable
            @change="getActivityId"
            placeholder="活动名称"
          >
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.promotionsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择赠品" prop="giftsId">
          <el-radio-group v-model="formGift.giftsId" style="width:50%">
            <el-radio
              v-for="item in gifts"
              :key="item.id"
              :label="item.id"
              @change="getChooseGift"
              >{{ item.giftsName }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流信息">
          <el-table
            :data="products"
            style="width: 50%"
            v-show="products.length"
          >
            <el-table-column prop="name" label="赠品名称"> </el-table-column>
            <el-table-column prop="price" label="赠品价格"
              ><template slot-scope="scope"
                >¥{{ scope.row.price }}</template
              ></el-table-column
            >
            <el-table-column prop="address" label="物流单数量">
              <template slot-scope="scope">{{
                scope.row.type === 'ACTUAL_GOODS' ? '1' : '0'
              }}</template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="address">
          <el-form-item label="收货人" disabled prop="receiptName">
            <el-input disabled v-model="formGift.receiptName"></el-input>
            <div class="repair-address" @click="repairAddress" v-if="userId">
              <span>
                修改收货信息
              </span>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          label="收货人电话"
          prop="receiptTel"
          class="address-recept"
        >
          <el-input disabled v-model="formGift.receiptTel"></el-input>
        </el-form-item>
        <el-form-item
          v-model="formGift.totalAddress"
          label="收货人地址"
          prop="totalAddress"
          class="address-recept"
        >
          <el-input
            type="textarea"
            resize="none"
            disabled
            v-model="formGift.totalAddress"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="promotionsMsg">
          <el-input
            type="textarea"
            resize="none"
            class="repair-resolve"
            v-model="formGift.promotionsMsg"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item class="box-padding">
          <el-button
            type="primary"
            :disabled="sendDisabled"
            @click="confirmButton('ruleForm')"
            >提交</el-button
          >
          <el-button @click="cancelButton">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="修改收货地址"
      :visible.sync="addresDialog"
      :destroy-on-close="true"
      width="40%"
    >
      <logisticsForm
        @addExpress="getCreateAddress"
        @cancel="cancelAddress"
        :userId="userId"
      />
    </el-dialog>
  </div>
</template>

<script>
import LogisticsForm from './logisticsForm'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'

export default {
  components: {
    LogisticsForm,
    SearchPhone
  },

  async mounted() {},
  created() {
    // 订单管理 -- 赠品操作
    this.paramOrderId = this.getUrlKey('id')
    const mobile = this.getUrlKey('mobile') || ''
    console.log(this.paramOrderId, mobile)
    if (mobile) {
      this.$http.RefundApproval.getUid_lk({ mobile }).then((res) => {
        const uid = res.data.blurrySearch[0].id
        if (uid) {
          this.getSearchPhone({ uid })
        }
      })
    }
    this.$nextTick(() => {
      this.$refs.toGetPhone.input = mobile
    })
    if (this.paramOrderId) {
      const obj = {
        id: this.paramOrderId
      }
      this.$http.Order.getThisOrder(obj).then((res) => {
        const data = res.data.Order || {}
        this.formGift.outTradeNo = data.out_trade_no
      })
    }
    setTimeout(() => {
      this.orderDisable = true
    }, 2000)
    const staff = JSON.parse(localStorage.getItem('staff') || '{}')
    this.formGift.applyUserId = staff.id
    this.formGift.applyUserName = staff.realName
    this.formGift.applyUserDeapartmentId = staff.departmentId
    this.formGift.applyUserDeapartmentName = staff.department
    console.log(staff.department, 'staff.department===')
  },
  data() {
    const validateName = (rule, value, callback) => {
      console.info(this.$refs.toGetPhone.input, '++++', this.userId)
      setTimeout(() => {
        console.info(this.$refs.toGetPhone.input, '---', this.userId)
        if (this.userId && this.$refs.toGetPhone.input) {
          callback()
        } else {
          callback(new Error('此手机号未能获取uid'))
        }
      }, 4000)
    }
    return {
      paramOrderId: '',
      activityList: [], // 所有有效活动
      gifts: [], // 赠品
      products: [], // 物流信息
      userId: '', // 用户uid
      orderList: [], // 订单list
      addresDialog: false, // 发货地址dialog
      orderDisable: true,
      sendDisabled: false,
      orderRefundStatus: false, // 退费类型
      formGift: {
        orderId: '',
        outTradeNo: '',
        addressId: '',
        promotionsId: '',
        promotionsName: '', // 活动名称
        cellPhone: '', ///
        showMessage: '', ///
        giftsId: '', // 选择赠品
        giftsName: '',
        expressCount: '',
        stage: '',
        courseType: '',
        receiptName: '',
        receiptTel: '',
        totalAddress: '', ///
        receiptAddressProvince: '',
        receiptAddressCity: '',
        receiptAddressArea: '',
        receiptAddressStreet: '',
        receiptAddressDetail: '',
        applyUserId: '',
        applyUserName: '',
        applyUserDeapartmentId: '',
        applyUserDeapartmentName: '',
        promotionsMsg: ''
      },
      rules: {
        cellPhone: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        showMessage: [
          { required: true, message: '请选择关联订单', trigger: 'change' }
        ],
        promotionsId: [
          { required: true, message: '请选择活动', trigger: 'change' }
        ],

        giftsId: [{ required: true, message: '请选择赠品', trigger: 'change' }],
        receiptName: [
          { required: true, message: '请选择关联收货人姓名', trigger: 'change' }
        ],
        receiptTel: [
          { required: true, message: '请选择关联收货人电话', trigger: 'change' }
        ],
        totalAddress: [
          { required: true, message: '请选择关联收货人地址', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    // 选择活动
    getActivityId(val) {
      console.log(val, '选择活动')
      this.products = []
      this.activityList.forEach((item) => {
        if (val === item.id) {
          this.gifts = item.gifts
          this.formGift.promotionsName = item.promotionsName
          console.log(item.promotionsName, this.formGift.promotionsId)
        }
      })
    },
    // 选取赠品
    getChooseGift(val) {
      console.log(val, '选择赠品')
      this.gifts.forEach((item) => {
        if (val === item.id) {
          this.products = item.products
          this.formGift.giftsName = item.giftsName
          this.formGift.expressCount = item.expressCount
          console.log(this.formGift.giftsId, this.formGift.giftsName)
        }
      })
    },
    // 根据用户电话获取uid 获取关联订单
    getSearchPhone(val) {
      console.log(val, '获取uid')
      this.formGift.showMessage = ''
      this.formGift.receiptName = ''
      this.formGift.receiptTel = ''
      this.formGift.totalAddress = ''
      this.orderList = []
      if (val && val !== '') {
        this.userId = val.uid
        this.$http.Order.getOrdersByUid(this.userId)
          .then((res) => {
            if (res.payload && res.payload.content.length) {
              console.log(res, 'new-getOrderByRegtypesAndStatus')
              if (this.paramOrderId) {
                this.orderDisable = true
              } else {
                this.orderDisable = false
              }

              res.payload.content.forEach((item) => {
                // 筛选年系统课
                // if (item.courseCategory === 2) {
                if (item.packagesCourseWeek >= 24) {
                  item.showMessage = item.outTradeNo + ` ${item.packagesName}`
                  this.orderList.push(item)
                }
              })
              if (this.paramOrderId) {
                this.orderList.forEach((item) => {
                  if (item.id === this.paramOrderId) {
                    this.formGift.showMessage = item
                    this.getSeletInput(this.formGift.showMessage)
                  }
                })
              }
            } else {
              this.$message({
                message: '该手机号未查询到订单',
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        // this.formGift = {}
        this.formGift.showMessage = ''
        this.formGift.receiptName = ''
        this.formGift.receiptTel = ''
        this.formGift.totalAddress = ''
        this.orderList = []
        this.orderDisable = true
      }
    },
    // 改变关联订单
    getSeletInput(val) {
      console.log(val, '关联订单')
      this.formGift.receiptName = ''
      this.formGift.receiptTel = ''
      this.formGift.totalAddress = ''

      this.formGift.orderId = val.id
      this.formGift.outTradeNo = val.outTradeNo
      this.formGift.stage = val.stage
      if (val.regtype === 'FIRST_ORDER' || val.regtype === 'RENEW') {
        this.formGift.courseType = 1
      } else {
        this.formGift.courseType = 0
      }
      this.formGift.addressId = val.addressId

      // this.$http.Express.getExpressByOrderId(val.id).then((res) => {
      //   if (res && res.payload) {
      //     this.formGift.receiptName = res.payload.receiptName
      //     this.formGift.receiptTel = res.payload.receiptTel
      //     this.formGift.receiptAddressProvince = res.payload.province
      //     this.formGift.receiptAddressCity = res.payload.city
      //     this.formGift.receiptAddressArea = res.payload.area
      //     this.formGift.receiptAddressStreet = res.payload.street
      //     this.formGift.receiptAddressDetail = res.payload.addressDetail
      //     this.formGift.totalAddress = `${res.payload.province}${res.payload.city}${res.payload.area}${res.payload.addressDetail}`
      //     console.log(res, 'res==')
      //   }
      // })
      this.$http.Express.getAddressById(val.addressId).then((res) => {
        if (res && res.payload) {
          this.formGift.receiptName = res.payload.receiptName
          this.formGift.receiptTel = res.payload.receiptTel
          this.formGift.receiptAddressProvince = res.payload.province
          this.formGift.receiptAddressCity = res.payload.city
          this.formGift.receiptAddressArea = res.payload.area
          this.formGift.receiptAddressStreet = res.payload.street
          this.formGift.receiptAddressDetail = res.payload.addressDetail
          this.formGift.totalAddress = `${res.payload.province}${res.payload.city}${res.payload.area}${res.payload.addressDetail}`
          console.log(res, 'res==')
        }
      })
      const pararm = {
        userId: val.uid,
        orderId: val.id
      }
      this.$http.Express.getRefundtypeById(pararm).then((res) => {
        if (res && res.payload.length) {
          const refundlist = res.payload
          refundlist.forEach((item) => {
            console.log(item, 'item==')
            if (item.status === 'PENDING' || item.status === 'COMPLETED') {
              this.orderRefundStatus = true
              return false
            } else {
              this.orderRefundStatus = false
            }
          })
        } else {
          this.orderRefundStatus = false
        }
      })
      // 获取活动列表
      if (this.formGift.orderId && this.userId) {
        this.getPromotionsList()
      }
    },
    // 修改收获地址
    repairAddress() {
      this.addresDialog = true
    },
    // 新地址
    getCreateAddress(val) {
      if (val) {
        this.addresDialog = false
        this.formGift.receiptName = val.receiptName
        this.formGift.receiptTel = val.receiptTel
        this.formGift.receiptAddressProvince = val.province
        this.formGift.receiptAddressCity = val.city
        this.formGift.receiptAddressStreet = ''
        this.formGift.receiptAddressArea = val.area
        this.formGift.receiptAddressDetail = val.addressDetail
        this.formGift.totalAddress = `${val.province}${val.city}${val.area}${val.addressDetail}`
      }
    },
    // 关闭地址
    cancelAddress(val) {
      this.addresDialog = false
    },
    // 提交
    confirmButton(formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendDisabled = true
          setTimeout(() => {
            this.sendDisabled = false
          }, 3000)
          const obj = {
            ...this.formGift,
            userId: this.userId,
            cellPhone: this.$refs.toGetPhone.input
          }
          console.log(this.formGift, 'formGift', obj)
          if (this.orderRefundStatus) {
            this.$message.error('此订单退费中/已退费，不符合赠品审评')
          } else {
            this.$http.Approval.applyGiftAdd(obj).then((res) => {
              if (res.code === 0) {
                this.$router.push({
                  path: '/approval',
                  params: {
                    activeApprove: 'second'
                  }
                })
                //
              }
              console.log(res)
            })
          }
          console.log('ooooo')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    cancelButton() {
      this.$router.push({
        path: `/approvalCenter`
      })
    },
    // 后退
    back() {
      this.$router.push('/approval')
    },
    // 根据手机号获取uid
    createFilter(phonenum) {
      this.$http.RefundApproval.getUid_lk({
        mobile: phonenum
      }).catch((err) => {
        console.error(err)
        this.$message.error('跳转来的手机号获取uid失败')
      })
    },
    // 获取所有有效活动
    getPromotionsList() {
      this.$http.Approval.getPromotionsList({
        userId: this.userId,
        orderId: this.formGift.orderId
      }).then(({ code, payload }) => {
        if (!code && payload && payload.length) {
          this.activityList = payload
        } else if (!code && payload && !payload.length) {
          this.activityList = []
          this.$message.error('该订单没有匹配的活动，无法申请赠品')
        }
        console.log(payload, '获取所有有效活动')
      })
    },
    // 获取参数
    getUrlKey(name) {
      return (
        decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
            location.href
          ) || [',', ''])[1].replace(/\+/g, '%20')
        ) || null
      )
    }
  }
}
</script>

<style lang="scss" scope>
.container-content {
  background-color: #fff;
  margin: 10px;
  height: calc(100vh - 70px);
  overflow: auto;
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
  .choose-product-gift {
    padding: 20px;
  }

  .content {
    padding: 10px 50px 0px;
  }

  .product-repair {
    .reapirProduct {
      &-detail {
        display: flex;
      }
      .content-gift {
        display: flex;
        align-items: center;
      }
      .changeGift {
        width: 400px;
      }
      .chooseProduct {
        padding: 0 8px;
        margin-left: 10px;
        border: 1px solid whitesmoke;
        cursor: pointer;
        color: #999;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: #fff;
      }
    }
  }

  .address {
    position: relative;
    width: 55%;
    .repair-address {
      position: absolute;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      right: -100px;
      bottom: 3px;
      color: #2a75ed;
    }
  }
  .address-recept {
    width: 55%;
  }
  .repair-resolve {
    width: 55%;
  }
  .box-padding {
    padding-bottom: 20px;
  }
}
</style>
<style lang="scss" scoped>
.el-textarea__inner {
  height: 80px;
}
</style>
<style lang="scss" module>
.searchphonerepair,
.chooseinput {
  width: 50% !important;
}
.avatar_uploader_icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.el-popper .el-cascader__dropdown {
  height: 800px;
  overflow: scroll;
}
.el-radio {
  margin-top: 5px;
}
</style>
