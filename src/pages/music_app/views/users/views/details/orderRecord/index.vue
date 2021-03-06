<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-02-06 16:58:18
-->
<template>
  <div class="order-record">
    <el-radio-group v-model="changeType" size="mini">
      <el-radio-button :label="0">课程订单</el-radio-button>
      <el-radio-button :label="1">其他订单</el-radio-button>
    </el-radio-group>
    <PayOrder
      style="margin-top:10px"
      @goTrack="goTrack"
      :Tabledata="logisticsTableData"
      v-show="!changeType"
    />
    <ChangeOrder @goTrack="goTrack" :Tabledata="logisticsTableData" v-show="changeType" />
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!--物流记录详情抽屉-->
    <express-detail :order_id="order_id" ref="order_id" />
    <el-dialog title="物流信息" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div>
        <p class="dialog-top">物流公司:{{ expressData.express_company || '无' }}</p>
        <el-table border :data="tableData" style="width: 100%">
          <el-table-column prop="product_name" label="商品" width="100"></el-table-column>
          <el-table-column prop="express_total" label="数量" width="100">
            <template slot-scope="scope">
              <div>
                {{
                scope.row.product_name
                ? scope.row.product_name.split(',').length
                : 1
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="express_status_text" label="发货状态"></el-table-column>
          <el-table-column prop="express_nu" label="运单号">
            <template slot-scope="scope">
              <div>{{ scope.row.express_nu }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-bot">
          <p>配送信息</p>

          <div class="bot-r">
            <p>
              <span>配送方式</span>
              快递
            </p>
            <p>
              <span>收货人</span>
              {{ `${expressData.receipt_name}/${expressData.receipt_tel}` }}
            </p>
            <p>
              <span>收获地址</span>
              {{ expressData.address_detail }}
            </p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import { REGTYPE } from '@/utils/enums'
import ExpressDetail from '@/pages/music_app/views/trading/views/components/expressDetail'
import ChangeOrder from './changeOrder'
import PayOrder from './payOrder'
export default {
  name: 'logistics',
  components: {
    ExpressDetail,
    ChangeOrder,
    PayOrder
  },
  mounted() {
    // 初始化拿数据
    setTimeout(() => {
      this.reqgetOrderPage()
    }, 1000)
  },
  data() {
    return {
      changeType: 0,
      order_id: '', // 物流详情抽屉
      experId: '',
      logisticsTableData: [], // table展示数据
      // 数据查询
      currentPage: 1, // 页码
      // 分页组件
      allDigit: 1, // 总量
      dialogVisible: false,
      expressData: {},
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {
    // 点击物流详情
    goTrack(val) {
      console.log(val)
      const query = {
        id: val.id
        // id: '177177182042'
      }
      this.$http.User.getExpressDetails(query).then((res) => {
        console.log(res, 'yyyyyyyyyyyyyyyyyy')
        this.$refs.order_id.drawer = true
        this.order_id = res.data.ExpressList[0].order_id
        this.experId = res.data.ExpressList[0].user_id
        // this.dialogVisible = true
        // this.expressData = res.data.ExpressList[0]
        // this.tableData = res.data.ExpressList
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqgetOrderPage()
    },
    // 数据接口_订单·物流
    reqgetOrderPage() {
      const query = {
        regtype: this.changeType === 1 ? [4, 5, 6] : [1, 2, 3, 7, 10, 11, 13],
        uid: this.$route.params.id
      }
      // const regtype = this.changeType?[4,5,6]:[1,2,3,7]
      this.$http.User.getOrderPage(
        query, // studentId
        this.currentPage
      ).then((res) => {
        if (res.data.OrderPage) { 
          console.log('订单物流模块接口', res.data.OrderPage.content)
          const _data = res.data.OrderPage.content
          _data.forEach((item) => {
            item.ctime = item.ctime ? formatData(item.ctime, 's') : ''
            item.regtype_text = REGTYPE[item.regtype] || '-'
          })
          this.allDigit = +res.data.OrderPage.totalElements
          this.logisticsTableData = _data // 赋值
        }
      })
    }
  },
  computed: {
    hh2() {
      return 2
    }
  },
  watch: {
    changeType: function(val, oldval) {
      console.log(val, oldval)
      this.reqgetOrderPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-record {
  padding: 10px;
}
.logistics {
  color: #5ea0f5;
  text-decoration: underline;
  cursor: pointer;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.dialog-top {
  margin-bottom: 10px;
}
.dialog-bot {
  margin-top: 10px;
  display: flex;
  color: 16px;
  font-weight: bold;
  .bot-r {
    margin-left: 30px;
    color: 12px;
    font-size: 12px;
    span {
      width: 100px;
      font-size: 12px;
      color: darkgray;
      display: inline-block;
      margin: 10px 20px 0;
    }
  }
}
</style>
