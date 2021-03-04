<!--
 * @Descripttion: 系统课学员列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-25 15:34:04
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-02-08 13:34:07
-->
<template>
  <div class="user-list">
    <!-- <el-tabs v-model="life_cycle">
      <el-tab-pane label="全部学员" name="0,1,2,91,92"></el-tab-pane>
      <el-tab-pane label="开课中" name="1"></el-tab-pane>
      <el-tab-pane label="待开课" name="0"></el-tab-pane>
      <el-tab-pane label="已结课" name="2"></el-tab-pane>
      <el-tab-pane label="已退费" name="91"></el-tab-pane>
      <el-tab-pane label="已转出" name="92"></el-tab-pane>
    </el-tabs> -->
    <div class="system-container-sidebar d-flex" :class="{ closed: !isOpened }">
      <!-- 体验课左侧快捷切换 -->
      <system-sidebar
        :key="currentDate"
        :fontsize="tableList.expression.fontSize"
        @filter="getFilter"
        :system_page_menu="system_page_menu"
        @toggle="handleToggle"
        ref="sidebar"
      />
      <div style="width:calc(100vw - 375px)" ref="systemCon">
        <search-system
          @search="getSearchQuery"
          :teacherIds="teacherIds"
          :departmentId="departmentId"
          :teacher_="teacher_"
          @handlePutaway="calcToggleawayHeight"
          ref="searchSystem"
        />
        <div>
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
                  <p>【是否续费】</p>
                  <p>
                    1、已续费：代表这个用户有已完成的续费订单（包括半年及全年系统课续费）
                  </p>
                  <p>
                    2、待续费：代表这个用户只有一笔系统课新报订单，没有续费订单
                  </p>
                </div>
                <i class="el-icon-warning" style="padding-left:20px;"></i>
              </el-tooltip>

              <div class="sys-set">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-setting"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <p class="sys-v2-h3">不固定</p>
                    <table-set-column
                      v-if="openColumnLsit"
                      :table_list="tableList"
                      @tableSet="tableSet"
                    ></table-set-column>
                    <p class="sys-v2-h3">固定</p>
                    <el-checkbox-group class="sys-v2-el-checkbox-group">
                      <el-checkbox disabled label="手机号/ID"></el-checkbox>
                    </el-checkbox-group>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>

              <div class="sys-set">
                <el-dropdown trigger="click" @command="handleFontSize">
                  <span class="el-dropdown-link">
                    <i class="el-icon-s-operation"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :class="{
                        'sys-v2-background':
                          tableList.expression.fontSize === '12px'
                      }"
                      command="12"
                      >小</el-dropdown-item
                    >
                    <el-dropdown-item
                      :class="{
                        'sys-v2-background':
                          tableList.expression.fontSize === '14px'
                      }"
                      command="14"
                      >中</el-dropdown-item
                    >
                    <el-dropdown-item
                      :class="{
                        'sys-v2-background':
                          tableList.expression.fontSize === '16px'
                      }"
                      command="16"
                      >大</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="tableInner" ref="tableInner"></div>
          <!-- table -->
          <el-table
            :data="dataList"
            @selection-change="handleSelectionChange"
            :height="tableHeight"
            :key="keyDate"
            empty-text=" "
            :style="{ 'font-size': tableList.expression.fontSize }"
            @cell-mouse-enter="hoverRow"
          >
            <el-table-column label="手机号/ID" width="120" fixed>
              <template slot-scope="scope">
                <p @click="userHandle(scope.row)" class="primary-text">
                  {{ scope.row.mobile }}

                  <i
                    @click.stop="handLeCopy(scope.row)"
                    class="el-icon-document-copy"
                  >
                  </i>
                </p>
                <p>
                  <span v-if="scope.row.user_num_text"
                    >ID: {{ scope.row.user_num_text }} · </span
                  ><span
                    v-if="scope.row.send_id > 0"
                    style="color: rgb(255, 139, 140);"
                    >R</span
                  >
                </p>
              </template>
            </el-table-column>
            <!-- <el-table-column type="selection" width="55"> </el-table-column> -->

            <div
              v-for="(item, index) in tableList.expression.column"
              :key="index + keyDate"
            >
              <el-table-column
                :label="item.title"
                :key="index"
                :min-width="item.size"
              >
                <template #header v-if="item.title === '学习概况' && item.flag">
                  <el-dropdown
                    class="classes-dropdown"
                    size="small"
                    trigger="click"
                    placement="bottom-start"
                    @command="classesDropdown"
                  >
                    <div class="sort-operate-box">
                      <span
                        :style="{ 'font-size': tableList.expression.fontSize }"
                        >学习概况</span
                      >
                      <div class="sort-icon-arrow">
                        <i
                          class="el-icon-caret-top top-color"
                          :class="{
                            active:
                              (sortKeys['noactivecount'] != 'asc' &&
                                sortActive == 'noactivecount') ||
                              (sortKeys['activecount'] != 'asc' &&
                                sortActive == 'activecount') ||
                              (sortKeys['flag_total_count'] != 'asc' &&
                                sortActive == 'flag_total_count') ||
                              (sortKeys['open_app_count'] != 'asc' &&
                                sortActive == 'open_app_count') ||
                              (sortKeys['taskcount'] != 'asc' &&
                                sortActive == 'taskcount') ||
                              (sortKeys['flagcount'] != 'asc' &&
                                sortActive == 'flagcount')
                          }"
                        ></i>
                        <i
                          class="el-icon-caret-bottom bottom"
                          :class="{
                            active:
                              (sortKeys['noactivecount'] == 'asc' &&
                                sortActive == 'noactivecount') ||
                              (sortKeys['activecount'] == 'asc' &&
                                sortActive == 'activecount') ||
                              (sortKeys['flag_total_count'] == 'asc' &&
                                sortActive == 'flag_total_count') ||
                              (sortKeys['open_app_count'] == 'asc' &&
                                sortActive == 'open_app_count') ||
                              (sortKeys['taskcount'] == 'asc' &&
                                sortActive == 'taskcount') ||
                              (sortKeys['flagcount'] == 'asc' &&
                                sortActive == 'flagcount')
                          }"
                        ></i>
                      </div>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="noactivecount">
                        <div
                          class="sort-operate-box"
                          :style="{
                            'font-size': tableList.expression.fontSize
                          }"
                        >
                          <span>按参课节数</span>
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
                      <el-dropdown-item command="activecount">
                        <div
                          class="sort-operate-box"
                          :style="{
                            'font-size': tableList.expression.fontSize
                          }"
                        >
                          <span>按完课节数</span>
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
                      <el-dropdown-item command="flag_total_count">
                        <div
                          class="sort-operate-box"
                          :style="{
                            'font-size': tableList.expression.fontSize
                          }"
                        >
                          <span>按点评次数</span>
                          <div class="sort-icon-arrow">
                            <i
                              class="el-icon-caret-top top-color"
                              :class="{
                                active:
                                  sortKeys['flag_total_count'] != 'asc' &&
                                  sortActive == 'flag_total_count'
                              }"
                            ></i>
                            <i
                              class="el-icon-caret-bottom bottom"
                              :class="{
                                active:
                                  sortKeys['flag_total_count'] == 'asc' &&
                                  sortActive == 'flag_total_count'
                              }"
                            ></i>
                          </div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="open_app_count">
                        <div
                          class="sort-operate-box"
                          :style="{
                            'font-size': tableList.expression.fontSize
                          }"
                        >
                          <span>按打开APP次数</span>
                          <div class="sort-icon-arrow">
                            <i
                              class="el-icon-caret-top top-color"
                              :class="{
                                active:
                                  sortKeys['open_app_count'] != 'asc' &&
                                  sortActive == 'open_app_count'
                              }"
                            ></i>
                            <i
                              class="el-icon-caret-bottom bottom"
                              :class="{
                                active:
                                  sortKeys['open_app_count'] == 'asc' &&
                                  sortActive == 'open_app_count'
                              }"
                            ></i>
                          </div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="taskcount">
                        <div
                          class="sort-operate-box"
                          :style="{
                            'font-size': tableList.expression.fontSize
                          }"
                        >
                          <span>按上传作品张数</span>
                          <div class="sort-icon-arrow">
                            <i
                              class="el-icon-caret-top top-color"
                              :class="{
                                active:
                                  sortKeys['taskcount'] != 'asc' &&
                                  sortActive == 'taskcount'
                              }"
                            ></i>
                            <i
                              class="el-icon-caret-bottom bottom"
                              :class="{
                                active:
                                  sortKeys['taskcount'] == 'asc' &&
                                  sortActive == 'taskcount'
                              }"
                            ></i>
                          </div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item command="flagcount">
                        <div
                          class="sort-operate-box"
                          :style="{
                            'font-size': tableList.expression.fontSize
                          }"
                        >
                          <span>按听点评次数</span>
                          <div class="sort-icon-arrow">
                            <i
                              class="el-icon-caret-top top-color"
                              :class="{
                                active:
                                  sortKeys['flagcount'] != 'asc' &&
                                  sortActive == 'flagcount'
                              }"
                            ></i>
                            <i
                              class="el-icon-caret-bottom bottom"
                              :class="{
                                active:
                                  sortKeys['flagcount'] == 'asc' &&
                                  sortActive == 'flagcount'
                              }"
                            ></i>
                          </div>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template slot-scope="scope">
                  <!-- 学员信息 -->
                  <div v-if="item.title === '学员信息' && item.flag">
                    <new-base-user-info :user="scope.row" />
                  </div>
                  <!-- 微信信息 -->
                  <div v-if="item.title === '微信信息' && item.flag">
                    <div
                      v-if="
                        scope.row.userExtends && scope.row.userExtends.wechat_id
                      "
                    >
                      <div class="sys-v2-head-father">
                        <img
                          class="sys-v2-head"
                          :src="
                            scope.row.userExtends &&
                              scope.row.userExtends.wechat_avatar
                          "
                          alt=""
                        />
                        <div class="sys-v2-head-father-right">
                          <div>
                            {{ scope.row.userExtends.wechat_nick_name }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>未绑定</div>
                  </div>
                  <!-- 学习进度 -->
                  <div v-if="item.title === '学习进度' && item.flag">
                    <p>
                      {{ scope.row.currentsuper }}{{ scope.row.currentlevel
                      }}{{ scope.row.currentunit }}{{ scope.row.currentlesson }}
                    </p>
                  </div>
                  <!-- 学习概况 -->
                  <div v-if="item.title === '学习概况' && item.flag">
                    <div>
                      <p>
                        打开:<span class="sys-v2-situation">{{
                          scope.row.open_app_count
                            ? scope.row.open_app_count
                            : 0
                        }}</span>
                        参课:<span class="sys-v2-situation">{{
                          scope.row.noactivecount
                        }}</span>
                        完课:<span class="sys-v2-situation">{{
                          scope.row.activecount
                        }}</span>
                      </p>
                      <p>
                        作品:<span class="sys-v2-situation">{{
                          scope.row.taskcount
                        }}</span>
                        点评:<span class="sys-v2-situation">{{
                          scope.row.flag_total_count
                        }}</span>
                        听点评:<span class="sys-v2-situation">{{
                          scope.row.flagcount
                        }}</span>
                      </p>
                    </div>
                  </div>
                  <!-- 辅导老师/班级 -->
                  <div v-if="item.title === '辅导老师/班级' && item.flag">
                    <p v-if="!scope.row.teamname || scope.row.teamname === '-'">
                      -
                    </p>
                    <p class="btn-text " v-else @click="openTeam(scope.row)">
                      {{ scope.row.realname }} ({{ courseLevelReplace(scope.row.teamname) }})
                    </p>
                    <p>{{ scope.row.departmentname }}</p>
                  </div>
                  <!-- 加微 -->
                  <div v-if="item.title === '加微' && item.flag">
                    <el-switch
                      v-model="scope.row.addedwechat"
                      active-color="#3582fb"
                      inactive-color="#DCDFE6"
                      :active-value="1"
                      :inactive-value="0"
                      @change="
                        changeSwitch($event, scope.row, scope.$index, 'wechat')
                      "
                    >
                    </el-switch>
                  </div>
                  <!-- 进群 -->
                  <div v-if="item.title === '进群' && item.flag">
                    <el-switch
                      v-model="scope.row.addedgroup"
                      active-color="#3582fb"
                      inactive-color="#DCDFE6"
                      :active-value="1"
                      :inactive-value="0"
                      @change="
                        changeSwitch($event, scope.row, scope.$index, 'group')
                      "
                    >
                    </el-switch>
                  </div>
                  <!-- 剩余周数 -->
                  <div v-if="item.title === '剩余周数' && item.flag">
                    <p>{{ scope.row.remaining_week }}</p>
                  </div>
                  <!-- 放课/结课时间 -->
                  <div v-if="item.title === '放课/结课时间' && item.flag">
                    <p>
                      {{
                        scope.row.course_day !== '0'
                          ? formatDate(scope.row.course_day).substring(0, 10)
                          : '-'
                      }}
                    </p>
                    <p>
                      {{
                        scope.row.end_course_day !== '0'
                          ? formatDate(scope.row.end_course_day).substring(
                              0,
                              10
                            )
                          : '-'
                      }}
                    </p>
                  </div>
                  <!-- 课包类型 -->
                  <div v-if="item.title === '课包类型' && item.flag">
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
                      v-if="
                        scope.row.user_status === 11 ||
                          scope.row.user_status === 12
                      "
                    >
                      半年课
                    </p>
                    <p>
                      {{
                        scope.row.order_time !== '0'
                          ? formatDate(scope.row.order_time)
                          : '-'
                      }}
                    </p>
                  </div>
                  <!-- 最近一条服务记录 -->
                  <div v-if="item.title === '最近一条服务记录' && item.flag">
                    <p v-if="scope.row.lastUserFollowLog">
                      {{
                        scope.row.lastUserFollowLog.ctime !== '0'
                          ? formatDate(scope.row.lastUserFollowLog.ctime)
                          : '-'
                      }}
                    </p>
                    <p v-if="scope.row.lastUserFollowLog">
                      <span
                        v-for="(item, index) in scope.row.lastUserFollowLog
                          .content"
                        :key="index"
                      >
                        <span v-if="index < 31">{{ item }}</span>
                      </span>
                      <span
                        v-if="scope.row.lastUserFollowLog.content.length >= 30"
                      >
                        <el-popover
                          placement="top-start"
                          width="200"
                          trigger="click"
                          :content="scope.row.lastUserFollowLog.content"
                        >
                          <span slot="reference">...</span>
                        </el-popover>
                      </span>
                    </p>
                    <p v-if="!scope.row.lastUserFollowLog">-</p>
                  </div>
                  <!-- 最近一次活跃 -->
                  <div v-if="item.title === '最近一次活跃' && item.flag">
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
                  </div>
                  <!-- 销售/班级 -->
                  <div v-if="item.title === '销售/班级' && item.flag">
                    <p>
                      {{ scope.row.trialrealname || '-' }} ({{
                        scope.row.trialteamname || '-'
                      }})
                    </p>
                    <p>{{ scope.row.trialdepartmentname || '' }}</p>
                  </div>
                  <!-- 续费次数 -->
                  <div v-if="item.title === '续费次数' && item.flag">
                    <p>
                      {{
                        scope.row.continue_order_count
                          ? scope.row.continue_order_count
                          : 0
                      }}
                    </p>
                  </div>
                </template>
              </el-table-column>
            </div>
            <!-- <el-table-column label="" width="60" fixed="right">
              <template slot-scope="scope">
                <Outbound
                  :phoneData="scope.row"
                  :key="scope.row.utime"
                ></Outbound>
              </template>
            </el-table-column> -->
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
    <!-- 数据统计 -->

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
    <coupon-popover
      ref="couponDialog"
      :couponData="couponData"
      :selectUserId="[studentid]"
    />
    <!-- <label-checkbox
      v-if="showDialogFormVisible"
      :labelRowValue="labelRowValue"
      @onRefresh="onRefresh"
      ref="labelCheckbox"
    /> -->
  </div>
</template>
<script>
import TableSetColumn from '../../components/TableSetColumn.vue'
import SystemSidebar from '../../components/system/SystemSidebar.vue'
import SearchSystem from '../../components/SearchSysrem-v3.vue'
import MPagination from '@/components/MPagination/index.vue'
import NewBaseUserInfo from '@/components/BaseUserInfo/Base.vue'
// import BaseUserInfo from '../../components/BaseUserInfo.vue'
// import labelCheckbox from '../../components/labelCheckboxSystem'
import ModifyAddress from '../../components/ModifyAddress.vue'
import enums from '../../components/searchData'
import { formatData, openBrowserTab } from '@/utils/index'
import { FOLLOW_EXPRESS_STATUS, ISREFUND } from '@/utils/enums'
import {courseLevelReplace} from '@/utils/supList'
import CouponPopover from '../../../studentTeam/components/TabPane/components/couponPopover'
export default {
  name: 'systemUsers',
  components: {
    SearchSystem,
    MPagination,
    TableSetColumn,
    // BaseUserInfo,
    SystemSidebar,
    // HandleItemStatus,
    // ItemStatus,
    ModifyAddress,
    // labelCheckbox,
    NewBaseUserInfo,
    CouponPopover
  },
  computed: {
    searchParams() {
      return {
        ...this.search,
        ...this.filterParams
        // life_cycle: this.life_cycle.split(',')
      }
    }
  },
  data() {
    return {
      courseLevelReplace,
      openColumnLsit: false,
      columnLsit: false, // 判断是否存在列表
      keyDate: '', // 重置table key
      life_cycle: '0,1,2,3,91,92', // 0 待开始；1 上课中；2 已结课; 3-已停课 91 已退费; 92 已转出
      currentPage: 1,
      system_page_menu: null,
      totalElements: 0,
      totalPages: 1,
      dataList: [],
      tableList: {
        expression: {
          column: [],
          fontSize: '12px'
        }
      },
      isOpened: true,
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
        flagcount: 'desc',
        flag_total_count: 'desc',
        activecount: 'desc',
        taskcount: 'desc',
        open_app_count: 'desc' // 打开app
      },
      sortActive: '',
      couponData: [],
      currentUser: {}, // 当前选择用户
      departmentId: '', // 部门ID
      studentid: '',
      teacher_: {},
      filterParams: {},
      currentDate: ''
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
    if (Object.keys(this.$route.query).length > 0) {
      // 修改2处ui(可能造成额外两次请求)
      this.life_cycle = '0'
      const key = Object.keys(this.$route.query)[0]
      this.$root.$emit(key + '_lk', this.$route.query[key])
    }
  },
  methods: {
    // 操作列的下拉
    handleColumnCommand(command, user = {}, index) {
      console.log(command, user, index)
      this.currentUser = user
      this.studentid = user.studentid
      this.$refs.couponDialog.issueCoupons = true
      this.$refs.couponDialog.couponsTime = ''
      // switch (command) {
      //   // 沟通备注
      //   case '1':
      //     if (!user.userIntention || +user.userIntention.type === 0) {
      //       this.createIntention(index, user.id)
      //     } else {
      //       this.intentDescribeChange(index, user.id)
      //     }
      //     break
      //   // 催发地址短信
      //   case '2':
      //     this.sendMessage(true)
      //     break
      //   // 优惠券
      //   case '3':
      //     this.studentid = user.studentid
      //     this.$refs.couponDialog.issueCoupons = true
      //     this.$refs.couponDialog.couponsTime = ''
      //     break
      //   // 加标签
      //   case '4':
      //     this.onLabel()
      //     break
      // }
    },
    systemStudentSystemPageMenu() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      //   const teacher = {}
      //   if (!Object.keys(this.searchParams).includes('teacherid')) {
      //     Object.assign(teacher, {
      //       teacherid: this.teacherIds
      //     })
      //   }
      const query = Object.assign({})
      this.$http.User.systemStudentSystemPageMenu(query)
        .then((res) => {
          this.system_page_menu = res.data.StudentSystemPageMenu
        })
        .then(() => {
          this.getTeacherFollowGroup()
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    getTeacherFollowGroup() {
      const value = JSON.parse(localStorage.getItem('staff'))
      const data = {
        cid: value.id,
        type: 'PERSONAL',
        systemType: 'BOSS',
        pageCode: 'boss_system_student_list_page'
      }
      this.$http.User.getTeacherFollowGroups(data)
        .then((res) => {
          console.log(res.payload[res.payload.length - 1], '获取自定义列表')
      
          if (res.code === 0) {
            if (res.payload.length > 0) {
              this.columnLsit = true
              res.payload[res.payload.length - 1].expression = JSON.parse(
                res.payload[res.payload.length - 1].expression
              )
              this.keyDate = new Date().getTime()
              this.tableList = res.payload[res.payload.length - 1]
              
            } else {
              this.tableList = {
                expression: {
                  column: [
                    { title: '学员信息', flag: true, size: '160' },
                    { title: '微信信息', flag: true, size: '140' },
                    { title: '学习进度', flag: true, size: '140' },
                    { title: '学习概况', flag: true, size: '190' },
                    { title: '辅导老师/班级', flag: true, size: '210' },
                    { title: '加微', flag: true, size: '70' },
                    { title: '进群', flag: true, size: '70' },
                    { title: '剩余周数', flag: true, size: '90' },
                    { title: '放课/结课时间', flag: true, size: '160' },
                    { title: '课包类型', flag: true, size: '160' },
                    { title: '最近一条服务记录', flag: true, size: '220' },
                    { title: '最近一次活跃', flag: true, size: '160' },
                    { title: '销售/班级', flag: true, size: '190' },
                    { title: '续费次数', flag: true, size: '90' }
                  ],
                  fontSize: '12px'
                }
              }
              this.keyDate = new Date().getTime()
            }
          }
        })
        .then((res) => {
          this.openColumnLsit = true
        })
    },
    // 修改列表
    tableSet(val) {
      const value = JSON.parse(localStorage.getItem('staff'))
      console.log(this.columnLsit, 'columnLsit-------------')
      let params
      if (val) {
        params = {
          column: val,
          fontSize: this.tableList.expression.fontSize
        }
      } else {
        params = {
          column: this.tableList.expression.column,
          fontSize: this.tableList.expression.fontSize
        }
      }
      const data = {
        teacherId: value.id,
        type: 'PERSONAL',
        systemType: 'BOSS',
        pageCode: 'boss_system_student_list_page',
        name: '系统课学员自定义排版',
        expression: JSON.stringify(params)
      }
      if (this.columnLsit) {
        const obj = Object.assign(data, { id: this.tableList.id })
        this.$http.User.updateTeacherFollowGroup(obj).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.keyDate = new Date().getTime()
            res.payload.expression = JSON.parse(res.payload.expression)
            this.tableList = res.payload
          }
        })
      } else {
        this.$http.User.addTeacherFollowGroup(data).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.columnLsit = true
            this.keyDate = new Date().getTime()
            res.payload.expression = JSON.parse(res.payload.expression)
            this.tableList = res.payload
          }
        })
      }
    },
    // 修改字号
    async handleFontSize(res) {
      console.log('字号', res)
      this.tableList.expression.fontSize = (await res) + 'px'
      this.tableSet()
    },
    // 获取一行数据
    hoverRow(row, column, cell, event) {
      // console.log(row, column)
      this.labelRowValue = row
      this.showDialogFormVisible = true
    },
    // 多选
    handleSelectionChange(data) {
      console.log(data)
    },
    getFilter(data) {
      this.filterParams = data || {}
      console.log(this.filterParams, 'filter')
    },
    // 左侧伸缩开关
    handleToggle(data) {
      this.isOpened = data
    },
    handLeCopy(row) {
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
      this.systemStudentSystemPageMenu()
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
      if (this.searchParams && !this.searchParams.life_cycle) {
        this.searchParams.life_cycle = ['0', '1', '2', '3', '91']
      }
      const query = Object.assign({}, this.searchParams)
      console.log(query)
      const page = this.currentPage
      const sort = {}
      if (this.sortActive) {
        sort[this.sortActive] = this.sortKeys[this.sortActive]
      }
      this.$http.User.systemCourseUsers(query, page, sort)
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
        this.$http.User.systemCourseUsers(
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
      this.$http.User.updateTeamStudent(params).then((res) => {
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
    // 点击用户信息回调事件
    userHandle(user) {
      const { username, studentid, mobile } = user
      // 新标签打开详情页
      studentid &&
        openBrowserTab(
          `/music_app/#/details/${studentid}`,
          `学员：${username || mobile}`
        )
    },
    // 推荐人
    openRecommender(row) {
      openBrowserTab(`/music_app/#/details/${row.user_info.sender.id}`)
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
          `/student-team/#/teamDetail/${teamid}/${teamtype}`,
          `${teamname}`
        )
    },
    // 搜索框收缩
    calcToggleawayHeight(data) {
      if (!data) {
        this.tableHeight = this.$refs.systemCon.offsetHeight - 60 + 'px'
      } else {
        const tableHeight =
          document.body.clientHeight - this.$refs.tableInner.offsetTop - 90
        this.tableHeight = tableHeight + ''
      }
    },
    // 操作列的下拉
    // handleColumnCommand(command, user = {}, index) {
    //   console.log(command, user, index)
    //   this.currentUser = user
    //   switch (command) {
    //     // 沟通备注
    //     case '1':
    //       if (!user.userIntention || +user.userIntention.type === 0) {
    //         this.createIntention(index, user.id)
    //       } else {
    //         this.intentDescribeChange(index, user.id)
    //       }
    //       break
    //     // 催发地址短信
    //     case '2':
    //       this.sendMessage(true)
    //       break
    //     // 优惠券
    //     case '3':
    //       this.studentid = user.studentid
    //       this.$refs.couponDialog.issueCoupons = true
    //       this.$refs.couponDialog.couponsTime = ''
    //       break
    //     // 加标签
    //     case '4':
    //       this.onLabel()
    //       break
    //   }
    // },
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
.user-list {
  background-color: rgba(0, 0, 0, 0.1);
}
.d-flex {
  display: flex;
  &.column {
    flex-direction: column;
  }
  &.wrap {
    flex-wrap: wrap;
  }
  &.align-center {
    align-items: center;
  }
  &.align-start {
    align-items: flex-start;
  }
  &.justify-center {
    justify-content: center;
  }
  &.justify-around {
    justify-content: space-around;
  }
  &.justify-between {
    justify-content: space-between;
  }
  .flex-1 {
    flex: 1;
  }
}
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
$primary-color: rgb(255, 139, 140);
.sys-v2-situation {
  color: $primary-color;
}
.sys-set {
  margin-left: 20px;
}
.sys-v2-el-checkbox-group {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  min-width: 190px;
}
.sys-v2-head {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.sys-v2-background {
  background: #e7f7ff;
}
.sys-v2-head-father {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.sys-v2-head-father-right {
  margin-left: 5px;
}
</style>
