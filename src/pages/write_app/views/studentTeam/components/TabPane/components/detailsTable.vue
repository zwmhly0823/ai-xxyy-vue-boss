<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-16 19:39:20
 -->
<template>
  <div class="table-box">
    <!-- 加好友进群 -->
    <div class="group-box" v-if="this.tables.tabs == 0">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          type="selection"
          width="40px"
          v-if="
            this.tables.tabs == 0 &&
              (this.tables.courseState == 1 || this.tables.courseState == 0)
          "
        ></el-table-column> -->
        <!-- <el-table-column
          v-if="this.tables.courseState == 1 || this.tables.courseState == 0"
          width="20px"
        >
          <template slot="header" slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <div size="mini" type="text" @click="batchBtn">
                批量发送加好友短信
              </div>
              <div
                @click="headerPoint(scope.$index, scope)"
                v-show="moreTitle"
                slot="reference"
              >
                <img :src="pointImg" />
              </div>
            </el-Popover>
          </template>
          <template slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <div size="mini" type="text" @click="batchBtn">
                <span v-show="moreTitle === true">批量发送加好友短信</span>
                <span v-show="moreTitle === false">发送加好友短信</span>
              </div>
              <div
                @mouseenter="handleEdit(scope.$index, scope.row)"
                slot="reference"
              >
                <img :src="pointImg" />
              </div>
            </el-Popover>
          </template>
        </el-table-column> -->
        <!-- 基本信息 -->
        <el-table-column width="280" label="基本信息">
          <template slot-scope="scope">
            <div
              class="scope-info-box primary-text"
              @click="openUserDetail(scope.row.studentid)"
            >
              <img
                class="scope-info-img borders"
                :src="
                  `${scope.row.userExtends.head}?x-oss-process=image/resize,l_100`
                "
                alt=""
              />
              <div class="info-telephone">
                <span>{{ scope.row.userExtends.mobile }}</span>
              </div>
              <span class="info-sex">{{ scope.row.userExtends.sex }}</span>
              <span class="info-age">{{ scope.row.userExtends.birthday }}</span>
              <span class="info-basics">{{ scope.row.userExtends.grade }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 组建遍历表头 -->
        <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
        </el-table-column>
        <!-- 已加好友 -->
        <el-table-column prop="added_wechat" label="已加好友">
          <!-- <template v-if="renderHtml" slot="header"> -->
          <template slot="header">
            <div @click="onSortWechat">
              <span>已加好友</span>
              <div v-if="wechatShowIcon === 1" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top"></i>
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
              <div v-if="wechatShowIcon === 2" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top"></i>
                <i class="el-icon-caret-bottom bottom-color"></i>
              </div>
              <div v-if="wechatShowIcon === 3" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top-color"></i>
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <img
              class="group-img"
              v-if="scope.row.added_wechat == 0"
              src="@/assets/images/error.png"
              alt=""
            />
            <img
              class="group-img"
              v-else
              src="@/assets/images/success.png"
              alt=""
            />
            <el-dropdown @command="commandFriend" trigger="click">
              <span class="el-dropdown-link icon-warps">
                <i
                  v-show="scope.row.added_wechat == 0"
                  class="el-icon-caret-bottom el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">
                  <img
                    style="width: 18px;"
                    src="@/assets/images/success.png"
                    alt=""
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div style="margin-left:10px;" v-if="scope.row.added_wechat == 0">
              -- --
            </div>
            <div v-else>{{ scope.row.added_wechat_time }}</div>
            <span style="display: none;"> {{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <!-- 已进群 -->
        <el-table-column prop="added_group" label="已进群">
          <template slot="header">
            <div @click="onSortGroup">
              <span>已进群</span>
              <div v-if="groupShowIcon === 1" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top"></i>
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
              <div v-if="groupShowIcon === 2" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top"></i>
                <i class="el-icon-caret-bottom bottom-color"></i>
              </div>
              <div v-if="groupShowIcon === 3" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top-color"></i>
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <img
              class="group-img"
              v-if="scope.row.added_group == 0"
              src="@/assets/images/error.png"
              alt=""
            />
            <img
              class="group-img"
              v-else
              src="@/assets/images/success.png"
              alt=""
            />
            <el-dropdown @command="onGroup" trigger="click">
              <span class="el-dropdown-link icon-warps">
                <i
                  v-show="scope.row.added_group == 0"
                  class="el-icon-caret-bottom el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">
                  <img
                    style="width: 18px;"
                    src="@/assets/images/success.png"
                    alt=""
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div style="margin-left:10px;" v-if="scope.row.added_group == 0">
              -- --
            </div>
            <div v-else>{{ scope.row.added_group_time }}</div>
            <span style="display: none;"> {{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <!-- 关注公众号 -->
        <el-table-column prop="follow" label="关注公众号">
          <template slot="header">
            <div @click="onSortFollow">
              <span>关注公众号</span>
              <div v-if="followShowIcon === 1" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top"></i>
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
              <div v-if="followShowIcon === 2" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top"></i>
                <i class="el-icon-caret-bottom bottom-color"></i>
              </div>
              <div v-if="followShowIcon === 3" class="added-wechat-icon-box">
                <i class="el-icon-caret-top top-color"></i>
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <img
              class="group-img"
              v-if="scope.row.follow == 0"
              src="@/assets/images/error.png"
              alt=""
            />
            <img
              class="group-img"
              v-else
              src="@/assets/images/success.png"
              alt=""
            />
            <!-- <div>{{ scope.row.fast_follow_time }}</div> -->
            <div style="margin-left:10px;" v-if="scope.row.follow == 0">
              -- --
            </div>
            <div v-else>{{ scope.row.fast_follow_time }}</div>
            <span style="display: none;"> {{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
    <!-- 物流 -->
    <div class="logistics-box" v-if="this.tables.tabs == 1">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
        @cell-mouse-leave="showModifyAddressBtn = false"
        @cell-mouse-enter="onShowModifyAddressBtn"
      >
        <el-table-column key="1" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span
                class="primary-text"
                @click="openUserDetail(scope.row.user_id)"
                >{{ scope.row.mobile }}</span
              >
              <br />
              <span>{{ scope.row.order_ctime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="2" label="用户微信">
          <template slot-scope="scope">
            <div class="logistics-wx-box">
              <img
                v-if="scope.row.head != ''"
                class="logistics-wx-img borders"
                :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
                alt=""
              />
              <span v-else class="logistics-wx-imgs borders"> - </span>
              <span class="logistics-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="3" label="收货人及地址" width="300">
          <template slot-scope="scope">
            <div>
              <span class="logistics-address-name">{{
                scope.row.product_name
              }}</span>
              <br />
              <div v-if="scope.row.receipt_name">
                <span>{{ scope.row.receipt_name }}</span>
                <span>{{ scope.row.receipt_tel }}</span>
                <!-- showModifyAddressBtn &&
                      scope.row.id == rowId &&
                      (expressStatus === '待审核' || expressStatus === '无效') -->
                <el-button
                  v-if="
                    showModifyAddressBtn &&
                      scope.row.id == rowId &&
                      (expressStatus === '待审核' || expressStatus === '无效')
                  "
                  style="margin-left:20px;"
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  plain
                  @click="onModifyAddress"
                  >修改地址</el-button
                >
                <br />
                <span>{{ scope.row.province }}</span>
                <span>{{ scope.row.city }}</span>
                <span>{{ scope.row.area }}</span>
                <span>{{ scope.row.street }}</span>
                <br />
                <span>{{ scope.row.address_detail }}</span>
              </div>
              <div v-else>
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  plain
                  @click="handelAddExpress"
                  >帮他填写</el-button
                >
                <!-- <el-button
                  icon="el-icon-postcard"
                  size="mini"
                  type="primary"
                  plain
                  @click="onUrgentAddress"
                  >催发地址</el-button -->
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="4" label="发货">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.express_status }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
    <!-- 打开APP 原 登陆 -->
    <div class="login-box" v-if="this.tables.tabs == 2">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column key="l1" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span
                class="primary-text"
                @click="openUserDetail(scope.row.id)"
                >{{ scope.row.mobile }}</span
              >
              <br />
              <span>{{ scope.row.order_ctime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="l2" label="用户微信">
          <template slot-scope="scope">
            <div class="login-wx-box">
              <img
                v-if="scope.row.head != ''"
                class="login-wx-img borders"
                :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
                alt=""
              />
              <span v-else class="login-wx-imgs borders"> - </span>
              <span class="login-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="l3" label="状态">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="l4" label="打开次数">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.login_time }}</span>
              <br />
              <span>{{ scope.row.first_login_time }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
    <!-- 参课和完课 -->
    <div class="participateIn-box" v-if="this.tables.tabs == 3">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column key="p1" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span
                class="primary-text"
                @click="openUserDetail(scope.row.student_id)"
                >{{ scope.row.mobile }}</span
              >
              <br />
              <span>{{ scope.row.buy_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="p2" label="用户微信">
          <template slot-scope="scope">
            <div class="participateIn-wx-box">
              <img
                v-if="scope.row.head != ''"
                class="participateIn-wx-img borders"
                :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
                alt=""
              />
              <span v-else class="participateIn-wx-imgs borders"> - </span>
              <span class="participateIn-nickname">{{
                scope.row.nickname
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="p3" label="状态">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="p4" label="课程">
          <template slot-scope="scope">
            <div>
              <!-- <span>{{ scope.row.course_current_num }}</span>
              <br /> -->
              <span>{{ scope.row.course_title }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 课程后新增“解锁”字段（状态为已解锁、未解锁；已解锁状态下，添加解锁时间） TODO: -->
        <el-table-column key="p7" label="解锁">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.is_start_course || '未解锁' }}</span>
              <br />
              <span v-if="scope.row.is_start_course">{{
                scope.row.start_date
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="p5" label="参课">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.join_course_state }}</span>
              <br />
              <span>{{ scope.row.join_course_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="p6" label="完课">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.complete_course_state }}</span>
              <br />
              <span>{{ scope.row.complete_course_time }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
    <!-- 作品及点评 -->
    <div class="works-box" v-if="this.tables.tabs == 4">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column key="w1" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span
                class="primary-text"
                @click="openUserDetail(scope.row.student_id)"
                >{{ scope.row.mobile }}</span
              >
              <br />
              <span>{{ scope.row.buytime }}</span>
              <br />
              <span>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="w2" label="用户微信">
          <template slot-scope="scope">
            <div class="works-wx-box">
              <img
                v-if="scope.row.head != ''"
                class="works-wx-img borders"
                :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
                alt=""
              />
              <span v-else class="works-wx-imgs borders"> - </span>
              <span class="works-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="w3" label="课程">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.classTitle }}</span>
              <br />
              <span>{{ scope.row.start_date }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="w4" label="作品">
          <template slot-scope="scope">
            <div class="works-task-box">
              <img
                v-if="scope.row.task_image"
                class="works-task-img borders"
                :src="
                  `${scope.row.task_image}?x-oss-process=image/resize,l_100`
                "
                alt=""
              />
              <span v-else>未上传</span>
            </div>
            <div class="works-ctime">{{ scope.row.works_ctime }}</div>
          </template>
        </el-table-column>
        <el-table-column key="w5" label="点评">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.has_comment_ctime }}</span>
              <div
                v-for="(item, index) in scope.row.listenInfoArr"
                :key="index"
                @click="aplayAudio(item, index, 'audioRef' + index)"
                class="audio-box"
              >
                <p class="audio-triangle"></p>
                <img
                  v-if="audioIndex === index && rowIdDianping == scope.row.id"
                  class="audio-imgs"
                  src="@/assets/images/sound-active.gif"
                  alt=""
                />
                <img
                  v-else
                  class="audio-img"
                  src="@/assets/images/playing-icon.png"
                  alt=""
                />
                <audio
                  @ended="audioEnded"
                  :ref="'audioRef' + index"
                  :src="item.task_sound"
                ></audio>
                <span class="audio-second">{{ item.task_sound_second }}</span>
              </div>
              <!-- {{ item.task_sound ? item.task_sound : '-' }} -->
              <p>{{ scope.row.has_listen_time }}</p>
              <!-- <span>{{ scope.row }}</span> -->
            </div>
          </template>
        </el-table-column>
        <!-- 列表新增 ”点评老师“，取最新的点评老师（在点评后添加）TODO: -->
        <el-table-column key="w6" label="点评老师">
          <template slot-scope="scope">
            <div class="comment-teacher">
              <div>{{ scope.row.teacher_name }}</div>
              <div>{{ scope.row.has_comment_utime }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>

    <el-dialog
      :destroy-on-close="true"
      title="填写物流信息"
      :visible.sync="showExpress"
      width="30%"
    >
      <logistics-form @addExpress="addExpress" :formData="formData" />
    </el-dialog>
    <el-dialog
      :destroy-on-close="true"
      :visible.sync="showModifyAddress"
      width="30%"
    >
      <modify-address
        @modifyAddressExpress="modifyAddressExpress"
        v-if="showModifyAddress"
        :modifyFormData="modifyFormData"
      />
    </el-dialog>
  </div>
</template>
<script>
import MPagination from '@/components/MPagination/index.vue'
import logisticsForm from '../components/logisticsForm'
import modifyAddress from '../components/modifyAddress'
import { openBrowserTab } from '@/utils/index'
import { GETGRADE } from '@/utils/enums'
export default {
  name: 'detailsTable',
  props: {
    experssShow: {
      type: Boolean,
      default: false
    },
    classObj: {
      type: Object,
      default: () => {}
    },
    tables: {
      type: Object,
      default: null
    },
    audioTabs: {
      type: String,
      default: ''
    }
  },
  components: {
    MPagination,
    logisticsForm,
    modifyAddress
  },
  data() {
    return {
      GETGRADE,
      pointImg: require('@/assets/images/point.png'),
      expressStatus: '',
      rowId: '', // 判断页面那条数据显示
      showModifyAddressBtn: false,
      showModifyAddress: false,
      orderId: '',
      selectUserMobile: [],
      moreTitle: false,
      wechatShowIcon: 1,
      groupShowIcon: 1,
      followShowIcon: 1,
      showExpress: false,
      formData: {},
      modifyFormData: {},
      audioIndex: null,
      tableindex: null,
      rowIdDianping: null,
      added_group: null,
      added_wechat: null,
      ruleForm: {
        receiptName: '',
        receiptTel: '',
        addressDetail: ''
      },
      wechatSort: 'asc',
      groupSort: 'desc',
      followSort: 'desc',
      renderHtml: true
    }
  },
  mounted() {},
  watch: {
    classObj(value) {
      this.audioIndex = null
    },
    audioTabs(value) {
      this.audioIndex = null
    }
  },
  created() {},
  methods: {
    // 鼠标移入显示修改地址
    onShowModifyAddressBtn(row) {
      this.rowId = row.id
      const id = row.id
      const userid = row.user_id
      const orderid = row.order_id
      this.expressStatus = row.express_status
      // const addressid = row.address_id
      // this.modifyFormData = { id, userid, orderid, addressid }
      this.modifyFormData = { id, userid, orderid, row }
      this.showModifyAddressBtn = true
    },
    // 加好友
    handleEdit(index, row) {
      // 当没有点击复选框 直接点击加好友
      if (this.moreTitle === false) {
        this.selectUserMobile = []
        this.selectUserMobile.push(row.order_id)
      }
    },
    // 表头加好友操作
    headerPoint(index, scope) {},
    batchBtn() {
      const orderIds = Object.values(this.selectUserMobile).join()
      this.$http.User.sendMsgForTeacher(orderIds).then((res) => {
        this.$message({
          message: '已发送短信',
          type: 'success'
        })
      })
    },
    // 复选框
    handleSelectionChange(val) {
      this.selectUserMobile = []
      if (val.length > 1) {
        this.moreTitle = true
      } else {
        this.moreTitle = false
      }
      val.forEach((data) => {
        this.selectUserMobile.push(data.order_id)
      })
    },
    // 排序
    onSortWechat() {
      this.renderHtml = false
      if (this.wechatSort === 'asc') {
        this.$emit('onGroupSort', '{"added_wechat":"asc"}')
        this.$nextTick(() => {
          this.wechatShowIcon = 2
          this.followShowIcon = 1
          this.groupShowIcon = 1
          this.renderHtml = true
        })
        this.wechatSort = 'desc'
      } else {
        this.$emit('onGroupSort', '{"added_wechat":"desc"}')
        this.$nextTick(() => {
          this.wechatShowIcon = 3
          this.followShowIcon = 1
          this.groupShowIcon = 1
          this.renderHtml = true
        })
        this.wechatSort = 'asc'
      }
    },
    onSortGroup() {
      this.renderHtml = false
      if (this.groupSort === 'asc') {
        this.$emit('onGroupSort', '{"added_group":"desc"}')
        this.$nextTick(() => {
          this.followShowIcon = 1
          this.wechatShowIcon = 1
          this.groupShowIcon = 3
          this.renderHtml = true
        })
        this.groupSort = 'desc'
      } else {
        this.$emit('onGroupSort', '{"added_group":"asc"}')
        this.$nextTick(() => {
          this.followShowIcon = 1
          this.wechatShowIcon = 1
          this.groupShowIcon = 2
          this.renderHtml = true
        })
        this.groupSort = 'asc'
      }
    },
    onSortFollow() {
      this.renderHtml = false
      if (this.followSort === 'asc') {
        this.$emit('onGroupSort', '{"follow":"desc"}')
        this.$nextTick(() => {
          this.wechatShowIcon = 1
          this.groupShowIcon = 1
          this.followShowIcon = 3
          this.renderHtml = true
        })
        this.followSort = 'desc'
      } else {
        this.$emit('onGroupSort', '{"follow":"asc"}')
        this.$nextTick(() => {
          this.wechatShowIcon = 1
          this.groupShowIcon = 1
          this.followShowIcon = 2
          this.renderHtml = true
        })
        this.followSort = 'asc'
      }
    },
    // 催发地址接口
    onUrgentAddress() {
      setTimeout(() => {
        this.$http.Express.pushMsgByOrderId(this.orderId).then((res) => {
          this.$message({
            message: '已发送短信',
            type: 'success'
          })
        })
      }, 500)
    },
    // 添加物流地址按钮
    handelAddExpress(row) {
      this.showExpress = true
    },
    addExpress(data) {
      this.showExpress = false
      if (data === 1) this.$emit('addExpresss', data)
    },
    // 修改地址按钮
    onModifyAddress(row) {
      this.showModifyAddress = true
    },
    modifyAddressExpress(data) {
      this.showModifyAddress = false
      if (data === 1) this.$emit('modifyAddressExpresss', data)
    },
    // 音频结束后赋值为空
    audioEnded() {
      this.audioIndex = null
    },
    // 语音播放
    aplayAudio(item, index, itemss) {
      if (this.audioIndex !== null) {
        if (this.audioIndex !== index) {
          const audios = this.$refs
          const audiosList = Object.values(audios)
          audiosList.forEach((item, index) => {
            item[0].load()
          })
        }
      }

      const audio = this.$refs[itemss][0]
      if (audio.paused) {
        this.audioIndex = index
        audio.play() // audio.play();// 播放
      } else {
        // audio.pause() // 暂停
        audio.load() // 取消播放并回到0秒
        this.audioIndex = null
      }
    },
    // 获取表格 下标
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 获取表格 下标
    onClick(row, column, event) {
      this.added_group = row.added_group
      this.added_wechat = row.added_wechat
      this.rowIdDianping = row.id
      this.student_id = row.id || row.studentId
      this.tableindex = row.index
      this.orderId = row.order_id
      const id = row.id
      const userid = row.user_id
      const orderid = row.order_id
      this.formData = { id, userid, orderid, row }
    },
    // 向父组建传值 已加好友
    commandFriend(command) {
      const val = {
        type: 'wechat',
        studentId: this.student_id,
        addedGroup: this.added_group,
        addedWechat: command,
        index: this.tableindex
      }
      this.$emit('commandFriend', val)
    },
    // 向父组建传值 已进群
    onGroup(command) {
      const val = {
        type: 'group',
        studentId: this.student_id,
        addedWechat: this.added_wechat,
        addedGroup: command,
        index: this.tableindex
      }
      this.$emit('onGroup', val)
    },
    // 单元格回调样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:15px;padding-top:20px;padding-bottom:20px;'
      }
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:15px;font-size:12px;color:#666;font-weight:normal;'
      }
      return 'font-size:12px;color:#666;font-weight:normal;'
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('onCurrentPage', val)
    },
    // 打开用户详情
    openUserDetail(uid) {
      uid && openBrowserTab(`/write_app/#/details/${uid}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-box {
  margin-top: 16px;
  .group-box {
    .scope-info-box {
      position: relative;
      .scope-info-img {
        display: inline-block;
        height: 50px;
        width: 50px;
      }
      .info-telephone {
        position: absolute;
        left: 70px;
        top: 0;
      }
      .info-sex {
        margin-left: 20px;
      }
      .info-age {
        margin-left: 5px;
      }
      .info-basics {
        margin-left: 5px;
      }
    }
    .group-img {
      width: 18px;
      margin-left: 10px;
    }
    .icon-warps {
      position: relative;
      top: -3px;
      margin-left: 2px;
      font-size: 12px;
    }
    .added-wechat-icon-box {
      display: inline-block;
      position: relative;
      .top {
        position: absolute;
        bottom: 0;
      }
      .top-color {
        position: absolute;
        bottom: 0;
        color: #2a75ed;
      }
      .bottom {
        position: absolute;
        top: -6px;
      }
      .bottom-color {
        position: absolute;
        top: -6px;
        color: #2a75ed;
      }
    }
  }
  .logistics-box {
    .logistics-wx-box {
      position: relative;
      .logistics-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .logistics-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .logistics-username {
        position: absolute;
        top: 0;
        left: 55px;
      }
      .logistics-nickname {
        position: absolute;
        top: 0px;
        left: 55px;
      }
    }
    .logistics-address-name {
      margin-left: -8px;
    }
  }
  .login-box {
    .login-wx-box {
      position: relative;
      .login-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .login-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .login-nickname {
        position: absolute;
        top: 0px;
        left: 55px;
      }
    }
  }
  .participateIn-box {
    .participateIn-wx-box {
      position: relative;
      .participateIn-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .participateIn-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .participateIn-nickname {
        position: absolute;
        top: 0px;
        left: 55px;
      }
    }
  }
  .works-box {
    .works-wx-box {
      position: relative;
      .works-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .works-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .works-nickname {
        position: absolute;
        top: 0px;
        left: 55px;
      }
    }
    .works-task-box {
      position: relative;
      .works-task-img {
        display: inline-block;
        width: 80px;
        height: 80px;
      }
    }
    .works-ctime {
      position: absolute;
      // left: 3px;
      bottom: 0;
    }
    .audio-box {
      position: relative;
      left: 20px;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      border: #ccc 1px solid;
      margin-top: 10px;
      background: #bbe166;
      cursor: pointer;
      .audio-triangle {
        position: absolute;
        top: 4px;
        left: -6px;
        width: 10px;
        height: 10px;
        background: #bbe166;
        transform: rotate(45deg);
        border-left: #ccc 1px solid;
        border-bottom: #ccc 1px solid;
      }
      .audio-img {
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 5px;
        width: 13px;
        height: 18px;
      }
      .audio-imgs {
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 5px;
        width: 13px;
        height: 18px;
      }
      .audio-second {
        position: absolute;
        right: 10px;
        top: 3px;
        color: #fff;
      }
    }
  }
  .borders {
    border: 1px solid #f2f2f2;
  }
  .page {
    padding-top: 5px;
    float: right;
    margin-right: 20px;
  }
  .header-sort {
    cursor: pointer;
    .hover {
      color: #2a75ed;
    }
  }
}
</style>
<style lang="scss">
// .el-cascader-menu {
//   height: 300px;
//   overflow: scroll;
// }
</style>
