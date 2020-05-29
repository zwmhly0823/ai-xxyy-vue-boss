<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-28 13:50:45
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-29 21:38:36
 -->
<template>
  <div class="container-content">
    <div class="title">
      <i class="el-icon-arrow-left back-icon" @click="back"></i>
      <span class="title-text">新建补发货审批</span>
    </div>
    <div class="content">
      <el-form
        label-position="right"
        :rules="rules"
        label-width="120px"
        :model="formRepair"
        ref="ruleForm"
      >
        <el-form-item
          label="选择用户"
          v-model="formRepair.cellPhone"
          prop="cellPhone"
        >
          <SearchPhone
            @result="getSearchPhone"
            name="uid"
            size="medium"
            :class="$style.searchphonerepair"
            ref="toGetPhone"
          />
        </el-form-item>

        <el-form-item label="关联订单" prop="showMessage">
          <el-select
            v-model="formRepair.showMessage"
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
        <div class="address">
          <el-form-item label="收货人" disabled prop="receiptName">
            <el-input disabled v-model="formRepair.receiptName"></el-input>
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
          <el-input disabled v-model="formRepair.receiptTel"></el-input>
        </el-form-item>
        <el-form-item
          v-model="formRepair.totalAddress"
          label="收货人地址"
          prop="totalAddress"
          class="address-recept"
        >
          <el-input
            type="textarea"
            resize="none"
            disabled
            v-model="formRepair.totalAddress"
          ></el-input>
        </el-form-item>
        <el-form-item v-model="formRepair.type" label="补发类别" prop="type">
          <el-radio-group v-model="formRepair.type" @change="chooseType">
            <el-radio label="MATERIALS">盒子随材</el-radio>
            <el-radio label="STORE">小熊商城</el-radio>
            <el-radio label="RECOMMEND">推荐有礼</el-radio>
            <el-radio label="INVITATION">邀请有奖</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formRepair.type == 'MATERIALS'"
          label="补发方式"
          prop="mode"
          v-model="formRepair.mode"
        >
          <el-radio-group v-model="formRepair.mode" @change="chooseMode">
            <el-radio label="DEFAULT">整盒补发</el-radio>
            <el-radio label="SINGLE">单件补发</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="补发商品"
          v-model="formRepair.chooseProductVaidator"
          class="product-repair"
          prop="chooseProductVaidator"
        >
          <div class="reapirProduct">
            <div
              class="reapirProduct-detail"
              v-if="formRepair.type == 'MATERIALS'"
            >
              <package
                @result="getPackageId"
                :packageData="formRepair.packagesType"
              />
              <repair-sup @result="getSup" :supData="formRepair.sup" />
              <repair-level
                @result="getLevel"
                v-if="formRepair.packagesType == 'SYSTEM_COURSE'"
                :leveData="formRepair.level"
              />
            </div>
            <div class="content-gift">
              <div class="changeGift" v-if="ensureGift.length > 0">
                <el-table :data="ensureGift" width="400" border>
                  <el-table-column align="center" width="400" label="商品名称">
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.name }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div
                class="chooseProduct"
                @click="chooseProduct()"
                ref="ruleProduct"
              >
                <i class="el-icon-plus"></i>
                <span v-text="changeProductText">
                  {{ changeProductText }}
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="补发原因" prop="replenishReason">
          <el-radio-group
            v-model="formRepair.replenishReason"
            @change="choosereplenishReason"
          >
            <el-radio label="DELIVERY_MISS">发货漏发</el-radio>
            <el-radio label="TRANSPORT_BAD">运输损坏</el-radio>
            <el-radio label="OTHER">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="补发货说明" prop="reissueMsg">
          <el-input
            type="textarea"
            resize="none"
            class="repair-resolve"
            v-model="formRepair.reissueMsg"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attsUrl">
          <el-upload
            action=""
            :http-request="upload"
            :class="$style.refundForm_attsUrl"
            :show-file-list="false"
          >
            <div v-if="imgShow && !videoShow">
              <el-image
                :src="formRepair.attsUrl"
                fit="contain"
                :class="$style.avatar"
              />
            </div>

            <div v-else-if="!imgShow && videoShow">
              <video
                style="width: 220px; height: 120px"
                :src="formRepair.attsUrl"
                controls
              ></video>
            </div>
            <i
              v-else
              class="el-icon-plus"
              :class="$style.avatar_uploader_icon"
            ></i>
          </el-upload>
        </el-form-item>
        <el-form-item class="box-padding">
          <el-button type="primary" @click="confirmButton('ruleForm')"
            >提交</el-button
          >
          <el-button @click="cancelButton">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="修改收货地址"
      :visible.sync="addresDialog"
      width="40%"
      :modal="false"
    >
      <logisticsForm
        @addExpress="getCreateAddress"
        @cancel="cancelAddress"
        :userId="userId"
      />
    </el-dialog>
    <el-dialog
      title="选择商品"
      :visible.sync="productDialog"
      width="30%"
      :modal="false"
      :destroy-on-close="true"
      class="choose-product-gift"
      v-if="productDialog"
    >
      <el-table
        :data="giftList"
        width="100%"
        border
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        align="center"
      >
        <el-table-column prop="name" label="商品名称" width="250">
        </el-table-column>
        <el-table-column
          type="selection"
          width="110"
          align="center"
          v-if="formRepair.mode === 'SINGLE'"
        >
        </el-table-column>
        <el-table-column
          align="center"
          v-if="formRepair.mode !== 'SINGLE'"
          label="选择"
        >
          <input name="Fruit" type="radio" value="" />
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveGift">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import LogisticsForm from './logisticsForm'
import RepairLevel from '@/components/MSearch/searchItems/repairLevel'
import RepairSup from '@/components/MSearch/searchItems/repairSup'
import Package from './package'
import { getStaffInfo } from '../common'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
import uploadFile from '@/utils/upload' // 上传公共方法

export default {
  components: {
    LogisticsForm,
    SearchPhone,
    RepairSup,
    RepairLevel,
    Package
  },
  created() {
    const staff = getStaffInfo()
    this.applyId = staff.staffId
    this.applyName = staff.staffName
    this.applyDepartment = '运营'
  },
  data() {
    var validateName = (rule, value, callback) => {
      setTimeout(() => {
        if (this.formRepair.cellPhone) {
          callback() // 自定义校验-以获取到uid为准
        } else {
          callback(new Error('此手机号未能获取uid'))
        }
      }, 200)
    }
    var validateProduct = (rule, value, callback) => {
      setTimeout(() => {
        if (this.formRepair.chooseProductVaidator) {
          callback() // 自定义校验-以获取到保存到商品信息
        } else {
          callback(new Error('请完成商品信息的选择'))
        }
      }, 200)
    }
    return {
      orderDisable: true,
      applyDepartment: '', // 申请人部门
      applyName: '', // 申请人名字
      applyId: '', // 申请人id
      packageData: '',
      levelData: '',
      supData: '', // 组件的页面接受传过来的值
      orderList: [],
      value: '',
      formRepair: {
        userId: '', // 用户id
        applyDepartment: '', // 申请人所在部门  --非必传
        applyName: '', // 申请人名称
        applyId: '', // 申请人id
        orderId: '', // 订单id
        packagesId: '', // （非随材商品为0）
        topicId: '', // （非随材商品为0）
        outTradeNo: '', // 订单号
        addressId: 0, // 地址ID非原物流地址为0）
        receiptName: '', // 收货人名称
        receiptTel: '', // 收货人电话
        receiptAddressProvince: '', // 收货人省
        receiptAddressCity: '', // 收货人市
        stage: '', // 期数
        productInfo: '', // 商品信息
        receiptAddressArea: '', // 收货人地区
        receiptAddressDetail: '', // 收货人详细地址
        type: '', // 类型 见下方注解
        mode: '', // 方式 见下方注解
        courseType: '', // 课程类型 1体验课 2系统课 --非必传
        reason: '', // 原因 见下方注解
        productId: '', // 商品id 多个传0
        productNames: '', // 商品名称 多个,连接
        sup: '', // 难度		--非必传
        level: '',
        cellPhone: '', // 附加
        name: '',
        attsUrl: '',
        reissueMsg: '',
        chooseProductVaidator: '', // 附加校验
        packagesType: '' // 体验课或者系统课首先默认选择
      },
      imgShow: false, // 附件图片显示
      videoShow: false, // 附件视频显示
      addresDialog: false,
      textarea: '',
      productDialog: false,
      chooseProductName: this.productDialog,
      userId: '',
      ensureGift: [], // 完成选择商品
      giftList: [],
      selectName: [],
      changeProductText: '选择商品',
      chooseCompleted: true, // 选择商品完成之后
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        showMessage: [
          { required: true, message: '请选择关联订单', trigger: 'change' }
        ],
        receiptName: [
          { required: true, message: '请选择关联收货人姓名', trigger: 'change' }
        ],
        receiptTel: [
          { required: true, message: '请选择关联收货人电话', trigger: 'change' }
        ],
        type: [
          {
            required: true,
            message: '请选择关联补发类别盒子',
            trigger: 'change'
          }
        ],
        mode: [
          { required: true, message: '请选择关联补发方式', trigger: 'change' }
        ],
        totalAddress: [
          { required: true, message: '请选择关联收货人地址', trigger: 'change' }
        ],
        chooseProductVaidator: [
          {
            required: true,
            validator: validateProduct,
            trigger: 'change'
          }
        ],
        replenishReason: [
          {
            required: true,
            message: '请选择关联补发商品原因',
            trigger: 'blur'
          }
        ],
        reissueMsg: [
          { required: true, message: '请填写原因', trigger: 'blur' },
          { min: 0, max: 50, message: '最大长度50个字符', trigger: 'blur' }
        ],
        attsUrl: [
          { required: true, message: '请选择上传的附件', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    // 后退
    back() {
      this.$router.push('/approvalCenter')
    },
    getSeletOrder(val) {
      console.log(val, 'val')
    },
    cancelAddress(val) {
      this.addresDialog = false
      this.$message('您已取消修改地址')
    },
    upload(file) {
      uploadFile(file).then((res) => {
        this.formRepair.attsUrl = res // 取来图片remote地址
        if (res) {
          if (
            res.includes('.mp4') ||
            res.includes('.mov') ||
            res.includes('.FLV') ||
            res.includes('.rmvb')
          ) {
            this.videoShow = true
            this.imgShow = false
          }
          if (
            res.includes('.png') ||
            res.includes('.jpg') ||
            res.includes('.jpeg')
          ) {
            this.videoShow = false
            this.imgShow = true
          }
        } else {
          this.videoShow = false
          this.imgShow = false
          this.$message('文件上传失败，请尝试换张图片或者重试')
        }
      })
    },
    // 清空数据
    clearData() {
      this.changeProductText = '选择商品'
      this.giftList = []
      this.ensureGift = []
      this.selectName = []
      this.formRepair.packagesType = ''
      this.formRepair.sup = ''
      this.formRepair.level = ''
      this.formRepair.mode = ''
      this.formRepair.chooseProductVaidator = ''
      this.$root.$emit('qingkong', '') // 清空子组件里的值
    },
    // 清空全部数据
    clearAllData() {
      this.formRepair = {
        userId: '', // 用户id
        applyDepartment: '', // 申请人所在部门  --非必传
        applyName: '', // 申请人名称
        applyId: '', // 申请人id
        orderId: '', // 订单id
        packagesId: '', // （非随材商品为0）
        topicId: '', // （非随材商品为0）
        outTradeNo: '', // 订单号
        addressId: 0, // 地址ID非原物流地址为0）
        receiptName: '', // 收货人名称
        receiptTel: '', // 收货人电话
        receiptAddressProvince: '', // 收货人省
        receiptAddressCity: '', // 收货人市
        stage: '', // 期数
        productInfo: '', // 商品信息
        receiptAddressArea: '', // 收货人地区
        receiptAddressDetail: '', // 收货人详细地址
        type: '', // 类型 见下方注解
        mode: '', // 方式 见下方注解
        courseType: '', // 课程类型 1体验课 2系统课 --非必传
        reason: '', // 原因 见下方注解
        productId: '', // 商品id 多个传0
        productNames: '', // 商品名称 多个,连接
        sup: '', // 难度		--非必传
        level: '',
        cellPhone: '', // 附加
        name: '',
        chooseProductVaidator: '', // 附加校验
        packagesType: '', // 体验课或者系统课首先默认选择
        replenishReason: '', // 附件图片显示
        attsUrl: '',
        reissueMsg: ''
      }
      this.imgShow = false
      this.videoShow = false
      this.changeProductText = '选择商品'
      this.giftList = []
      this.ensureGift = []
      this.selectName = []
    },
    // 保存商品
    saveGift() {
      this.ensureGift = []
      if (this.selectName.length) {
        // 校验
        this.ensureGift.push({
          name: this.selectName
            .map((item) => {
              return item.name
            })
            .join(),
          id:
            this.selectName.map((item) => {
              return item.id
            }) + ''
        })

        Object.assign(this.formRepair, {
          productNames: this.ensureGift[0].name,
          productId:
            this.ensureGift[0].id.split(',').length > 1
              ? 0
              : this.ensureGift[0].id
        })
        this.chooseCompleted = false
        this.formRepair.chooseProductVaidator = this.formRepair.productNames
        this.changeProductText = '更换商品'
        this.productDialog = false
      } else {
        this.$message('请选择商品')
      }
    },
    // 多选选中商品类型
    handleSelectionChange(val) {
      this.selectName = []
      val.forEach((item) => {
        this.selectName.push(item)
      })
    },
    // 单选
    handleCurrentChange(val) {
      this.selectName = []
      if (val) {
        this.selectName.push(val)
      }
    },
    // getPackageId 获取子组件传来的系统课或者体验课
    getPackageId(val) {
      if (val) {
        this.formRepair.packagesType = val
      }
    },
    // getLevel 获取子组件传来的系统课级别
    getLevel(val) {
      if (val) {
        this.formRepair.level = val.replace(/L/g, 'LEVEL')
      }
    },
    // getSup 获取子组件传来的系统课或者体验课难度
    getSup(val) {
      if (val) {
        this.formRepair.sup = `S${val}`
      }
    },
    // 获取主题商品列表
    getProductTopticGiftList(id) {
      this.$http.Product.getTopicDetail(id).then((res) => {
        if (res && res.payload && res.payload.productList) {
          res.payload.productList.forEach((item) => {
            this.giftList.push({ id: item.id, name: item.name })
          })
        }
      })
    },
    // 选择补发类别
    chooseType(val) {
      this.clearData()
      Object.assign(this.formRepair, { type: val })
      switch (val) {
        case 'STORE':
          this.getProductTopticGiftList(1)
          break
        case 'RECOMMEND':
          this.getProductTopticGiftList(2)
          break
        case 'INVITATION':
          this.getProductTopticGiftList(6)
          break
        default:
          break
      }
    },
    // 选择补发方式
    chooseMode(val) {
      this.clearData()
      this.formRepair.mode = val
    },
    // 选择补发原因
    choosereplenishReason(val) {
      Object.assign(this.formRepair, { reason: val })
    },
    // 创建地址传过来的信息
    getCreateAddress(val) {
      if (val) {
        this.addresDialog = false
        Object.assign(this.formRepair, {
          totalAddress:
            val.province + val.city + val.area + val.addressDetail || '',
          receiptAddressDetail: val.addressDetail,
          receiptAddressArea: val.area,
          receiptAddressCity: val.city,
          addressId: 0,
          receiptAddressProvince: val.province,
          receiptName: val.receiptName,
          receiptTel: val.receiptTel
        })
      }
    },
    // 通过订单id查询物流信息
    getSeletInput(val) {
      if (val.id) {
        this.$http.Express.getExpressByOrderId(val.id).then((res) => {
          if (res && res.payload) {
            const medium = res.payload
            this.levelData = medium.level
            Object.assign(this.formRepair, {
              totalAddress:
                medium.province +
                medium.city +
                medium.area +
                medium.addressDetail,
              receiptAddressDetail: medium.addressDetail,
              addressId: medium.addressId,
              receiptAddressArea: medium.area,
              receiptAddressCity: medium.city,
              receiptAddressProvince: medium.province,
              receiptName: medium.receiptName,
              receiptTel: medium.receiptTel,
              replenishReason: medium.replenishReason,
              reason: medium.replenishReason,
              userId: val.uid,
              stage: val.stage,
              mode: '',
              productInfo: val.packagesName,
              sup: val.sup,
              level: val.level,
              orderId: val.id,
              packagesType: val.packagesType,
              applyId: this.applyId,
              applyName: this.applyName,
              applyDepartment: this.applyDepartment,
              topicId: val.topicId,
              outTradeNo: val.outTradeNo,
              courseType: '', // 目前没法判断 先写死
              packagesId: val.packagesId,
              showMessage: val.showMessage
            })
          } else {
            Object.assign(this.formRepair, {
              userId: val.uid,
              stage: val.stage,
              productInfo: val.packagesName,
              sup: val.sup,
              level: val.level,
              orderId: val.id,
              packagesType: val.packagesType,
              applyId: this.applyId,
              applyName: this.applyName,
              applyDepartment: this.applyDepartment,
              topicId: val.topicId,
              outTradeNo: val.outTradeNo,
              courseType: '', // 目前没法判断 先写死
              packagesId: val.packagesId,
              showMessage: val.showMessage,
              mode: ''
            })
          }
        })
      }
    },
    // 搜索手机号 获取uid 查询订单信息
    getSearchPhone(val) {
      this.value = ''
      this.clearAllData()
      this.orderDisable = true
      this.changeProductText = '选择商品'
      this.formRepair.userId = val.uid
      this.formRepair.applyId = this.applyId
      this.formRepair.applyDepartment = this.applyDepartment
      this.formRepair.cellPhone = this.$refs.toGetPhone.input
      this.formRepair.applyName = this.applyName
      if (val.uid) {
        this.userId = val.uid
        this.$http.Order.getOrdersByUid(val.uid)
          .then((res) => {
            if (res.payload && res.payload.content.length) {
              this.orderDisable = false
              this.orderList = res.payload.content.map((item) => {
                item.showMessage = item.outTradeNo + ` ${item.packagesName}`
                return item
              })
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
      }
    },
    // 选择商品
    chooseProduct() {
      if (this.formRepair.type && this.formRepair.type !== 'MATERIALS') {
        this.productDialog = true
      }
      if (this.formRepair.type === 'MATERIALS') {
        switch (this.formRepair.mode) {
          case 'DEFAULT':
            switch (this.formRepair.packagesType) {
              case 'EXPERIENCE_COURSE':
                this.formRepair.level = 'LEVEL1'
                if (this.formRepair.sup) {
                  this.$http.Product.getCourseMaterials(this.formRepair).then(
                    (res) => {
                      this.productDialog = true
                      this.giftList = []
                      this.giftList.push({
                        id: res.payload.id,
                        name: res.payload.name
                      })
                    }
                  )
                } else {
                  this.$message('请填写完信息')
                }
                break
              case 'SYSTEM_COURSE':
                if (this.formRepair.sup && this.formRepair.level) {
                  this.$http.Product.getCourseMaterials(this.formRepair).then(
                    (res) => {
                      this.productDialog = true
                      this.giftList = []
                      this.giftList.push({
                        id: res.payload.id,
                        name: res.payload.name
                      })
                    }
                  )
                } else {
                  this.$message('请填写完信息')
                }
                break
              default:
                break
            }

            break
          case 'SINGLE':
            if (this.formRepair.packagesType === 'EXPERIENCE_COURSE') {
              this.formRepair.level = 'LEVEL1'
            }
            if (this.formRepair.sup && this.formRepair.packagesType) {
              this.$http.Product.getCourseMaterialsParts(this.formRepair).then(
                (res) => {
                  this.productDialog = true
                  this.giftList = []
                  res.payload.forEach((item) => {
                    this.giftList.push({ id: item.id, name: item.name })
                  })
                }
              )
            } else {
              this.$message('请填完信息')
            }

            break
          default:
            break
        }
      }
    },
    repairAddress() {
      this.addresDialog = true
    },
    cancelButton() {
      this.clearAllData()
    },
    confirmButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.formRepair.reissueMsg.trim()) {
            this.$message('申请理由不能为只输入空格～')
            return
          }
          if (this.formRepair.level) {
            this.formRepair.level = `L${this.formRepair.level.replace(
              /[^0-9]/gi,
              ''
            )}`
          }
          if (this.formRepair.packagesType) {
            switch (this.formRepair.packagesType) {
              case 'EXPERIENCE_COURSE':
                this.formRepair.courseType = 1
                break
              case 'SYSTEM_COURSE':
                this.formRepair.courseType = 2
                break
              default:
                break
            }
          }
          if (this.formRepair.mode === '') {
            this.formRepair.packagesType = 0

            delete this.formRepair.mode
          }
          this.$http.Backend.applyReplenish(this.formRepair).then((res) => {
            if (res) {
              this.clearData()
              this.$router.push({
                name: 'approvalCenter',
                params: {
                  activeApprove: 'second'
                }
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })

      this.addresDialog = false
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
      color: #409eff;
    }
  }
  .repair-resolve {
    width: 55%;
  }
  .address-recept {
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
.refundForm_attsUrl {
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 178px;
  overflow: hidden;
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
