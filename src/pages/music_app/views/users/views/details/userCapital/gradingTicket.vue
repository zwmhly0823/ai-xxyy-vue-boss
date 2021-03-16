<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-11 12:39:57
-->
<template>
  <div class="grading_ticket">
    <ele-table
      :tableHeight="'auto'"
      :tableSize="'small'"
      :dataList="dataList"
      :loading="flags.loading"
      :size="tableQuery.size"
      :page="tableQuery.page"
      :total="totalElements"
      :showAllTotalNum="true"
      @pageChange="pageChange_handler"
      class="mytable"
    >
      <el-table-column
        prop="couponCode"
        label="券码"
        width="150"
      ></el-table-column>
      <el-table-column prop="status" label="券码状态">
        <template slot-scope="scope">
          <div>{{ scope.row.statusCH }}</div>
          <div>{{ scope.row.reviewTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="有效期">
        <template slot-scope="scope">
          <span> {{ scope.row.validTimeStart }}</span>
          <span> - </span>
          <span> {{ scope.row.validTimeEnd }}</span>
        </template>
      </el-table-column>
      <!-- promotions.promotionsName -->
      <el-table-column prop="update_date" label="关联活动">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.promotions && scope.row.promotions.promotionsName
            }}</span
          >
        </template>
      </el-table-column>
      <!-- order.packagesName: 名称 order.outTradeNo 订单号 order.amount 金额 -->
      <el-table-column label="关联订单">
        <template slot-scope="scope">
          <div>
            <span>{{
              (scope.row.order && scope.row.order.packagesName) || '--'
            }}</span>
            <span
              >￥{{ (scope.row.order && scope.row.order.amount) || '--' }}</span
            >
          </div>
          <div>
            {{ (scope.row.order && scope.row.order.outTradeNo) || '--' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="ctime" label="获得时间"></el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <span> {{ scope.row.remark || '--' }}</span>
        </template>
      </el-table-column>
    </ele-table>
  </div>
</template>

<script>
import { formatDateByType } from '@/utils/mini_tool_lk'
import EleTable from '@/components/Table/EleTable'
export default {
  name: 'coinComponent',
  props: {
    changeSubject: {
      type: Number,
      required: true
    },
    tab: {
      type: String,
      default: ''
    },
    childTab: {
      type: String,
      default: ''
    }
  },
  components: { EleTable },
  data() {
    return {
      dataList: [],
      flags: {
        loading: false
      },
      tableQuery: {
        page: 1,
        size: 2
      },
      totalElements: 0,
      // 该学员id
      studentId: ''
    }
  },
  mounted() {},
  created() {
    this.studentId = this.$route.params.id
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {}
    },
    childTab(val) {
      if (val === 'gradingTicket') {
        this.getGradingTicketList()
      }
    }
  },
  computed: {},
  methods: {
    /**
     * @descripion 获取考级券列表
     */
    async getGradingTicketList() {
      this.flags.loading = true
      const { examByUid } = this.$http.User
      try {
        const {
          payload: { payload }
        } = await examByUid(this.studentId) // 538450723269251072
        this.packageTicketList(payload)
        this.dataList = payload
      } finally {
        this.flags.loading = false
      }
    },
    packageTicketList(tickets = []) {
      tickets.forEach((t) => {
        const statusCode = {
          AWAITCHECK: '待核销',
          USERD: '已使用',
          ALREADYCHECK: '已核销',
          EXPIRED: '已过期',
          INVALID: '已作废'
        }
        t.statusCH = statusCode[t.status]
        t.validTimeStart = formatDateByType(+t.validTimeStart, '-', 'Y')
        t.validTimeEnd = formatDateByType(+t.validTimeEnd, '-', 'Y')
        t.ctime = formatDateByType(+t.ctime, '-', 'YS')
        t.reviewTime = formatDateByType(+t.reviewTime, '-', 'YS')
      })
    },
    // 翻页
    pageChange_handler(page) {}
  }
}
</script>

<style lang="scss" scoped>
.grading_ticket {
  .green-text-color {
    color: #67c23a;
  }
  .red-text-color {
    color: crimson;
  }
}
</style>
