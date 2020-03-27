<template>
  <div class="dataStyle">
    <el-table
      :data="tableData"
      :header-cell-style="headerStyle"
      class="students-box"
    >
      <el-table-column label="基本信息" class="information" width="280px">
        <template slot-scope="scope">
          <img class="information-img" :src="scope.row.head" alt="" />
          <div class="information-right">
            <div class="phone">{{ scope.row.mobile }}</div>
            <div class="age">
              {{ scope.row.sex }} · {{ scope.row.birthday }}
              <span v-show="scope.row.base_painting_text">·</span>
              {{ scope.row.base_painting_text }}
            </div>
            <!-- <div class="wechatnote">
              微信备注:<span>{{ scope.row.wechatNote }}</span>
            </div> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上课信息" class="haveclass">
        <div slot-scope="scope" class="haveclass-box">
          <div class="haveclass-content">
            打开:
            <span>{{ scope.row.statistics.open_app }}</span>
          </div>
          <div class="haveclass-content">
            参课:
            <span>{{ scope.row.statistics.join_course }}</span>
          </div>
          <div class="haveclass-content">
            完课:
            <span>{{ scope.row.statistics.complete_course }}</span>
          </div>
          <div class="haveclass-content">
            作品:
            <span>{{ scope.row.statistics.course_task }}</span>
          </div>
          <div class="haveclass-content">
            点评:
            <span>{{ scope.row.statistics.comment }}</span>
          </div>
          <div class="haveclass-content">
            听点评:
            <span>{{ scope.row.statistics.listen_comment }}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="关联物流" class="logistics">
        <template slot-scope="scope">
          <!-- <div class="logistics-num">{{ scope.row.express.total }}</div> -->
          <span class="text333"> 全部物流:</span>
          <span class="logistics-num">
            {{ scope.row.express.total }}
          </span>
          <div class="text333">{{ scope.row.express.status }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" class="status-style">
        <template slot-scope="scope">
          <div class="text333">{{ scope.row.status }}</div>
          <div class="text333">
            {{ scope.row.wechat_status.added_wechat }}
          </div>
          <div class="text333">{{ scope.row.wechat_status.added_group }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="标签" class="thelabel"></el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      open="calc(100vw - 180px - 240px - 147px - 30px)"
      close="calc(100vw - 180px - 240px - 26px - 30px)"
    ></m-pagination>
  </div>
</template>
<script>
import axios from '@/api/axios'
import { GetAgeByBrithday } from '@/utils/index'
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
      if (!value) return
      this.scrollTop()
      this.currentPage = 1
      if (value.classId) {
        this.studentsList()
        this.getstatusList()
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
                open_app
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
        .then((res) => {
          this.totalPages = res.data.teamUserListPage.totalPages * 1
          this.totalElements = +res.data.teamUserListPage.totalElements
          const _data = res.data.teamUserListPage.content
          _data.forEach((ele) => {
            // 性别 0/默认 1/男 2/女  3/保密
            const sex = ele.sex
            if (sex === '0') {
              ele.sex = '-'
            } else if (sex === '1') {
              ele.sex = '男'
            } else if (sex === '2') {
              ele.sex = '女'
            } else if (sex === '3') {
              ele.sex = '保密'
            }
            // 年龄转换
            ele.birthday !== '0'
              ? (ele.birthday = GetAgeByBrithday(ele.birthday))
              : (ele.birthday = '-')
            // 是否添加微信群  0/未加  1/已加
            const addedGroup = ele.wechat_status.added_group
            if (addedGroup === 0) {
              ele.wechat_status.added_group = '未进微信群'
            } else if (addedGroup === 1) {
              ele.wechat_status.added_group = '已进微信群'
            }
            //  是否添加好友 0/未加 1/已加
            const addedWechat = ele.wechat_status.added_wechat
            if (addedWechat === 0) {
              ele.wechat_status.added_wechat = '未加好友'
            } else if (addedWechat === 1) {
              ele.wechat_status.added_wechat = '已加好友'
            }
            //  物流状态  0/最后一次已创建 1/最后一次代发货  2/最后一次已发货  3/最后一次已经完成 4/最后一次签收失败 5/最后一次已退货
            const status = ele.express.status
            if (status === 0) {
              ele.express.status = '最后一次已创建'
            } else if (status === 1) {
              ele.express.status = '最后一次待发货'
            } else if (status === 2) {
              ele.express.status = '最后一次已发货'
            } else if (status === 3) {
              ele.express.status = '最后一次已完成'
            } else if (status === 4) {
              ele.express.status = '最后一次签收失败'
            } else if (status === 5) {
              ele.express.status = '最后一次已退货'
            }
            // 状态匹配
            this.statusList.forEach((value) => {
              if (value.id === ele.status) {
                ele.status = value.nameZh
              }
            })
          })
          this.tableData = _data
        })
    },
    // 用户状态接口
    getstatusList() {
      axios
        .post('/graphql/user', {
          query: `{
          userFollowStateList {
            id
            nameZh
            sort
          }
        }`
        })
        .then((res) => {
          this.statusList = res.data.userFollowStateList
        })
    },
    // 点击分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getstatusList()
      this.studentsList()
      this.scrollTop()
    },
    scrollTop() {
      const dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
    },
    // 表头样式
    headerStyle() {
      return 'font-size: 12px;color: #666;font-weight: normal;'
    }
  }
}
</script>
<style scoped lang="scss">
// 基本信息
.information {
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

.text333 {
  color: #333333 !important;
}
</style>
<style lang="scss">
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
</style>
