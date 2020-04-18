<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-14 16:36:27
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-14 16:36:27
 * @Description: 统计区域
 -->

<template>
  <div class="order-call">
    <article class="top-box">
      <el-row :gutter="20" type="flex" justify="center">
        <!-- 订单总计 -->
        <el-col :span="5">
          <div class="grid-content bg-purple total-order">
            <div class="oride-top">订单总计</div>
            <div class="oride-middle">
              <em>{{ totalOrder.count }}</em
              >笔
            </div>
            <div class="oride-bottom">
              <span>{{ totalOrder.value }}元</span>
              <span>{{ littleBear.value }}币</span>
              <span>{{ recommended.value }}宝石</span>
            </div>
          </div>
        </el-col>
        <!-- 已完成 -->
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="oride-top">已完成</div>
            <div class="oride-middle">
              <em>{{ experience.count }}</em
              >笔
            </div>
            <div class="oride-bottom">{{ experience.value }}元</div>
          </div>
        </el-col>
        <!-- 未支付 -->
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="oride-top">未支付</div>
            <div class="oride-middle">
              <em>{{ systemClass.count }}</em
              >笔
            </div>
            <div class="oride-bottom">{{ systemClass.value }}元</div>
          </div>
        </el-col>
        <!-- 退费 -->
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="oride-top">退费</div>
            <div class="oride-middle">
              <em>{{ littleBear.count }}</em
              >笔
            </div>
            <div class="oride-bottom">{{ littleBear.value }}币</div>
          </div>
        </el-col>
      </el-row>
    </article>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- tab列表 -->
    <article class="bottom-box">
      <table-order
        :topic="topic"
        :search="search"
        @statistics="getStatistics"
      />
    </article>
  </div>
</template>
<script>
import tableOrder from './tableOrder'
import axios from '@/api/axios'
import { isToss } from '@/utils/index'
export default {
  components: {
    tableOrder
  },
  props: {
    // 当前tab - 商品主题
    topic: {
      type: String,
      default: ''
    },
    // 支付状态  已完成:3, 待支付:0,1，已退费:6,7
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
      statData: [],
      // 获取teacherid
      teacherId: '',
      // 切换tab
      // tab: '3', // 默认显示 3 - 已完成
      // 搜索
      searchIn: [],
      // 体验课
      experience: {},
      // 系统课
      systemClass: { count: 0, value: 0 },
      // 小熊商城
      littleBear: { count: 0, value: 0 },
      // 推荐有礼
      recommended: { count: 0, value: 0 },
      // 订单总计
      totalOrder: { count: 0, value: 0 }
    }
  },
  computed: {
    // penTotal() {
    //   return (
    //     this.experience.count +
    //     this.systemClass.count +
    //     this.littleBear.count +
    //     this.recommended.count
    //   )
    // },
    // amountTotal() {
    //   return (this.experience.value + this.systemClass.value).toFixed(2)
    // }
  },
  watch: {
    // 切换tab - 商品主题
    topic(val) {
      console.log(val, 'topic')
    },

    // 切换支付状态
    // status(val) {
    //   this.tab = val
    //   this.statList()
    // },
    // 搜索
    search(val) {
      this.searchIn = val
      this.statList()
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    this.statList()
  },
  methods: {
    // 获取订单统计
    getStatistics(res) {
      console.log(res)
    },

    statList() {
      const must = []
      if (this.teacherId) {
        must.push(`{ "term": { "teacher_id": ${this.teacherId} } }`)
      }

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
            orderStatistics(query: ${JSON.stringify(queryStr)}) {
              type
              info {
                count
                desc
                value
              }
            }
        }`
        })
        .then((res) => {
          const _data = res.data.orderStatistics
          console.log(_data, '_data')
          this.experience = { count: 0, value: 0 }
          this.systemClass = { count: 0, value: 0 }
          this.littleBear = { count: 0, value: 0 }
          this.recommended = { count: 0, value: 0 }
          this.totalOrder = { count: 0, value: 0 }
          // if (_data.length !== 0) {
          _data.forEach((val) => {
            if (val.type === 'bear') {
              // 小熊商城
              this.littleBear = val.info
            } else if (val.type === 'gem') {
              // 推荐有礼
              this.recommended = val.info
            } else if (val.type === 'experience') {
              // 体验课
              this.experience = val.info
            } else if (val.type === 'system') {
              // 系统课
              this.systemClass = val.info
            } else if (val.type === 'total_order') {
              this.totalOrder = val.info
            }
          })
          // }

          this.statData = res.data.orderStatistics
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'number_font';
  src: url('~@/assets/fonts/TG-TYPE-Bold.otf');
} //引入本地字体数字文件
.top-box {
  width: 100%;
  height: 100%;
  .grid-content {
    cursor: pointer;
  }
  .oride-top {
    font-size: 12px;
    text-align: center;
    padding: 10px 0;
    color: #666666;
  }
  .oride-middle {
    font-family: 'number_font';
    font-size: 14px;
    color: #4d4d4d;
    text-align: center;
    padding: 10px 0;
    em {
      margin-right: 5px;
      font-size: 24px;
      font-style: normal;
      color: #409eff;
    }
  }
  .oride-bottom {
    font-family: 'number_font';
    color: #666666;
    font-size: 12px;
    text-align: center;
    padding: 10px 0;
  }
}
// .bottom-box {
//   margin: 20px 0 0 0;
// }
.el-divider--horizontal {
  margin: 0 !important;
}
</style>
<style lang="scss">
.order-call {
  .el-row {
    padding: 20px 0 20px 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #f5f6f7;
  }
  .bg-purple {
    background: #f5f6f7;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
