<!--
 * @Descripttion: 体验课学员列表 v2.0
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-16 16:27:14
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-09 23:38:25
-->
<template>
  <div class="user-list">
    <div class="trial-header" v-if="!teamIdProp">
      <el-tabs v-model="term">
        <el-tab-pane
          :label="mg.period_label"
          :name="mg.period"
          :key="mg.period"
          v-for="mg in manageMentList"
        ></el-tab-pane>
        <el-tab-pane label="全部期学员" name="0"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- container -->
    <div class="trial-container d-flex">
      <div
        class="trial-container-sidebar d-flex"
        :class="{ closed: !isOpened }"
        v-if="!teamIdProp"
      >
        <!-- 体验课左侧快捷切换 -->
        <trial-sidebar
          :key="currentDate"
          :todayTotal="todayTotal"
          :tomorrowTotal="tomorrowTotal"
          @filter="getFilter"
          @toggle="handleToggle"
          ref="sidebar"
        />
      </div>
      <div class="trial-container-body">
        <!-- search section -->
        <search
          ref="searchC"
          v-if="paramsToSearch.term && !teamIdProp"
          @search="getSearchQuery"
          :searchProp="searchProp"
          :paramsToSearch="paramsToSearch"
        />

        <!-- 操作区 -->
        <div class="handle-section" v-if="!teamIdProp">
          <el-button size="mini" @click="sendMessage(false)"
            >地址催发短信</el-button
          >
        </div>
        <!-- 数据统计 -->
        <div class="statistics-section d-flex justify-between align-center">
          <div class="statistics-section-left">
            当前结果：学员共计 {{ totalElements }} 名
          </div>
          <div class="statistics-section-right">
            点击列表中参课、完课、作品、点评、活跃信息可查看详情
            <tool-tip />
          </div>
        </div>
        <!-- dom -->
        <div class="tableInner" ref="tableInner"></div>
        <!-- table -->
        <el-table
          ref="table"
          v-if="+tableHeight !== 0"
          :height="tableHeight"
          :data="dataList"
          empty-text=" "
          :cell-class-name="cellHover"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @cell-mouse-enter="hoverRow"
        >
          <!-- 不能继续用selection-change，因为在两页都有选中的情况下，切回第一页也会触发selection-change，并且返回值是空，无法判断是用户点击触发的还是翻页时触发的 -->
          <!-- @selection-change="handleSelectionChange" -->
          <el-table-column
            type="selection"
            width="30"
            v-if="showMode === 'trialUserListMode'"
          ></el-table-column>
          <el-table-column label="学员" min-width="100" fixed>
            <template slot-scope="scope">
              <extend-user-info
                :user="scope.row.userInfo"
                :sys-label="scope.row.sys_label"
                :is-head="false"
              />
            </template>
          </el-table-column>
          <!-- TODO:这版先不处理 -->
          <el-table-column
            label="微信备注名"
            min-width="100"
            fixed
            v-if="false"
          >
            <template slot-scope="scope">
              <!-- 新增 -->
              <template
                v-if="
                  scope.row.userInfo &&
                    scope.row.userInfo.jluserInfo &&
                    scope.row.userInfo.jluserInfo.remark
                "
              >
                <div class="d-flex">
                  <el-popover
                    class="flex-1"
                    placement="top-start"
                    trigger="hover"
                    :content="scope.row.userInfo.jluserInfo.remark"
                  >
                    <div slot="reference" class="remarks-text">
                      {{ scope.row.userInfo.jluserInfo.remark }}
                    </div>
                  </el-popover>
                  <i
                    class="el-icon-edit"
                    @click="
                      handleMofifyWechatRemark(
                        scope.$index,
                        scope.row.userInfo,
                        1
                      )
                    "
                  ></i>
                </div>
              </template>
              <!-- 编辑 -->
              <template v-else>
                <i
                  class="el-icon-circle-plus-outline intention-icon"
                  @click="
                    handleMofifyWechatRemark(
                      scope.$index,
                      scope.row.userInfo,
                      0
                    )
                  "
                ></i>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="APP信息" min-width="130" class-name="pdl-10">
            <template slot-scope="scope">
              <base-user-info :user="scope.row.userInfo" />
            </template>
          </el-table-column>
          <el-table-column label="意向度" min-width="70">
            <template slot-scope="scope">
              <template
                v-if="
                  !scope.row.userIntention ||
                    +scope.row.userIntention.type === 0
                "
              >
                <i
                  class="el-icon-circle-plus-outline intention-icon"
                  @click="createIntention(scope.$index, scope.row.id)"
                ></i>
              </template>
              <template v-else>
                <el-select
                  v-model="scope.row.userIntention.type_name"
                  size="mini"
                  class="intent-select"
                  @change="intentChange($event, scope.$index)"
                  :class="[
                    {
                      'intent-select-none': +scope.row.userIntention.type === 4,
                      'intent-select-high': +scope.row.userIntention.type === 3,
                      'intent-select-middle':
                        +scope.row.userIntention.type === 2,
                      'intent-select-low': +scope.row.userIntention.type === 1
                    }
                  ]"
                  popper-class="intent-option"
                >
                  <el-option label="无" value="NONE"></el-option>
                  <el-option label="低" value="LOW"></el-option>
                  <el-option label="中" value="MIDDLE"></el-option>
                  <el-option label="高" value="HIGH"></el-option>
                </el-select>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="沟通备注" min-width="150">
            <template slot-scope="scope">
              <template
                v-if="
                  !scope.row.userIntention ||
                    +scope.row.userIntention.type === 0
                "
              >
                <i
                  class="el-icon-circle-plus-outline intention-icon"
                  @click="createIntention(scope.$index, scope.row.id)"
                ></i>
              </template>
              <template
                v-else-if="
                  !scope.row.userIntention.describe &&
                    +scope.row.userIntention.is_track === 0
                "
              >
                <i
                  class="el-icon-circle-plus-outline intention-icon"
                  @click="intentDescribeChange(scope.$index, scope.row.id)"
                ></i>
              </template>
              <template v-else>
                <div class="remarks-content">
                  <div class="d-flex flex-1 align-center">
                    <span
                      class="time-icon-text"
                      v-if="
                        +scope.row.userIntention.today === today &&
                          +scope.row.userIntention.is_track === 1
                      "
                      ><span class="time-icon-text-t red-color">今</span
                      ><svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#iconnaozhong"></use></svg
                    ></span>
                    <span
                      class="time-icon-text"
                      v-if="
                        +scope.row.userIntention.today === tomorrow &&
                          +scope.row.userIntention.is_track === 1
                      "
                      ><span class="time-icon-text-t red-color">明</span
                      ><svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#iconnaozhong"></use></svg
                    ></span>
                    <el-popover
                      class="flex-1"
                      placement="top-start"
                      trigger="hover"
                      :content="scope.row.userIntention.describe"
                    >
                      <div slot="reference" class="remarks-text">
                        {{ scope.row.userIntention.describe }}
                      </div>
                    </el-popover>
                  </div>
                  <i
                    class="el-icon-edit"
                    @click="intentDescribeChange(scope.$index, scope.row.id)"
                  ></i>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="手动标签" min-width="150">
            <template slot-scope="scope">
              <template v-if="!scope.row.user_label">
                <span>-</span>
              </template>
              <template v-else>
                <div class="remarks-content tag-box">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    @show="tagPopoverShow(scope.row)"
                  >
                    <div
                      v-if="!tagPopoverData"
                      v-loading="true"
                      style="width: 200px;height: 200px"
                    ></div>
                    <tags-popover
                      ref="tagPopover"
                      v-if="tagPopoverData"
                      :tagPopoverData="tagPopoverData"
                    ></tags-popover>
                    <div slot="reference">
                      <tags-item
                        v-for="(item, index) in scope.row.user_label.split(',')"
                        :key="index"
                        :text="item"
                      ></tags-item>
                    </div>
                  </el-popover>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="参课"
            min-width="80"
            v-if="
              showMode === 'trialUserListMode' ||
                showMode === 'classesOngoingListMode' ||
                showMode === 'classesCompleteListMode'
            "
          >
            <template slot="header">
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
                          (sortKeys['join_course_count'] != 'asc' &&
                            sortActive == 'join_course_count') ||
                          (sortKeys['last_join_time'] != 'asc' &&
                            sortActive == 'last_join_time')
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          (sortKeys['join_course_count'] == 'asc' &&
                            sortActive == 'join_course_count') ||
                          (sortKeys['last_join_time'] == 'asc' &&
                            sortActive == 'last_join_time')
                      }"
                    ></i>
                  </div>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="join_course_count">
                    <div class="sort-operate-box">
                      <span>按节数</span>
                      <div class="sort-icon-arrow">
                        <i
                          class="el-icon-caret-top top-color"
                          :class="{
                            active:
                              sortKeys['join_course_count'] != 'asc' &&
                              sortActive == 'join_course_count'
                          }"
                        ></i>
                        <i
                          class="el-icon-caret-bottom bottom"
                          :class="{
                            active:
                              sortKeys['join_course_count'] == 'asc' &&
                              sortActive == 'join_course_count'
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
              <div @click="showHoverUser(scope.row, 'course')">
                <p>
                  <span class="red-color">{{
                    scope.row.join_course_count
                  }}</span
                  >节
                </p>
                <p>
                  {{ formatDate(scope.row.last_join_time, 'shortDay') || '-' }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="完课"
            min-width="80"
            v-if="
              showMode === 'trialUserListMode' ||
                showMode === 'classesOngoingListMode' ||
                showMode === 'classesCompleteListMode'
            "
          >
            <template slot="header">
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
                          (sortKeys['complete_course_count'] != 'asc' &&
                            sortActive == 'complete_course_count') ||
                          (sortKeys['last_complete_time'] != 'asc' &&
                            sortActive == 'last_complete_time')
                      }"
                    ></i>
                    <i
                      class="el-icon-caret-bottom bottom"
                      :class="{
                        active:
                          (sortKeys['complete_course_count'] == 'asc' &&
                            sortActive == 'complete_course_count') ||
                          (sortKeys['last_complete_time'] == 'asc' &&
                            sortActive == 'last_complete_time')
                      }"
                    ></i>
                  </div>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="complete_course_count">
                    <div class="sort-operate-box">
                      <span>按节数</span>
                      <div class="sort-icon-arrow">
                        <i
                          class="el-icon-caret-top top-color"
                          :class="{
                            active:
                              sortKeys['complete_course_count'] != 'asc' &&
                              sortActive == 'complete_course_count'
                          }"
                        ></i>
                        <i
                          class="el-icon-caret-bottom bottom"
                          :class="{
                            active:
                              sortKeys['complete_course_count'] == 'asc' &&
                              sortActive == 'complete_course_count'
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
              <div @click="showHoverUser(scope.row, 'course')">
                <p>
                  <span class="red-color">{{
                    scope.row.complete_course_count
                  }}</span
                  >节
                </p>
                <p>
                  {{
                    formatDate(scope.row.last_complete_time, 'shortDay') || '-'
                  }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="作品"
            min-width="60"
            v-if="
              showMode === 'trialUserListMode' ||
                showMode === 'classesOngoingListMode' ||
                showMode === 'classesCompleteListMode'
            "
          >
            <template slot="header">
              <div class="sort-operate-box" @click="sortRules('task_count')">
                <span>作品</span>
                <div class="sort-icon-arrow">
                  <i
                    class="el-icon-caret-top top-color"
                    :class="{
                      active:
                        sortKeys['task_count'] != 'asc' &&
                        sortActive == 'task_count'
                    }"
                  ></i>
                  <i
                    class="el-icon-caret-bottom bottom"
                    :class="{
                      active:
                        sortKeys['task_count'] == 'asc' &&
                        sortActive == 'task_count'
                    }"
                  ></i>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div @click="showHoverUser(scope.row, 'course')">
                <p v-if="scope.row.task_count > 0">
                  <span>{{ scope.row.task_count }}张</span>
                </p>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="点评"
            min-width="60"
            v-if="
              showMode === 'trialUserListMode' ||
                showMode === 'classesOngoingListMode' ||
                showMode === 'classesCompleteListMode'
            "
          >
            <template slot="header">
              <div
                class="sort-operate-box"
                @click="sortRules('listen_comment_count')"
              >
                <span>点评</span>
                <div class="sort-icon-arrow">
                  <i
                    class="el-icon-caret-top top-color"
                    :class="{
                      active:
                        sortKeys['listen_comment_count'] != 'asc' &&
                        sortActive == 'listen_comment_count'
                    }"
                  ></i>
                  <i
                    class="el-icon-caret-bottom bottom"
                    :class="{
                      active:
                        sortKeys['listen_comment_count'] == 'asc' &&
                        sortActive == 'listen_comment_count'
                    }"
                  ></i>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div @click="showHoverUser(scope.row, 'course')">
                <p>
                  已听:
                  <span>{{ scope.row.listen_comment_count }}</span>
                </p>
                <p>点评: {{ scope.row.comment_count }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="活跃信息"
            min-width="130"
            v-if="
              showMode === 'trialUserListMode' ||
                showMode === 'classesOngoingListMode' ||
                showMode === 'classesCompleteListMode'
            "
          >
            <template slot-scope="scope">
              <div @click="showHoverUser(scope.row, 'activeLog')">
                <template v-if="scope.row.userBehaviorLogInfo">
                  <p>
                    {{ scope.row.userBehaviorLogInfo.action_type_text || '-' }}
                  </p>
                  <p>
                    {{
                      formatDate(
                        scope.row.userBehaviorLogInfo.action_time,
                        's'
                      ) || '-'
                    }}
                  </p>
                </template>
                <p v-else>-</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="添加微信" min-width="60">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.added_wechat"
                active-color="#3582fb"
                inactive-color="#DCDFE6"
                :active-value="1"
                :inactive-value="0"
                @change="
                  changeSwitch($event, scope.row, scope.$index, 'wechat')
                "
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="进群" min-width="60">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.added_group"
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
            </template>
          </el-table-column>
          <el-table-column label="盒子物流" min-width="80">
            <template slot-scope="scope">
              <div class="d-flex align-center space-between">
                <p
                  :class="{
                    'red-color':
                      scope.row.expressInfo &&
                      +scope.row.expressInfo.express_status === 0
                  }"
                >
                  {{
                    expressStatus(
                      scope.row.expressInfo &&
                        scope.row.expressInfo.express_status
                    )
                  }}
                </p>
                <!-- 待审核状态需要编辑物流地址，这版先不做 -->
                <!--  +scope.row.expressInfo.express_status === 6 -->
                <i
                  class="el-icon-edit"
                  v-if="
                    scope.row.expressInfo &&
                      +scope.row.expressInfo.express_status === 0
                  "
                  @click="modifyAddress(scope.row)"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="归属地"
            min-width="100"
            v-if="showMode === 'trialUserListMode'"
          >
            <template slot-scope="scope">
              <p
                v-if="
                  scope.row.userInfo &&
                    scope.row.userInfo.mobile_province &&
                    scope.row.userInfo.mobile_city
                "
              >
                {{ scope.row.userInfo.mobile_province }} ·
                {{ scope.row.userInfo.mobile_city }}
              </p>
              <p
                v-else-if="
                  (scope.row.userInfo && scope.row.userInfo.mobile_province) ||
                    (scope.row.userInfo && scope.row.userInfo.mobile_city)
                "
              >
                {{
                  scope.row.userInfo.mobile_province ||
                    scope.row.userInfo.mobile_city
                }}
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="APP登录" min-width="140">
            <template slot-scope="scope">
              <p v-if="scope.row.userLoginDataInfo">
                {{ scope.row.userLoginDataInfo.device_type }}
              </p>
              <p>
                {{
                  scope.row.last_login_time !== '0'
                    ? formatDate(scope.row.last_login_time)
                    : '-'
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="调查问卷"
            min-width="80"
            v-if="showMode === 'trialUserListMode'"
          >
            <template slot="header">
              <div
                class="sort-operate-box"
                @click="sortRules('questionnaire_count')"
              >
                <span>调查问卷</span>
                <div class="sort-icon-arrow">
                  <i
                    class="el-icon-caret-top top-color"
                    :class="{
                      active:
                        sortKeys['questionnaire_count'] != 'asc' &&
                        sortActive == 'questionnaire_count'
                    }"
                  ></i>
                  <i
                    class="el-icon-caret-bottom bottom"
                    :class="{
                      active:
                        sortKeys['questionnaire_count'] == 'asc' &&
                        sortActive == 'questionnaire_count'
                    }"
                  ></i>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <span v-if="!scope.row.questionnaire_count">
                0
              </span>
              <el-button
                v-else
                type="text"
                @click="clickQuestionaire(scope.row.userInfo)"
              >
                {{ scope.row.questionnaire_count }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="销售/班级"
            min-width="160"
            v-if="showMode === 'trialUserListMode'"
          >
            <template slot-scope="scope">
              <p>
                {{
                  scope.row.teacherInfo && scope.row.teacherInfo.realname
                    ? scope.row.teacherInfo.realname
                    : '-'
                }}
                <span
                  class="btn-text"
                  @click="openTeam(scope.row)"
                  v-if="
                    scope.row.teamInfo &&
                      scope.row.teamInfo.team_name &&
                      scope.row.teamInfo.team_name !== '-'
                  "
                  >({{ scope.row.teamInfo.team_name }})</span
                >
                <span v-else>-</span>
              </p>
              <p>
                {{
                  scope.row.teacherInfo &&
                  scope.row.teacherInfo.departmentInfo &&
                  scope.row.teacherInfo.departmentInfo.name
                    ? scope.row.teacherInfo.departmentInfo.name
                    : '-'
                }}
              </p>
            </template>
          </el-table-column>
          <!-- 渠道：TOSS端 组员 rankId="3"不显示 -->
          <el-table-column
            label="渠道"
            min-width="100"
            v-if="showMode === 'trialUserListMode'"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.payChannelInfo">
                {{ scope.row.payChannelInfo.channel_outer_name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="城市"
            prop="mobile_city"
            min-width="60"
            v-if="
              showMode === 'classesPerpareListMode' ||
                showMode === 'classesOngoingListMode' ||
                showMode === 'classesCompleteListMode'
            "
          >
          </el-table-column>
          <el-table-column label="ID" min-width="55">
            <template slot-scope="scope">
              <p v-if="scope.row.userInfo && scope.row.userInfo.user_num">
                {{ scope.row.userInfo.user_num }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="系统课转化" min-width="65" fixed="right">
            <template slot="header">
              <div
                class="sort-operate-box"
                @click="sortRules('bi_label.keyword')"
              >
                <span>转化</span>
                <div class="sort-icon-arrow">
                  <i
                    class="el-icon-caret-top top-color"
                    :class="{
                      active:
                        sortKeys['bi_label.keyword'] != 'asc' &&
                        sortActive == 'bi_label.keyword'
                    }"
                  ></i>
                  <i
                    class="el-icon-caret-bottom bottom"
                    :class="{
                      active:
                        sortKeys['bi_label.keyword'] == 'asc' &&
                        sortActive == 'bi_label.keyword'
                    }"
                  ></i>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <span
                :class="[
                  {
                    'red-color': scope.row.user_status_name === '未转化'
                  }
                ]"
              >
                {{ scope.row.user_status_name }}
              </span>
              <i
                class="el-icon-bottom"
                style="color: #C60D00;"
                v-if="
                  scope.row.user_status_name === '未转化' &&
                    +scope.row.bi_label === 0
                "
              ></i>
              <i
                class="el-icon-top top-arrow"
                style="color: #4A975A;"
                v-else-if="
                  scope.row.user_status_name === '未转化' &&
                    +scope.row.bi_label === 1
                "
              ></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="60" fixed="right">
            <template slot-scope="scope">
              <el-dropdown
                size="mini"
                @command="handleColumnCommand($event, scope.row, scope.$index)"
                @visible-change="handleCommandChange"
              >
                <span class="el-dropdown-link primary-text">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">沟通备注</el-dropdown-item>
                  <!-- 只有无地址状态的才可以催发地址短信 -->
                  <el-dropdown-item
                    command="2"
                    v-if="
                      scope.row.expressInfo &&
                        +scope.row.expressInfo.express_status === 0
                    "
                    >催发地址短信</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <div
          class="empty-text"
          v-if="dataList.length === 0 && totalElements > -1"
        >
          暂无数据
        </div>

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

    <!-- 无地址页面修改地址弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showModifyAddress"
      width="30%"
      title="添加收货信息"
    >
      <modify-address
        @addExpress="handleModifyAddress"
        :formData="modifyFormData"
        v-if="showModifyAddress"
      />
    </el-dialog>
    <intention-dialog
      ref="intentionDialog"
      @intentConfirm="intentConfirm"
    ></intention-dialog>

    <!-- 调查问卷 -->
    <questionaire-drawer-component
      ref="questionaireDrawerC"
    ></questionaire-drawer-component>

    <!-- 新增自定义人群组 -->
    <!-- <handle-drawer /> -->

    <!-- 用户详情 dialog -->
    <user-info-dialog
      :user="currentHoverUser"
      :tab="currentHoverTab"
      :teamIdProp="teamIdProp"
      @close="handleCloseUserInfoDialog"
      ref="userInfoDialog"
    />

    <!-- 编辑学员微信备注 -->
    <!-- <modify-wechat-remark ref="modifyWechatRemark" /> -->
  </div>
</template>

<script>
import Index from './index'
export default Index
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
/deep/ {
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    right: 5px;
  }
}
</style>
