<!--
 * @Descripttion: 
 * @version: 
 * @Author: Shasen
 * @Date: 2020-08-05 17:47:58
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-01 15:45:34
 -->
<template>
  <el-drawer
    :visible.sync="drawerGift"
    :destroy-on-close="true"
    size="35%"
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
      <!-- 
        452845563730333696  张丹丹
        455930731630301184  张奔
        468157824866848768  宋瑨
        481157576520765440  何文恺
        488022954492432384  王亚南
        492806900967149568  小雪小美女
        469897200621719552  申爽
        480811548877656064  刘宝
        490293972040814592  曹华
        455930591481827328  刘彩屏
        469159895246180352  张璟辉
       -->
      <el-row
        class="BOTTOM"
        v-if="
          drawerGiftDeatail.status === 'PENDING' &&
            (staffId === '470676591924613120' ||
              staffId === '452845563730333696' ||
              staffId === '455930731630301184' ||
              staffId === '468157824866848768' ||
              staffId === '481157576520765440' ||
              staffId === '488022954492432384' ||
              staffId === '492806900967149568' ||
              staffId === '469897200621719552' ||
              staffId === '480811548877656064' ||
              staffId === '455930591481827328' ||
              staffId === '469159895246180352' ||
              staffId === '490293972040814592')
        "
      >
        <el-col :span="20" :offset="1" style="margin-top: 40px">
          <el-button type="button" size="mini" @click="refuseDialog"
            >拒 绝</el-button
          >
          <el-button type="primary" size="mini" @click="ensureReplenish"
            >同 意</el-button
          >
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

<style lang="scss" scoped>
.approvallk {
  ::v-deep {
    .el-row {
      margin-bottom: 10px;
      font-size: 12px;
    }
  }
}
</style>
