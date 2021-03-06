<!--
 * @Descripttion: 班级详情 - 订单记录tab
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 18:10:00
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-12 22:22:55
-->
<template>
  <div class="user-container">
    <!-- 统计信息 -->
    <statistics
      v-if="!this.isSpecial9dot9"
      :list="statisticsList"
      @result="getStatisticData"
    />

    <!-- 搜索 -->
    <div>
      <order-page-search
        ref="search"
        :statistics-index="statisticsIndex"
        @search="getSearch"
      />
    </div>

    <!-- 学员列表 -->
    <basics-table
      ref="table"
      :table="table"
      :events="events"
      :loading="loading"
      :list="orderList"
      :get-list="getList"
      :columns="columns"
      :list-query="listQuery"
    >
      <!-- 商品信息 slot -->
      <template slot-scope="scope" slot="package">
        <p>{{ scope.row.packages_name }}</p>
        <p>人民币 {{ scope.row.amount }}</p>
      </template>

      <template slot-scope="scope" slot="teacher">
        <p>
          {{ (scope.row.teacher && scope.row.teacher.realname) || '-'
          }}{{
            scope.row.student_team_name
              ? `（${scope.row.student_team_name}）`
              : '-'
          }}
        </p>
        <p>
          {{ (scope.row.teacher && scope.row.teacher.department_name) || '-' }}
        </p>
      </template>

      <template slot-scope="scope" slot="orderStatus">
        <p v-if="scope.row.status === 2 || scope.row.status === 3">已支付</p>
        <p v-if="scope.row.status === 0 || scope.row.status === 1">待支付</p>
        <p v-if="![0, 1, 2, 3].includes(scope.row.status)">
          {{ ORDER_STATUS[scope.row.status] }}
        </p>
      </template>

      <template slot-scope="scope" slot="orderTime">
        <p>{{ scope.row.ctimeText }}</p>
        <p>{{ scope.row.out_trade_no }}</p>
      </template>

      <!-- 转化 slog -->
      <template slot-scope="scope" slot="status">
        <div class="d-flex align-center">
          <span
            :class="[
              {
                danger: scope.row.user_status_name !== '未转化'
              }
            ]"
          >
            {{ scope.row.user_status_name }}
          </span>
        </div>
      </template>
    </basics-table>
  </div>
</template>

<script>
import { openBrowserTab, formatData } from '@/utils'
import { ORDER_STATUS } from '@/utils/enums'
import { todayTimestamp, tomorrowTimestamp } from '../utils'
import BasicsTable from '@/components/BasicsTable'
// import BasicsAction from '@/components/BasicsAction'
import Statistics from '../components/Statistics'
import OrderPageSearch from '../components/Search/OrderPageSearch'
import columns from '../columns/orderPage'
export default {
  components: {
    BasicsTable,
    // BasicsAction,
    Statistics,
    OrderPageSearch
  },
  props: {
    teamInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      table: { stripe: false, border: false },
      columns,
      events: {
        // 'sort-change': this.sortChange,
      },
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500]
      },
      loading: false,
      orderList: [],
      teamId: '',
      currentUser: {}, // 当前选择用户
      currentHoverUser: null,
      currentHoverTab: '',
      statisticsParams: {},
      searchParams: {},
      sortParams: {},
      orderStatistics: {},
      ORDER_STATUS,
      statisticsIndex: null,
      isSpecial9dot9: false
    }
  },
  computed: {
    today() {
      return todayTimestamp()
    },
    tomorrow() {
      return tomorrowTimestamp()
    },
    statisticsList() {
      const { orderStatistics, formatRMB } = this
      if (orderStatistics) {
        return [
          {
            label: '全部订单',
            count: orderStatistics.all_system_order_count || 0,
            unit: '笔'
          },
          {
            label: '已支付订单',
            count: formatRMB(orderStatistics.payment_system_order_amount),
            total: orderStatistics.payment_system_order_count || 0,
            unit: '笔'
          },
          {
            label: '未支付订单',
            count: formatRMB(orderStatistics.no_payment_order_amount),
            total: orderStatistics.no_payment_order_count || 0,
            unit: '笔'
            // disabled: true
          },
          {
            label: '已退费订单',
            count: formatRMB(orderStatistics.refund_order_amount),
            total: orderStatistics.refund_order_count || 0,
            unit: '笔'
          },
          {
            label: '今日已支付订单',
            count: formatRMB(orderStatistics.today_payment_order_amount),
            total: orderStatistics.today_payment_order_count || 0,
            unit: '笔'
          },
          {
            label: '今日未支付订单',
            count: formatRMB(orderStatistics.today_no_payment_order_amount),
            total: orderStatistics.today_no_payment_order_count || 0,
            unit: '笔'
          }
        ]
      }
      return []
    }
  },
  created() {
    const { id } = this.$route.params
    this.teamId = id
    this.initLimit()
    if (id) {
      this.getList()
      this.getOrderStatistics()
    }
  },
  methods: {
    initLimit() {
      // 判断是不是9.9特价课
      if (this.teamInfo.category === 11) {
        this.isSpecial9dot9 = true
      }
    },
    /**
     * 统计区域 参数
     * 订单状态  已完成:3, 待支付:0,1，已退费:6,7
     */
    getStatisticData(index) {
      this.statisticsIndex = index
      this.$refs.search.nowDate = Date.now()
      this.searchParams = {}
      const query = {}
      switch (index) {
        // 已支付
        case 1:
          Object.assign(query, { status: { gte: 2, lte: 3 } })
          break
        // 未支付
        case 2:
          Object.assign(query, { status: { gte: 0, lte: 1 } })
          break
        // 已退费
        case 3:
          Object.assign(query, { isrefund: 1 })
          break
        // 今日已支付订单
        case 4:
          Object.assign(query, {
            status: { gte: 2, lte: 3 },
            buytime: { gte: this.today, lte: this.tomorrow }
          })
          break
        // 今日未支付订单
        case 5:
          Object.assign(query, {
            status: { gte: 0, lte: 1 },
            ctime: { gte: this.today, lte: this.tomorrow }
          })
          break
        default:
      }
      this.statisticsParams = query
      this.listQuery.currentPage = 1
      this.getList()
    },

    // 获取订单统计信息
    async getOrderStatistics() {
      const {
        data = {}
      } = await this.$http.TeamV3.getStudentTrialTeamStatisticsExtra(
        this.teamId
      )
      this.orderStatistics = data?.StudentTrialTeamStatisticsExtra || {}
    },

    getList(page = this.listQuery.currentPage, size = this.listQuery.pageSize) {
      // reset page, size
      Object.assign(this.listQuery, {
        currentPage: page,
        pageSize: size
      })

      this.loading = true
      const { statisticsParams, searchParams = {} } = this
      const params = {}
      Object.assign(
        params,
        { trial_team_id: this.teamId },
        statisticsParams,
        searchParams
      )
      this.$http.TeamV3.getStudentTrailTeamOrderPage(params, {
        page,
        size
      })
        .then((res) => {
          console.log(res, 'res.....')
          const { content = [], totalElements = 0, totalPages = 0 } =
            res?.data?.OrderPage || {}
          this.orderList = this.formatUserData(content)
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    // format data
    formatUserData(list = []) {
      const res = list.map((item) => {
        switch (+item?.user?.status) {
          case 0:
          case 1:
          case 2:
            item.user_status_name = '未转化'
            break
          case 3:
          case 4:
            item.user_status_name = '已购月课'
            break
          case 5:
          case 6:
          case 7:
            item.user_status_name = '已购年课'
            break
          case 8:
            item.user_status_name = '注销失效'
            break
          case 9:
          case 10:
            item.user_status_name = '已购季度课'
            break
          case 11:
          case 12:
            item.user_status_name = '已购半年课'
            break
        }
        item.ctimeText = formatData(item.ctime, 's')
        item.out_trade_no = item.out_trade_no.replace('xiong', '')
        return item
      })
      return res
    },

    /**
     * 操作项
     */
    handleUserDetail(uid) {
      if (!uid) {
        this.$message.error('缺少用户信息')
        return
      }
      // 新标签打开详情页
      openBrowserTab(`/music_app/#/details/${uid}`)
    },

    /**
     * 搜索
     */
    getSearch(searchParams) {
      console.log(searchParams, 'search')
      this.searchParams = searchParams
      this.listQuery.currentPage = 1
      this.getList()
    },

    // rmb format
    formatRMB(data = 0) {
      const m = (data && +data) || 0
      return m.toFixed(2) + '元'
    }
  }
  // destroyed() {
  //   clearTimeout(this.timer)
  // }
}
</script>

<style lang="scss" scoped>
@import './page.scss';
</style>
