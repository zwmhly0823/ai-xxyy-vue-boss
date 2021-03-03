<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2021-01-11 20:45:06
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-02-08 18:18:02
-->
<template>
  <div class="team-template">
    <!-- 系统课 -->
    <div
      class="base-common system"
      v-show="
        curTeamTab == 0 && sys_student_details_son.systemCourseOfStudentDetails
      "
    >
      <div class="row-info">
        <div class="_module">
          <p class="_study_info">学习信息</p>
          <div class="_item">
            <span class="label">上课状态：</span>
            <el-tag type="warning" class="tag-setting" size="small">
              {{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .course_state_name
              }}
            </el-tag>
          </div>
          <div class="_item">
            <span class="label">当前级别：</span>
            <span class="val">{{
              sys_student_details_son.systemCourseOfStudentDetails &&
                SUP_LEVEL_ALL[sys_student_details_son.systemCourseOfStudentDetails
                  .current_super]
            }}</span>
          </div>
          <div class="_item">
            <span class="label">学习进度：</span>
            <span class="val">
              {{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  courseLevelReplace(sys_student_details_son.systemCourseOfStudentDetails
                    .current_progress)
              }}
            </span>
          </div>
          <div class="_item">
            <span class="label">参课/放课：</span>
            <span class="val"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .join_course_count
              }}节/{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .send_course_count
              }}节</span
            >
          </div>
          <div class="_item">
            <span class="label">完课/放课：</span>
            <span class="val"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .complete_course_count
              }}节/{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .send_course_count
              }}节</span
            >
          </div>
          <div class="_item">
            <span class="label">上传作品：</span>
            <span class="val"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .task_count
              }}张</span
            >
          </div>
          <div class="_item">
            <span class="label">点评/听点评：</span>
            <span class="val"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .comment_count
              }}次/{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .listen_comment_count
              }}次</span
            >
          </div>
          <div class="_item">
            <span class="label">兼职老师：</span>
            <span class="val">{{
              sys_student_details_son.systemCourseOfStudentDetails &&
                sys_student_details_son.systemCourseOfStudentDetails
                  .casualTeacherInfo &&
                sys_student_details_son.systemCourseOfStudentDetails
                  .casualTeacherInfo.realname
            }}</span>
          </div>
        </div>
        <div class="_module">
          <p class="_study_info">班级信息</p>
          <div class="_item">
            <span class="label">所属班级：</span>
            <span
              class="val special-blue"
              @click="
                openTeam(
                  's',
                  sys_student_details_son.systemCourseOfStudentDetails
                )
              "
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .teamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .team_name
              }}</span
            >
          </div>
          <div class="_item">
            <span class="label">负责教辅：</span>
            <span class="val">
              {{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .teamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.realname
              }}·{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .teamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.name
              }}/{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .teamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo.name
              }}<span
                v-if="
                  sys_student_details_son.systemCourseOfStudentDetails &&
                    sys_student_details_son.systemCourseOfStudentDetails
                      .teamInfo &&
                    sys_student_details_son.systemCourseOfStudentDetails
                      .teamInfo.teacher_info &&
                    sys_student_details_son.systemCourseOfStudentDetails
                      .teamInfo.teacher_info.departmentInfo &&
                    sys_student_details_son.systemCourseOfStudentDetails
                      .teamInfo.teacher_info.departmentInfo
                      .parentDepartmentInfo &&
                    sys_student_details_son.systemCourseOfStudentDetails
                      .teamInfo.teacher_info.departmentInfo.parentDepartmentInfo
                      .parentDepartmentInfo &&
                    sys_student_details_son.systemCourseOfStudentDetails
                      .teamInfo.teacher_info.departmentInfo.parentDepartmentInfo
                      .parentDepartmentInfo.name
                "
                >/</span
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .teamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo
                    .parentDepartmentInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo
                    .parentDepartmentInfo.name
              }}</span
            >
          </div>
          <div class="_item">
            <span class="label">辅导电话：</span>
            <span class="val">{{
              sys_student_details_son.systemCourseOfStudentDetails &&
                sys_student_details_son.systemCourseOfStudentDetails.teamInfo &&
                sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                  .teacher_info &&
                sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                  .teacher_info.phone
            }}</span>
          </div>
          <div class="_item">
            <span class="label">教辅微信：</span>
            <span class="val">{{
              sys_student_details_son.systemCourseOfStudentDetails &&
                sys_student_details_son.systemCourseOfStudentDetails.teamInfo &&
                sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                  .teacher_wechat_info &&
                sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                  .teacher_wechat_info.wechat_no
            }}</span>
          </div>
          <div class="_item">
            <div class="label">加辅导微信：</div>
            <el-switch
              v-model="added_wechat"
              active-color="#3582fb"
              inactive-color="#DCDFE6"
              :active-value="1"
              :inactive-value="0"
              @change="changeSwitch($event, 'wechat')"
            >
            </el-switch>
          </div>
          <div class="_item">
            <div class="label">加班级群：</div>
            <el-switch
              v-model="added_group"
              active-color="#3582fb"
              inactive-color="#DCDFE6"
              :active-value="1"
              :inactive-value="0"
              @change="changeSwitch($event, 'group')"
            >
            </el-switch>
          </div>
          <div class="_item">
            <span class="label">班级结课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .teamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails.teamInfo
                    .class_end
              ).substring(0, 10)
            }}</span>
          </div>
          <div
            class="_item"
            v-if="
              sys_student_details_son.systemCourseOfStudentDetails &&
                sys_student_details_son.systemCourseOfStudentDetails
                  .readyTeamInfo &&
                sys_student_details_son.systemCourseOfStudentDetails
                  .readyTeamInfo.team_name
            "
          >
            <span class="label">即将开课班级：</span>
            <span
              class="val special-blue"
              @click="
                openTeam(
                  'j',
                  sys_student_details_son.systemCourseOfStudentDetails
                )
              "
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .readyTeamInfo &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .readyTeamInfo.team_name
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="row-info">
        <div class="_module">
          <p class="_study_info">报名信息</p>
          <div class="_item">
            <span class="label">首次购买系统课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .first_order_buytime
              )
            }}</span>
          </div>
          <div class="_item">
            <span class="label">系统课订单数：</span>
            <span class="val special-blue" @click="orderList"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .system_order_count
              }}笔订单</span
            >
          </div>
          <div class="_item">
            <span class="label">购买系统课周数：</span>
            <span class="val"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .buy_system_order_weeks
              }}周</span
            >
          </div>
          <div class="_item">
            <span class="label">剩余系统课周数数：</span>
            <span class="val"
              >{{
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .remaining_week
              }}周</span
            >
          </div>
          <div class="_item">
            <span class="label">首次开课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .first_send_course_time
              ).substring(0, 10)
            }}</span>
          </div>
          <div class="_item">
            <span class="label">到期结课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.systemCourseOfStudentDetails &&
                  sys_student_details_son.systemCourseOfStudentDetails
                    .logic_end_course_time
              ).substring(0, 10)
            }}</span>
          </div>
        </div>
        <div class="_module">
          <!-- <p class="_study_info">变更信息</p>
          <div class="_item">
            <span class="label">调级记录：</span>
            <span class="val special-blue">查看信息</span>
          </div>
          <div class="_item">
            <span class="label">调班记录：</span>
            <span class="val special-blue">查看信息</span>
          </div>
          <div class="_item">
            <span class="label">调期记录：</span>
            <span class="val special-blue">查看信息</span>
          </div>
          <div class="_item">
            <span class="label">教辅变更记录：</span>
            <span class="val special-blue">查看信息</span>
          </div> -->
        </div>
      </div>
    </div>
    <!-- 体验课 -->
    <div
      class="base-common trial"
      v-show="curTeamTab == 1 && sys_student_details_son.trialOfStudentDetails"
    >
      <div class="row-info">
        <div class="_module">
          <p>学习信息</p>
          <div class="_item">
            <span class="label">上课状态：</span>
            <el-tag type="warning" class="tag-setting" size="small">
              <div
                v-if="
                  sys_student_details_son.trialOfStudentDetails &&
                    sys_student_details_son.trialOfStudentDetails
                      .course_state === 2
                "
              >
                已结课
              </div>
              <div
                v-if="
                  sys_student_details_son.trialOfStudentDetails &&
                    sys_student_details_son.trialOfStudentDetails
                      .course_state === 1
                "
              >
                上课中
              </div>
              <div
                v-if="
                  sys_student_details_son.trialOfStudentDetails &&
                    sys_student_details_son.trialOfStudentDetails
                      .course_state === 0
                "
              >
                待开课
              </div>
            </el-tag>
          </div>
          <div class="_item">
            <span class="label">当前级别：</span>
            <span class="val">{{
              sys_student_details_son.trialOfStudentDetails &&
                SUP_LEVEL_ALL[sys_student_details_son.trialOfStudentDetails.current_super]
            }}</span>
          </div>
          <div class="_item">
            <span class="label">学习进度：</span>
            <span class="val">
              {{
                sys_student_details_son.trialOfStudentDetails &&
                  courseLevelReplace(sys_student_details_son.trialOfStudentDetails.current_progress)
              }}
            </span>
          </div>
          <div class="_item">
            <span class="label">参课/放课：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .join_course_count
              }}节/{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .send_course_count
              }}节</span
            >
          </div>
          <div class="_item">
            <span class="label">完课/放课：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .complete_course_count
              }}节/{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .send_course_count
              }}节</span
            >
          </div>
          <div class="_item">
            <span class="label">上传作品：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.task_count
              }}张</span
            >
          </div>
          <div class="_item">
            <span class="label">点评/听点评：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.comment_count
              }}次/{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .listen_comment_count
              }}次</span
            >
          </div>
        </div>
        <div class="_module">
          <p>班级信息</p>
          <div class="_item">
            <span class="label">所属班级：</span>
            <span class="val special-blue" @click="openTeam('t')">{{
              sys_student_details_son.trialOfStudentDetails &&
                sys_student_details_son.trialOfStudentDetails.teamInfo &&
                sys_student_details_son.trialOfStudentDetails.teamInfo.team_name
            }}</span>
          </div>
          <div class="_item">
            <span class="label">负责销售：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.realname
              }}·{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.name
              }}/{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo.name
              }}<span
                v-if="
                  sys_student_details_son.trialOfStudentDetails &&
                    sys_student_details_son.trialOfStudentDetails.teamInfo &&
                    sys_student_details_son.trialOfStudentDetails.teamInfo
                      .teacher_info &&
                    sys_student_details_son.trialOfStudentDetails.teamInfo
                      .teacher_info.departmentInfo &&
                    sys_student_details_son.trialOfStudentDetails.teamInfo
                      .teacher_info.departmentInfo.parentDepartmentInfo &&
                    sys_student_details_son.trialOfStudentDetails.teamInfo
                      .teacher_info.departmentInfo.parentDepartmentInfo
                      .parentDepartmentInfo &&
                    sys_student_details_son.trialOfStudentDetails.teamInfo
                      .teacher_info.departmentInfo.parentDepartmentInfo
                      .parentDepartmentInfo.name
                "
                >/</span
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo
                    .parentDepartmentInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .teacher_info.departmentInfo.parentDepartmentInfo
                    .parentDepartmentInfo.name
              }}</span
            >
          </div>
          <div class="_item">
            <span class="label">销售电话：</span>
            <span class="val">{{
              sys_student_details_son.trialOfStudentDetails &&
                sys_student_details_son.trialOfStudentDetails.teamInfo &&
                sys_student_details_son.trialOfStudentDetails.teamInfo
                  .teacher_info &&
                sys_student_details_son.trialOfStudentDetails.teamInfo
                  .teacher_info.phone
            }}</span>
          </div>
          <div class="_item">
            <span class="label">销售微信：</span>
            <span class="val">{{
              sys_student_details_son.trialOfStudentDetails &&
                sys_student_details_son.trialOfStudentDetails.teamInfo &&
                sys_student_details_son.trialOfStudentDetails.teamInfo
                  .teacher_wechat_info &&
                sys_student_details_son.trialOfStudentDetails.teamInfo
                  .teacher_wechat_info.wechat_no
            }}</span>
          </div>
          <div class="_item">
            <div class="label">加销售微信：</div>
            <el-switch
              v-model="t_added_wechat"
              active-color="#3582fb"
              inactive-color="#DCDFE6"
              :active-value="1"
              :inactive-value="0"
              @change="changeSwitch($event, 'twechat')"
            >
            </el-switch>
          </div>
          <div class="_item">
            <div class="label">加班级群：</div>
            <el-switch
              v-model="t_added_group"
              active-color="#3582fb"
              inactive-color="#DCDFE6"
              :active-value="1"
              :inactive-value="0"
              @change="changeSwitch($event, 'tgroup')"
            >
            </el-switch>
          </div>
          <div class="_item">
            <span class="label">班级结课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo &&
                  sys_student_details_son.trialOfStudentDetails.teamInfo
                    .class_end
              ).substring(0, 10)
            }}</span>
          </div>
        </div>
      </div>
      <div class="row-info">
        <div class="_module">
          <p>报名信息</p>
          <div class="_item">
            <span class="label">购买体验课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.orderInfo &&
                  sys_student_details_son.trialOfStudentDetails.orderInfo
                    .buytime
              )
            }}</span>
          </div>
          <div class="_item">
            <span class="label">购买体验课周数：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.orderInfo &&
                  sys_student_details_son.trialOfStudentDetails.orderInfo
                    .packages_course_week
              }}周</span
            >
          </div>
          <div class="_item">
            <span class="label">剩余体验课周数：</span>
            <span class="val"
              >{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.remaining_week
              }}周</span
            >
          </div>
          <div class="_item">
            <span class="label">首次开课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .first_send_course_time
              ).substring(0, 10)
            }}</span>
          </div>
          <div class="_item">
            <span class="label">到期结课时间：</span>
            <span class="val">{{
              formatDate(
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails
                    .logic_end_course_time
              ).substring(0, 10)
            }}</span>
          </div>
        </div>
        <div class="_module">
          <p>转换跟进</p>
          <div class="_item">
            <span class="label"> 意向度：</span>
            <el-dropdown v-if="isFlags" @command="drownDownHandle">
              <el-tag type="warning" size="medium"
                >{{ dropName }}<i class="drown-down-btn"></i
              ></el-tag>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="item"
                  v-for="(item, index) in tagsList"
                  :key="index"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div
              v-else
              class="el-icon-circle-plus-outline"
              @click="editBtn"
            ></div>
          </div>
          <div class="_item">
            <span class="label">沟通备注：</span>
            <span class="val" v-if="isFlag" style="padding-right:20px">
              <span>{{
                sys_student_details_son.trialOfStudentDetails &&
                  sys_student_details_son.trialOfStudentDetails.userIntention &&
                  sys_student_details_son.trialOfStudentDetails.userIntention.describe.substring(
                    0,
                    50
                  )
              }}</span>
              <i
                style="cursor: pointer;"
                class="el-icon-edit"
                @click="editBtn"
              ></i>
            </span>
            <span
              v-else
              class="el-icon-circle-plus-outline"
              @click="editBtn"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 沟通备注 -->
    <div class="talk-remark">
      <intention-dialog
        ref="intentionDialog"
        :remarks="remarks"
        @intentConfirm="intentConfirm"
      ></intention-dialog>
      <!-- <el-dialog
        :visible.sync="showDialog"
        title="沟通备注"
        :before-close="dialogClose"
        :close-on-click-modal="false"
        width="75%"
        top="10vh"
        class="remark-dialog"
      >
        <section class="content">
          <div class="form-item">
            <div class="label">
              <span
                style="color:#e4393c;position:relative;top:-2px;margin: 0 3px;"
                >*</span
              >意向度
            </div>
            <div class="bar">
              <el-radio-group v-model="dialogForm.yixiangdu" size="mini">
                <el-radio-button
                  :label="item.value"
                  v-for="(item, index) in tagsList"
                  :key="index"
                  >{{ item.label }}</el-radio-button
                >
              </el-radio-group>
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              备注
            </div>
            <div class="bar">
              <el-input
                type="textarea"
                v-model="dialogForm.remark"
                placeholder="请输入内容"
                maxlength="200"
                show-word-limit
              ></el-input>
            </div>
          </div>
          <div class="form-item">
            <div class="label">
              下次跟进提醒
            </div>
            <div class="bar">
              <div class="tip">不提醒</div>
              <div class="tip">今天</div>
              <div class="tip">明天</div>
            </div>
          </div>
        </section>
      </el-dialog> -->
    </div>
  </div>
</template>
<script>
// 自定义指令函数
import { formatDateByType } from '@/utils/mini_tool_lk'
import { formatData, openBrowserTab } from '@/utils/index'
import { SUP_LEVEL_ALL,courseLevelReplace } from '@/utils/supList'
import intentionDialog from '../../../components/intentionDialog'
const clickOutside = {
  bind(el, binding) {
    function handler(e) {
      if (el.contains(e.target) || e.target.className.includes(binding.arg)) {
        return false
      }
      if (binding.expression) {
        binding.value(e)
      }
    }
    el._zClickOutside = handler
    document.addEventListener('click', handler)
  },
  unbind(el) {
    // 解除事件监听
    document.removeEventListener('click', el._zClickOutside)
    delete el._zClickOutside
  }
}
export default {
  name: 'teamTmp',
  props: {
    curTeamTab: {
      type: Number,
      default: 0
    },
    sys_student_details: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: { intentionDialog },
  created() {
    console.log('curTeamTab', this.curTeamTab)
  },
  mounted() {
    console.log(this.sys_student_details, 'sys_student_details----------')
  },
  watch: {
    sys_student_details(val) {
      console.log(val, 'val----------------------')
      if (
        val.trialOfStudentDetails &&
        val.trialOfStudentDetails.userIntention &&
        val.trialOfStudentDetails.userIntention.describe
      ) {
        this.isFlag = true
      }
      this.added_group =
        val.systemCourseOfStudentDetails &&
        val.systemCourseOfStudentDetails.added_group
      this.added_wechat =
        val.systemCourseOfStudentDetails &&
        val.systemCourseOfStudentDetails.added_wechat
      this.t_added_group =
        val.trialOfStudentDetails && val.trialOfStudentDetails.added_group
      this.t_added_wechat =
        val.trialOfStudentDetails && val.trialOfStudentDetails.added_wechat
      if (val.systemCourseOfStudentDetails) {
        val.systemCourseOfStudentDetails.course_state_name = this.classState[
          val.systemCourseOfStudentDetails.course_state
        ]
      }
      
      this.sys_student_details_son = val

      if (
        val.trialOfStudentDetails &&
        val.trialOfStudentDetails.userIntention
      ) {
        this.tagsList.forEach((item) => {
          if (
            item.value.toString() ===
            val.trialOfStudentDetails.userIntention.type
          ) {
            this.dropName = item.label
            console.log('走进else')
            this.isFlags = true
          }
        })
      }
      this.remarks = val.trialOfStudentDetails
    }
  },
  data() {
    return {
      SUP_LEVEL_ALL,
      courseLevelReplace,
      isFlag: false,
      isFlags: false,
      remarks: '', // 沟通备注
      added_wechat: 0, // 系统是否加微信
      added_group: 0, // 系统是否进群
      t_added_wechat: 0, // 体验卡是否加微信
      t_added_group: 0, // 体验课是否加微信
      sys_student_details_son: {
        systemCourseOfStudentDetails: {
          teamInfo: {
            teacher_wechat_info: {
              wechat_no: null
            }
          }
        }
      },
      showDialog: false,
      courseType: 0,
      showTags: false,
      dropName: '',
      classState: {
        1: '待开课',
        2: '开课中',
        3: '请假中',
        4: '停课中',
        5: '已退费',
        6: '已结课',
        7: '开课后调级'
      },
      dialogForm: {
        yixiangdu: '1',
        remark: '',
        tip: ''
      },
      tagsList: [
        { label: '高', value: 3 },
        { label: '中', value: 2 },
        { label: '低', value: 1 },
        { label: '无', value: 4 }
      ],
      studentId: this.$route.params.id,
      curModifyItem: {
        type: 'update'
      }
    }
  },
  directives: { clickOutside },
  methods: {
    // communicateRemarks() {
    //   this.isFlag = true
    // },
    // clickIntention() {
    //   this.isFlags = true
    // },
    orderList() {
      this.$emit('orderList', true)
    },
    formatDate(date) {
      return formatData(date, 's')
    },
    // 意向度dialog过来的数据
    intentConfirm(data) {
      this.curModifyItem.type = 'update'
      if (!this.remarks.userIntention) {
        this.curModifyItem.type = 'create'
      }
      console.log('意向度弹框data', data)
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
        uid: this.studentId,
        type: IntentionMap1.get(data.radio) || '',
        describe: data.textarea || '',
        ...data.track
      }
      this.$http.User[urlMap.get(this.curModifyItem.type)](query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            switch (res && res.payload.type) {
              case 'HIGH':
                res.payload.type = '3'
                break
              case 'MIDDLE':
                res.payload.type = '2'
                break
              case 'LOW':
                res.payload.type = '1'
                break
              case 'NONE':
                res.payload.type = '4'
                break
            }
            this.tagsList.forEach((item) => {
              if (item.value.toString() === res.payload.type) {
                this.dropName = item.label
                console.log('走进else')
                this.isFlags = true
              }
            })
            console.log(res, 'eeeeeeeeeeeeeeeeeee')
            this.isFlag = true
            this.sys_student_details_son.trialOfStudentDetails.userIntention = Object.assign(
              {},
              {
                describe: res.payload && res.payload.describe,
                type: res.payload.type,
                id: res.payload.id,
                today: res.payload.today
              }
            )
            this.remarks = Object.assign(
              {},
              this.sys_student_details_son.trialOfStudentDetails
            )
            this.$message.success('提交成功')
          } else {
            this.$message.error('提交失败')
          }
          loading.close()
        })
        .catch((err) => {
          loading.close()
          console.log(err, 'err------------------')
          this.$message.error('更新用户意向度失败')
        })
    },
    editBtn() {
      try {
        const data = {
          type:
            (this.remarks &&
              this.remarks.userIntention &&
              this.remarks.userIntention.type) ||
            '',
          describe:
            (this.remarks &&
              this.remarks.userIntention &&
              this.remarks.userIntention.describe) ||
            '',
          today:
            (this.remarks &&
              this.remarks.userIntention &&
              this.remarks.userIntention.today) ||
            ''
        }
        console.log(data, '父级')
        this.$refs.intentionDialog.showDialog(data)
      } catch (e) {
        console.log(e)
      }
    },
    dialogClose() {},
    drownDownHandle(res) {
      console.log('res', res)
      this.dropName = res.label
      this.intentConfirm({
        radio: res.label,
        textarea: this.sys_student_details_son.trialOfStudentDetails
          .userIntention.describe,
        track: {
          isTrack: 0,
          today:
            (this.remarks &&
              this.remarks.userIntention &&
              this.remarks.userIntention.today) ||
            ''
        }
      })
    },
    closeIconBlock() {
      this.showTags = false
    },
    toggleTags() {
      this.showTags = !this.showTags
    },
    // 点击班级名称，打开班级详情
    openTeam(e, res) {
      if (e === 's') {
        const {
          id,
          teamName = res.teamInfo.team_name,
          teamState = res.teamInfo.team_type
        } = res.teamInfo

        openBrowserTab(
          `/student-team/#/teamDetail/${id}/${teamState}`,
          `${teamName}`
        )
      } else if (e === 't') {
        const {
          id,
          teamName = this.sys_student_details_son.trialOfStudentDetails.teamInfo
            .team_name,
          teamtype = '1'
        } = this.sys_student_details_son.trialOfStudentDetails.teamInfo
        id &&
          openBrowserTab(
            `/student-team/#/detail/trial/${id}/${teamtype}`,
            `${teamName}`
          )
      } else if (e === 'j') {
        const {
          id,
          teamName = res.readyTeamInfo.team_name,
          teamState = res.readyTeamInfo.team_type
        } = res.readyTeamInfo

        openBrowserTab(
          `/student-team/#/teamDetail/${id}/${teamState}`,
          `${teamName}`
        )
      }
    },
    // 修改开关
    changeSwitch(val, type = 'wechat') {
      if (type === 'wechat' || type === 'group') {
        const {
          teamInfo
        } = this.sys_student_details_son.systemCourseOfStudentDetails
        console.log(teamInfo, 'teamid----')
        const courseType =
          teamInfo && teamInfo.team_type * 1 === 0 ? 'TRAIL' : 'YEAR'
        const params = {
          teamId: teamInfo.id,
          courseType,
          studentId: this.studentId
        }
        if (type === 'wechat') {
          params.addedWechat = val
        } else if (type === 'group') {
          params.addedGroup = val
        }
        console.log(params, 'params---------------')
        this.$http.User.updateTeamStudent(params).then((res) => {
          if (res && res.code === 0) {
            this.$message.success('修改成功')
          } else {
            // 换成原值
            if (type === 'wechat') {
              // 这么写的原因是值不是0就是1
              this.sys_student_details_son.systemCourseOfStudentDetails.addedWechat = Math.abs(
                val - 1
              )
            } else if (type === 'group') {
              this.sys_student_details_son.systemCourseOfStudentDetails.addedGroup = Math.abs(
                val - 1
              )
            }
          }
        })
      }
      if (type === 'twechat' || type === 'tgroup') {
        const { teamInfo } = this.sys_student_details_son.trialOfStudentDetails
        console.log(teamInfo, 'teamid----')
        const courseType =
          teamInfo && teamInfo.team_type * 1 === 0 ? 'TRAIL' : 'YEAR'
        const params = {
          teamId: teamInfo.id,
          courseType,
          studentId: this.studentId
        }
        if (type === 'twechat') {
          params.addedWechat = val
        } else if (type === 'tgroup') {
          params.addedGroup = val
        }
        console.log(params, 'params---------------')
        this.$http.User.updateTeamStudent(params).then((res) => {
          if (res && res.code === 0) {
            this.$message.success('修改成功')
          } else {
            // 换成原值
            if (type === 'twechat') {
              // 这么写的原因是值不是0就是1
              this.sys_student_details_son.trialOfStudentDetails.addedWechat = Math.abs(
                val - 1
              )
            } else if (type === 'tgroup') {
              this.sys_student_details_son.trialOfStudentDetails.addedGroup = Math.abs(
                val - 1
              )
            }
          }
        })
      }
    },
    // 获取体验课、系统课
    async getUserAllTeam() {
      this.sectionLoading = true
      try {
        const id = this.$route.params.id
        const subject = this.changeSubject
        const trialList = await this.trialList(id, subject)
        const sysList = await this.systemList(id, subject)
        this.trialSysTeamList = [
          ...this.sysTemSortTeamList(sysList),
          ...trialList
        ]
        const [firstTeam = {}] = this.trialSysTeamList
        // 头部课程信息取第一个
        this.firstTeam = firstTeam
      } catch (err) {
        console.info(err)
      } finally {
        this.sectionLoading = false
      }
    },
    // 体验课
    async trialList(id, subject) {
      const {
        data: { StudentTrialV2StatisticsList }
      } = await this.$http.User.StudentTrialList({ id, subject })
      this.packageTrialTeamList(StudentTrialV2StatisticsList)
      return StudentTrialV2StatisticsList
    },
    // 系统课
    async systemList(studentid, subject) {
      const {
        data: { StudentSystemStatisticsList = [] }
      } = await this.$http.User.StudentSystemStatisticsList({
        studentid,
        subject,
        course_state: [0, 1, 2, 6]
      })
      this.packageSysTeamList(StudentSystemStatisticsList)
      return StudentSystemStatisticsList
    },
    // 体验课包装
    packageTrialTeamList(list = []) {
      list.forEach((team) => {
        const {
          // orderInfo = {},
          teacherInfo = {},
          expressstatus = -1,
          course_state: teamstate,
          managementInfo
          // teacherInfo: trialTeacher = {}
        } = team
        team.last_join_time = formatDateByType(+team.last_join_time, '-', 'MS')
        team.last_complete_time = formatDateByType(
          +team.last_complete_time,
          '-',
          'MS'
        )
        team.buytime = formatDateByType(+team.buytime, '/', 'M')
        team.expressstatus = this.expressstatus[String(expressstatus)]
        team.teamStatusCH = this.trialStatusVal[teamstate]
        team.addedWechat = team.added_wechat || 0
        team.addedGroup = team.added_group || 0
        if (teacherInfo) {
          teacherInfo.allDeptName = this.getDeptNameRecursion(
            teacherInfo.departmentInfo || {}
          ).join('/')
        } else {
          team.teacherInfo = {}
        }
        if (managementInfo) {
          const {
            course_day: courseDay = 0,
            end_course_day: endCourseDay = 0
          } = managementInfo
          managementInfo.course_day = formatDateByType(+courseDay, '/', 'Y')
          managementInfo.end_course_day = formatDateByType(
            +endCourseDay,
            '/',
            'Y'
          )
        } else {
          team.managementInfo = {}
        }
        team.courseTime = team.managementInfo
      })
    },
    // 系统课包装
    packageSysTeamList(team = []) {
      team.forEach((team) => {
        const {
          orderInfo = {},
          teacherInfo = {},
          expressstatus = -1,
          course_state: courseState,
          currentlesson = '',
          currentlevel = '',
          currentsuper = '',
          currentunit = '',
          end_course_day: endCourseDay = '',
          course_day: courseDay = '',
          remaining_week: remainingWeek
        } = team
        if (remainingWeek) {
          this.allSysRemainingWeeks += +remainingWeek
        }
        team.sortCountDesc = this.courseStateSort(courseState)
        team.buytime =
          orderInfo && formatDateByType(+orderInfo.buytime, '/', 'M')
        team.current_lesson = `${currentsuper}${currentlevel}${currentunit}${currentlesson}`
        team.last_join_time = formatDateByType(+team.last_join_time, '-', 'MS')
        team.last_complete_time = formatDateByType(
          +team.last_complete_time,
          '-',
          'MS'
        )
        team.ctime = formatDateByType(+team.ctime, '/', 'M')
        team.expressstatus = this.expressstatus[String(expressstatus)]
        team.teamStatusCH = this.systemStatusKeyVal[courseState] || '未开始'
        team.addedWechat = team.addedwechat || 0
        team.addedGroup = team.addedgroup || 0
        // 系统课老师信息
        if (teacherInfo) {
          teacherInfo.allDeptName = this.getDeptNameRecursion(
            teacherInfo.departmentInfo || {}
          ).join('/')
        } else {
          team.teacherInfo = {}
        }
        team.courseTime = {
          course_day: formatDateByType(+courseDay, '/', 'Y'),
          end_course_day: formatDateByType(+endCourseDay, '/', 'Y')
        }
        team.isSystemTeam = 1
      })
    }
  }
  //   watch: {
  //     curTeamTab(val) {
  //       this.courseType = val
  //     }
  //   }
}
</script>
<style lang="scss" scoped>
._study_info {
  padding: 10px 0;
}
.team-template {
  padding-left: 10px;
  .base-common {
    .row-info {
      display: flex;
      ._module {
        display: flex;
        flex: 1;
        flex-direction: column;
        &:first-child {
          padding-left: 10px;
        }
        > p {
        }
        ._item {
          height: 30px;
          font-size: 12px;
          display: flex;
          align-items: center;
          .drown-down-btn {
            width: 7px;
            height: 7px;
            border-top: 1px solid #e6a23c;
            border-right: 1px solid #e6a23c;
            transform: rotate(135deg);
            display: inline-block;
            margin-left: 10px;
            position: relative;
            top: -3px;
            cursor: pointer;
          }
          .label {
            color: #aaa;
            display: inline-block;
            min-width: 60px;
          }
          .defined-drop {
            position: relative;
            .definedTagList {
              position: absolute;
              top: 35px;
              background: #fff;
              width: 60px;
              border: 1px solid #ebeef5;
              border-radius: 4px;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              padding: 10px;
              display: none;
              &.show-tags {
                display: block;
              }
              span {
                display: flex;
                justify-content: center;
                height: 20px;
                align-items: center;
                color: #606266;
                cursor: pointer;
                &:hover,
                .active {
                  color: #2a75ed;
                }
              }
            }
          }
          .val {
            color: #444;
            &.special-blue {
              color: #2a75ed;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .talk-remark {
    .content {
      .form-item {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-bottom: 20px;
        }
        .label {
          width: 90px;
          text-align: right;
          padding-right: 10px;
          box-sizing: border-box;
        }
        .bar {
          width: 500px;
        }
      }
    }
  }
}
</style>
