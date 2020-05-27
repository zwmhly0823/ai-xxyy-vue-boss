<template>
  <div class="dataStyle">
    <div class="search-section">
      <m-search
        class="search-box"
        @search="handleSearch"
        phone="uid"
        onlyPhone="1"
        phoneTip="手机号/微信昵称 查询"
        :teamType="
          `${classId.classId && +classId.classId.team_type === 0 ? '0' : '1'}`
        "
        :teamId="classId.classId && classId.classId.id"
      />
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="headerStyle"
      @selection-change="handleSelectionChange"
      class="students-box"
    >
      <!-- 全选按钮 -->
      <el-table-column type="selection" width="40px"></el-table-column>
      <!-- 更多按钮 -->
      <el-table-column width="20px">
        <template slot="header" slot-scope="scope">
          <el-Popover popper-class="batch-btn" trigger="hover">
            <!-- 标题气泡内容 -->
            <div size="mini" type="text" @click="batchBtn">
              批量发放优惠券
            </div>
            <!-- 标题点击...图片 -->
            <div
              @click="headerPoint(scope.$index, scope)"
              v-show="moreTitle"
              slot="reference"
            >
              <img src="../../../../assets/images/point.png" />
            </div>
          </el-Popover>
        </template>
        <template slot-scope="scope">
          <el-Popover popper-class="batch-btn" trigger="hover">
            <!-- 气泡内容 -->
            <div size="mini" type="text" @click="batchBtn">
              <span v-show="moreTitle === true">批量发放优惠券</span>
              <span v-show="moreTitle === false">发放优惠券</span>
            </div>
            <!-- 点击...图片 -->
            <div
              @mouseenter="handleEdit(scope.$index, scope.row)"
              slot="reference"
            >
              <img src="../../../../assets/images/point.png" />
            </div>
          </el-Popover>
        </template>
      </el-table-column>
      <!-- 弹窗 -->
      <coupon-popover
        ref="couponPopover"
        :couponData="couponData"
        :selectUserId="selectUserId"
      />
      <el-table-column label="基本信息" class="information" width="300px">
        <template slot-scope="scope">
          <img
            class="information-img"
            :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
            alt=""
          />
          <div class="information-right">
            <div class="phone">{{ scope.row.mobile }}</div>
            <div class="age">
              {{ scope.row.sex }} · {{ scope.row.birthday }}
              <span v-show="scope.row.base_painting_text">·</span>
              {{ scope.row.base_painting_text }}
            </div>
            <div class="age">
              体验课订单来源:
              <span>{{ scope.row.pay_channel_outer_name }}</span>
            </div>
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
import { mapGetters } from 'vuex'
import axios from '@/api/axiosConfig'
import { GetAgeByBrithday } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
import CouponPopover from './components/couponPopover'
import MSearch from '@/components/MSearch/index.vue'

export default {
  components: {
    MPagination,
    CouponPopover,
    MSearch
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
      visible: false,
      popoverindex: 0,
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      // 学员列表
      tableData: [],
      // 用户状态列表
      statusList: [],
      tableDataEmpty: true,
      // 标题更多按钮显示
      moreTitle: false,
      // 优惠卷接口数据
      couponData: [],
      // 选择按钮用户id
      selectUserId: [],
      // 搜索
      search: '',
      // 请求接口参数
      queryData: '',
      searchUid: ''
    }
  },
  computed: {
    ...mapGetters(['team']),
    searchUser() {
      return this.team.userByPhone
    }
  },
  created() {
    // 优惠卷列表接口

    this.couponList()
  },
  watch: {
    searchUser(val) {
      console.log(val, '--------------team----------')
      this.search = ''
      if (val && val.tid) {
        // 根据手机号获取uid
        const q = `{"mobile": ${val.phone}}`
        this.$http.User.getUserInfo(q).then((res) => {
          this.searchUid = (res.data.User && res.data.User.id) || ''
          this.search = `"${this.searchUid}"`
        })
        this.studentsList()
      }
    },
    classId(value) {
      if (!value) return
      this.scrollTop()
      this.currentPage = 1
      if (value.classId) {
        this.tableDataEmpty = true
        this.studentsList()
        this.getstatusList()
      } else {
        this.tableDataEmpty = false
        this.tableData = []
      }
    }
  },
  methods: {
    // 搜索
    handleSearch(res) {
      console.log(res, '搜所')
      if (res.length === 0) {
        this.search = ''
        this.studentsList()
      } else {
        this.search = `"${res[0].term.uid}"`
        this.studentsList()
      }
    },
    // 学员列表
    studentsList() {
      if (this.search) {
        this.queryData = `type: ${this.classId.type}, team_id: "${this.classId.classId.id}",page:${this.currentPage},id:${this.search}`
      } else {
        this.queryData = `type: ${this.classId.type}, team_id: "${this.classId.classId.id}",page:${this.currentPage}`
      }
      axios
        .post('/graphql/team', {
          query: `{
          teamUserListPage(${this.queryData}) {
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
              pay_channel_outer_name
            }
          }
        }`
        })
        .then((res) => {
          console.log(res)
          if (!res.data.teamUserListPage) return
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
            } else if (status === 6) {
              ele.express.status = '最后一次待审核'
            }
            // 状态匹配
            this.statusList.forEach((value) => {
              if (value.id === ele.status) {
                ele.status = value.nameZh
              }
            })
          })
          if (this.tableDataEmpty) {
            this.tableData = _data
          } else {
            this.tableData = []
          }
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
            ? res.data.userFollowStateList
            : []
        })
    },
    // 优惠卷列表接口
    couponList() {
      this.$http.Team.getAllCoupons(0).then((res) => {
        this.couponData = (res.payload && res.payload.content) || []
      })
    },
    // 选择按钮
    handleSelectionChange(val, index) {
      this.selectUserId = []
      if (val.length > 1) {
        this.moreTitle = true
      } else {
        this.moreTitle = false
      }
      val.forEach((data) => {
        this.selectUserId.push(data.id)
      })
    },
    // 表头优惠卷操作
    headerPoint(index, scope) {
      console.log(index, scope)
    },
    // 表格优惠卷操作
    handleEdit(index, row) {
      // 当没有点击选择时点击发放优惠卷气泡
      if (this.moreTitle === false) {
        this.selectUserId = []
        this.selectUserId.push(row.id)
      }
    },
    // 点击批量发放优惠卷
    batchBtn() {
      this.$refs.couponPopover.issueCoupons = true
      this.$refs.couponPopover.couponsTime = ''
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
    // width: 140px;
    color: #333333;
    line-height: 20px;
    .age {
      color: #666;
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
.batch-btn {
  line-height: 10px;
  min-width: 110px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.dataStyle {
  .el-table_1_column_2 {
    cursor: pointer;
    font-size: 19px !important;
  }
  .el-form-item {
    float: right;
  }
}
.search-section {
  display: flex;
  align-items: center;
}
.search-box {
  display: flex;
  border: 0;
  margin-top: 10px;
}
</style>
