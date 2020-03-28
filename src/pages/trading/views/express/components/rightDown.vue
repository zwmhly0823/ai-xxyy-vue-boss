<template>
  <div class="container">
    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleSelectionChangeEnter"
      @cell-mouse-leave="handleSelectionChangeLeave"
      @row-click="handleExpressTo"
      :header-cell-style="headerStyle"
      :current-row-key="rowKey"
    >
      <el-table-column type="selection" width="25" v-if="!teacherId">
      </el-table-column>
      <el-table-column width="25" v-if="!teacherId">
        <div class="three-dot" @click="batchProcessing">
          <img src="@/assets/images/icon/icon-three-dot.jpg" />
        </div>
      </el-table-column>
      <el-table-column label="用户及日期">
        <template slot-scope="scope">
          <div class="user">
            <div
              class="
            name"
            >
              {{ scope.row.receipt_tel }}
            </div>
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
            <el-button
              class="trail"
              type="text"
              @click="Express(scope.row.express_nu, scope.row.express_company)"
            >
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
          <span>物流公司：</span><span>{{ expressTitle.company }}</span>
        </div>
        <span>快递单号：</span>
        <span>{{ expressTitle.nu }}</span>
      </div>
      <div class="waitFor" v-show="waitFor">快递待揽收</div>
      <el-timeline v-show="timeLine">
        <el-timeline-item
          v-for="(value, index) in expressDetail"
          :key="index"
          :color="activities.color"
        >
          <div class="statebox" v-for="(item, key) in value" :key="key">
            <div class="state" v-if="key === 0">{{ item.status }}</div>
            <div class="content">{{ item.context }}</div>
            <div class="time">{{ item.time }}</div>
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
      open="calc(100vw - 170px - 24px - 180px)"
      close="calc(100vw - 50px - 24px - 180px)"
    ></m-pagination>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import axios from '@/api/axios'
import { isToss, formatData } from '@/utils/index'
export default {
  props: ['dataExp', 'search'],
  components: {
    MPagination
  },
  watch: {
    search(val) {
      const { range } = val[0]
      const resKey = Object.keys(range)
      const { gte, lte } = range[resKey]

      const timeType = {
        [resKey[0]]: 1,
        start_time: gte,
        end_time: lte
      }
      const { term } = val[1]
      const toptic = term.topic_id
      console.log(toptic, timeType, 'resKedkdkdkdkdky')
    },
    dataExp(val) {
      this.currentPage = 1
      this.tableData = []
      console.log(val, 'orange')
      this.getExpressList(val.id)
    }
  },
  created() {
    console.log('dataExp', this.dataExp)
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    this.getExpressList(this.dataExp.id)
  },
  mounted() {},
  data() {
    return {
      rowKey: '',
      teacherId: '',
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
      expressTitle: {
        nu: '',
        company: ''
      },
      tableData: [],
      multipleSelection: [],
      enter: false,
      cout: 0,
      // 弹出层
      timeline: false,
      // 时间线样式
      activities: {
        size: 'large',
        type: 'primary',
        color: '#0bbd87'
      }
    }
  },
  methods: {
    batchProcessing() {
      console.log('批量处理事件')
    },
    // 表头样式
    headerStyle() {
      return 'font-size: 12px;color: #666;font-weight: normal;'
    },
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
      let q = `{"express_status":"${id}"}`
      if (this.teacherId) {
        q = `{"express_status":"${id}", "teacher_id": ${this.teacherId}}`
      }

      const query = JSON.stringify(`${q}`)
      // console.log(query)
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
      express_nu
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
            item.crtime = formatData(+item.ctime, 's')
            item.detime = formatData(+item.delivery_collect_time, 's')
            item.uptime = formatData(+item.utime, 's')
            item.sgtime = formatData(+item.signing_time, 's')
            item.buytime = formatData(+item.buy_time, 's')
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
      console.log(this.rowKey, 'this.rowKey')
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
    Express(expressNu, company) {
      this.timeline = true
      this.expressTitle.nu = expressNu
      this.expressTitle.company = company
      this.$http.Express.ExpressList({ expressNo: expressNu })
        .catch((err) => console.log(err))
        .then((res) => {
          if (res && res.payload) {
            this.waitFor = false
            console.log('ress----', res && res.payload)
            this.timeLine = true
            const lastData = {}

            res.payload[0].data.forEach((item) => {
              if (item.status === '揽收') {
                lastData.begin = lastData.begin == null ? [] : lastData.begin
                lastData.begin.push(item)
              } else if (item.status === '在途' || item.status === '派件') {
                lastData.onway = lastData.onway == null ? [] : lastData.onway
                lastData.onway.push(item)
              } else {
                lastData.receive =
                  lastData.receive == null ? [] : lastData.receive
                lastData.receive.push(item)
              }
              this.expressDetail = lastData
            })
          } else {
            console.log('error    ---------', 123123232)
            this.expressDetail = []
            this.waitFor = true
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 50px;
  background-color: #fff;
  color: #666;
  .three-dot {
    display: flex;
    justify-content: center;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .user,
  .sign,
  .express,
  .take,
  .product {
    font-size: 14px;
    .name {
      color: #333;
    }
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
