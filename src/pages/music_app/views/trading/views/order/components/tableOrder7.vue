<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-11 21:50:19
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-11 21:50:19
 * @Description: 活动订单列表
 * regtype, 4-宝石兑换（推荐有礼），5-积分兑换（小熊商城），6-赠送（邀请有奖）
 -->
<template>
  <div class="title-box">
    <el-table :data="orderList" v-loading="loading">
      <el-table-column label="用户信息" min-width="120">
        <template slot-scope="scope">
          <user :user="scope.row.user" />
        </template>
      </el-table-column>
      <el-table-column label="归属地" prop="QCellCore" min-width="120">
        <template slot-scope="scope">
          <p>
            {{ scope.row.user ? scope.row.user.mobile_province || '-' : '-' }} ·
            {{ scope.row.user ? scope.row.user.mobile_city || '-' : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" min-width="140">
        <template slot-scope="scope">
          <p>
            {{ scope.row.regtype_text || '-' }}
          </p>
          <p></p>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="260">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.product_type
                ? scope.row.product_type || '-'
                : scope.row.product_type || '-'
            }}
          </p>
          <!-- 人民币 ， 宝石，小熊币 -->
          <p>
            {{ scope.row.currency ? scope.row.currency : '人民币 ' }}
            {{
              scope.row.instrument_order_total_amount
                ? scope.row.instrument_order_total_amount
                : scope.row.regtype === 2
                ? ''
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="下单时间·订单号" min-width="180">
        <template slot-scope="scope">
          <p>
            {{ scope.row.ctime ? scope.row.ctime : '-' }}
          </p>
          <p>
            {{
              scope.row.out_trade_no
                ? scope.row.out_trade_no.replace('xiong', '')
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="80">
        <template slot-scope="scope">{{
          scope.row.status && scope.row.status == 3 ? '已完成' : '待支付'
        }}</template>
      </el-table-column>
    </el-table>
    <div v-if="orderList.length === 0" class="noData">暂无数据</div>
    <div class="drawer-body">
      <express-detail :order_id="order_id" ref="order_id" />
    </div>
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      show-pager
      open="calc(100vw - 170px - 25px)"
      close="calc(100vw - 50px - 25px)"
    ></m-pagination>
  </div>
</template>

<script>
// import _ from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
import { formatData, isToss, deepClone } from '@/utils/index.js'
import ExpressDetail from '../../components/expressDetail'
import User from '../../components/User.vue'
export default {
  props: {
    // 商品主题
    topic: {
      type: String,
      default: '',
    },
    // 支付状态
    status: {
      type: String,
      default: ' ',
    },
    search: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      loading: false,
      // 给物流详情组件传递的订单id
      order_id: '',
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      // 订单列表
      orderList: [],
      // 获取teacherid
      teacherId: '',
      // 当前老师下属老师ID
      teacherGroup: [],
      regtype: ['10'],
      // regtypeObj: {
      //   '4': '推荐有礼',
      //   '5': '小熊商城',
      //   '6': '邀请有奖'
      // },
      // 搜索
      searchIn: [],
    }
  },
  components: {
    MPagination,
    ExpressDetail,
    User,
  },

  watch: {
    status(status) {
      this.currentPage = 1
      this.getOrderList(this.currentPage, true)
    },
    topic(val) {
      if (val === '14') {
        this.currentPage = 1
        this.getOrderList()
      }
    },
    // 搜索
    search(val) {
      this.currentPage = 1
      this.searchIn = val
      console.log(val)
      this.getOrderList()
    },
  },

  created() {
    this.teacherId = isToss()
    if (this.teacherId) {
      this.getTeacherPermission()
    } else {
      this.getOrderList()
    }
  },

  methods: {
    // 老师权限
    getTeacherPermission() {
      this.$http.Permission.getAllTeacherByRole({
        teacherId: this.teacherId,
      }).then((res) => {
        this.teacherGroup = res || []
        // 订单列表接口
        this.getOrderList()
      })
    },
    // 订单列表
    getOrderList(page = this.currentPage, reloadStatistics = false) {
      this.loading = true
      const queryObj = {
        subject: 3,
        is_instrument_flag: 1,
      }
      // TOSS
      if (this.teacherId) {
        Object.assign(queryObj, {
          last_teacher_id:
            this.teacherGroup.length > 0 ? this.teacherGroup : [this.teacherId],
        })
      }

      // 组合搜索条件
      this.searchIn.forEach((item) => {
        const subObj =
          item && (item.term || item.terms || item.range || item.wildcard)
        Object.assign(queryObj, subObj || {})
      })

      // 支付状态
      if (this.status) {
        Object.assign(queryObj, { status: this.status.split(',') })
      }

      /*
       * 活动订单 - (小熊商城1，推荐有礼2，赠送6, 10邀请有奖-抽奖)
       * 积分兑换=小熊商城
       * 宝石兑换=推荐有礼
       * 赠送=邀请有奖
       * */
      if (this.topic === '14') {
        // 订单列表
        this.orderData(queryObj, page)

        // 不需要再次请求统计数据
        if (reloadStatistics) return

        // 获取统计数据, 不需要 status
        const statisticsQuery = deepClone(queryObj)
        delete statisticsQuery.status

        // 活动订单 - 小熊币和宝石统计
        this.orderStatistics(statisticsQuery)
      }
    },

    // 订单列表数据
    orderData(queryObj = {}, page = 1) {
      // 最终搜索条件
      this.$emit('get-params', queryObj)
      console.log(queryObj, '123123123123')
      this.$http.Order.OrderOptStatisticsPage(
        `${JSON.stringify(queryObj)}`,
        page
      )
        .then((res) => {
          if (!res.data.OrderOptStatisticsPage) {
            this.totalElements = 0
            this.currentPage = 1
            this.orderList = []
            return
          }
          this.totalElements = +res.data.OrderOptStatisticsPage.totalElements
          this.currentPage = +res.data.OrderOptStatisticsPage.number
          const _data = res.data.OrderOptStatisticsPage.content
          _data.forEach((item, index) => {
            // 下单时间格式化
            item.ctime = formatData(item.ctime, 's')
            // 交易方式
            if (item.regtype) {
              let currency = {}
              item.regtype_text = '乐器订单'
            }
          })
          this.orderList = _data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 订单统计数据
    async orderStatistics(statisticsQuery = '') {
      this.$http.Order.OrderOptSumStatistics(
        statisticsQuery,
        'instrument_order_total_amount',
        'status'
      ).then((res) => {
        const statistics = res.data.OrderOptSumStatistics || []

        console.log('statistics', statistics)
        this.$emit('statistics', statistics)
      })
      // 统计结束
    },

    // 订单关联物流详情展示
    showExpressDetail(what, total) {
      if (total > 0) {
        this.$refs.order_id.drawer = true
        this.order_id = what
      }
    },

    // 点击分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getOrderList(this.currentPage, true)

      const dom = document.getElementById('order-scroll')
      dom.querySelector('.order-wrapper').scrollTo(0, 0)
    },
  },
}
</script>

<style scoped lang="scss">
.title-box {
  padding-bottom: 30px;
}
.noData {
  text-align: center;
  padding: 20px 0 0 0;
  color: #909399;
}
.primary-color {
  color: #2a75ed;
  cursor: pointer;
}
</style>
<style lang="scss">
.el-table .cell {
  padding-left: 15px;
}
.el-table .cell p {
  margin: 0;
}
</style>
