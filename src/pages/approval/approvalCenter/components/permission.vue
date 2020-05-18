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
      <div class="moneyback">
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
  }
}
</style>
