<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      height="680"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleSelectionChangeEnter"
      @cell-mouse-leave="handleSelectionChangeLeave"
      @row-click="handleExpressTo"
    >
      <el-table-column type="selection" width="25"> </el-table-column>
      <el-table-column width="25">
        <div :class="[false, 'trans']">
          <i class="el-icon-more-outline"></i>
        </div>
      </el-table-column>
      <el-table-column label="用户及日期">
        <template slot-scope="scope">
          <div class="user">
            <div>{{ scope.row.receipt_tel }}</div>
            <div>{{ scope.row.buytime }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="300">
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.product_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="240">
        <template slot-scope="scope">
          <div class="take">
            <div>
              <span>{{ scope.row.receipt_name }}</span>
              <span>{{ scope.row.receipt_tel }}</span>
            </div>
            <div>
              <span>{{ scope.row.province }}</span>
              <span>{{ scope.row.city }}</span>
              <span>{{ scope.row.area }}</span>
            </div>
            <div>
              <span>{{ scope.row.address_detail }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="express">
            <div :class="'wait_' + scope.row.express_status">
              {{ scope.row.express_status_chinese }}
            </div>
            <el-button class="trail" type="text" @click="Express">
              追踪
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流创建·揽收·签收" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="sign">
            <div>{{ scope.row.crtime }}</div>
            <div>{{ scope.row.detime }}</div>
            <div>{{ scope.row.sgtime }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="timeline" width="30%" v-model="expressDetail">
      <div class="line">
        <div class="logistics">
          <span>物流公司：</span><span>中通物流</span>
        </div>
        <span>快递单号：</span>
        <span>2435345465756768788798</span>
      </div>
      <div class="waitFor" v-show="waitFor">快递待揽收</div>
      <el-timeline v-show="timeLine">
        <el-timeline-item v-for="(value, index) in expressDetail" :key="index">
          <div v-if="value != []">
            <div class="statebox" v-for="(item, key) in value" :key="key">
              <div class="state" v-if="key === 0">{{ item.status }}</div>
              <div class="content">{{ item.context }}</div>
              <div class="time">{{ item.time }}</div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      show-pager
      open="calc(100vw - 170px - 30px - 180px)"
      close="calc(100vw - 50px - 30px - 180px)"
    ></m-pagination>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import axios from '@/api/axios'
import dayjs from 'dayjs'
export default {
  props: ['dataExp'],
  components: {
    MPagination
  },
  watch: {
    dataExp(val) {
      this.currentPage = 1
      this.tableData = []
      console.log(val, 'orange')
      this.getExpressList(val.id)
    }
  },
  created() {
    console.log('dataExp', this.dataExp)
    this.getExpressList(this.dataExp.id)
  },
  mounted() {},
  data() {
    return {
      createDataExp: '',
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      // 时间线
      timeLine: true,
      // 等待揽收
      waitFor: false,
      // 物流详情
      expressDetail: [],
      tableData: [],
      multipleSelection: [],
      enter: false,
      cout: 0,
      // 弹出层
      timeline: false,
      // 时间线样式
      activities: [
        {
          size: 'large',
          type: 'primary',
          color: '#0bbd87'
        }
      ]
    }
  },
  methods: {
    handleExpressTo(row, column, event) {
      console.log(row, column, event, 'row, column, event')
    },
    handleSizeChange(val) {
      console.log(val, 'handleSizeChange')
      this.currentPage = val
      console.log(this.dataExp.id, this.dataExp, 'this.dataExp.id')
      this.getExpressList(this.dataExp.id)
    },
    getExpressList(id) {
      const query = JSON.stringify(`{"express_status":"${id}"}`)
      console.log(query)
      axios
        .post('/graphql/logisticsList', {
          query: `
          {
  LogisticsListPage(query:${query}, size: 20, page: ${this.currentPage}) {
    first
    last
    number
    size
    totalPages
    totalElements
    content {
      id
      product_name
      delivery_collect_time
      express_status
      express_status_chinese
      buy_time
      province
      area
      city
      address_detail
      express_company
      signing_time
      receipt_name
      receipt_tel
      ctime
      utime
      user{
        id
        birthday
        mobile
      }
    }
  }
}`
        })
        .then((res) => {
          console.log(res.data.LogisticsListPage.content, 'res123')
          const resData = res.data.LogisticsListPage.content
          resData.forEach((item) => {
            item.crtime = this.timeFormat(item.ctime)
            item.detime = this.timeFormat(item.delivery_collect_time)
            item.uptime = this.timeFormat(item.utime)
            item.sgtime = this.timeFormat(item.signing_time)
            item.buytime = this.timeFormat(item.buy_time)
            return item
          })
          this.tableData = resData
          // 总页数
          this.totalPages = +res.data.LogisticsListPage.totalPages

          this.totalElements = +res.data.LogisticsListPage.totalElements // 总条数

          console.log(
            resData,
            ' this.tableData',
            this.totalElements,
            ' this.totalElements',
            this.totalPages,
            'this.totalPages'
          )
          //  = res.data.LogisticsListPage.content
        })
    },
    timeFormat(time) {
      return dayjs.unix(Number(time) / 1000).format('YYYY-MM-DD  hh:mm:ss')
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChangeEnter() {
      this.cout++
      console.log('鼠标进入', this.cout)
      this.enter = true
    },
    handleSelectionChangeLeave() {
      console.log('鼠标离开', this.cout)
      this.cout++

      this.enter = false
    },
    // 物流列表信息
    Express() {
      this.timeline = true
      this.$http.Express.ExpressList({ expressNo: 293103003754 })
        .catch((err) => console.log(err))
        .then((res) => {
          if (res && res.payload) {
            this.timeLine = true
            const lastData = {
              receive: [],
              onway: [],
              begin: []
            }

            res.payload[0].data.forEach((item) => {
              if (item.status === '揽收') {
                lastData.begin.push(item)
              } else if (item.status === '在途' || item.status === '派件') {
                lastData.onway.push(item)
              } else {
                lastData.receive.push(item)
              }
              this.expressDetail = lastData
            })

            // res.payload.forEach((item) => {
            //   this.expressDetail.expressNo = item.expressNo
            //   this.expressDetail.ctime = item.ctime
            //   this.expressDetail.utime = item.utime
            //   item.data.forEach((Dataitem) => {

            //   })
            // })
          } else {
            this.waitFor = true
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  background-color: #fff;
  font-size: 12px;
  .trans {
    transform: rotate(-90deg);
    margin-bottom: -8px;
  }
  .express {
    .wait_4 {
      color: red;
    }
    .trail {
      cursor: pointer;
    }
  }
  .line {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid gainsboro;
    margin-top: -40px;
    margin-bottom: 22px;
    .logistics {
      margin-bottom: 6px;
    }
  }
  .waitFor {
    font-size: 16px;
    color: rgb(190, 190, 190);
    text-align: center;
  }
  .statebox {
    margin-bottom: 20px;
    .state {
      font-size: 18px;
      line-height: 30px;
    }
    .content {
      line-height: 20px;
    }
    .time {
      line-height: 20px;
    }
  }
}
</style>
