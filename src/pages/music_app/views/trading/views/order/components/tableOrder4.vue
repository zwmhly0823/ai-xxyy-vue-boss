<!--
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-07-01 11:19:27
 * @Last Modified by:   songyanan
 * @Last Modified time: 2020-07-04 17:45:00
 -->
<template>
  <div class="title-box">
    <el-table :data="orderList" v-loading="loading">
      <el-table-column label="用户信息" prop="user" min-width="180" fixed>
        <template slot-scope="scope">
          <user :user="scope.row.user" :flag="true" />
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
      <el-table-column label="商品信息" min-width="160">
        <template slot-scope="scope">
          <p>
            {{
            scope.row.packages_name
            ? scope.row.packages_name || '-'
            : scope.row.product_name || '-'
            }}
          </p>
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
      <!-- <el-table-column label="社群销售·素质课班级" min-width="220">
        <template slot-scope="scope">
          <p>
            {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
            <span
              :class="{ 'primary-text': trialTeam[scope.row.id] }"
              @click="
                openDetail(
                  trialTeam[scope.row.id] && trialTeam[scope.row.id].id
                )
              "
            >
              ({{
                trialTeam[scope.row.id]
                  ? trialTeam[scope.row.id].team_name
                  : '-'
              }})
            </span>
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
      </el-table-column>-->
      <el-table-column label="订单状态" min-width="220">
        <template slot-scope="scope">{{ scope.row.order_status ? scope.row.order_status : '-' }}</template>
      </el-table-column>
      <el-table-column label="订单来源" min-width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.channel ? scope.row.channel.channel_outer_name : '-' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="推荐人信息" min-width="160">
        <template slot-scope="scope">
          <p
            v-if="scope.row.first_send_user"
            :class="{ 'primary-text': scope.row.first_send_user }"
            @click="openUserDetail(scope.row.first_send_user.id)"
          >
            {{
            scope.row.first_send_user
            ? scope.row.first_send_user.username
            : '-'
            }}
          </p>
          <p>
            {{
            scope.row.first_send_user ? scope.row.first_send_user.mobile : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="下单时间·订单号" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.ctime ? scope.row.ctime : '-' }}</p>
          <p>
            {{
            scope.row.out_trade_no
            ? scope.row.out_trade_no.replace('xiong', '')
            : '-'
            }}
          </p>
        </template>
      </el-table-column>

      <!-- <el-table-column label="关联物流" min-width="170">
        <template slot-scope="scope">
          <p
            :class="{ 'primary-color': scope.row.express.express_total > 0 }"
            @click="
              showExpressDetail(scope.row.id, scope.row.express.express_total)
            "
          >
            {{ scope.row.express ? scope.row.express.express_total || 0 : '-' }}
          </p>
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
      </el-table-column>-->
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
import { formatData, isToss, deepClone, openBrowserTab } from '@/utils/index.js'
import ExpressDetail from '../../components/expressDetail'
import User from '../../components/User.vue'
export default {
  components: {
    MPagination,
    ExpressDetail,
    User
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
      if (this.topic === '7') {
        return [this.topic]
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
      // 当前老师下属老师ID
      teacherGroup: [],
      // 搜索
      searchIn: [],
      // statisticsQuery: [], // 统计需要 bool 表达式
      departmentObj: {}, // 组织机构 obj
      orderStatisticsResult: [], // 统计结果
      trialTeam: {}, // 学员的素质课班级名称
      trialTeamUid: {},
      loading: true
    }
  },
  created() {
    this.teacherId = isToss()
    if (this.teacherId) {
      this.getTeacherPermission()
    } else {
      this.getOrderList()
    }

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
      // const statisticsQuery = []
      const queryObj = {}

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
      if (this.topic === '7') {
        queryObj.regtype = this.topic
        // 如果有推荐人搜索条件
        if (
          queryObj.is_first_order_send_id &&
          queryObj.is_first_order_send_id === '0'
        ) {
          Object.assign(queryObj, {
            first_order_send_id: '0'
          })
        }
        if (
          queryObj.is_first_order_send_id &&
          queryObj.is_first_order_send_id === '1' &&
          !queryObj.first_order_send_id
        ) {
          Object.assign(queryObj, {
            first_order_send_id: { gt: '0' }
          })
        }
        delete queryObj.is_first_order_send_id
        this.orderData(queryObj, this.currentPage)

        const statisticsQuery = deepClone(queryObj)
        delete statisticsQuery.status
        if (
          statisticsQuery.trial_pay_channel &&
          statisticsQuery.trial_pay_channel.length <= 0
        ) {
          delete statisticsQuery.trial_pay_channel
        }
        if (
          statisticsQuery.pay_channel &&
          statisticsQuery.pay_channel.length <= 0
        ) {
          delete statisticsQuery.pay_channel
        }
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
    },

    // 订单列表数据
    async orderData(queryObj = {}, page = 1) {
      try {
        // 最终搜索条件
        this.$emit('get-params', queryObj)
        const res = await this.$http.Order.orderPage(
          `${JSON.stringify(queryObj)}`,
          page
        )
        if (!res.data.OrderPage) {
          this.totalElements = 0
          this.currentPage = 1
          this.orderList = []
          return
        }
        if (this.topic === '7') {
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
        })
        await this.getQualityClassProductDetail(orderIds, _data)
        // this.orderList = _data
        if (userIds.length > 0) this.getUserTrialTeam(userIds)
      } catch (error) {
        console.log(error)
      }
    },
    getQualityClassProductDetail(ids, data) {
      this.$http.Order.getQualityClassProductDetail(ids)
        .then((res) => {
          for (const item of data) {
            for (const _item of res.data.OrderProductList) {
              if (_item.oid === item.id) {
                item.packages_name = _item.name
              }
            }
          }
          setTimeout(() => {
            this.orderList = data
            this.loading = false
          }, 0)
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
    async getUserTrialTeam(ids = []) {
      if (this.topic !== '7') return {}

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
    },
    // 打开班级详情
    openDetail(id, row) {
      row && console.log(row)
      id && openBrowserTab(`/music_app/#/teamDetail/${id}/0`)
    },
    // 用户详情
    openUserDetail(id) {
      id && openBrowserTab(`/music_app/#/details/${id}`)
    }
  }
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
