<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-28 13:50:45
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-09 16:12:34
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
        <el-form-item label="课程进度" class="address-recept">
          <el-input
            v-model="formRepair.currentLesson"
            :disabled="true"
            :key="now"
          >
          </el-input>
        </el-form-item>
        <div class="address">
          <el-form-item label="收货人" disabled prop="receiptName">
            <el-input disabled v-model="formRepair.receiptName"></el-input>
            <div class="repair-address" @click="repairAddress" v-if="userId">
              <span>
                修改收货地址
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
          label="收货人地址"
          prop="totalAddress"
          class="address-recept"
        >
          <el-input
            type="textarea"
            disabled
            v-model="formRepair.totalAddress"
          ></el-input>
        </el-form-item>
        <el-form-item label="补发类别" prop="type">
          <el-radio-group v-model="formRepair.type" @change="chooseType">
            <el-radio label="MATERIALS">盒子随材</el-radio>
            <el-radio label="STORE">商城礼品</el-radio>
            <el-radio label="RECOMMEND">推荐有礼</el-radio>
            <el-radio label="INVITATION">邀请有奖</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="formRepair.type == 'MATERIALS'"
          label="补发方式"
          prop="mode"
        >
          <el-radio-group v-model="formRepair.mode" @change="chooseMode">
            <el-radio label="DEFAULT">整盒补发</el-radio>
            <el-radio label="SINGLE">单件补发</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="补发商品"
          class="product-repair"
          prop="chooseProductVaidator"
        >
          <div class="reapirProduct">
            <!-- 课程-难度-级别 -->
            <div
              class="reapirProduct-detail"
              v-if="formRepair.type == 'MATERIALS'"
            >
              <package
                @result="getPackageId"
                :packageData="formRepair.packagesType"
              />
              <repair-sup
                @result="getSup"
                :is-trial="formRepair.packagesType === 'EXPERIENCE_COURSE'"
                :supData="formRepair.sup"
                :key="supKey"
              />
              <repair-level
                @result="getLevel"
                v-if="formRepair.packagesType == 'SYSTEM_COURSE'"
                :leveData="formRepair.level"
              />
            </div>
            <!-- 所选商品展示+更换入口 -->
            <div class="content-gift">
              <div class="changeGift" v-if="selectName.length > 0">
                <el-table :data="selectName">
                  <el-table-column label="商品id" prop="id" align="center">
                  </el-table-column>
                  <el-table-column label="商品名称" prop="name" align="center">
                  </el-table-column>
                  <el-table-column label="商品数量" prop="count" align="center">
                  </el-table-column>
                </el-table>
              </div>
              <div
                class="chooseProduct"
                @click="chooseProduct()"
                ref="ruleProduct"
              >
                <i class="el-icon-plus"></i>
                <span v-text="changeProductText"></span>
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
            <template v-show="formRepair.type === 'MATERIALS'">
              <el-radio
                v-show="formRepair.mode === 'DEFAULT'"
                label="MULTI_SELF_PAY"
              >
                自费补发
              </el-radio>
              <el-radio
                v-show="formRepair.mode === 'DEFAULT'"
                label="MULTI_LOSS"
              >
                丢件补发
              </el-radio>
              <el-radio
                v-show="formRepair.mode === 'DEFAULT'"
                label="MULTI_TIMEOUT_RETURN"
              >
                超时退回
              </el-radio>
              <el-radio
                v-show="formRepair.mode === 'DEFAULT'"
                label="MULTI_ADJUSTMENT_SUP"
              >
                调级补发
              </el-radio>
              <el-radio
                v-show="formRepair.mode === 'SINGLE'"
                label="SINGLE_QUALITY"
              >
                产品质量问题
              </el-radio>
              <el-radio
                v-show="formRepair.mode === 'SINGLE'"
                label="SINGLE_PIGMENT_LEAKAGE"
              >
                颜料撒漏
              </el-radio>
            </template>
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
            maxlength="150"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attsUrl">
          <el-upload
            action=""
            list-type="picture-card"
            multiple
            :limit="9"
            :file-list="fileListC"
            :on-exceed="onExceed"
            :http-request="uploadAll"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :on-success="onSuccess"
            :on-error="onError"
            :on-progress="onProgress"
            :on-change="onChange"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
          >
            <div slot="tip" class="el-upload__tip">
              提示信息内容告知
            </div>
            <i class="el-icon-plus"></i>
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
    <!-- 上传文件的预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
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
      width="40%"
      :modal="false"
      :destroy-on-close="true"
      class="choose-product-gift shangpin"
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
      
          <!-- v-if="formRepair.mode === 'SINGLE'" -->
        <el-table-column
          type="selection"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="name" label="商品名称" align="center">
        </el-table-column>
        <el-table-column
          v-if="formRepair.mode === 'SINGLE'"
          align="center"
          label="数量"
        >
          <template slot-scope="scope">
            <el-input-number
              :min="1"
              size="small"
              v-model="scope.row.count"
              :disabled="!scope.row.canOperating"
            ></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          v-if="formRepair.mode !== 'SINGLE'"
          label="单选"
        >
          <input name="Fruit" type="radio" />
        </el-table-column> -->
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
import UploadFile from '@/utils/uploadFiles' // 上传公共方法(单文件上传)
import { courseLevelReplace,SUP_LEVEL_ALL } from '@/utils/supList'


export default {
  components: {
    LogisticsForm,
    SearchPhone,
    RepairSup,
    RepairLevel,
    Package
  },
  // 学员详情跳转来审批query lk
  async mounted() {
    if (this.$route.query && this.$route.query.cellphone) {
      console.info('captured学员详情跳转而来')
      // 显示手机号
      this.$refs.toGetPhone.input = this.$route.query.cellphone
      // 手机号查uid
      const {
        data: { blurrySearch }
      } = await this.$http.RefundApproval.getUid_lk({
        mobile: this.$route.query.cellphone
      }).catch((err) => {
        console.error(err)
        this.$message.error('跳转来的手机号获取uid失败')
      })
      if (blurrySearch && blurrySearch[0] && blurrySearch[0].id) {
        this.formRepair.userId = blurrySearch[0].id // 保存uid
        this.getordersBylkuid() // uid获取订单list
      } else {
        this.$message.warning('跳转来的手机号没有uid')
      }
    }
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
        console.info('触发商品校验', this.selectName.length, this.selectName)
        if (this.selectName.length) {
          callback() // 自定义校验-以获取到保存到商品信息
        } else {
          callback(new Error('请完成商品信息的选择'))
        }
      }, 200)
    }
    return {
      // 根据订单物流获取随材版本
      proVersion:'',
      fileListC: [],
      dialogImageUrl: '', // 上传文件的预览url
      dialogVisible: false, // 上传文件的预览弹窗显隐开关
      orderDisable: true,
      applyDepartment: '', // 申请人部门
      applyName: '', // 申请人名字
      applyId: '', // 申请人id
      packageData: '',
      levelData: '',
      supData: '', // 组件的页面接受传过来的值
      orderList: [],
      value: '',
      supKey: '',
      formRepair: {
        totalAddress: '', // 补上
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
        productId: '', // 商品id 多个传0
        productNames: '', // 商品名称 多个,连接
        sup: '', // 难度		--非必传
        level: '',
        cellPhone: '', // 附加
        name: '',
        attsUrl: '',
        reason: '', // 后端补发货原因认这个=↓
        replenishReason: '', // 补发原因-radio
        reissueMsg: '', // 补发说明-textarea
        packagesType: '' // 体验课或者系统课首先默认选择
      },
      addresDialog: false,
      textarea: '',
      productDialog: false,
      chooseProductName: this.productDialog,
      userId: '',
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
          {
            required: true,
            message: '请选择关联收货人地址',
            trigger: 'change'
          }
        ],
        chooseProductVaidator: [
          {
            required: true,
            validator: validateProduct
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
          { min: 0, max: 150, message: '最大长度150个字符', trigger: 'blur' }
        ],
        attsUrl: [
          { required: true, message: '请选择上传的附件', trigger: 'change' }
        ]
      },
      now: new Date().getTime()
    }
  },

  methods: {
    singglefileListPromise() {
      console.info(this.fileListC)
      const promiseAll = this.fileListC.map((item) =>
        new UploadFile(item.raw).init()
      )
      console.info('返回promise结果数组', promiseAll)
      return promiseAll
    },
    uploadAll() {
      // 文件上传巴拉巴拉
      Promise.all(this.singglefileListPromise())
        .then((res) => {
          // 静态方法all 整体都是resolve返回时
          // this.fileListC = res
          console.info('整体成功', res)
          this.formRepair.attsUrl = res.map((item) => item.fileUrl).join()
        })
        .catch((err) => {
          console.log('Promise.all-err', err)
        })
    },
    // 超过个数限制
    onExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择9个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // 点击预览文件
    onPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 移除列表文件之前
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 移除文件
    onRemove(file, fileList) {
      console.info('你移除的文件是', file.name)
    },
    // 文件上传成功
    onSuccess(response, file, fileList) {
      console.info('文件上传成功', file.name)
    },
    // 文件上传失败
    onError(err2, file, fileList) {
      console.info('文件上传失败')
    },
    // 文件上传中
    onProgress(event, file, fileList) {
      console.info('文件正在上传中', file.name)
    },
    // 文件变化都捕获
    onChange(file, fileList) {
      this.fileListC = fileList
      console.info(
        '文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用'
      )
    },
    // 上传前-做文件校验
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
      // this.$message.error('上传前可以做校验哟')
    },

    // -----------------------------------上传分割线----------------------------------------------

    // 后退
    back() {
      this.$router.push('/approval')
    },
    getSeletOrder(val) {
      console.log(val, 'val')
    },
    cancelAddress(val) {
      this.addresDialog = false
      this.$message('您已取消修改地址')
    },
    // 清空数据
    clearData() {
      this.changeProductText = '选择商品'
      this.giftList = []
      this.selectName = []
      this.formRepair.packagesType = ''
      this.formRepair.sup = ''
      this.formRepair.level = ''
      this.formRepair.mode = ''
      this.$root.$emit('qingkong', '') // 清空子组件里的值
    },
    // 清空全部数据
    clearAllData() {
      this.fileListC = []
      this.formRepair = {
        totalAddress: '', // 补上
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
        productId: '', // 商品id 多个传0
        productNames: '', // 商品名称 多个,连接
        sup: '', // 难度		--非必传
        level: '',
        cellPhone: '', // 附加
        name: '',
        packagesType: '', // 体验课或者系统课首先默认选择
        reason: '',
        replenishReason: '',
        reissueMsg: '',
        attsUrl: ''
      }
      this.changeProductText = '选择商品'
      this.giftList = []
      this.selectName = []
    },
    // 保存商品
    saveGift() {
      if (this.selectName.length) {
        Object.assign(this.formRepair, {
          productdetails: this.selectName // 新启用
          // productId,productNames罢用
        })
        this.chooseCompleted = false
        this.changeProductText = '更换商品'
        this.productDialog = false
      } else {
        this.$message('请选择商品')
      }
    },
    // 多选选中商品类型
    handleSelectionChange(val) {
      // 多选框选中后,才能操作+-
      val.forEach((item) => {
        item.canOperating = true
      })
      this.selectName = val
      console.info('复选选入筐', this.selectName)
    },
    // 单选(只能靠这个事件模拟实现-用SINGLE排除对复选影响)
    handleCurrentChange(val) {
      if (this.formRepair.mode !== 'SINGLE') {
        this.selectName = [val]
        console.info('单选入筐', this.selectName)
      }
    },
    // getPackageId 获取子组件传来的系统课或者体验课
    getPackageId(val) {
      this.selectName = []
      this.formRepair.packagesType = val
      this.supKey = Date.now()
    },
    // getSup 获取子组件传来的系统课或者体验课难度
    getSup(val) {
      this.selectName = []
      if (val) {
        this.formRepair.sup = `${val}`
      }
    },
    // getLevel 获取子组件传来的系统课级别
    getLevel(val) {
      this.selectName = []
      if (val) {
        this.formRepair.level = val.replace(/L/g, 'LEVEL')
      }
    },

    // 获取主题商品列表
    getProductTopticGiftList(id) {
      this.$http.Product.getTopicDetail(id).then((res) => {
        if (res && res.payload && res.payload.productList) {
          res.payload.productList.forEach((item) => {
            this.giftList.push({
              id: item.id,
              name: item.name,
              count: 1,
              canOperating: false
            })
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
    // 选择补发原因-为了给reason附上replenishReason补发原因
    choosereplenishReason(val) {
      Object.assign(this.formRepair, { reason: val })
    },
    // 创建地址传过来的信息
    getCreateAddress(val) {
      if (val) {
        this.addresDialog = false
        Object.assign(this.formRepair, {
          totalAddress: val.province + val.city + val.area + val.addressDetail,
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
    async getSeletInput(val) {
      if (val.id) {
        this.$http.Express.getExpressByOrderId(val.id).then((res) => {
          if (res && res.payload) {
            const medium = res.payload
            // 回显bug无法提交_丹阳&伟霞
            if (
              medium.addressId === '0' ||
              medium.expressStatus === 'INVALID' ||
              medium.expressStatus === 'DEFAULT'
            ) {
              this.$message.warning(
                '当前用户收货地址为空或被置为失效-请修改地址'
              )
            }
            // 回显bug无法提交_丹阳&伟霞
            this.levelData = medium.level
            Object.assign(this.formRepair, {
              proVersion:medium.productVersion,
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
      // 根据订单获取课程进度
      // 分体验课和系统课
      this.formRepair.currentLesson = ''
      console.log(val)
      if (val.regtype === 'EXPERIENCE') {
        const resTrialData = await this.getTrialClassProgress(val.id)
        if (resTrialData) {
          // console.log(resTrialData)
          this.formRepair.currentLesson = courseLevelReplace(
            resTrialData.currentLesson
          )
          // console.log(this.formRepair.currentLesson)
          this.now = new Date().getTime()
        }
      } else if (val.regtype === 'FIRST_ORDER' || val.regtype === 'RENEW') {
        const resSysData = await this.getSystemClassProgress(val.id)
        if (resSysData) {
          // console.log(resSysData)
          this.formRepair.currentLesson = `${SUP_LEVEL_ALL[resSysData.currentSuper]}${resSysData.currentLevel}${resSysData.currentUnit}${resSysData.currentLesson}`
          
          // console.log(this.formRepair.currentLesson)
          this.now = new Date().getTime()
        }
      }
    },
    getTrialClassProgress(orderNo) {
      return this.$http.Approval.findTrailByOrderNo(orderNo)
        .then((res) => {
          if (res.status !== 'OK') {
            return false
          }
          return res.payload
        })
        .catch(() => {
          return false
        })
    },
    getSystemClassProgress(orderNo) {
      return this.$http.Approval.findSystemByOrderNo(orderNo)
        .then((res) => {
          if (res.status !== 'OK') {
            return false
          }
          return res.payload
        })
        .catch(() => {
          return false
        })
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
        // 去获取订单
        this.getordersBylkuid()
      }
    },
    // 用uid获取订单列表
    getordersBylkuid() {
      this.userId = this.formRepair.userId
      this.$http.Order.getOrdersByUid(this.formRepair.userId)
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
    },

    // 再次--改变选择商品
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
                        name: res.payload.name,
                        count: 1,
                        canOperating: false
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
                        name: res.payload.name,
                        count: 1,
                        canOperating: false
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
                    this.giftList.push({
                      id: item.id,
                      name: item.name,
                      count: 1,
                      canOperating: false
                    })
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
      console.log(this.formRepair.attsUrl='sssssssssssssss')
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
                this.formRepair.type = 'EXPERIENCE_MATERIALS'
                break
              case 'SYSTEM_COURSE':
                this.formRepair.courseType = 2
                this.formRepair.type = 'SYSTEM_MATERIALS'
                break
              default:
                break
            }
          }
          if (this.formRepair.mode === '') {
            this.formRepair.packagesType = 0

            delete this.formRepair.mode
          }
          const loading = this.$loading({
            lock: true
          })
          this.$http.Backend.applyReplenish(this.formRepair).then((res) => {
            if (res) {
              this.clearData()
              this.$router.push({
                path: '/approval',
                params: {
                  activeApprove: 'second'
                }
              })
            }
            setTimeout(() => {
              loading.close()
            }, 1000)
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
  /deep/.shangpin .el-dialog {
    max-height: 600px;
    overflow-y: auto;
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
</style>
