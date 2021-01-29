<!--
 * @Descripttion: 系统课学员列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-25 15:34:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-19 10:56:44
-->
<template>
  <div class="user-list">
    <el-tabs v-model="life_cycle">
      <el-tab-pane label="全部学员" name="0,1,2,91"></el-tab-pane>
      <el-tab-pane label="开课中" name="1"></el-tab-pane>
      <el-tab-pane label="待开课" name="0"></el-tab-pane>
      <el-tab-pane label="已结课" name="2"></el-tab-pane>
      <el-tab-pane label="已退费" name="91"></el-tab-pane>
    </el-tabs>
    <search-system
      @search="getSearchQuery"
      :teacherIds="teacherIds"
      :departmentId="departmentId"
      :teacher_="teacher_"
    />
    <!-- 数据统计 -->
    <div class="statistics-section d-flex justify-between align-center">
      <div class="statistics-section-left">
        当前结果：学员共计 {{ totalElements }} 名
      </div>
      <div style="display:flex; align-items:center;">
        数据更新时间：{{ formatDate(new Date(), 'm') || '-' }}
        <el-tooltip class="item" effect="dark" placement="left">
          <div slot="content">
            <p>列表数据说明</p>
            <p>【参课】</p>
            <p>参课指用户在APP点击某节课进入上课界面的行为</p>
            <p>
              参课节数：筛选条件内，用户系统课参课的节数／总共放系统课的节数
            </p>
            <p>【完课】</p>
            <p>完课指用户观看完课程的学习视频的行为</p>
            <p>
              完课节数：筛选条件内，用户系统课完课的节数／总共放系统课的节数
            </p>
            <p>【传作品】</p>
            <p>筛选期数内，用户上传的作品总数</p>
            <p>【点评】</p>
            <p>1、点评作品：筛选期数内，已被老师点评过的作品数</p>
            <p>2、已听作品：筛选期数内，用户已经听过点评的作品数</p>
          </div>
          <i class="el-icon-warning" style="padding-left:20px;"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="tableInner" ref="tableInner"></div>
    <!-- table -->
    <el-table
      :data="dataList"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      empty-text=" "
    >
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column label="用户信息" min-width="180" fixed>
        <template slot-scope="scope">
          <base-user-info
            :user="scope.row"
            :user-extends="scope.row.userExtends"
            :sys-label="scope.row.sys_label"
            @handle-click="userHandle"
          />
          <span
            v-if="teacher_.dutyId === '2'"
            @click="handLeCopy(scope.$index, scope.row)"
            style="position:absolute;top:22px;left:160px;cursor:pointer;z-index:9999;"
            class="el-icon-document-copy"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="系统课包类型" min-width="100">
        <template slot-scope="scope">
          <p
            v-if="
              scope.row.user_status === 5 ||
                scope.row.user_status === 6 ||
                scope.row.user_status === 7
            "
          >
            年课
          </p>
          <p
            v-if="scope.row.user_status === 11 || scope.row.user_status === 12"
          >
            半年课
          </p>
        </template>
      </el-table-column>
      <el-table-column label="城市" min-width="120">
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
      <el-table-column label="参课" min-width="130">
        <template #header>
          <el-dropdown
            class="classes-dropdown"
            size="small"
            trigger="click"
            placement="bottom-start"
            @command="classesDropdown"
          >
            <div class="sort-operate-box">
              <span>参课</span>
              <div class="sort-icon-arrow">
                <i
                  class="el-icon-caret-top top-color"
                  :class="{
                    active:
                      (sortKeys['noactivecount'] != 'asc' &&
                        sortActive == 'noactivecount') ||
                      (sortKeys['currenttotal'] != 'asc' &&
                        sortActive == 'currenttotal') ||
                      (sortKeys['last_join_time'] != 'asc' &&
                        sortActive == 'last_join_time')
                  }"
                ></i>
                <i
                  class="el-icon-caret-bottom bottom"
                  :class="{
                    active:
                      (sortKeys['noactivecount'] == 'asc' &&
                        sortActive == 'noactivecount') ||
                      (sortKeys['currenttotal'] == 'asc' &&
                        sortActive == 'currenttotal') ||
                      (sortKeys['last_join_time'] == 'asc' &&
                        sortActive == 'last_join_time')
                  }"
                ></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="noactivecount">
                <div class="sort-operate-box">
                  <span>按次数</span>
                  <div class="sort-icon-arrow">
                    <i
                      class="el-icon-caret-top top-color"
                      :class="{
                        active:
                          sortKeys['noactivecount'] != 'asc' &&
                          sortActive == 'noactivecount'
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          sortKeys['noactivecount'] == 'asc' &&
                          sortActive == 'noactivecount'
                      }"
                    ></i>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="currenttotal">
                <div class="sort-operate-box">
                  <span>按节数</span>
                  <div class="sort-icon-arrow">
                    <i
                      class="el-icon-caret-top top-color"
                      :class="{
                        active:
                          sortKeys['currenttotal'] != 'asc' &&
                          sortActive == 'currenttotal'
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          sortKeys['currenttotal'] == 'asc' &&
                          sortActive == 'currenttotal'
                      }"
                    ></i>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="last_join_time">
                <div class="sort-operate-box">
                  <span>按最近操作时间</span>
                  <div class="sort-icon-arrow">
                    <i
                      class="el-icon-caret-top top-color"
                      :class="{
                        active:
                          sortKeys['last_join_time'] != 'asc' &&
                          sortActive == 'last_join_time'
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          sortKeys['last_join_time'] == 'asc' &&
                          sortActive == 'last_join_time'
                      }"
                    ></i>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <p>
            节数:<span style="color: #ff8b8c;">{{
              scope.row.noactivecount
            }}</span
            >/{{ scope.row.currenttotal }}
          </p>
          <p>
            最近：{{ formatDate(scope.row.last_join_time, 'shortDay') || '-' }}
          </p>
        </template>
      </el-table-column>

      <el-table-column label="完课" min-width="130">
        <template #header>
          <el-dropdown
            class="classes-dropdown"
            size="small"
            trigger="click"
            placement="bottom-start"
            @command="classesDropdown"
          >
            <div class="sort-operate-box">
              <span>完课</span>
              <div class="sort-icon-arrow">
                <i
                  class="el-icon-caret-top top-color"
                  :class="{
                    active:
                      (sortKeys['activecount'] != 'asc' &&
                        sortActive == 'activecount') ||
                      (sortKeys['currenttotal'] != 'asc' &&
                        sortActive == 'currenttotal') ||
                      (sortKeys['last_complete_time'] != 'asc' &&
                        sortActive == 'last_complete_time')
                  }"
                ></i>
                <i
                  class="el-icon-caret-bottom bottom"
                  :class="{
                    active:
                      (sortKeys['activecount'] == 'asc' &&
                        sortActive == 'activecount') ||
                      (sortKeys['currenttotal'] == 'asc' &&
                        sortActive == 'currenttotal') ||
                      (sortKeys['last_complete_time'] == 'asc' &&
                        sortActive == 'last_complete_time')
                  }"
                ></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="activecount">
                <div class="sort-operate-box">
                  <span>按次数</span>
                  <div class="sort-icon-arrow">
                    <i
                      class="el-icon-caret-top top-color"
                      :class="{
                        active:
                          sortKeys['activecount'] != 'asc' &&
                          sortActive == 'activecount'
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          sortKeys['activecount'] == 'asc' &&
                          sortActive == 'activecount'
                      }"
                    ></i>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="currenttotal">
                <div class="sort-operate-box">
                  <span>按节数</span>
                  <div class="sort-icon-arrow">
                    <i
                      class="el-icon-caret-top top-color"
                      :class="{
                        active:
                          sortKeys['currenttotal'] != 'asc' &&
                          sortActive == 'currenttotal'
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          sortKeys['currenttotal'] == 'asc' &&
                          sortActive == 'currenttotal'
                      }"
                    ></i>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item command="last_complete_time">
                <div class="sort-operate-box">
                  <span>按最近操作时间</span>
                  <div class="sort-icon-arrow">
                    <i
                      class="el-icon-caret-top top-color"
                      :class="{
                        active:
                          sortKeys['last_complete_time'] != 'asc' &&
                          sortActive == 'last_complete_time'
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          sortKeys['last_complete_time'] == 'asc' &&
                          sortActive == 'last_complete_time'
                      }"
                    ></i>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <p>
            节数:<span style="color: #ff8b8c;">{{ scope.row.activecount }}</span
            >/{{ scope.row.currenttotal }}
          </p>
          <p>
            最近：{{
              formatDate(scope.row.last_complete_time, 'shortDay') || '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="作品数" min-width="80">
        <template slot="header">
          <div class="sort-operate-box" @click="sortRules('taskcount')">
            <span>传作品</span>
            <div class="sort-icon-arrow">
              <i
                class="el-icon-caret-top top-color"
                :class="{
                  active:
                    sortKeys['taskcount'] != 'asc' && sortActive == 'taskcount'
                }"
              ></i>
              <i
                class="el-icon-caret-bottom bottom"
                :class="{
                  active:
                    sortKeys['taskcount'] == 'asc' && sortActive == 'taskcount'
                }"
              ></i>
            </div>
          </div>
        </template>
        <template slot-scope="scope"> {{ scope.row.taskcount }} </template>
      </el-table-column>
      <el-table-column label="点评" min-width="120">
        <template slot-scope="scope">
          <p>已听作品: {{ scope.row.flagcount }}</p>
          <p>点评作品: {{ scope.row.flag_total_count }}</p>
        </template>
      </el-table-column>
      <el-table-column label="生命周期" min-width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.life_cycle === 0">待开课</p>
          <p v-if="scope.row.life_cycle === 1">上课中</p>
          <p v-if="scope.row.life_cycle === 2">已结课</p>
          <p v-if="scope.row.life_cycle === 91">已退费</p>
        </template>
      </el-table-column>

      <el-table-column label="加微" min-width="60">
        <template slot-scope="scope">
          <!-- <handle-item-status
            type="1"
            :row="wechatStatus(scope.row)"
            @change="changeStatus"
          /> -->
          <el-switch
            v-model="scope.row.addedwechat"
            active-color="#3582fb"
            inactive-color="#DCDFE6"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch($event, scope.row, scope.$index, 'wechat')"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="进群" min-width="60">
        <template slot-scope="scope">
          <!-- <handle-item-status
            type="2"
            :row="wechatStatus(scope.row)"
            @change="changeStatus"
          /> -->
          <el-switch
            v-model="scope.row.addedgroup"
            active-color="#3582fb"
            inactive-color="#DCDFE6"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch($event, scope.row, scope.$index, 'group')"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="公众号" min-width="60">
        <template slot-scope="scope">
          <span v-if="!scope.row.follow || +scope.row.follow === 0">
            -
          </span>
          <i v-else class="el-icon-check"></i>
          <!-- <item-status type="3" :row="wechatStatus(scope.row)" /> -->
        </template>
      </el-table-column>
      <el-table-column label="APP登录" min-width="140">
        <template slot-scope="scope">
          <p v-if="scope.row.userLoginDataInfo">
            {{ scope.row.userLoginDataInfo.device_type || '-' }}
            <span v-if="scope.row.userLoginDataInfo.appversion"
              >（V{{ scope.row.userLoginDataInfo.appversion }}）</span
            >
          </p>
          <p v-else>-</p>
          <p>
            {{
              scope.row.lastlogintime !== '0'
                ? formatDate(scope.row.lastlogintime)
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="辅导老师/班级" min-width="190">
        <template slot-scope="scope">
          <p v-if="!scope.row.teamname || scope.row.teamname === '-'">-</p>
          <p class="btn-text " v-else @click="openTeam(scope.row)">
            {{ scope.row.realname }} ({{ scope.row.teamname }})
          </p>
          <p>{{ scope.row.departmentname }}</p>
        </template>
      </el-table-column>
      <el-table-column label="销售/班级" min-width="180">
        <template slot-scope="scope">
          <p>
            {{ scope.row.trialrealname || '-' }} ({{
              scope.row.trialteamname || '-'
            }})
          </p>
          <p>{{ scope.row.trialdepartmentname || '' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="学员ID" min-width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.user_num_text || '-' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="渠道" min-width="120" fixed="right">
        <template slot-scope="scope">
          <p>{{ scope.row.channel_outer_name || '-' }}</p>
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
    <!-- 发送优惠券 -->
    <!-- <coupon-popover
      ref="couponDialog"
      :couponData="couponData"
      :selectUserId="[studentid]"
    /> -->
    <label-checkbox
      v-if="showDialogFormVisible"
      :labelRowValue="labelRowValue"
      @onRefresh="onRefresh"
      ref="labelCheckbox"
    />
  </div>
</template>

<script>
import SearchSystem from '../../components/SearchSystem-v2.vue'
import MPagination from '@/components/MPagination/index.vue'
import BaseUserInfo from '../../components/BaseUserInfo.vue'
// import ItemStatus from '../../components/ItemStatus.vue'
// import HandleItemStatus from '../../components/HandleItemStatus.vue'
import labelCheckbox from '../../components/labelCheckboxSystem'
import ModifyAddress from '../../components/ModifyAddress.vue'
import enums from '../../components/searchData'
import { formatData, openBrowserTab } from '@/utils/index'
import { FOLLOW_EXPRESS_STATUS, ISREFUND } from '@/utils/enums'
// import CouponPopover from '@/pages/studentTeam/components/TabPane/components/couponPopover'
export default {
  name: 'systemUsers',
  components: {
    SearchSystem,
    MPagination,
    BaseUserInfo,
    // HandleItemStatus,
    // ItemStatus,
    ModifyAddress,
    labelCheckbox
    // CouponPopover
  },
  // props: {
  //   // 查询条件
  //   search: {
  //     type: Object,
  //     default: () => ({})
  //   }
  // },
  computed: {
    searchParams() {
      return {
        ...this.search,
        life_cycle: this.life_cycle.split(',')
      }
    }
  },
  data() {
    return {
      life_cycle: '0,1,2,91', // 0 待开始；1 上课中；2 已结课; 91 已退费
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      dataList: [],
      conversionType: enums.conversionType,
      showModifyAddress: false,
      showDialogFormVisible: false,
      modifyFormData: {},
      teacherIds: [],
      tableHeight: 0,
      labelRowValue: {},
      search: {},
      sortKeys: {
        noactivecount: 'desc',
        activecount: 'desc',
        taskcount: 'desc'
      },
      sortActive: '',
      couponData: [],
      currentUser: {}, // 当前选择用户
      departmentId: '', // 部门ID
      studentid: '',
      teacher_: {}
    }
  },
  watch: {
    searchParams(params) {
      console.log(params, 'searchParamssearchParams')
      console.info('llllllll', this.life_cycle)
      // dashboard_lk
      if (Object.keys(this.$route.query).length > 0) {
        for (const key in this.$route.query) {
          // 循环其实就1个为取值(计算属性名[key])
          this.getData_dashBoard({
            // [key]: +this.$route.query[key]
            [key]:
              key === 'expressstatus'
                ? [this.$route.query[key]]
                : +this.$route.query[key]
          })
        }
        return
      }
      this.currentPage = 1
      this.getData()
    },
    search(val) {
      console.log(val, 'val')
    }
  },
  created() {
    this.init()
    // dashboard_lk
    if (Object.keys(this.$route.query).length > 0) {
      // 修改2处ui(可能造成额外两次请求)
      this.life_cycle = '0'
      const key = Object.keys(this.$route.query)[0]
      this.$root.$emit(key + '_lk', this.$route.query[key])
    }
    // this.getCouponList()
  },
  methods: {
    handLeCopy(index, row) {
      const url = row.mobile
      const oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    getSearchQuery(res) {
      console.log(res, 'search result')
      this.search = res
    },
    onRefresh(data) {
      setTimeout(() => {
        this.init()
      }, 1000)
    },
    // 添加标签
    onLabel() {
      this.$refs.labelCheckbox.dialogFormVisible = true
      this.$refs.labelCheckbox.getAllTeacherByRoleIds()
    },
    // 获取一行数据
    // hoverRow(row, column, cell, event) {
    //   this.labelRowValue = row
    //   this.showDialogFormVisible = true
    // },
    init() {
      this.$nextTick(() => {
        const tableHeight =
          document.body.clientHeight - this.$refs.tableInner.offsetTop - 90
        this.tableHeight = tableHeight + ''
      })
      // this.teacherId = isToss()
      // const teacher_ = JSON.parse(localStorage.getItem('teacher'))
      // if (teacher_) {
      //   this.teacher_ = teacher_
      //   this.departmentId = teacher_.departmentId
      //   console.log(teacher_, '_teacher_teacher')
      // }
      const staff = JSON.parse(localStorage.getItem('staff'))
      if (staff) {
        this.departmentId = staff.departmentId
      }
      this.getData()
      // 临时只传当前登录老师ID
      // this.getTeachersById()
    },
    // TOSS, 老师权限
    // getTeachersById() {
    //   if (!this.teacherId) return

    //   this.$http.Permission.getAllTeacherByRole({
    //     teacherId: this.teacherId
    //   }).then((res) => {
    //     this.teacherIds = res || [this.teacherId]
    //     this.getData()
    //   })
    // },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // 如果搜索销售，用获取的老师id替换权限老师id
      // const teacher = {}
      // if (Object.keys(this.searchParams).includes('teacherid')) {
      //   Object.assign(teacher, {
      //     teacherid: this.teacherIds
      //   })
      // }
      const query = Object.assign({}, this.searchParams)
      console.log(query)

      const page = this.currentPage
      const sort = {}
      if (this.sortActive) {
        sort[this.sortActive] = this.sortKeys[this.sortActive]
      }
      this.$http.writeApp.User.systemCourseUsers(query, page, sort)
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
    // dashboard_lk
    getData_dashBoard(query) {
      console.info(query)
      const teacherid = JSON.parse(localStorage.getItem('teacher')).id // 带不带老师id
      setTimeout(() => {
        console.info('3秒后我来了')
        const loading = this.$loading({
          lock: true,
          text: '来自m.2星球',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        })
        this.$http.writeApp.User.systemCourseUsers(
          Object.assign(
            { life_cycle: this.life_cycle, teacherid: [teacherid] },
            query
          ) // 带不带老师id
        )
          .then((res) => {
            console.info('来自m.2星球的网络请求')
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
      }, 1500) // 等一手初始化数据再覆盖它
    },
    handleSizeChange(page) {
      console.log(this.page)
      this.currentPage = page
      this.getData()
    },

    // changeStatus(res) {
    //   console.log(res)
    //   setTimeout(() => {
    //     this.getData()
    //   }, 500)
    // },
    // 参课的下拉排序
    classesDropdown(command) {
      this.sortRules(command)
    },
    // 改变排序规则
    sortRules(sortKey) {
      // let sort = ''
      if (this.sortActive) {
        this.sortKeys[this.sortActive] =
          this.sortKeys[this.sortActive] === 'asc' ? 'desc' : 'asc'
      }
      console.log(sortKey, 'sortkkkkkk')
      this.sortActive = sortKey
      this.getData()
    },
    // 修改开关
    changeSwitch(val, data, index, type) {
      console.log(data, 'data------')
      const params = {
        teamId: data.teamid,
        courseType:
          data.teamInfo && +data.teamInfo.team_type === 0 ? 'TRAIL' : 'YEAR',
        studentId: data.studentid
      }
      if (type === 'wechat') {
        params.addedWechat = val
      } else if (type === 'group') {
        params.addedGroup = val
      }
      this.$http.writeApp.User.updateTeamStudent(params).then((res) => {
        if (res && res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          // 换成原值
          if (type === 'wechat') {
            // 这么写的原因是值不是0就是1
            this.dataList[index].added_wechat = Math.abs(val - 1)
          } else if (type === 'group') {
            this.dataList[index].added_group = Math.abs(val - 1)
          }
        }
      })
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
    userHandle(user) {
      const { username, studentid, mobile } = user
      // 新标签打开详情页
      studentid &&
        openBrowserTab(
          `/write_app/#/details/${studentid}`,
          `学员：${username || mobile}`
        )
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
        openBrowserTab(
          `/write_app/#/teamDetail/${teamid}/${teamtype}`,
          `${teamname}`
        )
    },
    // 操作列的下拉
    handleColumnCommand(command, user = {}, index) {
      console.log(command, user, index)
      this.currentUser = user
      switch (command) {
        // 沟通备注
        case '1':
          if (!user.userIntention || +user.userIntention.type === 0) {
            this.createIntention(index, user.id)
          } else {
            this.intentDescribeChange(index, user.id)
          }
          break
        // 催发地址短信
        case '2':
          this.sendMessage(true)
          break
        // 优惠券
        case '3':
          this.studentid = user.studentid
          this.$refs.couponDialog.issueCoupons = true
          this.$refs.couponDialog.couponsTime = ''
          break
        // 加标签
        case '4':
          this.onLabel()
          break
      }
    },
    handleCommandChange(visible) {
      if (visible) {
        this.resetCurrentUser()
      }
    },
    // 获取优惠券列表
    // getCouponList() {
    //   this.$http.Team.getAllCoupons(0).then((res) => {
    //     this.couponData = (res.payload && res.payload.content) || []
    //   })
    // },
    // 重置当前选择用户
    resetCurrentUser() {
      this.currentUser = {}
    },
    formatDate(date, flag = 's') {
      return formatData(date, flag)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/list.scss';
::v-deep {
  .el-tabs .el-tabs__nav-scroll {
    padding-left: 15px;
  }
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
