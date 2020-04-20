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
            {{ scope.row.currency ? scope.row.currency : '人民币 ' }}
            {{
              scope.row.amount
                ? scope.row.amount
                : scope.row.regtype === 6
                ? ''
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" v-if="topic === '5'">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.regtype
                ? +scope.row.regtype === 2
                  ? '首单'
                  : +scope.row.regtype === 3
                  ? '续费'
                  : ''
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" v-if="topic === '4' || topic === '5'">
        <template slot-scope="scope">
          <p>
            {{ scope.row.channel ? scope.row.channel.channel_outer_name : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" v-if="topic !== '4' && topic !== '5'">
        <template slot-scope="scope">
          {{ scope.row.regtype_text ? scope.row.regtype_text : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{ scope.row.order_status ? scope.row.order_status : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="班级信息" v-if="topic === '4' || topic === '5'">
        <template slot-scope="scope">
          {{ scope.row.team ? scope.row.team.team_name : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="社群销售" v-if="topic === '4' || topic === '5'">
        <template slot-scope="scope">
          {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="销售组" v-if="topic === '4' || topic === '5'">
        <template slot-scope="scope">
          <p v-if="scope.row.department && scope.row.department.department">
            {{
              scope.row.department && scope.row.department.department.pid
                ? departmentObj[scope.row.department.department.pid]
                  ? departmentObj[scope.row.department.department.pid].name
                  : ''
                : ''
            }}
          </p>
          {{
            scope.row.department && scope.row.department.department
              ? departmentObj[scope.row.department.department.id]
                ? departmentObj[scope.row.department.department.id].name
                : '-'
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
  computed: {
    topicArr() {
      if (this.topic === '4' || this.topic === '5') {
        return [this.topic]
      } else if (this.topic === '1,2,6') {
        return this.topic.split(',')
      }
      return []
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
      statisticsQuery: [], // 统计需要 bool 表达式
      departmentObj: {}, // 组织机构 obj
      orderStatisticsResult: [] // 统计结果
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
    status(status) {
      console.log(status, 'status')
      this.currentPage = 1
      this.getOrderList()
    },
    // 搜索
    search(val) {
      this.currentPage = 1
      this.searchIn = val
      // this.statisticsQuery = val
      this.getOrderList()
    }
  },
  methods: {
    // 订单列表
    async getOrderList(page = this.currentPage, status) {
      const statisticsQuery = []
      const queryObj = {}
      if (this.teacherId) {
        Object.assign(queryObj, { last_teacher_id: this.teacherId })
        statisticsQuery.push({ term: { last_teacher_id: this.teacherId } })
      }

      const topicRelation = await this.$http.Product.topicRelationId(
        `${JSON.stringify({
          topic_id: this.topicArr
        })}`
      )
      let relationIds = []
      if (
        topicRelation.data.PackagesTopicList &&
        topicRelation.data.PackagesTopicList.length > 0
      )
        relationIds = topicRelation.data.PackagesTopicList.map(
          (item) => item.relation_id
        )

      // 组合搜索条件
      this.searchIn.forEach((item) => {
        const subObj = item && (item.term || item.terms || item.range)
        Object.assign(queryObj, subObj || {})
      })

      // 支持状态
      if (this.status) {
        Object.assign(queryObj, { status: this.status.split(',') })
        // statisticsQuery.push({ terms: { status: this.status.split(',') } })
      }

      /**
       * this.topic
       * 体验课(4),系统课(5)去 p_packages_topic表找relation_id
       */
      if (this.topic === '4' || this.topic === '5') {
        Object.assign(queryObj, { packages_id: relationIds })
        this.orderData(queryObj, this.currentPage)

        // 获取统计数据
        statisticsQuery.push({
          terms: { packages_id: relationIds }
        })
        statisticsQuery.push(...this.searchIn)
        console.log(statisticsQuery)

        this.$http.Order.orderStatistics(
          statisticsQuery,
          'amount',
          'status'
        ).then((res) => {
          console.log(res)
          const statistics = res.data.OrderStatistics || []
          this.$emit('statistics', statistics)
        })
        // 统计结束
      }
      /*
       * 活动订单 - (小熊商城1，推荐有礼2，赠送6)
       * 通过relation_id去o_order_product查询oid,分页
       * TODO: 先查看全部 - BOSS，TOSS再做处理
       * */
      if (this.topic === '1,2,6') {
        // && !this.teacherId
        Object.assign(queryObj, { pid: relationIds })
        delete queryObj.last_teacher_id
        const res =
          (await this.$http.Product.orderProductPage(
            `${JSON.stringify(queryObj)}`,
            page
          )) || {}
        const data = (res.data && res.data.OrderProductPage) || {
          totalElements: 0,
          content: []
        }
        // 分页
        this.totalElements = +data.totalElements
        this.currentPage = +data.number
        // this.orderList = data.content

        // TODO: 根据oid 请求o_order 表
        const oids = data.content.map((item) => item.oid)
        const oquery = { id: oids }
        this.orderData(oquery, 1)
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
          if (this.topic === '4' || this.topic === '5') {
            this.totalElements = +res.data.OrderPage.totalElements
            this.currentPage = +res.data.OrderPage.number
          }
          const _data = res.data.OrderPage.content
          const orderIds = []
          _data.forEach((item, index) => {
            orderIds.push(item.id)
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
          // this.orderExpress(orderIds)
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

    // 订单关联的物流
    // orderExpress(ids = []) {
    //   const q =
    //     ids.length > 0 ? JSON.stringify({ order_id: ['10755', '10877'] }) : ''
    //   this.$http.Express.getOderExpress(q).then((res) => {
    //     console.log(res)
    //     // const express = {}
    //     // if(res.data.ExpressPage){
    //     //   // express[]
    //     // }
    //   })
    // },

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
.title-box {
  padding-bottom: 50px;
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
.el-table .cell {
  padding-left: 15px;
}
.el-table .cell p {
  margin: 0;
}
</style>
