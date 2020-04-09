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
      <el-table-column type="selection" width="25" v-if="!teacherId">
      </el-table-column>
      <el-table-column width="25" v-if="!teacherId">
        <template slot-scope="scope" v-if="dataExp.id == 6">
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
      <el-table-column label="用户及购买日期">
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
      <el-table-column label="商品信息" width="300">
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.product_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="240">
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
      <el-table-column label="物流状态">
        <template slot-scope="scope">
          <div class="express">
            <div :class="'wait_' + scope.row.express_status">
              {{ scope.row.express_status_chinese }}
            </div>
            <el-button
              class="trail"
              type="text"
              @click="Express(scope.row.express_nu, scope.row.express_company)"
            >
              追踪
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流创建·揽收·签收" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="sign">
            <div>创建:{{ scope.row.crtime }}</div>
            <div>揽收:{{ scope.row.detime }}</div>
            <div>签收:{{ scope.row.sgtime }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      custom-class="my-dialog"
      :visible.sync="timeline"
      width="40%"
      v-model="expressDetail"
    >
      <div class="line">
        <div class="logistics">
          <span>物流公司：</span><span>{{ expressTitle.company }}</span>
        </div>
        <span>快递单号：</span>
        <span>{{ expressTitle.nu }}</span>
      </div>
      <div class="waitFor" v-show="waitFor">快递待揽收</div>
      <el-timeline v-show="timeLine">
        <el-timeline-item
          v-for="(value, index) in expressDetail"
          :key="index"
          :color="activities.color"
        >
          <div class="statebox" v-for="(item, key) in value" :key="key">
            <div class="state" v-if="key === 0">{{ item.status }}</div>
            <div class="content">{{ item.context }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <div class="dialog-shenhe">
      <el-dialog
        title="选择承运商"
        :visible.sync="dialogVisiblePass"
        width="30%"
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
      :pageSizeArr="[20, 100, 200, 500, 1000]"
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
export default {
  props: ['dataExp', 'search'],
  components: {
    MPagination
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
      if (val.id) {
        this.getExpressList(val.id)
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
    console.log(
      teacherId,
      'v-show="!teacherId"v-show="!teacherId"v-show="!teacherId"'
    )

    if (teacherId) {
      this.teacherId = teacherId
    }
    this.getExpressList(this.dataExp.id)
  },
  mounted() {},
  data() {
    return {
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
      enter: false,
      cout: 0,
      // 弹出层
      timeline: false,
      // 时间线样式
      activities: {
        size: 'large',
        type: 'primary',
        color: '#0bbd87'
      },
      staffId: '',
      currentItem: 20
    }
  },
  methods: {
    // 页数问题
    handleChangeSize(pageItem) {
      this.currentItem = pageItem
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
          operatorId: this.teacherId,
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
      }).then(({ value }) => {
        if (!value) {
          return
        }

        axios
          .post(
            `/api/o/v1/express/updateExpressToInvalid?expressIds=${val}&expressRemark=${value}&operatorId=${this.staffId}`
          )
          .then(async (res) => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            setTimeout(() => {
              this.getExpressList(this.dataExp.id)
              // TODO: 成功后同步左侧列表 待审核 数量
            }, 1000)
          })
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
    check(params, src = `/api/o/v1/express/deliveryRequest`) {
      axios
        .post(src, params)
        .then((res) => {
          // payload 是数组，错误信息逐个返回.全正确时返回空数组
          /**
           * {
           *  code: 80000210
              message: "不符合发货条件，expressId：{123552}"
              }
           */
          const { payload } = res
          if (payload.length === 0) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            this.getExpressList(this.dataExp.id)
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
      console.log(this.checkBatchParams, 'this.checkBatchParams')

      const uid = selection.map((item) => {
        return item.id
      })
      if (sessionStorage.getItem('uid')) {
        sessionStorage.removeItem('uid')
      }
      sessionStorage.setItem('uid', uid)
      console.log(selection, 'selection,row')
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
    handleSizeChange(val) {
      this.currentPage = val
      this.getExpressList(this.dataExp.id)
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
      })
      this.teacherId && (timeType.teacher_id = this.teacherId)
      timeType = {
        ...timeType,
        express_status: id
      }
      const query = JSON.stringify(timeType)
      console.log(timeType, 'timeType', query)
      // console.log(query)
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
      user{
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
            resData.forEach((item) => {
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
          }
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
    Express(expressNu, company) {
      this.timeline = true
      this.expressTitle.nu = expressNu
      this.expressTitle.company = company
      this.$http.Express.ExpressList({ expressNo: expressNu })
        .catch((err) => console.log(err))
        .then((res) => {
          if (res && res.payload) {
            this.waitFor = false
            console.log('ress----', res && res.payload)
            this.timeLine = true
            const lastData = {}
            res.payload[0].data.forEach((item) => {
              if (item.status === '揽收') {
                lastData.begin = lastData.begin == null ? [] : lastData.begin
                lastData.begin.push(item)
              } else if (item.status === '在途' || item.status === '派件') {
                lastData.onway = lastData.onway == null ? [] : lastData.onway
                lastData.onway.push(item)
              } else {
                lastData.receive =
                  lastData.receive == null ? [] : lastData.receive
                lastData.receive.push(item)
              }
              this.expressDetail = lastData
            })
          } else {
            this.expressDetail = []
            this.waitFor = true
          }
        })
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
  .line {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid gainsboro;
    // margin-top: -40px;
    margin-bottom: 22px;
    .logistics {
      margin-bottom: 6px;
    }
  }
  .waitFor {
    font-size: 16px;
    color: rgb(190, 190, 190);
    text-align: center;
  }
  .statebox {
    margin-bottom: 20px;
    .state {
      font-size: 18px;
      line-height: 30px;
    }
    .content {
      line-height: 20px;
    }
    .time {
      line-height: 20px;
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
