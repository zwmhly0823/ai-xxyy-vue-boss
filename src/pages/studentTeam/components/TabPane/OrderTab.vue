<template>
  <div class="orderStyle">
    <el-table
      :data="tableData"
      :header-cell-style="{
        fontSize: '12px',
        color: '#666',
        fontWeight: 'normal'
      }"
    >
      <el-table-column fixed label="购买用户" class="bugUser" width="240px">
        <template slot-scope="scope">
          <img class="bugUser-img" :src="scope.row.user.head" alt="" />
          <div class="bugUser-right">
            <div class="phone">
              {{ scope.row.user.mobile ? scope.row.user.mobile : '-' }}
            </div>
            <div class="age">
              {{ scope.row.sex }} ·
              {{ scope.row.user.birthday }}
            </div>
            <div>
              <span v-show="scope.row.user.base_painting_text">·</span>
              {{ scope.row.user.base_painting_text }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品">
        <div slot-scope="scope">
          <div class="text333">
            <div>
              {{
                scope.row.packages_name
                  ? scope.row.packages_name
                  : scope.row.product_name
                  ? scope.row.product_name
                  : '-'
              }}
            </div>
            <div>
              <span style="color: #666"
                >时长:{{
                  scope.row.packages_course_week
                    ? scope.row.packages_course_week
                    : '-'
                }}
              </span>
              <span style="color: #666"
                >级别:{{ scope.row.sup ? `S${scope.row.sup}` : '-' }}</span
              >
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="创建时间" class="logistics">
        <template slot-scope="scope">
          <div v-if="scope.row.ctime">
            <div class="text333">{{ scope.row.ctime.split(' ')[0] }}</div>
            <div class="text333">{{ scope.row.ctime.split(' ')[1] }}</div>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" class="status-style">
        <template slot-scope="scope">
          <div>
            <span class="text333">{{ scope.row.order_status }}</span>
            <span v-if="scope.row.express_status">.</span>
            <span class="text333">{{ scope.row.express_status }}</span>
          </div>
          <div v-if="scope.row.express_status">
            {{ scope.row.express_cur_time ? scope.row.express_cur_time : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="系统课信息" class="status-style" width="240px">
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.management_start_date ||
                scope.row.student_team_name ||
                scope.row.teacher_name ||
                scope.row.teacher_wx
            "
          >
            <div class="text333">
              <span
                >开课:{{
                  scope.row.management_start_date
                    ? `${scope.row.management_start_date} `
                    : '- '
                }}</span
              >

              <span
                >班级:{{
                  scope.row.student_team_name
                    ? scope.row.student_team_name
                    : '-'
                }}</span
              >
            </div>
            <div class="text333">
              <span
                >老师:{{
                  scope.row.teacher_name ? `${scope.row.teacher_name} ` : '- '
                }}
              </span>

              <span
                >微信:{{
                  scope.row.teacher_wx ? scope.row.teacher_wx : '-'
                }}</span
              >
            </div>
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
    />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import axios from '@/api/axios'
import { GetAgeByBrithday, formatData } from '@/utils/index'

import MPagination from '@/components/MPagination/index.vue'

export default {
  components: {
    MPagination
  },
  props: {
    // 班级传参
    classId: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      // 学员列表
      tableData: [],
      // 用户状态列表
      statusList: []
    }
  },
  created() {},
  watch: {
    classId(value) {
      this.currentPage = 1
      if (value.classId) {
        this.studentsList()
      } else {
        this.tableData = []
      }
    }
  },
  methods: {
    // 学员列表
    studentsList() {
      const queryParams = `{"bool":{"must":[{"term":{"team_id":${this.classId.classId.id}}}]}}`
      axios
        .post('/graphql/order', {
          query: `{
            teamUserOrderPage(query: ${JSON.stringify(queryParams)}, page: ${
            this.currentPage
          },size:20) {
              first
              last
              number
              size
              totalPages
              totalElements
              content {
                id
                product_name
                sup
                packages_course_week
                ctime
                status
                packages_id
                order_status
                packages_name
                express_status
                express_cur_time
                teacher_wx
                teacher_name
                student_team_name
                management_start_date
                user {
                  id
                  mobile
                  username
                  nickname
                  head
                  sex
                  birthday
                  base_painting_text
                }
              }
            }
          }`
        })
        .then((res) => {
          this.totalPages = res.data.teamUserOrderPage.totalPages * 1
          this.totalElements = +res.data.teamUserOrderPage.totalElements
          const _data = res.data.teamUserOrderPage.content
          _data.forEach((ele) => {
            // 性别 0/默认 1/男 2/女  3/保密
            const sex = ele.user.sex
            switch (sex) {
              case '1': {
                ele.sex = '男'
                break
              }
              case '2': {
                ele.sex = '女'
                break
              }
              case '3': {
                ele.sex = '保密'
                break
              }
              default:
                ele.sex = '-'
                break
            }
            // 年龄转换
            ele.user.birthday !== '0'
              ? (ele.user.birthday = GetAgeByBrithday(ele.user.birthday))
              : (ele.user.birthday = '-')

            ele.ctime = formatData(ele.ctime, 's')
            ele.express_cur_time = formatData(ele.express_cur_time, 's')
            ele.management_start_date = ele.management_start_date
              ? dayjs
                  .unix(Number(ele.management_start_date) / 1000)
                  .format('MMDD')
              : ''
          })
          this.tableData = _data
          console.log(this.tableData)
        })
    },
    // 点击分页
    handleSizeChange(val) {
      console.log(val)

      this.currentPage = val
      this.studentsList()
      const dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
    }
  }
}
</script>
<style scoped lang="scss">
// 基本信息
.bugUser {
  &-img {
    width: 50px;
    height: 50px;
    float: left;
    text-align: center;
    border: 1px solid #f2f2f2;
    margin: 0 10px 0 0;
  }
  &-right {
    float: left;
    width: 140px;
    color: #333333;
    .age {
      color: #666;
    }
    .wechatnote {
      span {
        color: #606266;
      }
    }
  }
}
// 上课信息
.haveclass {
  &-box {
    width: 140px;
    .haveclass-content {
      color: #333333;
      float: left;
      margin: 0 5px 0 0;
      span {
        color: #2461b9;
      }
    }
  }
}
//关联物流
.logistics {
  &-num {
    color: #2461b9;
  }
}
.block {
  margin-top: 20px;
  text-align: center;
}
.text333 {
  color: #333333 !important;
}
</style>
<style lang="scss">
.orderStyle {
  .el-table_7_column_25 {
    .cell {
      margin-left: 15px !important;
    }
  }
  .el-table thead {
    color: #666666;
    font-weight: normal;
  }
  .hover-row {
    background: #ebebeb !important;
  }
  .el-table td {
    border-bottom: 1px solid #ededed;
  }
}
</style>
