<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-27 17:47:58
 * @LastEditors: liukun
 * @LastEditTime: 2020-07-08 14:21:15
 -->
<template>
  <div class="container">
    <!-- 搜索框 -->
    <div class="time">
      <tabTimeSelect @result="getSeacherTime" />
      <CheckType @result="getcheckType" />
      <SearchPart @result="getSeachePart" />
      <courseTeam @result="getTeamId" />
      <searchPhone name="userTel" @result_lk="getPhone" />
    </div>
    <!-- 数据table -->
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
    >
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-dropdown
            placement="bottom-start"
            v-if="scope.row.applyId == staffId"
          >
            <div :class="scope.row.id === current.id ? 'three-dot' : 'disnone'">
              <img src="@/assets/images/icon/icon-three-dot.jpg" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <div @click="pullDownList(scope.row.id, scope.row.type)">
                <el-dropdown-item>撤销</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="申请人" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人部门" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyDepartment }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批类型">
        <template slot-scope="scope">
          <div v-show="scope.row.type === 'REISSUE'">
            补发货
          </div>
          <div v-show="scope.row.type === 'REFUND'">
            退款
          </div>
          <div v-if="scope.row.type === 'ADJUSTMENT_STAGE'">
            调期申请
          </div>
          <div v-else-if="scope.row.type === 'ADJUSTMENT_CLASS'">
            调班申请
          </div>
          <div v-if="scope.row.type === 'ADJUSTMENT_SUP'">
            调级申请
          </div>
          <div v-if="scope.row.type === 'UNCREDITED'">
            无归属订单审批
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" width="180" prop="userTel">
      </el-table-column>
      <el-table-column label="开课日期" width="120">
        <template slot-scope="scope">
          <div>
            <span>
              {{ courseOptions[scope.row.managementType] }}
              {{ scope.row.periodName }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批摘要" width="450">
        <template slot-scope="scope">
          <div>{{ scope.row.repiarContent }}</div>
          <div>{{ scope.row.period }}</div>
          <div>{{ scope.row.receptContent }}</div>
          <div>{{ scope.row.reason }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.openTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <div
            @click="getApprovalDeatail(scope.row.type, scope.row.id)"
            v-show="scope.row.status === 'PENDING'"
            class="wait-pending"
          >
            待审批
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 退款补发货抽屉 -->
    <el-drawer
      :visible.sync="drawerApproval"
      :destroy-on-close="true"
      size="50%"
      class="drawer-approval-detail"
      :modal="false"
      @close="handleCloseDraw"
    >
      <template v-slot:title>
        <h2 v-if="currentType !== 'UNCREDITED'">
          {{ drawerApprovalDeatail.addressId ? '补发货审批' : '退款审批' }}
        </h2>
        <h2 v-else>
          {{ '无归属订单审批' }}
        </h2>
      </template>
      <div v-if="drawerApprovalDeatail.addressId" class="approval-replenish">
        <el-row>
          <el-col :span="3">申请人:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.applyUserName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">申请部门:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.applyUserDeapartmentName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">用户电话:</el-col>
          <el-col :span="20" :offset="1"
            ><el-link
              type="primary"
              :href="'/users/#/details/' + drawerApprovalDeatail.userId"
              target="_blank"
              >{{ drawerApprovalDeatail.userTel }}</el-link
            ></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="3">补发商品:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.productInfo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">收货信息:</el-col>
          <el-col :span="20" :offset="1">{{
            `${drawerApprovalDeatail.receiptName +
              '' +
              drawerApprovalDeatail.receiptTel}~~${drawerApprovalDeatail.receiptAddressProvince +
              '' +
              drawerApprovalDeatail.receiptAddressCity +
              '' +
              drawerApprovalDeatail.receiptAddressArea +
              '' +
              drawerApprovalDeatail.receiptAddressDetail}`
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">订单号:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.outTradeNo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">商品信息:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.productNames
          }}</el-col>
        </el-row>
        <el-row v-show="+drawerApprovalDeatail.stage !== 0">
          <el-col :span="3">开课期数:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.periodName
          }}</el-col>
        </el-row>
        <el-row
          v-if="
            isStaffId &&
              drawerApprovalDeatail.mode === 'DEFAULT' &&
              drawerApprovalDeatail.type === 'MATERIALS'
          "
        >
          <el-col :span="3">版本信息:</el-col>
          <el-col :span="20" :offset="1">
            <VersionBox @result="getVersion" name="version" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">补发原因:</el-col>
          <el-col :span="20" :offset="1">
            {{ reasonList[drawerApprovalDeatail.reason] }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">发起时间:</el-col>
          <el-col :span="20" :offset="1">
            {{ drawerApprovalDeatail.ctimeFormdate }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">状态:</el-col>
          <el-col :span="20" :offset="1">
            {{ drawerApprovalDeatail.status == 'PENDING' ? '待审批' : '-' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">补货说明:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.reissueMsg
          }}</el-col>
        </el-row>
        <el-row v-if="drawerApprovalDeatail.attsUrl.indexOf('mp4') == -1">
          <el-col :span="3">附件:</el-col>
          <el-col :span="18" :offset="1">
            <div class="demo-image__preview">
              <el-image
                style="width: 220px; height: 120px"
                :src="drawerApprovalDeatail.attsUrl"
                fit="contain"
                :preview-src-list="[drawerApprovalDeatail.attsUrl]"
              >
              </el-image>
            </div>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="3">附件:</el-col>
          <el-col :span="18" :offset="1">
            <video
              style="width: 220px; height: 120px"
              :src="drawerApprovalDeatail.attsUrl"
              controls
            ></video>
          </el-col>
        </el-row>
        <el-row class="BOTTOM" v-if="isStaffId">
          <el-col :span="20" :offset="1">
            <el-button type="button" @click="dialogFormVisible_checkbox = true"
              >拒 绝</el-button
            >
            <el-button type="button" @click="ensureReplenish">同 意</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-else class="approvallk">
        <el-row>
          <el-col :span="5">申请人:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.applyUserName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">申请部门:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.applyUserDeapartmentName
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">用户电话:</el-col>
          <el-col :span="18" :offset="1"
            ><el-link
              type="primary"
              :href="'/users/#/details/' + drawerApprovalDeatail.userId"
              target="_blank"
              >{{ drawerApprovalDeatail.customerPhone }}</el-link
            ></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5">订单号:</el-col>
          <el-col :span="18" :offset="1"
            >{{ drawerApprovalDeatail.outTradeNo
            }}<span style="color:red" v-if="drawerApprovalDeatail.isImport"
              >(此为第三方导入订单)</span
            ></el-col
          >
        </el-row>
        <el-row v-if="drawerApprovalDeatail.channelOuterName">
          <el-col :span="5">订单来源:</el-col>
          <el-col :span="18" :offset="1">{{
            drawerApprovalDeatail.channelOuterName
          }}</el-col>
        </el-row>
        <div v-if="currentType !== 'UNCREDITED'">
          <el-row>
            <el-col :span="5">业务类型:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.regType
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">商品信息:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.productMsg
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">交易金额:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.orderFee
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">剩余金额:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.residueFee
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">退款规则:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.refundRule ? '不符合' : '符合'
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">支付渠道:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.channel
            }}</el-col>
          </el-row>
          <el-row v-if="drawerApprovalDeatail.payeeName">
            <el-col :span="5">收款人姓名:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.payeeName
            }}</el-col>
          </el-row>
          <el-row v-if="drawerApprovalDeatail.payeeAccount">
            <el-col :span="5">支付宝账号:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.payeeAccount
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">退款类型:</el-col>
            <el-col :span="18" :offset="1">{{
              { 0: '优惠券退款', 1: '课程退款', 2: '降半年包', 3: '补偿' }[
                drawerApprovalDeatail.refundType
              ]
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">已上课周期:</el-col>
            <el-col :span="18" :offset="1">{{
              `
           ${Math.floor(
             drawerApprovalDeatail.periodAlready / 4
           )}月${drawerApprovalDeatail.periodAlready % 4}周
           `
            }}</el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="5">退款月数:</el-col>
            <el-col :span="18" :offset="1">{{
              `${Math.floor(drawerApprovalDeatail.periodRefund / 4)}月`
            }}</el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="5">剩余可上课周期:</el-col>
            <el-col :span="18" :offset="1">{{
              `
           ${Math.floor(
             drawerApprovalDeatail.periodResidue / 4
           )}月${drawerApprovalDeatail.periodResidue % 4}周
           `
            }}</el-col>
          </el-row> -->
          <el-row :class="$style.align_items">
            <el-col :span="5">退款金额:</el-col>
            <el-col :span="4" :offset="1">{{
              drawerApprovalDeatail.refundFee
            }}</el-col>
            <el-col v-if="isPositionId" :span="13" :offset="1">
              <mark @click="dialogFormVisible = true">修改金额</mark>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">退款原因:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.refundReason
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">退款说明:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.refundMsg
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">附件:</el-col>
            <el-col :span="18" :offset="1">
              <el-image
                style="width: 220px; height: 120px"
                :src="drawerApprovalDeatail.attsUrl"
                fit="contain"
                :preview-src-list="[drawerApprovalDeatail.attsUrl]"
              >
              </el-image>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row>
            <el-col :span="5">购买课程:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.productMsg
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">实付金额:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.orderFee
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">购买渠道:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.channel
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">购课时间:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.orderTime
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">聊天截图:</el-col>
            <el-col :span="18" :offset="1">
              <el-image
                style="width: 220px; height: 120px"
                :src="drawerApprovalDeatail.chat_url"
                fit="contain"
                :preview-src-list="drawerApprovalDeatail.chatUrl"
              >
              </el-image>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">支付截图:</el-col>
            <el-col :span="18" :offset="1">
              <el-image
                style="width: 220px; height: 120px"
                :src="drawerApprovalDeatail.pay_url"
                fit="contain"
                :preview-src-list="drawerApprovalDeatail.paymentUrl"
              >
              </el-image>
            </el-col>
          </el-row>
        </div>
        <div v-if="currentType !== 'UNCREDITED'">
          <el-row class="BOTTOM" v-if="isStaffId">
            <el-col :span="20" :offset="1">
              <el-button
                type="button"
                @click="dialogFormVisible_checkbox = true"
                >拒 绝</el-button
              >
              <el-button type="button" @click="ensureReplenish"
                >同 意</el-button
              >
            </el-col>
          </el-row>
        </div>
        <!-- 无归属订单审批身份,测试账号bearboss；线上只有张奔有权限 慎重改动 -->
        <div
          v-if="
            currentType === 'UNCREDITED' &&
              resetParams.staffId === '455930731630301184'
          "
        >
          <el-row class="BOTTOM">
            <el-col :span="20" :offset="1">
              <el-button
                type="button"
                @click="dialogFormVisible_checkbox = true"
                >拒 绝</el-button
              >
              <el-button type="primary" @click="ensureReplenish"
                >同 意</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>
    <!-- 调味品抽屉 -->
    <adjust-drawer
      :is3d="1"
      ref="adjustDrawerCom"
      :adjustDrawerData="adjustDrawerData"
      :isStaffId="isStaffId"
      @result="adjustDrawerPass"
    ></adjust-drawer>
    <!-- 调班调级备注弹窗 -->
    <el-dialog
      class="adjust-dialog-class"
      :title="
        adjustDialogType === 'reject'
          ? '审批拒绝'
          : adjustDialogType === 'pass'
          ? '审批同意'
          : ''
      "
      :visible.sync="adjustResultDialogShow"
    >
      <p class="adjust-dialog-p">
        请确认是否{{
          adjustDialogType === 'reject'
            ? '拒绝'
            : adjustDialogType === 'pass'
            ? '同意'
            : ''
        }}此条申请
      </p>
      <p style="font-size: 14px;">
        备注 <span style="color:red;font-size: 12px;">必填</span>
      </p>
      <el-input
        class="adjust-dialog-input"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="adjustDrawerData.checkSuggestion"
        maxlength="100"
        show-word-limit
        @input="adjustDialogErrShow = false"
      >
      </el-input>
      <div v-show="adjustDialogErrShow" class="adjust-dialog-err-p">
        请输入审批意见
      </div>
      <div class="adjust-dialog-button-box">
        <el-button
          @click="
            adjustDrawerData.checkSuggestion = ''
            adjustResultDialogShow = false
            adjustDialogErrShow = false
          "
          >取消</el-button
        >
        <el-button type="primary" @click="adjustResultDialogConfirm"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 数据table里首个展示的三个点用来撤销自己的申请-弹窗 -->
    <el-dialog
      title="撤销申请"
      :visible.sync="endback"
      width="30%"
      :before-close="closeEndBack"
    >
      <span>你确定要撤销申请嘛！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endback = false">取 消</el-button>
        <el-button type="primary" @click="ensureBackend">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 页码组件 -->
    <m-pagination
      class="bottom0"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :total="+totalElements"
      open="calc(100vw - 195px)"
      close="calc(100vw - 75px)"
    />
    <!-- 修改金额弹窗-->
    <el-dialog
      title="修改金额"
      :visible.sync="dialogFormVisible"
      :destroy-on-close="true"
      :before-close="destroylk"
    >
      <el-form
        :model="form"
        label-position="top"
        :rules="rules"
        ref="refundForm"
      >
        <el-form-item label="键入修改金额" prop="cash">
          <el-input
            type="number"
            step="0.01"
            :value="form.cash"
            @input="form.cash = $event.replace(/[^0-9.]/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="特殊说明" prop="explain">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入修改金额的理由"
            v-model="form.explain"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quxiao">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 拒绝后的dialog_with_checkbox -->
    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible_checkbox"
      :destroy-on-close="true"
      :before-close="destroylkCheckbox"
    >
      <el-form
        :model="form_checkbox"
        label-position="top"
        :rules="rules_checkbox"
        ref="refundForm_checkbox"
      >
        <el-form-item label="请输入原因" prop="reason">
          <el-input v-model="form_checkbox.reason"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!drawerApprovalDeatail.addressId"
          label="恢复学生放课与随材物流"
          prop="isRecover"
        >
          <el-switch
            v-model="form_checkbox.isRecover"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="quxiaoCheckbox">取 消</el-button>
        <el-button type="primary" @click="confirmCheckbox">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import MPagination from '@/components/MPagination/index.vue'
import tabTimeSelect from './timeSearch'
import CheckType from './checkType'
import { timestamp } from '@/utils/index'
import SearchPart from './searchPart'
import adjustDrawer from './adjustDrawer'
import { getStaffInfo } from '../common'
import courseTeam from './courseTeam'
import VersionBox from '../../../../components/MSearch/searchItems/moreVersionBox'

export default {
  computed: {
    isPositionId() {
      return JSON.parse(localStorage.getItem('staff')).positionId === '1'
        ? 1
        : false
    }
  },
  props: ['typeTime', 'activeName'],
  watch: {
    activeName(val) {
      if (val === 'second') {
        this.checkPending(this.params)
      }
    }
  },
  components: {
    searchPhone,
    MPagination,
    tabTimeSelect,
    VersionBox,
    CheckType,
    SearchPart,
    adjustDrawer,
    courseTeam
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (Number(value) !== parseFloat(value)) {
        // 防一手科学计数法e(事件里处理了负号)
        callback(new Error('金额里有杂质!'))
      } else {
        if (Number(value) > Number(this.drawerApprovalDeatail.residueFee)) {
          callback(new Error('当心！你已超过剩余金额!'))
        } else {
          callback()
        }
      }
    }
    return {
      rules: {
        cash: [{ required: true, validator: validateName, trigger: 'blur' }],
        explain: [
          { required: true, message: '不能闷声改金额', trigger: 'change' }
        ]
      },
      form: {
        cash: '',
        explain: ''
      },
      rules_checkbox: {
        reason: [{ required: true, message: '请填写原因', trigger: 'blur' }],
        isRecover: [{ required: true, message: '是否恢复', trigger: 'change' }]
      },
      form_checkbox: {
        reason: '',
        isRecover: true
      },
      dialogFormVisible: false, // ↑修改金额表单lk
      dialogFormVisible_checkbox: false, // 拒绝checkbox
      params: {}, // 列表的参数
      resetParams: {}, // 撤销的参数
      staffId: '',
      tableData: [],
      current: {},
      drawerApproval: false,
      drawerApprovalDeatail: {},
      currentPage: 1,
      totalElements: 0,
      endback: false,
      isStaffId: false,
      version: '',
      adjustDrawerData: {
        width: '130px',
        checkSuggestion: '', // 调期调级调班的dialog数据
        loading: false
      },
      adjustResultDialogShow: false, // drawer同意后的弹窗
      adjustDialogType: null, // dialog的类型
      adjustDialogErrShow: false, // dialog的错误提示
      reasonList: {
        OTHER: '其他',
        DELIVERY_MISS: '发货漏发',
        TRANSPORT_BAD: '运输损坏'
      },
      courseOptions: { TESTCOURSE: '体验课', SYSTEMCOURSE: '系统课' },
      currentType: ''
    }
  },
  created() {
    const staff = getStaffInfo()
    console.log(staff, 'staff')

    this.resetParams = staff
    this.staffId = staff.staffId
    this.staffName = staff.staffName
    this.isStaffId = staff.isStaffId
    this.staffName = staff.staffName
    // Parameters:
    this.params = {
      type: '',
      keyword: '',
      status: 'PENDING',
      staffId: this.staffId,
      isOperation: false,
      startTime: '',
      endTime: '',
      page: 1,
      size: 20
    }
    this.params.isOperation = this.isStaffId
    this.checkPending(this.params)
  },

  methods: {
    // 期数查询
    getTeamId(val) {
      this.currentPage = 1
      if (val) {
        Object.assign(this.params, {
          managementType: val.managementType,
          period: val.period,
          page: 1
        })
        this.checkPending(this.params)
      } else {
        this.params.managementType = ''
        this.params.period = ''
        this.params.page = 1
        this.checkPending(this.params)
      }
    },
    // 用于清空修改金额的弹窗内容
    destroylk(done) {
      this.$refs.refundForm.resetFields()
      done()
    },
    destroylkCheckbox(done) {
      this.$refs.refundForm_checkbox.resetFields()
      done()
    },
    quxiao() {
      this.$refs.refundForm.resetFields()
      this.dialogFormVisible = false
    },
    quxiaoCheckbox() {
      this.$refs.refundForm_checkbox.resetFields()
      this.dialogFormVisible_checkbox = false
    },
    confirm() {
      this.$refs.refundForm.validate(async (valid) => {
        if (valid) {
          const { code } = await this.$http.Backend.changeCash({
            flowApprovalId: this.drawerApprovalDeatail.flowApprovalId,
            refundFee: this.form.cash,
            refundMsg: this.form.explain
          }).catch((err) => {
            this.$message({
              message: '修改金额失败',
              type: 'error'
            })
            console.info(err)
          })
          if (code === 0) {
            this.$message({
              message: '修改金额成功',
              type: 'success'
            })
            this.drawerApprovalDeatail.refundFee = this.form.cash // 退款金额更新
            this.dialogFormVisible = false
          } else {
            this.$message({
              message: '修改金额失败',
              type: 'warning'
            })
          }
        } else {
          return false
        }
      })
    },
    confirmCheckbox() {
      this.$refs.refundForm_checkbox.validate(async (valid) => {
        if (valid) {
          console.info(this.drawerApprovalDeatail.addressId)
          const params = {
            isRecover: this.form_checkbox.isRecover ? 1 : 0,
            approvalRemark: this.form_checkbox.reason,
            flowApprovalId: this.drawerApprovalDeatail.flowApprovalId,
            isConfirm: false,
            version: this.version,
            staffId: this.staffId,
            staffName: this.staffName
          }
          if (this.drawerApprovalDeatail.addressId) {
            delete params.isRecover
          }
          this.$http.Backend.isAggrePass(params)
            .then((res) => {
              console.log(res)
              this.checkPending(this.params)
              this.dialogFormVisible_checkbox = false // 关闭弹窗
              this.drawerApproval = false // 关闭抽屉
              this.handleCloseDraw()
              this.$message({
                message: '拒绝审核通过',
                type: 'success'
              })

              // this.$emit('result', 'third')
            })
            .catch((err) => {
              this.$message(err)
            })
        } else {
          return false
        }
      })
    },

    // 销毁
    handleCloseDraw() {
      this.version = ''
      this.currentType = ''
    },
    // 销售部门搜索
    getSeachePart(val) {
      Object.assign(this.params, { keyword: val })
      this.params.page = 1
      this.currentPage = 1
      this.checkPending(this.params)
    },
    // 查询审批类型判断
    getcheckType(val) {
      Object.assign(this.params, { type: val })
      this.currentPage = 1
      this.params.page = 1
      this.checkPending(this.params)
    },
    // 新加手机号
    getPhone(val) {
      console.info(val)
      Object.assign(this.params, val)
      this.currentPage = 1
      this.params.page = 1
      this.checkPending(this.params)
    },
    // 获取版本盒子
    getVersion(val) {
      this.version = val.version
    },
    // 拒绝申请(暂留,该方法已经已经不用了昂)
    refuseReplenish() {
      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空'
      })
        .then(({ value }) => {
          const params = {
            approvalRemark: value,
            flowApprovalId: this.drawerApprovalDeatail.flowApprovalId,
            isConfirm: false,
            version: this.version,
            staffId: this.staffId,
            staffName: this.staffName
          }
          this.$http.Backend.isAggrePass(params)
            .then((res) => {
              console.log(res)
              this.checkPending(this.params)
              this.drawerApproval = false
              this.handleCloseDraw()
              this.$message({
                message: '拒绝审核通过',
                type: 'success'
              })

              this.$emit('result', 'third')
            })
            .catch((err) => {
              this.$message(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 同意申请
    ensureReplenish() {
      const version = typeof this.version !== 'string'
      const versionBool =
        this.isStaffId &&
        this.drawerApprovalDeatail.mode === 'DEFAULT' &&
        this.drawerApprovalDeatail.type === 'MATERIALS'
      if (versionBool && (this.version === '' || version)) {
        this.$message('请选择版本号')
        return
      }
      if (!versionBool) {
        this.version = ''
      }
      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空'
      })
        .then(({ value }) => {
          const params = {
            approvalRemark: value,
            flowApprovalId: this.drawerApprovalDeatail.flowApprovalId,
            isConfirm: true,
            version: this.version,
            staffId: this.staffId,
            staffName: this.staffName
          }
          this.$http.Backend.isAggrePass(params)
            .then((res) => {
              if (res && res.payload) {
                this.checkPending(this.params)
                this.drawerApproval = false
                this.$root.$emit('lk', '')
                this.$message({
                  message: '同意审核通过',
                  type: 'success'
                })
                // this.$emit('result', 'third')
              } else {
                this.$root.$emit('lk', '')
              }
            })
            .catch((err) => {
              this.$message(`${err},请重选！`)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 点x关闭按钮
    closeEndBack() {
      this.endback = false
    },
    // ensureBackend 撤销弹出框确认按钮
    ensureBackend() {
      this.$http.Backend.getReplenishReset(this.resetParams).then((res) => {
        if (res && res.payload) {
          this.checkPending(this.params)
          this.$emit('result', 'forth')
          this.endback = false
        }
      })
    },
    // 时间筛选
    getSeacherTime(val) {
      this.params.page = 1
      this.currentPage = 1

      if (val) {
        Object.assign(this.params, {
          startTime: val.ctime.gte,
          endTime: val.ctime.lte
        })
      } else {
        Object.assign(this.params, {
          startTime: '',
          endTime: ''
        })
      }
      this.checkPending(this.params)
    },
    // 应该是当前选择第几页吧
    handleCurrentChange(val) {
      this.currentPage = val
      Object.assign(this.params, { page: val })
      this.checkPending(this.params)
    },
    // 打开抽屉 传进来两个参数 一个type 一个id  type用来区分补发货还是退款
    getApprovalDeatail(type, id) {
      // 记录当前类型，方便弹层使用
      this.currentType = type
      if (type === 'REISSUE') {
        this.$http.Backend.getReplenishDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.ctimeFormdate = timestamp(res.payload.ctime, 2)
            this.drawerApprovalDeatail = res.payload
            // 对传过来的对象做处理
            console.log(
              this.drawerApprovalDeatail,
              'this.drawerApprovalDeatail'
            )
            this.drawerApproval = true
          }
        })
      }
      // 退款详情
      if (type === 'REFUND') {
        this.$http.RefundApproval.getFlowDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.ctimeFormdate = timestamp(res.payload.ctime, 2)
            this.drawerApprovalDeatail = res.payload
            // 对传过来的对象做处理
            console.log(this.drawerApprovalDeatail)
            this.drawerApproval = true
          }
        })
      }
      // 无归属订单详情
      if (type === 'UNCREDITED') {
        this.$http.Backend.getNoAttributionDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.orderTime = timestamp(res.payload.orderTime, 2)
            res.payload.chatUrl = res.payload.chatUrl.split('(^_^)')
            res.payload.paymentUrl = res.payload.paymentUrl.split('(^_^)')
            this.drawerApprovalDeatail = res.payload
            this.drawerApprovalDeatail.chat_url = res.payload.chatUrl[0]
            this.drawerApprovalDeatail.pay_url = res.payload.paymentUrl[0]
            this.drawerApproval = true
          }
        })
      }
      // 调级调期调班
      const ADJUST_TYPE = [
        'ADJUSTMENT_CLASS',
        'ADJUSTMENT_STAGE',
        'ADJUSTMENT_SUP'
      ]
      if (ADJUST_TYPE.includes(type)) {
        this.openAdjustDetail(type, id)
      }
    },
    // 打开调x调x调x的审批详情
    openAdjustDetail(type, id) {
      this.adjustDrawerData.loading = true
      this.$refs.adjustDrawerCom.handleDrawerOpen()
      let typeText = ''
      switch (type) {
        case 'ADJUSTMENT_STAGE':
          typeText = '调期申请'
          break
        case 'ADJUSTMENT_SUP':
          typeText = '调级申请'
          break
        case 'ADJUSTMENT_CLASS':
          typeText = '调班申请'
          break
      }
      this.$http.Approval.getAdjustDetail(id)
        .then((res) => {
          if (res && res.payload) {
            const payData = res.payload
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
            if (type === 'ADJUSTMENT_STAGE') {
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
            if (type === 'ADJUSTMENT_SUP') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '已上课周期',
                    value: payData.currentPeriod
                  },
                  {
                    label: '调级级别',
                    value: payData.targetSup
                  }
                ]
              )
            }
            // 调班
            if (type === 'ADJUSTMENT_CLASS') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前班级',
                    value: payData.currentClassName
                  }
                ]
              )
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
                  value: '待审批'
                }
              ]
            )
          }
          this.adjustDrawerData.loading = false
        })
        .catch(() => {
          this.adjustDrawerData.loading = false
          this.$message.error('获取审批详情失败')
        })
    },
    // 点击下拉操作
    pullDownList(id, type) {
      Object.assign(this.resetParams, { flowApprovalId: id })
      this.endback = true
    },
    // 鼠标进入
    handleMouseEnter(row) {
      this.current = row
    },
    // 鼠标离开
    handleMouseLeave(row) {
      this.current = {}
    },
    // 待审核列表渲染
    checkPending(params) {
      this.$http.Backend.checkListPending(params).then((res) => {
        if (res && res.payload && res.payload.content) {
          this.totalElements = res.payload.totalElements
          this.tableData = res.payload.content.map((item) => {
            const zhaiyao = item.abstractContent.split('^')
            item.repiarContent = zhaiyao[0]
            item.period = zhaiyao[1]
            item.receptContent = zhaiyao[2]
            item.reason = zhaiyao[3]
            item.openTime = timestamp(item.ctime, 2)
            item.approveTime = timestamp(item.endTime, 2)
            return item
          })
        }
      })
    },
    // 调期调级调班的drawer同意或拒绝
    adjustDrawerPass(type) {
      this.adjustDialogType = type
      if (type === 'pass') {
        this.adjustDrawerData.checkSuggestion = '同意'
      }
      this.adjustResultDialogShow = true
    },
    // adjust-dialog的按钮
    adjustResultDialogConfirm() {
      if (!this.adjustDrawerData.checkSuggestion) {
        this.adjustDialogErrShow = true
        return
      }
      let isConfirm = null
      if (this.adjustDialogType === 'reject') {
        isConfirm = false
      } else if (this.adjustDialogType === 'pass') {
        isConfirm = true
      }
      const params = {
        approvalRemark: this.adjustDrawerData.checkSuggestion.trim(),
        flowApprovalId: this.adjustDrawerData.flowApprovalId - 0,
        isConfirm: isConfirm,
        staffId: this.staffId,
        staffName: this.staffName
      }
      // 特殊字符
      const reg = new RegExp('[&%#$*^<>]')
      if (reg.test(params.approvalRemark)) {
        this.$message('不能包含特殊字符&%#$*^<>哦')
        return
      }
      this.$http.Approval.isAggrePass(params)
        .then((res) => {
          // console.log(res)
          this.adjustResultDialogShow = false
          this.$refs.adjustDrawerCom.handleDrawerClose()
          this.adjustDrawerData.checkSuggestion = ''
          this.$emit('approvalDone')
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('提交出错啦')
        })
    }
  }
}
</script>

<style lang="scss" module>
.align_items {
  display: flex;
  align-items: center;
}
:global {
  .drawer-approval-detail {
    padding-top: 50px;
    font-size: 16px;
    .el-drawer {
      overflow: auto;
    }
  }
  // el原类名追加样式
  .approvallk .el-drawer__body {
    padding-left: 10px;
  }
  .approvallk .el-row {
    margin-bottom: 10px;
  }
  .approvallk .el-row:nth-last-of-type {
    margin-bottom: 0;
  }
  .approvallk .el-row .el-col-5 {
    text-align: right;
  }

  .approval-replenish {
    margin: 0 30px;
    div {
      margin-bottom: 5px;
    }
  }
  .BOTTOM {
    margin-left: 30px;
  }

  // 操作
  .wait-pending {
    cursor: pointer;
    color: #2a75ed;
  }
  .time {
    display: flex;
    align-items: center;
  }
  // 是否三点
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
  .adjust-dialog-class {
    .el-dialog {
      padding: 10px 20px;
      .adjust-dialog-p {
        font-size: 16px;
        margin-bottom: 25px;
      }
      .adjust-dialog-err-p {
        color: red;
      }
      .adjust-dialog-button-box {
        margin-top: 50px;
        text-align: center;
      }
    }
  }
}
</style>
