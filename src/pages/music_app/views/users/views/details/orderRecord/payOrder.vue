<template>
  <div>
    <el-table
      :data="Tabledata"
      style="width: 100%"
      :header-cell-style="{ background: '#f0f9fc' }"
    >
      <el-table-column label="订单类型" width="100">
        <template slot-scope="scope">{{ scope.row.regtype_text }}</template>
      </el-table-column>
      <el-table-column label="下单时间" prop="ctime" width="160">
      </el-table-column>
      <el-table-column label="商品信息" min-width="260">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.packages_name
                ? scope.row.packages_name || '-'
                : scope.row.product_name || '-'
            }}
          </p>
          <!-- 人民币 ， 宝石，小熊币 -->
          <p>
            {{ scope.row.currency ? scope.row.currency : '人民币 ' }}
            {{
              scope.row.amount
                ? scope.row.amount
                : scope.row.regtype === 6
                ? ''
                : '-'
            }}
          </p>
          <p>
            {{
              scope.row.course_product_name
                ? scope.row.course_product_name
                : '-'
            }}
            {{
              scope.row.amount - scope.row.instrument_order_total_amount > 0 &&
              scope.row.course_product_name
                ? (scope.row.amount * 100 -
                    scope.row.instrument_order_total_amount * 100) /
                  100
                : '-'
            }}
          </p>
          <p>
            {{
              scope.row.instrument_product_name
                ? scope.row.instrument_product_name
                : '-'
            }}
            {{
              scope.row.instrument_order_total_amount
                ? scope.row.instrument_order_total_amount
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="支付信息" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.discount_amount">
            优惠券：{{
              scope.row.discount_amount
                ? scope.row.discount_amount + '元'
                : '0元'
            }}
          </div>
          <div>实际支付：{{ scope.row.amount }}元</div>
        </template>
      </el-table-column>
      <el-table-column label="订单信息" width="150">
        <template slot-scope="scope">
          <div>
            支付方式：
            {{
              scope.row.paymentPay ? scope.row.paymentPay.trade_type_text : '-'
            }}
          </div>
          <div>
            订单状态：{{
              scope.row.order_status ? scope.row.order_status : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程周数" width="120">
        <template slot-scope="scope">
          <div>
            购买周数：{{
              scope.row && scope.row.packages_course_week
                ? scope.row.packages_course_week
                : '-'
            }}周
          </div>
          <div>
            剩余周数：{{
              scope.row && scope.row.remaining_week
                ? scope.row.remaining_week
                : '-'
            }}周
          </div>
        </template>
      </el-table-column>
      <el-table-column label="来源·推荐人信息" width="150">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.channelDetail
                ? scope.row.channelDetail.channel_outer_name
                : '-'
            }}
          </div>
          <div
            v-if="scope.row.pay_channel_user_extends"
            class="primary-text"
            @click="openRecommender(scope.row.pay_channel_user_extends.u_id)"
          >
            {{ scope.row.pay_channel_user_extends.username || '-' }}·{{
              scope.row.pay_channel_user_extends.mobile || '-'
            }}
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="赠品商品信息" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.promotionsList">
            <div v-for="(item, index) in scope.row.promotionsList" :key="index">
              {{ item.gifts_name }}
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="母订单编号-订单交易流水号" width="220">
        <template slot-scope="scope">
          <div>
            <div>
              {{ scope.row.out_trade_no ? scope.row.out_trade_no : '-' }}
            </div>
            <div>
              {{
                scope.row.paymentPay ? scope.row.paymentPay.transaction_id : '-'
              }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="相关状态" width="150">
        <template slot-scope="scope">
          <div>开票状态：{{ scope.row.invoice_status_text }}</div>
          <div>退费状态：{{ scope.row.rmbRefundStatusText }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <div class="pay_order_operation">
            <div
              class="logistics"
              @click="goTrack(scope.row)"
              style="color: #0099ff"
            >
              物流追踪
            </div>
            <div
              class="logistics"
              style="color: #0099ff"
              @click="clickSee(scope.row)"
            >
              查看退费
            </div>
          </div>
          <div class="pay_order_operation">
            <!-- 体验课、特价课、主题课类型订单不显示 -->
            <div v-if="![1].includes(scope.row.regtype)">
              <template v-if="scope.row.promotions_status === 1">
                <span>赠品已申请</span>
              </template>
              <template v-else-if="scope.row.promotions_status === 0">
                <span
                  style="color: #0099ff"
                  @click="
                    scope.row.availablePromotions.length && openTeams(scope.row)
                  "
                  >申请赠品</span
                >
              </template>
            </div>
            <div
              class="logistics"
              style="color: #0099ff"
              @click="openTeam(scope.row)"
            >
              申请退款
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <see-refund :outTradeNo="outTradeNo" ref="see_refund" />
  </div>
</template>

<script>
import seeRefund from './seeRefund'
import { openBrowserTab } from '@/utils/index'
export default {
  name: 'logistics',
  components: {
    seeRefund,
  },
  props: {
    Tabledata: {},
  },
  mounted() {},
  data() {
    return {
      outTradeNo: [],
      regData: {
        0: '',
        1: '体验课',
        2: '首单',
        3: '续费',
        4: '推荐有礼', // 宝石兑换
        5: '小熊商城', // 积分兑换
        6: '邀请有奖', // 赠送
        7: '素质课',
        8: '兑换',
        9: '营销活动',
        10: '新签补差',
        11: '续费补差',
      },
    }
  },
  methods: {
    // 物流列表信息
    goTrack(val) {
      this.$emit('goTrack', val)
    },
    clickSee(e) {
      const params = {
        outTradeNo: e.out_trade_no,
      }
      this.$http.Finance.getTable(params).then((res) => {
        this.outTradeNo = res.content
        this.$refs.see_refund.handleSee()
      })
    },
    // 打开新页面
    openTeam(row) {
      openBrowserTab(
        `/music_app/#/moneyBack?cellphone=${row.user.mobile}&order_no=${row.out_trade_no}`
      )
    },
    openTeams(row) {
      openBrowserTab(
        `/music_app/#/approvalGift?mobile=${row.user.mobile}&}&id=${row.id}&uid=${row.uid}`
      )
    },
    // 推荐人
    openRecommender(uid) {
      if (!uid) return
      openBrowserTab(`/music_app/#/details/${uid}`)
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.logistics {
  cursor: pointer;
}
.pay_order_operation {
  display: flex;
  justify-content: space-between;
}
</style>
