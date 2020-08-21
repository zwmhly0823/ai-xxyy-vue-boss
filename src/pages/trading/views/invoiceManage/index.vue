<!--
 * @Descripttion: 
 * @version: 
 * @Author: shasen
 * @Date: 2020-08-19 15:13:40
 * @LastEditors: shasen
 * @LastEditTime: 2020-08-19 19:49:18
 -->
<template>
  <el-row type="flex" class="invoice-manage app-main">
    <el-col class="grop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="invoice-manage-container">
            <div class="operete-row">
              <invoiceSearch @search="getSearch" />
            </div>
            <section ref="tableContainer">
              <ele-table
                :tableSize="'small'"
                :dataList="tableData"
                :tableHeight="tableHeight"
                :size="sourchParams.size"
                :page="sourchParams.page"
                :total="totalElements"
                :loading="loading"
                @pageChange="pageChange_handler"
                class="mytable"
              >
                <el-table-column label="用户信息" align="center">
                  <template slot-scope="scope">
                    <div @click="userHandle(scope.row)" class="primary-text">
                      <p>
                        {{
                          scope.row.userInfo && scope.row.userInfo.username
                            ? scope.row.userInfo.username
                            : '-'
                        }}
                      </p>
                      <p>
                        {{
                          scope.row.userInfo && scope.row.userInfo.mobile
                            ? scope.row.userInfo.mobile
                            : '-'
                        }}
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="订单编号·订单交易流水号"
                  align="center"
                  min-width="130"
                >
                  <template slot-scope="scope">
                    <p>
                      {{
                        scope.row.orderInfo && scope.row.orderInfo.out_trade_no
                          ? scope.row.orderInfo.out_trade_no
                          : '-'
                      }}
                    </p>
                    <p>
                      {{
                        scope.row.paymentPayInfo &&
                        scope.row.paymentPayInfo.transaction_id
                          ? scope.row.paymentPayInfo.transaction_id
                          : '-'
                      }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="发票抬头" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.buyername }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="发票类型" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.invoice_type === 0">无</span>
                    <span v-if="scope.row.invoice_type === 1">普通发票</span>
                    <span v-if="scope.row.invoice_type === 2">专票</span>
                  </template>
                </el-table-column>
                <el-table-column label="发票金额" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.money }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="发票代码" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.orderInfo && scope.row.orderInfo.invoice_code
                        ? scope.row.orderInfo.invoice_code
                        : '-'
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开票申请时间" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.ctime ? scope.row.ctime : '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开票完成时间" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.complete_time ? scope.row.complete_time : '-'
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开票状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.invoice_status === 0">待开票</span>
                    <span v-if="scope.row.invoice_status === 1">开票中</span>
                    <span v-if="scope.row.invoice_status === 2">已开票</span>
                    <span v-if="scope.row.invoice_status === 3">开票失败</span>
                    <span v-if="scope.row.invoice_status === 4">作废</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <a
                      :href="scope.row.invoice_pdf"
                      class="editStyle"
                      target="_blank"
                      v-if="scope.row.invoice_pdf"
                      >详情</a
                    >
                    <span v-else>-</span>
                  </template>
                </el-table-column>
              </ele-table>
            </section>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import invoiceSearch from './components/invoiceSearch'
import EleTable from '@/components/Table/EleTable'
import { formatData, openBrowserTab } from '@/utils/index.js'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      loading: false,
      sourchParams: {
        page: 1,
        size: 20
      },
      totalElements: 0,
      queryObj: {}
    }
  },
  created() {
    this.calcTableHeight()
    this.invoiceData()
  },
  mounted() {},
  components: {
    EleTable,
    invoiceSearch
  },
  computed: {},

  methods: {
    // 获取search
    getSearch(data) {
      this.queryObj = data
      this.sourchParams.page = 1
      this.invoiceData(this.queryObj, 1)
    },
    // 发票管理列表
    invoiceData(queryObj = {}, page = 1) {
      this.loading = true
      this.$http.Order.invoicePage(`${JSON.stringify(queryObj)}`, page)
        .then((res) => {
          const _data = res.data.InvoiceRecordPage.content
          // this.tableData = res.data.InvoiceRecordPage.content
          _data.forEach((item) => {
            // 开票申请时间
            item.complete_time = formatData(item.complete_time, 's')
            item.ctime = formatData(item.ctime, 's')
          })
          this.tableData = _data
          this.totalElements = Number(res.data.InvoiceRecordPage.totalElements)
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 用户详情页
    userHandle(row) {
      // 新标签打开详情页
      row.uid && openBrowserTab(`/users/#/details/${row.uid}`)
    },
    // 换页
    pageChange_handler(res) {
      this.sourchParams.page = res
      this.invoiceData(this.queryObj, this.sourchParams.page)
    },
    // 计算表格高度
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.invoice-manage {
  .grop-container {
    position: relative;
    margin: 10px;
    background: #fff;
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
    .scroll-container {
      background: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      .scrollbar-wrapper {
        overflow-x: hidden;
      }
      .el-scrollbar {
        flex: 1;
      }
    }
  }
}
.operete-row {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  .search-container {
    .search-item {
      position: relative;
      /deep/ input {
        padding-left: 25px;
      }
    }
    b {
      position: absolute;
      left: 10px;
      top: 7px;
      color: #999;
    }
  }
}
section {
  .mytable {
    .editStyle {
      color: #2a75ed;
      cursor: pointer;
      &.btn-disabled {
        color: #ccc;
        cursor: no-drop;
      }
    }
  }
}
</style>
