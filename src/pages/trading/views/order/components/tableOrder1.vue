<template>
  <div class="title-box">
    <el-table :data="orderList">
      <el-table-column label="用户信息" prop="user" min-width="120" fixed>
        <template slot-scope="scope">
          <p>{{ scope.row.user ? scope.row.user.username || '-' : '-' }}</p>
          <p>{{ scope.row.user ? scope.row.user.mobile || '-' : '-' }}</p>
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
      <el-table-column label="商品信息" min-width="200">
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
      <el-table-column label="体验课班级" min-width="150">
        <template slot-scope="scope">
          <p>
            {{
              trialTeamUid[scope.row.uid]
                ? trialTeamUid[scope.row.uid].team_name
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="社群销售" min-width="150">
        <template slot-scope="scope">
          <p>{{ scope.row.salesman ? scope.row.salesman.realname : '-' }}</p>
          <p>
            {{
              scope.row.department
                ? scope.row.department.department.name || '-'
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="系统课班级" min-width="150">
        <template slot-scope="scope">
          <p>
            {{ scope.row.team ? scope.row.team.team_name : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="服务老师" min-width="120">
        <template slot-scope="scope">
          <p>
            {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
          </p>
          <p>
            {{
              scope.row.teacher_department &&
              scope.row.teacher_department.department
                ? departmentObj[scope.row.teacher_department.department.id]
                  ? departmentObj[scope.row.teacher_department.department.id]
                      .name
                  : '-'
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
      <el-table-column label="订单来源" min-width="120">
        <template slot-scope="scope">
          <p>
            {{ scope.row.channel ? scope.row.channel.channel_outer_name : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.order_status ? scope.row.order_status : '-' }}
        </template>
      </el-table-column>

      <el-table-column label="关联物流" min-width="170">
        <template slot-scope="scope">
          <p
            :class="{ 'primary-color': scope.row.express.express_total > 0 }"
            @click="
              showExpressDetail(scope.row.id, scope.row.express.express_total)
            "
          >
            {{ scope.row.express ? scope.row.express.express_total || 0 : '-' }}
          </p>
          <!-- 体验课不显示最后一次物流状态 -->
          <p>
            {{
              scope.row.express
                ? scope.row.express.last_express_status
                  ? `最后一次${scope.row.express.last_express_status}`
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
import _ from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
import { formatData, isToss } from '@/utils/index.js'
import ExpressDetail from '../../components/expressDetail'
// import axios from '@/api/axiosConfig'
export default {
  components: {
    MPagination,
    ExpressDetail
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
      // 搜索
      searchIn: [],
      statisticsQuery: [], // 统计需要 bool 表达式
      departmentObj: {}, // 组织机构 obj
      orderStatisticsResult: [], // 统计结果
      trialTeam: {}, // 学员的体验课班级名称
      trialTeamUid: {}
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
    // 订单关联物流详情展示
    showExpressDetail(what, total) {
      console.log(what, "what's that?")
      if (total > 0) {
        this.$refs.order_id.drawer = true
        this.order_id = what
      }
    },
    // 订单列表
    async getOrderList(page = this.currentPage, status) {
      const statisticsQuery = []
      const queryObj = {}
      // TOSS
      if (this.teacherId) {
        Object.assign(
          queryObj,
          this.topic === '4'
            ? { last_teacher_id: this.teacherId }
            : { pay_teacher_id: this.teacherId }
        )
        statisticsQuery.push(
          this.topic === '4'
            ? { term: { last_teacher_id: this.teacherId } }
            : { term: { pay_teacher_id: this.teacherId } }
        )
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
        const subObj =
          item && (item.term || item.terms || item.range || item.wildcard)
        Object.assign(queryObj, subObj || {})
      })

      // 支付状态
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
          const userIds = []
          _data.forEach((item, index) => {
            orderIds.push(item.id)
            userIds.push(item.uid)
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
          this.getUserTrialTeam(userIds)
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

    // 获取学员体验课班级
    // 通过Uid查询对应体验课班级，通过team_id获取
    async getUserTrialTeam(ids = []) {
      if (this.topic !== '5' && this.topic !== '4') return {}

      const query = ids.length > 0 ? JSON.stringify({ student_id: ids }) : ''
      const trial = await this.$http.Team.getTrialCourseList(query)

      const teamIds =
        trial.data.StudentTrialCourseList &&
        trial.data.StudentTrialCourseList.map((item) => item.team_id)
      const teamQuery = teamIds ? JSON.stringify({ id: teamIds }) : ''
      const team = await this.$http.Team.getStudentTeamV1(teamQuery)
      const teamArr = team.data.StudentTeamList || []
      const teamById = _.keyBy(teamArr, 'id')
      const result = {}
      const resultUid = {}
      trial.data.StudentTrialCourseList.forEach((item) => {
        result[item.order_no] = teamById[item.team_id]
        resultUid[item.student_id] = teamById[item.team_id]
      })
      this.trialTeam = result || {}
      this.trialTeamUid = resultUid || {}
      // return result
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
