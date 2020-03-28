<template>
  <div class="order-call">
    <article class="top-box">
      <el-row :gutter="20">
        <!-- 订单总计 -->
        <el-col :span="6">
          <div class="grid-content bg-purple total-order">
            <div class="oride-top">订单总计</div>
            <div class="oride-middle">{{ penTotal }}笔</div>
            <div class="oride-bottom">
              <span>{{ amountTotal }}元</span>
              <span>{{ littleBear.value }}币</span>
              <span>{{ recommended.value }}宝石</span>
            </div>
          </div>
        </el-col>
        <!-- 体验课 -->
        <el-col :span="4">
          <div class="grid-content bg-purple experience-order">
            <div class="oride-top">体验课</div>
            <div class="oride-middle">{{ experience.count }}笔</div>
            <div class="oride-bottom">{{ experience.value }}元</div>
          </div>
        </el-col>
        <!-- 系统课 -->
        <el-col :span="4">
          <div class="grid-content bg-purple system-order">
            <div class="oride-top">系统课</div>
            <div class="oride-middle">{{ systemClass.count }}笔</div>
            <div class="oride-bottom">{{ systemClass.value }}元</div>
          </div>
        </el-col>
        <!-- 小熊商城 -->
        <el-col :span="4">
          <div class="grid-content bg-purple bear-order">
            <div class="oride-top">小熊商城</div>
            <div class="oride-middle">{{ littleBear.count }}笔</div>
            <div class="oride-bottom">{{ littleBear.value }}币</div>
          </div>
        </el-col>
        <!-- 推荐有礼 -->
        <el-col :span="4">
          <div class="grid-content bg-purple recommended-order">
            <div class="oride-top">推荐有礼</div>
            <div class="oride-middle">{{ recommended.count }}笔</div>
            <div class="oride-bottom">{{ recommended.value }}宝石</div>
          </div>
        </el-col>
      </el-row>
    </article>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- tab列表 -->
    <article class="bottom-box">
      <table-order :status="status" :search="search" />
    </article>
  </div>
</template>
<script>
import tableOrder from './tableOrder'
import axios from '@/api/axios'
export default {
  components: {
    tableOrder
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
      statData: [],
      // 获取teacherid
      teacherStor: '',
      // 切换tab
      tab: '',
      // 搜索
      searchIn: [],
      // 体验课
      experience: { count: 0, value: 0 },
      // 系统课
      systemClass: { count: 0, value: 0 },
      // 小熊商城
      littleBear: { count: 0, value: 0 },
      // 推荐有礼
      recommended: { count: 0, value: 0 }
    }
  },
  computed: {
    penTotal() {
      return (
        this.experience.count +
        this.systemClass.count +
        this.littleBear.count +
        this.recommended.count
      )
    },
    amountTotal() {
      return this.experience.value + this.systemClass.value
    }
  },
  watch: {
    // 切换tab
    status(val) {
      this.tab = val
      this.statList()
    },
    // 搜索
    search(val) {
      this.searchIn = val
      this.statList()
    }
  },
  created() {
    this.statList()
  },
  methods: {
    statList() {
      this.teacherStor = JSON.parse(localStorage.getItem('teacher') || '{}')
      const must = []
      if (this.teacherStor.id) {
        must.push(`{ term: { teacher_id: ${this.teacherStor.id} } }`)
      }
      // TODO: 切换tab filter
      // "filter":{"bool":{"should":[{"term":{"orderstatus":1}},{"term":{"orderstatus":0}}]}}

      // 搜索 must
      const mustArr = this.searchIn.map((item) => JSON.stringify(item))
      must.push(...mustArr)
      const should = this.tab ? [`{"terms": {"status": [${this.tab}]}}`] : []
      const queryStr = `{
        "bool": {
          "must": [${mustArr}],
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
              code
              value
              count
              type
              desc
            }
        }`
        })
        .then((res) => {
          const _data = res.data.orderStatistics
          _data.forEach((val) => {
            if (val.code === 1) {
              this.littleBear = val
            } else if (val.code === 2) {
              this.recommended = val
            } else if (val.code === 3) {
              this.experience = val
            } else if (val.code === 4) {
              this.systemClass = val
            }
          })
          console.log(res, 'res')
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
  // 订单总计
  .total-order {
    span {
      width: 33.3%;
      display: inline-block;
    }
    .oride-top {
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
      color: #666666;
    }
    .oride-middle {
      font-family: 'number_font';
      font-size: 24px;
      color: #4d4d4d;
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      font-family: 'number_font';
      color: #666666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
    }
  }
  // 体验课
  .experience-order {
    .oride-top {
      font-size: 12px;
      color: #666666;
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      font-family: 'number_font';
      font-size: 24px;
      color: #4d4d4d;
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      font-family: 'number_font';
      color: #666666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
    }
  }
  // 系统课
  .system-order {
    .oride-top {
      font-size: 12px;
      color: #666666;
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      font-family: 'number_font';
      font-size: 24px;
      color: #4d4d4d;
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      font-family: 'number_font';
      color: #666666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
    }
  }
  // 小熊商城
  .bear-order {
    .oride-top {
      font-size: 12px;
      color: #666666;
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      font-family: 'number_font';
      font-size: 24px;
      color: #4d4d4d;
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      font-family: 'number_font';
      color: #666666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
    }
  }
  // 推荐有礼
  .recommended-order {
    .oride-top {
      color: #666666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      font-family: 'number_font';
      font-size: 24px;
      color: #4d4d4d;
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      font-family: 'number_font';
      color: #666666;
      font-size: 12px;
      text-align: center;
      padding: 10px 0;
    }
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
