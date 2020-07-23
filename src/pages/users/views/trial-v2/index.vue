<!--
 * @Descripttion: 体验课学员列表 v2.0
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-16 16:27:14
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-20 17:12:28
-->
<template>
  <div class="user-list">
    <div class="trial-header">
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
      >
        <!-- 体验课左侧快捷切换 -->
        <trial-sidebar
          :key="currentDate"
          :todayTotal="todayTotal"
          :tomorrowTotal="tomorrowTotal"
          @filter="getFilter"
          @toggle="handleToggle"
        />
      </div>
      <div class="trial-container-body">
        <!-- search section -->
        <search
          ref="searchC"
          v-if="paramsToSearch.term"
          @search="getSearchQuery"
          :key="currentDate"
          :searchProp="searchProp"
          :paramsToSearch="paramsToSearch"
        />

        <!-- 操作区 -->
        <div class="handle-section">
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
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="hoverRow"
        >
          <el-table-column type="selection" width="30"> </el-table-column>
          <el-table-column label="用户" min-width="165" fixed>
            <template slot-scope="scope">
              <base-user-info
                :user="scope.row.userInfo"
                @handle-click="userHandle"
              />
            </template>
          </el-table-column>
          <el-table-column label="意向度" min-width="70" class-name="pdl-10">
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
          <el-table-column label="参课" min-width="150">
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
                          (sortKeys['all_join_course_count'] != 'asc' &&
                            sortActive == 'all_join_course_count') ||
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
                          (sortKeys['all_join_course_count'] == 'asc' &&
                            sortActive == 'all_join_course_count') ||
                          (sortKeys['join_course_count'] == 'asc' &&
                            sortActive == 'join_course_count') ||
                          (sortKeys['last_join_time'] == 'asc' &&
                            sortActive == 'last_join_time')
                      }"
                    ></i>
                  </div>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="all_join_course_count">
                    <div class="sort-operate-box">
                      <span>按次数</span>
                      <div class="sort-icon-arrow">
                        <i
                          class="el-icon-caret-top top-color"
                          :class="{
                            active:
                              sortKeys['all_join_course_count'] != 'asc' &&
                              sortActive == 'all_join_course_count'
                          }"
                        ></i>
                        <i
                          class="el-icon-caret-bottom bottom"
                          :class="{
                            active:
                              sortKeys['all_join_course_count'] == 'asc' &&
                              sortActive == 'all_join_course_count'
                          }"
                        ></i>
                      </div>
                    </div>
                  </el-dropdown-item>
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
              <p>
                次数:
                <span>{{ scope.row.all_join_course_count }}</span>
                节数:
                <span class="red-color">{{ scope.row.join_course_count }}</span
                >/{{ scope.row.send_course_count }}
              </p>
              <p>
                最近：{{
                  formatDate(scope.row.last_join_time, 'shortDay') || '-'
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="完课" min-width="140">
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
                          (sortKeys['all_complete_course_count'] != 'asc' &&
                            sortActive == 'all_complete_course_count') ||
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
                          (sortKeys['all_complete_course_count'] == 'asc' &&
                            sortActive == 'all_complete_course_count') ||
                          (sortKeys['complete_course_count'] == 'asc' &&
                            sortActive == 'complete_course_count') ||
                          (sortKeys['last_complete_time'] == 'asc' &&
                            sortActive == 'last_complete_time')
                      }"
                    ></i>
                  </div>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="all_complete_course_count">
                    <div class="sort-operate-box">
                      <span>按次数</span>
                      <div class="sort-icon-arrow">
                        <i
                          class="el-icon-caret-top top-color"
                          :class="{
                            active:
                              sortKeys['all_complete_course_count'] != 'asc' &&
                              sortActive == 'all_complete_course_count'
                          }"
                        ></i>
                        <i
                          class="el-icon-caret-bottom bottom"
                          :class="{
                            active:
                              sortKeys['all_complete_course_count'] == 'asc' &&
                              sortActive == 'all_complete_course_count'
                          }"
                        ></i>
                      </div>
                    </div>
                  </el-dropdown-item>
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
              <p>
                次数:
                <span>
                  {{ scope.row.all_complete_course_count }}
                </span>
                节数:
                <span class="red-color">
                  {{ scope.row.complete_course_count }}</span
                >/{{ scope.row.send_course_count }}
              </p>
              <p>
                最近：{{
                  formatDate(scope.row.last_complete_time, 'shortDay') || '-'
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="传作品" min-width="70">
            <template slot="header">
              <div class="sort-operate-box" @click="sortRules('task_count')">
                <span>传作品</span>
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
              <p v-if="scope.row.task_count > 0">
                <span>{{ scope.row.task_count }}</span>
              </p>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="点评" min-width="100">
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
              <p>
                已听作品:
                <span>{{ scope.row.listen_comment_count }}</span>
              </p>
              <p>点评作品: {{ scope.row.comment_count }}</p>
            </template>
          </el-table-column>
          <el-table-column label="标签" min-width="150">
            <template slot-scope="scope">
              <template
                v-if="!scope.row.user_label || scope.row.user_label === '-'"
              >
                <!-- <i
              class="el-icon-circle-plus-outline intention-icon"
              @click="onLabel"
            ></i> -->
                <p>-</p>
              </template>
              <template v-else>
                <div class="remarks-content">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="scope.row.user_label"
                  >
                    <div slot="reference" class="remarks-text">
                      {{ scope.row.user_label }}
                    </div>
                  </el-popover>
                  <!-- <i class="el-icon-edit" @click="onLabel"></i> -->
                </div>
              </template>
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
          <el-table-column label="归属地" min-width="100">
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
          <el-table-column label="调查问卷" min-width="80">
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
          <el-table-column label="体验课班级·销售" min-width="120">
            <template slot-scope="scope">
              <p v-if="!scope.row.teamInfo">
                -
              </p>
              <p
                v-else-if="
                  scope.row.teamInfo && scope.row.teamInfo.team_name === '-'
                "
              >
                -
              </p>
              <p class="btn-text " v-else @click="openTeam(scope.row)">
                {{ scope.row.teamInfo.team_name }}
              </p>
              <p>
                {{
                  scope.row.teacherInfo && scope.row.teacherInfo.realname
                    ? scope.row.teacherInfo.realname
                    : '-'
                }}
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
          <el-table-column label="渠道" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.payChannelInfo">
                {{ scope.row.payChannelInfo.channel_outer_name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="ID" min-width="55">
            <template slot-scope="scope">
              <p v-if="scope.row.userInfo && scope.row.userInfo.user_num">
                {{ scope.row.userInfo.user_num }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="转化" min-width="65" fixed="right">
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
                  <el-dropdown-item command="3">发优惠券</el-dropdown-item>
                  <!-- <el-dropdown-item command="4">添加标签</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
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
    <!-- <label-checkbox
      v-if="showDialogFormVisible"
      :labelRowValue="labelRowValue"
      @onRefresh="onRefresh"
      ref="labelCheckbox"
    /> -->
    <intention-dialog
      ref="intentionDialog"
      @intentConfirm="intentConfirm"
    ></intention-dialog>

    <!-- 发送优惠券 -->
    <send-coupon
      ref="couponDialog"
      :coupon-data="couponData"
      :select-user-id="[currentUser.id]"
    />

    <!-- 调查问卷 -->
    <questionaire-drawer-component
      ref="questionaireDrawerC"
    ></questionaire-drawer-component>
  </div>
</template>

<script>
import _ from 'lodash'
import { todayTimestamp, tomorrowTimestamp } from '../../utils'
import MPagination from '@/components/MPagination/index.vue'
import BaseUserInfo from '../../components/BaseUserInfo.vue'
import ModifyAddress from '../../components/ModifyAddress.vue'
import enums from '../../components/searchData'
import { formatData, openBrowserTab } from '@/utils/index'
// import labelCheckbox from '../../components/labelCheckbox'
import intentionDialog from '../../components/intentionDialog'
import { FOLLOW_EXPRESS_STATUS } from '@/utils/enums'
import Search from '../../components/Search.vue'
import ToolTip from '../../components/ToolTip.vue'
import SendCoupon from '../../components/SendCoupon.vue'
import TrialSidebar from '../../components/trial/TrialSidebar.vue'
import QuestionaireDrawerComponent from '../../components/trial/QuestionaireDrawerComponent.vue'
export default {
  name: 'trialUsers',
  components: {
    MPagination,
    BaseUserInfo,
    ModifyAddress,
    // labelCheckbox,
    intentionDialog,
    Search,
    ToolTip,
    SendCoupon,
    TrialSidebar,
    QuestionaireDrawerComponent
  },
  computed: {
    searchParams() {
      const search = Object.assign({}, this.search)
      console.log(search)

      if (this.term && +this.term !== 0) {
        Object.assign(search, { term: this.term })
      }
      if (+this.term === 0) {
        delete search.term
      }
      // filter 与 search params 组合
      Object.assign(search, this.filterParams)
      // 系统课转化学员条件冲突，处理交互 TODO: 待优化
      if (this.filterParams) {
        if (this.filterParams.user_status) {
          // 已转化学员
          if (
            this.search.user_status &&
            this.filterParams.user_status.gte === 3
          ) {
            if (this.search.user_status.lte !== 2) {
              Object.assign(search, { user_status: this.search.user_status })
            } else {
              Object.assign(search, { user_status: { gte: 3, lte: 2 } })
            }
          }
          // 未转化学员
          if (
            this.search.user_status &&
            this.filterParams.user_status.lte === 2
          ) {
            if (this.search.user_status.lte !== 2) {
              Object.assign(search, { user_status: { gte: 3, lte: 2 } })
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
    }
  },
  data() {
    return {
      // 查询条件
      search: [],
      term: '',
      currentPage: 1,
      totalElements: 0,
      totalPages: 1,
      dataList: [],
      manageMentList: [], // 排期列表
      conversionType: enums.conversionType,
      showModifyAddress: false,
      showDialogFormVisible: false,
      modifyFormData: {},
      teacherIds: [],
      tableHeight: 0,
      labelRowValue: {},
      curModifyItem: {},
      selectUsers: [], // 批量选择的用户
      currentUser: {}, // 当前选择用户
      couponData: [],
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
      sortActive: '',
      // 0-待开始 1 招生中   2待开课   3 开课中  4 已结课'
      period: {
        0: '待开始',
        1: '招生中',
        2: '待开课 ',
        3: '上课中',
        4: '已结课'
      },
      // 通知中心传给search的值
      searchProp: {},
      // 本页面传给search的值都放在这个对象下
      paramsToSearch: {},
      // 通知中心传过来的期数值
      propTerm: '',
      filterParams: {},
      isOpened: true,
      currentDate: '',
      todayTotal: 0,
      tomorrowTotal: 0
    }
  },
  watch: {
    // 切换期数，清空搜索及筛选项
    term(val, old) {
      if (old === '') return
      // console.log(val, old)
      this.currentDate = new Date().getTime()
      this.search = []
      this.filterParams = {}
      this.paramsToSearch.term = val
      this.$refs.searchC && this.$refs.searchC.changeTerm(val)
      // 切换期数时清空筛选项
      this.$refs.searchC && this.$refs.searchC.resetFilter()
    },

    searchParams(params, oldval) {
      // console.log(params)
      if (
        Object.keys(params).length === 0 &&
        Object.keys(oldval).length === 0
      ) {
        return
      }
      this.currentPage = 1
      this.getData()
      // 获取今日、明日待跟进数量
      setTimeout(() => {
        this.getTodayCount()
        this.getTodayCount('tomorrow')
      }, 500)
    }
  },
  created() {
    // this.$nextTick(() => {
    //   const tableHeight =
    //     document.body.clientHeight - this.$refs.tableInner.offsetTop - 110
    //   this.tableHeight = tableHeight + ''
    // })
    // 消息中心传递过来的预设参数
    this.paramsFromUrl()
    this.init()
  },
  mounted() {
    this.getCouponList()
  },
  methods: {
    paramsFromUrl() {
      const urlParams = localStorage.getItem('noticeParams')
      if (urlParams) {
        this.searchProp = {
          name: urlParams.split(',')[0],
          value: urlParams.split(',')[1]
        }
        // 期数
        let termIndex
        urlParams.split(',').forEach((uItem, uKey) => {
          if (uItem === 'period') {
            termIndex = uKey
          }
        })
        this.propTerm = urlParams.split(',')[termIndex + 1]
      }
    },
    getSearchQuery(res) {
      // console.log(res, 'search result')
      this.search = res
    },
    onRefresh(data) {
      setTimeout(() => {
        this.init()
      }, 1000)
    },
    // 添加标签
    // onLabel() {
    //   this.$refs.labelCheckbox.dialogFormVisible = true
    //   this.$refs.labelCheckbox.getAllTeacherByRoleIds()
    // },
    // 获取一行数据
    hoverRow(row, column, cell, event) {
      this.labelRowValue = row
      this.showDialogFormVisible = true
    },
    async init() {
      await this.getManagement()
      // await this.getData()
    },
    // 获取排期期数
    getManagement() {
      const params = {
        // teacher_id: this.teacherIds
        team_state: [0, 1]
      }
      return this.$http.User.ManagementForTeacherList(params).then((res) => {
        console.log(res)
        if (res && res.data && res.data.ManagementForTeacherList) {
          if (res.data.ManagementForTeacherList.length === 0) {
            this.term = '0'
            this.getData()
            // 获取今日、明日待跟进数量
            setTimeout(() => {
              this.getTodayCount()
              this.getTodayCount('tomorrow')
            }, 500)
            return
          }

          // 只显示开课中和待开课的期数 status // 0 待开始 1 招生中   2待开课   3 开课中  4 已结课',
          const arr = res.data.ManagementForTeacherList.filter(
            (item) =>
              item.management &&
              (+item.management.status === 1 ||
                +item.management.status === 2 ||
                +item.management.status === 3)
          )
          console.log(arr)
          const list = arr.map((item) => {
            item.management.period_label = `${item.management.period_name}(${
              this.period[item.management.status]
            })`

            return item.management
          })

          this.manageMentList = _.orderBy(list, ['status'], ['desc'])
          if (this.propTerm) {
            this.term = this.propTerm
          } else {
            this.term =
              this.manageMentList.length > 0
                ? this.manageMentList[0].period
                : '0'
          }
          // 把参数传给search，获取班级用
          this.paramsToSearch.term = this.term
          // 上面的方法获取到term之后，才会加载search组件，加载完search组件之后才去算table的高
          // 之所以要等是为了避免重绘 ---我是这么想的
          this.$nextTick(() => {
            const tableHeight =
              document.body.clientHeight - this.$refs.tableInner.offsetTop - 90
            this.tableHeight = tableHeight + ''
          })
        }
      })
    },
    getData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })

      // 标签处理
      const obj = {}
      let label = {}
      if (Object.keys(this.searchParams).includes('user_label')) {
        label = {
          'user_label.like': {
            'user_label.keyword': `*${this.searchParams.user_label}*`
          }
        }
        delete obj.user_label
      }
      Object.assign(obj, this.searchParams, label)
      const query = Object.assign({}, obj)

      const page = this.currentPage
      const sort = {}
      if (this.sortActive) {
        sort[this.sortActive] = this.sortKeys[this.sortActive]
      }
      return this.$http.User.trialCourseUsersV2(query, page, sort)
        .then((res) => {
          // console.log(res)
          var defTotalElements = 0
          var defTotalPages = 1
          var defContent = []
          if (res && res.data && res.data.StudentTrialV2StatisticsPage) {
            const {
              totalElements,
              totalPages,
              content
            } = res.data.StudentTrialV2StatisticsPage
            defTotalElements = totalElements
            defTotalPages = totalPages
            // defContent = content
            defContent = this.initName(content)
          }
          this.dataList = defContent
          // console.log('dataList', this.dataList)
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
        switch (+item.user_status) {
          case 0:
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
      })
      return data
    },
    handleSizeChange(page) {
      console.log(page)

      // console.log(this.page)
      this.currentPage = page
      this.getData()
    },

    changeStatus(res) {
      // console.log(res)
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
      // console.log(row)
      /**
        orderId: this.formData.orderid,
        expressId: this.formData.id,
        userId: this.formData.userid,
       */
      const params = {
        userid: row.id,
        orderid:
          (row.orderInfo.trial_course && row.orderInfo.trial_course.order_no) ||
          row.order_no,
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
      this.selectUsers = data
    },

    // 点击用户信息回调事件
    userHandle(user) {
      if (!user || !user.id) {
        this.$message.error('缺少用户信息')
        return
      }
      const { id } = user
      // 新标签打开详情页
      id && openBrowserTab(`/users/#/details/${id}`)
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
      if (!row.teacherInfo || !row.teamInfo || !row.team_id) return
      const teamId = row.team_id
      const teamType = row.teamInfo.team_type || '0'
      teamId &&
        openBrowserTab(`/student-team/#/teamDetail/${teamId}/${teamType}`)
    },

    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    createIntention(index, uid) {
      // 当前修改项
      this.curModifyItem.index = index
      this.curModifyItem.uid = uid
      this.curModifyItem.type = 'create'
      this.$refs.intentionDialog.showDialog()
    },
    // 意向度dialog过来的数据
    intentConfirm(data) {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const IntentionMap1 = new Map()
      IntentionMap1.set('低', 'LOW')
      IntentionMap1.set('中', 'MIDDLE')
      IntentionMap1.set('高', 'HIGH')
      IntentionMap1.set('无', 'NONE')
      const IntentionMap2 = new Map()
      IntentionMap2.set('低', 1)
      IntentionMap2.set('中', 2)
      IntentionMap2.set('高', 3)
      IntentionMap2.set('无', 4)
      const urlMap = new Map()
      // 是新增还是修改
      urlMap.set('create', 'createUserInetention')
      urlMap.set('update', 'updateUserInetention')

      const query = {
        uid: this.curModifyItem.uid,
        type: IntentionMap1.get(data.radio),
        describe: data.textarea,
        ...data.track
      }
      this.$http.User[urlMap.get(this.curModifyItem.type)](query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            const singleData = Object.assign(
              {},
              this.dataList[this.curModifyItem.index].userIntention,
              {
                type: IntentionMap2.get(data.radio),
                type_name: data.radio,
                describe: data.textarea || '',
                is_track: data.track.isTrack,
                today: data.track.today
              }
            )
            this.$set(
              this.dataList[this.curModifyItem.index],
              'userIntention',
              singleData
            )
            this.$message.success('提交成功')
          } else {
            this.$message.error('提交失败')
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
          this.$message.error('更新用户意向度失败')
        })
    },
    // 意向下拉框发生修改
    intentChange(tar, index) {
      const IntentionMap1 = new Map()
      IntentionMap1.set('LOW', '低')
      IntentionMap1.set('MIDDLE', '中')
      IntentionMap1.set('HIGH', '高')
      IntentionMap1.set('NONE', '无')

      const IntentionMap2 = new Map()
      IntentionMap2.set('LOW', 1)
      IntentionMap2.set('MIDDLE', 2)
      IntentionMap2.set('HIGH', 3)
      IntentionMap2.set('NONE', 4)

      if (IntentionMap2.get(tar) === this.dataList[index].userIntention.type) {
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const query = {
        uid: this.dataList[index].id,
        type: tar,
        describe: this.dataList[index].userIntention.describe,
        isTrack: this.dataList[index].userIntention.is_track,
        today: this.dataList[index].userIntention.today
      }
      this.$http.User.updateUserInetention(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            const singleData = Object.assign(
              {},
              this.dataList[index].userIntention,
              {
                type: IntentionMap2.get(tar),
                type_name: IntentionMap1.get(tar)
              }
            )
            this.$set(this.dataList[index], 'userIntention', singleData)
          } else {
            this.$message.error('更新用户意向度失败')
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
          this.$message.error('更新用户意向度失败')
        })
    },
    intentDescribeChange(index, uid) {
      this.curModifyItem.index = index
      this.curModifyItem.uid = uid
      this.curModifyItem.type = 'update'
      this.$refs.intentionDialog.showDialog(this.dataList[index].userIntention)
    },
    // 修改开关
    changeSwitch(val, data, index, type) {
      const params = {
        teamId: data.team_id,
        courseType:
          data.teamInfo && +data.teamInfo.team_type === 0 ? 'TRAIL' : 'YEAR',
        studentId: data.id
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

    // 地址催发短信 @isSingle Boolean， 是否单条发
    sendMessage(isSingle = false) {
      let orderNo = []
      // 批量发送
      if (!isSingle) {
        if (this.selectUsers.length === 0) {
          this.$message.error('请选择学员')
          return
        }
        // 如果选择的学员物流已有地址，则中断并提示
        for (let index = 0; index < this.selectUsers.length; index++) {
          const item = this.selectUsers[index]
          if (item.expressInfo && +item.expressInfo.express_status > 0) {
            this.$message.error('不支持发送给已添加物流地址的学员')
            orderNo = []
            break
          }
          orderNo.push(item.order_no)
        }
      }
      // 单条发送
      else {
        this.currentUser.order_no && orderNo.push(this.currentUser.order_no)
      }
      console.log(orderNo)

      if (orderNo.length === 0) return
      this.$confirm(
        `您即将给用户发送【催发地址短信】，发送人数：${orderNo.length}人`,
        '催发地址短信',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const orderIds = orderNo.join(',')
        console.log(orderIds, 'orderIds')
        this.$http.Order.pushMsgByOrderIds(orderIds)
          .then((res) => {
            if (res.errors) {
              this.$message.error(res.errors)
              return
            }
            this.$message.success('提交成功')
          })
          .catch(() => {
            this.$message.error('提交失败')
          })
      })
    },
    // 操作列的下拉
    handleColumnCommand(command, user = {}, index) {
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
          this.$refs.couponDialog.issueCoupons = true
          this.$refs.couponDialog.couponsTime = ''
          break
        // 加标签
        // case '4':
        //   this.onLabel()
        //   break
      }
    },

    handleCommandChange(visible) {
      if (visible) {
        this.resetCurrentUser()
      }
    },

    // 重置当前选择用户
    resetCurrentUser() {
      this.currentUser = {}
    },

    // 获取优惠券列表
    getCouponList() {
      this.$http.Team.getAllCoupons(0).then((res) => {
        this.couponData = (res.payload && res.payload.content) || []
      })
    },
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
      this.sortActive = sortKey
      this.getData()
    },
    /**
     * 左侧快速切换回调 */
    getFilter(data) {
      console.log(data, 'filter')
      this.filterParams = data || {}

      // 组合搜索条件
      // Object.assign(this.searchParams, this.filterParams)
    },
    handleToggle(data) {
      this.isOpened = data
    },

    // 待跟进数量
    getTodayCount(type = 'today') {
      const params = {
        is_track: 1,
        today: type === 'today' ? this.today : this.tomorrow
      }
      if (+this.term !== 0) {
        Object.assign(params, { term: this.term })
      }
      // console.log(params)

      this.$http.User.trialCourseUsersV2(params, 1, {}).then((res) => {
        if (res && res.data && res.data.StudentTrialV2StatisticsPage) {
          const { totalElements = 0 } = res.data.StudentTrialV2StatisticsPage
          if (type === 'today') this.todayTotal = totalElements
          if (type === 'tomorrow') this.tomorrowTotal = totalElements
        }
      })
    },
    clickQuestionaire(userinfo) {
      const query = {
        uid: userinfo.id,
        mobile: userinfo.mobile,
        page: 1,
        pagesize: 20
      }
      this.$refs.questionaireDrawerC.openDrawer(query)
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
