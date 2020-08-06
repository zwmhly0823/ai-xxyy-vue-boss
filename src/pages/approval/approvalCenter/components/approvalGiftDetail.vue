<!--
 * @Descripttion: 
 * @version: 
 * @Author: Shasen
 * @Date: 2020-08-05 17:47:58
 * @LastEditors: Shasen
 * @LastEditTime: 2020-08-08 14:31:27
 -->
<template>
  <el-drawer
    :visible.sync="drawerGift"
    :destroy-on-close="true"
    size="50%"
    class="drawer-approval-detail"
    :before-close="handleClose"
    :modal="false"
  >
    <template v-slot:title>
      <h2>赠品审批</h2>
    </template>
    <div class="approvallk">
      <el-row>
        <el-col :span="5">申请人:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.applyUserName
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">申请部门:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.applyUserDeapartmentName
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">活动名称:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.promotionsName
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">用户电话:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.receiptTel
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">订单信息:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.outTradeNo
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">赠品信息:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.giftsName
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">物流单数量:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.expressCount
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">收货信息:</el-col>
        <el-col :span="18" :offset="1"
          >{{ drawerGiftDeatail.receiptAddressProvince
          }}{{ drawerGiftDeatail.receiptAddressCity
          }}{{ drawerGiftDeatail.receiptAddressArea
          }}{{ drawerGiftDeatail.receiptAddressStreet
          }}{{ drawerGiftDeatail.receiptAddressDetail }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">发起时间:</el-col>
        <el-col :span="18" :offset="1">{{ drawerGiftDeatail.ctime }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">备注:</el-col>
        <el-col :span="18" :offset="1">{{
          drawerGiftDeatail.promotionsMsg
        }}</el-col>
      </el-row>
      <el-row
        class="BOTTOM"
        v-if="
          drawerGiftDeatail.status === 'PENDING' &&
            staffId === '470676591924613120'
        "
      >
        <el-col :span="20" :offset="1">
          <el-button type="button" @click="refuseDialog">拒 绝</el-button>
          <el-button type="button" @click="ensureReplenish">同 意</el-button>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    drawerGiftDeatail: {
      type: Object,
      default: () => {}
    },
    drawerGift: {
      type: Boolean,
      default: false
    },
    staffId: {
      type: String,
      default: ''
    },
    staffName: {
      type: String,
      default: ''
    },
    params_pending: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    console.log(this.params_pending, 'params_pending')
  },
  data() {
    return {}
  },
  methods: {
    handleClose() {
      this.$emit('close-gift')
    },
    // 同意
    ensureReplenish() {
      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '内容不能为空'
      })
        .then(({ value }) => {
          const params = {
            approvalRemark: value,
            flowApprovalId: this.drawerGiftDeatail.flowApprovalId,
            isConfirm: true,
            version: '',
            staffId: this.staffId,
            staffName: this.staffName
          }
          console.log(params)
          console.log(this.params_pending, 'params_pending')
          this.$http.Backend.isAggrePass(params)
            .then((res) => {
              if (res && res.payload) {
                this.$emit('close-gift')
                this.$emit('check-pending', this.params_pending)
                this.$message({
                  message: '同意审核通过',
                  type: 'success'
                })
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
    // 拒绝
    refuseDialog() {
      this.$emit('refuse-dialog')
    }
  }
}
</script>

<style lang="scss" scoped></style>
