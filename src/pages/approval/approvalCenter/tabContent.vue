<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-27 00:10:22
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-12 19:16:04
 -->
<template>
  <div class="container">
    <div class="tab-title">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="发起审批" name="first">
          <permission />
        </el-tab-pane>

        <el-tab-pane label="待审批" name="second">
          <approval-pending
            :activeName="activeName"
            @result="res"
            @approvalDone="approvalDone"
          ></approval-pending>
        </el-tab-pane>
        <el-tab-pane label="已审批" name="third">
          <ApprovalCompleted @result="res" :activeName="activeName" />
        </el-tab-pane>
        <el-tab-pane label="已撤销" name="forth">
          <ApprovalRevocation @result="res" :activeName="activeName" />
        </el-tab-pane>
        <el-tab-pane label="财务拒绝" name="fifth">
          <account-rejected ref="accountRejected"></account-rejected>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ApprovalPending from './components/approvalPending'
import ApprovalCompleted from './components/approvalCompleted'
import ApprovalRevocation from './components/approvalRevocation'

import permission from './components/permission'
import accountRejected from './components/accountRejected'
export default {
  components: {
    permission,
    ApprovalPending,
    ApprovalRevocation,
    ApprovalCompleted,
    accountRejected
  },
  created() {
    this.getRouterData()
  },
  data() {
    return {
      activeName: 'first',
      drawNewReapir: false,
      loading: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      timer: null
    }
  },
  methods: {
    res(val) {
      this.activeName = val
    },
    getRouterData() {
      this.activeName = this.$route.params.activeApprove || 'first'
      console.log(this.activeName, 'this.activeName')
    },
    handleClick(tab, event) {
      // console.log(tab, event)
      if (tab.index - 0 === 4) {
        this.$refs.accountRejected.initListData()
      }
    },
    handleReplenishment() {
      // this.drawNewReapir = true
      this.$router.push('/repair')
    },
    approvalDone() {
      this.activeName = 'third'
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  padding-bottom: 50px;
  height: calc(100vh - 120px);
  overflow: auto;
  background-color: #fff;
}
</style>
