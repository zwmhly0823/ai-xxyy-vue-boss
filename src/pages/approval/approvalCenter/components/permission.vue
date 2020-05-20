<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-06 18:31:51
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-18 17:28:24
 -->
<template>
  <div class="container">
    <div class="icon">
      <!-- <div class="moneyback">
        <span class="text">
          财务
        </span>
        <div class="icon-text" @click="goMoneyBack">
          <i class="el-icon-edit-outline"></i>
          <span>
            退款审批
          </span>
        </div>
      </div>
      <div class="replenish">
        <span class="text">物流</span>
        <div class="icon-text" @click="goReplenish">
          <i class="el-icon-data-analysis"></i>
          <span>
            补发货审批
          </span>
        </div>
      </div> -->
      <div class="adjust-box">
        <p class="adjust-title">财务</p>
        <div class="adjust-item" @click="goMoneyBack">
          <i class="el-icon-s-claim"></i>
          <span class="item-text">退款审批</span>
        </div>
        <p class="adjust-title">物流</p>
        <div class="adjust-item" @click="goReplenish">
          <i class="el-icon-s-claim"></i>
          <span class="item-text">补发货审批</span>
        </div>
        <p class="adjust-title">教务</p>
        <div class="adjust-item" @click="jumpAdjustPage(1)">
          <i class="el-icon-s-claim"></i>
          <span class="item-text">调期申请</span>
        </div>
        <div class="adjust-item" @click="jumpAdjustPage(2)">
          <i class="el-icon-s-claim"></i>
          <span class="item-text">调级申请</span>
        </div>
        <div class="adjust-item" @click="jumpAdjustPage(3)">
          <i class="el-icon-s-claim"></i>
          <span class="item-text">调班申请</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goReplenish() {
      this.$router.push('/repair')
    },
    goMoneyBack() {
      this.$router.push({ name: 'moneyBack' })
    },
    jumpAdjustPage(data) {
      this.$router.push({
        path: '/approvalCenter/adjust',
        query: { adjustType: data }
      })
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
      margin-top: 20px;
      padding-left: 25px;
      .adjust-title {
        font-size: 15px;
      }
      .adjust-item {
        display: inline-block;
        width: 135px;
        height: 50px;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin-right: 50px;
        margin-top: 15px;
        cursor: pointer;
        i {
          margin: 4px;
          vertical-align: top;
          background-color: #409eff;
          width: 40px;
          height: 40px;
          font-size: 25px;
          text-align: center;
          line-height: 40px;
          color: #ffffff;
          border-radius: 2px;
        }
        span.item-text {
          line-height: 50px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
