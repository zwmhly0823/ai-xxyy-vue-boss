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
    <el-table :data="orderList">
      <el-table-column label="用户信息" min-width="120">
        <template slot-scope="scope">
          <user :user="scope.row.user" />
        </template>
      </el-table-column>
      <el-table-column label="商品信息" min-width="140">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.packages_name
                ? scope.row.packages_name || '-'
                : scope.row.product_name || '-'
            }}
          </p>
          <p>
            {{ scope.row.currency
            }}<span v-if="+scope.row.regtype !== 6"
              >：{{ scope.row.amount }}</span
            >
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

      <el-table-column label="订单类型" min-width="140">
        <template slot-scope="scope">
          <p>
            {{ scope.row.regtype_text || '-' }}
          </p>
          <p></p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="100">
        已完成
      </el-table-column>
      <el-table-column label="关联物流" min-width="150">
        <template slot-scope="scope">
          <p
            :class="{
              'primary-color':
                scope.row.express && scope.row.express.express_total > 0
            }"
            @click="
              showExpressDetail(
                scope.row.id,
                scope.row.express ? scope.row.express.express_total : 0
              )
            "
          >
            {{ scope.row.express ? scope.row.express.express_total || 0 : '-' }}
          </p>
          <!-- 体验课不显示最后一次物流状态 -->
          <p>
            {{
              scope.row.express
                ? scope.row.express.last_express_status
                  ? `${scope.row.express.last_express_status}`
                  : '-'
                : '-'
            }}
          </p>
        </template>
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
      default: ''
    },
    // 支付状态
    status: {
      type: String,
      default: ''
    },
    search: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
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
      regtype: ['4', '5', '6'],
      // regtypeObj: {
      //   '4': '推荐有礼',
      //   '5': '小熊商城',
      //   '6': '邀请有奖'
      // },
      // 搜索
      searchIn: []
    }
  },
  components: {
    MPagination,
    ExpressDetail,
    User
  },

  watch: {
    status(status) {
      this.currentPage = 1
      this.getOrderList(this.currentPage, true)
    },
    topic(val) {
      if (val === '1,2,6') {
        this.currentPage = 1
        this.getOrderList()
      }
    },
    // 搜索
    search(val) {
      this.currentPage = 1
      this.searchIn = val
      this.getOrderList()
    }
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
        teacherId: this.teacherId
      }).then((res) => {
        this.teacherGroup = res || []
        // 订单列表接口
        this.getOrderList()
      })
    },
    // 订单列表
    getOrderList(page = this.currentPage, reloadStatistics = false) {
      const queryObj = { regtype: this.regtype }
      // TOSS
      if (this.teacherId) {
        Object.assign(queryObj, {
          last_teacher_id:
            this.teacherGroup.length > 0 ? this.teacherGroup : [this.teacherId]
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
       * 活动订单 - (小熊商城1，推荐有礼2，赠送6)
       * 积分兑换=小熊商城
       * 宝石兑换=推荐有礼
       * 赠送=邀请有奖
       * */
      if (this.topic === '1,2,6') {
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
      this.$http.Order.orderPage(`${JSON.stringify(queryObj)}`, page)
        .then((res) => {
          if (!res.data.OrderPage) {
            this.totalElements = 0
            this.currentPage = 1
            this.orderList = []
            return
          }
          this.totalElements = +res.data.OrderPage.totalElements
          this.currentPage = +res.data.OrderPage.number
          const _data = res.data.OrderPage.content
          _data.forEach((item, index) => {
            // 下单时间格式化
            item.ctime = formatData(item.ctime, 's')
            // 交易方式
            if (item.regtype) {
              let currency = {}
              if (item.regtype === 4) {
                item.regtype_text = '推荐有礼'
                currency = { currency: '宝石' }
                Object.assign(item, currency)
                item.amount = item.gem_integral
              } else if (item.regtype === 5) {
                item.regtype_text = '小熊商城'
                currency = { currency: '小熊币' }
                Object.assign(item, currency)
                item.amount = item.bear_integral
              } else if (item.regtype === 6) {
                item.regtype_text = '邀请有奖'
                currency = { currency: '赠送' }
                Object.assign(item, currency)
                item.amount = 0
              }
            }
          })
          this.orderList = _data
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 订单统计数据
    async orderStatistics(statisticsQuery = '') {
      const bearResult = await this.$http.Order.orderStatistics(
        statisticsQuery,
        'bear_integral',
        'status'
      )
      const gemResult = await this.$http.Order.orderStatistics(
        statisticsQuery,
        'gem_integral',
        'status'
      )
      // [ { code: '3', count: '37', type: 'status', value: 38600 },
      //     { code: '0', count: '2', type: 'status', value: 0 } ]
      // status: 0,1-未支付；3-已完成；'5,6,7'-退费；
      const complete = {
        count: 0, // 订单笔数
        bear: 0,
        gem: 0
      }
      const nopay = {
        count: 0,
        bear: 0,
        gem: 0
      }
      const refund = {
        count: 0,
        bear: 0,
        gem: 0
      }
      const total = {
        count: 0,
        bear: 0,
        gem: 0
      }
      const bear =
        (bearResult && bearResult.data && bearResult.data.OrderStatistics) || []
      const gem =
        (gemResult && gemResult.data && gemResult.data.OrderStatistics) || []
      bear.forEach((item) => {
        const { code, count, value } = item
        if (code === '3') {
          complete.count = +count
          complete.bear = +value
        }
        if (code === '1' || code === '0') {
          nopay.count += +count
          nopay.bear += +value
        }
        if (code === '5' || code === '6' || code === '7') {
          refund.count += +count
          refund.bear += +value
        }
      })
      gem.forEach((item) => {
        const { code, value } = item
        if (code === '3') {
          complete.gem = +value
        }
        if (code === '1' || code === '0') {
          nopay.gem += +value
        }
        if (code === '5' || code === '6' || code === '7') {
          refund.gem += +value
        }
      })

      // 总计
      const statistics = { complete, nopay, refund }
      for (const key in statistics) {
        if (Object.keys(statistics).includes(key)) {
          const item = statistics[key]
          total.count += item.count
          total.bear += item.bear
          total.gem += item.gem
        }
      }
      Object.assign(statistics, { total })
      console.log(statistics)

      this.$emit('statistics', statistics)
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
    }
  }
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'number_font';
  src: url('~@/assets/fonts/TG-TYPE-Bold.otf');
} //引入本地字体数字文件
.title-box {
  padding-bottom: 50px;
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
