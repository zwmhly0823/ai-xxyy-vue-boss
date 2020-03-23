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
      <el-table-column fixed label="购买用户" class="bugUser" width="280px">
        <template slot-scope="scope">
          <img class="bugUser-img" :src="scope.row.head" alt="" />
          <div class="bugUser-right">
            <div class="phone">{{ scope.row.mobile }}</div>
            <div class="age">
              {{ scope.row.sex }} · {{ scope.row.birthday }}
              <span v-show="scope.row.base_painting_text">·</span>
              {{ scope.row.base_painting_text }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品" class="haveclass">
        <div slot-scope="scope" class="haveclass-box">
          <div class="haveclass-content">
            登录:
            <span>{{ scope.row.statistics.login }}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="创建时间" class="logistics">
        <template slot-scope="scope">
          <div class="text333">{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" class="status-style">
        <template slot-scope="scope">
          <div class="text333">{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column label="系统课信息" class="status-style">
        <template slot-scope="scope">
          <div class="text333">{{ scope.row.status }}</div>
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
import axios from '@/api/axios'
import { GetAgeByBrithday } from '@/utils/menuItems'
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
      axios
        .post('/graphql/team', {
          query: `{
          teamUserListPage(type: ${this.classId.type}, team_id: "${this.classId.classId.id}",page:${this.currentPage}) {
            empty
            first
            last
            number
            size
            numberOfElements
            totalElements
            totalPages
            content {
              id
              ctime
              birthday
              nickname
              username
              country
              head
              send_id
              channel
              status
              subscribe
              sex
              type
              weixin_openid
              user_num
              base_painting
              base_painting_text
              team_id
              mobile
              statistics {
                login
                complete_course
                join_course
                course_task
                comment
                listen_comment
              }
              wechat_status {
                added_group
                added_wechat
              }
              express {
                total
                status
              }
            }
          }
        }`
        })
        // .post('/graphql/teamUserOrderPage', {
        //   query: `{
        //     teamUserOrderPage(team_id: "${this.classId.classId.id}", team_type: ${this.classId.type}, query:""){
        //       totalPages
        //       totalElements
        //       content{
        //         id
        //         uid
        //         packages_name
        //         user{
        //           nickname
        //           username
        //           mobile
        //           sex
        //           base_painting_text
        //         }
        //       }
        //     }
        //   `
        // })
        .then((res) => {
          this.totalPages = res.data.teamUserListPage.totalPages * 1
          this.totalElements = +res.data.teamUserListPage.totalElements
          const _data = res.data.teamUserListPage.content
          _data.forEach((ele) => {
            // 性别 0/默认 1/男 2/女  3/保密
            const sex = ele.sex
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
            ele.birthday !== '0'
              ? (ele.birthday = GetAgeByBrithday(ele.birthday))
              : (ele.birthday = '-')
          })
          this.tableData = _data
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
