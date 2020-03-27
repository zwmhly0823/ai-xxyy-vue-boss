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
            <div>
              {{ scope.row.express_status_chinese }}
            </div>
            <div class="trail">追踪</div>
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
    <m-pagination
      show-pager
      open="calc(100vw - 170px - 30px)"
      close="calc(100vw - 50px - 30px)"
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
      console.log(val, 'orange')
      this.getExpressList(val.id)
    }
  },
  created() {
    console.log('dataExp', this.dataExp)
    this.getExpressList(this.dataExp)
  },
  mounted() {},
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      enter: false,
      cout: 0
    }
  },

  methods: {
    getExpressList(id) {
      const query = JSON.stringify(`{"express_status":"${id}"}`)
      console.log(query)
      axios
        .post('/graphql/logisticsList', {
          query: `
          {
  LogisticsListPage(query:${query}, size: 20, page: 1) {
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
            // item.birthday = this.timeFormat(item.user.birthday) || ''
            return item
          })
          this.tableData = resData
          console.log(resData, ' this.tableData')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  background-color: #fff;
  font-size: 12px;
  color: #666666;
  .trans {
    transform: rotate(-90deg);
    margin-bottom: -8px;
  }
  .express {
    .express_status_1,
    .express_status_2,
    .express_status_3,
    .express_status_4 {
      color: red;
    }
    .express_status_5 {
      color: rgb(0, 51, 255);
    }
  }
}
</style>
