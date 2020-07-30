<template>
  <div class="mergeboxes-page" v-loading="loading">
    <div class="title">
      <i class="el-icon-arrow-left back-icon" @click="back"></i>
      <span class="title-text">新建随材打包审批</span>
    </div>
    <el-form
      ref="mergeForm"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      class="merge-form"
    >
      <el-form-item label="选择用户 :" prop="userId">
        <search-phone
          class="search-phone-class"
          ref="searchPhone"
          v-model="formData.userId"
          @result="getSearchPhoneData"
          name="userId"
          @inputChange="resetPartOfFormData"
        />
      </el-form-item>
      <el-form-item label="关联订单 :" prop="orderId">
        <el-select
          v-model="formData.orderId"
          placeholder="请选择订单"
          :style="{ width: '450px' }"
          @change="selectChange"
          :loading="orderSelect.loading"
          value-key="orderId"
        >
          <el-option
            v-for="(option, index) in orderSelect.option"
            :key="index"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前物流信息 :" prop="expressInfo">
        <el-input
          v-model="formData.expressInfo"
          :disabled="true"
          :style="{ width: '450px' }"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择打包数量 :" prop="packageCount">
        <el-select
          v-model="formData.packageCount"
          :style="{ width: '200px' }"
          value-key="index"
        >
          <el-option
            v-for="i in packageCountList"
            :key="i"
            :label="i"
            :value="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品信息 :" v-if="showGoods">
        <el-table
          :data="goodsData"
          border
          style="width: 450px"
          header-cell-class-name="header-height"
        >
          <el-table-column prop="name" label="商品名称" width="270">
          </el-table-column>
          <el-table-column prop="proVersion" label="版本" width="50">
          </el-table-column>
          <el-table-column
            prop="centerProductCode"
            label="商品编码"
            width="129"
          ></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="申请理由 :" prop="reason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6 }"
          v-model="formData.reason"
          maxlength="200"
          :style="{ width: '450px' }"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('mergeForm')">
          提交
        </el-button>
        <el-button @click="resetForm('mergeForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
export default {
  name: 'mergeboxes',
  components: {
    SearchPhone
  },
  data() {
    return {
      loading: false,
      formData: {
        userId: '', // 用户id
        orderId: '',
        expressInfo: '',
        packageCount: '',
        reason: ''
      },
      // 校验
      formRules: {
        userId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              this.validatePhone(rule, value, callback)
            },
            trigger: ['change', 'blur']
          }
        ],
        orderId: [
          { required: true, message: '请选择关联订单', trigger: 'change' }
        ],
        expressInfo: [{ required: true, message: ' ', trigger: 'change' }],
        packageCount: [
          { required: true, message: '请选择打包数量', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请选择申请理由', trigger: 'change' }
        ]
      },
      // 选择订单
      orderSelect: {
        loading: false,
        option: [
          {
            value: '0',
            label: '请先选择用户',
            disabled: true
          }
        ]
      },
      // 选择打包数量
      packageCountList: 0,
      // 商品信息
      showGoods: false,
      goodsData: []
    }
  },
  methods: {
    // 后退
    back() {
      this.$router.push('/approvalCenter')
    },
    // 下拉手机号的校验
    validatePhone(rule, value, callback) {
      const phoneNum = this.$refs.searchPhone.input
      if (!phoneNum) {
        this.formData.userId = ''
        return callback(new Error('手机号不能为空'))
      }
      if (!/^1[3456789]\d{9}$/.test(phoneNum)) {
        this.formData.userId = ''
        return callback(new Error('请输入正确的手机号'))
      }
      // 手机号输入正确后需要获取到userId，获取userId的是个异步方法getSearchPhoneData(data)，需要从公共组件传值，没法儿用promise，
      // 一时没想到啥好办法- -
      const validateInterval = setInterval(() => {
        if (this.formData.userId) {
          callback()
          clearInterval(validateInterval)
        } else {
          callback(new Error('请选择手机号'))
        }
      }, 200)
    },
    // searchPhone的返回值
    getSearchPhoneData(val) {
      this.formData.userId = val.userId
      this.formData.userId && this.renderOrderList()
    },
    // 手机号修改后重置数据
    resetPartOfFormData() {
      Object.keys(this.formData).forEach((item) => {
        this.formData[item] =
          item === 'userId' || item === 'mergeReason' ? this.formData[item] : ''
      })
      // 还原下拉列表
      this.orderSelect = {
        loading: false,
        option: [
          {
            value: '0',
            label: '请先选择用户',
            disabled: true
          }
        ]
      }
      this.packageCountList = 0
      // 隐藏商品信息
      this.showGoods = false
    },
    async renderOrderList() {
      // 14414459891
      this.orderSelect.loading = true
      const orderData = await this.getOrderList()
      this.orderSelect.loading = false
      if (orderData === 'error') {
        return
      }
      let check = false
      this.orderSelect.option = []
      orderData.forEach((orderItem) => {
        // 只要系统课的
        if (
          (orderItem.regtype === 'RENEW' && orderItem.status === 'COMPLETED') ||
          (orderItem.regtype === 'FIRST_ORDER' &&
            orderItem.status === 'COMPLETED')
        ) {
          this.orderSelect.option.push({
            // 依照补发货取的字段
            label: orderItem.outTradeNo + orderItem.packagesName,
            value: {
              orderId: orderItem.id,
              outTradeNo: orderItem.outTradeNo,
              packagesType: orderItem.packagesType
            }
          })
          // 有系统课订单则置为true
          check = true
        }
      })
      if (!check) {
        this.orderSelect.option.push({
          label: '该用户下没有系统订单',
          value: 0,
          disabled: true
        })
        this.$message({
          message: '该用户下没有系统订单',
          type: 'warning'
        })
      }
    },
    // 获取订单列表数据
    getOrderList() {
      return this.$http.Order.getOrdersByUid(this.formData.userId)
        .then((res) => {
          if (res.payload && res.payload.content.length) {
            return res.payload.content
          } else {
            this.$message({
              message: '该手机号未查询到订单',
              type: 'warning'
            })
            return 'error'
          }
        })
        .catch(() => {
          this.$message({
            message: '获取订单列表请求出错请稍后再试～',
            type: 'warning'
          })
          return 'error'
        })
    },
    // 选择订单
    async selectChange(val) {
      // 根据订单获取当前物流信息
      const expressData = await this.getExpressByOrderId(val)
      // 根据物流返回的s和l获取商品信息列表
      if (!expressData) return
      await this.getGoodsData(expressData, val)
      // 然后判断打包数量
      this.handlePackageCount(expressData, val)
    },
    getExpressByOrderId(val) {
      return this.$http.Approval.getExpressByOrderId(val)
        .then((res) => {
          if (res.payload && res.payload.productName) {
            this.formData.expressInfo = res.payload.productName
            return res.payload
          } else {
            this.$message({
              message: '该订单没有物流信息..',
              type: 'warning'
            })
          }
        })
        .catch(() => {
          this.$message({
            message: '获取物流信息失败',
            type: 'warning'
          })
        })
    },
    getGoodsData(expressData, val) {
      // 物流传过来的信息是L1，接口需要的是LEVEL1
      const level = expressData.level.replace(/[^0-9]/gi, '')
      const query = {
        sup: expressData.sup,
        level: `LEVEL${level}`
      }
      return this.$http.Approval.getCourseMaterialsMoreThanLevel(query)
        .then((res) => {
          if (res.payload && res.payload.length) {
            this.goodsData = res.payload
            this.showGoods = true
            console.log(this.goodsData)
          }
        })
        .catch(() => {
          this.$message({
            message: '获取商品信息失败',
            type: 'warning'
          })
        })
    },
    handlePackageCount(expressData, val) {
      const curLevel = expressData.level.replace(/[^0-9]/gi, '')
      const packagesType = val.packagesType
      let baseCount = 0
      // 先判断是半年课还是全年课
      if (
        packagesType === 'SYSTEM_COURSE_HALFYEAR' ||
        packagesType === 'SYSTEM_COURSE_HALFYEAR_TWO'
      ) {
        baseCount = 6
      } else if (packagesType === 'SYSTEM_COURSE_YEAR') {
        baseCount = 12
      }
      if (baseCount - curLevel > this.goodsData.length) {
        // 没那么多货，比如说课时到6月，但货只有5月的
        this.packageCountList = this.goodsData.length
      } else {
        this.packageCountList = baseCount - baseCount
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.formData.reason.trim()) {
            this.$message.error('申请理由不能为只输入空格～')
            return
          }
          const query = this.prepareData()
          this.packageboxFlow(query)
        } else {
          return false
        }
      })
    },
    prepareData() {
      const userinfo = JSON.parse(localStorage.getItem('staff'))
      const packageBoxs = []
      this.goodsData.forEach((item) => {
        packageBoxs.push({
          id: item.id,
          name: item.name,
          centerProductCode: item.centerProductCode,
          proVersion: item.proVersion,
          sup: item.courseDifficulty,
          level: item.courseLevel
        })
      })
      return {
        applyDepartment: userinfo.department,
        applyId: userinfo.id,
        applyName: userinfo.realName || userinfo.name,
        orderId: this.formData.orderId.orderId,
        outTradeNo: this.formData.orderId.outTradeNo,
        currentExpress: this.formData.expressInfo,
        userId: this.formData.userId,
        packageCount: this.formData.packageCount,
        packageBoxProductSimpleList: packageBoxs
      }
    },
    packageboxFlow(query) {
      this.loading = true
      this.$http.Approval.packageboxFlow(query)
        .then((res) => {
          this.loading = false
          if (res.code === 0 && res.status === 'OK') {
            this.$router.push({
              name: 'approvalCenter',
              params: { activeApprove: 'second' }
            })
          } else {
            this.$message({
              message: '提交失败',
              type: 'warning'
            })
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({
            message: '提交失败',
            type: 'warning'
          })
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      // 手动清空手机号
      this.$refs.searchPhone.input = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.mergeboxes-page {
  margin: 10px;
  min-height: calc(100vh - 70px);
  background-color: #fff;
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
  .merge-form {
    padding: 0 50px 30px;
    margin-top: 30px;
    /deep/ {
      .el-form-item__content {
        margin-left: 200px !important;
      }
      .header-height {
        padding: 0px;
      }
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
  }
}
</style>
