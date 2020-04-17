<template>
  <div class="title-box">
    <el-table :data="orderList">
      <el-table-column label="用户信息" prop="user">
        <template slot-scope="scope">
          <p>{{ scope.row.user ? scope.row.user.nickname || '-' : '-' }}</p>
          <p>{{ scope.row.user ? scope.row.user.mobile || '-' : '-' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="商品信息">
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
            {{ scope.row.currency ? scope.row.currency : '¥ ' }}
            {{ scope.row.amount ? scope.row.amount : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单来源">
        <template slot-scope="scope">
          <p>
            {{ scope.row.channel ? scope.row.channel.channel_outer_name : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{ scope.row.order_status ? scope.row.order_status : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="班级信息">
        <template slot-scope="scope">
          {{ scope.row.team ? scope.row.team.team_name : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="社群销售">
        <template slot-scope="scope">
          {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="销售组">
        <template slot-scope="scope">
          <p v-if="scope.row.department && scope.row.department.department.pid">
            {{
              scope.row.department
                ? departmentObj[scope.row.department.department.pid].name
                : '-'
            }}
          </p>
          {{
            scope.row.department
              ? departmentObj[scope.row.department.department.id].name
              : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="160">
        <template slot-scope="scope">
          <p>
            {{ scope.row.ctime ? scope.row.ctime : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="关联物流">
        <template slot-scope="scope">
          <p class="primary-color">
            {{ scope.row.express ? scope.row.express.total || 0 : '-' }}
          </p>
          <!-- 体验课不显示最后一次物流状态 -->
          <p>
            {{
              scope.row.express
                ? scope.row.express.express_status_text
                  ? `最后一次${scope.row.express.express_status_text}`
                  : '-'
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="orderList.length === 0" class="noData">暂无数据</div>

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
import _ from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
// import axios from '@/api/axios'
import { formatData, isToss } from '@/utils/index.js'
export default {
  components: {
    MPagination
  },
  props: {
    // 商品主题
    topic: {
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
      orderList: [],
      // 获取teacherid
      teacherId: '',
      // 搜索
      searchIn: [],
      // 切换支付状态
      status: '3', // 默认显示 3 - 已完成
      departmentObj: {} // 组织机构 obj
    }
  },
  created() {
    this.teacherId = isToss()
    // 订单列表接口
    this.getOrderList()

    this.getDepartment()
  },
  watch: {
    // 切换tab
    topic(val) {
      console.log(val, 'team_type')
      this.currentPage = 1
      this.getOrderList()
    },
    // 搜索
    search(val) {
      this.currentPage = 1
      this.searchIn = val
      this.getOrderList()
    }
  },
  methods: {
    // 订单列表
    getOrderList() {
      const queryStr = {}
      const must = []
      if (this.teacherId) {
        queryStr.teacher_id = { teacher_id: this.teacherId }
      }

      // 搜索 must
      const mustArr = this.searchIn.map((item) => JSON.stringify(item))
      must.push(...mustArr)
      // const should = this.tab ? [`{"terms": {"status": [${this.tab}]}}`] : []
      // const queryStr = `{
      //   "bool": {
      //     "must": [${must}],
      //     "filter": {
      //       "bool": {
      //         "should": [${should}]
      //       }
      //     }
      //   }
      // }`

      // 商品主题
      const topic = {
        topic_id: this.topic
      }
      Object.assign(queryStr, topic)

      this.$http.Order.orderPage(JSON.stringify(topic), this.currentPage)
        .then((res) => {
          console.log(res)
          if (!res.data.OrderPage) {
            return
          }
          this.totalElements = +res.data.OrderPage.totalElements
          const _data = res.data.OrderPage.content
          _data.forEach((item, index) => {
            // 下单时间格式化
            item.ctime = formatData(item.ctime, 's')
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
          })
          this.orderList = _data
          console.log(this.orderList, 'this.orderList')
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 获取组织机构
    getDepartment() {
      this.$http.Department.teacherDepartment().then((res) => {
        const dpt = (res.data && res.data.TeacherDepartmentList) || []
        this.departmentObj = _.keyBy(dpt, 'id') || {}
      })
    },

    // 点击分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getOrderList()

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
.primary-color {
  color: #409eff;
}
</style>
<style lang="scss">
.title-box {
  padding: 0 10px 30px 10px;
  p {
    margin: 0;
  }
  .el-table::before {
    height: 0px;
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
    background: #fafafa;
  }
  // 卡片表头
  .el-row {
    padding: 0 !important;
  }
  // .grid-centent {
  //   padding-left: 17%;
  // }
}
</style>
