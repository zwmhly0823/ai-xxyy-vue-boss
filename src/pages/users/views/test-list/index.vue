<!--
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-08-26 16:56:00
 * @Last Modified by: songyanan
 * @Last Modified time: 2020-08-26 16:38:13
-->
<template>
  <div class="user-list">
    <div class="trial-container d-flex">
      <div class="trial-container-body">
        <search
          ref="searchC"
          @search="getSearchQuery"
          :key="currentDate"
          :paramsToSearch="paramsToSearch"
        />
        <!-- 数据统计 -->
        <div class="statistics-section d-flex justify-between align-center">
          <!-- <div class="statistics-section-left">
            当前结果：学员共计 {{ totalElements }} 名
          </div> -->
        </div>
        <!-- dom -->
        <div class="tableInner" ref="tableInner"></div>
        <!-- table -->
        <el-table
          ref="table"
          :data="dataList"
          empty-text=" "
          :height="tableHeight"
        >
          <el-table-column label="用户ID" min-width="85">
            <template slot-scope="scope">
              <p v-if="scope.row.userInfo">
                {{ scope.row.userInfo.user_num || '--' }}
              </p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <!-- 除了美术科目以外的科目，都取 userInfo-->
          <el-table-column label="用户信息" min-width="165">
            <template slot-scope="scope">
              <base-user-info
                :user="scope.row.userInfo"
                :uid="scope.row.uid"
                :sys-label="scope.row.sys_label"
                @handle-click="userHandle"
              />
            </template>
          </el-table-column>
          <el-table-column label="是否购买体验课" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.is_trial === '0' ? '否' : '是' }}
            </template>
          </el-table-column>
          <el-table-column label="是否购买系统课" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.is_system === '0' ? '否' : '是' }}
            </template>
          </el-table-column>
          <!-- 体验课信息 -->
          <el-table-column label="销售/班级" min-width="165">
            <template slot-scope="scope">
              <span v-if="scope.row.trailTeams.length === 0">--</span>
              <div v-else>
                <div v-for="(item, index) in scope.row.trailTeams" :key="index">
                  <div>
                    <span>{{
                      (item.teacher_info && item.teacher_info.realname) || '--'
                    }}</span>
                    <span class="primary-text" @click="openTeam(item)">{{
                      `(${item.team_name})`
                    }}</span>
                  </div>
                  <div>
                    {{
                      `${(item.teacher_info &&
                        item.teacher_info.departmentInfo &&
                        item.teacher_info.departmentInfo.name) ||
                        '--'}`
                    }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 系统课信息 -->
          <el-table-column label="班主任/班级" min-width="165">
            <template slot-scope="scope">
              <span v-if="scope.row.systemTeams.length === 0">--</span>
              <div v-else>
                <div
                  v-for="(item, index) in scope.row.systemTeams"
                  :key="index"
                >
                  <div>
                    <span>{{
                      (item.teacher_info && item.teacher_info.realname) || '--'
                    }}</span>
                    <span class="primary-text" @click="openTeam(item)">{{
                      `(${item.team_name})`
                    }}</span>
                  </div>
                  <div>
                    {{
                      `${(item.teacher_info &&
                        item.teacher_info.departmentInfo &&
                        item.teacher_info.departmentInfo.name) ||
                        '--'}`
                    }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="首次来源时间" min-width="165">
            <template slot-scope="scope">
              {{ formatDate(scope.row.join_date) }}
            </template>
          </el-table-column>
          <el-table-column label="首次来源渠道" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.channelInfo">
                {{ scope.row.channelInfo.channel_outer_name || '--' }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="系统课转化" min-width="90" fixed="right">
            <template slot-scope="scope">
              <span
                v-if="scope.row.user_status_name !== null"
                :class="[
                  {
                    'red-color': scope.row.user_status_name === '未转化'
                  }
                ]"
              >
                {{ scope.row.user_status_name || '--' }}
              </span>
              <span v-else>--</span>
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
      </div>
    </div>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import BaseUserInfo from '@/pages/write_app/views/users/components/BaseUserInfo.vue'
import { formatData, openBrowserTab, getAppSubjectCode } from '@/utils/index'
import Search from '../../components/SearchAllUsers.vue'
import { todayTimestamp, tomorrowTimestamp } from '../../utils'

export default {
  name: 'trialUsers',
  components: {
    MPagination,
    BaseUserInfo,
    Search
  },
  data() {
    return {
      subjectCode: getAppSubjectCode(),
      tableHeight: 0,
      // 查询条件
      search: [],
      term: '',
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      dataList: [],
      // 本页面传给search的值都放在这个对象下
      paramsToSearch: {},
      filterParams: {},
      currentDate: '',
      sortKeys: {
        // 参课节数
        join_course_count: 'desc',
        // 参课次数
        all_join_course_count: 'desc',
        // 参课最近操作时间
        last_join_time: 'desc',
        // 完课次数
        all_complete_course_count: 'desc',
        // 完课节数
        complete_course_count: 'desc',
        // 完课最近操作时间
        last_complete_time: 'desc',
        task_count: 'desc',
        listen_comment_count: 'desc',
        questionnaire_count: 'desc',
        // 预测转化
        'bi_label.keyword': 'desc'
      },
      sortActive: ''
    }
  },
  computed: {
    searchParams() {
      const search = Object.assign({}, this.search)
      // filter 与 search params 组合
      Object.assign(search, this.filterParams)
      // 系统课转化学员条件冲突，处理交互 TODO: 待优化
      if (this.filterParams) {
        if (this.filterParams.status) {
          // 已转化学员
          if (this.search.status && this.filterParams.status.gte === 3) {
            if (this.search.status.lte !== 2) {
              Object.assign(search, { status: this.search.status })
            } else {
              Object.assign(search, { status: { gte: 3, lte: 2 } })
            }
          }
          // 未转化学员
          if (this.search.status && this.filterParams.status.lte === 2) {
            if (this.search.status.lte !== 2) {
              Object.assign(search, { status: { gte: 3, lte: 2 } })
            }
          }
        }
      }
      return search
    },
    today() {
      return todayTimestamp()
    },
    tomorrow() {
      return tomorrowTimestamp()
    },
    tagList() {
      return function(list) {
        if (list.length > 4) {
          return list.slice(0, 4)
        } else {
          return list
        }
      }
    }
  },
  watch: {
    searchParams(params, oldval) {
      console.log(params)

      if (
        Object.keys(params).length === 0 &&
        Object.keys(oldval).length === 0
      ) {
        return
      }
      this.currentPage = 1
      this.getData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        const tableHeight =
          document.body.clientHeight - this.$refs.tableInner.offsetTop - 90
        this.tableHeight = tableHeight + ''
      }, 1000)
    })
    this.getData()
  },
  methods: {
    getSearchQuery(res) {
      this.search = res
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const query = Object.assign({}, this.searchParams)
      const page = this.currentPage
      const sort = {}
      if (this.sortActive) {
        sort[this.sortActive] = this.sortKeys[this.sortActive]
      }
      this.$http.User.studentAllUserList(query, page, sort)
        .then((res) => {
          var defTotalElements = 0
          var defTotalPages = 1
          var defContent = []
          if (res && res.data && res.data.StudentAllUserStatisticsPage) {
            const {
              totalElements,
              totalPages,
              content
            } = res.data.StudentAllUserStatisticsPage
            defTotalElements = totalElements
            defTotalPages = totalPages
            defContent = this.initName(content)
          }
          this.dataList = defContent
          this.totalPages = +defTotalPages
          this.totalElements = +defTotalElements
          this.$nextTick(() => {
            loading.close()
          })
        })
        .catch(() => {
          loading.close()
        })
    },
    // 格式化数据
    initName(data) {
      const intentionArr = ['低', '中', '高', '无']
      data.forEach((item) => {
        if (item.userIntention && item.userIntention.type) {
          item.userIntention.type_name =
            intentionArr[item.userIntention.type - 1]
        }
        switch (+item.status) {
          case 0:
            item.user_status_name = '已注册'
            break
          case 1:
          case 2:
            item.user_status_name = '未转化'
            break
          case 3:
          case 4:
            item.user_status_name = '已购月课'
            break
          case 5:
          case 6:
          case 7:
            item.user_status_name = '已购年课'
            break
          case 8:
            item.user_status_name = '注销失效'
            break
          case 9:
          case 10:
            item.user_status_name = '已购季度课'
            break
          case 11:
          case 12:
            item.user_status_name = '已购半年课'
            break
        }
        item.trailTeams = []
        item.systemTeams = []
        if (item?.userInfo?.teams) {
          // 销售/班级（体验课班级）
          item.trailTeams = item.userInfo.teams.filter(
            (item) => item.subject === this.subjectCode && +item.team_type === 0
          )
          // 班主任/班级（系统课班级）
          item.systemTeams = item.userInfo.teams.filter(
            (item) => item.subject === this.subjectCode && +item.team_type > 0
          )
        }
        // userExtendsInfo 添加学员id字段
        if (item.userExtendsInfo) {
          item.userExtendsInfo.id = item.uid
        }
      })
      return data
    },
    handleSizeChange(page) {
      this.currentPage = page
      this.getData()
    },

    // 点击用户信息回调事件
    userHandle(user) {
      console.log('gheghe', user)
      if (!user || !user.id) {
        this.$message.error('缺少用户信息')
        return
      }
      const { id } = user
      // 新标签打开详情页
      id && openBrowserTab(`/users/#/details/${id}`)
    },

    // 点击班级名称，打开班级详情
    openTeam(row) {
      if (!row.id) return
      const teamId = row.id
      const teamType = row.team_type || '0'
      teamId &&
        openBrowserTab(`/student-team/#/teamDetail/${teamId}/${teamType}`)
    },

    formatDate(date, flag = 's') {
      return formatData(date, flag)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/trial-list.scss';
.user-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background-color: #f0f1f2;
}
.trial-container-body {
  flex: 1;
  overflow: hidden;
  background-color: #fff;
}
.sort-operate-box {
  position: relative;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  .sort-icon-arrow {
    display: inline-block;
    position: relative;
    top: -2px;
    .top {
      position: absolute;
      bottom: 0;
    }
    .active {
      color: #2a75ed;
    }
    .top-color {
      position: absolute;
      bottom: 0;
    }
    .bottom {
      position: absolute;
      top: -6px;
    }
    .bottom-color {
      position: absolute;
      top: -6px;
    }
  }
}
</style>
