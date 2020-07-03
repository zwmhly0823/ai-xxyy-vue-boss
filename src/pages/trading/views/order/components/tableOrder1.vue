<!-- 系统课订单列表 topic = '5' -->
<template>
  <div class="title-box">
    <el-table :data="orderList">
      <el-table-column label="用户信息" prop="user" min-width="180" fixed>
        <template slot-scope="scope">
          <user :user="scope.row.user" :singleData="scope.row" />
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
      <el-table-column label="社群销售·体验课班级" min-width="220">
        <template slot-scope="scope">
          <!-- 续费情况 -->
          <div v-if="scope.row.regtype && scope.row.regtype !== 3">
            <p>
              {{ scope.row.salesman ? scope.row.salesman.realname : '-' }}
              <span
                v-if="trialTeamUid[scope.row.uid]"
                :class="{
                  'primary-text': trialTeamUid[scope.row.uid].team_name
                }"
                @click="
                  openDetail(trialTeamUid[scope.row.uid].id, scope.row, 0)
                "
              >
                （{{ trialTeamUid[scope.row.uid].team_name }}）
              </span>
              <span v-else>-</span>
            </p>
            <p>
              {{
                scope.row.salesman
                  ? scope.row.salesman.area_name ||
                    scope.row.salesman.department_name ||
                    scope.row.salesman.group_name
                    ? scope.row.salesman.group_name ||
                      scope.row.salesman.department_name ||
                      scope.row.salesman.area_name
                    : '-'
                  : '-'
              }}
            </p>
          </div>
          <div v-else>
            <p>-</p>
            <p>-</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="服务老师·系统课班级" min-width="220">
        <template slot-scope="scope">
          <!-- 非续费 -->
          <div v-if="scope.row.regtype !== 3">
            <p>
              {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
              <span
                :class="{ 'primary-text': scope.row.team }"
                @click="openDetail(scope.row.team.id, scope.row, 2)"
              >
                ({{ scope.row.team ? scope.row.team.team_name : '-' }})
              </span>
            </p>
            <p>
              {{
                scope.row.teacher
                  ? scope.row.teacher.area_name ||
                    scope.row.teacher.department_name ||
                    scope.row.teacher.group_name
                    ? scope.row.teacher.group_name ||
                      scope.row.teacher.department_name ||
                      scope.row.teacher.area_name
                    : '-'
                  : '-'
              }}
            </p>
          </div>
          <!-- 续费 -->
          <div v-else>
            <p>
              {{ scope.row.salesman ? scope.row.salesman.realname : '-' }}
              <span
                v-if="trialTeamUid[scope.row.uid]"
                :class="{
                  'primary-text': trialTeamUid[scope.row.uid].team_name
                }"
                @click="
                  openDetail(trialTeamUid[scope.row.uid].id, scope.row, 0)
                "
              >
                （{{ trialTeamUid[scope.row.uid].team_name }}）
              </span>
              <span v-else>-</span>
            </p>
            <p>
              {{
                scope.row.salesman
                  ? scope.row.salesman.area_name ||
                    scope.row.salesman.department_name ||
                    scope.row.salesman.group_name
                    ? scope.row.salesman.group_name ||
                      scope.row.salesman.department_name ||
                      scope.row.salesman.area_name
                    : '-'
                  : '-'
              }}
            </p>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.order_status ? scope.row.order_status : '-' }}
        </template>
      </el-table-column>

      <el-table-column label="订单来源" min-width="200">
        <template slot-scope="scope">
          <p>体验课:{{ scope.row.trial_pay_channel_text || '-' }}</p>
          <p>
            系统课:{{
              scope.row.channel ? scope.row.channel.channel_outer_name : '-'
            }}
          </p>
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
      // 当前老师下属老师ID
      teacherGroup: [],
      // 搜索
      searchIn: [],
      // statisticsQuery: [], // 统计需要 bool 表达式
      departmentObj: {}, // 组织机构 obj
      orderStatisticsResult: [], // 统计结果
      trialTeam: {}, // 学员的体验课班级名称
      trialTeamUid: {}
    }
  },
  created() {
    this.teacherId = isToss()
    if (this.teacherId) {
      this.getTeacherPermission()
    } else {
      this.getOrderList()
    }

    // this.getDepartment()
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
      // TOSS
      if (this.teacherId) {
        Object.assign(queryObj, {
          pay_teacher_id:
            this.teacherGroup.length > 0 ? this.teacherGroup : [this.teacherId]
        })
        // statisticsQuery.push({
        //   terms: {
        //     pay_teacher_id:
        //       this.teacherGroup.length > 0
        //         ? this.teacherGroup
        //         : [this.teacherId]
        //   }
        // })
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

      console.log(this.searchIn)

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

        // !!! 如果系统课类型选择 半年系统课 - packages，则packages_id = 10
        if (
          Object.keys(queryObj).includes('packages_type') &&
          +queryObj.packages_type === 3
        ) {
          Object.assign(queryObj, { packages_id: ['10'] })
          delete queryObj.packages_type
        }

        // 如果选择年系统课，把半年课去掉 10
        if (
          Object.keys(queryObj).includes('packages_type') &&
          +queryObj.packages_type === 4
        ) {
          const type = relationIds.filter((item) => item !== '10')
          queryObj.packages_id = type
        }

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

        // 获取统计数据
        // statisticsQuery.push({
        //   terms: { packages_id: relationIds }
        // })
        // statisticsQuery.push(...this.searchIn)
        // console.log(statisticsQuery)

        // 求和统计不需要传当前状态，统计全部状态的值
        const statisticsQuery = deepClone(queryObj)
        delete statisticsQuery.status

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
    orderData(queryObj = {}, page = 1) {
      // 最终搜索条件
      this.$emit('get-params', queryObj)
      // console.log(queryObj)

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
          })
          this.orderList = _data
          if (userIds.length > 0) this.getUserTrialTeam(userIds)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 获取组织机构
    // getDepartment() {
    //   this.$http.Department.teacherDepartment().then((res) => {
    //     const dpt = (res.data && res.data.TeacherDepartmentList) || []
    //     this.departmentObj = _.keyBy(dpt, 'id') || {}
    //   })
    // },

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
      console.log(this.trialTeam)
      console.log(this.trialTeamUid)

      // return result
    },

    // 点击分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getOrderList()

      const dom = document.getElementById('order-scroll')
      dom.querySelector('.order-wrapper').scrollTo(0, 0)
    },
    // /student-team/#/teamDetail/280/0
    // 打开班级详情
    openDetail(id, row, type) {
      // type 0体验课 2系统课
      row && console.log(row)
      id && openBrowserTab(`/student-team/#/teamDetail/${id}/${type}`)
    },
    // 用户详情
    openUserDetail(id) {
      id && openBrowserTab(`/users/#/details/${id}`)
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
