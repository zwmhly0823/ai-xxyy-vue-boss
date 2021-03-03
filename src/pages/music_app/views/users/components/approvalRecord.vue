<template>
  <div :class="$style.main_content" ref="main_height">
    <drawer-right
      :drawerApprovalDeatails="drawerApprovalDeatail"
      ref="drawer"
    />
    <!-- 三调系列+随材打包申请抽屉 -->
    <adjust-drawer
      :is3d="1"
      ref="adjustDrawerCom"
      :adjustDrawerData="adjustDrawerData"
      v-if="isFlag"
      @result="adjustDrawerPass"
    ></adjust-drawer>
    <!-- 赠品审批抽屉 -->
    <ApprovalGiftDetail
      v-if="isFlags"
      :drawerGiftDeatail="drawerGiftDeatail"
      :drawerGift="drawerGift"
      @close-gift="handleClose"
    />
    <el-table
      v-if="tableData.length * 1 !== 0"
      :header-cell-style="{ background: '#f8fafe' }"
      :data="tableData"
      height="calc(100vh - 290px)"
      style="width: 100%"
    >
      <el-table-column prop="refundTypeStr" label="审批类型" width="120">
        <template slot-scope="scope">
          <div v-show="scope.row.type === 1">
            补发货审批
          </div>
          <div v-show="scope.row.type === 0">
            退款审批
          </div>
          <div v-if="scope.row.type === 3">
            调期申请
          </div>
          <div v-else-if="scope.row.type === 2">
            调班申请
          </div>
          <div v-if="scope.row.type === 4">
            调级申请
          </div>
          <div v-if="scope.row.type === 6">
            随材打包
          </div>
          <!-- <div v-if="scope.row.type === 5">
            无归属订单审批
          </div> -->
          <div v-if="scope.row.type === 7">
            赠品
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="审批状态" width="150">
        <template slot-scope="scope">
          <div v-show="scope.row.status === 1">
            审批通过
          </div>
          <div v-show="scope.row.status === 0">
            审批中
          </div>
          <div v-if="scope.row.status === 3">
            审批驳回
          </div>
          <div v-else-if="scope.row.status === 2">
            已撤销
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="apply_name" label="申请人" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.apply_name }}-{{ scope.row.apply_department }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="申请时间" width="200">
        <template slot-scope="scope">
          {{ formatDate(scope.row.ctime) }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="审批时间" width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 2 || scope.row.status === 0">
            -
          </div>
          <div v-else>
            {{
              scope.row.end_time !== '0' ? formatDate(scope.row.end_time) : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="refundReason" label="审批摘要" min-width="300">
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.abstract_contents"
            :key="index"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template slot-scope="scope">
          <span
            :class="$style.approval_see"
            @click="
              seeTypeDetails(scope.row.type + '', scope.row.id, scope.row.tag)
            "
            >查看</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div v-else height="calc(100vh - 290px)" :class="$style.approval_no">
      暂无审批记录
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
</template>
<script>
import { formatData, timestamp } from '@/utils/index'
import drawerRight from './approval/drawerRight'
import MPagination from '@/components/MPagination/index.vue'
import adjustDrawer from './approval/adjustDrawer'
import { formatTeamNameSup, SUP_LEVEL_UPPER } from '@/utils/supList'
import ApprovalGiftDetail from './approval/approvalGiftDetail'
export default {
  name: 'approvalRecord',
  components: {
    drawerRight,
    MPagination,
    adjustDrawer,
    ApprovalGiftDetail
  },
  props: ['stuInfor_add'],
  data() {
    return {
      isFlag: false,
      isFlags: false,
      drawerGift: false,
      phone: '',
      drawerApprovalDeatail: null, // 类型详情
      adjustDrawerData: {}, // 三调系列+随材打包申请抽屉数据
      currentPage: 1,
      totalPages: 1,
      totalElements: 0,
      tableData: []
    }
  },
  watch: {
    stuInfor_add(val) {
      console.log(val, 'lllllllllllllllllllllllllll')
      this.phone = val
      this.getList(val)
    }
  },
  methods: {
    // 关闭审批详情查看
    handleClose() {
      this.drawerGift = false
    },
    // 调期调级调班的drawer同意或拒绝
    adjustDrawerPass(type, changeVersionList) {
      this.changeVersionList = changeVersionList
      this.adjustDialogType = type
      if (type === 'pass') {
        this.adjustDrawerData.checkSuggestion = '同意'
      }
      this.adjustResultDialogShow = true
    },
    // 查看类型详情
    /*
      FLOW_TYPE: {
        0: "退款",
        1: "补发货",
        2: "调班",
        3: "调期",
        4: "调级",
        5: "无归属订单",
        6: "打包盒子",
        7: "关单赠品",
      }

      退款审批流程：/v1/backend/refund/detail/get?flowApprovalId=1
      补发货流程审批: /v1/backend/reissue/flow/info?flowApprovalId=1
      调级、
      调期、
      调班流程审批: /v1/backend/adjustment/flow/info?flowApprovalId=1
      无归属订单审批: /v1/backend/uncredited/detail/get?flowApprovalId=1
      打包盒子审批: /v1/backend/packagebox/flow/info?flowApprovalId=1
      关单赠品审批: /v1/backend/promotions/detail/get?flowApprovalId=1
    */
    seeTypeDetails(res, index, tag = 'NONE') {
      const that = this
      // console.log(this.$refs.adjustDrawerCom)
      const content = function(e) {
        console.log(e)
        if (res === '7') {
          that.drawerGiftDeatail = Object.assign(
            { typeName: res, id: index, tag: tag },
            e.payload
          )
          that.drawerGift = true
          that.isFlags = true
          return
        }
        if (res === '6') {
          const payData = e.payload
          that.adjustDrawerData = Object.assign(that.adjustDrawerData, {
            type: 'notDone',
            title: '随材打包申请',
            flowApprovalId: payData.flowApprovalId,
            // 审批权限
            content: [
              {
                label: '申请人',
                value: payData.applyName
              },
              {
                label: '申请人部门',
                value: payData.applyDepartment
              },
              {
                label: '用户电话',
                value: payData.userTel,
                valueId: payData.userId
              },
              {
                label: '订单号',
                value: payData.outTradeNo
              },
              {
                label: '当前物流状态',
                value: payData.currentExpress
              },
              {
                label: '打包数量',
                value: payData.packageCount
              },
              {
                label: '商品信息',
                type: 'arrayInfo',
                value: JSON.parse(payData.packageProduct)
              },
              {
                label: '申请理由',
                value: payData.applyReason
              }
            ]
          })
          that.isFlag = true
          that.$nextTick(() => {
            that.$refs.adjustDrawerCom.handleDrawerOpen()
            that.$refs.adjustDrawerCom.initVersionList(
              JSON.parse(payData.packageProduct)
            )
          })
          return
        }
        that.drawerApprovalDeatail = Object.assign(
          { typeName: res, id: index, tag: tag },
          e
        )
        that.handleSee()
      }
      if (res === '2' || res === '3' || res === '4') {
        that.$http.Approval.getAdjustDetail(index).then((e) => {
          that.$refs.adjustDrawerCom.handleDrawerOpen()
          let typeText = ''
          switch (res) {
            case '3':
              typeText = '调期申请'
              break
            case '4':
              typeText = '调级申请'
              break
            case '2':
              typeText = '调班申请'
              break
          }
          if (e && e.payload) {
            const payData = e.payload
            // console.log(payData)
            // 用于显示的和一些杂项
            // 公共部分
            Object.assign(this.adjustDrawerData, {
              type: 'notDone', // notDone是待审批
              title: typeText,
              flowApprovalId: payData.flowApprovalId,
              content: [
                {
                  label: '申请人',
                  value: payData.applyUserName
                },
                {
                  label: '申请人部门',
                  value: payData.applyUserDeapartmentName
                },
                {
                  label: '用户电话',
                  value: payData.userTel,
                  valueId: payData.userId
                },
                {
                  label: '订单号',
                  value: payData.outTradeNo
                },
                {
                  label: '审批类型',
                  value: typeText
                }
              ]
            })
            // 调期
            if (type === '3') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前开课时间',
                    value: payData.currentStartClassDate
                  },
                  {
                    label: '申请开课时间',
                    value: payData.targetStage
                  }
                ]
              )
            }
            // 调级
            if (type === '4') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '已上课周期',
                    value: formatTeamNameSup(payData.currentPeriod) || '-'
                  },
                  {
                    label: '调级级别',
                    value: SUP_LEVEL_UPPER[payData.targetSup] || '-'
                  }
                ]
              )
            }
            // 调班
            if (type === '2') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前班级',
                    value: payData.currentClassName
                  }
                ]
              )
            }
            let statusType
            if (payData.status === 'COMPLETED') {
              statusType = '审批通过'
            } else if (payData.status === 'PENDING') {
              statusType = '待审批'
            } else if (payData.status === 'DECLINE') {
              statusType = '审批驳回'
            } else if (payData.status === 'REVOCATION') {
              statusType = '已撤销'
            } else {
              statusType = '-'
            }
            // 公共数据
            this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
              [
                {
                  label: '选择班级',
                  value: payData.targetClassName
                },
                {
                  label: '调级理由',
                  value: payData.adjustReason
                },
                {
                  label: '发起时间',
                  value: timestamp(payData.applyTime, 2)
                },
                {
                  label: '状态',
                  value: statusType
                }
              ]
            )
          }
        })
        this.isFlag = true
        console.log(this.adjustDrawerData, 'this.adjustDrawerData-----')
        return
      }
      const type = {
        '0': function(id) {
          that.$http.RefundApproval.getFlowDetail(id).then((res) => {
            content(res)
          })
        },
        '1': function(id) {
          that.$http.Backend.getReplenishDetail(id).then((res) => {
            content(res)
          })
        },
        '5': function(id) {
          that.$http.Backend.getNoAttributionDetail(id).then((res) => {
            content(res)
          })
        },
        '7': function(id) {
          that.$http.Backend.getGiftDetail(id).then((res) => {
            content(res)
          })
        },
        '6': function(id) {
          that.$http.Approval.getPackageInfo(id).then((res) => {
            content(res)
          })
        }
      }
      type[res](index)
    },
    // 获取审批列表
    getList(phone) {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const data = {
        user_tel: phone,
        type: [0, 1, 2, 3, 4, 6, 7]
      }
      const sort = {
        utime: 'desc'
      }
      const size = 20
      const page = 1
      this.$http.User.approvalRecordList(
        JSON.stringify(data),
        size,
        page,
        JSON.stringify(sort)
      )
        .then((res) => {
          console.log(res, '获取审批列表')
          if (res.data.FlowApprovalPage.content.length > 0) {
            res.data.FlowApprovalPage.content.forEach((item) => {
              item.abstract_contents =
                item.abstract_content && item.abstract_content.split('^')
            })
          }
          this.totalElements =
            res.data.FlowApprovalPage &&
            res.data.FlowApprovalPage.totalElements * 1
          this.totalPages =
            +res.data.FlowApprovalPage && res.data.FlowApprovalPage.size * 1
          this.tableData =
            res.data.FlowApprovalPage && res.data.FlowApprovalPage.content

          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    // 时间戳转换
    formatDate(time, flag = 's') {
      return formatData(time, flag)
    },
    // 查看
    handleSee() {
      this.$refs.drawer.handleApprovalSee()
    },
    // 翻页
    handleSizeChange(page) {
      console.log(this.page)
      this.currentPage = page
      this.getList(this.phone)
    }
  }
}
</script>
<style lang="scss" module>
.main_content {
  padding: 10px;
}
.approval_see {
  color: #2a75ed;
}
.approval_see:hover {
  cursor: pointer;
}
.approval_no {
  text-align: center;
  line-height: calc(100vh - 290px);
}
</style>
