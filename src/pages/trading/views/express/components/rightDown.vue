<template>
  <div class="container">
    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @cell-click="handleSelectionChangeCell"
      @selection-change="handleSelectionChange"
      @row-click="handleExpressTo"
      :header-cell-style="headerStyle"
      :current-row-key="rowKey"
      @select="handleSelect"
      @select-all="handleAllSelect"
    >
      <el-table-column type="selection" width="25" v-if="!teacherId" fixed>
      </el-table-column>
      <el-table-column width="25" v-if="dataExp.id == 1 && !teacherId" fixed>
        <template slot-scope="scope">
          <!-- <div v-show="false">{{ scope }}</div> -->
          <el-dropdown trigger="click">
            <div class="three-dot">
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
      <el-table-column label="用户及购买日期" width="180" fixed>
        <template slot-scope="scope">
          <div class="user" if="scope.row.user">
            <div
              class="
            name"
            >
              {{ (scope.row.user && scope.row.user.mobile) || '' }}
            </div>
            <div>{{ scope.row.buytime }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息" width="200" fixed>
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.product_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="随材版本">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.product_version || '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="200">
        <template slot-scope="scope">
          <div class="take">
            <div>
              <span>{{ scope.row.receipt_name }}</span>
              <span>{{ scope.row.receipt_tel }}</span>
            </div>
            <div>
              <span>{{ scope.row.province }}</span>
              <span>{{ scope.row.city }}</span>
              <span>{{ scope.row.area }}</span>
            </div>
            <div>
              <span>{{ scope.row.address_detail }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="期数">
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.term }}期</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="班级名" width="120">
        <template slot-scope="scope">
          <div class="product">
            <span>{{ StudentTeamList[scope.row.last_team_id] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="社群销售">
        <template slot-scope="scope">
          <div class="product">
            <span>{{ TeacherList[scope.row.teacher_id] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流状态">
        <template slot-scope="scope">
          <div class="express">
            <div :class="'wait_' + scope.row.express_status">
              {{ scope.row.express_status_chinese }}
            </div>
            <el-button class="trail" type="text" @click="Express(scope.row)">
              追踪
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流创建·揽收·签收" width="200">
        <template slot-scope="scope">
          <div class="sign">
            <div>创建:{{ scope.row.crtime }}</div>
            <div>揽收:{{ scope.row.detime }}</div>
            <div>签收:{{ scope.row.sgtime }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="drawer-body">
      <express-detail :transferExpress="transferExpress" ref="zi" />
    </div>

    <div class="dialog-shenhe">
      <el-dialog
        title="选择承运商"
        :visible.sync="dialogVisiblePass"
        width="25%"
        :before-close="handleClosePass"
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
                  >
                    {{ item.term }}期 {{ item.sup }} {{ item.product_name }}
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
                placeholder="中通云仓"
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
      :pageSizeArr="[20, 100, 200, 500]"
      @current-change="handleSizeChange"
      @current-pagesizes="handleChangeSize"
      show-pager
      open="calc(100vw - 170px - 24px - 180px)"
      close="calc(100vw - 50px - 24px - 180px)"
    ></m-pagination>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import axios from '@/api/axios'
import { isToss, formatData } from '@/utils/index'
import { mapState } from 'vuex'
import expressDetail from '../../components/expressDetail'
export default {
  props: ['dataExp', 'search'],
  components: {
    MPagination,
    expressDetail
  },
  computed: {
    ...mapState({
      whackId: (state) => {
        return state.leftbar.whackId
      }
    })
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
      this.getExpressList(this.dataExp.id)
    },
    dataExp(val) {
      this.currentPage = 1
      this.tableData = []
      this.selectNum = 0
      if (val.id) {
        this.getExpressList(this.whackId)
        this.dataLogitcs = val
      }
    }
  },
  created() {
    // console.log('dataExp', this.dataExp)
    const staff = localStorage.getItem('staff')
    if (staff) {
      this.staffId = JSON.parse(staff).id
    }
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    this.getExpressList(this.dataExp.id)
  },
  mounted() {},
  data() {
    return {
      // regtype 商品类型
      regtype: '',
      // 审核传参
      checkBatchParams: [],
      checkParams: [],
      options: [
        {
          value1: '2',
          label: '中通云仓'
        },
        {
          value1: '1',
          label: '京东云仓'
        },
        {
          value1: '0',
          label: '不指定承运商'
        }
      ],
      value1: '2',
      dialogVisiblePass: false,
      expressBatch: [],
      expressNu: [],
      selecInformation: '',
      selectNum: '',
      searchIn: [],
      dataLogitcs: '',
      searchTime: '',
      topticId: '',
      rowKey: 0,
      teacherId: '',
      createDataExp: '',
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
      teamId: ''
    }
  },
  methods: {
    handleCloseDrawer() {
      this.timeline = false
    },
    // 页数问题
    handleChangeSize(pageItem) {
      this.currentPage = 1
      this.currentItem = pageItem
      this.scrollToTop()
      this.getExpressList(this.dataExp.id)
    },
    handleSizeChange(val) {
      this.currentPage = val
      this.scrollToTop()
      this.getExpressList(this.dataExp.id)
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

      console.log('审核通过')
    },
    // 审核通过时选择物流承运商
    selectExpress(val) {},
    handleClosePass() {
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
                this.getExpressList(this.dataExp.id)
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
      console.log('processing-pass', val)
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
          console.log(res, '-----------------res.payload')
          if (payload.length === 0) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            setTimeout(() => {
              this.getExpressList(this.dataExp.id)
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
    handleChange(val) {
      // console.log(val, 'handleChange')
    },
    // 表头样式
    headerStyle() {
      return 'font-size: 12px;color: #666;font-weight: normal;'
    },
    handleExpressTo(row, column, event) {
      console.log(row + column + event, 'row, column, event')
    },

    getExpressList(id) {
      let timeType = {}
      this.searchIn.forEach((item) => {
        if (item && item.term) {
          if (item.term.user_id) {
            timeType.user_id = item.term.user_id
          }
          if (item.term && item.term.regtype) {
            timeType.regtype = `${item.term.regtype}`
          }
          if (item.term && item.term.last_team_id) {
            timeType.last_team_id = item.term.last_team_id
          }
          if (item.term && item.term.teacher_id) {
            timeType.teacher_id = item.term.teacher_id
          }
          if (item.term && item.term['product_version.keyword']) {
            timeType.product_version = `${item.term['product_version.keyword']}`
          }
        }
        if (item && item.terms) {
          if (item.terms.sup) {
            timeType.sup = `${item.terms.sup}`
          }
          if (item.terms.term) {
            timeType.term = `${item.terms.term}`
          }
          // level
          if (item.terms.level) {
            timeType.level = `${item.terms.level}`
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
      this.teacherId && (timeType.teacher_id = this.teacherId)
      timeType = {
        ...timeType,
        express_status: id
      }
      const query = JSON.stringify(timeType)
      console.log(timeType, 'timeType')
      if (timeType.regtype) {
        // this.$store.commit('getShowStatus', false)
        // console.log(this.regtype, 'regtype regtype regtype regtype ')
        if (timeType.regtype === '4' || timeType.regtype === '5') {
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
      }
      axios
        .post('/graphql/logisticsList', {
          query: `{LogisticsListPage(query:${JSON.stringify(query)}, size: ${
            this.currentItem
          }, page: ${this.currentPage}) {
            first
            last
            number
            size
            totalPages
            totalElements
            content {
              id
              product_name
              delivery_collect_time
              express_status
              express_status_chinese
              buy_time
              province
              area
              city
              address_detail
              express_company
              signing_time
              receipt_name
              receipt_tel
              express_nu
              level
              ctime
              utime
              sup
              term
              product_version
              last_team_id
              teacher_id
              user {
                id
                birthday
                mobile
              }
            }
          }
        }`
        })
        .then((res) => {
          this.tableData = []
          if (res.data.LogisticsListPage) {
            const resData = res.data.LogisticsListPage.content
            const realnameId = [] // 老师Id
            const teamId = [] // 班级Id
            resData.forEach((item) => {
              realnameId.push(item.teacher_id)
              teamId.push(item.last_team_id)
              item.crtime = formatData(+item.ctime, 's')
              item.detime = formatData(+item.delivery_collect_time, 's')
              item.uptime = formatData(+item.utime, 's')
              item.sgtime = formatData(+item.signing_time, 's')
              item.buytime = formatData(+item.buy_time, 's')
              return item
            })

            this.tableData = resData
            // 总页数
            this.totalPages = +res.data.LogisticsListPage.totalPages

            this.totalElements = +res.data.LogisticsListPage.totalElements // 总条数
            this.getTeacherList(realnameId)
            this.getStudentTeamList(teamId)
          }
        })
    },
    // 异步获取班级期数名称
    getStudentTeamList(id) {
      const queryString = JSON.stringify({ id: id })
      axios
        .post('/graphql/v1/toss', {
          query: `{ StudentTeamList(query:${JSON.stringify(queryString)}){
                      id
                      team_name
                    }
                    }       `
        })
        .then((res) => {
          const obj = {}
          res.data.StudentTeamList.forEach((item) => {
            // {`${item.name}`:item.term}
            obj[item.id] = item.team_name
          })
          this.StudentTeamList = obj
        })
    },
    getTeacherList(id) {
      const queryString = JSON.stringify({ id: id })
      axios
        .post('/graphql/v1/toss', {
          query: `{TeacherList(query:${JSON.stringify(queryString)}){
                      id
                      realname
                    }
                    }       `
        })
        .then((res) => {
          const obj = {}

          res.data.TeacherList.forEach((item) => {
            // {`${item.name}`:item.term}
            obj[item.id] = item.realname
          })
          this.TeacherList = obj
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
      console.log(this.$refs.zi, 'this.$refs.zi.drawer')
      this.$refs.zi.drawer = true
      console.log(row, 'row')
      this.transferExpress = row
    },
    // scrotop
    scrollToTop() {
      document
        .getElementById('right-scroll')
        .querySelector('.scrollbar-wrapper').scrollTop = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 50px;
  background-color: #fff;
  color: #666;
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
</style>
