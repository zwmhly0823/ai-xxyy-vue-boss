<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-27 11:42:06
-->
<template>
  <div>
    <el-table :data="logisticsTableData" style="width: 100%">
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <div>
            {{ scope.row.packages_name ? scope.row.packages_name : '-' }}
          </div>
          <div>¥{{ scope.row.amount ? scope.row.amount : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <div>{{ scope.row.order_status ? scope.row.order_status : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级信息">
        <template slot-scope="scope">
          <div>
            <div>{{ scope.row.team ? scope.row.team.team_name : '-' }}</div>
            <div>
              {{
                scope.row.team && scope.row.team.teacher_info
                  ? scope.row.team.teacher_info.realname
                  : '-'
              }}
              {{
                scope.row.team &&
                scope.row.team.teacher_info &&
                scope.row.team.teacher_info.departmentInfo
                  ? scope.row.team.teacher_info.departmentInfo.name
                  : '-'
              }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间·订单号">
        <template slot-scope="scope">
          <div>
            <div>{{ scope.row.ctime }}</div>
            <div>
              {{ scope.row.out_trade_no ? scope.row.out_trade_no : '-' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联物流">
        <template slot-scope="scope">
          <div>
            <div>
              共
              <span
                v-if="scope.row.express && scope.row.express.express_total"
                class="logistics"
                @click="
                  showExpressDetail(
                    scope.row.id,
                    scope.row.express.express_total
                  )
                "
                >{{ scope.row.express.express_total }}</span
              >
              <span v-else>0</span>
              条物流记录
            </div>
            <div>
              最后一次已{{
                scope.row.express && scope.row.express.last_express_status
                  ? scope.row.express.last_express_status
                  : '暂无物流记录'
              }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!--物流记录详情抽屉-->
    <express-detail :order_id="order_id" ref="order_id" />
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import ExpressDetail from '@/pages/trading/views/components/expressDetail'

export default {
  name: 'logistics',
  components: {
    ExpressDetail
  },
  mounted() {
    // 初始化拿数据
    setTimeout(() => {
      this.reqgetOrderPage()
    }, 1000)
  },
  data() {
    return {
      order_id: '', // 物流详情抽屉
      logisticsTableData: [], // table展示数据
      // 数据查询
      currentPage: 1, // 页码
      // 分页组件
      allDigit: 1 // 总量
    }
  },
  methods: {
    // 点击物流详情
    showExpressDetail(id, total) {
      if (total > 0) {
        this.$refs.order_id.drawer = true
        this.order_id = id
      }
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqgetOrderPage()
    },
    // 数据接口_订单·物流
    reqgetOrderPage() {
      this.$http.User.getOrderPage(
        this.$route.params.id, // studentId
        this.currentPage
      ).then((res) => {
        console.log('订单物流模块接口', res.data.OrderPage.content)
        const _data = res.data.OrderPage.content
        _data.forEach((item) => {
          item.ctime = item.ctime ? formatData(item.ctime, 's') : ''
        })
        this.allDigit = +res.data.OrderPage.totalElements
        this.logisticsTableData = _data // 赋值
      })
    }
  },
  computed: {
    hh2() {
      return 2
    }
  }
}
</script>

<style lang="scss" scoped>
.logistics {
  color: #5ea0f5;
  text-decoration: underline;
  cursor: pointer;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
