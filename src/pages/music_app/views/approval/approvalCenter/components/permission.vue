<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-06 18:31:51
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-01 15:58:43
 -->
<template>
  <div class="container">
    <div class="icon">
      <div class="adjust-box">
        <div class="adjust-box-row">
          <p class="adjust-title">财务</p>
          <div class="adjust-item" @click="goMoneyBack">
            <i class="el-icon-warning-outline color-1"></i>
            <span class="item-text">退款审批</span>
          </div>
        </div>
        <div class="adjust-box-row">
          <p class="adjust-title">物流</p>
          <div class="adjust-item" @click="goReplenish">
            <i class="el-icon-truck color-2"></i>
            <span class="item-text">补发货审批</span>
          </div>
          <div class="adjust-item" @click="mergeBoxes" v-if="showMergeBoxes">
            <i class="el-icon-truck color-2"></i>
            <span class="item-text">随材打包</span>
          </div>
        </div>
        <div class="adjust-box-row">
          <p class="adjust-title">教务</p>
          <div class="adjust-item" @click="jumpAdjustPage(1)">
            <i class="el-icon-s-claim color-3"></i>
            <span class="item-text">调期申请</span>
          </div>
          <div v-if="false"  class="adjust-item" @click="jumpAdjustPage(2)">
            <i class="el-icon-s-claim color-3"></i>
            <span class="item-text">调级申请</span>
          </div>
          <div class="adjust-item" @click="jumpAdjustPage(3)">
            <i class="el-icon-s-claim color-3"></i>
            <span class="item-text">调班申请</span>
          </div>
          <div class="adjust-item" @click="goApprovalGift">
            <i class="el-icon-present color-1"></i>
            <span class="item-text">赠品申请</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMergeBoxes: false,
      // 赠品审批权限人 469897200621719552（申爽）;455930591481827328（刘彩屏）;492806900967149568（小雪小美女）；459001293009195008（魏文秀）
      // bearboss 470676591924613120
      giftPermission: [
        '469897200621719552',
        '455930591481827328',
        '492806900967149568',
        '459001293009195008',
        '470676591924613120'
      ],
      staffId: ''
    }
  },
  computed: {
    showGift() {
      return this.giftPermission.includes(this.staffId)
    }
  },
  created() {
    // 随材打包只对特定人员可见
    const userinfo = JSON.parse(localStorage.getItem('staff'))
    const passUser = [
      '15210892350',
      '17610067673',
      '18515545600',
      '18202647739',
      '17767267870'
    ]
    if (passUser.includes(userinfo.mobile)) {
      this.showMergeBoxes = true
    }
    this.staffId = userinfo.id
  },
  methods: {
    goReplenish() {
      this.$router.push('/repair')
    },
    goMoneyBack() {
      this.$router.push({ name: 'moneyBack' })
    },
    jumpAdjustPage(data) {
      this.$router.push({
        path: '/approval/adjust',
        query: { adjustType: data }
      })
    },
    goApprovalGift() {
      this.$router.push('/approvalGift')
    },
    // 随材打包
    mergeBoxes() {
      this.$router.push('/approval/mergeboxes')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .icon {
    display: flex;
    flex-direction: column;
    .moneyback {
      padding: 25px;
      // display: flex;
      .text {
        font-weight: bold;
        font-size: 30px;
        margin-top: 25px;
      }
      .icon-text {
        cursor: pointer;
        padding: 20px;
        width: 240px;
        background-color: #ddd;
        margin-top: 50px;
        margin-left: 40px;
        font-size: 30px;
      }
    }
    .replenish {
      padding: 25px;
      // display: flex;
      .text {
        font-weight: bold;
        font-size: 30px;
        margin-top: 25px;
      }
      .icon-text {
        cursor: pointer;
        padding: 20px;
        width: 240px;
        background-color: #ddd;
        margin-top: 50px;
        margin-left: 40px;
        font-size: 30px;
      }
    }
    .adjust-box {
      padding-top: 40px;
      padding-left: 25px;
      .adjust-box-row {
        margin-bottom: 40px;
        .adjust-title {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .adjust-item {
          display: inline-block;
          width: 160px;
          height: 50px;
          border: 1px solid #ccc;
          border-radius: 3px;
          margin-right: 50px;
          cursor: pointer;
          i {
            vertical-align: top;
            background-color: #2a75ed;
            width: 48px;
            height: 48px;
            font-size: 22px;
            text-align: center;
            line-height: 48px;
            color: #ffffff;
            border-radius: 2px;
          }
          span.item-text {
            line-height: 50px;
            margin-left: 20px;
          }
          .color-1 {
            background-color: #f56c6c;
          }
          .color-2 {
            background-color: #303133;
          }
          .color-3 {
            background-color: #2a75ed;
          }
        }
      }
    }
  }
}
</style>
