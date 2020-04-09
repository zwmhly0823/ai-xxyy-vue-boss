<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-08 17:39:59
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
        <el-table-column
          type="selection"
          width="40px"
          v-if="this.tables.tabs == 0"
        ></el-table-column>
        <el-table-column width="20px">
          <template slot="header" slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <!-- 标题气泡内容 -->
              <div size="mini" type="text" @click="batchBtn">
                批量发送加好友短信
              </div>
              <!-- 标题点击...图片 -->
              <div
                @click="headerPoint(scope.$index, scope)"
                v-show="moreTitle"
                slot="reference"
              >
                <img src="../../../../../assets/images/point.png" />
              </div>
            </el-Popover>
          </template>
          <template slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <!-- 气泡内容 -->
              <div size="mini" type="text" @click="batchBtn">
                <span v-show="moreTitle === true">批量发送加好友短信</span>
                <span v-show="moreTitle === false">发送加好友短信</span>
              </div>
              <!-- 点击...图片 -->
              <div
                @mouseenter="handleEdit(scope.$index, scope.row)"
                slot="reference"
              >
                <img src="../../../../../assets/images/point.png" />
              </div>
            </el-Popover>
          </template>
        </el-table-column>
        <!-- 基本信息 -->
        <el-table-column width="280" label="基本信息">
          <template slot-scope="scope">
            <div class="scope-info-box">
              <img
                class="scope-info-img borders"
                :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
                alt=""
              />
              <div class="info-telephone">{{ scope.row.mobile }}</div>
              <!-- <span class="info-sex" v-if="scope.row.sex == 0">- ·</span>
              <span class="info-sex" v-else-if="scope.row.sex == 1">男 ·</span>
              <span class="info-sex" v-else>女 ·</span> -->
              <span class="info-sex">{{ scope.row.sex }}</span>
              <span class="info-age">{{ scope.row.birthday }}</span>
              <span class="info-basics">{{ scope.row.base_painting }}</span>
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
                  v-show="scope.row.added_wechat == 0 ? true : false"
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
            <div>{{ scope.row.added_wechat_time }}</div>
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
                  v-show="scope.row.added_group == 0 ? true : false"
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
            <div>{{ scope.row.added_group_time }}</div>
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
            <div>{{ scope.row.follow_time }}</div>
            <span style="display: none;"> {{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
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
      >
        <el-table-column key="1" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.ctime }}</span>
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
        <el-table-column key="3" width="280" label="收货人及地址">
          <template slot-scope="scope">
            <div>
              <span class="logistics-address-name">{{
                scope.row.product_name
              }}</span>
              <br />
              <div v-if="scope.row.receipt_name">
                <span>{{ scope.row.receipt_name }}</span>
                <span>{{ scope.row.receipt_tel }}</span>
                <br />
                <span>{{ scope.row.province }}</span>
                <span>{{ scope.row.city }}</span>
                <span>{{ scope.row.area }}</span>
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
                <el-button
                  icon="el-icon-postcard"
                  size="mini"
                  type="primary"
                  plain
                  @click="onUrgentAddress"
                  >催发地址</el-button
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
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
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
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.express_ctime }}</span>
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
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
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
              <span>{{ scope.row.mobile }}</span>
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
              <span>{{ scope.row.course_current_num }}</span>
              <br />
              <span>{{ scope.row.course_title }}</span>
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
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
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
              <span>{{ scope.row.mobile }}</span>
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
              <span>{{ scope.row.course_current_num }}</span>
              <br />
              <span>{{ scope.row.classTitle }}</span>
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
              <span v-else>-</span>
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
                  v-if="audioIndex === index && studentId == scope.row.id"
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
        <!-- 组建遍历表头 -->
        <!-- <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
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
  </div>
</template>
<script>
import MPagination from '@/components/MPagination/index.vue'
import logisticsForm from '../components/logisticsForm'
import { timestamp } from '@/utils/index'
export default {
  name: 'detailsTable',
  props: {
    experssShow: {
      type: Boolean,
      default: false
    },
    classId: {
      type: Object,
      default: null
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
    logisticsForm
  },
  data() {
    return {
      orderId: '',
      selectUserMobile: [],
      moreTitle: false,
      wechatShowIcon: 1,
      groupShowIcon: 1,
      followShowIcon: 1,
      showExpress: false,
      formData: {},
      audioIndex: null,
      tableindex: null,
      studentId: null,
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
  mounted() {
    console.log(this.audioTabs, ' audioTabs ')
  },
  watch: {
    classId(value) {
      this.audioIndex = null
    },
    audioTabs(value) {
      this.audioIndex = null
    }
  },
  created() {},
  methods: {
    // 加好友
    handleEdit(index, row) {
      // 当没有点击复选框 直接点击加好友
      if (this.moreTitle === false) {
        this.selectUserMobile = []
        this.selectUserMobile.push(row.mobile)
      }
      console.log('当没有点击复选框 直接点击加好友')
    },
    // 表头加好友操作
    headerPoint(index, scope) {
      console.log(index, scope)
    },
    batchBtn() {
      console.log(this.classId, '点击加好友')
      const params = []
      const mobiles = Object.values(this.selectUserMobile)
      const sup = `${this.classId.classId.sup}${
        this.classId.classId.team_type ? '系统课' : '体验课'
      }`
      const teacherWx = JSON.parse(localStorage.getItem('teacher'))
      const staff = JSON.parse(localStorage.getItem('staff'))
      const type = 'BUY_COURSE'
      params.push(sup)
      params.push(timestamp(this.classId.classId.start_day, 5))
      params.push(teacherWx ? teacherWx.teacher_wx : staff.teacher_wx)
      console.log(mobiles, type, params, 'params')
      this.$http.User.sendBatch(mobiles, type, params).then((res) => {
        this.$message({
          message: '已发送短信',
          type: 'success'
        })
      })
    },
    // 复选框
    handleSelectionChange(val) {
      console.log(val, '复选框')
      this.selectUserMobile = []
      if (val.length > 1) {
        this.moreTitle = true
      } else {
        this.moreTitle = false
      }
      val.forEach((data) => {
        this.selectUserMobile.push(data.mobile)
        console.log(data.mobile, '选中的电话')
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
        this.$emit('onGroupSort', '{"wechat_follow_time":"desc"}')
        this.$nextTick(() => {
          this.wechatShowIcon = 1
          this.groupShowIcon = 1
          this.followShowIcon = 3
          this.renderHtml = true
        })
        this.followSort = 'desc'
      } else {
        this.$emit('onGroupSort', '{"wechat_follow_time":"asc"}')
        this.$nextTick(() => {
          this.wechatShowIcon = 1
          this.groupShowIcon = 1
          this.followShowIcon = 2
          this.renderHtml = true
        })
        this.followSort = 'asc'
      }
      console.log(this.followSort)
    },
    // 催发地址接口
    onUrgentAddress() {
      console.log('发送催发短信')
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
      this.studentId = row.id
      this.tableindex = row.index
      this.orderId = row.order_id
      console.log(row.id, 'row.id')
      const id = row.id
      const userid = row.user_id
      const orderid = row.order_id
      this.formData = { id, userid, orderid }
      // console.log(row, column, event, index)
    },
    // 向父组建传值 已加好友
    commandFriend(command) {
      const val = {
        type: 'wechat',
        studentId: this.studentId,
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
        studentId: this.studentId,
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
        margin-left: 10px;
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
        color: #409eff;
      }
      .bottom {
        position: absolute;
        top: -6px;
      }
      .bottom-color {
        position: absolute;
        top: -6px;
        color: #409eff;
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
    .cascader-area {
      // .cascader-area-text {
      //   font-size: 15px;
      //   margin-bottom: 15px;
      //   font-weight: 500;
      // }
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
      .audio-triangle {
        position: absolute;
        top: -3px;
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
        right: -22px;
        top: 3px;
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
      color: #409eff;
    }
  }
}
</style>
<style lang="scss">
.el-cascader-menu {
  height: 300px;
  overflow: scroll;
}
</style>
