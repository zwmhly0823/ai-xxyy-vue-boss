<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-05-19 17:18:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-27 16:00:50
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
            <el-option label="退款中" value="4"></el-option>
            <el-option label="退款成功" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款类型:">
          <el-select
            clearable
            placeholder="请键入"
            v-model="fordisplay5"
            @change="refundType"
          >
            <el-option label="优惠券退款" value="0"></el-option>
            <el-option label="课程退款" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户搜索:">
          <div class="concat">
            <el-input
              clearable
              placeholder="请键入用户ID"
              v-model="fordisplay4"
              @change="customerSearch"
            ></el-input>
          </div>
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
    </div>
    <el-divider></el-divider>
    <div>
      <el-table :data="tableData" style="width: 100%" max-height="600">
        <el-table-column prop="outTradeNo" label="订单编号" align="center">
        </el-table-column>
        <el-table-column prop="uid" label="用户ID" align="center">
        </el-table-column>
        <el-table-column prop="regtypeStr" label="业务类型" align="center">
        </el-table-column>
        <el-table-column prop="tradeTypeStr" label="支付方式" align="center">
        </el-table-column>
        <el-table-column
          prop="transactionId"
          label="订单交易流水号"
          align="center"
          width="120"
        >
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
        <el-table-column prop="refundTypeStr" label="退款类型" align="center">
        </el-table-column>
        <el-table-column prop="refundFee" label="退款金额" align="center">
        </el-table-column>
        <el-table-column prop="totoalFee" label="交易金额" align="center">
        </el-table-column>
        <el-table-column
          prop="ctime"
          label="申请退款时间"
          align="center"
          width="155"
        >
        </el-table-column>
        <el-table-column
          prop="refundTime"
          label="完成退款时间"
          align="center"
          width="155"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
              >退款审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <el-drawer
      ref="drawerLk"
      :visible.sync="drawer"
      size="50%"
      :destroy-on-close="true"
    >
      <template v-slot:title>
        <h1>财务审核</h1>
      </template>
      <div class="chouti">
        <el-row v-if="choutidata.buytime !== ''">
          <el-col :span="4">订单支付时间:</el-col>
          <el-col :span="18" :offset="2"
            >{{ new Date(Number(choutidata.buytime)).toLocaleString() }}
          </el-col>
        </el-row>
        <el-row v-if="choutidata.outTradeNo !== ''">
          <el-col :span="4">订单号:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.outTradeNo }} </el-col>
        </el-row>
        <el-row v-if="choutidata.regtypeStr !== ''">
          <el-col :span="4">业务类型:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.regtypeStr }} </el-col>
        </el-row>
        <el-row v-if="choutidata.tradeTypeStr !== ''">
          <el-col :span="4">支付渠道:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.tradeTypeStr }} </el-col>
        </el-row>
        <el-row v-if="choutidata.transactionId !== ''">
          <el-col :span="4">支付流水号:</el-col>
          <el-col :span="18" :offset="2"
            >{{ choutidata.transactionId }}
          </el-col>
        </el-row>
        <el-row v-if="choutidata.payeeName !== ''">
          <el-col :span="4">收款人姓名:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.payeeName }} </el-col>
        </el-row>
        <el-row v-if="choutidata.payeeAccount !== ''">
          <el-col :span="4">支付宝账号:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.payeeAccount }} </el-col>
        </el-row>
        <el-row v-if="choutidata.periodAlready !== ''">
          <el-col :span="4">已上课周期:</el-col>
          <el-col :span="18" :offset="2"
            >{{ choutidata.periodAlready }}
          </el-col>
        </el-row>
        <el-row v-if="choutidata.periodRefund !== ''">
          <el-col :span="4">退款月数:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.periodRefund }} </el-col>
        </el-row>
        <el-row v-if="choutidata.refundFee !== ''">
          <el-col :span="4">退款金额:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.refundFee }} </el-col>
        </el-row>
        <el-row v-if="choutidata.amount !== ''">
          <el-col :span="4">交易金额:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.amount }} </el-col>
        </el-row>
        <el-row v-if="choutidata.refundTypeStr !== ''">
          <el-col :span="4">退款类型:</el-col>
          <el-col :span="18" :offset="2"
            >{{ choutidata.refundTypeStr }}
          </el-col>
        </el-row>
        <el-row v-if="choutidata.refundReason !== ''">
          <el-col :span="4">退款原因:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.refundReason }} </el-col>
        </el-row>
        <el-row v-if="choutidata.refundMsg !== ''">
          <el-col :span="4">退款说明:</el-col>
          <el-col :span="18" :offset="2">{{ choutidata.refundMsg }} </el-col>
        </el-row>
        <el-row v-if="choutidata.attsUrl !== ''">
          <el-col :span="4">附件:</el-col>
          <el-col :span="18" :offset="2">
            <el-image
              style="width: 200px"
              :src="choutidata.attsUrl"
              fit="contain"
            ></el-image>
          </el-col>
        </el-row>
        <el-row class="buttonCenter" v-if="statusStr === '退款中'">
          <el-button type="primary" @click="comfirmRefund">确认退款</el-button>
        </el-row>
        <el-row class="buttonCenter" v-else-if="statusStr === '退款成功'">
          <el-button type="success" :disabled="true">已经退款</el-button>
        </el-row>
      </div>
    </el-drawer>
  </section>
</template>

<script>
export default {
  created() {
    // init全量数据展示
    this.arrangeParams()
  },
  mounted() {},
  data() {
    return {
      searchJson: {
        regType: '', // 业务类型
        tradeType: '', // 支付方式
        status: '', // 退款状态
        refundType: '', // 退款类型
        uid: '', // 用户id

        outTradeNo: '', // 订单号
        transactionId: '', // 订单交易流水号
        sbuytime: '', // 订单支付-开始时
        ebuytime: '', // 订单支付-结束时间
        sctime: '', // 申请退款-开始时间
        ectime: '', // 申请退款-结束时间
        srefundTime: '', // 申请完成-开始时间
        erefundTime: '' // 申请完成-结束时间
      },
      // 被动关联事件_断值(用于赋值↑下半段)
      num1: '',
      num1_: '',
      num2: '',
      num2_: '',

      // 对应↑上半段,相应事件里赋值成数字给接口用了,为了显示正常
      // 而不是显示数字,所以:searchJson.regType之类不能用
      fordisplay1: '',
      fordisplay2: '',
      fordisplay3: '', // 退款状态
      fordisplay5: '', // 退款类型
      fordisplay4: '',

      // 分页
      currentPage: 0,
      pageSize: 0,
      allDigit: 0,

      // tableData
      tableData: [],
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
      if (val === '4' || val === '5') {
        this.searchJson.status = Number(val)
        this.arrangeParams()
      } else {
        this.searchJson.status = ''
        this.arrangeParams()
      }
    },
    refundType(val) {
      console.info(val, typeof val)
      if (val === '0' || val === '1') {
        this.searchJson.refundType = Number(val)
        this.arrangeParams()
      } else {
        this.searchJson.refundType = ''
        this.arrangeParams()
      }
    },
    customerSearch(val) {
      console.info(val, typeof val)
      this.searchJson.uid = val
      this.arrangeParams()
    },
    // 2组关联
    chooseOrder(val) {
      console.info(val, typeof val)
      if (val === '0') {
        // 订单号
        if (this.num1_) {
          this.searchJson.transactionId = ''
          this.searchJson.outTradeNo = this.num1_
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
          this.searchJson.transactionId = this.num1_
          this.arrangeParams()
        } else {
          this.$message({
            message: '别忘记键入编号,才能给你数据',
            type: 'warning'
          })
        }
      } else {
        this.searchJson.outTradeNo = ''
        this.searchJson.transactionId = ''
        this.arrangeParams()
      }
    },
    intoNumber(val) {
      console.info(val, typeof val)
      if (this.num1 === '0') {
        // 订单号
        this.searchJson.transactionId = ''
        this.searchJson.outTradeNo = val
        this.arrangeParams()
      } else if (this.num1 === '1') {
        // 流水号
        this.searchJson.outTradeNo = ''
        this.searchJson.transactionId = val
        this.arrangeParams()
      } else {
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
          console.info(`给青龙大哥剔牙--${key}-因为它是${this.searchJson[key]}`)
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
          console.info(`给青龙大哥剔牙--${key}-因为它是${this.searchJson[key]}`)
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
    // 操作
    async handleEdit() {
      console.info('index:', arguments[0])
      console.info('row:', arguments[1])
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
    },
    async comfirmRefund() {
      const { code } = await this.$http.Finance.toAgree({
        refundUid: JSON.parse(localStorage.getItem('staff')).id,
        paymentId: this.whichListOrderId
      }).catch((err) => {
        console.error(err)
        this.$message({
          message: '同意退款请求失败,稍后再试',
          type: 'error'
        })
        return -1
      })
      if (code === 0) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        // 跳回列表并刷新
        this.$refs.drawerLk.closeDrawer() // 关闭抽屉
        this.arrangeParams() // 刷新列表数据
      } else {
        this.$message({
          message: '操作失败,稍后再试',
          type: 'warning'
        })
      }
    }
  },
  computed: {
    t3() {
      return this.data.t1 + 1
    }
  },
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
  margin: 0 10px;
  background-color: #fff;
}
.bianju10 .el-divider--horizontal {
  margin: 5px 0px;
}
.bianju10 .el-pagination {
  display: flex;
  justify-content: flex-end;
}
.bom10 {
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
</style>
