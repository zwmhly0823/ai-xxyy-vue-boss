<template>
  <div class="container">
    <div class="automatic-config">
      <el-dropdown @command="handleCommand" v-if="powerStatus =='1' || role =='5' && (activeName =='0' || activeName =='1' || activeName =='4')">
        <span class="el-dropdown-link">
          <span><i class="el-icon-setting"></i>设置</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="import" v-if="powerStatus =='1'">导入物流信息</el-dropdown-item>
          <el-dropdown-item command="export" v-if="powerStatus =='1'">导出物流信息</el-dropdown-item>
          <!-- <el-dropdown-item
            v-show="activeName === '0' || activeName === '1'"
            command="setting"
            >自动发货设置</el-dropdown-item
          > -->
          <el-dropdown-item
            v-show="(activeName === '0' || activeName === '1' || activeName === '4') && role =='5'"
            command="delivery"
            >一键批量发货</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane label="双周体验课" name="0">
        <div v-if="activeName == '0'">
          <rightUp
            ref="right0"
            :tab="activeName"
            @result="getSearch"
            :regtype="regtype"
            :status="sortItem.id"
            :source_type="source_type"
            :hideCol="hideCol"
            :hideSearchItem="hideSearchItem"
            :teamClass="teamClass"
            :addSupS="false"
            :exType="2"
          />
          <toggle
            @result="getStatus"
            :tab="activeName"
            :seachTotal="seachTotal"
            :regtype="regtype"
            :source_type="source_type"
          />
          <el-scrollbar
            wrap-class="scrollbar-wrapper-first"
            id="express-right-scroll-first"
          >
            <div class="scroll" ref="scroll" :style="{ height: scrollHeight }">
              <rightDown
                :search="search"
                :sortItem="sortItem"
                :regtype="regtype"
                :source_type="source_type"
                :hideCol="hideCol"
                :exType="2"
                @getTotal="getTotal"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="单周体验课" name="4">
        <div v-if="activeName == '4'">
          <rightUp
            ref="right4"
            :tab="activeName"
            @result="getSearch"
            :regtype="regtype"
            :status="sortItem.id"
            :source_type="source_type"
            :hideCol="hideCol"
            :hideSearchItem="hideSearchItem"
            :teamClass="'2'"
            :addSupS="false"
            :exType="1"
          />
          <toggle
            @result="getStatus"
            :tab="activeName"
            :seachTotal="seachTotal"
            :regtype="regtype"
            :source_type="source_type"
          />
          <el-scrollbar
            wrap-class="scrollbar-wrapper-first"
            id="express-right-scroll-first"
          >
            <div class="scroll" ref="scroll" :style="{ height: scrollHeight }">
              <rightDown
                :search="search"
                :sortItem="sortItem"
                :regtype="regtype"
                :source_type="source_type"
                :hideCol="hideCol"
                @getTotal="getTotal"
                :exType="1"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统课" name="1">
        <div v-if="activeName == '1'">
          <rightUp
            ref="right1"
            :tab="activeName"
            @result="getSearch"
            :regtype="regtypeSys"
            :status="sortItem.id"
            :source_type="source_type"
            :hideCol="allExpressHideCol"
            :hideSearchItem="allExpressHideSearchItemSystem"
            :teamClass="teamClassSys"
            :addSupS="true"
          />
          <toggle
            @result="getStatus"
            :tab="activeName"
            :seachTotal="seachTotal"
            :regtype="regtypeSys"
            :source_type="source_type"
          />
          <el-scrollbar
            wrap-class="scrollbar-wrapper-first"
            id="express-right-scroll-first"
          >
            <div class="scroll" ref="scroll" :style="{ height: scrollHeight }">
              <rightDown
                :search="searchSystem"
                :sortItem="sortItem"
                :regtype="regtypeSys"
                :isType="true"
                :source_type="source_type"
                @getTotal="getTotal"
                :hideCol="allExpressHideCol"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="活动商品" name="2">
        <div v-if="activeName == '2'">
          <rightUp
            ref="right2"
            @result="getSearch"
            :regtype="`0,${regtypeActivity}`"
            :status="sortItem.id"
            :source_type="source_type"
            :hideCol="allExpressHideColActivity"
            :hideSearchItem="allExpressHideSearchItemActivity"
          />
          <toggle
            @result="getStatus"
            :tab="activeName"
            :seachTotal="seachTotal"
            :regtype="`0,${regtypeActivity}`"
            :source_type="source_type"
            :hideToggleBtn="allHideToggleBtn"
          />
          <el-scrollbar
            wrap-class="scrollbar-wrapper-first"
            id="express-right-scroll-first"
          >
            <div class="scroll" ref="scroll" :style="{ height: scrollHeight }">
              <rightDown
                :search="searchActivity"
                :sortItem="sortItem"
                @getTotal="getTotal"
                :regtype="`0,${regtypeActivity}`"
                :source_type="
                  (searchActivity &&
                    searchActivity[0] &&
                    searchActivity[0].term &&
                    searchActivity[0].term.source_type) ||
                  source_type
                "
                :hideCol="allExpressHideColActivity"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane label="补发商品" name="3">
        <div v-if="activeName == '3'">
          <rightUp
            ref="right3"
            :tab="activeName"
            @result="getSearch"
            :regtype="`0,${regtype},${regtypeSys},${regtypeActivity}`"
            :status="sortItem.id"
            :source_type="'5'"
            :hideCol="replenishHideCol"
            :hideSearchItem="replenishHideSearchItem"
            teamClass=""
          />
          <toggle
            @result="getStatus"
            :seachTotal="seachTotal"
            :hideToggleBtn="hideToggleBtn"
            :tab="activeName"
            :regtype="`0,${regtype},${regtypeSys},${regtypeActivity}`"
            :source_type="'5'"
          />
          <el-scrollbar
            wrap-class="scrollbar-wrapper-first"
            id="express-right-scroll-first"
          >
            <div class="scroll" :style="{ height: scrollHeight }">
              <rightDown
                :search="searchReplenish"
                :sortItem="sortItem"
                @getTotal="getTotal"
                :regtype="`0,${regtype},${regtypeSys},${regtypeActivity}`"
                :source_type="'5'"
                :hideCol="replenishHideCol"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 自动发货设置弹窗 -->
    <el-dialog
      class="set-up-dialog"
      title="自动发货设置"
      :visible.sync="isShowSetUp"
      @close="setUpClose"
      width="600px"
    >
      <div class="set-up-area">
        <div class="config-items time-switch">
          <span class="label">规则条件:</span>
          <div class="time-groups">
            <div
              class="time-item"
              v-for="(item, index) in automaticParams"
              v-show="item.type == 'AUTOMATIC'"
              :key="index"
            >
              <el-input v-model="item.tag" disabled>
                <template slot="prepend">每天</template>
              </el-input>
              <el-switch
                v-model="item.status"
                :width="45"
                active-color="#13ce66"
                active-value="ON"
                inactive-value="OFF"
                active-text="开"
                inactive-text="关"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div class="config-items effective-time">
          <span class="label">生效时间:</span>
          <span>长期有效</span>
        </div>
        <div class="config-items nationwide">
          <span class="label">开启全国调拨:</span>
          <el-switch
            v-model="automaticParams[0].status"
            @change="switchHandle"
            :width="45"
            active-color="#13ce66"
            active-value="ON"
            inactive-value="OFF"
            active-text="开"
            inactive-text="关"
          >
          </el-switch>
          <span class="warring">请谨慎开启！</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="immediately"> 立即发货 </el-button>
        <el-button v-if="!taskStatus" @click="timedTask">
          启用定时发货
        </el-button>
        <el-button disabled v-else>定时发货已开启</el-button>
        <el-button :disabled="isDisabledPause" @click="pauseAll">
          暂停
        </el-button>
      </span>
    </el-dialog>
    <el-dialog title="一键批量发货" :visible.sync="dialogDelivery" width="30%">
      <section class="deliverycon" v-if="activeName === '0'">
        <el-row> <span>物流类型:</span> <b>体验课</b> </el-row>
        <el-row>
          <span>排期:</span> <b>{{ deliveryParams.termText }}</b>
        </el-row>
        <el-row>
          <span>难度:</span> <b>{{ deliveryParams.supText }}</b>
        </el-row>
      </section>
      <section class="deliverycon" v-if="activeName === '1'">
        <el-row> <span>物流类型:</span> <b>系统课</b> </el-row>
        <el-row>
          <span>级别:</span> <b>{{ deliveryParams.levelText }}</b>
        </el-row>
        <el-row>
          <span>难度:</span> <b>{{ deliveryParams.supText }}</b>
        </el-row>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-popconfirm
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="godelivery"
          v-loading.fullscreen.lock="fullscreenLoading"
          icon="el-icon-info"
          iconColor="red"
          title="确定要立即发货吗？"
        >
          <el-button slot="reference" type="primary">一键发货</el-button>
        </el-popconfirm>
        <el-button @click="dialogDelivery = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import toggle from '../components/toggle'
import rightDown from '../components/rightDown'
import rightUp from '../components/rightUp'
import { courseLevelReplace } from '@/utils/supList.js'
const allExpressHideCol = {
  replenishType: false,
  productType: false,
  replenishReason: false,
  applicant: false,
  term: false,
  courseType: false,
}
const allExpressHideColActivity = {
  replenishType: false,
  productType: false,
  replenishReason: false,
  applicant: false,
  productVersion: false,
  term: false,
  className: false,
  teacher: false,
}
const allExpressHideSearchItem = {
  level: '',
  replenishReason: '',
  replenishMethod: '',
}
const allExpressHideSearchItemSystem = {
  // 系统课物流需要显示级别
  level: 'level',
  replenishReason: '',
  replenishMethod: '',
  teacherTip: '辅导老师',
}
const allExpressHideSearchItemActivity = {
  productName: 'product_name',
  level: 'level',
  replenishReason: '',
  replenishMethod: '',
  moreVersion: '',
  sup: '',
  schedule: '',
  groupSell: '',
  teamDetail: '',
  // topicType: 'regtype',
  productType: 'productType',
}
const replenishHideCol = {
  approvalReissueInfo: true,
  productName: true,
  productVersion: false,
  term: false,
  className: false,
  classNameBf: true,
  teacher: false,
  courseType: false,
  applicant: false,
  productType: false,
}
const replenishHideSearchItem = {
  level: 'level',
  moreVersion: '',
  // schedule: '',
  groupSell: '',
  teamDetail: '',
  operatorId: 'operator_id',
  regType: 'regType',
}
const allExpressSourceType = '0,1,2,3,4,6,7,8'
const replenishSourceType = '5'
export default {
  components: {
    toggle,
    rightDown,
    rightUp,
  },
  data() {
    return {
      courseLevelReplace,
      tabsShowed: ['0'],
      dialogDelivery: false, // 一键发货弹窗
      deliveryParams: {},
      fullscreenLoading: false,
      isShowSetUp: false, // 自动发货按钮配置弹窗
      scrollHeight: 'auto', // scroll高度
      automaticParams: [
        {
          type: 'COUNTRY',
          tag: '',
          status: 'OFF',
        },
        {
          type: 'AUTOMATIC',
          tag: '10:00',
          status: 'OFF',
        },
        {
          type: 'AUTOMATIC',
          tag: '14:00',
          status: 'OFF',
        },
        {
          type: 'AUTOMATIC',
          tag: '20:00',
          status: 'OFF',
        },
      ],
      taskStatus: false, // 定时发货任务是否开启 true/false
      isDisabledPause: true, // 自动发货弹窗暂停按钮是否可用 true/false
      activeName: '0',
      sortItem: {},
      search: '',
      searchSystem: '',
      searchReplenish: '',
      searchActivity: '',
      replenishSourceType,
      hideSearchItem: allExpressHideSearchItem,
      regtype: '1', // 体验课是1  系统课是2，3
      regtypeSys: '2,3',
      regtypeActivity: '4,5,6',
      hideToggleBtn: ['9', '0'],
      source_type: allExpressSourceType,
      hideCol: allExpressHideCol,
      allExpressHideCol,
      allExpressHideColActivity,
      replenishHideCol,
      allHideToggleBtn: ['9'],
      teamClass: '0', // 排期组件添加类别区分 系统课传1 体验课传0
      teamClassSys: '1', // 排期组件添加类别区分 系统课传1 体验课传0
      allExpressHideSearchItemActivity,
      allExpressHideSearchItemSystem,
      replenishHideSearchItem,
      seachTotal: 0,
      powerParams: {},
      powerStatus:null,
      role:null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcSrollHeight()
    })
    this.powerParams.uid = JSON.parse(localStorage.getItem('staff')).id
    this.role =JSON.parse(localStorage.getItem('staff')).roleList && JSON.parse(localStorage.getItem('staff')).roleList[0]
    this.powerParams.type = this.activeName
    this.initData(this.powerParams)
  },
  // 判断操作导出权限
  watch: {
    activeName(val) {
      if (val) {
        this.powerParams.type = val;
        this.initData(this.powerParams)
      }
    },
  },
  methods: {
   async initData(params) {
      let result = await this.$http.Express.expressIsSwitch(params).then((res) => {
        this.powerStatus = res.data.isSwitch.is_allow
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'setting':
          this.showSetUp()
          break
        case 'import':
          this.$refs['right' + this.activeName].showImportDialog()
          break
        case 'export':
          this.$refs['right' + this.activeName].showExportDialog()
          break
        case 'delivery':
          this.showDelivery()
          break
      }
    },
    // 计算滚动区域高度
    calcSrollHeight() {
      const topH = this.$refs.scroll.getBoundingClientRect().y
      const scrollH = document.body.clientHeight - topH - 60
      this.scrollHeight = scrollH + 'px'
    },
    // 获取自动发货所有开关数据
    getSwitchByType() {
      const types = 'AUTOMATIC,COUNTRY'
      this.$http.Express.getSwitchByType(types).then((res) => {
        // 初始化按钮状态
        this.taskStatus = false
        this.isDisabledPause = true
        res.payload.forEach((item, index) => {
          if (index > 0 && item.status === 'ON') {
            this.taskStatus = true
          }
          if (item.status === 'ON') {
            this.isDisabledPause = false
          }
        })
        this.automaticParams = res.payload
      })
    },
    // 开启定时任务
    timedTask() {
      // 开启定时任务校验
      let flag = false
      this.automaticParams.forEach((item, index) => {
        if (index > 0 && item.status === 'ON') {
          flag = true
        }
      })
      if (!flag) {
        this.$message.error('当前没有设置定时规则条件')
        return false
      }
      const h = this.$createElement
      const title = `你确定要启用定时自动发货任务?`
      const content = `启动后将所有待审核发货任务将在所设定的时间自动发货`
      this.$confirm(
        h('div', null, [
          h('p', { style: 'font-weight: 600;' }, title),
          h('p', null, content),
        ]),
        {
          showCancelButton: true,
          type: 'warning',
        }
      )
        .then(() => {
          const params = this.automaticParams.filter(
            (item, index) => item.type === 'AUTOMATIC'
          )
          const msg = {
            success: '定时发货任务启用成功',
            error: '定时发货任务启用失败',
          }
          this.updateSwitchStatus(params, msg)
        })
        .catch(() => {
          this.$message.warning('没有发生变化')
        })
    },
    // 立即发货
    immediately() {
      const h = this.$createElement
      const title = `你确定要立即启动自动发货任务?`
      const content = `启动后将所有待审核发货任务进行批量自动发货，请谨慎操作！`
      this.$confirm(
        h('div', null, [
          h('p', { style: 'font-weight: 600;' }, title),
          h('p', null, content),
        ]),
        {
          showCancelButton: true,
          type: 'warning',
        }
      )
        .then(() => {
          // 立即发货接口
          this.$http.Express.immediately().then((res) => {
            if (res.payload) {
              this.$message.success('自动发货任务启动成功')
            } else {
              this.$message.error('自动发货任务启动失败')
            }
          })
        })
        .catch(() => {
          this.$message.warning('没有发生变化')
        })
    },
    // 暂停所有自动任务
    pauseAll() {
      const h = this.$createElement
      const title = `你确定要暂停所有自动发货任务吗?`
      const content = `暂停后将所有已开启的发货任务将暂停`
      this.$confirm(
        h('div', null, [
          h('p', { style: 'font-weight: 600;' }, title),
          h('p', null, content),
        ]),
        {
          showCancelButton: true,
          type: 'warning',
        }
      )
        .then(() => {
          const params = this.automaticParams.map((item, index) => {
            let { type, tag, status } = item
            status = 'OFF'
            return { type, tag, status }
          })
          const msg = {
            success: '全部任务已暂停',
            error: '暂停失败',
          }
          this.updateSwitchStatus(params, msg)
        })
        .catch(() => {
          this.$message.warning('没有发生变化')
        })
    },
    // 打开一键发货弹窗
    showDelivery() {
      this.deliveryParams = {}
      const staff = JSON.parse(localStorage.getItem('staff'))
      if (staff && staff.id) {
        this.deliveryParams.operatorId = staff.id
      }
      if (this.activeName === '0') {
        this.deliveryParams.type = 1
        this.search &&
          this.search.forEach((item) => {
            if (item && item.terms && item.terms.sup) {
              if (item.terms.sup.length > 1) {
                this.$message.warning('请选择单个难度、单个排期')
              } else {
                this.deliveryParams.sup = item.terms.sup.toString()
                this.deliveryParams.supText = this.$refs.right0.$refs.msearch.$refs.stagesuplevels.$refs.sup_select.$refs.tags.innerText
              }
            }
            if (item && item.term && item.term.term) {
              this.deliveryParams.term = item.term.term
              this.deliveryParams.termText = this.$refs.right0.$refs.msearch.$refs.schedule.$refs.term_autocomplete.value
            }
          })
        if (!this.deliveryParams.term || !this.deliveryParams.sup) {
          this.$message.warning('请选择单个难度、单个排期')
        } else {
          this.dialogDelivery = true
        }
      }
      // this.$message.warning('请选择难度、排期')
      if (this.activeName === '1') {
        this.deliveryParams.type = 2
        this.searchSystem &&
          this.searchSystem.forEach((item) => {
            if (item && item.terms && item.terms.sup) {
              if (item.terms.sup.length > 1) {
                this.$message.warning('请选择单个难度、单个级别')
              } else {
                this.deliveryParams.sup = item.terms.sup.toString()
                this.deliveryParams.supText = this.$refs.right1.$refs.msearch.$refs.stagesuplevels.$refs.sup_select.$refs.tags.innerText
              }
            }
            if (item && item.terms && item.terms.level) {
              if (item.terms.level.length > 1) {
                this.$message.warning('请选择单个难度、单个级别')
              } else {
                this.deliveryParams.level = item.terms.level.toString()
                this.deliveryParams.levelText = this.$refs.right1.$refs.msearch.$refs.stagesuplevels.$refs.level_select.$refs.tags.innerText
              }
            }
          })
        if (!this.deliveryParams.level || !this.deliveryParams.sup) {
          this.$message.warning('请选择单个难度、单个级别')
        } else {
          this.dialogDelivery = true
        }
      }
    },
    // 一键发货按钮
    godelivery() {
      this.fullscreenLoading = true
      const params = this.deliveryParams
      this.$http.Express.deliveryByCenter(params).then((res) => {
        if (res.payload.length) {
          this.$message.warning(res.payload[0].message)
        } else {
          this.$message.success('发货任务已启动')
          this.dialogDelivery = false
        }
        this.fullscreenLoading = false
      })
    },
    // 自动发货配置弹窗关闭
    setUpClose() {
      this.isShowSetUp = false
    },
    // 打开物流开关设置弹窗
    showSetUp() {
      this.getSwitchByType()
      this.isShowSetUp = true
    },
    // 开关处理
    switchHandle(status) {
      const isOpen = status === 'ON' ? '开启' : '关闭'
      const h = this.$createElement
      const title = `你确定要${isOpen}全国调拨吗?`
      const content =
        status === 'ON' ? `开启后将不考虑物流成本，实现全国仓有货即发！` : ''
      this.$confirm(
        h('div', null, [
          h('p', { style: 'font-weight: 600;' }, title),
          h('p', null, content),
        ]),
        {
          showCancelButton: true,
          type: 'warning',
        }
      )
        .then(() => {
          const params = this.automaticParams.filter(
            (item, index) => item.type === 'COUNTRY'
          )
          const msg = {
            success: `全国自动调拨${isOpen}成功`,
            error: `全国自动调拨${isOpen}失败`,
          }
          this.updateSwitchStatus(params, msg)
        })
        .catch(() => {
          this.$message.warning('没有发生变化')
          this.automaticParams[0].status = status === 'ON' ? 'OFF' : 'ON'
        })
    },
    // 更新自动发货状态
    updateSwitchStatus(params, msg) {
      this.$http.Express.updateSwitchStatus(params)
        .then((res) => {
          if (res.status === 'OK') {
            this.$message.success(msg.success)
            this.getSwitchByType()
          } else {
            this.$message.error(msg.error)
          }
        })
        .catch(() => {
          this.$message.error(msg.error)
        })
    },
    // 获取物流搜索的条件值
    getSearch(val) {
      switch (this.activeName) {
        case '0':
          this.search = val
          break
        case '1':
          this.searchSystem = val
          break
        case '2':
          this.searchActivity = val
          break
        case '3':
          this.searchReplenish = val
          break
        case '4':
          this.search = val
          break
      }
    },
    getStatus(val) {
      this.sortItem = val
      this.handleHideCol(val)
    },
    getTotal(data) {
      this.seachTotal = data
    },
    // 展示失败原因
    handleHideCol(val) {
      if (
        (val.id === '6' && val.center_express_id?.gt === 0) ||
        val.id === '7' ||
        val.id === '9'
      ) {
        this.$set(this.hideCol, 'expressRemark', true)
      } else {
        this.$set(this.hideCol, 'expressRemark', false)
      }
    },
    switchTab(tab) {
      !this.tabsShowed.includes(this.activeName) &&
        this.tabsShowed.push(this.activeName)
      this.tabsShowed = [...this.tabsShowed]
      this.sortItem = {}
      // // 补发商品
      // if (this.activeName === '3') {
      //   this.hideSearchItem = replenishHideSearchItem
      //   this.hideCol = replenishHideCol
      //   this.source_type = replenishSourceType
      // }
      // // 活动商品
      // else if (this.activeName === '2') {
      //   this.hideSearchItem = allExpressHideSearchItemActivity
      //   this.hideCol = allExpressHideColActivity
      //   this.source_type = allExpressSourceType
      // }
      // // 系统课
      // else if (this.activeName === '1') {
      //   this.hideSearchItem = allExpressHideSearchItemSystem
      //   this.hideCol = allExpressHideCol
      //   this.source_type = allExpressSourceType
      // }
      // // 体验课
      // else {
      //   this.hideSearchItem = allExpressHideSearchItem
      //   this.hideCol = allExpressHideCol
      //   this.source_type = allExpressSourceType
      // }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 10px;
  .fixed-tabs {
    position: fixed;
  }
  .automatic-config {
    height: 40px;
    line-height: 40px;
    position: absolute;
    right: 15px;
    top: 0px;
    z-index: 2;
    cursor: pointer;
    font-weight: 500;
    color: #909399;
  }
  .set-up-area {
    .config-items {
      display: flex;
      margin-bottom: 20px;
      .label {
        width: 100px;
        text-align: right;
        padding-top: 12px;
        margin-right: 15px;
      }
    }
    .time-switch {
      .time-groups {
        flex: 1;
        .time-item {
          display: flex;
          align-items: center;
          margin-top: 15px;
          &:first-child {
            margin-top: 0;
          }
          .el-input {
            width: 60%;
          }
        }
      }
    }
    .effective-time {
      span {
        padding-top: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
.set-up-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #e6e6e6;
  }
}
.time-item,
.nationwide {
  .el-switch__label--left {
    position: relative;
    left: 48px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label--right {
    position: relative;
    right: 48px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label.is-active {
    z-index: 1111;
    color: #fff;
  }
}
.nationwide {
  .el-switch {
    padding-top: 20px;
    margin-left: -25px;
  }
  .warring {
    padding-top: 12px;
    font-weight: 500;
    color: red;
  }
}
.deliverycon {
  padding: 0 20px;
  b {
    font-size: 20px;
  }
  span {
    width: 80px;
    display: inline-block;
  }
}
</style>
