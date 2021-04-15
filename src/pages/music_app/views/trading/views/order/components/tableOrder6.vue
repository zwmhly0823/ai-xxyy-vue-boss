<!--
  体验课 topic= '4'
-->
<template>
  <div class="title-box">
    <el-table :data="orderList" v-loading="loading">
      <el-table-column label="用户信息" prop="user" min-width="180" fixed>
        <template slot-scope="scope">
          <user :user="scope.row.user" />
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
      <el-table-column label="购课方式" min-width="160">
        <template slot-scope="scope">
          <p>
            {{scope.row.exchange_type_text}}
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
          <p>
            {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
            <span
              v-if="trialTeam[scope.row.id]"
              :class="{ 'primary-text': trialTeam[scope.row.id] }"
              @click="
                openDetail(
                  trialTeam[scope.row.id] && trialTeam[scope.row.id].id
                )
              "
            >
              （{{ trialTeam[scope.row.id].team_name }}）
            </span>
            <span v-else>-</span>
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
        </template>
      </el-table-column>
      <el-table-column label="订单状态" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.order_status ? scope.row.order_status : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="订单来源" min-width="100">
        <template slot-scope="scope">
          <p>
            {{ scope.row.channel ? scope.row.channel.channel_outer_name : '-' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="兑换码标题·兑换码" min-width="220">
        <template slot-scope="scope">
          <p>
            {{scope.row.exchange_code_log && scope.row.exchange_code_log.library.title ? scope.row.exchange_code_log.library.title : '-'}}
          </p>
          <p>
            {{
              scope.row.exchange_code ? scope.row.exchange_code : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间·订单号" min-width="220">
        <template slot-scope="scope">
          <p>
            {{ scope.row.buytime ? scope.row.buytime : '-' }}
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
import _ from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
import { formatData, isToss, deepClone, openBrowserTab } from '@/utils/index.js'
import ExpressDetail from '../../components/expressDetail'
import User from '../../components/User.vue'
export default {
  components: {
    MPagination,
    ExpressDetail,
    User,
  },
  props: {
    // 商品主题
    topic: {
      type: String,
      default: '',
    },
    // 支付状态
    status: {
      type: String,
      default: '',
    },
    search: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
 data() {
    return {
      loading: false,
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
      departmentObj: {}, // 组织机构 obj
      orderStatisticsResult: [], // 统计结果
      trialTeam: {}, // 学员的体验课班级名称
      trialTeamUid: {},
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
      this.getOrderList()
    },
  },
  methods: {
    // 老师权限
    getTeacherPermission() {
      this.$http.Permission.getAllTeacherByRole({
        teacherId: this.teacherId,
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
    // 求和方法 sum 支持直接传对象，所以统计接口传参作修改，和list参数一致，statisticsQuery 不用再作特殊处理。05-25 YangJiyong
    async getOrderList(page = this.currentPage, status) {
      this.loading = true
      // const statisticsQuery = []
      const queryObj = {}
      // TOSS
      if (this.teacherId) {
        Object.assign(queryObj, {
          last_teacher_id:
            this.teacherGroup.length > 0 ? this.teacherGroup : [this.teacherId],
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

      /**
       * this.topic
       * 体验课(4),系统课(5)去 p_packages_topic表找relation_id
       */
      if (this.topic === '13') {
        // 如果选择了筛选单双周体验课类型，则不需要packages_id
        if (!Object.keys(queryObj).includes('packages_id'))
          Object.assign(queryObj, { topic_id: this.topic })

        // 如果有推荐人搜索条件
        if (
          queryObj.is_first_order_send_id &&
          queryObj.is_first_order_send_id === '0'
        ) {
          Object.assign(queryObj, {
            first_order_send_id: '0',
          })
        }
        if (
          queryObj.is_first_order_send_id &&
          queryObj.is_first_order_send_id === '1' &&
          !queryObj.first_order_send_id
        ) {
          Object.assign(queryObj, {
            first_order_send_id: { gt: '0' },
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
        console.log(statisticsQuery, '11111', this.teacherId)
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
      this.$http.Order.orderPage(`${JSON.stringify(queryObj)}`, page)
        .then((res) => {
          if (!res.data.OrderPage) {
            this.totalElements = 0
            this.currentPage = 1
            this.orderList = []
            return
          }
          if (this.topic === '13') {
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
            // 支付时间
            item.buytime = formatData(item.buytime, 's')
          })
          this.orderList = _data
          if (userIds.length > 0) this.getUserTrialTeam(userIds)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
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
    },
  },
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
