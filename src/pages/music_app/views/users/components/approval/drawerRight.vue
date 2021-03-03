<template>
  <div class="main_content">
    <el-drawer :visible.sync="drawer" :direction="direction" size="40%">
      <template v-slot:title>
        <h2 v-if="currentType !== '5'">
          {{ drawerApprovalDeatail.addressId ? '补发货审批' : '退款审批' }}
        </h2>
        <h2 v-else>
          {{ '无归属订单审批' }}
        </h2>
      </template>
      <div :class="$style.main_content_height">
        <!-- 1-1补发货全套 -->
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
            <el-col :span="20" :offset="1">
              {{ drawerApprovalDeatail.userTel }}
              <!-- <el-link
                type="primary"
                :href="'/music_app/#/details/' + drawerApprovalDeatail.userId"
                target="_blank"
                >{{ drawerApprovalDeatail.userTel }}</el-link
              > -->
            </el-col>
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
            <el-col :span="3">课程进度:</el-col>
            <el-col :span="20" :offset="1">
              {{ formatTeamNameSup(drawerApprovalDeatail.currentLesson) }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">商品信息:</el-col>
            <el-col :span="20" :offset="1">
              {{ drawerApprovalDeatail.productNames }}
              <span
                v-for="item of drawerApprovalDeatail.productdetails"
                :key="item.id"
                >{{ `${item.name}(${item.count})` }}</span
              >
              <span
                v-if="
                  drawerApprovalDeatail.mode === 'SINGLE' &&
                    (drawerApprovalDeatail.productInfo.includes('体验') ||
                      drawerApprovalDeatail.productInfo.includes('系统'))
                "
              >
                【
                {{
                  drawerApprovalDeatail.productInfo.includes('体验')
                    ? '体验课'
                    : '系统课'
                }}
                {{ formatTeamNameSup(drawerApprovalDeatail.sup) }}
                {{ drawerApprovalDeatail.level }}
                】
              </span>
              <!-- <mark
                v-if="
                  drawerApprovalDeatail.productdetails &&
                    drawerApprovalDeatail.productdetails.length
                "
                @click="dialogFormVisibleCount = true"
                >修改数量</mark
              > -->
            </el-col>
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
                (drawerApprovalDeatail.type === 'EXPERIENCE_MATERIALS' ||
                  drawerApprovalDeatail.type === 'SYSTEM_MATERIALS')
            "
          >
            <!-- <el-col :span="3">版本信息:</el-col>
            <el-col :span="20" :offset="1">
              <VersionBox @result="getVersion" name="version" />
            </el-col> -->
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
              {{ formatData(drawerApprovalDeatail.ctime, 's') }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">状态:</el-col>
            <el-col
              v-if="drawerApprovalDeatail.status == 'PENDING'"
              :span="20"
              :offset="1"
            >
              待审批
            </el-col>
            <el-col
              v-else-if="drawerApprovalDeatail.status == 'COMPLETED'"
              :span="20"
              :offset="1"
            >
              审批通过
            </el-col>
            <el-col
              v-else-if="drawerApprovalDeatail.status == 'DECLINE'"
              :span="20"
              :offset="1"
            >
              审批驳回
            </el-col>
            <el-col
              v-else-if="drawerApprovalDeatail.status == 'REVOCATION'"
              :span="20"
              :offset="1"
            >
              已撤销
            </el-col>
            <el-col v-else :span="20" :offset="1">
              -
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
                <span
                  v-if="
                    drawerApprovalDeatail.attsUrl &&
                      drawerApprovalDeatail.attsUrl.split(',').length
                  "
                >
                  <el-image
                    v-for="(item, index) of drawerApprovalDeatail.attsUrl.split(
                      ','
                    )"
                    :key="index"
                    style="width: 120px; height: 120px;padding:3px"
                    :src="item"
                    fit="contain"
                    :preview-src-list="[item]"
                  >
                  </el-image>
                </span>
                <span v-else>未上传</span>
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
          <!-- <el-row class="BOTTOM" v-if="isStaffId">
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
          </el-row> -->
        </div>
        <!-- 1-2退款和无归属全套 -->
        <div v-else class="approvallk">
          <!-- 1-2-1退款无归属共有展示项 -->
          <el-row>
            <el-col :offset="1" :span="23"><h3>审批详情</h3></el-col>
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
          <!-- 1-2-2退款特有展示项 -->
          <div v-if="currentType !== '5'">
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
                {
                  0: '优惠券退款',
                  1: '课程退款',
                  2: '降半年包',
                  3: '补偿',
                  4: '降1年包',
                  5: '降1年半包'
                }[drawerApprovalDeatail.refundType]
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
                  <el-table-column
                    prop="price"
                    label="赠品价格"
                    min-width="120"
                  >
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
            <el-row :class="$style.align_items">
              <el-col :span="5">退款金额:</el-col>
              <el-col :span="4" :offset="1">{{
                drawerApprovalDeatail.refundFee
              }}</el-col>
              <!-- <el-col v-if="isStaffId" :span="13" :offset="1">
                <mark @click="dialogFormVisible = true">修改金额</mark>
              </el-col> -->
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
          </div>
          <!-- 1-2-3无归属特有展示项 -->
          <div v-if="currentType === '5'">
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
                      (JSON.parse(drawerApprovalDeatail.sendInfo).teamName ||
                        '-') +
                      '*' +
                      (JSON.parse(drawerApprovalDeatail.sendInfo)
                        .departmentName || '-') +
                      '*' +
                      (JSON.parse(drawerApprovalDeatail.sendInfo)
                        .teacherNickname || '-')
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
          <!-- 1-2-4退款操作按钮 -->
          <!-- 1-2-5无归属操作按钮 只有测试:bearboss;线上:只有张奔,杨阳,刘彩屏有权限-->
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { formatData } from '@/utils/index'
import { getStaffInfo } from '../../common'
import { formatTeamNameSup, SUP_LEVEL_UPPER } from '@/utils/supList'
// import VersionBox from '@/components/MSearch/searchItems/moreVersionBox'
export default {
  name: 'drawerRight',
  components: {},
  props: ['drawerApprovalDeatails'],
  data() {
    return {
      isStaffId: false,
      tableDataNode: [],
      drawerApprovalDeatail: {
        addressId: false
      },
      formatData,
      reasonList: {
        OTHER: '其他',
        DELIVERY_MISS: '发货漏发',
        TRANSPORT_BAD: '运输损坏',
        MULTI_SELF_PAY: '自费补发',
        MULTI_LOSS: '丢件补发',
        MULTI_TIMEOUT_RETURN: '超时退回',
        MULTI_ADJUSTMENT_SUP: '调级补发',
        SINGLE_QUALITY: '产品质量问题',
        SINGLE_PIGMENT_LEAKAGE: '颜料撒漏'
      },
      SUP_LEVEL_UPPER,
      formatTeamNameSup,
      currentType: '',
      drawer: false,
      diologRefundTag: '', // 退款审批抽屉专用的tag类型
      diologRefundTagId: '', // 退款审批抽屉专用的tag类型修改所传id
      direction: 'rtl'
    }
  },
  watch: {
    drawerApprovalDeatails(val) {
      console.log(val, '我是左侧弹出数据')
      if (val.typeName === '1') {
        val.payload.addressId = true
      } else {
        val.payload.addressId = false
      }
      this.drawerApprovalDeatail = val && val.payload
      this.currentType = val.typeName
      this.diologRefundTag = val.tag
      this.diologRefundTagId = val.id
      this.$http.RefundApproval.getFlowDetailNodeTable(val.id).then(
        ({ code, payload }) => {
          if (!code) {
            this.tableDataNode = payload
          }
        }
      )
    }
  },
  mounted() {
    const staff = getStaffInfo()
    this.staffId = staff.staffId
    this.isStaffId = staff.isStaffId
  },
  methods: {
    // 获取版本盒子
    getVersion(val) {
      this.version = val.version
    },
    // 时间戳转换
    formatDate(time, flag = 's') {
      return formatData(time, flag)
    },
    // 查看
    handleApprovalSee() {
      this.drawer = !this.drawer
    },
    // 退款抽屉里的标签类型更改
    diologRefundTagChange(val) {
      this.$http.Approval.diologRefundTagChange({
        id: this.diologRefundTagId,
        tag: this.diologRefundTag
      }).then(({ code }) => {
        !code && this.$message.success('标签类型修改成功')
      })
    },
    // 同意申请
    ensureReplenish() {
      const version = typeof this.version !== 'string'
      const versionBool =
        this.isStaffId &&
        this.drawerApprovalDeatail.mode === 'DEFAULT' &&
        (this.drawerApprovalDeatail.type === 'EXPERIENCE_MATERIALS' ||
          this.drawerApprovalDeatail.type === 'SYSTEM_MATERIALS')
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
        inputValue: '同意',
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
              if (!res.code) {
                this.checkPending(this.params)
                this.drawerApproval = false
                this.$root.$emit('lk', '')
                this.$message({
                  message: '同意审核通过',
                  type: 'success'
                })
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
    }
  }
}
</script>
<style lang="scss" module>
.main_content_height {
  overflow-y: auto !important;
  height: 75vh !important;
  padding: 0 20px;
}
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
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
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
