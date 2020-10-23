<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-19 17:18:39
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-23 22:03:10
-->
<template>
  <section class="bianju10">
    <div class="bom10">
      <el-form :inline="true" size="mini">
        <el-form-item label="订单搜索:">
          <div class="concat">
            <el-select
              clearable
              v-model="num1"
              placeholder="请选择"
              @change="chooseOrder"
            >
              <el-option label="用户手机号" value="2"></el-option>
              <el-option label="订单号" value="0"></el-option>
              <el-option label="交易流水号" value="1"></el-option>
            </el-select>
            <el-input
              clearable
              v-model="num1_"
              placeholder="请键入编号"
              @change="intoNumber"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="业务类型:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="fordisplay1"
            @change="businessType"
          >
            <el-option label="体验课" value="1"></el-option>
            <el-option label="系统课" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="fordisplay2"
            @change="payMethod"
          >
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款状态:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="fordisplay3"
            @change="refundStatus"
          >
            <el-option label="退款驳回" value="7"></el-option>
            <el-option label="退款中" value="4"></el-option>
            <el-option label="退款成功" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="退款规则:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="fordisplay6"
            @change="refundRule"
          >
            <el-option label="不符合" value="1"></el-option>
            <el-option label="符合" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="退款类型:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="fordisplay5"
            @change="refundType"
          >
            <el-option
              v-for="(item, index) of [
                { label: '优惠券退款' },
                { label: '课程退款' },
                { label: '降为半年包' },
                { label: '补偿' }
              ]"
              :label="item.label"
              :value="index"
              :key="index"
            ></el-option>

            <!-- <el-option label="优惠券退款" value="0"></el-option>
            <el-option label="课程退款" value="1"></el-option>
            <el-option label="降为半年包" value="2"></el-option>
            <el-option label="补偿" value="3"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="申请人搜索:">
          <div class="concat">
            <applicant @result="applicantSearch" placeholder="申请人" />
          </div>
        </el-form-item>
        <el-form-item label="退款支付状态:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="payStatu"
            @change="refundPay"
          >
            <el-option label="未发起" value="0"></el-option>
            <el-option label="支付中" value="1"></el-option>
            <el-option label="成功" value="2"></el-option>
            <el-option label="失败" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间查询:">
          <div class="concat">
            <el-select
              clearable
              v-model="num2"
              placeholder="请键入"
              @change="whichTime"
            >
              <el-option label="订单支付时间" value="0"></el-option>
              <el-option label="申请退款时间" value="1"></el-option>
              <el-option label="完成退款时间" value="2"></el-option>
            </el-select>
            <el-date-picker
              value-format="timestamp"
              type="datetimerange"
              clearable
              @change="chooseTime"
              v-model="num2_"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="marginL20">
          <el-button type="primary" @click.stop="exportAll">导出</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-show="+roleId === 7"
          type="primary"
          @click.stop="BatchRefund"
          >批量发起退款支付</el-button
        >
      </div>
    </div>

    <el-divider></el-divider>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="用户信息" width="120" fixed="left">
          <template slot-scope="scope">
            <div class="usertext" @click="userHandle(scope.row)">
              {{ scope.row.userName ? scope.row.userName : '-' }}<br />{{
                scope.row.mobile
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单编号-订单交易流水号"
          width="220"
          fixed="left"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.outTradeNo &&
                  scope.row.outTradeNo.replace(/[a-z]*/g, '')
              }}<br />{{ scope.row.transactionId }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="uid" label="用户ID" align="center" width="180">
        </el-table-column> -->
        <el-table-column prop="regtypeStr" label="业务类型" align="center">
        </el-table-column>
        <el-table-column
          prop="applyName"
          label="申请人-部门"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.applyName }}</p>
            <p>{{ scope.row.applierDepartment }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="tradeTypeStr" label="支付方式" align="center">
        </el-table-column>
        <el-table-column
          prop="buytime"
          label="订单支付时间"
          align="center"
          width="155"
        >
        </el-table-column>
        <el-table-column prop="statusStr" label="退款状态" align="center">
        </el-table-column>
        <el-table-column
          prop="refundStatusStr"
          label="退款支付状态"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="refundTypeStr" label="退款类型" align="center">
        </el-table-column>

        <el-table-column prop="refundFee" label="退款金额" align="center">
        </el-table-column>
        <el-table-column prop="totoalFee" label="交易金额" align="center">
        </el-table-column>
        <el-table-column prop="refundRuleStr" label="退款规则" align="center">
        </el-table-column>
        <el-table-column label="订单支付时间" align="center" width="155">
          <template slot-scope="scope">
            {{ scope.row.buytime }}
          </template>
        </el-table-column>
        <el-table-column label="申请退款时间" align="center" width="155">
          <template slot-scope="scope">
            {{ scope.row.applyTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="refundTime"
          label="完成退款时间"
          align="center"
          width="155"
        >
          <template slot-scope="scope">
            {{ scope.row.refundTime || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginaWrap" :class="isOpen ? 'openya' : 'closeya'">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev,pager,next,total,sizes,jumper"
        :page-sizes="[5, 10, 20]"
        :current-page="currentPage"
        :total="allDigit"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>

    <el-drawer
      ref="drawerLk"
      :visible.sync="drawer"
      size="60%"
      :destroy-on-close="true"
    >
      <template v-slot:title>
        <h1 class="rawer-title">退费订单详情</h1>
      </template>
      <drawer
        @closeDrawer="closeDrawer"
        :orderData="choutidata"
        :approveData="approveData"
      />
    </el-drawer>
  </section>
</template>

<script>
import applicant from './applicant.vue'
import drawer from './components/drawer.vue'
import { openBrowserTab } from '@/utils/index'
export default {
  components: {
    applicant,
    drawer
  },
  created() {
    // init全量数据展示
    this.arrangeParams()
    console.log('test')
  },
  data() {
    return {
      roleId: JSON.parse(localStorage.getItem('staff')).roleId || '',
      selectData: [],
      searchJson: {
        regType: '', // 业务类型
        tradeType: '', // 支付方式
        status: '', // 退款状态
        refundRule: '', // 退款规则
        refundType: '', // 退款类型
        uid: '', // 用户id
        refundStatus: '', // 退款支付状态

        outTradeNo: '', // 订单号
        transactionId: '', // 订单交易流水号
        mobile: '', // 用户手机号
        sbuytime: '', // 订单支付-开始时
        ebuytime: '', // 订单支付-结束时间
        sctime: '', // 申请退款-开始时间
        ectime: '', // 申请退款-结束时间
        srefundTime: '', // 申请完成-开始时间
        erefundTime: '', // 申请完成-结束时间
        applyName: ''
      },
      // 被动关联事件_断值(用于赋值↑下半段)
      num1: '2',
      num1_: '',
      num2: '',
      num2_: '',

      // 对应↑上半段,相应事件里赋值成数字给接口用了,为了显示正常
      // 而不是显示数字,所以:searchJson.regType之类不能用
      fordisplay1: '',
      fordisplay2: '',
      fordisplay3: '', // 退款状态
      fordisplay5: '', // 退款类型
      fordisplay6: '', // 退款规则
      payStatu: '', // 退款支付状态
      // 分页
      currentPage: 0,
      pageSize: 0,
      allDigit: 0,

      // tableData
      tableData: [],
      approveData: [],
      // 抽屉
      drawer: false,
      choutidata: {},
      statusStr: '' // 该条订单退款状态 显示抽屉按钮用
    }
  },
  provide() {
    return { self: this }
  },
  methods: {
    // 用户跳转
    userHandle(user) {
      if (!user || !user.uid) {
        this.$message.error('缺少用户信息')
        return
      }
      const { uid } = user
      // 新标签打开详情页
      uid && openBrowserTab(`/users/#/details/${uid}`)
    },
    businessType(val) {
      console.info(val, typeof val)
      if (val === '1' || val === '2') {
        this.searchJson.regType = Number(val)
        this.arrangeParams()
      } else {
        this.searchJson.regType = ''
        this.arrangeParams()
      }
    },
    payMethod(val) {
      console.info(val, typeof val)
      if (val === '1' || val === '2') {
        this.searchJson.tradeType = Number(val)
        this.arrangeParams()
      } else {
        this.searchJson.tradeType = ''
        this.arrangeParams()
      }
    },
    refundStatus(val) {
      console.info(val, typeof val)
      if (val === '7' || val === '4' || val === '5') {
        this.searchJson.status = Number(val)
        this.arrangeParams()
      } else {
        this.searchJson.status = ''
        this.arrangeParams()
      }
    },
    refundRule(val) {
      console.info(val, typeof val)
      if (val === '1' || val === '0') {
        this.searchJson.refundRule = Number(val)
        this.arrangeParams()
      } else {
        this.searchJson.refundRule = ''
        this.arrangeParams()
      }
    },
    refundType(val) {
      console.info(val, typeof val)
      if (typeof val === 'number') {
        this.searchJson.refundType = val
        this.arrangeParams()
      } else {
        this.searchJson.refundType = ''
        this.arrangeParams()
      }
    },
    refundPay(val) {
      console.info(val, typeof val)
      if (val) {
        this.searchJson.refundStatus = +val
        this.arrangeParams()
      } else {
        this.searchJson.refundStatus = ''
        this.arrangeParams()
      }
    },

    // 申请人
    applicantSearch(val) {
      console.info(val, typeof val)
      this.searchJson.applyName = val
      this.arrangeParams()
    },
    // 2组关联
    chooseOrder(val) {
      console.info(val, typeof val)
      console.log(val, 'val====')
      if (val === '0') {
        // 订单号
        if (this.num1_) {
          this.searchJson.transactionId = ''
          this.searchJson.mobile = ''
          this.searchJson.outTradeNo = 'xiong' + this.num1_
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记键入编号,才能给你数据',
            type: 'warning'
          })
        }
      } else if (val === '1') {
        // 流水号
        if (this.num1_) {
          this.searchJson.outTradeNo = ''
          this.searchJson.mobile = ''
          this.searchJson.transactionId = this.num1_
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记键入编号,才能给你数据',
            type: 'warning'
          })
        }
      } else if (val === '2') {
        if (this.num1_) {
          this.searchJson.outTradeNo = ''
          this.searchJson.transactionId = ''
          this.searchJson.mobile = this.num1_
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记键入编号,才能给你数据',
            type: 'warning'
          })
        }
        // 用户手机号
      } else {
        this.searchJson.outTradeNo = ''
        this.searchJson.transactionId = ''
        this.searchJson.mobile = ''
        this.arrangeParams()
      }
    },
    intoNumber(val) {
      console.info(val, typeof val)
      console.log(this.num1)
      if (this.num1 === '0') {
        // 订单号
        if (val) {
          this.searchJson.transactionId = ''
          this.searchJson.mobile = ''
          this.searchJson.outTradeNo = 'xiong' + val
          this.arrangeParams()
        } else {
          this.searchJson.transactionId = ''
          this.searchJson.mobile = ''
          this.searchJson.outTradeNo = ''
          this.arrangeParams()
        }
      } else if (this.num1 === '1') {
        // 流水号
        this.searchJson.outTradeNo = ''
        this.searchJson.mobile = ''
        this.searchJson.transactionId = val
        this.arrangeParams()
      } else if (this.num1 === '2') {
        // 用户手机号
        this.searchJson.outTradeNo = ''
        this.searchJson.transactionId = ''
        this.searchJson.mobile = val
        this.arrangeParams()
      } else {
        this.searchJson.outTradeNo = ' '
        this.searchJson.transactionId = ' '
        this.searchJson.mobile = ' '
        this.$message({
          message: '请先选择订单搜索类型,我再给你数据',
          type: 'error'
        })
      }
    },
    whichTime(val) {
      console.info(val, typeof val)
      if (val === '0') {
        // 订单支付时间
        if (this.num2_.length) {
          this.searchJson.sbuytime = this.num2_[0] // 订单支付-开始时
          this.searchJson.ebuytime = this.num2_[1] // 订单支付-结束时间

          this.searchJson.sctime = '' // 申请退款-开始时间
          this.searchJson.ectime = '' // 申请退款-结束时间
          this.searchJson.srefundTime = '' // 申请完成-开始时间
          this.searchJson.erefundTime = '' // 申请完成-结束时间
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记选择时间,才能给你数据',
            type: 'warning'
          })
        }
      } else if (val === '1') {
        // 申请退款时间
        if (this.num2_.length) {
          this.searchJson.sctime = this.num2_[0] // 申请退款-开始时间
          this.searchJson.ectime = this.num2_[1] // 申请退款-结束时间

          this.searchJson.sbuytime = '' // 订单支付-开始时
          this.searchJson.ebuytime = '' // 订单支付-结束时间
          this.searchJson.srefundTime = '' // 申请完成-开始时间
          this.searchJson.erefundTime = '' // 申请完成-结束时间
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记选择时间,才能给你数据',
            type: 'warning'
          })
        }
      } else if (val === '2') {
        // 完成退款时间
        if (this.num2_.length) {
          this.searchJson.srefundTime = this.num2_[0] // 申请完成-开始时间
          this.searchJson.erefundTime = this.num2_[1] // 申请完成-结束时间

          this.searchJson.sbuytime = '' // 订单支付-开始时
          this.searchJson.ebuytime = '' // 订单支付-结束时间
          this.searchJson.sctime = '' // 申请退款-开始时间
          this.searchJson.ectime = '' // 申请退款-结束时间
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记选择时间,才能给你数据',
            type: 'warning'
          })
        }
      } else {
        this.searchJson.srefundTime = '' // 申请完成-开始时间
        this.searchJson.erefundTime = '' // 申请完成-结束时间
        this.searchJson.sbuytime = '' // 订单支付-开始时
        this.searchJson.ebuytime = '' // 订单支付-结束时间
        this.searchJson.sctime = '' // 申请退款-开始时间
        this.searchJson.ectime = '' // 申请退款-结束时间
        this.arrangeParams()
      }
    },
    chooseTime(val) {
      console.info(val, typeof val)
      if (this.num2 === '0') {
        // 订单支付时间
        this.searchJson.sbuytime = val[0] // 订单支付-开始时
        this.searchJson.ebuytime = val[1] // 订单支付-结束时间

        console.info(val)
        this.searchJson.sctime = '' // 申请退款-开始时间
        this.searchJson.ectime = '' // 申请退款-结束时间
        this.searchJson.srefundTime = '' // 申请完成-开始时间
        this.searchJson.erefundTime = '' // 申请完成-结束时间
        this.arrangeParams()
      } else if (this.num2 === '1') {
        // 申请退款时间
        this.searchJson.sctime = val[0] // 申请退款-开始时间
        this.searchJson.ectime = val[1] // 申请退款-结束时间

        this.searchJson.sbuytime = '' // 订单支付-开始时
        this.searchJson.ebuytime = '' // 订单支付-结束时间
        this.searchJson.srefundTime = '' // 申请完成-开始时间
        this.searchJson.erefundTime = '' // 申请完成-结束时间
        this.arrangeParams()
      } else if (this.num2 === '2') {
        // 完成退款时间
        this.searchJson.srefundTime = val[0] // 申请完成-开始时间
        this.searchJson.erefundTime = val[1] // 申请完成-结束时间

        this.searchJson.sbuytime = '' // 订单支付-开始时
        this.searchJson.ebuytime = '' // 订单支付-结束时间
        this.searchJson.sctime = '' // 申请退款-开始时间
        this.searchJson.ectime = '' // 申请退款-结束时间
        this.arrangeParams()
      } else {
        this.$message({
          message: '请先选择查询时间类型,我再给你数据',
          type: 'error'
        })
      }
    },
    // 过滤整合参数去拿数据
    async arrangeParams({ page = 1, size = 10 } = {}) {
      console.warn('开始整理查询参数:先合在剔')
      Object.assign(this.searchJson, { page, size }) // 放心page,size会覆盖原有
      const finalJson = {}
      for (const key in this.searchJson) {
        if (this.searchJson[key] !== '') {
          finalJson[key] = this.searchJson[key]
        } else {
          // console.info(`给青龙大哥剔牙--${key}-因为它是${this.searchJson[key]}`)
        }
      }
      console.warn('整理完毕,去找接口要数据', finalJson)
      const { content, totalElements } = await this.$http.Finance.getTable(
        finalJson
      ).catch((err) => {
        console.info('取数据接口报错,', err)
        this.$message({
          message: 'table数据接口失败',
          type: 'error'
        })
        return 1 // 停止↓赋值
      })
      this.pageSize = size // 就取本地设订的可以嘛？server也是听本地的传值(统一接口成功再变化分页信息)
      this.currentPage = page // 就取本地设订的可以嘛？server也是听本地的传值(统一接口成功再变化分页信息)
      this.allDigit = Number(totalElements)
      this.tableData = content
    },
    // 全量导出
    async exportAll() {
      const finalJson = {}
      for (const key in this.searchJson) {
        if (this.searchJson[key] !== '') {
          finalJson[key] = this.searchJson[key]
        } else {
          // console.info(`给青龙大哥剔牙--${key}-因为它是${this.searchJson[key]}`)
        }
      }
      // 再剔除页码与页容量
      delete finalJson.page
      delete finalJson.size
      console.warn('导出按钮-整理完毕,去找接口下载excel', finalJson)
      const r = await this.$http.Finance.exportExcel(finalJson).catch((err) => {
        console.info('取数据接口报错,', err)
        this.$message({
          message: '导出数据接口失败',
          type: 'error'
        })
      })
      // 下载去吧
      var blob = new Blob([r])
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = '用户数据.xls' // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.arrangeParams({ page: this.page, size: val })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.arrangeParams({ page: val, size: this.pageSize })
    },
    // 全选
    handleSelectionChange(e) {
      console.log(e)
      this.selectData = e
    },
    closeDrawer() {
      // 跳回列表并刷新
      this.$refs.drawerLk.closeDrawer() // 关闭抽屉
      this.arrangeParams() // 刷新列表数据
    },
    // 取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 批量退款
    BatchRefund() {
      if (this.selectData && this.selectData.length <= 0) {
        this.$message({
          message: '请选择订单',
          type: 'error'
        })
      }
      // const data =  this.selectData.filter((item)=>{
      //     [4,7,8,9].includes(item.status)&& [4,5].includes()
      //   })
      const payIds = []
      this.selectData.map((item, idx) => {
        if (
          [4, 7, 8, 9].includes(item.status) &&
          ![1, 2].includes(item.refundStatus)
        ) {
          payIds.push(item.id)
        }
      })
      if (payIds.length === 0) {
        return this.$message({
          message: '无可退款订单',
          type: 'error'
        })
      }
      this.$confirm(
        `您即将给退款订单【确认退款】确认退款订单数：${payIds.length}条`,
        '批量确认退款',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http.Finance.toAgreeAll({
            refundUid: JSON.parse(localStorage.getItem('staff')).id,
            paymentId: payIds
          }).catch((err) => {
            console.log(err)
          })
          this.arrangeParams() // 刷新列表数据
          this.$message({
            type: 'success',
            message: '退款发起成功!'
          })
          this.toggleSelection()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退款'
          })
          this.toggleSelection()
        })
    },
    // 操作

    async handleEdit() {
      console.info('index:', arguments[0])
      console.info('row:', arguments[1])
      this.approveData = await this.$http.Finance.getApprov({
        flowApprovalId: arguments[1].approvalId
      })
      console.log(this.approveData)
      const { code, payload } = await this.$http.Finance.getDetail({
        paymentId: arguments[1].id
      }).catch((err) => {
        console.info('抽屉接口数据boom', err)
        this.$message({
          message: '详情数据请求错误',
          type: 'error'
        })
      })
      this.statusStr = arguments[1].statusStr // 该条订单退款状态 显示抽屉按钮用
      if (code === 0) {
        this.whichListOrderId = payload.id // 退款流水id 给同意退款接口用 不用表现在view层即不用响应式
        Object.assign(this.choutidata, payload)
        this.drawer = true
      }
    }

    // async comfirmRefund() {
    //   const { code } = await this.$http.Finance.toAgree({
    //     refundUid: JSON.parse(localStorage.getItem('staff')).id,
    //     paymentId: this.whichListOrderId
    //     // 默认不传就是1 审核通过
    //   }).catch((err) => {
    //     console.error(err)
    //     this.$message({
    //       message: '通过操作失败,稍后再试',
    //       type: 'error'
    //     })
    //     return -1
    //   })
    //   if (code === 0) {
    //     this.$message({
    //       message: '操作成功',
    //       type: 'success'
    //     })
    //     // 跳回列表并刷新
    //     this.$refs.drawerLk.closeDrawer() // 关闭抽屉
    //     this.arrangeParams() // 刷新列表数据
    //   } else {
    //     this.$message({
    //       message: '通过操作失败,稍后再试',
    //       type: 'warning'
    //     })
    //   }
    // },
    // rejectRefund() {
    //   this.$prompt('请告知您的驳回理由', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /[\s\S]+/, // least 1
    //     inputErrorMessage: '不能为空！好歹敲个space'
    //   }).then(async ({ value }) => {
    //     const { code } = await this.$http.Finance.toAgree({
    //       refundUid: JSON.parse(localStorage.getItem('staff')).id,
    //       paymentId: this.whichListOrderId,
    //       auditType: 2,
    //       rejectReason: value
    //     }).catch((err) => {
    //       console.error(err)
    //       this.$message({
    //         message: '驳回操作失败,请稍后再试',
    //         type: 'error'
    //       })
    //       return -1
    //     })
    //     if (code === 0) {
    //       this.$message({
    //         message: '操作成功',
    //         type: 'success'
    //       })
    //       // 跳回列表并刷新
    //       this.$refs.drawerLk.closeDrawer() // 关闭抽屉
    //       this.arrangeParams() // 刷新列表数据
    //     } else {
    //       this.$message({
    //         message: '驳回操作失败,稍后再试',
    //         type: 'warning'
    //       })
    //     }
    //   })
    // }
  },
  computed: {
    isOpen() {
      return this.$store.getters.sidebar.opened
    }
  },
  mounted() {},
  render(h) {
    return h()
  },
  filters: {
    fnName: function(value) {
      return value
    }
  },
  // 验证watch可行性(优秀啊,集中处理;但还是选择事件处理)
  watch: {
    searchJson: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        // console.count('searchJson变动,触发watch')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bianju10 {
  padding: 10px 10px 40px 10px;
}
.bianju10 .el-divider--horizontal {
  margin: 0px;
}
.bianju10 .el-pagination {
  display: flex;
  justify-content: flex-end;
}
.bom10 {
  background: #fff;
  padding: 20px;
}
.bom10 .el-form-item {
  vertical-align: middle;
}
.concat {
  display: flex;
}
.marginL20 {
  margin-left: 20px;
}
.paginaWrap {
  position: fixed;
  right: 10px;
  bottom: 0;
  background-color: #fff;
  height: 36px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.openya {
  width: calc(100% - 174px - 20px);
}
.closeya {
  width: calc(100% - 54px - 20px);
}
.chouti {
  font-size: 16px;
  padding: 0px 20px;
  max-height: 75vh;
  overflow-x: auto;
}
.chouti .el-row {
  margin-bottom: 15px;
}
.chouti .el-col-4 {
  text-align: right;
}
.chouti .el-row:nth-last-of-type(1) {
  margin-bottom: 0px;
}
.buttonCenter {
  display: flex;
  justify-content: center;
}
.buttonBetween {
  display: flex;
  justify-content: space-around;
}
.usertext {
  color: #2a75ed;
  cursor: pointer;
}
.rawer-title {
  text-align: center;
  color: black;
}
</style>
