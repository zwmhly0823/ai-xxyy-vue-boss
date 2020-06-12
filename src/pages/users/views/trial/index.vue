<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 20:47:40
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-20 20:47:40
 * @Description: 体验课学员列表
 -->
<template>
  <div class="user-list">
    <el-tabs type="border-card" v-model="team_state">
      <el-tab-pane label="开课中" name="1"></el-tab-pane>
      <el-tab-pane label="待开课" name="0"></el-tab-pane>
      <el-tab-pane label="已结课" name="2"></el-tab-pane>
    </el-tabs>
    <div class="tableInner" ref="tableInner"></div>
    <!-- table -->
    <el-table
      :height="tableHeight"
      :data="dataList"
      empty-text=" "
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column label="用户信息" min-width="270" fixed>
        <template slot-scope="scope">
          <base-user-info
            :user="scope.row"
            @handle-click="userHandle(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否转化" min-width="180">
        <template slot-scope="scope">
          <p>{{ conversionType[scope.row.conversion_type] }}</p>
          <p v-if="scope.row.conversion_type">
            {{ formatDate(scope.row.system_order_buytime) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="今日参课" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.is_today_join_course === -1">-</span>
          <span v-else>{{
            scope.row.is_today_join_course === 0 ? '未参课' : '已参课'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="今日完课" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.is_today_complete_course === -1">-</span>
          <span v-else>{{
            scope.row.is_today_complete_course === 0 ? '未完课' : '已完课'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="今日上传作品" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.has_today_course_task === -1">-</span>
          <span v-else>
            {{
              scope.row.today_course_task_count === 0
                ? '未上传'
                : `${scope.row.today_course_task_count}幅作品`
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="添加微信" min-width="100">
        <template slot-scope="scope">
          <handle-item-status
            type="1"
            :row="scope.row"
            @change="changeStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否进群" min-width="100">
        <template slot-scope="scope">
          <handle-item-status
            type="2"
            :row="scope.row"
            @change="changeStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否关注公众号" min-width="140">
        <template slot-scope="scope">
          <item-status type="3" :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="随材物流" min-width="100">
        <template slot-scope="scope">
          <p>{{ expressStatus(scope.row.express_status) }}</p>
          <p
            v-if="scope.row.express_status === 0"
            class="btn-text"
            @click="modifyAddress(scope.row)"
          >
            帮他填写
          </p>
        </template>
      </el-table-column>
      <el-table-column label="最近打开APP信息" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.device_type }}</p>
          <p>
            {{
              scope.row.last_login_time !== '0'
                ? formatDate(scope.row.last_login_time)
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="归属地" min-width="140">
        <template slot-scope="scope">
          <p v-if="scope.row.mobile_province && scope.row.mobile_city">
            {{ scope.row.mobile_province }} · {{ scope.row.mobile_city }}
          </p>
          <p v-else-if="scope.row.mobile_province || scope.row.mobile_city">
            {{ scope.row.mobile_province || scope.row.mobile_city }}
          </p>
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column label="体验课班级·销售" min-width="180">
        <template slot-scope="scope">
          <p v-if="!scope.row.team_name || scope.row.team_name === '-'">
            {{ scope.row.team_name }}
          </p>
          <p class="btn-text " v-else @click="openTeam(scope.row)">
            {{ scope.row.team_name }}
          </p>
          <p>
            {{ scope.row.teacher_realname }} {{ scope.row.department_name }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="系统课班级·辅导老师" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.system_team_name }}</p>
          <p>
            {{ scope.row.system_teacher_realname }}
            {{ scope.row.system_teacher_department_name }}
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
import { formatData, openBrowserTab } from '@/utils/index'
import { FOLLOW_EXPRESS_STATUS } from '@/utils/enums'
export default {
  name: 'trialUsers',
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
        team_state: this.team_state
      }
    }
  },
  data() {
    return {
      team_state: '1',
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
      console.log(params)

      this.currentPage = 1
      this.getData()
    }
  },
  created() {
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 112 - 30
      this.tableHeight = tableHeight + ''
    })
    this.getData()
  },
  methods: {
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const query = Object.assign({}, this.searchParams)
      console.log(query)

      const page = this.currentPage
      this.$http.User.trialCourseUsers(query, page)
        .then((res) => {
          console.log(res)
          var defTotalElements = 0
          var defTotalPages = 1
          var defContent = []
          if (res && res.data && res.data.StudentTrialStatisticsPage) {
            const {
              totalElements,
              totalPages,
              content
            } = res.data.StudentTrialStatisticsPage
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
      const list = this.dataList.map((item) => {
        if (item.id === res.id) {
          item = res
        }
        return item
      })
      this.dataList = list
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
        userid: row.id,
        orderid: row.trial_order_no,
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
    userHandle(user) {
      // console.log(user, '点击用户信息')
      const { username, id, mobile } = user
      // 新标签打开详情页
      id &&
        openBrowserTab(`/users/#/details/${id}`, `学员：${username || mobile}`)
    },

    expressStatus(status) {
      if (!status && +status !== 0) {
        return '-'
      }
      // 异常物流
      if ('4,5,7,8'.includes(status)) {
        return '异常物流'
      }
      return FOLLOW_EXPRESS_STATUS[status]
    },

    // 点击班级名称，打开班级详情
    openTeam(row) {
      const teamType = row.team_type || '0'
      let teamId = row.team_id || ''
      let teamName = row.team_name
      if (+teamType > 0 && +row.system_team_id > 0) {
        teamId = row.system_team_id
        teamName = row.system_team_name
      }
      teamId &&
        openBrowserTab(
          `/student-team/#/teamDetail/${teamId}/${teamType}`,
          `${teamName}`
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
