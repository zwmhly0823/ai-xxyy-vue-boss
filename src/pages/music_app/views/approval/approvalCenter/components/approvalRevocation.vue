<!--
 * @Descripttion:
 * @version:
 * @Author: Lukun
 * @Date: 2020-04-27 17:47:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-15 17:40:14
 -->
<template>
  <div class="container">
    <div class="time">
      <CheckType @result="getcheckType" />
      <el-select
        :style="{ 'margin-right': '20px' }"
        clearable
        size="mini"
        v-model="zero_time"
        placeholder="请选择是否0课时"
        @change="zeroChange"
        v-show="isRefund"
      >
        <el-option
          v-for="(value, key) in { 未开课0课时: 'YES', 已开课非0课时: 'NO' }"
          :key="value"
          :label="key"
          :value="value"
        ></el-option>
      </el-select>
      <searchPhone
        name="userTel"
        @result_lk="getPhone"
        style="margin-right: 20px"
      />
      <courseTeam
        @result="getTeamId"
        style="margin-left: 0px; margin-right: 20px"
      />
      <department
        style="margin-right: 20px"
        name="DepartmentIds"
        placeholder="全部部门"
        :onlyDept="1"
        @result="getSearchData1"
      />
      <group-sell
        style="margin-right: 20px"
        @result="getSearchData2"
        :name="'groupSell'"
        tip="请选择老师"
      />
      <tabTimeSelect style="margin-left: 0px" @result="getSeacherTime" />
      <ActivityName
        v-if="checkTypeAssert !== 'REISSUE'"
        class="inline-search margin_left_20"
        @result="getActivityName"
      />
    </div>
    <!-- dom -->
    <div class="tableInner" ref="tableInner"></div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :height="tableHeight"
      highlight-current-row
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
    >
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-dropdown
            placement="bottom-start"
            v-if="scope.row.type !== 'PROMOTIONS'"
          >
            <div :class="scope.row.id === current.id ? 'three-dot' : 'disnone'">
              <img src="@/assets/images/icon/icon-three-dot.jpg" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <div @click="pullDownList(scope.row.id, scope.row.type)">
                <el-dropdown-item>重提</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="申请人" width="80">
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人部门" width="130">
        <template slot-scope="scope">
          <div>
            {{ scope.row.applyDepartment }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批类型">
        <template slot-scope="scope">
          <div v-show="scope.row.type === 'REISSUE'">补发货</div>
          <div v-show="scope.row.type === 'REFUND'">退款</div>
          <div v-show="scope.row.type === 'ADJUSTMENT_SUP_TRIAL'">
            体验课调级
          </div>
          <div v-if="scope.row.type === 'ADJUSTMENT_CLASS'">调班</div>
          <div v-else-if="scope.row.type === 'ADJUSTMENT_SUP'">调级</div>
          <div v-else-if="scope.row.type === 'ADJUSTMENT_STAGE'">调期</div>
          <div v-if="scope.row.type === 'PACKAGE_BOX'">随材打包</div>
          <div v-if="scope.row.type === 'UNCREDITED'">无归属订单审批</div>
          <div v-if="scope.row.type === 'PROMOTIONS'">赠品</div>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" width="180" prop="userTel">
      </el-table-column>
      <el-table-column label="开课日期" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.subType !== 99">
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
          <!-- <div>{{ scope.row.period }}</div>
          <div>{{ scope.row.receptContent }}</div> -->
          <div>
            <span v-if="scope.row.type === 'ADJUSTMENT_SUP'">{{
              scope.row.period
            }}</span>
            <span v-else>{{ scope.row.period }}</span>
          </div>
          <div>
            <!-- 调级 -->
            <span v-if="scope.row.type === 'ADJUSTMENT_SUP'">{{
              scope.row.receptContent || '-'
            }}</span>
            <span v-else>{{ scope.row.receptContent }}</span>
          </div>
          <div>{{ scope.row.reason }}</div>
          <div>{{ scope.row.refundTypeStr }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.openTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批人" prop="approvalName"> </el-table-column>
      <el-table-column label="审批时间" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.approveTime }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <div
            @click="
              getApprovalDeatail(
                scope.row.type,
                scope.row.id,
                scope.row.applyId
              )
            "
            v-show="scope.row.status === 'REVOCATION'"
            class="wait-pending"
          >
            已撤销
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 退款-补发货-无归属-抽屉 -->
    <el-drawer
      :visible.sync="drawerApproval"
      :destroy-on-close="true"
      size="30%"
      class="drawer-approval-detail"
      :modal="false"
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
              :href="'/music_app/#/details/' + drawerApprovalDeatail.userId"
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
            `${
              drawerApprovalDeatail.receiptName +
              '' +
              drawerApprovalDeatail.receiptTel
            }~~${
              drawerApprovalDeatail.receiptAddressProvince +
              '' +
              drawerApprovalDeatail.receiptAddressCity +
              '' +
              drawerApprovalDeatail.receiptAddressArea +
              '' +
              drawerApprovalDeatail.receiptAddressDetail
            }`
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">订单号:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.outTradeNo
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">课程进度:</el-col>
          <el-col :span="20" :offset="1">
            {{ courseLevelReplace(drawerApprovalDeatail.currentLesson) }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">商品信息:</el-col>
          <el-col :span="20" :offset="1">
            {{ drawerApprovalDeatail.productNames }}
            <span
              v-if="
                drawerApprovalDeatail.mode === 'SINGLE' &&
                (drawerApprovalDeatail.productInfo.includes('体验') ||
                  drawerApprovalDeatail.productInfo.includes('系统'))
              "
            >
              （
              {{
                drawerApprovalDeatail.productInfo.includes('体验')
                  ? '体验课'
                  : '系统课'
              }}
              {{ courseLevelReplace(drawerApprovalDeatail.sup) }}
              {{ drawerApprovalDeatail.level }}
              ）
            </span>
          </el-col>
        </el-row>
        <el-row v-show="+drawerApprovalDeatail.stage !== 0">
          <el-col :span="3">开课期数:</el-col>
          <el-col :span="20" :offset="1">{{
            drawerApprovalDeatail.periodName
          }}</el-col>
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
                v-if="drawerApprovalDeatail.attsUrl"
                style="width: 220px; height: 120px"
                :src="drawerApprovalDeatail.attsUrl"
                fit="contain"
                :preview-src-list="[drawerApprovalDeatail.attsUrl]"
              >
              </el-image>
              <span v-else>未上传</span>
            </div>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="3">附件:</el-col>
          <el-col :span="18" :offset="1">
            <video
              style="width: 220px; height: 120px;"
              :src="drawerApprovalDeatail.attsUrl"
              controls
            ></video>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">状态:</el-col>
          <el-col :span="20" :offset="1">
            {{ drawerApprovalDeatail.status == 'REVOCATION' ? '已撤销' : '-' }}
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
              :href="'/music_app/#/details/' + drawerApprovalDeatail.userId"
              target="_blank"
              >{{ drawerApprovalDeatail.customerPhone }}</el-link
            ></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5">订单号:</el-col>
          <el-col :span="18" :offset="1"
            >{{ drawerApprovalDeatail.outTradeNo
            }}<span style="color: red" v-if="drawerApprovalDeatail.isImport"
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
              {
                0: '优惠券退款',
                1: '课程退款',
                2: '降半年包',
                3: '补偿',
                4: '降1年包',
                5: '降1年半包',
                6: '系统课预付款优惠券退款',
                7: '硬件乐器退款',
                8: '体验课退差价',
              }[drawerApprovalDeatail.refundType]
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">已上课周期:</el-col>
            <el-col :span="18" :offset="1">{{
              `
           ${Math.floor(drawerApprovalDeatail.periodAlready / 4)}月${
                drawerApprovalDeatail.periodAlready % 4
              }周
           `
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">关联订单:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.associatedOrderOutTradeNo &&
              drawerApprovalDeatail.associatedOrderOutTradeNo != 0
                ? `${drawerApprovalDeatail.associatedPackagesName},金额${drawerApprovalDeatail.associatedOrderAmout},订单号${drawerApprovalDeatail.associatedOrderOutTradeNo}`
                : '无关联'
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">关单赠品:</el-col>
            <el-col :span="18" :offset="1">
              <span
                v-if="
                  !(
                    drawerApprovalDeatail.productList &&
                    drawerApprovalDeatail.productList.length
                  )
                "
                >不扣除赠品费用</span
              >
              <el-table
                ref="multipleTable"
                :data="drawerApprovalDeatail.productList"
                border
                tooltip-effect="dark"
                style="width: 50%"
                v-if="
                  drawerApprovalDeatail.productList &&
                  drawerApprovalDeatail.productList.length
                "
              >
                <el-table-column
                  label="赠品信息"
                  prop="name"
                  min-width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column prop="price" label="赠品价格" min-width="120">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row
            v-if="
              drawerApprovalDeatail.deductMonth === 1 ||
              drawerApprovalDeatail.deductMonth === 0
            "
          >
            <el-col :span="5">次月课程:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.deductMonth === 1 ? '保留' : '不保留'
            }}</el-col>
          </el-row>
          <el-row
            v-if="
              drawerApprovalDeatail.deductMaterial === 1 ||
              drawerApprovalDeatail.deductMaterial === 0
            "
          >
            <el-col :span="5">随材盒子:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.deductMaterial === 1
                ? '扣除随材盒子费用'
                : '不扣除随材盒子费用'
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">退款金额:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.refundFee
            }}</el-col>
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
                v-if="drawerApprovalDeatail.attsUrl"
                style="width: 220px; height: 120px;"
                :src="drawerApprovalDeatail.attsUrl"
                fit="contain"
                :preview-src-list="[drawerApprovalDeatail.attsUrl]"
              >
              </el-image>
              <span v-else>未上传</span>
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
              drawerApprovalDeatail.channelName
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">购课时间:</el-col>
            <el-col :span="18" :offset="1">{{
              drawerApprovalDeatail.orderTime
            }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="5">推荐人:</el-col>
            <el-col :span="18" :offset="1"
              ><el-link
                v-if="Number(drawerApprovalDeatail.sendId)"
                type="primary"
                :href="'/music_app/#/details/' + drawerApprovalDeatail.sendId"
                target="_blank"
                >{{
                  (JSON.parse(drawerApprovalDeatail.sendInfo).mobile || '-') +
                  '*' +
                  (JSON.parse(drawerApprovalDeatail.sendInfo).teamName || '-') +
                  '*' +
                  (JSON.parse(drawerApprovalDeatail.sendInfo).departmentName ||
                    '-') +
                  '*' +
                  (JSON.parse(drawerApprovalDeatail.sendInfo).teacherNickname ||
                    '-')
                }}</el-link
              ></el-col
            >
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
      </div>
    </el-drawer>
    <!-- 体验课调级详情抽屉_全托管 -->
    <trialChangeLevel
      ref="trialChangeLevel"
      v-if="currentType === 'ADJUSTMENT_SUP_TRIAL'"
      :forSonDataApprovalPersonId="forSonDataApprovalPersonId"
      :forSonDataApprovalId="forSonDataApprovalId"
    />
    <!-- 赠品审批抽屉 -->
    <ApprovalGiftDetail
      :drawerGiftDeatail="drawerGiftDeatail"
      :drawerGift="drawerGift"
      @close-gift="handleClose"
    />
    <!-- 三调系列+随材打包申请抽屉 -->
    <adjust-drawer
      :is3d="1"
      ref="adjustDrawerCom"
      :adjustDrawerData="adjustDrawerData"
    ></adjust-drawer>
    <m-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :total="+totalElements"
      open="calc(100vw - 195px)"
      close="calc(100vw - 75px)"
    />
  </div>
</template>

<script>
import trialChangeLevel from './trialChangeLevel.vue'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from './groupSell'
import searchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import MPagination from '@/components/MPagination/index.vue'
import { timestamp } from '@/utils/index'
import { courseLevelReplace, SUP_LEVEL_ALL } from '@/utils/supList'
import CheckType from './checkType'
import TabTimeSelect from './timeSearch'
// import SearchPart from './searchPart'
import ActivityName from './activityName'
import adjustDrawer from './adjustDrawer'
import { getStaffInfo } from '../common'
import courseTeam from './courseTeam'
import ApprovalGiftDetail from './approvalGiftDetail'

export default {
  props: ['activeName'],
  components: {
    trialChangeLevel,
    Department,
    GroupSell,
    searchPhone,
    MPagination,
    TabTimeSelect,
    CheckType,
    // SearchPart,
    ActivityName,
    adjustDrawer,
    courseTeam,
    ApprovalGiftDetail,
  },
  watch: {
    activeName(val) {
      if (val === 'forth') {
        this.checkPending(this.params)
      }
    },
    drawerApproval(val) {
      if (!val) {
        this.currentType = ''
      }
    },
  },
  data() {
    return {
      tableHeight: 0,
      forSonDataApprovalPersonId: '',
      forSonDataApprovalId: '',
      checkTypeAssert: '', // 审批类型判断-公用
      SUP_LEVEL_ALL,
      courseLevelReplace,
      zero_time: '', // 0课时绑定值
      isRefund: 0, // 选择退款出现0课时
      params: {}, // 列表的参数
      resetParams: {}, // 撤销的参数
      staffId: '',
      tableData: [],
      current: {},
      drawerGift: false,
      drawerGiftDeatail: {},
      drawerApproval: false,
      drawerApprovalDeatail: {},
      currentPage: 1,
      totalElements: 0,
      // 调期调级调班的drawer数据
      adjustDrawerData: {
        width: '130px',
        loading: false,
      },
      isStaffId: false,
      reasonList: {
        OTHER: '其他',
        DELIVERY_MISS: '发货漏发',
        TRANSPORT_BAD: '运输损坏',
        MULTI_SELF_PAY: '自费补发',
        MULTI_LOSS: '丢件补发',
        MULTI_TIMEOUT_RETURN: '超时退回',
        MULTI_ADJUSTMENT_SUP: '调级补发',
        SINGLE_QUALITY: '产品质量问题',
        SEND_BACK_REPAIR_OR_CHANGE:'寄回维修/换货'
        // SINGLE_PIGMENT_LEAKAGE: '颜料撒漏'
      },
      courseOptions: {
        TESTCOURSE: '体验课',
        SYSTEMCOURSE: '系统课',
        TESTCOURSE_SINGLE: '体验课',
      },
      currentType: '',
    }
  },
  created() {
    const staff = getStaffInfo()
    this.resetParams = staff
    this.staffName = staff.staffName
    this.staffId = staff.staffId
    this.isStaffId = staff.isStaffId
    // Parameters:
    this.params = {
      type: '',
      status: 'REVOCATION',
      staffId: this.staffId,
      isOperation: false,
      startTime: '',
      endTime: '',
      departmentIds: '', // 新添部门
      teacherIds: '', // 新添老师
      page: 1,
      size: 20,
    }
    this.params.isOperation = this.isStaffId ? this.isStaffId : false

    this.checkPending(this.params)
  },
  methods: {
    getSearchData1(val) {
      this.params.page = 1
      this.currentPage = 1
      this.params.departmentIds = val.DepartmentIds
        ? String(val.DepartmentIds)
        : ''
      this.checkPending(this.params)
    },
    getSearchData2(val) {
      this.params.page = 1
      this.currentPage = 1
      this.params.teacherIds = val.groupSell ? String(val.groupSell) : ''
      this.checkPending(this.params)
    },
    // 期数查询
    getTeamId(val) {
      this.params.page = 1
      this.currentPage = 1
      if (val) {
        Object.assign(this.params, {
          managementType: val.managementType,
          period: val.period,
        })
        this.checkPending(this.params)
      } else {
        this.params.managementType = ''
        this.params.period = ''
        this.checkPending(this.params)
      }
    },
    // 审批类型判断
    getcheckType(val) {
      this.checkTypeAssert = val
      // external_0课时退费(显隐)
      if (val === 'REFUND') {
        this.isRefund = 1
      } else {
        this.isRefund = 0
        this.params.isZero = ''
        this.zero_time = ''
        this.params.approvalUserType = ''
      }
      this.params.page = 1
      this.currentPage = 1
      Object.assign(this.params, { type: val })
      this.checkPending(this.params)
    },
    // 查询类型是退款出现的0课时选择
    zeroChange(val) {
      this.params.page = 1
      this.currentPage = 1
      Object.assign(this.params, { isZero: val })
      this.checkPending(this.params)
    },
    //  活动名称搜索
    getActivityName(val) {
      Object.assign(this.params, { abstractContent: val })
      this.params.page = 1
      this.currentPage = 1
      this.checkPending(this.params)
    },
    // 新加手机号
    getPhone(val) {
      Object.assign(this.params, val)
      this.currentPage = 1
      this.params.page = 1
      this.checkPending(this.params)
    },
    // 筛选时间
    getSeacherTime(val) {
      this.params.page = 1
      this.currentPage = 1
      if (val) {
        Object.assign(this.params, {
          startTime: val.ctime.gte,
          endTime: val.ctime.lte,
        })
      } else {
        Object.assign(this.params, {
          startTime: '',
          endTime: '',
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
    // 打开抽屉 传进来3个参数 申请单type 申请单id  申请单申请人id
    getApprovalDeatail(type, id, applyId) {
      this.currentType = type // 全局配置:申请单类型
      // 体验课调级详情
      if (type === 'ADJUSTMENT_SUP_TRIAL') {
        this.forSonDataApprovalId = id
        this.forSonDataApprovalPersonId = applyId
        this.$nextTick(() => {
          this.$refs.trialChangeLevel.isShow = true
        })
      }
      //  补发货详情
      if (type === 'REISSUE') {
        this.$http.Backend.getReplenishDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.ctimeFormdate = timestamp(res.payload.ctime, 2)
            this.drawerApprovalDeatail = res.payload
            // 对传过来的对象做处理
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
      // 赠品
      if (type === 'PROMOTIONS') {
        this.$http.Backend.getGiftDetail(id).then((res) => {
          if (res && res.payload) {
            res.payload.ctime = timestamp(res.payload.ctime, 2)
            this.drawerGiftDeatail = res.payload
            this.drawerGift = true
          }
        })
      }
      // 调期调级调班
      // 以下涉及调调调的部分（到openAdjustDetail方法为止）又和待审批已审批那边儿基本一毛一样，所以为啥最一开始不写成一个组件嘞
      const ADJUST_TYPE = [
        'ADJUSTMENT_CLASS',
        'ADJUSTMENT_STAGE',
        'ADJUSTMENT_SUP',
      ]
      if (ADJUST_TYPE.includes(type)) {
        this.openAdjustDetail(type, id)
      }
      if (type === 'PACKAGE_BOX') {
        this.openPackageDetaild(id)
      }
    },
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
              type: 'Done', // notDone是审批过的
              title: typeText,
              flowApprovalId: payData.flowApprovalId,
              content: [
                {
                  label: '申请人',
                  value: payData.applyUserName,
                },
                {
                  label: '申请人部门',
                  value: payData.applyUserDeapartmentName,
                },
                {
                  label: '用户电话',
                  value: payData.userTel,
                  valueId: payData.userId,
                },
                {
                  label: '订单号',
                  value: payData.outTradeNo,
                },
                {
                  label: '审批类型',
                  value: typeText,
                },
              ],
            })
            // 调期
            if (type === 'ADJUSTMENT_STAGE') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前开课时间',
                    value: payData.currentStartClassDate,
                  },
                  {
                    label: '申请开课时间',
                    value: payData.targetStage,
                  },
                ]
              )
            }
            // 调级
            if (type === 'ADJUSTMENT_SUP') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '已上课周期',
                    value: courseLevelReplace(payData.currentPeriod),
                  },
                  {
                    label: '调级级别',
                    value: SUP_LEVEL_ALL[payData.targetSup] || '-',
                  },
                ]
              )
            }
            // 调班
            if (type === 'ADJUSTMENT_CLASS') {
              this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
                [
                  {
                    label: '当前班级',
                    value: courseLevelReplace(payData.currentClassName),
                  },
                ]
              )
            }
            // 公共数据
            this.adjustDrawerData.content = this.adjustDrawerData.content.concat(
              [
                {
                  label: '选择班级',
                  value: courseLevelReplace(payData.targetClassName),
                },
                {
                  label: '调级理由',
                  value: payData.adjustReason,
                },
                {
                  label: '发起时间',
                  value: timestamp(payData.applyTime, 2),
                },
                {
                  label: '状态',
                  value: '已撤销',
                },
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
    openPackageDetaild(id) {
      this.adjustDrawerData.loading = true
      this.$refs.adjustDrawerCom.handleDrawerOpen()
      this.$http.Approval.getPackageInfo(id)
        .then((res) => {
          this.adjustDrawerData.loading = false
          if (res && res.payload) {
            const payData = res.payload
            Object.assign(this.adjustDrawerData, {
              title: '随材打包申请',
              flowApprovalId: payData.flowApprovalId,
              content: [
                {
                  label: '申请人',
                  value: payData.applyName,
                },
                {
                  label: '申请人部门',
                  value: payData.applyDepartment,
                },
                {
                  label: '用户电话',
                  value: payData.userTel,
                  valueId: payData.userId,
                },
                {
                  label: '订单号',
                  value: payData.outTradeNo,
                },
                {
                  label: '当前物流状态',
                  value: payData.currentExpress,
                },
                {
                  label: '打包数量',
                  value: payData.packageCount,
                },
                {
                  label: '商品信息',
                  type: 'arrayInfo',
                  value: JSON.parse(payData.packageProduct),
                },
                {
                  label: '申请理由',
                  value: payData.applyReason,
                },
              ],
            })
          }
        })
        .catch(() => {
          this.adjustDrawerData.loading = false
          this.$message.error('获取审批详情失败')
        })
    },
    // 关闭审批详情查看
    handleClose() {
      this.drawerApproval = false
      this.drawerGift = false
    },
    // 点击下拉操作
    pullDownList(id, type) {
      if (type === 'REFUND') {
        this.$router.push('/moneyBack')
      }
      if (type === 'REISSUE') {
        this.$router.push('/repair')
      }
      if (type === 'ADJUSTMENT_STAGE') {
        this.$router.push({
          path: '/approval/adjust',
          query: { adjustType: 1 },
        })
      } else if (type === 'ADJUSTMENT_SUP') {
        this.$router.push({
          path: '/approval/adjust',
          query: { adjustType: 2 },
        })
      } else if (type === 'ADJUSTMENT_CLASS') {
        this.$router.push({
          path: '/approval/adjust',
          query: { adjustType: 3 },
        })
      }
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
      this.calcTableHeight()
      this.$http.Backend.checkListPending(params).then((res) => {
        if (res && res.payload && res.payload.content) {
          this.totalElements = res.payload.totalElements
          this.tableData = res.payload.content.map((item) => {
            const zhaiyao = item.abstractContent.split('^')
            item.repiarContent = courseLevelReplace(zhaiyao[0])
            item.period = courseLevelReplace(zhaiyao[1])
            item.receptContent = courseLevelReplace(zhaiyao[2])
            item.reason = courseLevelReplace(zhaiyao[3])
            item.refundTypeStr = courseLevelReplace(zhaiyao[4])
            item.openTime = timestamp(item.ctime, 2)
            item.approveTime = timestamp(item.endTime, 2)
            // item.applyDepartment = ''
            return item
          })
        }
      })
    },
    calcTableHeight() {
      this.$nextTick(() => {
        const tableHeight =
          document.body.clientHeight - this.$refs.tableInner.offsetTop - 160
        this.tableHeight = tableHeight + ''
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .time {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .drawer-approval-detail {
    padding-top: 50px;
    display: flex;
    font-size: 13px;
    flex-direction: column;
  }
  .wait-pending {
    cursor: pointer;
    color: #2a75ed;
  }
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
}
</style>
<style lang="scss">
.el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}
</style>

