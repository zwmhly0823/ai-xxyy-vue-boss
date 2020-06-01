<!--
 * @Descripttion: 系统课学员列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-25 15:34:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-01 18:13:18
-->
<template>
  <div class="user-list">
    <el-tabs type="border-card" v-model="teamstate">
      <el-tab-pane label="开课中" name="1"></el-tab-pane>
      <el-tab-pane label="待开课" name="0"></el-tab-pane>
      <!-- <el-tab-pane label="已结课" name="2"></el-tab-pane> -->
    </el-tabs>
    <div class="tableInner" ref="tableInner"></div>
    <!-- table -->
    <el-table
      :data="dataList"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      empty-text=" "
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column label="用户信息" min-width="270" fixed>
        <template slot-scope="scope">
          <base-user-info :user="scope.row" @handle-click="userHandle" />
        </template>
      </el-table-column>
      <el-table-column label="系统课类型" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.packagesname }}{{ scope.row.currentsuper }}</p>
          <p>
            {{ scope.row.packagescourseweek }}周 ·
            {{
              scope.row.packagescourseweek
                ? +scope.row.packagescourseweek * 2
                : 0
            }}节课
          </p>
        </template>
      </el-table-column>
      <el-table-column label="课程进度" min-width="160">
        <template slot-scope="scope">
          <p>
            {{ scope.row.currentlevel }}{{ scope.row.currentunit
            }}{{ scope.row.currentlesson }}
          </p>
          <p>第{{ scope.row.currenttotal }}节课</p>
        </template>
      </el-table-column>
      <el-table-column label="参课节数" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.noactivecount }} 节
        </template>
      </el-table-column>
      <el-table-column label="完课节数" min-width="100">
        <template slot-scope="scope"> {{ scope.row.activecount }} 节 </template>
      </el-table-column>
      <el-table-column label="作品总数" min-width="120">
        <template slot-scope="scope"> {{ scope.row.taskcount }} 幅 </template>
      </el-table-column>
      <el-table-column label="听点评数" min-width="100">
        <template slot-scope="scope"> {{ scope.row.flagcount }} 条 </template>
      </el-table-column>
      <el-table-column label="添加微信" min-width="100">
        <template slot-scope="scope">
          <handle-item-status
            type="1"
            :row="wechatStatus(scope.row)"
            @change="changeStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否进群" min-width="100">
        <template slot-scope="scope">
          <handle-item-status
            type="2"
            :row="wechatStatus(scope.row)"
            @change="changeStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否关注公众号" min-width="140">
        <template slot-scope="scope">
          <item-status type="3" :row="wechatStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="是否退费" min-width="140">
        <template slot-scope="scope">
          <p>{{ refundStatus(scope.row.isrefund) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="随材物流" min-width="200">
        <template slot-scope="scope">
          <p>共 {{ scope.row.expresscount || 0 }} 条物流信息</p>
          <p v-if="scope.row.expresscount && +scope.row.expresscount > 0">
            {{ expressStatus(scope.row.expressstatus) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="最近打开APP信息" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.devicetype || '-' }}</p>
          <p>
            {{
              scope.row.lastlogintime !== '0'
                ? formatDate(scope.row.lastlogintime)
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="归属地" min-width="140">
        <template slot-scope="scope">
          <p v-if="scope.row.mobileprovince && scope.row.mobilecity">
            {{ scope.row.mobileprovince }} · {{ scope.row.mobilecity }}
          </p>
          <p v-else-if="scope.row.mobileprovince || scope.row.mobilecity">
            {{ scope.row.mobileprovince || scope.row.mobilecity }}
          </p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="系统课班级·服务老师" min-width="180">
        <template slot-scope="scope">
          <p v-if="!scope.row.teamname || scope.row.teamname === '-'">-</p>
          <p class="btn-text " v-else @click="openTeam(scope.row)">
            {{ scope.row.teamname }}
          </p>
          <p>
            {{ scope.row.realname }}
            {{ scope.row.departmentname }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="体验课班级·销售" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.trialteamname || '-' }}</p>
          <p>
            {{ scope.row.trialrealname || '-' }}
            {{ scope.row.trialdepartmentname || '' }}
          </p>
        </template>
      </el-table-column>
    </el-table>

    <div class="empty-text" v-if="dataList.length === 0">暂无数据</div>

    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      show-pager
      open="calc(100vw - 170px - 25px)"
      close="calc(100vw - 50px - 25px)"
    ></m-pagination>

    <!-- 无地址页面修改地址弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showModifyAddress"
      width="30%"
      title="修改收货信息"
    >
      <modify-address
        @addExpress="handleModifyAddress"
        :formData="modifyFormData"
        v-if="showModifyAddress"
      />
    </el-dialog>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import BaseUserInfo from '../../components/BaseUserInfo.vue'
import ItemStatus from '../../components/ItemStatus.vue'
import HandleItemStatus from '../../components/HandleItemStatus.vue'
import ModifyAddress from '../../components/ModifyAddress.vue'
import enums from '../../components/searchData'
import { formatData, isToss, openNewTab } from '@/utils/index'
import { FOLLOW_EXPRESS_STATUS, ISREFUND } from '@/utils/enums'
export default {
  name: 'systemUsers',
  components: {
    MPagination,
    BaseUserInfo,
    HandleItemStatus,
    ItemStatus,
    ModifyAddress
  },
  props: {
    // 查询条件
    search: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    searchParams() {
      return {
        ...this.search,
        teamstate: +this.teamstate
      }
    }
  },
  data() {
    return {
      teamstate: '1', // 0 待开始；1 上课中；2 已结课
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      dataList: [],
      conversionType: enums.conversionType,
      showModifyAddress: false,
      modifyFormData: {},
      teacherIds: [],
      tableHeight: 0
    }
  },
  watch: {
    searchParams(params) {
      this.currentPage = 1
      this.getData()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        const tableHeight =
          document.body.clientHeight -
          this.$refs.tableInner.offsetTop -
          112 -
          30
        this.tableHeight = tableHeight + ''
      })
      this.teacherId = isToss()
      // this.getData()
      // 临时只传当前登录老师ID
      this.getTeachersById()
    },
    // TOSS, 老师权限
    getTeachersById() {
      if (!this.teacherId) return

      this.$http.Permission.getAllTeacherByRole({
        teacherId: this.teacherId
      }).then((res) => {
        this.teacherIds = res || [this.teacherId]
        this.getData()
      })
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // 如果搜索销售，用获取的老师id替换权限老师id
      const teacher = {}
      if (!Object.keys(this.searchParams).includes('teacherid')) {
        Object.assign(teacher, {
          teacherid: this.teacherIds
        })
      }
      const query = Object.assign({}, this.searchParams, teacher)
      console.log(query)

      const page = this.currentPage
      this.$http.User.systemCourseUsers(query, page)
        .then((res) => {
          console.log(res)
          const payload =
            res && res.data && res.data.StudentSystemStatisticsPage
          var defTotalElements = 0
          var defTotalPages = 1
          var defContent = []
          if (payload) {
            const { totalElements, totalPages, content } = payload
            defTotalElements = totalElements
            defTotalPages = totalPages
            defContent = content
          }
          this.dataList = defContent
          this.totalPages = +defTotalPages
          this.totalElements = +defTotalElements
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    handleSizeChange(page) {
      console.log(this.page)
      this.currentPage = page
      this.getData()
    },

    changeStatus(res) {
      console.log(res)
      setTimeout(() => {
        this.getData()
      }, 500)
    },

    // 填写地址
    modifyAddress(row) {
      console.log(row)
      /**
        orderId: this.formData.orderid,
        expressId: this.formData.id,
        userId: this.formData.userid,
       */
      const params = {
        userid: row.studentid,
        orderid: row.orderid,
        id: row.express_id
      }
      this.modifyFormData = params
      this.showModifyAddress = true
    },

    handleModifyAddress(res) {
      this.showModifyAddress = false
      if (res === 1) {
        this.getData()
      }
    },

    // 多选
    handleSelectionChange(data) {
      console.log(data)
    },

    // 点击用户信息回调事件
    userHandle(uid) {
      console.log(uid, '点击用户信息')
    },

    expressStatus(status) {
      if (!status && status !== 0) {
        return '-'
      }
      // 异常物流
      if ('4,5,7,8'.includes(status)) {
        return '异常物流'
      }
      return '最后一次' + FOLLOW_EXPRESS_STATUS[status]
    },

    refundStatus(status) {
      return status ? ISREFUND[status] : '-'
    },

    wechatStatus(row) {
      const {
        teamtype = 1,
        addedgroup,
        addedwechat,
        follow,
        studentid,
        teamid
      } = row
      return {
        team_type: teamtype,
        added_group: addedgroup,
        added_wechat: addedwechat,
        follow,
        id: studentid,
        team_id: teamid
      }
    },

    // 点击班级名称，打开班级详情
    openTeam(row) {
      const { teamid, teamname, teamtype = '1' } = row
      teamid &&
        openNewTab(
          `/student-team/#/teamDetail/${teamid}/${teamtype}`,
          `${teamname}`
        )
    },

    formatDate(date) {
      return formatData(date, 's')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/list.scss';
</style>
