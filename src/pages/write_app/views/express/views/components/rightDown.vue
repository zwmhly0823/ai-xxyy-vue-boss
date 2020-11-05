<template>
  <div class="container">
    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      class="table-all"
      @cell-click="handleSelectionChangeCell"
      @selection-change="handleSelectionChange"
      type="index"
      :header-cell-style="headerStyle"
      @select="handleSelect"
      @select-all="handleAllSelect"
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
    >
      <el-table-column type="selection" min-width="25" fixed> </el-table-column>
      <el-table-column min-width="25" fixed v-if="sortItem.id == 6">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <div :class="scope.row.id === current.id ? 'three-dot' : 'disnone'">
              <img src="@/assets/images/icon/icon-three-dot.jpg" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <div>
                <div v-if="selectNum > 1">
                  <el-dropdown-item>
                    <div>
                      <el-button type="text" @click="handleBatchPass()"
                        >批量审核通过
                      </el-button>
                    </div>
                  </el-dropdown-item>
                </div>
                <div class="every-one" v-else>
                  <div class="yes" @click="handlePass()">
                    <el-dropdown-item>审核通过</el-dropdown-item>
                  </div>
                  <div class="no" @click="handleFailed(scope.row.id)">
                    <el-dropdown-item>失效</el-dropdown-item>
                  </div>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <!-- 无地址状态 sortItem.id 为 0 的情况 -->
      <el-table-column min-width="25" fixed v-if="sortItem.id == 0">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <div :class="scope.row.id === current.id ? 'three-dot' : 'disnone'">
              <img src="@/assets/images/icon/icon-three-dot.jpg" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <div class="every-one">
                <div class="no" @click="handleFailed(scope.row.id)">
                  <el-dropdown-item>失效</el-dropdown-item>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column
        label="用户及注册时间"
        min-width="200"
        fixed
        v-if="showCol.userAddDate"
      >
        <template slot-scope="scope">
          <div class="user" if="scope.row.user">
            <div class="name">
              <el-button
                type="text"
                class="trail"
                @click="userHandle(scope.row.user)"
              >
                {{
                  (scope.row.user &&
                    `${scope.row.user.mobile} ${scope.row.user.username}`) ||
                    ''
                }}
              </el-button>
            </div>
            <div class="gray-text">{{ scope.row.ctime }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="商品信息"
        min-width="200"
        v-if="showCol.productName"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.center_product_code || '-' }}</span>
          </div>
          <div class="gray-text">
            {{ scope.row.product_name }} {{ scope.row.product_version }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="+regtype === 1 || regtype === '2,3' ? '难度' : '补发商品'"
        :width="+regtype === 1 || regtype === '2,3' ? '120' : '200'"
        v-if="showCol.productType"
        :key="0"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{
              +regtype === 1 || regtype === '2,3'
                ? scope.row.sup
                : scope.row.product_name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCol.level"
        label="级别"
        min-width="120"
        :key="1"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.level || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="物流类型"
        min-width="200"
        v-if="showCol.replenishType"
        :key="2"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ regtypeEnum[scope.row.regtype] || '--' }}</span>
          </div>
          <div class="gray-text">
            <span>{{ scope.row.replenish_type_text || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="补发类别"
        min-width="200"
        v-if="showCol.replenishFamily"
        :key="3"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.regtype_text || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="补发原因"
        min-width="200"
        v-if="showCol.replenishReason"
        :key="4"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.operator_name || '--' }}申请</span>
          </div>
          <div class="gray-text">
            <span
              >{{ scope.row.replenish_reason_text || '--' }}&nbsp;&nbsp;&nbsp;{{
                scope.row.express_remark || '--'
              }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="申请人"
        min-width="180"
        v-if="showCol.applicant"
        :key="5"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.operator_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="活动类型"
        min-width="180"
        v-if="showCol.courseType"
        :key="6"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.regtype_text }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="随材版本"
        min-width="150"
        v-if="showCol.productVersion"
        :key="7"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.product_version || '-' }}</span>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        label="收货信息"
        min-width="200"
        v-if="showCol.receiptInfo"
        :key="8"
      >
        <template slot-scope="scope">
          <div class="address">
            <div class="take">
              <div>
                <span>{{ scope.row.receipt_name }}</span>
                <span>{{ scope.row.receipt_tel }}</span>
              </div>
              <div class="gray-text">
                <span>{{ scope.row.province }}</span>
                <span>{{ scope.row.city }}</span>
                <span>{{ scope.row.area }}</span>
                <span>{{ scope.row.street }}</span>
              </div>
              <div class="gray-text">
                <span>{{ scope.row.address_detail }}</span>
              </div>
            </div>
            <div
              v-if="sortItem.id === '6' || sortItem.id === '0'"
              :class="{
                edit_0: sortItem.id === '0',
                edit_6: sortItem.id === '6'
              }"
              @click="editAddress(scope.row)"
            >
              <el-button
                v-show="scope.row.id === current.id && sortItem.id === '6'"
                icon="el-icon-edit"
                size="mini"
                type="primary"
                plain
                >修改地址</el-button
              >
              <el-button
                v-show="sortItem.id === '0'"
                icon="el-icon-edit"
                size="mini"
                type="primary"
                plain
                >填写地址</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="期数"
        min-width="150"
        v-if="showCol.term"
        :key="10"
      >
        <template slot-scope="scope">
          <div class="product">
            <span>{{
              ManagementList[`${scope.row.newtype}${scope.row.term}`] || '-'
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="班级信息"
        min-width="150"
        v-if="showCol.className"
        :key="11"
      >
        <template slot-scope="scope">
          <!-- <div class="product">
            <span>{{
              scope.row.course_day ? scope.row.course_day + '开课' : '--'
            }}</span>
          </div> -->
          <div class="product">
            {{
              scope.row.lastTeamInfo ? scope.row.lastTeamInfo.team_name : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="班级"
        min-width="150"
        v-if="showCol.classNameBf"
        :key="19"
      >
        <template slot-scope="scope">
          <div>
            {{
              scope.row.lastTeamInfo ? scope.row.lastTeamInfo.team_name : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="regtype == '1' ? '社群销售' : '辅导老师'"
        min-width="150"
        v-if="showCol.teacher"
        :key="12"
      >
        <template slot-scope="scope">
          <div class="product">
            {{
              scope.row.lastTeacherInfo
                ? scope.row.lastTeacherInfo.realname
                : ''
            }}
          </div>
          <div class="gray-text">
            {{
              scope.row.lastTeacherInfo
                ? scope.row.lastTeacherInfo.group_name
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="物流状态"
        min-width="200"
        v-if="showCol.expressStatus"
        :key="13"
      >
        <template slot-scope="scope">
          <div class="express">
            <div :class="'wait_' + scope.row.express_status">
              {{ scope.row.express_status_chinese }}
            </div>
            <div
              v-if="
                scope.row.express_status == 0 || scope.row.express_status == 6
              "
            >
              追踪
            </div>
            <el-button
              type="text"
              class="trail"
              v-else
              @click="Express(scope.row)"
            >
              追踪
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="失败原因"
        min-width="200"
        v-if="showCol.expressRemark"
        :key="9"
      >
        <template slot-scope="scope">
          <div class="gray-text">
            <span>{{ scope.row.express_remark || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="物流时效"
        min-width="200"
        v-if="showCol.expressInfo"
        :key="14"
      >
        <template slot-scope="scope">
          <div class="gray-text">
            <div>创建: {{ scope.row.crtime }}</div>
            <div>审核: {{ scope.row.center_ctime_str }}</div>
            <div>揽收: {{ scope.row.detime }}</div>
            <div>签收: {{ scope.row.sgtime }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="drawer-body">
      <express-detail
        :transferExpress="transferExpress"
        @refresh="getExpressList"
        ref="zi"
      />
    </div>

    <div class="dialog-shenhe">
      <el-dialog
        title="选择承运商"
        :visible.sync="dialogVisiblePass"
        width="25%"
        :before-close="handleClosePass"
        :modal="modal"
      >
        <div class="two-choose">
          <div class="message-one" v-if="selectNum > 1">
            <div>物流商品类型：</div>
            <div class="mess">
              <div class="ms">
                <ul
                  class="infinite-list"
                  v-infinite-scroll
                  style="overflow:auto"
                >
                  <li
                    :key="item.id"
                    v-for="item in checkBatchParams"
                    class="infinite-list-item"
                    style="list-style:none"
                  >
                    {{ +item.term > 10 ? item.term : `0${item.term}` }}期
                    {{ item.sup }} {{ item.product_name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="message" v-else>
            <div>物流商品类型：</div>
            <div class="mess" :key="i" v-for="(item, i) in checkParams">
              <div class="ms">
                {{ item.term }}期 {{ item.sup }} {{ item.product_name }}
              </div>
            </div>
          </div>
          <div class="choose-product">
            <div>选择承运商：</div>
            <div class="dropdown">
              <el-select
                v-model="value1"
                placeholder="请选择承运商"
                @change="selectExpress"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value1"
                  :label="item.label"
                  :value="item.value1"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblePass = false">取 消</el-button>
          <el-button type="primary" @click="checkPass">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      :class="$style['m-pagination']"
      :pageSizeArr="[20, 100, 200, 500]"
      @current-change="handleSizeChange"
      @current-pagesizes="handleChangeSize"
      show-pager
      open="calc(100vw - 195px)"
      close="calc(100vw - 75px)"
    ></m-pagination>
    <!-- 待审核修改地址弹框 -->
    <div v-if="sortItem.id === '6'">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showModifyAddress"
        width="30%"
        title="修改收货信息"
      >
        <modify-address
          @modifyAddressExpress="modifyAddressExpress"
          :modifyFormData="modifyFormData"
          :showChoiceModel="false"
          v-if="showModifyAddress"
        />
      </el-dialog>
    </div>
    <!-- 无地址页面修改地址弹框 -->
    <div v-if="sortItem.id === '0'">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showModifyAddress"
        width="30%"
        title="修改收货信息"
      >
        <logisticsForm
          @addExpress="modifyAddressExpress"
          :formData="modifyFormData"
          v-if="showModifyAddress"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import MPagination from '@/components/MPagination/index.vue'
import {
  isToss,
  formatData,
  openBrowserTab,
  injectSubject
} from '@/utils/index'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import expressDetail from '@/pages/trading/views/components/expressDetail'
import modifyAddress from '@/pages/studentTeam/components/TabPane/components/modifyAddress'
import logisticsForm from '@/pages/studentTeam/components/TabPane/components/logisticsForm'
import {
  replenishTypeList,
  replenishReasonSearchList,
  expressToggleList,
  productTopicListBf
} from '@/utils/expressItemConfig'
const productTopicList = [
  { id: '5', name: '点点商城' },
  { id: '4', name: '推荐有礼' },
  { id: '6', name: '邀请有奖' }
]

let supList = []
const regtypeEnum = {
  '1': '体验课补发',
  '2': '系统课补发',
  '3': '系统课补发',
  '4': '活动补发',
  '5': '活动补发',
  '6': '活动补发'
}
const LEVEL_ENUM = {
  L1: 0,
  L2: 28,
  L3: 28 * 2,
  L4: 28 * 3,
  L5: 28 * 4,
  L6: 28 * 5,
  L7: 28 * 6,
  L8: 28 * 7,
  L9: 28 * 8,
  L10: 28 * 9,
  L11: 28 * 10,
  L12: 28 * 11
}
export default {
  props: {
    search: { type: [String, Number, Array, Object], default: '' },
    sortItem: {
      type: Object,
      default: () => {
        return expressToggleList[0]
      }
    },
    regtype: { type: String, default: '' },
    source_type: {
      type: String,
      default: ''
    },
    hideCol: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    MPagination,
    expressDetail,
    modifyAddress,
    logisticsForm
  },
  computed: {
    ...mapState({
      whackId: (state) => {
        return state.leftbar.whackId
      }
    }),
    showCol() {
      return { ...this.defaultCol, ...this.hideCol }
    }
  },
  watch: {
    search(val) {
      this.currentPage = 1
      this.searchIn = val
      if (sessionStorage.getItem('val')) {
        sessionStorage.removeItem('val')
      }
      const timeTypeOne = JSON.stringify(val)
      sessionStorage.setItem('timeType', timeTypeOne)
      this.getExpressList()
    },
    sortItem(val) {
      this.currentPage = 1
      this.tableData = []
      this.selectNum = 0
      if (val) {
        this.getExpressList()
      }
    },
    source_type() {
      this.initTableData()
      this.getExpressList()
    }
  },
  created() {
    const staff = localStorage.getItem('staff')
    if (staff) {
      this.staffId = JSON.parse(staff).id
    }
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
      // this.getTeacherByRole()
      this.getExpressList()
    } else {
      this.getExpressList()
    }
  },
  mounted() {
    this.getSupList()
    // this.getProductTopicList()
    this.scrollToTop()
  },
  data() {
    return {
      // 默认审核时弹出
      regtypeEnum,
      modal: false,
      // 审核传参
      checkBatchParams: [],
      checkParams: [],
      options: [
        {
          value1: '0',
          label: '不指定承运商'
        },
        {
          value1: '4',
          label: '京东快递'
        },
        {
          value1: '5',
          label: '圆通云仓'
        },
        {
          value1: '1',
          label: '京东云仓'
        },
        {
          value1: '2',
          label: '中通云仓'
        },
        {
          value1: '3',
          label: '百世物流'
        }
      ],
      value1: '0',
      dialogVisiblePass: false,
      expressBatch: [],
      expressNu: [],
      selecInformation: '',
      selectNum: '',
      searchIn: [],
      searchTime: '',
      topticId: '',
      rowKey: 0,
      teacherId: '',
      // 总页数
      totalPages: 1,
      totalElements: 0, // 总条数
      // 当前页数
      currentPage: 1,
      // 时间线
      timeLine: true,
      // 等待揽收
      waitFor: false,
      // 物流详情
      expressDetail: [],
      expressTitle: {
        nu: '',
        company: ''
      },
      tableData: [],
      multipleSelection: [],
      staffId: '',
      currentItem: 20,
      transferExpress: '',
      TeacherList: '',
      StudentTeamList: '',
      realnameId: '',
      teamId: '',
      ManagementList: {},
      current: {},
      teacherIds: [],
      defaultCol: {
        level: false,
        userAddDate: true,
        productName: true,
        productVersion: true,
        receiptInfo: true,
        term: true,
        className: true,
        teacher: true,
        expressStatus: true,
        expressInfo: true,
        replenishType: true,
        productType: true,
        replenishReason: true,
        applicant: true,
        courseType: true
      },
      showModifyAddress: false,
      modifyFormData: {}
    }
  },
  methods: {
    // 点击用户信息回调事件
    userHandle(user) {
      if (!user || !user.id) {
        this.$message.error('缺少用户信息')
        return
      }
      const { id } = user
      // 新标签打开详情页
      id && openBrowserTab(`/write_app/#/details/${id}`)
    },
    // 初始化searchIn
    initTableData() {
      this.tableData = []
    },
    // 获取难度列表
    getSupList() {
      this.$http.Teacher.supList().then((res) => {
        if (res.data && res.data.courseSupList) {
          supList = res.data.courseSupList
        }
      })
    },
    // 获取补发
    // getProductTopicList() {
    //   this.$http.Teacher.productTopicList().then((res) => {
    //     if (res.data && res.data.productTopic) {
    //       productTopicList = res.data.productTopic
    //     }
    //   })
    // },
    // 鼠标进入显示操作栏
    handleMouseEnter(row) {
      this.current = row
    },
    handleMouseLeave(row) {
      this.current = {}
    },
    handleCloseDrawer() {
      this.timeline = false
    },
    // 页数问题
    handleChangeSize(pageItem) {
      this.currentPage = 1
      this.currentItem = pageItem
      this.scrollToTop()
      this.getExpressList()
    },
    handleSizeChange(val) {
      this.currentPage = val
      this.scrollToTop()
      this.getExpressList()
    },
    // 审核通过 确定
    checkPass() {
      this.dialogVisiblePass = false
      if (this.selectNum > 1) {
        const deliverys = this.checkBatchParams.map((item) => {
          const temp = {
            expressId: item.id,
            term: item.term,
            sup: item.sup,
            level: item.level,
            productName: item.product_name
          }
          return temp
        })
        const params = {
          operatorId: this.staffId,
          supplierId: this.value1,
          deliverys: deliverys
        }
        this.check(params)
      } else {
        const deliverys = this.checkParams.map((item) => {
          const temp = {
            expressId: item.id,
            term: item.term,
            sup: item.sup,
            level: item.level,
            productName: item.product_name
          }
          return temp
        })
        const params = {
          operatorId: this.staffId,
          supplierId: this.value1,
          deliverys: deliverys
        }
        this.check(params)
      }
    },
    // 审核通过时选择物流承运商
    selectExpress(val) {},
    handleClosePass() {
      this.value1 = '0'
      this.dialogVisiblePass = false
    },
    handleBatchPass(val) {
      this.dialogVisiblePass = true
    },
    inputValidator(val) {
      return !!(val && val.length > 0)
    },
    handleFailed(val) {
      this.$prompt('请输入其失效的理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: this.inputValidator,
        inputErrorMessage: '请输入失效原因'
      })
        .then(({ value }) => {
          if (!value) {
            return
          }
          this.$http.Express.makeFailed(val, value, this.staffId).then(
            (res) => {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              setTimeout(() => {
                this.getExpressList()
                this.$store.commit('bransh', true)

                // TODO: 成功后同步左侧列表 待审核 数量
              }, 1000)
            }
          )
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handlePass(val) {
      this.dialogVisiblePass = true
    },
    handleSelectionChangeCell(row, column, cell, event) {
      this.checkParams = []
      this.checkParams.push(row)
      this.expressNu = []
      this.expressNu.push(row.id)
    },
    check(params) {
      this.$http.Express.checkPass(params)
        .then(async (res) => {
          // payload 是数组，错误信息逐个返回.全正确时返回空数组
          const { payload } = res
          if (payload.length === 0) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            setTimeout(() => {
              this.getExpressList()
              this.selectNum = 0
              this.$store.commit('bransh', true)
              // TODO: 成功后同步左侧列表 待审核 数量
            }, 1000)
          } else {
            const errorMsg = payload.map((item) => {
              if (item.code !== 200)
                return `<p style="margin-top: 5px;">${item.message}</p>`
            })
            this.$message({
              type: 'error',
              duration: 5000,
              showClose: 'true',
              dangerouslyUseHTMLString: true,
              message: errorMsg.join('')
            })
          }
        })
        .catch((err) => {
          console.log(err, 'err')
        })
    },
    // 全选
    handleAllSelect(selection) {
      this.selectNum = selection.length
      this.checkBatchParams = []
      this.checkBatchParams = selection
      this.expressBatch = selection.map((item) => {
        return item.id
      })
      const uid = selection.map((item) => {
        return item.id
      })
      sessionStorage.setItem('uid', uid)
    },
    // 手动选择
    handleSelect(selection, row) {
      this.selectNum = selection.length
      this.expressBatch = selection.map((item) => item.id)
      // if (selection.length > 1) {
      this.checkBatchParams = []
      this.checkBatchParams = selection

      const uid = selection.map((item) => {
        return item.id
      })
      if (sessionStorage.getItem('uid')) {
        sessionStorage.removeItem('uid')
      }
      sessionStorage.setItem('uid', uid)
    },
    // 表头样式
    headerStyle() {
      return 'font-size: 12px;color: #666;font-weight: normal;'
    },
    getTeacherByRole() {
      const teacherId = this.teacherId
      if (!teacherId) return
      this.$http.Permission.getAllTeacherByRole({
        teacherId
      }).then((res) => {
        this.teacherIds = res
        this.getExpressList()
      })
    },
    // 传的id值为状态
    getExpressList() {
      let timeType = {}
      if (this.teacherId) {
        this.teacherId && (timeType.teacher_id = this.teacherIds.join())
      }
      this.searchIn.forEach((item) => {
        if (item && item.term) {
          if (item.term.regType) {
            timeType.regtype = item.term.regType
          }
          if (item.term.operator_id) {
            timeType.operator_id = item.term.operator_id
          }
          if (item.term.product_name) {
            timeType.product_name = item.term.product_name
          }
          if (item.term.product_type && item.term.product_type.length) {
            timeType.product_type = item.term.product_type.join(',')
          }
          if (item.term.province) {
            timeType.province = item.term.province.provincesCode
            timeType.city = item.term.province.citysCode
            timeType.area = item.term.province.areasCode
          }
          // if (item.term.provincesCode) {
          //   timeType.province = item.term.provincesCode
          // }
          // if (item.term.citysCode) {
          //   timeType.city = item.term.citysCode
          // }
          // if (item.term.areasCode) {
          //   timeType.area = item.term.areasCode
          // }
          if (item.term.receipt_tel) {
            timeType.receipt_tel = item.term.receipt_tel
          }
          if (item.term.name) {
            timeType.name = item.term.name
          }
          if (item.term.replenish_reason && item.term.replenish_reason.length) {
            timeType.replenish_reason = item.term.replenish_reason.join(',')
          }
          if (item.term.replenish_type && item.term.replenish_type.length) {
            timeType.replenish_type = item.term.replenish_type.join(',')
          }
          if (item.term.user_id) {
            timeType.user_id = item.term.user_id
          }
          if (item.term && item.term.regtype) {
            timeType.regtype = `${item.term.regtype}`
          }
          if (item.term && item.term.last_team_id) {
            timeType.last_team_id = item.term.last_team_id
          }
          if (item.term && item.term['product_version.keyword']) {
            timeType.product_version = `${item.term['product_version.keyword']}`
          }
          if (item.term && item.term.term) {
            timeType.term = item.term.term
          }
          if (item.term && item.term.last_teacher_id) {
            timeType.teacher_id = item.term.last_teacher_id
          }
        }
        if (item && item.terms) {
          if (item.terms.sup) {
            timeType.sup = `${item.terms.sup}`
          }
          // level
          if (item.terms.level) {
            timeType.level = `${item.terms.level}`
          }
          // product_type
          if (item.terms.product_type) {
            timeType.product_type = `${item.terms.product_type}`
          }
        }
        if (item.range) {
          const { range } = item
          const resKey = Object.keys(range)
          const { gte, lte } = range[resKey]
          timeType = {
            ...timeType,
            [resKey[0]]: 1,
            start_time: gte,
            end_time: lte
          }
        }
        if (item.wildcard && item.wildcard.express_nu) {
          timeType.express_nu = item.wildcard.express_nu
        }
      })
      timeType = {
        ...timeType,
        express_status: this.sortItem.id || expressToggleList[0].id,
        regtype: timeType.regtype || this.regtype,
        source_type: this.source_type
      }
      // 筛选下单失败
      this.sortItem.center_express_id &&
        (timeType.center_express_id = this.sortItem.center_express_id)
      const query = JSON.stringify(timeType)
      if (timeType.regtype) {
        if (
          timeType.regtype === '4' ||
          timeType.regtype === '5' ||
          timeType.regtype === '6'
        ) {
          const type = { disableClick: true }
          this.$store.dispatch('getShowStatus', type)
        }
        if (timeType.regtype === '1') {
          const type = { stage: '0', disableClick: false }
          this.$store.dispatch('getShowStatus', type)
        }
        if (timeType.regtype === '2,3') {
          const type = { stage: '1', disableClick: false }
          this.$store.dispatch('getShowStatus', type)
        }
      } else {
        const type = { disableClick: true, stage: null }
        this.$store.dispatch('getShowStatus', type)
      }
      this.$http.Express.getLogisticsList({
        query: `{LogisticsListPageNew(query:${JSON.stringify(
          injectSubject(query)
        )}, size: ${this.currentItem}, page: ${this.currentPage}) {
            first
            last
            number
            size
            totalPages
            totalElements
            content {
              id
              order_id
              address_id
              product_name
              delivery_collect_time
              center_express_id
              express_status
              express_status_chinese
              buy_time
              province
              replenish_type
              product_type
              replenish_reason
              area
              city
              express_remark
              address_detail
              express_company
              signing_time
              receipt_name
              receipt_tel
              express_nu
              operator_id
              operator_name
              level
              ctime
              utime
              center_ctime
              sup
              term
              product_version
              last_team_id
              teacher_id
              last_teacher_id
              pay_teacher_id
              regtype
              street
              address_id
              center_product_code
              stageInfo {
                course_day
              }
              teamInfo {
                team_name
              }
              lastTeamInfo {
                team_name
              }
              teacherInfo {
                realname
                area_name
                department_name
                group_name
              }
              lastTeacherInfo {
                realname
                area_name
                department_name
                group_name
              }
              payTeacherInfo {
                realname
                area_name
                department_name
                group_name
              }
              user {
                id
                birthday
                username
                mobile
              }
              source_type
              delivery_type
            }
          }
        }`
      }).then((res) => {
        this.tableData = []
        if (res.data.LogisticsListPageNew) {
          const resData = res.data.LogisticsListPageNew.content
          const realnameId = [] // 老师Id
          const teamId = [] // 班级Id
          const schedule = []
          resData.forEach((item, index) => {
            realnameId.push(item.last_teacher_id)
            teamId.push(item.last_team_id)
            schedule.push(item.term)
            item.crtime = formatData(+item.ctime, 's')
            item.detime = formatData(+item.delivery_collect_time, 's')
            item.uptime = formatData(+item.utime, 's')
            item.sgtime = formatData(+item.signing_time, 's')
            item.buytime = formatData(+item.buy_time, 's')
            item.ctime = formatData(+item.buy_time, 's')
            item.course_day = this.getCourseDay(
              item.stageInfo?.course_day,
              item.level
            )
            item.center_ctime_str = formatData(+item.center_ctime, 's')
            // 处理补发类型
            // item.regtype_text = productTopicList[item.regtype]
            // console.log(item.regtype_text)
            this.handleRegtype(item)
            // 处理补发方式
            this.handleReplenishType(item)
            // 处理补发原因
            this.handleReplenishReason(item)
            // 处理补发商品
            this.handleReplenishProduct(item, index)
            // 套餐类型 regtype 1 -->0  regtype 2,3 -->1
            switch (+item.regtype) {
              case 1:
                item.newtype = 0
                break
              case 2 || 3:
                item.newtype = 1
                break
              default:
                break
            }

            return item
          })

          this.tableData = resData
          // 总页数
          this.totalPages = +res.data.LogisticsListPageNew.totalPages

          this.totalElements = +res.data.LogisticsListPageNew.totalElements // 总条数
          // this.getTeacherList(realnameId)
          // this.getStudentTeamList(teamId)
          this.getScheduleList(schedule)
        }
      })
    },
    getCourseDay(time, level) {
      if (!time) {
        return '-'
      }
      const timeC = this.regtype === '1' ? 0 : LEVEL_ENUM[level]
      if (timeC) {
        time = +time + timeC * 24 * 3600 * 1000
      }
      return dayjs.unix(time / 1000).format('MMDD' || '-')
    },
    handleRegtype(listItem) {
      // console.log(productTopicList, listItem.regtype)
      productTopicList.map((item) => {
        if (item.id === listItem.regtype) {
          listItem.regtype_text = item.name
        }
        if (+item.id === 6 && listItem.source_type === '4') {
          listItem.regtype_text = '关单赠品'
        }
      })
    },
    handleReplenishType(listItem) {
      // 系统或体验
      if (['1', '2', '3'].includes(listItem.regtype)) {
        replenishTypeList.map((item) => {
          if (+item.value === +listItem.replenish_type) {
            listItem.replenish_type_text = item.label
          }
        })
      }
      // 活动
      else {
        productTopicListBf.map((item) => {
          if (+item.value === +listItem.regtype) {
            listItem.replenish_type_text = item.label
          }
        })
      }
    },
    handleReplenishReason(listItem) {
      replenishReasonSearchList.map((item) => {
        if (+item.value === +listItem.replenish_reason) {
          listItem.replenish_reason_text = item.label
        }
      })
    },
    handleReplenishProduct(listItem, index) {
      supList.map((item) => {
        if (+item.id === +listItem.product_type) {
          listItem.product_type_text = item.name
        }
      })
    },
    // 异步获取班级期数名称
    getStudentTeamList(id) {
      const queryString = JSON.stringify({ id: id })
      this.$http.Express.getSearchList({
        query: `{ StudentTeamList(query:${JSON.stringify(queryString)}){
            id
            team_name
          }
        }`
      }).then((res) => {
        const obj = {}
        res.data.StudentTeamList.forEach((item) => {
          obj[item.id] = item.team_name
        })
        this.StudentTeamList = obj
      })
    },
    getTeacherList(id) {
      const queryString = JSON.stringify({ id: id })
      this.$http.Express.getSearchList({
        query: `{TeacherList(query:${JSON.stringify(queryString)}){
            id
            realname
          }
        }`
      }).then((res) => {
        const obj = {}
        res.data.TeacherList.forEach((item) => {
          obj[item.id] = item.realname
        })
        this.TeacherList = obj
      })
    },
    // 获取期数
    getScheduleList(id) {
      const queryString = JSON.stringify({ period: id })
      this.$http.Express.getSearchList({
        query: `{ManagementList(query:${JSON.stringify(queryString)}){
            id
            period
            period_name
            type
          }
        }`
      }).then((res) => {
        const obj = {}
        res.data.ManagementList.forEach((item) => {
          const periodName = `${item.type}${item.period}`
          obj[periodName] = item.period_name
        })
        this.ManagementList = obj
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 物流列表信息
    Express(row) {
      this.$refs.zi.drawer = true
      this.transferExpress = row
    },
    // scrotop
    scrollToTop() {
      document
        .getElementById('express-right-scroll-first')
        .querySelector('.scrollbar-wrapper-first').scrollTop = 0
    },
    editAddress(rowData) {
      const id = rowData.id
      const userid = rowData.user && rowData.user.id
      const orderid = rowData.order_id
      const modifyFormData = {
        id,
        userid,
        orderid,
        row: { ...rowData, mobile: rowData.receipt_tel }
      }
      this.modifyFormData = modifyFormData
      this.showModifyAddress = true
    },
    modifyAddressExpress(data) {
      this.showModifyAddress = false
      if (data === 1) {
        this.getExpressList()
      } else {
        this.modifyFormData = {}
      }
    }
  },

  beforeDestroy() {
    const type = { disableClick: false }
    this.$store.dispatch('getShowStatus', type)
  }
}
</script>
<style lang="scss" module>
.m-pagination {
  background: #fff;
  position: fixed;
  bottom: 0px !important;
  right: 10px;
  z-index: 1000;
  padding: 8px 15px !important;
  color: #4d4d4d;
  -webkit-transition: width 0.3s;
  transition: width 0.3s;
}
</style>
<style lang="scss" scoped>
.container {
  background-color: #fff;
  color: #666;
  padding-bottom: 20px;
  .gray-text {
    color: #999;
    font-size: 12px;
  }
  .table-all {
    .disnone {
      display: none;
    }
    .three-dot {
      display: flex;
      justify-content: center;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .user,
    .sign,
    .express,
    .take,
    .product {
      font-size: 14px;
      .name {
        color: #333;
      }
    }
    .address {
      position: relative;
      padding-right: 20px;
      min-height: 70px;
      .edit_0 {
        line-height: 70px;
      }
    }
    .express {
      .wait_4 {
        color: red;
      }
      .trail {
        cursor: pointer;
      }
    }

    .two-choose {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: center;
      justify-content: center;
      .message {
        display: flex;
        font-size: 15px;
        color: #666;
        .ms {
          color: #999;
        }
      }
      .choose-product {
        margin-top: 5px;
        font-size: 15px;
        display: flex;
        align-self: center;
        flex-direction: row;
        align-items: center;
      }
    }
  }
  .showSelect {
    display: none;
  }
}
</style>
<style lang="scss">
.el-table .cell {
  padding-left: 10px;
}
</style>
