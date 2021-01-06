<!--
 * @Descripttion: 班级转化系统课订单列表
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-05 21:43:03
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-15 20:21:17
-->
<template>
  <div class="team-order">
    <!-- search -->
    <div class="team-order-search">
      <el-form :inline="true" size="mini">
        <el-form-item label="学员搜索">
          <!-- <el-input v-model="formInline.user" placeholder="审批人"></el-input> -->
          <search-phone
            tip="手机号搜索"
            name="uid"
            @result="getUid"
          ></search-phone>
        </el-form-item>
        <el-form-item label="支付状态">
          <simple-select
            placeholder="支付状态"
            name="status"
            :multiple="false"
            :data-list="statusList"
            @result="getStatus"
          />
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="ctime"
            type="date"
            placeholder="选择时间"
            format="yyyy-MM-dd"
            style="width: 140px;"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <!-- list -->
    <div class="team-order-list">
      <!-- dom -->
      <div class="tableInner" ref="tableInner"></div>
      <el-table :data="orderList" :height="tableHeight" ref="table">
        <el-table-column prop="user" label="学员" min-width="90">
          <template slot-scope="scope">
            <user-info :user="scope.row.user" :is-head="false" />
          </template>
        </el-table-column>
        <el-table-column prop="out_trade_no" label="订单号" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.out_trade_no || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="packages_name" label="购买商品">
          <template slot-scope="scope">
            {{ scope.row.packages_name || scope.row.product_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ctime_text"
          label="下单时间"
          min-width="90"
        ></el-table-column>
        <el-table-column
          prop="paytime_text"
          label="支付时间"
          min-width="90"
        ></el-table-column>
        <el-table-column prop="order_status" label="支付状态"></el-table-column>
        <el-table-column prop="teacher" label="分配班主任" min-width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.team.team_name || '-' }}</p>
            <p>
              {{ scope.row.teacher.realname || '-' }}
              {{ scope.row.teacher.department_name || '-' }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px - 250px)"
        close="calc(100vw - 50px - 25px - 250px)"
      ></m-pagination>
    </div>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import UserInfo from '@/components/BaseUserInfo/Extend.vue'
import MPagination from '@/components/MPagination/index.vue'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
export default {
  components: {
    UserInfo,
    MPagination,
    SearchPhone,
    SimpleSelect
  },
  props: {
    teamId: String,
    // 过滤条件
    filterParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      orderList: [],
      searchParams: {},
      currentPage: 1,
      totalPages: 1,
      totalElements: 0,
      tableHeight: 0,
      uid: '',
      status: '', // 支付状态
      ctime: '', // 下单时间
      statusList: [
        {
          id: '3',
          text: '已完成'
        },
        {
          id: '0,1',
          text: '未支付'
        }
      ]
    }
  },

  created() {
    this.getTeamOrderList()
  },
  mounted() {
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 100
      this.tableHeight = tableHeight + ''
    })
  },
  computed: {
    // 组合search 和 filter
    mergeParams() {
      return Object.assign({}, this.filterParams || {}, this.searchParams)
    }
  },
  watch: {
    ctime(newVal, oldVal) {
      if (!newVal) {
        this.$delete(this.searchParams, 'ctime')
      } else {
        // 选择的日期当天 0点到24点
        const start = new Date(newVal)
        const end = new Date(newVal)
        end.setHours(24, 0, 0, 0)
        this.searchParams = Object.assign({}, this.searchParams, {
          ctime: { gte: start.getTime(), lte: end.getTime() }
        })
      }
    },
    mergeParams(val, oldVal) {
      console.log(val, oldVal, 'mergeParams')
      if (!oldVal) return
      this.currentPage = 1
      this.getTeamOrderList()
    }
  },
  methods: {
    // 获取班级转化的系统课订单列表
    getTeamOrderList() {
      const params = {
        // 使用trial_team_id
        trial_team_id: this.teamId
      }
      Object.assign(params, this.mergeParams)
      const page = this.currentPage
      const sort = { ctime: 'desc' }
      this.$http.TeamV2.getTrialTeamOrderList(params, page, sort).then(
        (res) => {
          console.log(res)
          if (res && res.data && res.data.OrderPage) {
            const { content, totalPages, totalElements } = res.data.OrderPage
            this.totalPages = +totalPages
            this.totalElements = +totalElements
            // 处理数据
            const list = content.map((item) => {
              item.out_trade_no =
                (item.out_trade_no && item.out_trade_no.replace('xiong', '')) ||
                '-'
              item.ctime_text =
                (item.ctime && formatData(item.ctime, 's')) || '-'
              item.paytime_text =
                (item.paymentPay &&
                  item.paymentPay.buytime &&
                  formatData(item.paymentPay.buytime, 's')) ||
                '-'
              item.team = item.team || {}
              item.teacher = item.teacher || {}
              return item
            })
            this.orderList = list
          }
        }
      )
    },

    // 手机号搜索学员，获取学员ID
    getUid(res) {
      console.log(res, 'userid')
      if (!res) {
        // delete this.searchParams.uid
        this.$delete(this.searchParams, 'uid')
      } else {
        this.searchParams = Object.assign({}, this.searchParams, res)
      }
      // this.currentPage = 1
      // this.getTeamOrderList()
    },

    // 支付状态
    getStatus(res) {
      if (!res) {
        this.$delete(this.searchParams, 'status')
      } else {
        this.searchParams = Object.assign({}, this.searchParams, {
          status: res.status.split(',')
        })
      }
    },

    // 分页
    handleSizeChange(page) {
      this.currentPage = page
      this.getTeamOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
.team-order {
  p {
    margin: 0;
  }
  &-search {
    margin: 20px;
    ::v-deep {
      .el-form-item__label {
        font-weight: normal;
        font-size: 12px;
      }
    }
  }
  // &-list {
  // }
}
</style>
