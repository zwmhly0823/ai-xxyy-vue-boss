<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-13 16:42:23
-->
<template>
  <div class="jd_card">
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
        prop="resOrderId"
        label="京东卡订单编号"
      ></el-table-column>
      <el-table-column prop="resOrderPrice" label="价格">
        <template slot-scope="scope">
          <span>
            ￥
            {{ (scope.row.product && scope.row.product.price) || '--' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="promotionsName" label="关联活动"></el-table-column>
      <el-table-column label="关联订单">
        <template slot-scope="scope">
          <div>
            <span>{{
              (scope.row.order && scope.row.order.packagesName) || '--'
            }}</span>
            <span v-if="scope.row.order && scope.row.order.amount">￥</span>
            <span>{{
              (scope.row.order && scope.row.order.amount) || '-'
            }}</span>
          </div>
          <div>
            {{ (scope.row.order && scope.row.order.outTradeNo) || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ctime" label="获得时间"></el-table-column>
      <el-table-column prop="update_date" label="操作">
        <template slot-scope="scope">
          <div class="operate-btn">
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-info"
              iconColor="red"
              title="是否发送京东卡补发短信？"
              @onConfirm="sendJdCardMsg"
            >
              <span
                class="send_msg-btn"
                @click="tableRowOperate(scope.row)"
                slot="reference"
                >补发短信</span
              >
            </el-popconfirm>
          </div>
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
    },
    stuInforAdd: {
      type: Object,
      default: () => {}
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
        size: 10
      },
      totalElements: 0,
      // 该学员id
      studentId: '',
      currentRow: {}
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
      handler(newValue, oldValue) {
        if (this.childTab === 'jdCard') {
          this.getJdCardList()
        }
      }
    },
    childTab(val) {
      if (val === 'jdCard') {
        this.getJdCardList()
      }
    }
  },
  computed: {
    subject2() {
      return this.changeSubject === 0 ? 'ART_APP' : 'WRITE_APP'
    }
  },
  methods: {
    /**
     * @descripion 获取考级券列表
     */
    async getJdCardList() {
      this.flags.loading = true

      const { jdCardList } = this.$http.User
      const params = {
        ...this.tableQuery,
        subject2: this.subject2,
        mobile: this.stuInforAdd.mobile // 18686150954
      }
      try {
        const { payload = [] } = await jdCardList(params)
        this.packageCardList(payload)
        this.dataList = payload
      } catch (err) {
        console.log(err)
      } finally {
        this.flags.loading = false
      }
    },
    /**
     * @description 包装数据
     */
    packageCardList(tickets = []) {
      tickets.forEach((t) => {
        t.ctime = formatDateByType(+t.ctime, '-', 'YS')
      })
    },
    // 发送短信
    async sendJdCardMsg() {
      const { jdCardMsg } = this.$http.User
      const { resOrderId: jdOrderId, mobile } = this.currentRow
      const params = {
        jdOrderId,
        mobile
      }
      jdCardMsg(params).then((res) => {
        const { code, payload } = res
        if (code === 0) {
          this.$message.success((payload && payload.result) || '发送短信成功')
        }
      })
    },
    // 点击 发短信按钮
    tableRowOperate(row) {
      this.currentRow = row
    },
    // 翻页
    pageChange_handler(page) {
      this.tableQuery.page = page
      this.getJdCardList()
    }
  }
}
</script>

<style lang="scss" scoped>
.jd_card {
  .green-text-color {
    color: #67c23a;
  }
  .red-text-color {
    color: crimson;
  }
  .send_msg-btn {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
