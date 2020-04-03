<template>
  <div class="title-box">
    <el-table style="width: 100%">
      <el-table-column label="用户信息" min-width="100%"></el-table-column>
      <el-table-column label="商品信息" min-width="100%"></el-table-column>
      <el-table-column label="订单来源" min-width="100%"></el-table-column>
      <el-table-column label="订单状态" min-width="100%"> </el-table-column>
      <el-table-column label="关联物流" min-width="100%"> </el-table-column>
    </el-table>
    <!-- 卡片 -->
    <el-card
      class="box-card"
      shadow="never"
      v-for="(item, index) in cardData"
      :key="index"
    >
      <div slot="header" class="card-title">
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content">
              订单号:{{ item.out_trade_no ? item.out_trade_no : '-' }}
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              下单时间:{{ item.ctime ? item.ctime : '-' }}
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              支付方式:{{
                item.payment
                  ? item.payment.trade_type
                  : item.regtype
                  ? item.regtype
                  : '-'
              }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="card-content">
        <!-- 用户信息 -->
        <div class="content-details user-infor">
          {{ item.user ? item.user.mobile : '-' }}
        </div>
        <!-- 商品信息 -->
        <div class="content-details card-style1">
          <div class="card-style1-left">
            <div>
              <div>
                {{
                  item.packages_name ? item.packages_name : item.product_name
                }}
              </div>
              <div class="card-style1-num" v-show="item.sup">
                {{ item.stage ? item.stage : '-' }}期·S{{
                  item.sup ? item.sup : '-'
                }}
              </div>
            </div>
          </div>
          <div class="card-style1-right">
            <div>
              <div class="card-style1-rmb">
                {{ item.currency ? item.currency : '人民币' }}:{{
                  item.amount ? item.amount : '-'
                }}
              </div>
              <!-- <div class="sign">×<span>1</span></div> -->
            </div>
          </div>
        </div>
        <!-- 订单来源 -->
        <div class="content-details">
          <div>{{ item.channel ? item.channel.channel_outer_name : '-' }}</div>
        </div>
        <!-- 订单状态 -->
        <div class="content-details">
          <div>{{ item.order_status ? item.order_status : '-' }}</div>
        </div>
        <!-- 关联物流 -->
        <div class="content-details card-style4">
          <div>
            <div class="card-style4-num">
              {{ item.express ? item.express.total || 0 : '-' }}
            </div>
            <div>
              {{
                item.express
                  ? item.express.express_status_text
                    ? `最后一次${item.express.express_status_text}`
                    : '-'
                  : '-'
              }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div v-if="cardData.length === 0" class="noData">暂无数据</div>
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      show-pager
      open="calc(100vw - 170px - 24px)"
      close="calc(100vw - 50px - 24px)"
    ></m-pagination>
  </div>
</template>
<script>
import MPagination from '@/components/MPagination/index.vue'
import axios from '@/api/axios'
import { timestamp, isToss } from '@/utils/index.js'
export default {
  components: {
    MPagination
  },
  props: {
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
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      // 订单列表
      cardData: [],
      // 获取teacherid
      teacherStor: '',
      // 搜索
      searchIn: [],
      // 切换tab
      tab: '3', // 默认显示 3 - 已完成
      teacherId: ''
    }
  },
  created() {
    this.teacherId = isToss()
    // 订单列表接口
    this.orderList()
  },
  watch: {
    // 切换tab
    status(val) {
      this.currentPage = 1
      this.tab = val
      this.orderList()
    },
    // 搜索
    search(val) {
      this.currentPage = 1
      this.searchIn = val
      this.orderList()
    }
  },
  methods: {
    // 订单列表
    orderList() {
      // this.teacherStor = JSON.parse(localStorage.getItem('teacher') || '{}')
      const must = []
      if (this.teacherId) {
        must.push(`{ "term": { "teacher_id": ${this.teacherId} } }`)
      }
      // TODO: 切换tab filter
      // "filter":{"bool":{"should":[{"term":{"orderstatus":1}},{"term":{"orderstatus":0}}]}}

      // 搜索 must
      const mustArr = this.searchIn.map((item) => JSON.stringify(item))
      must.push(...mustArr)
      const should = this.tab ? [`{"terms": {"status": [${this.tab}]}}`] : []
      const queryStr = `{
        "bool": {
          "must": [${must}],
          "filter": {
            "bool": {
              "should": [${should}]
            }
          }
        }
      }`

      axios
        .post('/graphql/order', {
          query: `{
          orderPage(query: ${JSON.stringify(queryStr)},page:${
            this.currentPage
          }) {
            totalElements
            totalPages
            content {
              id
              out_trade_no
              ctime
              packages_name
              sup
              stage
              regtype
              amount
              order_status
              bear_integral
              gem_integral
              product_name
              user{
                mobile
              }
              channel {
                channel_outer_name
              }
              pay_channel
              payment {
                trade_type
              }
              express{
                total
                express_status_text

              }
            }
          }
        }`
        })
        .then((res) => {
          console.log(res)
          this.totalPages = res.data.orderPage.totalPages * 1
          this.totalElements = +res.data.orderPage.totalElements
          const _data = res.data.orderPage.content
          _data.forEach((item, index) => {
            // 订单号格式化
            item.out_trade_no = item.out_trade_no.split('xiong')[1]
            // 下单时间格式化
            item.ctime = timestamp(item.ctime, 2)
            // 交易方式
            if (item.regtype) {
              let currency = {}
              if (item.regtype === 4) {
                item.regtype = '宝石兑换'
                currency = { currency: '宝石' }
                Object.assign(item, currency)
                item.amount = item.gem_integral
              } else if (item.regtype === 5) {
                item.regtype = '小熊币兑换'
                currency = { currency: '小熊币' }
                Object.assign(item, currency)
                item.amount = item.bear_integral
              }
            }
            // 支付方式
            if (item.payment) {
              const tradeType = item.payment.trade_type
              if (tradeType === 'WAP') {
                item.payment.trade_type = '支付宝'
              } else if (tradeType === 'APP') {
                item.payment.trade_type = 'APP微信'
              } else if (tradeType === 'MWEB') {
                item.payment.trade_type = 'WEB微信'
              } else if (tradeType === 'JSAPI') {
                item.payment.trade_type = '微信内部'
              } else if (tradeType) {
                item.payment.trade_type = tradeType
              } else {
                item.payment.trade_type = '-'
              }
            }
          })
          this.cardData = _data
          console.log(this.cardData, 'this.cardData')
        })
    },
    // 点击分页
    handleSizeChange(val) {
      this.currentPage = val
      this.orderList()

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
.box-card {
  // 卡片标题
  .card-title {
    font-size: 14px;
    color: #666;
    .grid-content {
      font-family: 'number_font';
    }
  }
  // 卡片内容
  .card-content {
    font-size: 14px;
    color: #000;
    .content-details {
      width: 20%;
      height: 80px;
      padding: 0 10px;
      float: left;
      display: flex;
      align-items: center;
    }
    .user-infor {
      font-family: 'number_font';
    }
    .card-style1 {
      padding-left: 0 !important;
      &-left {
        height: 100%;
        width: 50%;
        float: left;
        display: flex;
        align-items: center;
      }
      &-right {
        height: 100%;
        width: 50%;
        float: left;
        display: flex;
        align-items: center;
        .card-style1-rmb {
          font-family: 'number_font';
        }
        .sign {
          float: right;
          span {
            font-family: 'number_font';
          }
        }
      }
    }
    .card-style4 {
      padding-right: 0 !important;
      .card-style4-num {
        font-family: 'number_font';
        color: #409eff;
      }
    }
  }
}
.noData {
  text-align: center;
  padding: 20px 0 0 0;
  color: #909399;
}
</style>
<style lang="scss">
.title-box {
  padding: 0 10px 30px 10px;
  .el-table::before {
    height: 0px;
  }
  .el-table {
    font-size: 12px;
  }
  .el-table td,
  .el-table th.is-leaf {
    border: none;
  }
  .el-table__empty-block {
    display: none;
  }
  .el-card__body {
    padding: 0 0 10px 10px;
  }
  .el-card {
    border: 1px solid #dcdfe6;
    margin: 0 0 10px 0;
  }
  .el-card__header {
    padding: 10px;
    background: #f5f7fa;
  }
  // 卡片表头
  .el-row {
    padding: 0 !important;
  }
}
</style>
